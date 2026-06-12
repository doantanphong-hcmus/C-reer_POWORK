import { create } from 'zustand';
import type { User } from '@/lib/types';
import { TOKEN_STORAGE_KEY } from '@/lib/api/client';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  setAccessToken: (accessToken) => {
    if (typeof window !== 'undefined') {
      if (accessToken) {
        localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
    set({ accessToken });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (accessToken) {
        set({ accessToken, isAuthenticated: true });
      }
    }
  },
}));
