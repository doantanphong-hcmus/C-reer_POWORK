import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiErrorBody, ApiSuccess } from '@/lib/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_PREFIX = '/api/v1';
const TOKEN_STORAGE_KEY = 'access_token';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function unwrap<T>(promise: Promise<AxiosResponse<ApiSuccess<T>>>): Promise<T> {
  const response = await promise;
  return response.data.data;
}

export { TOKEN_STORAGE_KEY };
export default apiClient;
