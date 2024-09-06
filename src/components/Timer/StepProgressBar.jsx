import React from 'react';
import { useBrewStep } from './BrewStepContext';

export default function StepProgressBar() {
  const { stepsToUse, currentStepIndex } = useBrewStep();

  return (
    <div className="flex justify-center overflow-x-auto py-2 bg-gray-100">
      <div className="flex">
        {stepsToUse.map((step, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-16 h-2 mx-1 rounded-full ${
              index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}