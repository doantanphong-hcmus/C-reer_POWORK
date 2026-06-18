'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUIStore } from '@/lib/store/uiStore';
import { Avatar, RolePill, Button } from '@/components/ui';
import { getInitials } from '@/lib/utils/helpers';

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.replace('/login');
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b-hairline border-border-secondary bg-background-secondary px-4">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Bật/tắt thanh điều hướng"
        className="rounded-md p-2 text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
      >
        ☰
      </button>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-medium text-foreground">{user.full_name}</span>
              <RolePill role={user.role === 'Employer' ? 'employer' : 'candidate'} />
            </div>
            <Avatar initials={getInitials(user.full_name)} size="sm" />
          </>
        )}
        <Button variant="danger" size="sm" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? 'Đang thoát...' : 'Đăng xuất'}
        </Button>
      </div>
    </header>
  );
}
