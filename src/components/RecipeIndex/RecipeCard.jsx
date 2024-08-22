import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
    const { name, coffeeBean, type, coffeeAmount, tastingNotes, _id } = recipe;

    // Calculate brew volume
    const brewVolume = recipe.steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    // Determine the display for coffee amount and brew volume
    const coffeeBrewDisplay = type === 'Ratio' 
        ? `${coffeeAmount}:${brewVolume}`
        : `${coffeeAmount}g, ${brewVolume}mL`;

    return (
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between" style={{ minHeight: '260px' }}>
            <div>
                <Link to={`/recipes/${_id}`} className="block">
                    <h3 className="text-xl font-bold mb-2">{name}</h3>
                    <p className="text-sm text-gray-500">Author: {recipe.userID.username}</p>
                    <p className="text-sm text-gray-500">
                        Bean: {coffeeBean.roaster}, {coffeeBean.origin}, {coffeeBean.roastLevel}
                        {coffeeBean.process ? `, ${coffeeBean.process}` : ''}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Type: {type}</p>
                    <p className="text-lg font-semibold mb-2">Coffee & Brew: {coffeeBrewDisplay}</p>
                    <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '24px' }}>
                        {tastingNotes.map((note, index) => (
                            <span key={index} className="text-xs bg-gray-200 px-2 py-1 rounded-full whitespace-nowrap">
                                {note}
                            </span>
                        ))}
                    </div>
                </Link>
            </div>

            {/* Button to go to CalculatePage */}
            <Link to={`/calculate/${_id}`} className="mt-4">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    Brew with this Recipe
                </button>
            </Link>
        </div>
    );
}
