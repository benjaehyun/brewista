import sendRequest from "./send-request";

const BASE_URL = '/api/recipe'


export function fetchCurrentUserRecipes(page = 1, limit = 10) {
    return sendRequest(`${BASE_URL}/me?page=${page}&limit=${limit}`);
}

export function fetchRecipeById (id) {
    return sendRequest(`${BASE_URL}/${id}`)
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