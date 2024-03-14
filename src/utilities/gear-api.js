import sendRequest from "./send-request";

const BASE_URL = '/api/gear'

export function fetchBrands(query) {
    const url = `${BASE_URL}/brands?q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}

export function fetchModels(brand, query = '') {
    const url = `${BASE_URL}/models?brand=${encodeURIComponent(brand)}&q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}


export function fetchModifications(brand, model, query = '') {
    const url = `${BASE_URL}/modifications?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}


export function addGear (gearData) {
    return sendRequest(`${BASE_URL}`, 'POST', gearData)
}

export function removeFromProfile(gearId) {
    return sendRequest(`${BASE_URL}/${gearId}`, 'DELETE');
}