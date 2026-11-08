const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function getToken() {
  return localStorage.getItem("dzstore_token");
}

export async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function login(email, password) {
  return apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function register(name, email, password) {
  return apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
}
