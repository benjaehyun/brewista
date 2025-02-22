import React from 'react';
import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import { useAuth } from '../../utilities/auth-context';
import { GitBranch } from 'lucide-react'; // For showing branch indicator

export default function RecipeCard({ recipe }) {
    const { user, userProfile } = useAuth();
    const { 
        name, 
        coffeeBean, 
        type, 
        coffeeAmount, 
        tastingNotes, 
        _id,
        versionInfo
    } = recipe;

    // Calculate brew volume
    const brewVolume = recipe.steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    // Determine the display for coffee amount and brew volume
    const coffeeBrewDisplay = type === 'Ratio' 
        ? `${coffeeAmount}:${brewVolume}`
        : `${coffeeAmount}g, ${brewVolume}mL`;

    const showVersionInfo = versionInfo?.hasOtherVersions || !versionInfo?.version?.endsWith('.0');

    return (
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between" style={{ minHeight: '260px' }}>
            {/* Header section with title and version info */}
            <div className="min-h-[40px] relative flex items-start">
                {user && userProfile && <div className="w-[44px] flex-shrink-0" />}
                
                <div className="flex-1 text-center">
                    <Link to={`/recipes/${_id}`}>
                        <h3 className="text-xl font-bold break-words">{name}</h3>
                        {showVersionInfo && (
                            <div className="flex items-center justify-center gap-1 mt-1">
                                {!versionInfo.version?.endsWith('.0') && (
                                    <GitBranch className="h-4 w-4 text-blue-500" />
                                )}
                                <span className="text-sm text-gray-600">
                                    v{versionInfo?.version}
                                </span>
                            </div>
                        )}
                    </Link>
                </div>
                
                <div className="flex-shrink-0 relative z-10">
                    <BookmarkButton recipeId={_id} />
                </div>
            </div>

            <div>
                <Link to={`/recipes/${_id}`} className="block">
                    <p className="text-sm text-gray-500">Author: {recipe.userID.username}</p>
                    <p className="text-sm text-gray-500">
                        <span className="block">Bean: {coffeeBean.roaster}, {coffeeBean.origin}</span>
                        <span className="block">
                            {coffeeBean.roastLevel}
                            {coffeeBean.process ? `, ${coffeeBean.process}` : ''}
                        </span>
                    </p>
                    <p className="text-sm text-gray-500 mb-4">Type: {type}</p>
                    <p className="text-lg font-semibold mb-2">Coffee & Brew: {coffeeBrewDisplay}</p>
                    
                    {/* Show version stats if available */}
                    {versionInfo?.stats && (
                        <p className="text-xs text-gray-500 mb-2">
                            {versionInfo.stats.mainVersions} version{versionInfo.stats.mainVersions !== 1 ? 's' : ''}
                            {versionInfo.stats.branches > 0 && ` • ${versionInfo.stats.branches} branch${versionInfo.stats.branches !== 1 ? 'es' : ''}`}
                        </p>
                    )}
                    
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