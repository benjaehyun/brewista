const CALC_RECIPE_KEY = 'calculatedRecipe';
const RECIPE_VERSION_KEY = 'recipeVersionInfo';


export const saveCalculatedRecipe = (recipe, versionInfo = null) => {
  try {
      const recipeWithMeta = {
          recipe,
          versionInfo: versionInfo || {
              sourceVersion: recipe.versionInfo?.version || '1.0',
              sourceRecipeId: recipe._id,
              isCalculatedVariant: true,
              calculatedAt: Date.now(),
              changes: [{
                  field: 'recipe',
                  description: 'Created from brewing calculation'
              }]
          },
          timestamp: Date.now()
      };
      sessionStorage.setItem(CALC_RECIPE_KEY, JSON.stringify(recipeWithMeta));
  } catch (error) {
      console.error('Error saving calculated recipe to session storage:', error);
  }
};

export const getCalculatedRecipe = () => {
  try {
      const storedData = sessionStorage.getItem(CALC_RECIPE_KEY);
      if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Check if stored data is expired (24 hours)
          if (Date.now() - parsedData.timestamp > 24 * 60 * 60 * 1000) {
              clearCalculatedRecipe();
              return null;
          }

          // Add version info if it doesn't exist (backward compatibility)
          if (!parsedData.versionInfo) {
              parsedData.versionInfo = {
                  sourceVersion: '1.0',
                  sourceRecipeId: parsedData.recipe._id,
                  isCalculatedVariant: true,
                  calculatedAt: parsedData.timestamp,
                  changes: [{
                      field: 'recipe',
                      description: 'Created from brewing calculation'
                  }]
              };
          }

          return parsedData;
      }
      return null;
  } catch (error) {
      console.error('Error retrieving calculated recipe from session storage:', error);
      return null;
  }
};

export const clearCalculatedRecipe = () => {
  try {
    sessionStorage.removeItem(CALC_RECIPE_KEY);
  } catch (error) {
      console.error('Error clearing calculated recipe from session storage:', error);
  }
};

// New functions for handling version information during brewing process

export const saveBrewingVersionInfo = (recipeId, version, changes = []) => {
  try {
      const versionInfo = {
          recipeId,
          version,
          changes,
          timestamp: Date.now()
      };
      sessionStorage.setItem(RECIPE_VERSION_KEY, JSON.stringify(versionInfo));
  } catch (error) {
      console.error('Error saving brewing version info:', error);
  }
};

export const getBrewingVersionInfo = () => {
  try {
      const storedInfo = sessionStorage.getItem(RECIPE_VERSION_KEY);
      if (storedInfo) {
          const parsedInfo = JSON.parse(storedInfo);
          
          // Check if stored info is expired (1 hour)
          if (Date.now() - parsedInfo.timestamp > 60 * 60 * 1000) {
              clearBrewingVersionInfo();
              return null;
          }
          
          return parsedInfo;
      }
      return null;
  } catch (error) {
      console.error('Error retrieving brewing version info:', error);
      return null;
  }
};

export const clearBrewingVersionInfo = () => {
  try {
    sessionStorage.removeItem(RECIPE_VERSION_KEY);
  } catch (error) {
      console.error('Error clearing brewing version info:', error);
  }
};


// Helper functions for version handling

export const isCalculatedRecipe = (recipe) => {
  return recipe?.versionInfo?.isCalculatedVariant || false;
};

export const getRecipeSourceInfo = (recipe) => {
  if (!recipe?.versionInfo) return null;
  
  return {
      sourceRecipeId: recipe.versionInfo.sourceRecipeId,
      sourceVersion: recipe.versionInfo.sourceVersion,
      calculatedAt: recipe.versionInfo.calculatedAt
  };
};

export const shouldCreateNewVersion = (originalRecipe, calculatedRecipe) => {
  // Compare recipe specs to determine if a new version is needed
  const relevantFields = [
      'coffeeAmount',
      'waterAmount',
      'steps'
  ];

  return relevantFields.some(field => 
      JSON.stringify(originalRecipe[field]) !== JSON.stringify(calculatedRecipe[field])
  );
};