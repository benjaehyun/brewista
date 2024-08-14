import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeById } from '../../utilities/recipe-api';

export default function RecipesDetailsPage() {
    const { id } = useParams(); 
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
    } = recipe;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{name}</h1>
            <p className="text-sm text-gray-500 mb-2">Author: {userID.username}</p>
            <p className="text-sm text-gray-500 mb-2">
                Bean: {coffeeBean.roaster}, {coffeeBean.origin}, {coffeeBean.roastLevel}
                {coffeeBean.process ? `, ${coffeeBean.process}` : ''}
            </p>
            <p className="text-sm text-gray-500 mb-2">Recipe Type: {type}</p>
            <p className="text-sm text-gray-500 mb-2">
                Coffee Amount: {type === 'Ratios' ? `${coffeeAmount}:` : `${coffeeAmount}g`}
            </p>
            {waterTemperature && (
                <p className="text-sm text-gray-500 mb-2">
                    Water Temperature: {waterTemperature}°{waterTemperatureUnit}
                </p>
            )}
            {flowRate && <p className="text-sm text-gray-500 mb-2">Flow Rate: {flowRate} mL/s</p>}

            <h2 className="text-2xl font-semibold mb-4">Grind Size</h2>
            <p className="text-sm text-gray-500 mb-2">Steps: {grindSize.steps}</p>
            {grindSize.microsteps && <p className="text-sm text-gray-500 mb-2">Microsteps: {grindSize.microsteps}</p>}
            {grindSize.description && <p className="text-sm text-gray-500 mb-2">Description: {grindSize.description}</p>}

            <h2 className="text-2xl font-semibold mb-4">Steps</h2>
            <div className="mb-8">
                {/* Placeholder for the timeline component */}
                <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">Timeline Placeholder</span>
                </div>
            </div>

            {tastingNotes.length > 0 && (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Tasting Notes</h2>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {tastingNotes.map((note, index) => (
                            <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                {note}
                            </span>
                        ))}
                    </div>
                </>
            )}

            {journal && (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Journal</h2>
                    <p className="text-sm text-gray-700 mb-8">{journal}</p>
                </>
            )}
        </div>
    );
}
