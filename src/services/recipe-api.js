import sendRequest from "./send-request";

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

export async function createNewVersion(recipeId, recipeData, changes) {
    return sendRequest(`${VERSION_URL}/${recipeId}/version`, 'POST', {
        recipeData,
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
            return oldValue.steps !== newValue.steps
                ? `Changed grind size from ${oldValue.steps} to ${newValue.steps} steps`
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

export function calculateRecipeChanges(oldRecipe, newRecipe) {
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

        // Handle nested objects and arrays
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
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

// Helper function to detect if recipe has changed
export function hasRecipeChanged(oldRecipe, newRecipe) {
    return calculateRecipeChanges(oldRecipe, newRecipe).length > 0;
}

// Helper functions for version comparison and formatting
export function compareVersions(v1, v2) {
    const [major1, minor1] = v1.split('.').map(Number);
    const [major2, minor2] = v2.split('.').map(Number);
    
    if (major1 !== major2) return major1 - major2;
    return minor1 - minor2;
}

export function isMainVersion(version) {
    return version.endsWith('.0');
}

export function getNextMainVersion(currentVersion) {
    const [major] = currentVersion.split('.');
    return `${parseInt(major) + 1}.0`;
}

export function formatVersionNumber(version) {
    return `v${version}`;
}

export function getVersionType(version) {
    return isMainVersion(version) ? 'Main Version' : 'Branch Version';
}

export function getVersionBreadcrumb(version, parentVersion) {
    if (!parentVersion) return formatVersionNumber(version);
    return `${formatVersionNumber(parentVersion)} → ${formatVersionNumber(version)}`;
}