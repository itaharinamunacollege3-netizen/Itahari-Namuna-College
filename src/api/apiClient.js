const BASE_URL = import.meta.env.VITE_API_URL;

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
    const body = await response.json();

    if (!response.ok || !body?.success) {
      throw new Error(body?.message || `Request failed: ${endpoint}`);
    }
    return body; // Returning the whole body (which usually contains { success, data })
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