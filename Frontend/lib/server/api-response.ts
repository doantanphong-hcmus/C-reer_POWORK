import { NextResponse } from 'next/server';
import type { ApiErrorBody, ApiSuccess } from '@/lib/types';
import { AuthError } from './auth-upstream';

/** Trả response thành công theo đúng envelope { status, data, message } của hệ thống. */
export function jsonSuccess<T>(data: T, message?: string, status = 200): NextResponse {
  const body: ApiSuccess<T> = { status: 'success', data, ...(message ? { message } : {}) };
  return NextResponse.json(body, { status });
}

/** Trả response lỗi theo đúng envelope { status, error_code, message }. */
export function jsonError(status: number, code: string, message: string): NextResponse {
  const body: ApiErrorBody = { status: 'error', error_code: code, message };
  return NextResponse.json(body, { status });
}

/** Chuẩn hoá lỗi không lường trước về một error response thống nhất. */
export function handleRouteError(err: unknown): NextResponse {
  if (err instanceof AuthError) {
    return jsonError(err.status, err.code, err.message);
  }
  return jsonError(500, 'INTERNAL_ERROR', 'Đã có lỗi xảy ra, vui lòng thử lại.');
}
