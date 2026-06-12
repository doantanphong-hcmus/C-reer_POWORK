import { http, HttpResponse } from 'msw';
import type {
  ApiErrorBody,
  ApiSuccess,
  AuthSession,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api/v1/auth`;

const MOCK_USER: User = {
  user_id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
  email: 'test@example.com',
  full_name: 'Trương Minh Quang',
  role: 'Candidate',
};

const success = <T>(data: T, message?: string): ApiSuccess<T> => ({
  status: 'success',
  data,
  ...(message ? { message } : {}),
});

const fail = (error_code: string, message: string): ApiErrorBody => ({
  status: 'error',
  error_code,
  message,
});

export const authHandlers = [
  http.post(`${BASE}/login`, async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    if (body.email === 'test@example.com' && body.password === 'password') {
      const session: AuthSession = {
        access_token: `mock.jwt.${Date.now()}`,
        token_type: 'Bearer',
        user: { ...MOCK_USER, email: body.email },
      };
      return HttpResponse.json(success(session), { status: 200 });
    }

    return HttpResponse.json(fail('AUTH_001', 'Sai email hoặc mật khẩu'), { status: 401 });
  }),

  http.post(`${BASE}/register`, async ({ request }) => {
    const body = (await request.json()) as RegisterRequest;
    const session: AuthSession = {
      access_token: `mock.jwt.${Date.now()}`,
      token_type: 'Bearer',
      user: {
        user_id: `mock-${Date.now()}`,
        email: body.email,
        full_name: body.full_name,
        role: body.role,
      },
    };
    return HttpResponse.json(success(session, 'Đăng ký thành công'), { status: 201 });
  }),

  http.get(`${BASE}/me`, () => {
    return HttpResponse.json(success(MOCK_USER), { status: 200 });
  }),
];
