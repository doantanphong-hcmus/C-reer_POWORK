'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar, RolePill, Button } from '@/components/ui';
import { getInitials } from '@/lib/utils/helpers';

const PAGE_META = [
  {
    match: (pathname: string) => pathname === '/employer/dashboard',
    title: 'Tổng quan tuyển dụng',
    subtitle: 'Theo dõi challenge, bài nộp và pipeline ứng viên.',
  },
  {
    match: (pathname: string) => pathname === '/candidate/dashboard',
    title: 'Tổng quan',
    subtitle: 'Xem nhanh hoạt động và lối tắt quan trọng.',
  },
  {
    match: (pathname: string) => pathname === '/employer/challenges/create',
    title: 'Tạo thử thách',
    subtitle: 'Thiết lập đề bài và rubric chấm điểm.',
  },
  {
    match: (pathname: string) => pathname.startsWith('/challenges'),
    title: 'Thử thách',
    subtitle: 'Quản lý và theo dõi các challenge.',
  },
  {
    match: (pathname: string) => pathname.startsWith('/talent-pool'),
    title: 'Talent Pool',
    subtitle: 'Theo dõi ứng viên đã được mở hồ sơ.',
  },
  {
    match: (pathname: string) => pathname.startsWith('/profile'),
    title: 'Hồ sơ',
    subtitle: 'Cập nhật năng lực và bằng chứng thực chiến.',
  },
];

function getPageMeta(pathname: string) {
  return (
    PAGE_META.find((item) => item.match(pathname)) ?? {
      title: 'POWORK',
      subtitle: 'Không gian làm việc của bạn.',
    }
  );
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const pageMeta = getPageMeta(pathname);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.replace('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b-hairline border-border-secondary bg-background-secondary px-4">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-foreground">{pageMeta.title}</h1>
        <p className="hidden truncate text-sm text-foreground-secondary sm:block">
          {pageMeta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === 'Employer' && (
          <Link
            href="/employer/challenges/create"
            className="hidden items-center rounded-lg border-hairline border-[rgba(124,111,247,0.35)] bg-accent-bg px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:opacity-90 sm:inline-flex"
          >
            + Tạo challenge
          </Link>
        )}
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
