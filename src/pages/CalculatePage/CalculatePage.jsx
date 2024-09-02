import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeById } from '../../utilities/recipe-api';
import AnimatedTimeline from '../../components/RecipeDetails/AnimatedTimeline';
import debounce from 'lodash.debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faTint, faEquals } from '@fortawesome/free-solid-svg-icons';
import Switch from 'react-switch';
import { useNavigate } from 'react-router-dom';

export default function CalculatePage() {
    const navigate = useNavigate() 
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inputType, setInputType] = useState('coffeeAmount'); // or 'brewVolume'
    const [userInput, setUserInput] = useState('');
    const [calculatedValue, setCalculatedValue] = useState(null);
    const [scalingFactor, setScalingFactor] = useState(1); // Default scaling factor of 1
    const [calculatedSteps, setCalculatedSteps] = useState([]);

    useEffect(() => {
        async function loadRecipe() {
            try {
                const fetchedRecipe = await fetchRecipeById(id);
                setRecipe(fetchedRecipe);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
                setError('Failed to load recipe');
                setIsLoading(false);
            }
        }

        loadRecipe();
    }, [id]);

    // Debounced calculation function
    const debouncedCalculate = useCallback(
        debounce((input, type) => {
            if (!recipe || !input) {
                setCalculatedValue(null);
                setScalingFactor(1);
                setCalculatedSteps(recipe ? recipe.steps : []);
                return;
            }

            const { coffeeAmount: originalCoffeeAmount, steps, type: recipeType } = recipe;

            const originalBrewVolume = steps.reduce((total, step) => {
                return step.waterAmount ? total + step.waterAmount : total;
            }, 0);

            let calculatedValue;
            let scalingFactor = 1;

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

            setCalculatedValue(calculatedValue);
            setScalingFactor(scalingFactor);

            // Calculate scaled steps
            const updatedSteps = steps.map((step) => ({
                ...step,
                waterAmount: step.waterAmount ? (step.waterAmount * scalingFactor).toFixed(2) : undefined,
                time: step.time ? (step.time * Math.pow(scalingFactor, 0.35)).toFixed(2) : undefined, // Adjust time scaling using the conical approach
            }));

            setCalculatedSteps(updatedSteps);

        }, 500), // 500ms debounce time
        [recipe]
    );

    // Trigger the debounced calculation when user input or input type changes
    useEffect(() => {
        debouncedCalculate(userInput, inputType);
    }, [userInput, inputType, debouncedCalculate]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSwitchChange = (checked) => {
        setInputType(checked ? 'brewVolume' : 'coffeeAmount');
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    const handleStartBrew = () => {
      navigate('/timer', {
          state: {
              userInput,
              calculatedValue,
              calculatedSteps,
              inputType,
              scalingFactor,
          },
      });
    };

    const originalBrewVolume = recipe.steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Calculate Brew</h1>

            <div className="mb-4 text-center">
                {recipe.type === 'Ratio' ? (
                    <>
                        <p className="mb-2 flex justify-center items-center">
                            <FontAwesomeIcon icon={faCoffee} className="mr-2 text-yellow-600" />
                            Brew Ratio: {recipe.coffeeAmount}:{originalBrewVolume}
                        </p>
                    </>
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
                    offColor="#8B4513"      // Brown color
                    onColor="#00008B"       // Dark blue color
                    offHandleColor="#FFFFFF" // Darker brown color
                    onHandleColor="#FFFFFF"  // Lighter blue color
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
                <span className="ml-4">Brew Volume</span>
            </div>

            <div className="mb-4">
                {inputType === 'coffeeAmount' ? (
                    <div className="mb-2">
                        <label className="block mb-2 text-center">Enter Desired Coffee Amount (g):</label>
                        <input
                          type="number"
                          value={userInput}
                          onChange={handleInputChange}
                          className="p-2 border rounded w-full text-center text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:w-1/2 mx-auto"
                      />
                    </div>
                ) : (
                    <div className="mb-2">
                        <label className="block mb-2 text-center">Enter Desired Brew Volume (mL):</label>
                        <input
                            type="number"
                            value={userInput}
                            onChange={handleInputChange}
                            className="p-2 border rounded w-full text-center"
                        />
                    </div>
                )}
            </div>

            <button
                onClick={handleStartBrew}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
                Start Brew
            </button>


            <div className="my-4 flex justify-center items-center">
                <div>
                    {inputType === 'coffeeAmount' ? (
                        <p className="text-lg font-semibold mr-4">
                            <FontAwesomeIcon icon={faTint} className="mr-2 text-blue-600" />
                            Calculated Brew Volume: {calculatedValue ? `${calculatedValue.toFixed(2)} mL` : 'N/A'}
                        </p>
                    ) : (
                        <p className="text-lg font-semibold mr-4">
                            <FontAwesomeIcon icon={faCoffee} className="mr-2 text-yellow-600" />
                            Calculated Coffee Amount: {calculatedValue ? `${calculatedValue.toFixed(2)} g` : 'N/A'}
                        </p>
                    )}
                </div>
                <div>
                    <p className="text-lg font-semibold">
                        <FontAwesomeIcon icon={faEquals} className="mr-2 text-gray-600" />
                        Scaling Factor: {scalingFactor.toFixed(2)}
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-center">Steps</h2>
            <div className="mb-8">
                <AnimatedTimeline steps={calculatedSteps.length > 0 ? calculatedSteps : recipe.steps} />
            </div>
        </div>
    );
}
