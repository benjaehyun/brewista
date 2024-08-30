import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeById } from '../../utilities/recipe-api';
import AnimatedTimeline from '../../components/RecipeDetails/AnimatedTimeline';
import debounce from 'lodash.debounce';

export default function CalculatePage() {
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

            console.log('Calculated Value:', calculatedValue);
            console.log('Scaling Factor:', scalingFactor);

            // Calculate scaled steps
            const updatedSteps = steps.map((step) => {
                const scaledWaterAmount = step.waterAmount ? (step.waterAmount * scalingFactor).toFixed(2) : undefined;
                
                // Time scaling using the conical calculation
                const scaledTime = step.time 
                    ? (step.time * Math.pow(scalingFactor, 0.35)).toFixed(2) 
                    : undefined;

                return {
                    ...step,
                    waterAmount: scaledWaterAmount,
                    time: scaledTime,
                };
            });

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    const originalBrewVolume = recipe.steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Calculate Brew</h1>

            <div className="mb-4">
                {recipe.type === 'Ratio' ? (
                    <>
                        <p className="mb-2">Brew Ratio: {recipe.coffeeAmount}:{originalBrewVolume}</p>
                    </>
                ) : (
                    <>
                        <p className="mb-2">Original Coffee Amount: {recipe.coffeeAmount}g</p>
                        <p className="mb-2">Original Brew Volume: {originalBrewVolume}mL</p>
                    </>
                )}
            </div>

            <div className="mb-4">
                <label className="mr-4">
                    <input
                        type="radio"
                        value="coffeeAmount"
                        checked={inputType === 'coffeeAmount'}
                        onChange={(e) => setInputType(e.target.value)}
                    />
                    Coffee Amount
                </label>
                <label>
                    <input
                        type="radio"
                        value="brewVolume"
                        checked={inputType === 'brewVolume'}
                        onChange={(e) => setInputType(e.target.value)}
                    />
                    Brew Volume
                </label>
            </div>

            <div className="mb-4">
                {inputType === 'coffeeAmount' ? (
                    <div>
                        <label className="block mb-2">Enter Desired Coffee Amount (g):</label>
                        <input
                            type="number"
                            value={userInput}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block mb-2">Enter Desired Brew Volume (mL):</label>
                        <input
                            type="number"
                            value={userInput}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                        />
                    </div>
                )}
            </div>

            <div className="mb-4">
                {inputType === 'coffeeAmount' ? (
                    <p>Calculated Brew Volume: {calculatedValue ? `${calculatedValue.toFixed(2)} mL` : 'N/A'}</p>
                ) : (
                    <p>Calculated Coffee Amount: {calculatedValue ? `${calculatedValue.toFixed(2)} g` : 'N/A'}</p>
                )}
            </div>

            <h2 className="text-2xl font-semibold mb-4">Steps</h2>
            <div className="mb-8">
                <AnimatedTimeline steps={calculatedSteps.length > 0 ? calculatedSteps : recipe.steps} />
            </div>
        </div>
    );
}
