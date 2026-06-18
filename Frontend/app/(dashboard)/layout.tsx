'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Sidebar, Header } from '@/components/layout';

/**
 * Layout chung cho các trang đã đăng nhập: Sidebar + Header + nội dung.
 * Middleware (server) đã chặn truy cập khi thiếu cookie; ở đây xử lý thêm
 * trạng thái client: chờ khôi phục phiên (/me) và đẩy về /login nếu cookie hết hạn.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status !== 'authenticated') {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground-secondary">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
