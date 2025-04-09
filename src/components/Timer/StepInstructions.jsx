import React, { useState } from 'react';
import { useBrewStep } from './BrewStepContext';

export default function StepInstructions() {
    const { currentStep, currentStepIndex } = useBrewStep();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white p-4 rounded-lg shadow mx-4 my-6">
            <h2 className="text-xl font-bold mb-2">Step {currentStepIndex + 1}</h2>
            {currentStep.waterAmount && (
                <p className="text-lg font-semibold mb-2">Pour {currentStep.waterAmount}mL of water</p>
            )}
            <p className={`${isExpanded ? '' : 'line-clamp-3'}`}>{currentStep.description}</p>
            {currentStep.description.length > 150 && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500 mt-2">
                    {isExpanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
}