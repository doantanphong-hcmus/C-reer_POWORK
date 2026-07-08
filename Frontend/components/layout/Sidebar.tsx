'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUIStore } from '@/lib/store/uiStore';
import { NAV_BY_ROLE, type NavIconName } from '@/lib/constants/nav';
import { cn } from '@/lib/utils/cn';
import {
  BellIcon,
  BookmarkIcon,
  BrandIcon,
  CompanyIcon,
  DotsIcon,
  HistoryIcon,
  MenuIcon,
  SettingsIcon,
  SidebarNavIcon,
} from './SidebarIcons';

type WorkspaceItem = {
  label: string;
  href?: string;
  icon?: NavIconName;
  badge?: string;
  status?: 'active' | 'new' | 'quiet';
};

const pinnedChallenges: WorkspaceItem[] = [
  {
    label: 'React Dashboard',
    href: '/candidate/profile/evidence/evidence-next-dashboard',
    badge: '94',
    status: 'active',
  },
  {
    label: 'UI Challenge',
    href: '/candidate/profile/evidence/evidence-mobile-flow',
    badge: '85',
    status: 'quiet',
  },
  {
    label: 'Database Optimization',
    href: '/candidate/profile/evidence/evidence-cache-api',
    badge: '88',
    status: 'new',
  },
];

const pinnedCompanies: WorkspaceItem[] = [
  { label: 'Google', status: 'quiet' },
  { label: 'FPT', status: 'active' },
  { label: 'VNG', status: 'new' },
  { label: 'Shopee', status: 'quiet' },
];

const followingItems: WorkspaceItem[] = [
  { label: 'Recruiters', badge: '3', status: 'new' },
  { label: 'Mentors', status: 'quiet' },
  { label: 'Organizations', badge: '8', status: 'active' },
];

const recentItems: WorkspaceItem[] = [
  { label: 'Evidence reviewed', href: '/candidate/profile/evidence/evidence-next-dashboard' },
  { label: 'Profile shared', href: '/candidate/profile' },
  { label: 'Challenge submitted', href: '/candidate/profile/evidence/evidence-rubric-builder' },
];

function isActivePath(pathname: string, href?: string) {
  if (!href) return false;

  return (
    pathname === href ||
    (href !== '/dashboard' &&
      href !== '/candidate/dashboard' &&
      href !== '/employer/dashboard' &&
      pathname.startsWith(`${href}/`))
  );
}

function StatusDot({ status }: { status?: WorkspaceItem['status'] }) {
  if (!status) {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-border-secondary" />
      </span>
    );
  }

  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          status === 'active' && 'bg-success',
          status === 'new' && 'bg-accent',
          status === 'quiet' && 'bg-foreground-tertiary'
        )}
      />
    </span>
  );
}

function WorkspaceRow({
  item,
  pathname,
  sidebarOpen,
}: {
  item: WorkspaceItem;
  pathname: string;
  sidebarOpen: boolean;
}) {
  const active = isActivePath(pathname, item.href);
  const icon = item.icon ? (
    <SidebarNavIcon
      name={item.icon}
      className={cn(
        'h-[22px] w-[22px] shrink-0',
        active ? 'text-accent' : 'text-foreground-secondary'
      )}
    />
  ) : (
    <StatusDot status={item.status} />
  );

  const content = (
    <>
      {icon}
      {sidebarOpen && (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="min-w-7 shrink-0 rounded-pill border border-border-secondary bg-background px-2 py-0.5 text-center text-sm font-semibold text-foreground-secondary">
              {item.badge}
            </span>
          )}
          <span
            aria-hidden="true"
            className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-foreground-tertiary transition-colors hover:bg-background hover:text-foreground group-hover:flex"
          >
            <DotsIcon className="h-4 w-4" />
          </span>
        </>
      )}
      {!sidebarOpen && item.badge && (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
      )}
    </>
  );

  const className = cn(
    'group relative flex h-11 w-full items-center gap-3 overflow-hidden rounded-lg px-3 text-left text-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
    active
      ? 'bg-background-tertiary font-semibold text-foreground'
      : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground',
    !sidebarOpen && 'justify-center px-0'
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        title={item.label}
        aria-current={active ? 'page' : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" title={item.label} className={className}>
      {content}
    </button>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="group/section border-b border-border-secondary py-1 last:border-b-0">
      <summary className="flex h-11 cursor-pointer list-none items-center justify-between px-3 text-base font-semibold text-foreground transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="mr-1 h-2 w-2 rotate-[-45deg] border-b border-r border-current text-foreground-tertiary transition-transform group-open/section:rotate-45"
        />
      </summary>
      <div className="space-y-0.5 pb-3">{children}</div>
    </details>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const items = user ? NAV_BY_ROLE[user.role] : [];
  const workspaceItems: WorkspaceItem[] = [
    ...items,
    { label: 'Bookmarks', icon: 'bookmark', badge: '6', status: 'new' },
    { label: 'Notifications', icon: 'notification', badge: '4', status: 'new' },
  ];

  return (
    <aside
      className={cn(
        'relative z-20 flex h-screen shrink-0 flex-col border-r border-border-secondary bg-background-secondary shadow-[6px_0_18px_rgba(0,0,0,0.14)] transition-all duration-200',
        sidebarOpen ? 'w-[272px]' : 'w-[76px]'
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-border-secondary',
          sidebarOpen ? 'justify-between px-4' : 'justify-center px-2'
        )}
      >
        {sidebarOpen && (
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[rgba(124,111,247,0.38)] bg-accent-bg text-accent">
              <BrandIcon className="h-[22px] w-[22px]" />
            </span>
            <div className="min-w-0">
              <span className="block truncate text-lg font-semibold text-foreground">POWORK</span>
              <span className="block truncate text-sm text-foreground-secondary">
                Career workspace
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle navigation sidebar"
          title="Toggle navigation sidebar"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <MenuIcon className="h-[22px] w-[22px]" />
        </button>
      </div>

      <nav className="sidebar-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2">
        {sidebarOpen ? (
          <>
            <SidebarSection title="Workspace">
              {workspaceItems.map((item) => (
                <WorkspaceRow
                  key={`${item.label}-${item.href ?? 'local'}`}
                  item={item}
                  pathname={pathname}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </SidebarSection>

            <SidebarSection title="Pinned Challenges">
              {pinnedChallenges.map((item) => (
                <WorkspaceRow
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </SidebarSection>

            <SidebarSection title="Pinned Companies">
              {pinnedCompanies.map((item) => (
                <WorkspaceRow
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </SidebarSection>

            <SidebarSection title="Following">
              {followingItems.map((item) => (
                <WorkspaceRow
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </SidebarSection>

            <SidebarSection title="Recent Activity">
              {recentItems.map((item) => (
                <WorkspaceRow
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </SidebarSection>
          </>
        ) : (
          <div className="space-y-1 py-1">
            {workspaceItems.slice(0, 6).map((item) => (
              <WorkspaceRow
                key={`${item.label}-${item.href ?? 'local'}`}
                item={item}
                pathname={pathname}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-border-secondary bg-background-secondary px-3 py-3 shadow-[0_-8px_18px_rgba(0,0,0,0.12)]">
        {sidebarOpen ? (
          <div className="space-y-0.5">
            <WorkspaceRow
              item={{ label: 'Settings', icon: 'settings' }}
              pathname={pathname}
              sidebarOpen={sidebarOpen}
            />
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-md font-medium text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <MenuIcon className="h-[22px] w-[22px] shrink-0" />
              <span>Collapse Sidebar</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <button
              type="button"
              title="Bookmarks"
              className="relative flex h-11 w-full items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
            >
              <BookmarkIcon className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </button>
            <button
              type="button"
              title="Notifications"
              className="relative flex h-11 w-full items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </button>
            <button
              type="button"
              title="Recent activity"
              className="flex h-11 w-full items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
            >
              <HistoryIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              title="Pinned companies"
              className="flex h-11 w-full items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
            >
              <CompanyIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              title="Settings"
              className="flex h-11 w-full items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-background-tertiary hover:text-foreground"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
