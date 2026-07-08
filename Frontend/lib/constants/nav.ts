import type { UserRole } from '@/lib/types';

export type NavIconName =
  | 'home'
  | 'challenge'
  | 'submission'
  | 'profile'
  | 'create'
  | 'talent'
  | 'bookmark'
  | 'notification'
  | 'settings';

export interface NavItem {
  label: string;
  href: string;
  icon: NavIconName;
}

/**
 * Menu điều hướng theo vai trò. Sidebar render danh sách tương ứng role của
 * user hiện tại. Thêm/bớt mục ở đây để đổi điều hướng toàn cục.
 */
export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  Candidate: [
    { label: 'Overview', href: '/candidate/dashboard', icon: 'home' },
    { label: 'Challenges', href: '/challenges', icon: 'challenge' },
    { label: 'My Submissions', href: '/candidate/my-submissions', icon: 'submission' },
    { label: 'Dynamic Profile', href: '/candidate/profile', icon: 'profile' },
  ],
  Employer: [
    { label: 'Overview', href: '/employer/dashboard', icon: 'home' },
    { label: 'Challenges', href: '/challenges', icon: 'challenge' },
    { label: 'Create Challenge', href: '/employer/challenges/create', icon: 'create' },
    { label: 'Talent Pool', href: '/talent-pool', icon: 'talent' },
  ],
};
