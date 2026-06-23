'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUIStore } from '@/lib/store/uiStore';
import { NAV_BY_ROLE } from '@/lib/constants/nav';
import { cn } from '@/lib/utils/cn';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const items = user ? NAV_BY_ROLE[user.role] : [];

  return (
    <aside
      className={cn(
        'flex h-screen shrink-0 flex-col border-r-hairline border-border-secondary bg-background-secondary transition-all duration-200',
        sidebarOpen ? 'w-60' : 'w-[64px]'
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center border-b-hairline border-border-secondary',
          sidebarOpen ? 'justify-between px-3' : 'justify-center px-2'
        )}
      >
        {sidebarOpen && (
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-lg">🚀</span>
            <span className="truncate text-md font-semibold text-foreground">POWORK</span>
          </div>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Bật/tắt thanh điều hướng"
          title="Bật/tắt thanh điều hướng"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
        >
          ☰
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
        {items.map((item) => {
          const hasExactNestedItem = items.some(
            (other) => other.href !== item.href && pathname === other.href
          );
          const isActive =
            pathname === item.href ||
            (!hasExactNestedItem &&
              item.href !== '/dashboard' &&
              item.href !== '/candidate/dashboard' &&
              item.href !== '/employer/dashboard' &&
              pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-base transition-colors',
                isActive
                  ? 'bg-accent-bg text-accent'
                  : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground',
                !sidebarOpen && 'justify-center'
              )}
            >
              <span className="text-md leading-none">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
