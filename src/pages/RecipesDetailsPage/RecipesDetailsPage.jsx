import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBalanceScale, faRuler, faWeight, faFlask, faThermometerHalf, faTint, faBlender, faWineGlass, faBook, faSeedling, faCubesStacked, faVideo, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import AnimatedTimeline from '../../components/RecipeDetails/AnimatedTimeline';
import BookmarkButton from '../../components/RecipeIndex/BookmarkButton';
import { useAuth } from '../../utilities/auth-context';
import { fetchRecipeById, fetchVersionHistory } from '../../services/recipe-api';
import { VersionHistory } from '../../components/RecipeDetails/VersionHistory';
import { GitBranch } from 'lucide-react';

const MemoizedAnimatedTimeline = React.memo(AnimatedTimeline);

export default function RecipeOverviewPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [versions, setVersions] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [error, setError] = useState(null);
    const { user, userProfile } = useAuth();

    

    // useEffect(() => {
    //     async function loadRecipe() {
    //         try {
    //             const fetchedRecipe = await fetchRecipeById(id);
    //             setRecipe(fetchedRecipe);
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.error('Failed to fetch recipe:', error);
    //             setError('Failed to load recipe');
    //             setIsLoading(false);
    //         }
    //     }

    //     loadRecipe();
    // }, [id]);
    useEffect(() => {
        async function loadRecipeAndVersions() {
            try {
                setIsLoading(true);
                const [recipeData, versionHistory] = await Promise.all([
                    fetchRecipeById(id, selectedVersion),
                    fetchVersionHistory(id)
                ]);
                
                setRecipe(recipeData);
                setVersions(versionHistory.versions);
                
                if (!selectedVersion) {
                    setSelectedVersion(recipeData.versionInfo.version);
                }
                
                setError(null);
            } catch (err) {
                console.error('Error loading recipe:', err);
                setError('Failed to load recipe');
            } finally {
                setIsLoading(false);
            }
        }

        loadRecipeAndVersions();
    }, [id, selectedVersion]);

    const handleVersionSelect = async (version) => {
        setSelectedVersion(version);
    };

    const brewVolume = useMemo(() => {
        if (!recipe) return 0;
        return recipe.steps.reduce((total, step) => {
            return step.waterAmount ? total + step.waterAmount : total;
        }, 0);
    }, [recipe]);

    const getGearIcon = useCallback((gearType) => {
        switch (gearType) {
            case 'Brewer':
                return (
                    <FontAwesomeIcon
                        icon={faVideo}
                        className="mr-2"
                        style={{ transform: 'rotate(270deg)' }}
                    />
                );
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
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
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
        versionInfo
    } = recipe;

    const isOwner = user && userID._id === user._id;
    const hasMultipleVersions = versions.length > 1;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            {hasMultipleVersions && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Version:</span>
                        <span className="font-medium">v{versionInfo.version}</span>
                        {!versionInfo.version.endsWith('.0') && (
                            <GitBranch className="h-4 w-4 text-green-500" />
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
                        currentVersion={versionInfo.version}
                        onVersionSelect={handleVersionSelect}
                    />
                </div>
            )}
        {/* Title section with true centering */}
            <div className="min-h-[48px] relative flex items-start mb-2">
                {/* Left spacer - only visible when authenticated */}
                {user && userProfile && <div className="w-[44px] flex-shrink-0" />}
                
                {/* Title container */}
                <div className="flex-1 text-center">
                    <h1 className="text-3xl font-bold break-words">{name}</h1>
                </div>
                
                {/* Right bookmark container */}
                <div className="relative z-10">
                    <BookmarkButton recipeId={id} />
                </div>
            </div>

            {/* Brew Button section */}
            <div className="flex justify-end w-full mb-6">
                <Link 
                    to={`/calculate/${id}`} 
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Brew Recipe
                </Link>
            </div>
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
                        <p className="text-sm font-semibold ">Bean</p>
                        <p className="text-sm">{coffeeBean.roaster}, {coffeeBean.origin}, {coffeeBean.roastLevel}{coffeeBean.process ? `, ${coffeeBean.process}` : ''}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-gray-100 text-gray-800 p-3 rounded-lg shadow-md w-full sm:w-auto sm:px-[1.375rem]">
                    <FontAwesomeIcon icon={faCubesStacked} className="mr-2" />
                    <div>
                        <p className="text-sm font-semibold">Grind Size</p>
                        <p className="text-sm">Steps: {grindSize.steps}</p>
                        {grindSize.microsteps != null && grindSize.microsteps !== 0 && (
                            <p className="text-xs">Microsteps: {grindSize.microsteps}</p>
                        )}
                        {grindSize.description && <p className="text-sm">Description: {grindSize.description}</p>}
                    </div>
                </div>
            </div>

            {tastingNotes.length > 0 && (
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

            {gear && gear.length > 0 && (
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
                    <MemoizedAnimatedTimeline steps={recipe.steps} />
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