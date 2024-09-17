import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { saveCalculatedRecipe } from '../../utilities/localStorageUtils';
import { getUser } from '../../utilities/users-service'

const FinalizationComponent = ({ recipe, calculatedRecipe }) => {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState('calculated');
  const currentUser = getUser()
  const isAuthor = currentUser?._id === recipe.userId;



  const handleEditOrSave = () => {
    // saveCalculatedRecipe(calculatedRecipe);
    navigate(`/edit-recipe/${recipe.id}`, { 
      state: { 
        originalRecipe: recipe,
        calculatedRecipe,
        selectedRecipe,
        isAuthor
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Brewing Complete!</h2> 
      {isAuthor?
            <p className="mb-4 text-center text-xl">Would you like to make changes to the recipe or save a new copy of this recipe?</p>
            :
            <p className="mb-2 text-center text-xl">Would you like to save an editable copy of this recipe?</p>

      }
      <p className="mb-2 text-center text-lg">Choose a recipe version to proceed with:</p>      
      <div className="mb-6 flex justify-center space-x-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="recipeVersion"
            value="original"
            checked={selectedRecipe === 'original'}
            onChange={() => setSelectedRecipe('original')}
          />
          <span className="ml-2">Original Recipe</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="recipeVersion"
            value="calculated"
            checked={selectedRecipe === 'calculated'}
            onChange={() => setSelectedRecipe('calculated')}
          />
          <span className="ml-2">Calculated Recipe</span>
        </label>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleEditOrSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          {isAuthor ? "Edit Recipe" : "Save Editable Copy"}
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default FinalizationComponent;