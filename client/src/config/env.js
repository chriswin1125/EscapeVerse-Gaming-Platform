// API and Socket server endpoints
// In development, empty string uses Vite's proxy (/api -> http://127.0.0.1:5500)
// In production on Vercel, automatically connects to the live Render backend:
// https://escapeverse-gaming-platform.onrender.com

const PRODUCTION_BACKEND_URL = 'https://escapeverse-gaming-platform.onrender.com';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  // If running locally, use relative path so Vite proxy handles it
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return '';
  }
  // Default to live Render backend in production
  return PRODUCTION_BACKEND_URL;
};

export const API_BASE_URL = getBaseUrl();

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL?.replace(/\/+$/, '') ||
  (API_BASE_URL ? API_BASE_URL : PRODUCTION_BACKEND_URL);
