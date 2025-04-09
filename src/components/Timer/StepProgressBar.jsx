import React from 'react';
import { useBrewStep } from './BrewStepContext';

export default function StepProgressBar() {
    const { steps, currentStepIndex, onSetStep } = useBrewStep();

    return (
        <div className="w-full bg-gray-100 py-2">
            <div className="flex gap-2 mx-4">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        onClick={() => onSetStep(index)}
                        className={`flex-1 h-2 rounded-full cursor-pointer transition-colors ${
                        index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}