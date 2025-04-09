import sendRequest from "../send-request";

const BASE_URL = '/api/recipe'
const VERSION_URL = '/api/recipe/version';


export function fetchCurrentUserRecipes(page = 1, limit = 10) {
    return sendRequest(`${BASE_URL}/me?page=${page}&limit=${limit}`);
}

export function fetchRecipeById(id, version = null) {
    const url = version 
        ? `${BASE_URL}/${id}?version=${version}`
        : `${BASE_URL}/${id}`;
    return sendRequest(url);
}

export function addRecipe (recipe) {
    return sendRequest(`${BASE_URL}/add`, 'POST', recipe)
}

export function updateRecipe (id, recipeData) {
    return sendRequest(`${BASE_URL}/${id}`, 'PUT', recipeData);
}

export function fetchAllRecipes(page = 1, limit = 10) {
    return sendRequest(`${BASE_URL}/all?page=${page}&limit=${limit}`);
}

export function fetchSavedRecipes(page = 1, limit = 10) {
    return sendRequest(`${BASE_URL}/saved?page=${page}&limit=${limit}`);
}

// version-specific endpoints
export async function fetchVersionHistory(recipeId) {
    return sendRequest(`${VERSION_URL}/${recipeId}/versions`);
}

export async function fetchSpecificVersion(recipeId, version) {
    return sendRequest(`${VERSION_URL}/${recipeId}/version/${version}`);
}

export async function createNewVersion(recipeId, recipeData, sourceVersion, changes) {
    return sendRequest(`${VERSION_URL}/${recipeId}/version`, 'POST', {
        recipeData,
        sourceVersion,
        changes
    });
}

export async function createBranchVersion(recipeId, recipeData, parentVersion, changes) {
    return sendRequest(`${VERSION_URL}/${recipeId}/branch`, 'POST', {
        recipeData,
        parentVersion,
        changes
    });
}

export async function copyRecipeWithVersion(sourceRecipeId, sourceVersion) {
    return sendRequest(`${VERSION_URL}/copy`, 'POST', {
        sourceRecipeId,
        sourceVersion
    });
}

export async function isCurrentVersion(recipeId, version) {
    return sendRequest(`${VERSION_URL}/${recipeId}/isCurrentVersion/${version}`);
}

// Utility functions for working with versions
export function generateChangeDescription(field, oldValue, newValue) {
    switch (field) {
        case 'coffeeAmount':
            return `Changed coffee amount from ${oldValue}g to ${newValue}g`;
        case 'waterTemperature':
            return `Changed water temperature from ${oldValue}° to ${newValue}°`;
        case 'flowRate':
            return `Changed flow rate from ${oldValue} ml/s to ${newValue} ml/s`;
        case 'grindSize':
            return oldValue?.steps !== newValue?.steps
                ? `Changed grind size from ${oldValue?.steps || 'unknown'} to ${newValue?.steps || 'unknown'} steps`
                : 'Modified grind settings';
        case 'steps':
            return 'Modified brewing steps';
        case 'tastingNotes':
            return 'Updated tasting notes';
        case 'journal':
            return 'Updated recipe notes';
        default:
            return `Updated ${field}`;
    }
}

// Calculate changes between two recipe versions
export function calculateRecipeChanges(oldRecipe, newRecipe) {
    if (!oldRecipe || !newRecipe) {
        return [];
    }

    const changes = [];
    const fields = [
        'name',
        'coffeeAmount',
        'grindSize',
        'waterTemperature',
        'waterTemperatureUnit',
        'flowRate',
        'steps',
        'tastingNotes',
        'journal'
    ];

    fields.forEach(field => {
        const oldValue = oldRecipe[field];
        const newValue = newRecipe[field];

        // Skip undefined fields
        if (oldValue === undefined || newValue === undefined) {
            return;
        }

        // Handle different field types appropriately
        let hasChanged = false;
        
        if (field === 'steps') {
            // For steps, compare length and waterAmount values
            if (oldValue?.length !== newValue?.length) {
                hasChanged = true;
            } else if (oldValue && newValue) {
                // Compare each step's water amount
                hasChanged = oldValue.some((step, index) => {
                    return (
                        newValue[index]?.waterAmount !== step?.waterAmount || 
                        newValue[index]?.time !== step?.time
                    );
                });
            }
        } else if (typeof oldValue === 'object' && oldValue !== null) {
            // For objects like grindSize, do JSON comparison
            hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);
        } else if (Array.isArray(oldValue)) {
            // For arrays like tastingNotes
            hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);
        } else {
            // For primitive values
            hasChanged = oldValue !== newValue;
        }

        if (hasChanged) {
            changes.push({
                field,
                oldValue,
                newValue,
                description: generateChangeDescription(field, oldValue, newValue)
            });
        }
    });

    return changes;
}

