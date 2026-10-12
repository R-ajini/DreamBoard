const TOKEN_KEY = 'dreamboard_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/api/auth/me'),
  getDashboard: () => request('/api/dashboard'),
  getAchievements: () => request('/api/dashboard/achievements'),
  getDreams: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/dreams${q ? `?${q}` : ''}`);
  },
  getDream: (id) => request(`/api/dreams/${id}`),
  createDream: (body) => request('/api/dreams', { method: 'POST', body: JSON.stringify(body) }),
  updateDream: (id, body) =>
    request(`/api/dreams/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteDream: (id) => request(`/api/dreams/${id}`, { method: 'DELETE' }),
  getGoals: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/goals${q ? `?${q}` : ''}`);
  },
  getGoal: (id) => request(`/api/goals/${id}`),
  createGoal: (body) => request('/api/goals', { method: 'POST', body: JSON.stringify(body) }),
  updateGoal: (id, body) =>
    request(`/api/goals/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteGoal: (id) => request(`/api/goals/${id}`, { method: 'DELETE' }),
  createTask: (body) => request('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateTask: (id, body) =>
    request(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
  suggestTasks: (body) =>
    request('/api/ai/suggest-tasks', { method: 'POST', body: JSON.stringify(body) }),
  exportData: () => request('/api/settings/export'),
  deleteAllData: () => request('/api/settings/data', { method: 'DELETE' }),
};
