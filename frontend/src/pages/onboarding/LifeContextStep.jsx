import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { LIFE_CONTEXT_QUESTIONS } from '../../utils/onboardingQuestions';
import QuestionCard from '../../components/onboarding/QuestionCard';
import OptionCard from '../../components/onboarding/OptionCard';
import NavigationButtons from '../../components/onboarding/NavigationButtons';

export default function LifeContextStep({ onNext, onBack }) {
  const { lifeContext, updateLifeContext } = useOnboardingStore();
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!lifeContext.occupation || !lifeContext.age || !lifeContext.routine) {
      setError('Please fill in all sections to proceed.');
      return;
    }
    const ageVal = parseInt(lifeContext.age, 10);
    if (isNaN(ageVal) || ageVal < 18 || ageVal > 120) {
      setError('Please enter a valid age between 18 and 120.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-fadeIn">
      {/* 1. Occupation Selection */}
      <QuestionCard
        title={LIFE_CONTEXT_QUESTIONS.occupation.question}
        subtitle="This helps us adjust our insights to match your professional or academic pace."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LIFE_CONTEXT_QUESTIONS.occupation.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              desc={opt.desc}
              isSelected={lifeContext.occupation === opt.id}
              onSelect={(id) => {
                setError('');
                updateLifeContext({ occupation: id });
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <div className="border-t border-gray-100 my-6" />

      {/* 2. Age Input (Numeric) */}
      <QuestionCard
        title="What is your age?"
        subtitle="Age factors into default recovery speed and sleep metrics."
      >
        <div className="w-full max-w-xs relative rounded-xl shadow-sm">
          <input
            type="number"
            value={lifeContext.age}
            onChange={(e) => {
              setError('');
              const val = e.target.value;
              updateLifeContext({ age: val !== '' ? parseInt(val, 10) : '' });
            }}
            min="18"
            max="120"
            placeholder="e.g. 28"
            className="w-full px-4 py-3.5 pr-24 border border-gray-200 rounded-xl focus:border-primary-purple focus:ring-1 focus:ring-primary-purple outline-none transition-all duration-200 text-text-primary text-base font-semibold shadow-sm hover:border-gray-300"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-secondary text-sm font-medium">
            years old
          </div>
        </div>
      </QuestionCard>

      <div className="border-t border-gray-100 my-6" />

      {/* 3. Daily Routine Selection */}
      <QuestionCard
        title={LIFE_CONTEXT_QUESTIONS.dailyRoutine.question}
        subtitle="This outlines your baseline physical posture and screen exposure."
        error={error}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LIFE_CONTEXT_QUESTIONS.dailyRoutine.options.map((opt) => (
            <OptionCard
              key={opt.id}
              id={opt.id}
              label={opt.label}
              desc={opt.desc}
              isSelected={lifeContext.routine === opt.id}
              onSelect={(id) => {
                setError('');
                updateLifeContext({ routine: id });
              }}
            />
          ))}
        </div>
      </QuestionCard>

      <NavigationButtons
        onNext={handleNext}
        onBack={onBack}
        isNextDisabled={!lifeContext.occupation || !lifeContext.age || !lifeContext.routine}
      />
    </div>
  );
}
