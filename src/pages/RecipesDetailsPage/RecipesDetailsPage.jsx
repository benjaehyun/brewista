import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCoffee, faTint, faEquals, faBlender, faWineGlass, 
  faBook, faSeedling, faCubesStacked, faVideo, faLayerGroup,
  faThermometerHalf, faFlask, faWeight, faBalanceScale, faUser,
  faRuler
} from '@fortawesome/free-solid-svg-icons';
import { fetchRecipeById, fetchVersionHistory } from '../../services/recipe-api';
import AnimatedTimeline from '../../components/RecipeDetails/AnimatedTimeline';
import BookmarkButton from '../../components/RecipeIndex/BookmarkButton';
import { useAuth } from '../../utilities/auth-context';
import { GitBranch, Clock, AlertCircle, GitCommit } from 'lucide-react';

// Version History Component
function VersionHistory({ versions, currentVersion, onVersionSelect }) {
    // Group versions by major version
    const groupedVersions = versions.reduce((acc, ver) => {
        const [major] = ver.version.split('.');
        if (!acc[major]) acc[major] = [];
        acc[major].push(ver);
        return acc;
    }, {});

    // Sort versions within groups
    Object.keys(groupedVersions).forEach(major => {
        groupedVersions[major].sort((a, b) => {
            const [, minorA] = a.version.split('.');
            const [, minorB] = b.version.split('.');
            return parseInt(minorB) - parseInt(minorA);
        });
    });

    // Sort major version groups
    const sortedMajors = Object.keys(groupedVersions).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Version History</h3>
            <div className="space-y-4">
                {sortedMajors.map(major => (
                    <div key={major} className="border-l-2 border-gray-200 pl-4">
                        {groupedVersions[major].map((version) => (
                            <div 
                                key={version.version}
                                className={`relative mb-4 cursor-pointer transition-colors ${
                                    version.version === currentVersion 
                                        ? 'bg-blue-50' 
                                        : 'hover:bg-gray-50'
                                } rounded-lg p-3`}
                                onClick={() => onVersionSelect(version.version)}
                            >
                                {/* Version indicator line */}
                                <div className="absolute -left-[21px] top-1/2 transform -translate-y-1/2">
                                    {version.version.endsWith('.0') ? (
                                        <GitCommit className="w-5 h-5 text-blue-500" />
                                    ) : (
                                        <GitBranch className="w-5 h-5 text-green-500" />
                                    )}
                                </div>

                                {/* Version content */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">v{version.version}</span>
                                            {version.version === currentVersion && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {version.createdBy?.username || 'Unknown'} • {
                                                new Date(version.createdAt).toLocaleDateString()
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Changes */}
                                {version.changes?.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {version.changes.map((change, idx) => (
                                            <div key={idx} className="text-sm text-gray-600">
                                                • {change.description}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Parent version reference */}
                                {version.parentVersion && (
                                    <div className="mt-2 text-xs text-gray-500">
                                        Branched from v{version.parentVersion}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

const MemoizedAnimatedTimeline = React.memo(AnimatedTimeline);

export default function RecipeDetailsPage() {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // State for recipe and versions
    const [recipe, setRecipe] = useState(null);
    const [versions, setVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Get version from URL query param or use null for current version
    const versionParam = searchParams.get('version');

    // Load recipe and version history
    useEffect(() => {
        async function loadRecipeAndVersions() {
            try {
                setIsLoading(true);
                setError(null);
                
                // Fetch both recipe and version history in parallel
                const [recipeData, versionHistory] = await Promise.all([
                    fetchRecipeById(id, versionParam),
                    fetchVersionHistory(id)
                ]);
                
                setRecipe(recipeData);
                setVersions(versionHistory.versions || []);
                
                // Auto-open version history if URL has version parameter
                if (versionParam) {
                    setIsVersionHistoryOpen(true);
                }
            } catch (err) {
                console.error('Error loading recipe data:', err);
                setError('Failed to load recipe data');
            } finally {
                setIsLoading(false);
            }
        }
        
        loadRecipeAndVersions();
    }, [id, versionParam]);

    // Handle version selection
    const handleVersionSelect = useCallback((version) => {
        if (!recipe) return;
        
        // Update URL with version parameter
        if (version === recipe.currentVersion) {
            // Remove version param if selecting current version
            setSearchParams({});
        } else {
            setSearchParams({ version });
        }
    }, [recipe, setSearchParams]);

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

    // Determine if recipe has different versions available
    const hasMultipleVersions = versions.length > 1;
    
    // Determine if viewing a non-current version
    const isViewingOldVersion = versionParam && versionParam !== (currentVersion || versionInfo?.version);

    // Determine if current user is recipe owner
    const isOwner = user && userID._id === user._id;

    // Calculate brew volume
    const brewVolume = steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    // Helper function for the gear icon
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
            {/* Version Warning Banner when viewing old version */}
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

            {/* Version Bar */}
            {hasMultipleVersions && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Version:</span>
                        <span className="font-medium">v{versionInfo?.version}</span>
                        {versionInfo?.version && !versionInfo.version.endsWith('.0') && (
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
                        onClick={() => setIsVersionHistoryOpen(!isVersionHistoryOpen)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        {isVersionHistoryOpen ? 'Hide History' : 'Show History'}
                    </button>
                </div>
            )}

            {/* Version History Panel */}
            {isVersionHistoryOpen && (
                <div className="mb-6">
                    <VersionHistory
                        versions={versions}
                        currentVersion={versionParam || currentVersion || versionInfo?.version}
                        onVersionSelect={handleVersionSelect}
                    />
                </div>
            )}

            {/* Recipe Title Section */}
            <div className="min-h-[48px] relative flex items-start mb-2">
                {/* Left spacer - only visible when authenticated */}
                {user && <div className="w-[44px] flex-shrink-0" />}
                
                {/* Title container */}
                <div className="flex-1 text-center">
                    <h1 className="text-3xl font-bold break-words">{name}</h1>
                    {versionInfo?.parentVersion && (
                        <div className="text-sm text-gray-500 mt-1">
                            Branched from version {versionInfo.parentVersion}
                        </div>
                    )}
                </div>
                
                {/* Right bookmark container */}
                <div className="relative z-10">
                    <BookmarkButton recipeId={id} />
                </div>
            </div>

            {/* Brew Button section */}
            <div className="flex justify-end w-full mb-6">
                <button
                    onClick={() => navigate(`/calculate/${id}${versionParam ? `?version=${versionParam}` : ''}`)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Brew Recipe
                </button>
            </div>

            {/* Recipe Information Cards */}
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
                {!isLoading && recipe?.steps && (
                    <MemoizedAnimatedTimeline steps={steps} />
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
        </div>
    );
}