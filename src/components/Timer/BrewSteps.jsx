import React, { useEffect } from 'react';
import { BrewStepProvider } from './BrewStepContext';
import NavigationControls from './NavigationControls';
import TimerDisplay from './TimerDisplay';
import StepInstructions from './StepInstructions';
import StepProgressBar from './StepProgressBar';
import { useWakeLock } from '../../hooks/useWakeLock';

export default function BrewSteps({ step, onNextStep, onPreviousStep, steps, currentStepIndex, autoStartTimer, autoNextStep, onSetStep }) {
    const { isSupported, isActive, error: wakeLockError, requestWakeLock, releaseWakeLock } = useWakeLock();

    // Request wake lock when component mounts
    useEffect(() => {
        const initializeWakeLock = async () => {
            await requestWakeLock();
        };
        
        initializeWakeLock();
        
        // Release when component unmounts
        return () => {
            releaseWakeLock();
        };
    }, [requestWakeLock, releaseWakeLock]);

    return (
        <BrewStepProvider
        currentStep={step}
        onNextStep={onNextStep}
        onPreviousStep={onPreviousStep}
        steps={steps} 
        currentStepIndex={currentStepIndex}
        autoStartTimer={autoStartTimer}
        autoNextStep={autoNextStep}
        onSetStep={onSetStep}
        >
        <div className="flex flex-col">

            {wakeLockError && (
                <div className="bg-yellow-50 text-yellow-800 p-2 mb-2 text-sm text-center">
                Your screen may turn off during brewing.
                </div>
            )}
            <StepProgressBar />
            
            <div className="flex-1 flex flex-col overflow-auto pb-24"> 
                <TimerDisplay />
                <StepInstructions />
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent">
                <NavigationControls />
            </div>
        </div>
        </BrewStepProvider>
    );
}