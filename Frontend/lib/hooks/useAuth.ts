import { useCallback } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/endpoints';
import type { LoginRequest, RegisterRequest } from '@/lib/types';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const reset = useAuthStore((s) => s.reset);

  const login = useCallback(
    async (payload: LoginRequest) => {
      // BFF set cookie httpOnly và trả về user (không có token trong body).
      const { user } = await authAPI.login(payload);
      setUser(user);
      return user;
    },
    [setUser]
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const { user } = await authAPI.register(payload);
      setUser(user);
      return user;
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    try {
      await authAPI.logout(); // báo BFF clear cookie (best-effort)
    } catch {
      // kệ luôn — vẫn clear state phía client
    } finally {
      reset();
    }
  }, [reset]);

  return {
    user,
    status,
    isAuthenticated,
    login,
    register,
    logout,
  };
}

/**
 * Khôi phục phiên lúc khởi động app (gọi trong providers.tsx init).
 * Luôn đảm bảo status rời khỏi 'loading' khi kết thúc:
 *   - getMe thành công → 'authenticated'
 *   - getMe thất bại   → 'unauthenticated'
 */
export async function checkSession(): Promise<void> {
  try {
    const user = await authAPI.getMe();
    useAuthStore.getState().setUser(user);
  } catch {
    useAuthStore.getState().reset();
  }
}
