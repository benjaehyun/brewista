import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const BrewStepContext = createContext();

export const useBrewStep = () => {
    const context = useContext(BrewStepContext);
    if (!context) {
        throw new Error('useBrewStep must be used within a BrewStepProvider');
    }
    return context;
};

export function BrewStepProvider({ children, currentStep, onNextStep, onPreviousStep, steps, currentStepIndex, autoStartTimer, autoNextStep, onSetStep }) {
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

    const handleSetStep = useCallback((stepIndex) => {
        if (stepIndex >= 0 && stepIndex < steps.length) {  
            onSetStep(stepIndex);
            setTimerState('paused');
            setTimeRemaining(steps[stepIndex].time || 0);  
        }
    }, [steps, onSetStep]);  

    const value = {
        currentStep,
        steps,  
        currentStepIndex,
        timerState,
        timeRemaining,
        onNextStep,
        onPreviousStep,
        onSetStep: handleSetStep,
        toggleTimer,
        restartStep,
        setTimeRemaining,
        handleTimerEnd,
        autoStartTimer,
        autoNextStep
    };

    return <BrewStepContext.Provider value={value}>{children}</BrewStepContext.Provider>;
}