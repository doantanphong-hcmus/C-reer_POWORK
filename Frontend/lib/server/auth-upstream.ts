import type { LoginRequest, RegisterRequest, User } from '@/lib/types';

/**
 * Tầng "upstream" cho auth, chạy phía server (trong Route Handler).
 *
 * GIAI ĐOẠN HIỆN TẠI: trả mock data inline, KHÔNG cần MSW server-side.
 * KHI CÓ BACKEND THẬT: chỉ cần đổi ruột mỗi hàm dưới đây thành fetch() lên BE,
 * ví dụ:
 *   const res = await fetch(`${process.env.API_URL}/api/v1/auth/login`, {
 *     method: 'POST', headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   });
 *   const body = await res.json();
 *   return { token: body.data.access_token, user: body.data.user };
 *
 * Phần Route Handler và phía client KHÔNG phải đổi gì khi swap.
 */

export interface UpstreamSession {
  token: string;
  user: User;
}

export class AuthError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ─── MOCK STATE (xoá khi nối BE thật) ────────────────────────────────────────

const MOCK_USER: User = {
  user_id: 'de305d54-75b4-431b-adb2-eb6b9e546014',
  email: 'test@example.com',
  full_name: 'Trương Minh Quang',
  role: 'Candidate',
};

/**
 * Bản đồ token -> user, tồn tại trong RAM của tiến trình Next (dev server là
 * một tiến trình duy nhất nên map sống xuyên suốt phiên dev). Nhờ vậy /me trả
 * đúng user vừa đăng nhập mà không cần lưu gì ở client. Reset khi restart server.
 */
const mockSessions = new Map<string, User>();

function issueMockToken(user: User): string {
  // Token mock dạng chuỗi; BE thật sẽ trả JWT.
  const token = `mock.${user.role}.${user.user_id}.${mockSessions.size + 1}`;
  mockSessions.set(token, user);
  return token;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export async function loginUpstream(payload: LoginRequest): Promise<UpstreamSession> {
  // MOCK: chấp nhận test@example.com / password, các email khác tạo user tạm.
  if (payload.email === 'test@example.com' && payload.password !== 'password') {
    throw new AuthError(401, 'AUTH_001', 'Sai email hoặc mật khẩu');
  }
  const user: User =
    payload.email === 'test@example.com'
      ? MOCK_USER
      : {
          user_id: `mock-${payload.email}`,
          email: payload.email,
          full_name: payload.email.split('@')[0],
          role: 'Candidate',
        };
  return { token: issueMockToken(user), user };
}

export async function registerUpstream(payload: RegisterRequest): Promise<UpstreamSession> {
  // MOCK: luôn tạo thành công.
  const user: User = {
    user_id: `mock-${payload.email}`,
    email: payload.email,
    full_name: payload.full_name,
    role: payload.role,
  };
  return { token: issueMockToken(user), user };
}

export async function meUpstream(token: string): Promise<User> {
  // MOCK: tra cứu trong map; nếu không thấy (vd server vừa restart) thì coi như
  // token không hợp lệ để client tự đăng nhập lại.
  const user = mockSessions.get(token);
  if (!user) {
    throw new AuthError(401, 'AUTH_002', 'Phiên đăng nhập không hợp lệ');
  }
  return user;
}

export async function logoutUpstream(token: string): Promise<void> {
  mockSessions.delete(token);
}
