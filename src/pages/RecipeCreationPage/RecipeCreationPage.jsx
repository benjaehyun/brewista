import React, { useState, useEffect } from 'react';
// import { fetchUserGear, submitRecipe } from '../api'; // Placeholder for actual API calls
import GearSelector from '../../components/RecipeCreation/GearSelector'; // Component for selecting gear
import RecipeStepForm from '../../components/RecipeCreation/RecipeStepForm'; // Component for adding steps
import TemperatureInput from '../../components/RecipeCreation/TemperatureInput'; // Component for water temperature input
import TastingNotesInput from '../../components/RecipeCreation/TastingNotesInput'; // Component for tasting notes input

export default function RecipeCreationPage() {
    const [gear, setGear] = useState([]);
    const [selectedGear, setSelectedGear] = useState([]);
    const [name, setName] = useState('');
    const [coffeeBean, setCoffeeBean] = useState('');
    const [grindSize, setGrindSize] = useState('');
    const [waterTemp, setWaterTemp] = useState('');
    const [waterTempUnit, setWaterTempUnit] = useState('Celsius');
    const [steps, setSteps] = useState([]);
    const [tastingNotes, setTastingNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     async function loadUserGear() {
    //         try {
    //             const gearList = await fetchUserGear();
    //             setGear(gearList);
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.error('Failed to fetch gear:', error);
    //         }
    //     }

    //     loadUserGear();
    // }, []);

    const isFormValid = name && selectedGear.length > 0 && steps.length > 0;

    const handleRecipeSubmit = async (e) => {
        e.preventDefault();
        const recipeData = {
            name,
            gear: selectedGear,
            coffeeBean,
            grindSize,
            steps,
            waterTemperature: waterTemp ? { temp: waterTemp, unit: waterTempUnit } : undefined,
            tastingNotes,
        };

        try {
            // await submitRecipe(recipeData);
            // Handle success
        } catch (error) {
            console.error('Error submitting recipe:', error);
            // Handle error
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-lg font-semibold mb-4">Create a New Recipe</h2>
            <form onSubmit={handleRecipeSubmit} className="space-y-6">
                <GearSelector gear={gear} selectedGear={selectedGear} setSelectedGear={setSelectedGear} />
                <RecipeStepForm steps={steps} setSteps={setSteps} />
                <TemperatureInput waterTemp={waterTemp} setWaterTemp={setWaterTemp} waterTempUnit={waterTempUnit} setWaterTempUnit={setWaterTempUnit} />
                <TastingNotesInput tastingNotes={tastingNotes} setTastingNotes={setTastingNotes} />
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full px-4 py-2 text-white font-semibold rounded-md ${isFormValid ? 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : 'bg-blue-300'}`}
                >
                    Submit Recipe
                </button>
            </form>
        </div>
    );
}
