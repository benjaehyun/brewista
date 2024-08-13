import sendRequest from "./send-request";

const BASE_URL = '/api/recipes'

export function getProfile() {
    return sendRequest(BASE_URL)
}