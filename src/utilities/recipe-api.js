import sendRequest from "./send-request";

const BASE_URL = '/api/recipe'


export function addRecipe (recipe) {
    return sendRequest(`${BASE_URL}/add`, 'POST', recipe)
}