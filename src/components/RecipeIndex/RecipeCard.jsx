import React from 'react';
import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import { useAuth } from '../../utilities/auth-context';

export default function RecipeCard({ recipe }) {
    const { user, userProfile } = useAuth();
    const { name, coffeeBean, type, coffeeAmount, tastingNotes, _id } = recipe;

    // Calculate brew volume
    const brewVolume = recipe.steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    // Determine the display for coffee amount and brew volume
    const coffeeBrewDisplay = type === 'Ratio' 
        ? `${coffeeAmount}:${brewVolume}`
        : `${coffeeAmount}g, ${brewVolume}mL`;

    // Only apply margin if user is authenticated
    const titleMarginClass = user && userProfile ? 'ml-10' : '';

    return (
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between" style={{ minHeight: '260px' }}>
            {/* Header section with true centering */}
            <div className="min-h-[40px] relative flex items-start">
                {/* Left spacer - only visible when authenticated */}
                {user && userProfile && <div className="w-[44px] flex-shrink-0" />}
                
                {/* Title container */}
                <div className="flex-1 text-center">
                    <Link to={`/recipes/${_id}`}>
                        <h3 className="text-xl font-bold break-words">{name}</h3>
                    </Link>
                </div>
                
                {/* Right bookmark container or spacer */}
                <div className=" flex-shrink-0 relative z-10">
                    <BookmarkButton recipeId={_id} />
                </div>
            </div>


            
            <div>
                <Link to={`/recipes/${_id}`} className="block">
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

            <Link to={`/calculate/${_id}`} className="mt-4">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    Brew with this Recipe
                </button>
            </Link>
        </div>
    );
}