import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import PreparationOverview from '../../components/Timer/PreparationOverview';
import BrewSteps from '../../components/Timer/BrewSteps';
import FinalizationComponent from '../../components/Timer/Finalization';
import { clearCalculatedRecipe, getCalculatedRecipe } from '../../utilities/localStorageUtils';

export default function TimerPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    

    const getRecipeData = () => {
        // First try from route state
        if (location.state?.calculatedRecipe) {
            return location.state.calculatedRecipe;
        }
        
        // Fall back to localStorage if available
        const storedRecipe = getCalculatedRecipe();
        if (storedRecipe?.recipe) {
            return storedRecipe.recipe;
        }
        
        return null;
    };

    // if we navigate back from the edit page, try to get the relevant state so they go back to finalization component
    const locationState = location.state || {};
    const initialIsBrewStarted = locationState.isBrewStarted || false;
    const initialIsBrewFinished = locationState.isBrewFinished || false;

    // Create the calculated recipe 
    const calculatedRecipe = getRecipeData()

    const [currentStep, setCurrentStep] = useState(0);
    const [isBrewStarted, setIsBrewStarted] = useState(initialIsBrewStarted);
    const [isBrewFinished, setIsBrewFinished] = useState(initialIsBrewFinished);
    const [autoStartTimer, setAutoStartTimer] = useState(true);
    const [autoNextStep, setAutoNextStep] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        if (!calculatedRecipe || !calculatedRecipe.steps || calculatedRecipe.steps.length === 0) {
            navigate(`/calculate/${id}`, { 
                state: { error: "Missing recipe information. Please recalculate." }
            });
        }
    }, [calculatedRecipe, navigate, id]);

    const handleStartBrew = () => {
        clearCalculatedRecipe();    //be sure to clear previous calculations when starting ne wbrew 
        setIsBrewStarted(true);
    };

    const handleNextStep = () => {
        if (currentStep < calculatedRecipe.steps.length - 1) {
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
        if (stepIndex >= 0 && stepIndex < calculatedRecipe.steps.length) {
            setCurrentStep(stepIndex);
        }
    };

    if (!calculatedRecipe) {
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
                    calculatedRecipe={calculatedRecipe}
                    onStartBrew={handleStartBrew}
                />
            ) : isBrewFinished ? (
                <FinalizationComponent
                    calculatedRecipe={calculatedRecipe}
                />
            ) : (
                <BrewSteps
                    step={calculatedRecipe.steps[currentStep]}
                    onNextStep={handleNextStep}
                    onPreviousStep={handlePreviousStep}
                    onSetStep={handleSetStep}
                    steps={calculatedRecipe.steps}
                    currentStepIndex={currentStep}
                    autoStartTimer={autoStartTimer}
                    autoNextStep={autoNextStep}
                />
            )}
        </div>
    );
}