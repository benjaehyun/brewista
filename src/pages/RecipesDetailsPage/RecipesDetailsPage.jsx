import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTint, faBlender, faWineGlass, 
  faBook, faSeedling, faCubesStacked, faVideo, faLayerGroup,
  faThermometerHalf, faFlask, faWeight, faBalanceScale, faUser,
  faRuler
} from '@fortawesome/free-solid-svg-icons';
import { 
  fetchRecipeById, 
  fetchVersionHistory,
  compareVersions 
} from '../../services/api/recipe-api';
import AnimatedTimeline from '../../components/RecipeDetails/AnimatedTimeline';
import BookmarkButton from '../../components/RecipeIndex/BookmarkButton';
import { useAuth } from '../../utilities/auth-context';
import { 
  GitBranch, 
  Clock, 
  AlertCircle, 
  History,
  Tag,
  Loader
} from 'lucide-react';
import { VersionHistory } from '../../components/RecipeDetails/VersionHistory';

export default function RecipesDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [recipe, setRecipe] = useState(null);
    const [versions, setVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [isVersionHistoryLoading, setIsVersionHistoryLoading] = useState(false);
    const [isVersionLoading, setIsVersionLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Use refs to help prevent redundant API calls
    const lastFetchedVersionRef = useRef(null);
    const isMountingRef = useRef(true);

    // version from URL query param or use null if its current version
    const versionParam = searchParams.get('version');

    // get initial recipe data only on component mount or when id changes
    useEffect(() => {
        async function initialLoad() {
            try {
                setIsLoading(true);
                setError(null);
                
                const recipeData = await fetchRecipeById(id, versionParam);
                setRecipe(recipeData);
                
                // tracj the version we just fetched
                lastFetchedVersionRef.current = versionParam;
                
                // open version history by default if URL has version parameter ie. we're not on the current vers
                if (versionParam) {
                    setIsVersionHistoryOpen(true);
                }
            } catch (err) {
                console.error('Error loading recipe data:', err);
                setError('Failed to load recipe data');
            } finally {
                setIsLoading(false);
                isMountingRef.current = false;
            }
        }
        
        initialLoad();
    }, [id]); // only load with id since subsequent calls are handled for versions

    // load version history separately when explicitly called
    const loadVersionHistory = useCallback(async () => {
        // stop fetch call if already loaded
        if (versions.length > 0) return;
        
        try {
            setIsVersionHistoryLoading(true);
            const versionHistory = await fetchVersionHistory(id);
            setVersions(versionHistory.versions || []);
        } catch (err) {
            console.error('Error loading version history:', err);
        } finally {
            setIsVersionHistoryLoading(false);
        }
    }, [id, versions.length]);

    const toggleVersionHistory = useCallback(() => {
        const newState = !isVersionHistoryOpen;
        setIsVersionHistoryOpen(newState);
        
        // load version history if opening and not loaded yet
        if (newState && versions.length === 0) {
            loadVersionHistory();
        }
    }, [isVersionHistoryOpen, versions.length, loadVersionHistory]);

    // Handle version selection  with safeguards against redundant fetches
    const handleVersionSelect = useCallback(async (version) => {
        if (!recipe) return;
        
        // dont do anything if we're already on the version clicked
        if (version === lastFetchedVersionRef.current) return;
        
        try {
            setIsVersionLoading(true);
            
            // update URL parameter without WITH the refs so that we can conditionally fetch
            if (version === recipe.currentVersion) {
                setSearchParams({});
                lastFetchedVersionRef.current = null;
            } else {
                setSearchParams({ version });
                lastFetchedVersionRef.current = version;
            }
            
            // Fetch the specific version directly (only if it's different from current)
            const versionToFetch = version === recipe.currentVersion ? null : version;
            const recipeData = await fetchRecipeById(id, versionToFetch);
            setRecipe(recipeData);
        } catch (err) {
            console.error('Error loading version:', err);
            setError('Failed to load version data');
        } finally {
            setIsVersionLoading(false);
        }
    }, [recipe, id, setSearchParams]);
    
  
    const isViewingOldVersion = versionParam && recipe && versionParam !== (recipe.currentVersion || recipe.versionInfo?.version);
    

    const handleBrewClick = useCallback(() => {
        navigate(`/calculate/${id}${versionParam ? `?version=${versionParam}` : ''}`);
    }, [navigate, id, versionParam]);

    if (isLoading && !recipe) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }
    
    if (error) {
        return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
    }
    
    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    const {
        name,
        userID,
        coffeeBean,
        type,
        grindSize,
        coffeeAmount,
        waterTemperature,
        waterTemperatureUnit,
        flowRate,
        steps,
        tastingNotes,
        journal,
        gear,
        versionInfo,
        currentVersion, // from the recipe base document
    } = recipe;

    // current user is recipe owner
    const isOwner = user && userID._id === user._id;

    // recipe has version history
    const hasVersionHistory = versions.length > 0 || versionInfo || currentVersion;
    
    // get current version information
    const currentVersionInfo = versionParam || versionInfo?.version || currentVersion || '1.0';
    const isMainVersion = currentVersionInfo.endsWith('.0');

    // calculate brew volume
    const brewVolume = steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    // helper function for the gear icon
    const getGearIcon = (gearType) => {
        switch (gearType) {
            case 'Brewer':
                return <FontAwesomeIcon icon={faVideo} className="mr-2" style={{ transform: 'rotate(270deg)' }} />;
            case 'Paper':
                return <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />;
            case 'Grinder':
                return <FontAwesomeIcon icon={faBlender} className="mr-2" />;
            case 'Kettle':
                return <FontAwesomeIcon icon={faTint} className="mr-2" />;
            case 'Scale':
                return <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />;
            default:
                return <FontAwesomeIcon icon={faCubesStacked} className="mr-2" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            {/* version Warning Banner when viewing old version */}
            {isViewingOldVersion && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
                    <AlertCircle className="text-amber-500 mr-2 shrink-0" />
                    <div className="flex-1">
                        <p className="text-amber-800">
                            You're viewing an older version of this recipe. 
                            <button 
                                onClick={() => handleVersionSelect(currentVersion || versionInfo?.version)}
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                View current version
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* loading versions or current version selected */}
            {isVersionLoading && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-center">
                    <Loader className="animate-spin text-blue-500 mr-2" size={16} />
                    <span className="text-blue-700">Loading version data...</span>
                </div>
            )}

            {/* bar with version info */}
            {hasVersionHistory && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag size={16} className="text-blue-500" />
                        <span className="text-sm text-gray-600">Version:</span>
                        <span className="font-medium">v{currentVersionInfo}</span>
                        {!isMainVersion && (
                            <GitBranch className="h-4 w-4 text-green-500" />
                        )}
                        {versionInfo?.createdAt && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(versionInfo.createdAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={toggleVersionHistory}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                        <History size={16} />
                        {isVersionHistoryOpen ? 'Hide History' : 'Show History'}
                    </button>
                </div>
            )}

            {/* Version history dropdown */}
            {isVersionHistoryOpen && (
                <div className="mb-6">
                    {isVersionHistoryLoading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full inline-block"></div>
                            <p className="mt-2 text-gray-600">Loading version history...</p>
                        </div>
                    ) : (
                        <VersionHistory
                            versions={versions}
                            currentVersion={versionParam || currentVersion || versionInfo?.version}
                            onVersionSelect={handleVersionSelect}
                        />
                    )}
                </div>
            )}

            {/* Recipe Title Section */}
            <div className="min-h-[48px] relative flex items-start mb-2">
                {/* Left spacer - only when authenticated */}
                {user && <div className="w-[44px] flex-shrink-0" />}
                
                {/* Title  */}
                <div className="flex-1 text-center">
                    <h1 className="text-3xl font-bold break-words">{name}</h1>
                    {versionInfo?.parentVersion && (
                        <div className="text-sm text-gray-500 mt-1">
                            Branched from version {versionInfo.parentVersion}
                        </div>
                    )}
                </div>
                
                {/* Right bookmark */}
                <div className="relative z-10">
                    <BookmarkButton recipeId={id} />
                </div>
            </div>

            {/* Brew button  */}
            <div className="flex justify-end w-full mb-6">
                <button
                    onClick={handleBrewClick}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Brew Recipe
                </button>
            </div>

            {/* cards with recipe info */}
            <div className="flex flex-wrap gap-4 mb-4 items-center">
                <div className="flex items-center bg-blue-100 text-blue-800 p-3 rounded-lg shadow-md sm:p-[1.375rem]">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    <div>
                        <p className="text-sm font-semibold">Author</p>
                        <p className="text-sm">{userID.username}</p>
                    </div>
                </div>

                <div className="flex items-center bg-yellow-100 text-yellow-800 p-3 rounded-lg shadow-md sm:p-[1.375rem]">
                    <FontAwesomeIcon icon={type === 'Ratio' ? faBalanceScale : faRuler} className="mr-2" />
                    <div>
                        <p className="text-sm font-semibold">Recipe Type</p>
                        <p className="text-sm">{type}</p>
                    </div>
                </div>

                {type === 'Ratio' ? (
                    <div className="flex items-center p-3 rounded-lg shadow-md sm:p-[1.375rem]" style={{ backgroundColor: '#C9A783', color: '#5B4636' }}>
                        <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
                        <div>
                            <p className="text-sm font-semibold">Brew Ratio</p>
                            <p className="text-sm">{coffeeAmount}:{brewVolume}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center p-3 rounded-lg shadow-md sm:p-[1.375rem]" style={{ backgroundColor: '#A67B5B', color: '#F8F4F1' }}>
                            <FontAwesomeIcon icon={faWeight} className="mr-2" />
                            <div>
                                <p className="text-sm font-semibold">Coffee</p>
                                <p className="text-sm">{coffeeAmount}g</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 rounded-lg shadow-md sm:p-[1.375rem]" style={{ backgroundColor: '#D3B8AE', color: '#5B4636' }}>
                            <FontAwesomeIcon icon={faFlask} className="mr-2" />
                            <div>
                                <p className="text-sm font-semibold">Brew Volume</p>
                                <p className="text-sm">{brewVolume}mL</p>
                            </div>
                        </div>
                    </>
                )}

                {waterTemperature && (
                    <div className="flex items-center bg-red-100 text-red-800 p-3 rounded-lg shadow-md sm:p-[1.375rem]">
                        <FontAwesomeIcon icon={faThermometerHalf} className="mr-2" />
                        <div>
                            <p className="text-sm font-semibold">Water Temp.</p>
                            <p className="text-sm">{waterTemperature}°{waterTemperatureUnit}</p>
                        </div>
                    </div>
                )}

                {flowRate && (
                    <div className="flex items-center bg-teal-100 text-teal-800 p-3 rounded-lg shadow-md sm:p-[1.375rem]">
                        <FontAwesomeIcon icon={faTint} className="mr-2" />
                        <div>
                            <p className="text-sm font-semibold">Flow Rate</p>
                            <p className="text-sm">{flowRate} mL/s</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center bg-green-100 text-green-800 p-3 rounded-lg shadow-md w-full sm:w-auto sm:p-[1.375rem]">
                    <FontAwesomeIcon icon={faSeedling} className="mr-2" />
                    <div>
                        <p className="text-sm font-semibold">Bean</p>
                        <p className="text-sm">
                            {coffeeBean?.roaster}, {coffeeBean?.origin}, {coffeeBean?.roastLevel}
                            {coffeeBean?.process ? `, ${coffeeBean.process}` : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-gray-100 text-gray-800 p-3 rounded-lg shadow-md w-full sm:w-auto sm:px-[1.375rem]">
                    <FontAwesomeIcon icon={faCubesStacked} className="mr-2" />
                    <div>
                        <p className="text-sm font-semibold">Grind Size</p>
                        <p className="text-sm">Steps: {grindSize?.steps}</p>
                        {grindSize?.microsteps != null && grindSize.microsteps !== 0 && (
                            <p className="text-xs">Microsteps: {grindSize.microsteps}</p>
                        )}
                        {grindSize?.description && <p className="text-sm">Description: {grindSize.description}</p>}
                    </div>
                </div>
            </div>

            {tastingNotes?.length > 0 && (
                <div className="flex items-center bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md mb-8">
                    <FontAwesomeIcon icon={faWineGlass} className="mr-2" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold mb-4">Tasting Notes</p>
                        <div className="flex flex-wrap gap-2">
                            {tastingNotes.map((note, index) => (
                                <span key={index} className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded-full">
                                    {note}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {gear?.length > 0 && (
                <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md mb-8">
                    <p className="text-sm font-semibold mb-4">Gear</p>
                    <div className="flex flex-wrap gap-4 justify-around sm:justify-center">
                        {gear.map((item) => (
                            <div key={item._id} className="flex items-center bg-gray-200 text-gray-800 p-3 rounded-lg shadow-md">
                                {getGearIcon(item.type)}
                                <div className="text-center">
                                    <p className="text-sm font-semibold">{item.type}</p>
                                    <p className="text-sm">{item.brand} {item.model}</p>
                                    {item.modifications && (
                                        <p className="text-xs text-gray-600">{item.modifications}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-semibold mb-4">Steps</h2>
            <div className="mb-8">
                {recipe?.steps && (
                    <AnimatedTimeline steps={steps} />
                )}
            </div>

            {journal && (
                <div className="flex items-center bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md mb-8">
                    <FontAwesomeIcon icon={faBook} className="mr-2" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold">Journal</p>
                        <p className="text-sm">{journal}</p>
                    </div>
                </div>
            )}
            
            {/* Version changes section */}
            {versionInfo?.changes?.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-semibold mb-2">Changes in this version</h3>
                    <ul className="space-y-1">
                        {versionInfo.changes.map((change, index) => (
                            <li key={index} className="text-sm text-gray-700">
                                • {change.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}