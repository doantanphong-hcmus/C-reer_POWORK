import { NextRequest } from 'next/server';
import { logoutUpstream } from '@/lib/server/auth-upstream';
import { ACCESS_TOKEN_COOKIE, clearAuthCookie } from '@/lib/server/auth-cookie';
import { jsonSuccess, handleRouteError } from '@/lib/server/api-response';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (token) {
      await logoutUpstream(token);
    }
    const res = jsonSuccess<{ message: string }>({ message: 'Đã đăng xuất' });
    clearAuthCookie(res);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
