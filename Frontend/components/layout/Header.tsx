'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar, RolePill } from '@/components/ui';
import { getInitials } from '@/lib/utils/helpers';
import { cn } from '@/lib/utils/cn';
import type { User } from '@/lib/types';
import { BellIcon, CreateIcon } from './SidebarIcons';

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function MenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex h-8 items-center rounded-lg px-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
    >
      {label}
    </Link>
  );
}

function MenuButton({
  label,
  onClick,
  danger,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-full items-center rounded-lg px-2 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? 'text-error hover:bg-error-bg'
          : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function AccountControlCenter({
  user,
  loggingOut,
  onLogout,
}: {
  user: User;
  loggingOut: boolean;
  onLogout: () => void;
}) {
  return (
    <div className="absolute right-0 top-11 z-50 w-[320px] overflow-hidden rounded-[20px] border-hairline border-border-secondary bg-background-secondary shadow-2xl shadow-black/40">
      <div className="border-b-hairline border-border p-4">
        <div className="flex items-start gap-3">
          <Avatar initials={getInitials(user.full_name)} size="lg" className="h-12 w-12 text-lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-md font-semibold text-foreground">{user.full_name}</p>
            <p className="truncate text-xs text-foreground-secondary">{user.email}</p>
            <div className="mt-2">
              <RolePill role={user.role === 'Employer' ? 'employer' : 'candidate'} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-foreground-secondary">Profile Completion</span>
            <span className="font-mono text-accent">82%</span>
          </div>
          <div className="h-1.5 rounded-pill bg-background-tertiary">
            <div className="h-full w-[82%] rounded-pill bg-accent" />
          </div>
        </div>
      </div>

      <div className="max-h-[min(680px,calc(100vh-88px))] overflow-y-auto p-2">
        <div className="border-b-hairline border-border pb-2">
          <MenuLink href="/candidate/profile" label="View Dynamic Profile" />
          <MenuLink href="/candidate/profile" label="Public Profile" />
          <MenuButton label="Portfolio" />
          <MenuButton label="Resume" />
        </div>

        <div className="border-b-hairline border-border py-2">
          <p className="px-2 pb-1 text-2xs font-semibold uppercase tracking-[0.08em] text-foreground-tertiary">
            Switch Role
          </p>
          <div className="grid grid-cols-2 gap-1 px-1">
            {['Candidate', 'Employer', 'Judge', 'Mentor'].map((role) => (
              <button
                key={role}
                type="button"
                className={`h-8 rounded-lg border-hairline px-2 text-xs font-medium transition-colors ${
                  user.role === role
                    ? 'border-[rgba(124,111,247,0.45)] bg-accent-bg text-accent'
                    : 'border-border bg-background text-foreground-secondary hover:border-border-secondary hover:text-foreground'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b-hairline border-border py-2">
          <MenuButton label="My Companies" />
          <MenuButton label="Bookmarks" />
          <MenuButton label="Saved Challenges" />
          <MenuButton label="Drafts" />
          <MenuButton label="History" />
        </div>

        <div className="border-b-hairline border-border py-2">
          <MenuButton label="Appearance" />
          <MenuButton label="Language" />
          <MenuButton label="Accessibility" />
          <MenuButton label="Settings" />
        </div>

        <div className="pt-2">
          <MenuButton label="Help" />
          <MenuButton label="Feedback" />
          <MenuButton
            label={loggingOut ? 'Signing out...' : 'Sign out'}
            onClick={onLogout}
            danger
            disabled={loggingOut}
          />
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.replace('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border-secondary bg-background-secondary px-4 sm:px-5">
      <div className="relative min-w-0 max-w-[620px] flex-1">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-tertiary" />
        <input
          type="search"
          aria-label="Search workspace"
          placeholder="Tìm challenge, submission, ứng viên..."
          className="h-10 w-full rounded-lg border border-border-secondary bg-background pl-11 pr-4 text-base text-foreground outline-none transition-colors placeholder:text-foreground-tertiary hover:border-[rgba(255,255,255,0.22)] focus:border-accent"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {user?.role === 'Employer' && (
          <Link
            href="/employer/challenges/create"
            className="hidden h-10 items-center gap-2 rounded-lg border border-[rgba(124,111,247,0.42)] bg-accent-bg px-3.5 text-base font-semibold text-accent transition-colors hover:border-accent hover:bg-[rgba(124,111,247,0.2)] md:inline-flex"
          >
            <CreateIcon className="h-[18px] w-[18px]" />
            Create Challenge
          </Link>
        )}
        <button
          type="button"
          aria-label="Thông báo"
          title="Thông báo"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <BellIcon className="h-[22px] w-[22px]" />
          <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full border-2 border-background-secondary bg-accent" />
        </button>
        {user && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              className="flex h-11 items-center gap-2.5 rounded-lg px-2 text-left transition-colors hover:bg-background-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <div className="hidden flex-col items-end sm:flex">
                <span className="max-w-[150px] truncate text-base font-semibold text-foreground">
                  {user.full_name}
                </span>
                <RolePill
                  role={user.role === 'Employer' ? 'employer' : 'candidate'}
                  className="mt-0.5 px-2 py-0 text-xs leading-4"
                />
              </div>
              <Avatar
                initials={getInitials(user.full_name)}
                size="sm"
                className={cn(
                  'h-9 w-9 border-2 text-sm',
                  user.role === 'Employer'
                    ? 'border-warning bg-warning-bg text-warning'
                    : 'border-success bg-success-bg text-success'
                )}
              />
            </button>

            {accountOpen && (
              <AccountControlCenter user={user} loggingOut={loggingOut} onLogout={handleLogout} />
            )}
          </div>
        )}
      </div>
    </header>
  );
}
