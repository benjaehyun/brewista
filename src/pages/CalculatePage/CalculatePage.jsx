import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRecipeById } from '../../services/api/recipe-api';
import AnimatedTimeline from '../../components/RecipeDetails/AnimatedTimeline';
import debounce from 'lodash.debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faTint, faEquals } from '@fortawesome/free-solid-svg-icons';
import Switch from 'react-switch';
import { saveCalculatedRecipe } from '../../utilities/sessionStorageUtils';

const MemoizedAnimatedTimeline = React.memo(AnimatedTimeline);

export default function CalculatePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    
    // get the version from URL query params if available
    const versionParam = searchParams.get('version');
    
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inputType, setInputType] = useState('coffeeAmount');
    const [userInput, setUserInput] = useState('');
    const [originalBrewVolume, setOriginalBrewVolume] = useState(0);
    const [calculationResult, setCalculationResult] = useState({
        calculatedValue: null,
        scalingFactor: 1,
        calculatedSteps: []
    });

    const didCalculate = userInput !== '' && calculationResult.scalingFactor !== 1;

    const calculateValues = useCallback((input, type, recipeData) => {
        if (!recipeData || !input) {
            return {
                calculatedValue: null,
                scalingFactor: 1,
                calculatedSteps: recipeData ? recipeData.steps : []
            };
        }

        const { coffeeAmount: originalCoffeeAmount, steps, type: recipeType } = recipeData;

        // const numericInput = parseFloat(input);

        let calculatedValue;
        let scalingFactor = 1;

        const originalBrewVolume = steps.reduce((total, step) => {
            return step.waterAmount ? total + step.waterAmount : total;
          }, 0);

        if (recipeType === 'Ratio') {
            const ratio = originalBrewVolume / originalCoffeeAmount;
            if (type === 'coffeeAmount') {
                calculatedValue = input * ratio;
                scalingFactor = input / originalCoffeeAmount;
            } else if (type === 'brewVolume') {
                calculatedValue = input / ratio;
                scalingFactor = input / originalBrewVolume;
            }
        } else {
            if (type === 'coffeeAmount') {
                scalingFactor = input / originalCoffeeAmount;
                calculatedValue = scalingFactor * originalBrewVolume;
            } else if (type === 'brewVolume') {
                scalingFactor = input / originalBrewVolume;
                calculatedValue = scalingFactor * originalCoffeeAmount;
            }
        }
        // if (recipeType === 'Ratio') {
        //     const ratio = originalBrewVolume / originalCoffeeAmount;
        //     if (type === 'coffeeAmount') {
        //         calculatedValue = numericInput * ratio;
        //         scalingFactor = numericInput / originalCoffeeAmount;
        //     } else if (type === 'brewVolume') {
        //         calculatedValue = numericInput / ratio;
        //         scalingFactor = numericInput / originalBrewVolume;
        //     }
        // } else {
        //     if (type === 'coffeeAmount') {
        //         scalingFactor = numericInput / originalCoffeeAmount;
        //         console.log(numericInput)
        //         console.log(originalBrewVolume)
        //         console.log(typeof(numericInput))
        //         calculatedValue = scalingFactor * originalBrewVolume;
        //     } else if (type === 'brewVolume') {
        //         scalingFactor = numericInput / originalBrewVolume;
        //         calculatedValue = scalingFactor * originalCoffeeAmount;
        //     }
        // }

        const updatedSteps = steps.map((step) => ({
            ...step,
            waterAmount: step.waterAmount ? Number((step.waterAmount * scalingFactor).toFixed(2)) : undefined,
            time: step.isBloom ? step.time : (step.time ? Number((step.time * Math.pow(scalingFactor, 0.35)).toFixed()) : undefined),
        }));

        return { calculatedValue, scalingFactor, calculatedSteps: updatedSteps };
    }, []);

    const debouncedCalculate = useCallback(
        debounce((input, type, recipe) => {
            const result = calculateValues(input, type, recipe);
            setCalculationResult(result);
        }, 500),
        [calculateValues]
    );

    useEffect(() => {
        async function loadRecipeAndCalculate() {
            try {
                setIsLoading(true);
                const fetchedRecipe = await fetchRecipeById(id, versionParam);

                const calcOriginalBrewVolume = fetchedRecipe.steps.reduce((total, step) => {
                    return step.waterAmount ? total + step.waterAmount : total;
                }, 0);
                setOriginalBrewVolume(calcOriginalBrewVolume);

                setRecipe(fetchedRecipe);
                setIsLoading(false);
                const initialResult = calculateValues('', inputType, fetchedRecipe);
                setCalculationResult(initialResult);
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
                setError('Failed to load recipe');
                setIsLoading(false);
            }
        }

        loadRecipeAndCalculate();
    }, [id, versionParam, calculateValues]);

    useEffect(() => {
        if (recipe) {
            debouncedCalculate(userInput, inputType, recipe);
        }
    }, [userInput, inputType, recipe, debouncedCalculate]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSwitchChange = (checked) => {
        setInputType(checked ? 'brewVolume' : 'coffeeAmount');
    };

    const handleStartBrew = () => {
        let coffeeValue;
        if (userInput !== '' && inputType === 'coffeeAmount') {
            coffeeValue = parseFloat(userInput);
        } else if (calculationResult.calculatedValue !== null && inputType === 'brewVolume') {
            coffeeValue = calculationResult.calculatedValue;
        } else {
            coffeeValue = recipe.coffeeAmount;
        }



        const brewVolume = calculationResult.calculatedValue !== null && inputType === 'coffeeAmount' 
        ? calculationResult.calculatedValue 
        : originalBrewVolume;

        const calculatedRecipe = {
            ...recipe,                
            coffeeAmount: coffeeValue, // Override with calculated coffee amount
            steps: calculationResult.calculatedSteps.length > 0 
                ? calculationResult.calculatedSteps 
                : recipe.steps,
            type: "Explicit",
            calculationMetadata: {
                originalRecipeId: recipe._id,
                originalVersion: versionParam || recipe.versionInfo?.version || recipe.currentVersion,
                scalingFactor: calculationResult.scalingFactor,
                brewVolume: brewVolume,
                calculatedAt: new Date().toISOString(),
                didCalculate: didCalculate,
                inputType: inputType,
                originalRecipeSnapshot: JSON.parse(JSON.stringify(recipe)) // to use to calculate changes later on 
            }
        };

        saveCalculatedRecipe(calculatedRecipe);

        // Pass version information to the Timer page
        navigate(`/timer/${id}`, {
            state: {
                calculatedRecipe: calculatedRecipe
            },
        });
    };

    const stepsToRender = useMemo(() => {
        return calculationResult.calculatedSteps.length > 0
            ? calculationResult.calculatedSteps
            : recipe?.steps || [];
    }, [calculationResult.calculatedSteps, recipe]);


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!recipe) return <div>Recipe not found</div>;


    // Display version information if brewing a specific version
    const versionInfo = versionParam 
        ? `Version ${versionParam}` 
        : recipe.versionInfo?.version 
            ? `Version ${recipe.versionInfo.version}` 
            : '';

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Calculate Brew</h1>
            
            {/* Version indicator */}
            {versionInfo && (
                <div className="mb-4 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {versionInfo}
                    </span>
                </div>
            )}

            <div className="mb-4 text-center">
                {recipe.type === 'Ratio' ? (
                    <p className="mb-2 flex justify-center items-center">
                        <FontAwesomeIcon icon={faCoffee} className="mr-2 text-yellow-600" />
                        Brew Ratio: {recipe.coffeeAmount}:{originalBrewVolume}
                    </p>
                ) : (
                    <>
                        <p className="mb-2 flex justify-center items-center">
                            <FontAwesomeIcon icon={faCoffee} className="mr-2 text-yellow-600" />
                            Original Coffee Amount: {recipe.coffeeAmount}g
                        </p>
                        <p className="mb-2 flex justify-center items-center">
                            <FontAwesomeIcon icon={faTint} className="mr-2 text-blue-600" />
                            Original Brew Volume: {originalBrewVolume}mL
                        </p>
                    </>
                )}
            </div>

            <div className="mb-4 flex justify-center items-center">
                <span className="mr-4">Coffee Amount</span>
                <Switch
                    onChange={handleSwitchChange}
                    checked={inputType === 'brewVolume'}
                    offColor="#8B4513"
                    onColor="#00008B"
                    offHandleColor="#FFFFFF"
                    onHandleColor="#FFFFFF"
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
                <span className="ml-4">Brew Volume</span>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                    {inputType === 'coffeeAmount' 
                    ? "Enter Desired Coffee Amount (g)" 
                    : "Enter Desired Brew Volume (mL)"}
                </label>
                <input
                    type="number"
                    inputMode="decimal"
                    pattern="[0-9]*"
                    min="0"
                    step="any"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder={inputType === 'coffeeAmount' 
                    ? "Enter coffee amount in grams" 
                    : "Enter brew volume in mL"}
                    className="p-2 border rounded w-full text-center text-gray-800 bg-gray-100 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            sm:w-1/2 mx-auto"
                />
            </div>

            <button
                onClick={handleStartBrew}
                disabled={recipe.type === 'Ratio' && !userInput}
                className={`${
                    recipe.type === 'Ratio' && !userInput ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
            >
                Start Brew
            </button>

            <div className="my-4 flex justify-center items-center">
                <div>
                    {inputType === 'coffeeAmount' ? (
                        <p className="text-lg font-semibold mr-4">
                            <FontAwesomeIcon icon={faTint} className="mr-2 text-blue-600" />
                            Calculated Brew Volume: {calculationResult.calculatedValue ? `${calculationResult.calculatedValue.toFixed(2)} mL` : 'N/A'}
                        </p>
                    ) : (
                        <p className="text-lg font-semibold mr-4">
                            <FontAwesomeIcon icon={faCoffee} className="mr-2 text-yellow-600" />
                            Calculated Coffee Amount: {calculationResult.calculatedValue ? `${calculationResult.calculatedValue.toFixed(2)} g` : 'N/A'}
                        </p>
                    )}
                </div>
                <div>
                    <p className="text-lg font-semibold">
                        <FontAwesomeIcon icon={faEquals} className="mr-2 text-gray-600" />
                        Scaling Factor: {calculationResult.scalingFactor.toFixed(2)}
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-center">Steps</h2>
            <div className="mb-8">
                <MemoizedAnimatedTimeline steps={stepsToRender} />
            </div>
        </div>
    );
}