import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../utilities/auth-context';
import { 
  getCalculatedRecipe, 
  clearCalculatedRecipe,
  getBrewingVersionInfo
} from '../../services/localStorageUtils';
import { 
  fetchRecipeById, 
  updateRecipe, 
  addRecipe,
  createNewVersion,
  createBranchVersion,
  copyRecipeWithVersion,
  isCurrentVersion,
  calculateRecipeChanges
} from '../../services/recipe-api';
import { fetchUserGear } from '../../services/gear-api';
import { Accordion } from '../../pages/RecipeCreationPage/RecipeCreationPage';
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
import { GitBranch, GitCommit, AlertCircle, Copy } from 'lucide-react';

const RecipeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Extract action information from URL
  const fromBrew = searchParams.get('from') === 'brew';
  const isCalculated = searchParams.get('calculated') === 'true';
  const createCopy = searchParams.get('copy') === 'true';
  const sourceVersion = searchParams.get('version');
  
  // Recipe and version state
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isCalculatedRecipe, setIsCalculatedRecipe] = useState(false);
  const [sourceIsCurrentVersion, setSourceIsCurrentVersion] = useState(false);
  const [versionActionRequired, setVersionActionRequired] = useState(false);
  const [versionActionType, setVersionActionType] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialRecipeData, setInitialRecipeData] = useState(null);

  // Form state for recipe fields
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

  // Available resources state
  const [availableGear, setAvailableGear] = useState([]);
  const [availableCoffeeBeans, setAvailableCoffeeBeans] = useState([]);

  // UI state
  const [showGearAdditionModal, setShowGearAdditionModal] = useState(false);
  const [showCoffeeAdditionModal, setShowCoffeeAdditionModal] = useState(false);
  const [versionBanner, setVersionBanner] = useState({
    show: false,
    type: 'info',
    message: ''
  });
  
  // Check if source version is current version
  const checkVersionStatus = useCallback(async (recipeId, version) => {
    if (!recipeId || !version) return false;
    
    try {
      const result = await isCurrentVersion(recipeId, version);
      return result.isCurrent;
    } catch (error) {
      console.error('Error checking version status:', error);
      return false;
    }
  }, []);

  // Load recipe and resources
  useEffect(() => {
    const loadRecipeAndResources = async () => {
      setIsLoading(true);
      try {
        // Determine which recipe data to use
        let loadedRecipe;
        let calculatedData = null;
        
        if (fromBrew && isCalculated) {
          // Get calculated recipe from local storage if coming from brewing flow
          let localStorageRecipe = getCalculatedRecipe();
          calculatedData = localStorageRecipe.recipe
          if (calculatedData) {
            loadedRecipe = calculatedData;
            setIsCalculatedRecipe(true);
            setHasChanges(true)
          } else {
            // Fallback to API if local storage doesn't have data
            loadedRecipe = await fetchRecipeById(id, sourceVersion);
          }
        } else {
          // Otherwise fetch recipe normally with version if specified
          loadedRecipe = await fetchRecipeById(id, sourceVersion);
        }
        
        // Check if this is a current version (affects version creation decisions)
        if (sourceVersion) {
          const isCurrent = await checkVersionStatus(id, sourceVersion);
          setSourceIsCurrentVersion(isCurrent);
          
          // Set version banner for non-current versions
          if (!isCurrent) {
            setVersionBanner({
              show: true,
              type: 'warning',
              message: `You're editing an older version (v${sourceVersion}). Changes will create a branch.`
            });
          }
        }
        
        // Determine if version action is required based on context
        if (fromBrew && isCalculated) {
          setVersionActionRequired(true);
          // Owner of current version → main version
          // Owner of older version → branch version
          // Non-owner → copy
          if (!user || (loadedRecipe.userID._id !== user._id)) {
            setVersionActionType('copy');
          } else if (sourceIsCurrentVersion) {
            setVersionActionType('main');
          } else {
            setVersionActionType('branch');
          }
        }
        
        // Set recipe data
        setRecipe(loadedRecipe);
        
        // Populate form with recipe data
        setName(loadedRecipe.name);
        setIsRatio(loadedRecipe.type === 'Ratio');
        setCoffeeAmount(loadedRecipe.coffeeAmount);
        setSelectedGear(loadedRecipe?.gear?.map(g => g._id));
        setSelectedBean(loadedRecipe.coffeeBean);
        setGrindSize(loadedRecipe.grindSize);
        setWaterTemp(loadedRecipe.waterTemperature);
        setWaterTempUnit(loadedRecipe.waterTemperatureUnit);
        setFlowRate(loadedRecipe.flowRate);
        setSteps(loadedRecipe.steps);
        setTastingNotes(loadedRecipe.tastingNotes);
        setJournal(loadedRecipe.journal);

        // Store initial recipe data for change detection
        setInitialRecipeData({
          name: loadedRecipe.name,
          type: loadedRecipe.type,
          coffeeAmount: loadedRecipe.coffeeAmount,
          gear: loadedRecipe.gear.map(g => g._id),
          coffeeBean: loadedRecipe.coffeeBean._id,
          grindSize: loadedRecipe.grindSize,
          waterTemperature: loadedRecipe.waterTemperature,
          waterTemperatureUnit: loadedRecipe.waterTemperatureUnit,
          flowRate: loadedRecipe.flowRate,
          steps: loadedRecipe.steps,
          tastingNotes: loadedRecipe.tastingNotes,
          journal: loadedRecipe.journal
        });

        // Check ownership
        setIsOwner(loadedRecipe.userID._id === user?._id);

        // Load available gear and coffee beans
        const gearList = await fetchUserGear();
        setAvailableGear(gearList);
        
        // Clear calculated recipe now that we've used it
        if (calculatedData) {
          clearCalculatedRecipe();
        }
      } catch (err) {
        console.error('Failed to load recipe or resources:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipeAndResources();
  }, [id, sourceVersion, fromBrew, isCalculated, user, checkVersionStatus]);

  // Check for changes whenever form fields update
  useEffect(() => {
    if (initialRecipeData) {

        if (isCalculatedRecipe) {
            setHasChanges(true);
            return; // Skip the comparison logic
          }
        const currentData = {
            name,
            type: isRatio ? 'Ratio' : 'Explicit',
            coffeeAmount,
            gear: selectedGear,
            coffeeBean: selectedBean?._id,
            grindSize,
            waterTemperature: waterTemp,
            waterTemperatureUnit: waterTempUnit,
            flowRate,
            steps,
            tastingNotes,
            journal
        };
        
        // Deep comparison would be better, but for simplicity:
        const formChanged = 
            name !== initialRecipeData.name ||
            isRatio !== (initialRecipeData.type === 'Ratio') ||
            coffeeAmount !== initialRecipeData.coffeeAmount ||
            JSON.stringify(selectedGear.sort()) !== JSON.stringify([...initialRecipeData.gear].sort()) ||
            selectedBean?._id !== initialRecipeData.coffeeBean ||
            JSON.stringify(grindSize) !== JSON.stringify(initialRecipeData.grindSize) ||
            waterTemp !== initialRecipeData.waterTemperature ||
            waterTempUnit !== initialRecipeData.waterTemperatureUnit ||
            flowRate !== initialRecipeData.flowRate ||
            JSON.stringify(steps) !== JSON.stringify(initialRecipeData.steps) ||
            JSON.stringify(tastingNotes.sort()) !== JSON.stringify([...initialRecipeData.tastingNotes].sort()) ||
            journal !== initialRecipeData.journal;
        
        setHasChanges(formChanged);
    }
  }, [
    initialRecipeData, name, isRatio, coffeeAmount, selectedGear, 
    selectedBean, grindSize, waterTemp, waterTempUnit, flowRate, 
    steps, tastingNotes, journal
  ]);

  const updateGearList = async () => {
    const updatedGearList = await fetchUserGear();
    setAvailableGear(updatedGearList);
  };

  // Handle form submission
  const handleSubmit = async (e, actionOverride = null) => {
    e.preventDefault();
    
    // Don't proceed if no changes (except for copy action)
    if (!hasChanges && actionOverride !== 'copy' && !createCopy) {
      setError('No changes detected. Make some changes before saving.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // Prepare recipe data for submission
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

    // Determine action type (use override if provided)
    const action = actionOverride || versionActionType || (createCopy ? 'copy' : (isOwner ? (sourceIsCurrentVersion ? 'main' : 'branch') : 'copy'));

    try {
      let result;
      
      // Different API calls based on action type
      switch (action) {
        case 'main':
          // Create main version (only if owner and source is current version)
          if (!isOwner) {
            throw new Error('Not authorized to create main version');
          }
          
          // Calculate changes if from brew calculation
          const changes = fromBrew && isCalculatedRecipe 
            ? calculateRecipeChanges(recipe, recipeData)
            : [];
            
          result = await createNewVersion(
            recipe._id, 
            recipeData,
            changes
          );
          
          navigate(`/recipes/${recipe._id}`);
          break;
          
        case 'branch':
          // Create branch version (if owner and source is not current version)
          if (!isOwner) {
            throw new Error('Not authorized to create branch version');
          }
          
          result = await createBranchVersion(
            recipe._id,
            recipeData,
            sourceVersion || recipe.versionInfo?.version || recipe.currentVersion,
            []
          );
          
          navigate(`/recipes/${recipe._id}?version=${result.version}`);
          break;
          
        case 'copy':
          // Create copy (for anyone)
          result = await copyRecipeWithVersion(
            recipe._id, 
            sourceVersion || recipe.versionInfo?.version || recipe.currentVersion
          );
          
          navigate(`/recipes/${result.recipe._id}`);
          break;
          
        default:
          // Regular update (legacy flow - should rarely happen with versioning)
          if (isOwner) {
            result = await updateRecipe(recipe._id, recipeData);
            navigate(`/recipes/${recipe._id}`);
          } else {
            result = await addRecipe(recipeData);
            navigate(`/recipes/${result.recipeId}`);
          }
      }
    } catch (err) {
      console.error('Failed to save recipe:', err);
      setError(err.message || 'Failed to save recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name.trim() && selectedGear.length > 0 && coffeeAmount > 0 && steps.length > 0 && selectedBean;

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!recipe) return <div className="text-center mt-8">No recipe found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isOwner ? 'Edit Recipe' : 'Save New Recipe Copy'}
      </h1>
      
      {/* Version action banner */}
      {versionBanner.show && (
        <div className={`mb-6 p-4 rounded-lg ${
          versionBanner.type === 'warning' 
            ? 'bg-amber-50 border border-amber-200' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center">
            <AlertCircle className={`mr-2 ${
              versionBanner.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
            }`} size={20} />
            <p className={versionBanner.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}>
              {versionBanner.message}
            </p>
          </div>
        </div>
      )}
      
      {/* No changes warning */}
      {!hasChanges && !createCopy && !versionActionRequired && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="mr-2 text-amber-500" size={20} />
            <p className="text-amber-800">
              No changes detected. Make changes before saving to create a new version.
            </p>
          </div>
        </div>
      )}
      
      {/* Version action buttons for calculated recipes */}
      {versionActionRequired && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-lg mb-2">Save Brewing Changes</h3>
          <p className="text-gray-700 mb-4">
            How would you like to save the changes you made during brewing?
          </p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {/* Main version button - only if owner and source is current version */}
            {isOwner && sourceIsCurrentVersion && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'main')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
              >
                <GitCommit size={18} />
                <span>Create New Main Version</span>
              </button>
            )}
            
            {/* Branch version button - only if owner and source is not current version */}
            {isOwner && !sourceIsCurrentVersion && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'branch')}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg"
              >
                <GitBranch size={18} />
                <span>Create Branch Version</span>
              </button>
            )}
            
            {/* Copy button - always available */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'copy')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg"
            >
              <Copy size={18} />
              <span>Save as New Copy</span>
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
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

        {/* Form submission buttons */}
        <div className="flex justify-between">
          {!versionActionRequired && (
            <button
              type="submit"
              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !isFormValid || (!hasChanges && !createCopy) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              disabled={!isFormValid || (!hasChanges && !createCopy)}
            >
              {isOwner 
                ? sourceIsCurrentVersion 
                  ? "Update Recipe" 
                  : "Create Branch Version"
                : "Save as Copy"
              }
            </button>
          )}
          
          <button
            type="button"
            onClick={() => navigate(-1)}
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
          getApiProfile={updateGearList} 
        />
      )} 
      
      {showCoffeeAdditionModal && (
        <CoffeeBeanAdditionModal 
          isOpen={showCoffeeAdditionModal} 
          onClose={() => setShowCoffeeAdditionModal(false)} 
        />
      )} 
    </div>
  );
};

export default RecipeEditPage;