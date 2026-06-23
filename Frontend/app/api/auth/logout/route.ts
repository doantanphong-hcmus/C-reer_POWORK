import { NextRequest } from 'next/server';
import { logoutUpstream } from '@/lib/server/auth-upstream';
import { ACCESS_TOKEN_COOKIE, clearAuthCookie } from '@/lib/server/auth-cookie';
import { jsonSuccess } from '@/lib/server/api-response';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (token) {
    try {
      await logoutUpstream(token);
    } catch {
      // Local logout must still clear the browser cookie even if upstream logout fails.
    }
  }

  const res = jsonSuccess<{ message: string }>({ message: 'Đã đăng xuất' });
  clearAuthCookie(res);
  return res;
}
