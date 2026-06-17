'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/endpoints';

export function Providers({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);
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
        await worker.start({ onUnhandledRequest: 'bypass' });
      }

      hydrate();
      if (useAuthStore.getState().accessToken) {
        try {
          const user = await authAPI.getMe();
          useAuthStore.getState().setUser(user);
        } catch {
          useAuthStore.getState().logout();
        }
      }
    };
    init();
  }, [hydrate]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
