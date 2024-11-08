import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import PreparationOverview from '../../components/Timer/PreparationOverview';
import BrewSteps from '../../components/Timer/BrewSteps';
import FinalizationComponent from '../../components/Timer/Finalization';
import { clearCalculatedRecipe } from '../../services/localStorageUtils';

export default function TimerPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { recipe, coffeeAmount, brewVolume, stepsToUse, scalingFactor } = location.state || {};

    const calculatedRecipe = {
        ...recipe, 
        coffeeAmount: coffeeAmount,
        steps: stepsToUse,
        type: "Explicit"
    }

    const [currentStep, setCurrentStep] = useState(0);
    const [isBrewStarted, setIsBrewStarted] = useState(false);
    const [isBrewFinished, setIsBrewFinished] = useState(false);
    const [autoStartTimer, setAutoStartTimer] = useState(true);
    const [autoNextStep, setAutoNextStep] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        if (!recipe || !stepsToUse) {
            navigate(`/calculate/${id}`, { 
                state: { error: "Missing recipe information. Please recalculate." }
            });
        }
    }, [recipe, stepsToUse, navigate, id]);

    const handleStartBrew = () => {
        clearCalculatedRecipe()
        setIsBrewStarted(true);
    };

    const handleNextStep = () => {
        if (currentStep < stepsToUse.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsBrewFinished(true);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSetStep = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < stepsToUse.length) {
            setCurrentStep(stepIndex);
        }
    };

    if (!recipe || !stepsToUse) {
        return null; // Avoid rendering if redirected
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-4">
                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="w-full flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-200"
                >
                    <span className="font-semibold text-gray-700">Timer Settings</span>
                    <FontAwesomeIcon icon={isSettingsOpen ? faChevronUp : faChevronDown} />
                </button>
                {isSettingsOpen && (
                    <div className="mt-2 bg-white p-4 rounded-lg shadow-md">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Auto start timer between steps</span>
                                <Switch
                                    checked={autoStartTimer}
                                    onChange={setAutoStartTimer}
                                    onColor="#4299e1"
                                    offColor="#cbd5e0"
                                    onHandleColor="#ffffff"
                                    offHandleColor="#ffffff"
                                    handleDiameter={24}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={20}
                                    width={48}
                                    className="react-switch"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Go to next step at end of timer</span>
                                <Switch
                                    checked={autoNextStep}
                                    onChange={setAutoNextStep}
                                    onColor="#4299e1"
                                    offColor="#cbd5e0"
                                    onHandleColor="#ffffff"
                                    offHandleColor="#ffffff"
                                    handleDiameter={24}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={20}
                                    width={48}
                                    className="react-switch"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!isBrewStarted ? (
                <PreparationOverview
                    recipe={recipe}
                    coffeeAmount={coffeeAmount}
                    brewVolume={brewVolume}
                    onStartBrew={handleStartBrew}
                />
            ) : isBrewFinished ? (
                <FinalizationComponent
                    recipe={recipe}
                    calculatedRecipe={calculatedRecipe}
                />
            ) : (
                <BrewSteps
                    step={stepsToUse[currentStep]}
                    onNextStep={handleNextStep}
                    onPreviousStep={handlePreviousStep}
                    onSetStep={handleSetStep}
                    stepsToUse={stepsToUse}
                    currentStepIndex={currentStep}
                    autoStartTimer={autoStartTimer}
                    autoNextStep={autoNextStep}
                />
            )}
        </div>
    );
}