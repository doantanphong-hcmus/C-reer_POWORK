import { NextRequest } from 'next/server';
import { AuthError, meUpstream } from '@/lib/server/auth-upstream';
import { ACCESS_TOKEN_COOKIE, clearAuthCookie } from '@/lib/server/auth-cookie';
import { jsonError, jsonSuccess, handleRouteError } from '@/lib/server/api-response';
import type { User } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!token) {
      return jsonError(401, 'AUTH_000', 'Chưa đăng nhập');
    }

    const user = await meUpstream(token);
    return jsonSuccess<User>(user);
  } catch (err) {
    const res = handleRouteError(err);
    if (err instanceof AuthError && err.status === 401) {
      clearAuthCookie(res);
    }
    return res;
  }
}
