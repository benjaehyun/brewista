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
        <div className="flex flex-col min-h-[calc(100vh-10rem)]">
            {wakeLockError && (
            <div className="bg-yellow-50 text-yellow-800 p-2 text-sm text-center">
                Your screen may turn off during brewing.
            </div>
            )}
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