const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken() { return localStorage.getItem('driveease_token'); }
export function setToken(token) {
  if (token) localStorage.setItem('driveease_token', token);
  else localStorage.removeItem('driveease_token');
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Something went wrong. Please try again.');
  return payload;
}
