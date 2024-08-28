import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeById } from '../../utilities/recipe-api';
import AnimatedTimeline from '../../components/RecipeDetails/AnimatedTimeline';

export default function CalculatePage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [originalBrewVolume, setOriginalBrewVolume] = useState(0);
    const [originalCoffeeAmount, setOriginalCoffeeAmount] = useState(0);
    const [inputCoffeeAmount, setInputCoffeeAmount] = useState('');
    const [inputBrewVolume, setInputBrewVolume] = useState('');
    const [calculatedBrewVolume, setCalculatedBrewVolume] = useState('');
    const [calculatedCoffeeAmount, setCalculatedCoffeeAmount] = useState('');
    const [isCoffeeAmountInput, setIsCoffeeAmountInput] = useState(true);

    useEffect(() => {
        async function loadRecipe() {
            try {
                const fetchedRecipe = await fetchRecipeById(id);
                setRecipe(fetchedRecipe);

                // Calculate the original brew volume from the steps
                const totalBrewVolume = fetchedRecipe.steps.reduce((total, step) => {
                    return step.waterAmount ? total + step.waterAmount : total;
                }, 0);

                setOriginalBrewVolume(totalBrewVolume);
                setOriginalCoffeeAmount(fetchedRecipe.coffeeAmount);
            } catch (error) {
                console.error('Failed to fetch recipe:', error);
            }
        }

        loadRecipe();
    }, [id]);

    useEffect(() => {
        if (isCoffeeAmountInput && inputCoffeeAmount) {
            // Calculate the brew volume based on the coffee amount
            const scalingFactor = inputCoffeeAmount / originalCoffeeAmount;
            const newBrewVolume = originalBrewVolume * scalingFactor;
            setCalculatedBrewVolume(newBrewVolume.toFixed(2));
        } else if (!isCoffeeAmountInput && inputBrewVolume) {
            // Calculate the coffee amount based on the brew volume
            const scalingFactor = inputBrewVolume / originalBrewVolume;
            const newCoffeeAmount = originalCoffeeAmount * scalingFactor;
            setCalculatedCoffeeAmount(newCoffeeAmount.toFixed(2));
        }
    }, [inputCoffeeAmount, inputBrewVolume, isCoffeeAmountInput, originalBrewVolume, originalCoffeeAmount]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    const handleCoffeeAmountChange = (e) => {
        setInputCoffeeAmount(e.target.value);
        setInputBrewVolume(''); // Clear the brew volume input
        setIsCoffeeAmountInput(true);
    };

    const handleBrewVolumeChange = (e) => {
        setInputBrewVolume(e.target.value);
        setInputCoffeeAmount(''); // Clear the coffee amount input
        setIsCoffeeAmountInput(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Brew Calculation</h1>
            <div className="mb-6">
                <p className="text-lg font-semibold mb-2">Original Coffee Amount: {originalCoffeeAmount}g</p>
                <p className="text-lg font-semibold mb-2">Original Brew Volume: {originalBrewVolume}mL</p>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isCoffeeAmountInput ? 'Desired Coffee Amount (g):' : 'Desired Brew Volume (mL):'}
                </label>
                {isCoffeeAmountInput ? (
                    <input
                        type="number"
                        value={inputCoffeeAmount}
                        onChange={handleCoffeeAmountChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                ) : (
                    <input
                        type="number"
                        value={inputBrewVolume}
                        onChange={handleBrewVolumeChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                )}
            </div>

            <div className="mb-6">
                <p className="text-lg font-semibold mb-2">
                    Calculated {isCoffeeAmountInput ? 'Brew Volume' : 'Coffee Amount'}:{' '}
                    {isCoffeeAmountInput ? `${calculatedBrewVolume}mL` : `${calculatedCoffeeAmount}g`}
                </p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Steps</h2>
            <div className="mb-8">
                {/* Insert the AnimatedTimeline component here */}
                <AnimatedTimeline steps={recipe.steps.map(step => ({
                    ...step,
                    waterAmountText: `${step.waterAmount ? `${step.waterAmount}mL` : 'N/A'}`
                }))} />
            </div>
        </div>
    );
}
