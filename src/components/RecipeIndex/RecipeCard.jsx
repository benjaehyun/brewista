import React from 'react';
import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';
import { useAuth } from '../../utilities/auth-context';
import { GitBranch, GitCommit, Clock } from 'lucide-react'; // For showing version indicators

export default function RecipeCard({ recipe }) {
    const { user, userProfile } = useAuth();
    const { 
        name, 
        coffeeBean, 
        type, 
        coffeeAmount, 
        tastingNotes, 
        _id,
        versionInfo,
        userID
    } = recipe;

    // Calculate brew volume
    const brewVolume = recipe.steps.reduce((total, step) => {
        return step.waterAmount ? total + step.waterAmount : total;
    }, 0);

    // Determine the display for coffee amount and brew volume
    const coffeeBrewDisplay = type === 'Ratio' 
        ? `${coffeeAmount}:${brewVolume}`
        : `${coffeeAmount}g, ${brewVolume}mL`;

    // Check if we should show version information
    const hasVersionInfo = versionInfo && versionInfo.version;
    const isMainVersion = hasVersionInfo && versionInfo.version.endsWith('.0');
    const isBranchVersion = hasVersionInfo && !isMainVersion;
    const isCurrentVersion = hasVersionInfo && versionInfo.isCurrent;
    
    // Check if this recipe has multiple versions
    const hasMultipleVersions = 
        (versionInfo?.stats?.totalVersions > 1) || 
        (versionInfo?.hasOtherVersions);
        
    // Determine if user is owner
    const isOwner = user && userID && user._id === userID._id;

    return (
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between" style={{ minHeight: '260px' }}>
            {/* Header section with title and version info */}
            <div className="min-h-[40px] relative flex items-start">
                {user && userProfile && <div className="w-[44px] flex-shrink-0" />}
                
                <div className="flex-1 text-center">
                    <Link to={`/recipes/${_id}`}>
                        <h3 className="text-xl font-bold break-words">{name}</h3>
                        
                        {/* Version badge with appropriate icon */}
                        {hasVersionInfo && (
                            <div className="flex items-center justify-center gap-1 mt-1">
                                {isBranchVersion ? (
                                    <GitBranch className="h-4 w-4 text-green-600" />
                                ) : (
                                    <GitCommit className="h-4 w-4 text-blue-600" />
                                )}
                                <span className={`text-sm ${isCurrentVersion ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                                    v{versionInfo.version}
                                </span>
                                {isCurrentVersion && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                        current
                                    </span>
                                )}
                                {versionInfo.createdAt && (
                                    <span className="hidden sm:flex items-center text-xs text-gray-500">
                                        <Clock className="h-3 w-3 ml-1 mr-0.5" />
                                        {new Date(versionInfo.createdAt).toLocaleDateString()}
                                    </span>
                                )}
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
                    
                    {/* Version statistics - simplified and more intuitive */}
                    {hasMultipleVersions && (
                        <p className="text-xs text-gray-500 mb-2">
                            {versionInfo?.stats?.mainVersions > 0 && (
                                <span className="inline-flex items-center gap-0.5">
                                    <GitCommit className="h-3 w-3" />
                                    {versionInfo.stats.mainVersions} main
                                </span>
                            )}
                            {versionInfo?.stats?.branches > 0 && (
                                <span className="inline-flex items-center gap-0.5 ml-2">
                                    <GitBranch className="h-3 w-3" />
                                    {versionInfo.stats.branches} {versionInfo.stats.branches === 1 ? 'branch' : 'branches'}
                                </span>
                            )}
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