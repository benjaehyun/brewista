import sendRequest from "./send-request";

const BASE_URL = '/api/profiles'

export function getProfile() {
    return sendRequest(BASE_URL)
}
