import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import { saveCalculatedRecipe } from '../../utilities/localStorageUtils';

export default function FinalizationComponent ({ recipe, calculatedRecipe }) {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState('calculated');
  const currentUser = getUser();
  const isAuthor = currentUser?._id === recipe.userID._id;

  const handleEditOrSave = () => {
    if (selectedRecipe === 'original') {
        navigate(`/recipes/edit/${recipe._id}`);
    } else {
        saveCalculatedRecipe(calculatedRecipe)
        navigate(`/recipes/edit/${recipe._id}`, { 
        state: { calculatedRecipe }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6" style={{ backgroundColor: '#A67B5B'}}>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white">Brewing Complete!</h2>
        </div>
        <div className="p-6">
          <p className="text-center text-gray-700 text-lg mb-6">
            {isAuthor
              ? "Would you like to make changes to the recipe or save a new copy?"
              : "Would you like to save an editable copy of this recipe?"}
          </p>
          <p className="text-center text-gray-600 mb-4">Choose a recipe version:</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio text-amber-600 h-5 w-5"
                name="recipeVersion"
                value="original"
                checked={selectedRecipe === 'original'}
                onChange={() => setSelectedRecipe('original')}
              />
              <span className="ml-2 text-gray-700">Original Recipe</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio text-amber-600 h-5 w-5"
                name="recipeVersion"
                value="calculated"
                checked={selectedRecipe === 'calculated'}
                onChange={() => setSelectedRecipe('calculated')}
              />
              <span className="ml-2 text-gray-700">Calculated Recipe</span>
            </label>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleEditOrSave}
              className="bg-blue-500 hover:bg-blue-600 text-white text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
            >
              {isAuthor ? "Edit Recipe" : "Save Editable Copy"}
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

