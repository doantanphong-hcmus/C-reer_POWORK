'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/endpoints';

export function Providers({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
  // Thêm State để kiểm soát xem hệ thống bổ trợ (MSW + Auth) đã init xong chưa
  const [isReady, setIsReady] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
          },
        },
      })
  );

  useEffect(() => {
    const init = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          const { worker } = await import('@/__mocks__/client');
          // Chờ MSW bật khiên đánh chặn xong hoàn toàn
          await worker.start({ onUnhandledRequest: 'bypass' });
        }

        // Khôi phục session đăng nhập
        hydrate();
        if (useAuthStore.getState().accessToken) {
          try {
            const user = await authAPI.getMe();
            useAuthStore.getState().setUser(user);
          } catch {
            useAuthStore.getState().logout();
          }
        }
      } catch (error) {
        console.error('Lỗi khởi tạo hệ thống:', error);
      } finally {
        // Báo hiệu: Đã chuẩn bị xong xuôi hết rồi!
        setIsReady(true);
      }
    };
    init();
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Nếu chưa Ready (MSW đang khởi động), trả về một màn hình Loading trống,
        ngăn không cho các component con (Dashboard) được render và gọi API sớm.
      */}
      {!isReady ? (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Chờ khởi tạo dữ liệu...</p>
        </div>
      ) : (
        children
      )}
    </QueryClientProvider>
  );
}