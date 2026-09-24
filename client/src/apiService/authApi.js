const URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3005';

export async function loginUser(credentials) {
  const res = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || 'Login failed');
  }
  return data;
}

export async function registerUser(userData) {
  const res = await fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || 'Registration failed');
  }
  return data;
}

export async function getMe(token) {
  const res = await fetch(`${URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || 'Failed to authenticate user');
  }
  return data;
}
