// Central config for frontend
// Prefer environment variable when building/deploying
// e.g. set REACT_APP_API_BASE=http://your-domain/api
export const API_BASE = process.env.REACT_APP_API_BASE || "https://veda_backend.saikesav.me/api";

// For local network testing: Using laptop's IP address
// export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8008/api";