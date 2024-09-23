const CALC_RECIPE_KEY = 'calculatedRecipe';

export const saveCalculatedRecipe = (recipe) => {
  try {
    const recipeWithTimestamp = {
      recipe,
      timestamp: Date.now()
    };
    localStorage.setItem(CALC_RECIPE_KEY, JSON.stringify(recipeWithTimestamp));
  } catch (error) {
    console.error('Error saving calculated recipe to local storage:', error);
  }
};

export const getCalculatedRecipe = () => {
  try {
    const storedRecipe = localStorage.getItem(CALC_RECIPE_KEY);
    if (storedRecipe) {
      const parsedRecipe = JSON.parse(storedRecipe);
      if (Date.now() - parsedRecipe.timestamp > 24 * 60 * 60 * 1000) {
        clearCalculatedRecipe();
        return null;
      }
      return parsedRecipe.recipe;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving calculated recipe from local storage:', error);
    return null;
  }
};

export const clearCalculatedRecipe = () => {
  try {
    localStorage.removeItem(CALC_RECIPE_KEY);
  } catch (error) {
    console.error('Error clearing calculated recipe from local storage:', error);
  }
};