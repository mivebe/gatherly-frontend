import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;

  // Dev fallback: point at a local backend on port 4000.
  // Web/iOS simulator can reach the host via localhost; Android emulator uses 10.0.2.2.
  if (__DEV__) {
    const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    return `http://${host}:4000/api`;
  }

  throw new Error('EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and fill it in.');
}

export const API_URL = resolveApiUrl();

const TOKEN_KEY = 'gatherly_token';

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}
export async function setToken(token: string | null) {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

// ===== Auth =====
export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),
  register: (payload: { email: string; password: string; full_name: string; role: 'user' | 'organizer' }) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST', body: JSON.stringify(payload),
    }),
  me: () => request<any>('/auth/me'),

  // ===== Events =====
  listEvents: () => request<any[]>('/events'),
  myEvents: () => request<any[]>('/events/mine'),
  getEvent: (id: number) => request<any>(`/events/${id}`),
  createEvent: (payload: any) =>
    request<any>('/events', { method: 'POST', body: JSON.stringify(payload) }),
  deleteEvent: (id: number) => request<any>(`/events/${id}`, { method: 'DELETE' }),
  eventReservations: (id: number) => request<any[]>(`/events/${id}/reservations`),

  // ===== Reservations =====
  myReservations: () => request<any[]>('/reservations/mine'),
  reserve: (event_id: number, seats = 1) =>
    request<any>('/reservations', { method: 'POST', body: JSON.stringify({ event_id, seats }) }),
  cancelReservation: (id: number) =>
    request<any>(`/reservations/${id}`, { method: 'DELETE' }),
};
