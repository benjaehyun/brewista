import React from 'react';
import { BrewStepProvider } from './BrewStepContext';
import NavigationControls from './NavigationControls';
import TimerDisplay from './TimerDisplay';
import StepInstructions from './StepInstructions';
import StepProgressBar from './StepProgressBar';

export default function BrewSteps({ step, onNextStep, onPreviousStep, stepsToUse, currentStepIndex, autoStartTimer, autoNextStep, onSetStep }) {
  return (
    <BrewStepProvider 
      currentStep={step} 
      onNextStep={onNextStep}
      onPreviousStep={onPreviousStep}
      stepsToUse={stepsToUse}
      currentStepIndex={currentStepIndex}
      autoStartTimer={autoStartTimer}
      autoNextStep={autoNextStep}
      onSetStep={onSetStep}
    >
      <div className="flex flex-col min-h-[calc(100vh-10rem)]">
        <StepProgressBar />
        <div className="flex-1 flex flex-col">
          <TimerDisplay />
          <StepInstructions />
        </div>
        <div>
          <NavigationControls className="mt-auto pt-4 pb-4"/>
        </div>
      </div>
    </BrewStepProvider>
  );
}