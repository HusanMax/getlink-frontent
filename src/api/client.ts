import axios, { AxiosError } from 'axios';

export const TOKEN_KEY = 'rh_token';

export const api = axios.create({
  baseURL: import.meta.env.API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        window.location.assign('/admin/login');
      }
    }
    return Promise.reject(error);
  },
);

interface ApiErrorShape {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  resourceCount?: number;
}

/** Turns any thrown value into a single human-readable message. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(' ') : data.message;
    }
    if (error.code === 'ECONNABORTED') return "So'rov vaqti tugadi. Qayta urining.";
    if (!error.response) return "Serverga bog'lanib bo'lmadi. API ishlayotganiga ishonch hosil qiling.";
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Nimadir xato ketdi.";
}

export function getErrorStatus(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) return error.response?.status;
  return undefined;
}

export function getErrorResourceCount(error: unknown): number | undefined {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as ApiErrorShape | undefined)?.resourceCount;
  }
  return undefined;
}
