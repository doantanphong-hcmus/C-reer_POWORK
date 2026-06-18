import type { NextResponse } from 'next/server';

/**
 * Tên cookie chứa access token. Cookie được set httpOnly nên JS phía client
 * KHÔNG đọc được — chỉ trình duyệt tự gửi kèm request same-origin và Next
 * middleware (server-side) đọc được. Đây là điểm cốt lõi để "lưu token an toàn".
 */
export const ACCESS_TOKEN_COOKIE = 'access_token';

/** Thời gian sống mặc định của token (giây) — 7 ngày. */
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Gắn access token vào response dưới dạng cookie httpOnly an toàn.
 * Dùng trong các Route Handler (app/api/auth/*).
 */
export function setAuthCookie(res: NextResponse, token: string, maxAge = DEFAULT_MAX_AGE) {
  res.cookies.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

/** Xoá cookie access token (đăng xuất). */
export function clearAuthCookie(res: NextResponse) {
  res.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
