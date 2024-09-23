import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '../../services/users-service';
import { getCalculatedRecipe, clearCalculatedRecipe } from '../../services/localStorageUtils';
import { fetchRecipeById, updateRecipe, addRecipe } from '../../services/recipe-api';


export default function RecipesEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = getUser();
  
    useEffect(() => {
      const loadRecipe = async () => {
        setIsLoading(true);
        try {
          const calculatedRecipe = getCalculatedRecipe();
          if (calculatedRecipe) {
            setRecipe(calculatedRecipe);
            clearCalculatedRecipe(); // Clear after retrieving
          } else {
            const fetchedRecipe = await fetchRecipeById(id);
            setRecipe(fetchedRecipe);
          }
        } catch (err) {
          console.error('Failed to load recipe:', err);
          setError('Failed to load recipe. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
  
      loadRecipe();
    }, [id]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setRecipe(prevRecipe => ({
        ...prevRecipe,
        [name]: value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
  
      try {
        if (currentUser._id === recipe.userID._id) {
          // User is the author, update the existing recipe
          await updateRecipe(recipe._id, recipe);
        } else {
          // User is not the author, create a new recipe
          const newRecipe = { ...recipe, userID: currentUser._id };
          delete newRecipe._id; // Remove the _id to create a new document
          await addRecipe(newRecipe);
        }
        navigate('/recipes'); // Navigate to recipes list or wherever appropriate
      } catch (err) {
        console.error('Failed to save recipe:', err);
        setError('Failed to save recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isLoading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!recipe) return <div className="text-center mt-8">No recipe found.</div>;
  
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {currentUser._id === recipe.userID._id ? 'Edit Recipe' : 'Save New Recipe Copy'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>
        </form>
      </div>
    );
  };