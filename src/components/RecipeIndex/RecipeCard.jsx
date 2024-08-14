import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
    const { name, coffeeBean, type, coffeeAmount, tastingNotes, _id } = recipe;

    // Calculate brew volume
    const brewVolume = recipe.steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    // Determine the display for coffee amount and brew volume
    const coffeeBrewDisplay = type === 'Ratios' 
        ? `${coffeeAmount}: ${brewVolume}`
        : `${coffeeAmount}g, ${brewVolume}mL`;

    return (
        <Link to={`/recipes/${_id}`} className="block">
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200" style={{ minHeight: '220px' }}>
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
            </div>
        </Link>
    );
}
