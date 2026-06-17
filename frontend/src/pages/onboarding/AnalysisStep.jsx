import React, { useEffect } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { onboardingService } from '../../services/onboardingService';
import LoadingAnalysis from '../../components/onboarding/LoadingAnalysis';

export default function AnalysisStep({ onNext }) {
  
  const storeState = useOnboardingStore();
  const { setResults, setAIPlan } = storeState;

  useEffect(() => {
    let active = true;

    const processOnboarding = async () => {
      try {
        console.log('🚀 Starting onboarding analysis...');

        const payload = {
          lifeContext: storeState.lifeContext,
          emotionData: storeState.emotionData,
          wellbeingDrivers: storeState.wellbeingDrivers,
          stressData: storeState.stressData,
          bodyData: storeState.bodyData,
          productiveWindow: storeState.productiveWindow,
          lifestyleData: storeState.lifestyleData,
          balanceWheel: storeState.balanceWheel,
          goals: storeState.goals,
        };

        const startTime = Date.now();

        // Generate profile first
        const resultsResponse =
          await onboardingService.generateProfile(payload);

        console.log('✅ Profile generated:', resultsResponse);

        // Generate AI plan second
        const aiPlanResponse =
          await onboardingService.generateAIPlan(payload);

        console.log('✅ AI Plan generated:', aiPlanResponse);

        // Ensure analysis animation shows for at least 3 seconds
        const elapsedTime = Date.now() - startTime;

        if (elapsedTime < 3000) {
          await new Promise((resolve) =>
            setTimeout(resolve, 3000 - elapsedTime)
          );
        }

        if (active) {
          setResults(resultsResponse);
          setAIPlan(aiPlanResponse);

          console.log('✅ Results stored in Zustand');
          console.log('➡️ Moving to Results Step');

          onNext();
        }
      } catch (err) {
        console.error(
          '❌ Error generating onboarding analysis:',
          err
        );

        // Prevent infinite loading
        if (active) {
          onNext();
        }
      }
    };

    processOnboarding();

    return () => {
      active = false;
    };
  }, [onNext, setResults, setAIPlan]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <LoadingAnalysis />
    </div>
  );
}