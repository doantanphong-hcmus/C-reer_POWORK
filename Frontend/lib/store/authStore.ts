import { create } from 'zustand';
import type { User } from '@/lib/types';

/**
 * Trạng thái auth phía client. LƯU Ý: access token KHÔNG nằm ở đây — nó được
 * giữ trong cookie httpOnly (JS không đọc được). Store này chỉ phản chiếu user
 * hiện tại để render UI; nguồn sự thật về "đã đăng nhập" là cookie + middleware.
 *
 * status:
 *  - 'loading': đang khôi phục phiên (gọi /api/auth/me lúc khởi động)
 *  - 'authenticated' | 'unauthenticated': đã xác định
 */
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthStore {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: 'loading',
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
      status: user !== null ? 'authenticated' : 'unauthenticated',
    }),

  setStatus: (status) => set({ status }),

  reset: () => set({ user: null, isAuthenticated: false, status: 'unauthenticated' }),
}));
