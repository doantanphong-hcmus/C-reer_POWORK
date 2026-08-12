'use client';

import { Suspense } from 'react';
import LoginContent from '@/components/auth/LoginContent';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#f4f7f8] text-sm text-slate-500">
          Đang chuẩn bị trang đăng nhập...
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
