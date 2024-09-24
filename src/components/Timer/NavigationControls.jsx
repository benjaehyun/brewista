import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faPlay, faPause, faRedo, faStepForward } from '@fortawesome/free-solid-svg-icons';
import { useBrewStep } from './BrewStepContext';

export default function NavigationControls() {
  const { timerState, toggleTimer, restartStep, onNextStep, onPreviousStep, currentStepIndex, stepsToUse } = useBrewStep();

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === stepsToUse.length;

  return (
    <div className={`flex justify-between items-center h-16 px-4 bg-gray-100 rounded-lg`}>
      <button onClick={onPreviousStep} disabled={isFirstStep} className="w-12 h-12 flex items-center justify-center text-gray-600 disabled:text-gray-400">
        <FontAwesomeIcon icon={faStepBackward} size="lg" />
      </button>
      <button onClick={toggleTimer} className="w-12 h-12 flex items-center justify-center text-blue-500">
        <FontAwesomeIcon icon={timerState === 'running' ? faPause : faPlay} size="lg" />
      </button>
      <button onClick={restartStep} className="w-12 h-12 flex items-center justify-center text-gray-600">
        <FontAwesomeIcon icon={faRedo} size="lg" />
      </button>
      <button onClick={onNextStep} disabled={isLastStep} className="w-12 h-12 flex items-center justify-center text-gray-600 disabled:text-gray-400">
        <FontAwesomeIcon icon={faStepForward} size="lg" />
      </button>
    </div>
  );
}