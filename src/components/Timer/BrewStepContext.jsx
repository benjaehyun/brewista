import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const BrewStepContext = createContext();

export const useBrewStep = () => {
  const context = useContext(BrewStepContext);
  if (!context) {
    throw new Error('useBrewStep must be used within a BrewStepProvider');
  }
  return context;
};

export function BrewStepProvider({ children, currentStep, onNextStep, onPreviousStep, stepsToUse, currentStepIndex, autoStartTimer, autoNextStep }) {
  const [timerState, setTimerState] = useState(autoStartTimer ? 'running' : 'paused');
  const [timeRemaining, setTimeRemaining] = useState(currentStep.time || 0);

  useEffect(() => {
    setTimeRemaining(currentStep.time || 0);
    if (autoStartTimer) {
      setTimerState('running');
    } else {
      setTimerState('paused');
    }
  }, [currentStep, autoStartTimer]);

  const toggleTimer = useCallback(() => {
    setTimerState(prev => prev === 'running' ? 'paused' : 'running');
  }, []);

  const restartStep = useCallback(() => {
    setTimerState('paused');
    setTimeRemaining(currentStep.time || 0);
  }, [currentStep]);

  const handleTimerEnd = useCallback(() => {
    if (autoNextStep) {
      onNextStep();
    } else {
      setTimerState('paused');
    }
  }, [autoNextStep, onNextStep]);

  const value = {
    currentStep,
    stepsToUse,
    currentStepIndex,
    timerState,
    timeRemaining,
    onNextStep,
    onPreviousStep,
    toggleTimer,
    restartStep,
    setTimeRemaining,
    handleTimerEnd,
    autoStartTimer,
    autoNextStep
  };

  return <BrewStepContext.Provider value={value}>{children}</BrewStepContext.Provider>;
}