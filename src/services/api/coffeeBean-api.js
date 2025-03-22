import sendRequest from "../send-request";

const BASE_URL = '/api/coffee-bean'

export function fetchRoasters(query) {
    const url = `${BASE_URL}/roasters?q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}

export function fetchOrigins(roaster, query = '') {
    const url = `${BASE_URL}/origins?roaster=${encodeURIComponent(roaster)}&q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}

export function fetchRoastLevels(roaster, origin, query = '') {
    const url = `${BASE_URL}/roast-levels?roaster=${encodeURIComponent(roaster)}&origin=${encodeURIComponent(origin)}&q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}

export function fetchProcesses(roaster, origin, roastLevel, query = '') {
    const url = `${BASE_URL}/processes?roaster=${encodeURIComponent(roaster)}&origin=${encodeURIComponent(origin)}&roast-level=${encodeURIComponent(roastLevel)}&q=${encodeURIComponent(query)}`;
    return sendRequest(url);
}

export function addCoffeeBean (beanData) {
    return sendRequest(`${BASE_URL}`, 'POST', beanData)
}

export function fetchFilteredBeans(filters) {
    const query = new URLSearchParams({
        roaster: filters.roaster,
        origin: filters.origin,
        roastLevel: filters.roastLevel,
        process: filters.process
    }).toString();
    return sendRequest(`${BASE_URL}/filtered?${query}`)
}