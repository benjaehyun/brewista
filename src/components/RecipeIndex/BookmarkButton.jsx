import React from 'react';
import { useAuth } from '../../hooks/auth-context';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const BookmarkButton = ({ 
  recipeId, 
  className = "p-1.5 rounded-full transition-all duration-200 hover:bg-gray-100",
  iconClassName = "w-[30px] h-[30px]" // Default size
}) => {
  const { user, userProfile, toggleSaveRecipe } = useAuth();

  if (!user || !userProfile) return null;

  const isSaved = userProfile.savedRecipes.includes(recipeId);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    try {
      await toggleSaveRecipe(recipeId);
    } catch (error) {
      console.error('Failed to toggle recipe save:', error);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      className={`${className} ${
        isSaved 
          ? 'text-blue-500 hover:text-blue-600' 
          : 'text-gray-400 hover:text-gray-600'
      }`}
      aria-label={isSaved ? "Remove from saved recipes" : "Save recipe"}
    >
      {isSaved ? (
        <BookmarkCheck className={`fill-current ${iconClassName}`} />
      ) : (
        <Bookmark className={iconClassName} />
      )}
    </button>
  );
};

export default BookmarkButton;