import { NextRequest } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';
import { loginUpstream } from '@/lib/server/auth-upstream';
import { setAuthCookie } from '@/lib/server/auth-cookie';
import { jsonError, jsonSuccess, handleRouteError } from '@/lib/server/api-response';
import type { AuthResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError(422, 'VALIDATION_ERROR', 'Dữ liệu đăng nhập không hợp lệ');
    }

    const { token, user } = await loginUpstream(parsed.data);
    const res = jsonSuccess<AuthResponse>({ user }, 'Đăng nhập thành công');
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
