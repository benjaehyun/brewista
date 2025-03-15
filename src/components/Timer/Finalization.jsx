import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utilities/auth-context';
import { saveCalculatedRecipe } from '../../services/localStorageUtils';
import { Tag, GitCommit, GitBranch } from 'lucide-react';

export default function FinalizationComponent({ recipe, calculatedRecipe }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedRecipe, setSelectedRecipe] = useState('calculated');

    const currentUser = user;
    const isAuthenticated = !!currentUser;
    const isAuthor = isAuthenticated && currentUser._id === recipe?.userID?._id;

    // Extract version information from recipe if available
    const sourceVersion = recipe?.versionInfo?.version || recipe?.currentVersion || '1.0';
    const isCurrentVersion = sourceVersion === recipe?.currentVersion;
    const isMainVersion = sourceVersion.endsWith('.0');

    const handleEditOrSave = () => {
        if (selectedRecipe === 'original') {
        // Clear any calculated recipe in storage since we're using original
        clearCalculatedRecipe();
        // Navigate to edit page with original recipe
        navigate(`/recipes/edit/${recipe._id}?from=brew&version=${sourceVersion}`);
        } else {
        // Save calculated recipe to localStorage
        const recipeToSave = {
            ...calculatedRecipe,
            _id: recipe._id,
            userID: recipe.userID,
            type: 'Explicit',
            versionInfo: {
            sourceVersion,
            sourceRecipeId: recipe._id,
            isCalculatedVariant: true,
            calculatedAt: Date.now(),
            isFromCurrentVersion: isCurrentVersion
            }
        };
        
        saveCalculatedRecipe(recipeToSave);
        
        if (isAuthor) {
            // If author, decide whether to create main or branch version in edit page
            navigate(`/recipes/edit/${recipe._id}?from=brew&calculated=true&version=${sourceVersion}`);
        } else {
            // If not author, prepare for copy creation
            navigate(`/recipes/edit/${recipe._id}?from=brew&copy=true&version=${sourceVersion}`);
        }
        }
    };

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white text-center py-4 px-6">
                <h2 className="text-2xl md:text-3xl font-bold">Brewing Complete!</h2>
                </div>
                
                <div className="p-6">
                {/* Source version info */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-600">Brewed from:</span>
                    <div className="flex items-center">
                        <Tag size={16} className="mr-1 text-blue-500" />
                        <span className="font-medium">v{sourceVersion}</span>
                        {isCurrentVersion && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Current Version
                        </span>
                        )}
                        {!isMainVersion && (
                        <div className="ml-2 flex items-center">
                            <GitBranch size={14} className="text-green-500 mr-1" />
                            <span className="text-xs text-green-600">branch</span>
                        </div>
                        )}
                    </div>
                    </div>
                </div>

                {isAuthenticated && (
                    <>
                    <p className="text-center text-gray-700 text-lg mb-6">
                        {isAuthor
                        ? "Would you like to make changes to the recipe or save a new copy?"
                        : "Would you like to save an editable copy of this recipe?"}
                    </p>
                    
                    {isAuthor && (
                        <div className="mb-6">
                        <p className="text-center text-gray-600 mb-4">Choose a recipe version:</p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio text-blue-600 h-5 w-5"
                                name="recipeVersion"
                                value="original"
                                checked={selectedRecipe === 'original'}
                                onChange={() => setSelectedRecipe('original')}
                            />
                            <span className="ml-2 text-gray-700">Original Recipe</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio text-blue-600 h-5 w-5"
                                name="recipeVersion"
                                value="calculated"
                                checked={selectedRecipe === 'calculated'}
                                onChange={() => setSelectedRecipe('calculated')}
                            />
                            <span className="ml-2 text-gray-700">Calculated Recipe</span>
                            </label>
                        </div>
                        </div>
                    )}

                    {/* Recipe action button */}
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                        <button
                        onClick={handleEditOrSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
                        >
                        {isAuthor 
                            ? (selectedRecipe === 'original' ? "Edit Original Recipe" : "Save Calculated Version")
                            : "Save as My Copy"
                        }
                        </button>
                    </div>
                    </>
                )}

                {!isAuthenticated && (
                    <p className="text-center text-gray-700 mb-6">
                    Sign in to save this brew as a new version or create a copy.
                    </p>
                )}

                <div className="flex justify-center">
                    <button
                    onClick={handleReturnHome}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
                    >
                    Return Home
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}