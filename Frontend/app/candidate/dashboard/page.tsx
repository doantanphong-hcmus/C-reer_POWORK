'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { NAV_BY_ROLE } from '@/lib/constants/nav';

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const shortcuts = NAV_BY_ROLE[user.role].filter((item) => item.href !== '/dashboard');

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold text-foreground">Xin chào, {user.full_name} 👋</h1>
      <p className="mt-1 text-base text-foreground-secondary">
        {user.role === 'Employer'
          ? 'Quản lý thử thách và tìm kiếm ứng viên qua bằng chứng thực chiến.'
          : 'Chinh phục thử thách để chứng minh năng lực thực chiến của bạn.'}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card transition-colors hover:border-accent"
          >
            <div className="text-2xl">{item.icon}</div>
            <div className="mt-2 text-md font-medium text-foreground">{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
