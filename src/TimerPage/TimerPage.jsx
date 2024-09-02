import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OverviewComponent from '../components/Timer/Overview';
import PrepStepsComponent from '../components/Timer/PrepSteps';
import BrewStepComponent from '../components/Timer/BrewSteps';
import FinalizationComponent from '../components/Timer/Finalization';

export default function TimerPage() {
    const location = useLocation();
    const navigate = useNavigate(); // Replace useHistory with useNavigate
    const { userInput, calculatedValue, calculatedSteps, inputType } = location.state || {};

    const [currentStep, setCurrentStep] = useState(0);
    const [isBrewStarted, setIsBrewStarted] = useState(false);

    useEffect(() => {
        if (!userInput || !calculatedValue || !calculatedSteps) {
            navigate('/calculate'); // Replace history.push with navigate
        }
    }, [userInput, calculatedValue, calculatedSteps, navigate]);

    const handleStartBrew = () => {
        setIsBrewStarted(true);
    };

    const handleNextStep = () => {
        if (currentStep < calculatedSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    if (!userInput || !calculatedValue || !calculatedSteps) {
        return null; // Avoid rendering if redirected
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {isBrewStarted ? (
                <>
                    <BrewStepComponent
                        step={calculatedSteps[currentStep]}
                        onNextStep={handleNextStep}
                    />
                    {currentStep === calculatedSteps.length - 1 && (
                        <FinalizationComponent />
                    )}
                </>
            ) : (
                <>
                    <OverviewComponent
                        userInput={userInput}
                        calculatedValue={calculatedValue}
                        inputType={inputType}
                        onStartBrew={handleStartBrew}
                    />
                    <PrepStepsComponent />
                </>
            )}
        </div>
    );
}
