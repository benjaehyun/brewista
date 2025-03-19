import { getToken } from "./users-service";

// send-request.js
export default async function sendRequest(url, method = 'GET', payload = null) {
    // Fetch accepts an options object as the 2nd argument
    // used to include a data payload, set headers, etc. 
    const options = { method };

    // Check method and only add payload if not DELETE or if explicitly required
    if (payload && method !== 'DELETE') {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(payload);
    }

    const token = getToken();
    if (token) {
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, options);

    if (res.ok) return res.json();

    const errorData = await res.json().catch(() => ({
        error: 'Request failed'
    }));
    
    throw errorData; // Pass through the server's error message
}