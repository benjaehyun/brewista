import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PreparationOverview from '../../components/Timer/PreparationOverview';
import BrewStepComponent from '../../components/Timer/BrewSteps';
import FinalizationComponent from '../../components/Timer/Finalization';

export default function TimerPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { recipe, coffeeAmount, brewVolume, stepsToUse, scalingFactor } = location.state || {};

    const [currentStep, setCurrentStep] = useState(0);
    const [isBrewStarted, setIsBrewStarted] = useState(false);

    useEffect(() => {
        if (!recipe || !stepsToUse) {
            // Navigate to calculate page with the recipe ID
            navigate(`/calculate/${id}`, { 
                state: { error: "Missing recipe information. Please recalculate." }
            });
        }
    }, [recipe, stepsToUse, navigate, id]);

    const handleStartBrew = () => {
        setIsBrewStarted(true);
    };

    const handleNextStep = () => {
        if (currentStep < stepsToUse.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    if (!recipe || !stepsToUse) {
        return null; // Avoid rendering if redirected
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {!isBrewStarted ? (
                <PreparationOverview
                    recipe={recipe}
                    coffeeAmount={coffeeAmount}
                    brewVolume={brewVolume}
                    onStartBrew={handleStartBrew}
                />
            ) : (
                <>
                    <BrewStepComponent
                        step={stepsToUse[currentStep]}
                        onNextStep={handleNextStep}
                    />
                    {currentStep === stepsToUse.length - 1 && (
                        <FinalizationComponent />
                    )}
                </>
            )}
        </div>
    );
}