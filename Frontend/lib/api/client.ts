import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiErrorBody, ApiSuccess } from '@/lib/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_PREFIX = '/api/v1';

/**
 * Client cho các resource nghiệp vụ (challenges, assessment, profile...).
 * Token nằm trong cookie httpOnly nên KHÔNG cần interceptor gắn Authorization;
 * trình duyệt tự gửi cookie với same-origin. withCredentials để giữ cookie khi
 * BE thật cùng domain / cấu hình CORS cho phép.
 */
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Client cho auth, trỏ tới BFF same-origin (Next Route Handlers tại /api/auth).
 * Các route này set/clear cookie httpOnly và trả về user (không kèm token).
 */
export const authClient = axios.create({
  baseURL: '/api/auth',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function unwrap<T>(promise: Promise<AxiosResponse<ApiSuccess<T>>>): Promise<T> {
  const response = await promise;
  return response.data.data;
}

export default apiClient;
