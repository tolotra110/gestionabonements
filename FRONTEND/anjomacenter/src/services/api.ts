const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    const data = await res.json().catch(() => null);
    if (typeof data?.message === 'string') message = data.message;
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: unknown) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: unknown) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path: string) => request(path, { method: 'DELETE' }),
};
