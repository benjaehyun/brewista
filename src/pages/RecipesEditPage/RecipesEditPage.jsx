import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utilities/auth-context';
import { getCalculatedRecipe, clearCalculatedRecipe } from '../../services/localStorageUtils';
import { fetchRecipeById, updateRecipe, addRecipe } from '../../services/recipe-api';

const RecipeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      setIsLoading(true);
      try {
        let loadedRecipe;
        const calculatedRecipe = getCalculatedRecipe();
        if (calculatedRecipe) {
          loadedRecipe = calculatedRecipe;
          clearCalculatedRecipe();
          setIsCalculated(true);
        } else {
          loadedRecipe = await fetchRecipeById(id);
        }
        
        setRecipe(loadedRecipe);
        setIsOwner(loadedRecipe.userID._id === user._id);
      } catch (err) {
        console.error('Failed to load recipe:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id, user._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: value
    }));
  };

  const handleSubmit = async (e, saveAsNew = false) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isOwner && !saveAsNew) {
        await updateRecipe(recipe._id, recipe);
      } else {
        const newRecipe = { ...recipe, userID: user._id };
        delete newRecipe._id;
        await addRecipe(newRecipe);
      }
      navigate('/recipes');
    } catch (err) {
      console.error('Failed to save recipe:', err);
      setError('Failed to save recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/myrecipes');
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!recipe) return <div className="text-center mt-8">No recipe found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isOwner ? 'Edit Recipe' : 'Save New Recipe Copy'}
      </h1>
      {isCalculated && (
        <p className="text-center text-blue-600 mb-4">
          You're editing a calculated version of this recipe.
        </p>
      )}
      {!isOwner && (
        <p className="text-center text-yellow-600 mb-4">
          You're creating a new copy of this recipe.
        </p>
      )}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label htmlFor="coffeeAmount" className="block text-sm font-medium text-gray-700">Coffee Amount (g)</label>
          <input
            type="number"
            id="coffeeAmount"
            name="coffeeAmount"
            value={recipe.coffeeAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        {/* Add more form fields for other recipe properties */}
        <div className="flex justify-between">
          {isOwner ? (
            <>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Update Recipe'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isLoading}
              >
                Save as New Copy
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save New Copy'}
            </button>
          )}
          <button
            type="button"
            onClick={handleCancel}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeEditPage;