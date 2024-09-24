import sendRequest from "./send-request";

const BASE_URL = '/api/recipe'


export function fetchCurrentUserRecipes () {
    return sendRequest(`${BASE_URL}`)
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