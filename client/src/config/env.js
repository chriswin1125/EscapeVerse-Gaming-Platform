// API and Socket server endpoints
// In development, empty string uses Vite's proxy (/api -> http://127.0.0.1:5500)
// In production on Vercel, set VITE_API_URL to your Render backend URL (e.g., https://escapeverse-backend.onrender.com)

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Remove trailing slash if present
    return envUrl.replace(/\/+$/, '');
  }
  return '';
};

export const API_BASE_URL = getBaseUrl();

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL?.replace(/\/+$/, '') ||
  API_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '');
