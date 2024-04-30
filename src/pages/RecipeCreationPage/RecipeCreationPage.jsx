import React, { useState, useEffect } from 'react';
import { fetchUserGear } from '../../utilities/gear-api';
import { fetchCoffeeBeans } from '../../utilities/coffeeBean-api'
import GearSelector from '../../components/RecipeCreation/GearSelector';
import RecipeStepForm from '../../components/RecipeCreation/RecipeStepForm';
import TemperatureInput from '../../components/RecipeCreation/TemperatureInput';
import TastingNotesInput from '../../components/RecipeCreation/TastingNotesInput';
import CoffeeBeanSelector from '../../components/RecipeCreation/CoffeeBeanSelector';
import GearAdditionModal from '../../components/GearAddition/GearAdditionModal';
import CoffeeBeanAdditionModal from '../../components/CoffeeBeanAddition/CoffeeBeanAdditionModal';
import { faChevronUp, faChevronDown, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GrindSizeInput from '../../components/RecipeCreation/GrindSizeInput';


function Accordion({ title, children, isCompleted, isRequired }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            <button
                type="button"
                className={`w-full px-4 py-2 text-left font-medium focus:outline-none ${isRequired ? isCompleted ? 'bg-green-100 text-green-700':'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} hover:bg-blue-200 rounded-lg`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex justify-between items-center">
                    <span>{title} {isRequired && '*'}</span>
                    <span className="flex items-center">
                        {isRequired && isCompleted && <FontAwesomeIcon icon={faCircle} className="text-green-500 mr-2" />}
                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                    </span>
                </div>
            </button>
            {isOpen && (
                <div className="mt-2 p-4 bg-white rounded-lg shadow">
                    {children}
                </div>
            )}
        </div>
    );
}

export default function RecipeCreationPage() {
    const [gear, setGear] = useState([]);
    const [selectedGear, setSelectedGear] = useState([]);
    const [isTimed, setIsTimed] = useState(false)
    const [name, setName] = useState('');
    const [selectedBean, setSelectedBean] = useState('');
    const [grindSize, setGrindSize] = useState({
        steps: 0, 
        microsteps: 0, 
        description: ''
    });
    const [waterTemp, setWaterTemp] = useState('');
    const [waterTempUnit, setWaterTempUnit] = useState('Celsius');
    const [steps, setSteps] = useState([]);
    const [tastingNotes, setTastingNotes] = useState([]);


    const [isLoading, setIsLoading] = useState(true);
    const [coffeeBeanList, setCoffeeBeanList] = useState([]);
    const [showGearAdditionModal, setShowGearAdditionModal] = useState(false);
    const [showCoffeeAdditionModal, setShowCoffeeAdditionModal] = useState(false);
    

    useEffect(() => {
        async function loadResources() {
            try {
                const gearList = await fetchUserGear();
                setGear(gearList);
                // const beanList = await fetchCoffeeBeans(); 
                // setCoffeeBeanList(beanList)
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch resources:', error);
            }
        }

        loadResources();
    }, []);

    const updateGearList = async () => {
        const updatedGearList = await fetchUserGear();
        setGear(updatedGearList);
    };

    async function updateCoffeeBeanList () {
        // const updatedCoffeeBeanList = await fetchCoffeeBeans(); 
        // setCoffeeBeanList(updatedCoffeeBeanList)
    }

    const isFormValid = name.trim() && selectedGear.length > 0 && steps.length > 0;


    const handleRecipeSubmit = async (e) => {
        e.preventDefault();
        const recipeData = {
            name,
            gear: selectedGear,
            coffeeBean: selectedBean,
            grindSize,
            waterTemperature: waterTemp ? { temp: waterTemp, unit: waterTempUnit } : null,
            steps,
            tastingNotes,
        };

        try {
            // Placeholder: Replace with actual submit function
            console.log('Submitting recipe:', recipeData);
            // await submitRecipe(recipeData);
        } catch (error) {
            console.error('Error submitting recipe:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Create a New Recipe</h2>
            <form onSubmit={handleRecipeSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Recipe Name *</label>
                    <input
                        type="text"
                        placeholder="Enter recipe name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>


                <Accordion title="Select Gear" isCompleted={selectedGear.length > 0} isRequired={true}>
                    <GearSelector gear={gear} selectedGear={selectedGear} setSelectedGear={setSelectedGear} onAddNewGear={() => setShowGearAdditionModal(true)}/>
                </Accordion>
                <Accordion title="Select Bean" isCompleted={selectedBean} isRequired={true}>
                    <CoffeeBeanSelector coffeeBeanList={coffeeBeanList} selectedBean={selectedBean} setSelectedBean={setSelectedBean} onAddNewCoffee={() => setShowCoffeeAdditionModal(true)} />
                </Accordion>
                <Accordion title="Grind Size" isCompleted={grindSize.steps !== 0} isRequired={true}>
                    <GrindSizeInput grindSize={grindSize} setGrindSize={setGrindSize} />
                </Accordion>
                <Accordion title="Water Temperature" isCompleted={waterTemp} isRequired={false}>
                    <TemperatureInput waterTemp={waterTemp} setWaterTemp={setWaterTemp} waterTempUnit={waterTempUnit} setWaterTempUnit={setWaterTempUnit} />
                </Accordion>
                <Accordion title="Recipe Steps" isCompleted={steps.length > 0} isRequired={true}>
                    <div className="flex items-center justify-between my-4 ml-2">
                        <span className="font-medium text-gray-700">Is this recipe timed?</span>
                        <div className="relative inline-block w-14 h-8" onClick={() => setIsTimed(prev => !prev)}>
                            <span className={`absolute left-0 top-0 right-0 bottom-0 transition-colors duration-300 ease-in-out rounded-full ${isTimed ? 'bg-blue-600' : 'bg-gray-600'}`} />
                            <span className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow transition-transform duration-300 ease-in-out ${isTimed ? 'transform translate-x-6' : ''}`} />
                        </div>
                    </div>
                    <RecipeStepForm steps={steps} setSteps={setSteps} />
                </Accordion>
                <Accordion title="Tasting Notes" isCompleted={tastingNotes.length > 0} isRequired={false}>
                    <TastingNotesInput tastingNotes={tastingNotes} setTastingNotes={setTastingNotes} />
                </Accordion>
                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full px-4 py-2 text-white font-semibold rounded-md ${isFormValid ? 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : 'bg-blue-300'}`}
                >
                    Submit Recipe
                </button>
            </form>
            {showGearAdditionModal && (
                <GearAdditionModal isOpen={showGearAdditionModal} onClose={() => setShowGearAdditionModal(false)} getApiProfile={updateGearList} />
            )} 
            {showCoffeeAdditionModal && (
                <CoffeeBeanAdditionModal isOpen={showCoffeeAdditionModal} onClose={() => setShowCoffeeAdditionModal(false)} updateCoffeeBeanList={updateCoffeeBeanList} />
            )} 
        </div>
    );
}
