'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/endpoints';

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
      if (process.env.NODE_ENV === 'development') {
        const { worker } = await import('@/__mocks__/client');
        // Bỏ qua /api/auth/* — đó là BFF same-origin, không phải resource cần mock.
        await worker.start({ onUnhandledRequest: 'bypass' });
      }

      // Khôi phục phiên: token nằm trong cookie httpOnly (JS không đọc được) nên
      // hỏi BFF /api/auth/me xem cookie còn hợp lệ không.
      try {
        const user = await authAPI.getMe();
        useAuthStore.getState().setUser(user);
      } catch {
        useAuthStore.getState().reset();
      }
    };
    init();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}