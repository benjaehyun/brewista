import sendRequest from "./send-request";

const BASE_URL = '/api/profiles'

export function getProfile() {
    return sendRequest(BASE_URL)
}

export function createProfile() {
    return sendRequest(`${BASE_URL}/create`, 'POST', );
  }

export function updateProfile(form) {
    return sendRequest(`${BASE_URL}`, 'POST', {form});
}

export function getFollowers (profileId) {
    return sendRequest(`${BASE_URL}/${profileId}/followers`);
}