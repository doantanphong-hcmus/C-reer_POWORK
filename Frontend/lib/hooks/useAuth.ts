import { useCallback } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/endpoints';
import type { LoginRequest, RegisterRequest } from '@/lib/types';

export function useAuth() {
  const { user, accessToken, isAuthenticated, setUser, setAccessToken, logout } = useAuthStore();

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

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
