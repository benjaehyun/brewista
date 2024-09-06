import React from 'react';
import { BrewStepProvider } from './BrewStepContext';
import NavigationControls from './NavigationControls';
import TimerDisplay from './TimerDisplay';
import StepInstructions from './StepInstructions';
import StepProgressBar from './StepProgressBar';

export default function BrewSteps({ step, onNextStep, onPreviousStep, stepsToUse, currentStepIndex, autoStartTimer, autoNextStep }) {
  return (
    <BrewStepProvider 
      currentStep={step} 
      onNextStep={onNextStep}
      onPreviousStep={onPreviousStep}
      stepsToUse={stepsToUse}
      currentStepIndex={currentStepIndex}
      autoStartTimer={autoStartTimer}
      autoNextStep={autoNextStep}
    >
      <div className="flex flex-col h-full">
        <StepProgressBar />
        <div className="flex-grow flex flex-col justify-center">
          <TimerDisplay />
          <StepInstructions />
        </div>
        <NavigationControls />
      </div>
    </BrewStepProvider>
  );
}