'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession } from '@/lib/hooks/useAuth';

export function Providers({ children }: { children: ReactNode }) {
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
      // ── 1. MSW (chỉ dev) ─────────────────────────────────────────────
      // Bọc riêng try/catch: nếu MSW fail thì log cảnh báo và VẪN tiếp
      // tục xuống bước khôi phục phiên — không để MSW kéo chết cả init.
      if (process.env.NODE_ENV === 'development') {
        try {
          const { worker } = await import('@/__mocks__/client');
          await worker.start({ onUnhandledRequest: 'bypass' });
        } catch (err) {
          console.warn('[MSW] Không khởi động được mock worker, bỏ qua:', err);
        }
      }

      // ── 2. Khôi phục phiên ───────────────────────────────────────────
      // checkSession() đã tự bọc try/catch, luôn kết thúc ở
      // 'authenticated' hoặc 'unauthenticated', không bao giờ kẹt 'loading'.
      await checkSession();
    };

    // Safety net: dù init() có lỗi bất ngờ nào lọt qua, status vẫn
    // PHẢI rời khỏi 'loading' để guard không treo "Đang tải..." mãi.
    init().catch(() => {
      useAuthStore.getState().reset();
    });
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
