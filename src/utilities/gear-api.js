import sendRequest from "./send-request";

const BASE_URL = '/api/gear'

export function fetchBrands(query) {
    const url = `${BASE_URL}/brands?q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}

export function fetchModels(query) {
    const url = `${BASE_URL}/models?q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}

export function fetchModifications(query) {
    const url = `${BASE_URL}/modifications?q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}



export function createProfile() {
    return sendRequest(`${BASE_URL}/create`, 'POST', );
  }

export function updateProfile(form) {
    return sendRequest(`${BASE_URL}`, 'POST', {form});
}

