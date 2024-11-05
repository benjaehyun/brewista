import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { fetchCurrentUserRecipes, fetchSavedRecipes } from '../../services/recipe-api';
import BookmarkButton from "../../components/RecipeIndex/BookmarkButton"

const RECIPES_PER_PAGE = 12;

const CompactRecipeCard = React.memo(({ recipe }) => {
    const brewVolume = recipe.steps.reduce((total, step) => 
      step.waterAmount ? total + step.waterAmount : total, 0);
  
    const getRecipeMeasurements = () => {
      if (recipe.type === 'Ratio') {
        return `${recipe.coffeeAmount}:${brewVolume}`;
      }
      return `${recipe.coffeeAmount}g • ${brewVolume}ml`;
    };
  
    const bookmarkStyles = {
      button: "p-1 rounded-full transition-all duration-200 hover:bg-gray-100",
      icon: "w-6 h-6" // Custom size for the bookmark icon in compact view
    };
  
    return (
      <Link 
        to={`/recipes/${recipe._id}`}
        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 overflow-hidden"
      >
        <div className="p-4 flex flex-col gap-2 w-full">
          <div className="grid grid-cols-[1fr_auto] gap-4 w-full">
            <div className="min-w-0">
              <div className="flex items-baseline">
                <h3 className="font-medium text-gray-900 truncate">
                  {recipe.name}
                </h3>
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-1">
                <span className="truncate">{recipe.coffeeBean.roaster}</span>
                <span>•</span>
                <span className="truncate">{recipe.coffeeBean.origin}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 whitespace-nowrap mb-1">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
              <div className="-mr-1">
                <BookmarkButton 
                  recipeId={recipe._id}
                  className={bookmarkStyles.button}
                  iconClassName={bookmarkStyles.icon}
                />
              </div>
            </div>
          </div>
  
          <div className="text-sm text-gray-600 font-medium truncate">
            {getRecipeMeasurements()}
          </div>
  
          {recipe.tastingNotes?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 overflow-hidden" style={{ maxHeight: '28px' }}>
              {recipe.tastingNotes.map((note, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 whitespace-nowrap"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
});

const CompactRecipeList = ({ type, emptyMessage }) => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    try {
      const fetchFn = type === 'user' ? fetchCurrentUserRecipes : fetchSavedRecipes;
      const response = await fetchFn(page, RECIPES_PER_PAGE);
      
      setRecipes(prev => {
        const newRecipes = response.recipes.filter(
          newRecipe => !prev.some(existingRecipe => existingRecipe._id === newRecipe._id)
        );
        return [...prev, ...newRecipes];
      });
      setHasMore(response.hasMore);
      setPage(prev => prev + 1);
      setError(null);
    } catch (error) {
      setError('Failed to load recipes. Please try again.');
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [page, type, hasMore, loading]);

  // Reset when type changes
  useEffect(() => {
    setRecipes([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [type]);

  useEffect(() => {
    if (page === 1) {
      fetchRecipes();
    }
  }, [page]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchRecipes();
        }
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById('recipe-scroll-target');
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [fetchRecipes, hasMore, loading]);

  if (!recipes.length && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 text-center mb-4">{emptyMessage}</p>
        <Link 
          to={type === 'user' ? '/recipes/new' : '/recipes'} 
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          {type === 'user' ? 'Create your first recipe' : 'Explore recipes'}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
          <button 
            onClick={() => {
              setError(null);
              setPage(1);
            }}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {recipes.map(recipe => (
          <CompactRecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
      
      <div id="recipe-scroll-target" className="h-4 w-full" />
      
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default CompactRecipeList;