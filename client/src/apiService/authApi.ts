/// <reference types="vite/client" />
const URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3005';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserInput extends LoginCredentials {
  name: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface ApiErrorResponse {
  msg?: string;
}

async function parseResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  const data = (await res.json()) as T & ApiErrorResponse;
  if (!res.ok) {
    throw new Error(data.msg || fallbackMessage);
  }
  return data;
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return parseResponse<AuthResponse>(res, 'Login failed');
}

export async function registerUser(userData: RegisterUserInput): Promise<AuthResponse> {
  const res = await fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return parseResponse<AuthResponse>(res, 'Registration failed');
}

export async function getMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return parseResponse<AuthUser>(res, 'Failed to authenticate user');
}