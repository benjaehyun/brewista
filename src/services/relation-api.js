import sendRequest from "./send-request";

const BASE_URL = '/api/relation'

export function getFollowers (profileId) {
    return sendRequest(`${BASE_URL}/followers/${profileId}`);
}

export function getFollowing (profileId) {
    return sendRequest(`${BASE_URL}/following/${profileId}`);
}