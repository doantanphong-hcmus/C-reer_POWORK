'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession } from '@/lib/hooks/useAuth';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

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
      // Demo mode bật mặc định; đặt NEXT_PUBLIC_DEMO_MODE=false để gọi Backend thật.
      if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'false') {
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

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
