const API_BASE_URL_RAW =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
const BASE_URL = API_BASE_URL_RAW.replace(/\/+$/, "");

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 
    'Content-Type': 'application/json',
    ...options.headers 
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const body = isJson ? await response.json() : null;

    if (!response.ok) {
      const fallbackMessage = isJson
        ? body?.message
        : `Request failed: ${endpoint} (${response.status})`;
      throw new Error(fallbackMessage || `Request failed: ${endpoint}`);
    }

    if (!isJson) {
      const text = await response.text();
      const preview = String(text).slice(0, 80);
      throw new Error(`Expected JSON but received non-JSON response for ${endpoint}: ${preview}`);
    }

    if (!body?.success) {
      throw new Error(body?.message || `Request failed: ${endpoint}`);
    }

    return body; // Returning the whole body (usually { success, data })
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error; // Let the UI layer handle the specific error display
  }
}

export const apiClient = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};