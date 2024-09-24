import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utilities/auth-context';
import { getCalculatedRecipe, clearCalculatedRecipe } from '../../services/localStorageUtils';
import { fetchRecipeById, updateRecipe, addRecipe } from '../../services/recipe-api';
import { fetchUserGear } from '../../services/gear-api';
import {Accordion} from '../../pages/RecipeCreationPage/RecipeCreationPage';
import GearSelector from '../../components/RecipeCreation/GearSelector';
import CoffeeBeanSelector from '../../components/RecipeCreation/CoffeeBeanSelector';
import GrindSizeInput from '../../components/RecipeCreation/GrindSizeInput';
import TemperatureInput from '../../components/RecipeCreation/TemperatureInput';
import FlowRateInput from '../../components/RecipeCreation/FlowRateInput';
import RecipeStepForm from '../../components/RecipeCreation/RecipeStepForm';
import TastingNotesInput from '../../components/RecipeCreation/TastingNotesInput';
import JournalInput from '../../components/RecipeCreation/JournalInput';
import GearAdditionModal from '../../components/GearAddition/GearAdditionModal';
import CoffeeBeanAdditionModal from '../../components/CoffeeBeanAddition/CoffeeBeanAdditionModal';

const RecipeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  // States for all recipe fields
  const [name, setName] = useState('');
  const [isRatio, setIsRatio] = useState(false);
  const [coffeeAmount, setCoffeeAmount] = useState(0);
  const [selectedGear, setSelectedGear] = useState([]);
  const [selectedBean, setSelectedBean] = useState(null);
  const [grindSize, setGrindSize] = useState({ steps: 0, microsteps: 0, description: '' });
  const [waterTemp, setWaterTemp] = useState('');
  const [waterTempUnit, setWaterTempUnit] = useState('Celsius');
  const [flowRate, setFlowRate] = useState(0);
  const [steps, setSteps] = useState([]);
  const [tastingNotes, setTastingNotes] = useState([]);
  const [journal, setJournal] = useState('');

  // States for available gear and coffee beans
  const [availableGear, setAvailableGear] = useState([]);
  const [availableCoffeeBeans, setAvailableCoffeeBeans] = useState([]);

  const [showGearAdditionModal, setShowGearAdditionModal] = useState(false);
  const [showCoffeeAdditionModal, setShowCoffeeAdditionModal] = useState(false);

  useEffect(() => {
    const loadRecipeAndResources = async () => {
      setIsLoading(true);
      try {
        // Load recipe data
        let loadedRecipe;
        const calculatedRecipe = getCalculatedRecipe();
        if (calculatedRecipe) {
          loadedRecipe = calculatedRecipe;
          setIsCalculated(true);
        } else {
          loadedRecipe = await fetchRecipeById(id);
        }
        
        // Set recipe data to state
        setRecipe(loadedRecipe);
        setName(loadedRecipe.name);
        setIsRatio(loadedRecipe.type === 'Ratio');
        setCoffeeAmount(loadedRecipe.coffeeAmount);
        setSelectedGear(loadedRecipe.gear.map(g => g._id));
        setSelectedBean(loadedRecipe.coffeeBean);
        setGrindSize(loadedRecipe.grindSize);
        setWaterTemp(loadedRecipe.waterTemperature);
        setWaterTempUnit(loadedRecipe.waterTemperatureUnit);
        setFlowRate(loadedRecipe.flowRate);
        setSteps(loadedRecipe.steps);
        setTastingNotes(loadedRecipe.tastingNotes);
        setJournal(loadedRecipe.journal);

        setIsOwner(loadedRecipe.userID._id === user._id);

        // Load available gear and coffee beans
        const gearList = await fetchUserGear();
        // const beanList = await fetchCoffeeBeans();
        setAvailableGear(gearList);
        // setAvailableCoffeeBeans(beanList);
      } catch (err) {
        console.error('Failed to load recipe or resources:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipeAndResources();
  }, [id, user._id]);

  useEffect(() => {
    if (isCalculated && recipe) {
      clearCalculatedRecipe();
      console.log('Cleared calculated recipe from local storage');
    }
  }, [isCalculated, recipe]);

  const updateGearList = async () => {
    const updatedGearList = await fetchUserGear();
    setAvailableGear(updatedGearList);
};

  const handleSubmit = async (e, saveAsNew = false) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const recipeData = {
      name,
      gear: selectedGear,
      coffeeBean: selectedBean._id,
      grindSize,
      coffeeAmount,
      waterTemperature: waterTemp,
      waterTemperatureUnit: waterTempUnit,
      flowRate,
      steps,
      tastingNotes,
      journal,
      type: isRatio ? 'Ratio' : 'Explicit',
    };

    try {
      let result;
      if (isOwner && !saveAsNew) {
        result = await updateRecipe(recipe._id, recipeData);
      } else {
        delete recipeData._id;
        result = await addRecipe(recipeData);
      }
      if (result.success) {
        navigate(`/recipes/${result.recipeId}`);
      }
    } catch (err) {
      console.error('Failed to save recipe:', err);
      setError('Failed to save recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name.trim() && selectedGear.length > 0 && coffeeAmount > 0 && steps.length > 0;

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!recipe) return <div className="text-center mt-8">No recipe found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isOwner ? 'Edit Recipe' : 'Save New Recipe Copy'}
      </h1>
      {isCalculated && (
        <p className="text-center text-blue-600 mb-4">
          You're editing a calculated version of this recipe.
        </p>
      )}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Recipe Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <Accordion title="Coffee Amount" isCompleted={coffeeAmount > 0} isRequired={true}>
          {isRatio ? (
            <div>
                <label className="block text-sm font-medium text-gray-700">Coffee Amount (Ratio)</label>
                <input
                    type="number"
                    value={coffeeAmount}
                    onChange={(e) => setCoffeeAmount(parseFloat(e.target.value) || '')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter coffee amount as part of a ratio (e.g., if the ratio of the total brew volume to coffee is 15:1 then enter 1)"
                    required
                />
            </div>
          ) : (
            <div>
                <label className="block text-sm font-medium text-gray-700">Coffee Amount (grams)</label>
                <input
                    type="number"
                    value={coffeeAmount}
                    onChange={(e) => setCoffeeAmount(parseFloat(e.target.value) || '')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter coffee amount in grams"
                    required
                />
            </div>
        )}
        </Accordion>

        <Accordion title="Select Gear" isCompleted={selectedGear.length > 0} isRequired={true}>
          <GearSelector 
            gear={availableGear} 
            selectedGear={selectedGear} 
            setSelectedGear={setSelectedGear} 
            onAddNewGear={() => setShowGearAdditionModal(true)}
          />
        </Accordion>

        <Accordion title="Select Bean" isCompleted={selectedBean} isRequired={true}>
          <CoffeeBeanSelector 
            selectedBean={selectedBean} 
            setSelectedBean={setSelectedBean} 
            onAddNewCoffee={() => setShowCoffeeAdditionModal(true)}
          />
        </Accordion>

        <Accordion title="Grind Size" isCompleted={grindSize.steps !== 0} isRequired={true}>
          <GrindSizeInput grindSize={grindSize} setGrindSize={setGrindSize} />
        </Accordion>

        <Accordion title="Water Temperature" isCompleted={waterTemp} isRequired={false}>
          <TemperatureInput 
            waterTemp={waterTemp} 
            setWaterTemp={setWaterTemp} 
            waterTempUnit={waterTempUnit} 
            setWaterTempUnit={setWaterTempUnit} 
          />
        </Accordion>

        <Accordion title="Flow Rate" isCompleted={flowRate > 0} isRequired={false}>
          <FlowRateInput flowRate={flowRate} setFlowRate={setFlowRate} />
        </Accordion>

        <Accordion title="Recipe Steps" isCompleted={steps.length > 0} isRequired={true}>
          <RecipeStepForm steps={steps} setSteps={setSteps} isRatio={isRatio} />
        </Accordion>

        <Accordion title="Tasting Notes" isCompleted={tastingNotes.length > 0} isRequired={false}>
          <TastingNotesInput tastingNotes={tastingNotes} setTastingNotes={setTastingNotes} />
        </Accordion>

        <Accordion title="Journal" isCompleted={journal.length > 0} isRequired={false}>
          <JournalInput journal={journal} setJournal={setJournal} />
        </Accordion>

        <div className="flex justify-between">
          {isOwner && (
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={!isFormValid}
            >
              Update Recipe
            </button>
          )}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={!isFormValid}
          >
            Save as New Copy
          </button>
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
      {showGearAdditionModal && (
                <GearAdditionModal 
                isOpen={showGearAdditionModal} 
                onClose={() => setShowGearAdditionModal(false)} 
                getApiProfile={updateGearList} />
      )} 
      {showCoffeeAdditionModal && (
          <CoffeeBeanAdditionModal 
          isOpen={showCoffeeAdditionModal} 
          onClose={() => setShowCoffeeAdditionModal(false)} 
          // updateCoffeeBeanList={updateCoffeeBeanList} 
          />
      )} 
    </div>
  );
};

export default RecipeEditPage;