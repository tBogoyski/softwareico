import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
  "http://localhost:8000";

/**
 * Build a full image URL. Handles both absolute URLs returned by DRF
 * (e.g. "http://localhost:8000/media/...") and relative paths ("/media/...").
 */
export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BACKEND_URL}${path}`;
}

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Set Accept-Language dynamically from localStorage before each request
api.interceptors.request.use((config) => {
  const lang = localStorage.getItem("softwareico-lang") || "bg";
  config.headers["Accept-Language"] = lang;
  return config;
});

export default api;
