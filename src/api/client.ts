import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and fill it in.');
}

const TOKEN_KEY = 'diploma_token';

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
