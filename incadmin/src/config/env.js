const raw = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "/api";

// If someone sets http://localhost:5000 without /api, append it automatically
export const API_BASE =
  /^https?:\/\//.test(raw) && !raw.endsWith("/api") ? `${raw}/api` : raw;
