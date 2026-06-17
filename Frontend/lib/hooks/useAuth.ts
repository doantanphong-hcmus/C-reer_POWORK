import { useCallback } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/endpoints';
import type { LoginRequest, RegisterRequest } from '@/lib/types';

export function useAuth() {
  const { user, accessToken, isAuthenticated, setUser, setAccessToken } = useAuthStore();

  const login = useCallback(
    async (payload: LoginRequest) => {
      const session = await authAPI.login(payload);
      setAccessToken(session.access_token);
      setUser(session.user);
      return session;
    },
    [setAccessToken, setUser]
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const session = await authAPI.register(payload);
      setAccessToken(session.access_token);
      setUser(session.user);
      return session;
    },
    [setAccessToken, setUser]
  );

  const logoutStore = useAuthStore((s) => s.logout);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout(); // báo BE (best-effort)
    } catch {
      // kệ luôn
    } finally {
      logoutStore(); // clear token + user + state
    }
  }, [logoutStore]);
  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
