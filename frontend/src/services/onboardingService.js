import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/onboarding';
const DEFAULT_USER_ID = 'd2af0e65-c7d3-4e42-a2ee-8406f6648ef6';

// Coordination promises to prevent race conditions in Promise.all
let savePromise = null;
let completePromise = null;

// Helper to translate frontend camelCase keys to backend snake_case and format the dictionaries
function translatePayload(data) {
  const userId = localStorage.getItem('user_id') || DEFAULT_USER_ID;
  
  // Format life_context
  const life_context = {
    occupation: data.lifeContext?.occupation || '',
    age: data.lifeContext?.age ? parseInt(data.lifeContext.age) : 21,
    routine: data.lifeContext?.routine || ''
  };

  // Format emotion_data
  const positive = ['motivated', 'calm', 'happy', 'excited', 'focused'];
  const negative = ['anxious', 'sad', 'overwhelmed', 'tired', 'frustrated', 'stressed', 'angry'];
  let moodOffset = 0;
  (data.emotionData?.feelings || []).forEach(f => {
    if (positive.includes(f)) moodOffset += 1;
    if (negative.includes(f)) moodOffset -= 1;
  });
  const mood_score = Math.max(1, Math.min(10, 5 + moodOffset));
  const emotion_data = {
    feelings: data.emotionData?.feelings || [],
    triggers: data.emotionData?.triggers || [],
    mood_score: mood_score
  };

  // Format wellbeing_drivers
  const wellbeing_drivers = {
    drivers: data.wellbeingDrivers || []
  };

  // Format stress_data
  const sd = data.stressData || {};
  const stressSum = (sd.mentallyExhausted || 3) + 
                    (sd.struggleToFocus || 3) + 
                    (sd.overwhelmed || 3) + 
                    (6 - (sd.wakeUpRefreshed || 3)) + 
                    (6 - (sd.timeToRecover || 3)) + 
                    (sd.emotionallyDrained || 3) + 
                    (sd.difficultToDisconnect || 3) + 
                    (6 - (sd.motivatedToStart || 3)) + 
                    (sd.rushedOrBehind || 3);
  const stress_level = Math.max(1, Math.min(10, Math.round(((stressSum - 9) / 36) * 9 + 1)));
  const stress_data = {
    ...sd,
    stress_level: stress_level
  };

  // Format body_data
  const sleepStr = data.bodyData?.sleep || '';
  let sleep_hours = 7;
  if (sleepStr.includes('8+')) sleep_hours = 8.5;
  else if (sleepStr.includes('7-8')) sleep_hours = 7.5;
  else if (sleepStr.includes('6-7')) sleep_hours = 6.5;
  else if (sleepStr.includes('5-6')) sleep_hours = 5.5;
  else if (sleepStr.includes('<5')) sleep_hours = 4.5;
  
  const body_data = {
    ...data.bodyData,
    sleep_hours: sleep_hours
  };

  // Format productive_window
  const productive_window = data.productiveWindow || 'morning';

  // Format lifestyle_data
  const ld = data.lifestyleData || {};
  const prodSum = (6 - (ld.procrastinate || 3)) + 
                  (ld.focused || 3) + 
                  (ld.habits || 3) + 
                  (ld.timeManagement || 3) + 
                  (ld.balance || 3);
  const productivity_score = Math.max(1, Math.min(10, Math.round(((prodSum - 5) / 20) * 9 + 1)));
  const lifestyle_data = {
    ...ld,
    productivity_score: productivity_score
  };

  return {
    user_id: userId,
    life_context,
    emotion_data,
    wellbeing_drivers,
    stress_data,
    body_data,
    productive_window,
    lifestyle_data,
    balance_wheel: data.balanceWheel || {},
    goals: data.goals || {}
  };
}

export const onboardingService = {
  /**
   * Submits the gathered onboarding data to the API server as a draft.
   */
  submitOnboarding: async (data) => {
    // Reset coordination states for a new submit run
    savePromise = null;
    completePromise = null;

    savePromise = (async () => {
      const payload = translatePayload(data);
      const response = await axios.post(`${BASE_URL}/save`, payload);
      return response.data;
    })();

    return savePromise;
  },

  /**
   * Processes responses to output personalized scores, insights, risk metrics, and coaching text.
   */
  generateProfile: async (data) => {
    // Ensure save step has completed first
    if (!savePromise) {
      savePromise = (async () => {
        const payload = translatePayload(data);
        const response = await axios.post(`${BASE_URL}/save`, payload);
        return response.data;
      })();
    }
    await savePromise;

    completePromise = (async () => {
      const userId = localStorage.getItem('user_id') || DEFAULT_USER_ID;
      const response = await axios.post(`${BASE_URL}/complete/${userId}`);
      
      const analysisList = response.data.analysis;
      const analysis = (analysisList && analysisList.length > 0) ? analysisList[0] : {};

      // Transform backend response back to the frontend presentation schema
      return {
        mindScore: analysis.mind_score || 50,
        bodyScore: analysis.body_score || 50,
        lifestyleScore: analysis.lifestyle_score || 50,
        overallScore: analysis.overall_score || 50,
        burnoutRisk: (analysis.burnout_risk || "Low").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
        coachSummary: analysis.coach_summary || "Your onboarding analysis is completed.",
        strengths: analysis.strengths || ["Motivated"],
        risks: analysis.risks || ["Stress Management"],
        focusAreas: analysis.focus_areas || ["Sleep", "Consistency"],
        productiveWindow: data.productiveWindow || "morning",
        primaryGoal: data.goals?.primaryGoal || "reduce_stress"
      };
    })();

    return completePromise;
  },

  /**
   * Creates a personalized schedule based on onboarding profile.
   */
  generateAIPlan: async (data) => {
    // Ensure save and complete steps have completed first to establish the profile
    if (!savePromise) {
      savePromise = (async () => {
        const payload = translatePayload(data);
        const response = await axios.post(`${BASE_URL}/save`, payload);
        return response.data;
      })();
    }
    await savePromise;

    if (!completePromise) {
      completePromise = (async () => {
        const userId = localStorage.getItem('user_id') || DEFAULT_USER_ID;
        const response = await axios.post(`${BASE_URL}/complete/${userId}`);
        const analysisList = response.data.analysis;
        return (analysisList && analysisList.length > 0) ? analysisList[0] : {};
      })();
    }
    await completePromise;

    const userId = localStorage.getItem('user_id') || DEFAULT_USER_ID;
    const response = await axios.post(`${BASE_URL}/generate-plan/${userId}`);
    
    const planList = response.data.plan;
    const plan = (planList && planList.length > 0) ? planList[0] : {};

    // Transform backend schedule tasks to frontend visual structures
    const backendSchedule = plan.schedule || [];
    
    // Group tasks by period matching the frontend template expectation
    const periods = {
      "Morning": { time: "06:00 AM - 12:00 PM", items: [] },
      "Afternoon": { time: "12:00 PM - 05:00 PM", items: [] },
      "Evening": { time: "05:00 PM - 09:00 PM", items: [] },
      "Night": { time: "09:00 PM - Wake", items: [] }
    };

    backendSchedule.forEach(task => {
      // Determine period based on task time
      const timeStr = task.time || "09:00";
      const hour = parseInt(timeStr.split(':')[0]);
      
      let periodName = "Afternoon";
      if (hour < 12) periodName = "Morning";
      else if (hour < 17) periodName = "Afternoon";
      else if (hour < 21) periodName = "Evening";
      else periodName = "Night";

      // Format time to 12-hour AM/PM
      let formattedTime = "09:00 AM";
      try {
        const parts = timeStr.split(':');
        const h = parseInt(parts[0]);
        const m = parts[1] || "00";
        const suffix = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        formattedTime = `${h12.toString().padStart(2, '0')}:${m} ${suffix}`;
      } catch (e) {
        formattedTime = timeStr;
      }

      periods[periodName].items.push({
        time: formattedTime,
        label: task.task,
        type: task.category ? task.category.toLowerCase() : "work"
      });
    });

    // Construct final visual schedule array
    const scheduleArray = Object.keys(periods).map(period => ({
      period,
      time: periods[period].time,
      items: periods[period].items
    }));

    return {
      wakeTime: plan.wake_time || "06:00 AM",
      sleepTarget: plan.sleep_target || "10:00 PM",
      schedule: scheduleArray
    };
  }
};
