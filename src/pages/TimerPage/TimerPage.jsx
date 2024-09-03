import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OverviewComponent from '../../components/Timer/Overview';
import PrepStepsComponent from '../../components/Timer/PrepSteps';
import BrewStepComponent from '../../components/Timer/BrewSteps';
import FinalizationComponent from '../../components/Timer/Finalization';

export default function TimerPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { recipe, coffeeAmount, brewVolume, stepsToUse, scalingFactor } = location.state || {};

    const [currentStep, setCurrentStep] = useState(0);
    const [isBrewStarted, setIsBrewStarted] = useState(false);

    useEffect(() => {
        if (!recipe || !stepsToUse) {
            navigate('/calculate'); // Redirect if necessary data is missing
        }
    }, [recipe, stepsToUse, navigate]);

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
            {isBrewStarted ? (
                <>
                    <BrewStepComponent
                        step={stepsToUse[currentStep]}
                        onNextStep={handleNextStep}
                    />
                    {currentStep === stepsToUse.length - 1 && (
                        <FinalizationComponent />
                    )}
                </>
            ) : (
                <>
                    <OverviewComponent
                        recipe={recipe}
                        coffeeAmount={coffeeAmount}
                        brewVolume={brewVolume}
                        scalingFactor={scalingFactor}
                        onStartBrew={handleStartBrew}
                    />
                    <PrepStepsComponent recipe={recipe} />
                </>
            )}
        </div>
    );
}
