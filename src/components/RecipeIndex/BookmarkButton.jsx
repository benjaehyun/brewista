import React from 'react';
import { useAuth } from '../../utilities/auth-context';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const BookmarkButton = ({ recipeId }) => {
  const { user, userProfile, toggleSaveRecipe } = useAuth();

  // Don't render if no user or profile isn't loaded yet
  if (!user || !userProfile) return null;

  const isSaved = userProfile.savedRecipes.includes(recipeId);

  const handleToggleSave = async (e) => {
    e.preventDefault(); // Prevent triggering parent link clicks
    try {
      await toggleSaveRecipe(recipeId);
    } catch (error) {
      console.error('Failed to toggle recipe save:', error);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      className={`p-1.5 rounded-full transition-all duration-200 hover:bg-gray-100
        ${isSaved 
          ? 'text-blue-500 hover:text-blue-600' 
          : 'text-gray-400 hover:text-gray-600'
        }`}
      aria-label={isSaved ? "Remove from saved recipes" : "Save recipe"}
    >
      {isSaved ? (
        <BookmarkCheck size={30} className="fill-current" />
      ) : (
        <Bookmark size={30} />
      )}
    </button>
  );
};

export default BookmarkButton;