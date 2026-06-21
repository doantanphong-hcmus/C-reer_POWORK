import { NextRequest } from 'next/server';
import { registerSchema } from '@/lib/validations/auth';
import { registerUpstream } from '@/lib/server/auth-upstream';
import { setAuthCookie } from '@/lib/server/auth-cookie';
import { jsonError, jsonSuccess, handleRouteError } from '@/lib/server/api-response';
import type { AuthResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError(422, 'VALIDATION_ERROR', 'Dữ liệu đăng ký không hợp lệ');
    }

    const { token, user } = await registerUpstream(parsed.data);
    const res = jsonSuccess<AuthResponse>({ user }, 'Đăng ký thành công', 201);
    setAuthCookie(res, token);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
