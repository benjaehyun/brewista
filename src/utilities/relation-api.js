import sendRequest from "./send-request";

const BASE_URL = '/api/relation'

export function getFollowers (profileId) {
    return sendRequest(`${BASE_URL}/${profileId}/followers`);
}