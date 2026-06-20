import { API_BASE } from "@/config/env";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const TOKEN_KEY = "inc_admin_access";
const REFRESH_KEY = "inc_admin_refresh";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const json = await res.json();

  if (json.data.accessToken && json.data.refreshToken) {
    setTokens(json.data.accessToken, json.data.refreshToken);
    return json.data.accessToken;
  }

  return getAccessToken();
}

async function getValidToken() {
  const token = getAccessToken();
  if (token) return token;

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiRequest(path, options = {}, retry = true) {
  const token = await getValidToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiRequest(path, options, false);
    }
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  if (res.status === 204) {
    return { data: undefined };
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    if (!res.ok) throw new ApiError(res.statusText || "Request failed", res.status);
    const text = await res.text();
    return { data: text };
  }

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(json.message || "Request failed", res.status);
  }

  return { data: json.data, meta: json.meta };
}

export function buildQuery(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function apiFormRequest(path, formData, method = "POST") {
  return apiRequest(path, { method, body: formData });
}
