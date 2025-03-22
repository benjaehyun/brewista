import React, { useEffect, useState, useCallback, useMemo } from 'react';
import RecipeCard from '../../components/RecipeIndex/RecipeCard';
import { fetchAllRecipes } from '../../services/api/recipe-api';
import { Loader2, RefreshCw } from 'lucide-react';
import debounce from 'lodash/debounce';

const RECIPES_PER_PAGE = 10;
const MAX_PAGES = 100;

const RecipeCardMemo = React.memo(RecipeCard);

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow p-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
  </div>
);

export default function RecipeIndexPage() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const loadRecipes = useCallback(async (pageNum = page, append = false) => {
    if (pageNum > MAX_PAGES) {
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetchAllRecipes(pageNum, RECIPES_PER_PAGE);
      
      if (!response.recipes.length) {
        setHasMore(false);
        return;
      }
      
      setRecipes(prev => append ? [...prev, ...response.recipes] : response.recipes);
      setHasMore(response.hasMore);
      setError(null);
    } catch (err) {
      setError(
        err.response?.status === 404 ? 'No recipes found' :
        err.response?.status === 500 ? 'Server error. Please try again later.' :
        'Failed to load recipes. Please try again.'
      );
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [page]);

  // Initial load
  useEffect(() => {
    loadRecipes(1, false);
  }, []);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadRecipes(page, true);
    }
  }, [page, loadRecipes]);

  // Debounced intersection observer callback
  const debouncedLoadMore = useMemo(
    () => debounce(() => {
      if (hasMore && !loading && page <= MAX_PAGES) {
        setPage(prev => prev + 1);
      }
    }, 150),
    [hasMore, loading, page]
  );

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          debouncedLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById('scroll-target');
    if (target) observer.observe(target);

    return () => {
      observer.disconnect();
      debouncedLoadMore.cancel();
    };
  }, [debouncedLoadMore]);

  // Function to retry loading on error
  const handleRetry = () => {
    setError(null);
    loadRecipes(page, page !== 1);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Coffee Recipes</h2>
      
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {initialLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCardMemo key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}

      {loading && !initialLoading && (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {hasMore && page <= MAX_PAGES && (
        <div id="scroll-target" className="h-4 w-full" />
      )}

      {(!hasMore || page > MAX_PAGES) && recipes.length > 0 && (
        <p className="text-center text-gray-500 my-8">
          You've reached the end of the recipes
        </p>
      )}

      {!loading && !initialLoading && recipes.length === 0 && !error && (
        <p className="text-center text-gray-500 my-8">
          No recipes found
        </p>
      )}
    </div>
  );
}