import type { UserRole } from '@/lib/types';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

/**
 * Menu điều hướng theo vai trò. Sidebar render danh sách tương ứng role của
 * user hiện tại. Thêm/bớt mục ở đây để đổi điều hướng toàn cục.
 */
export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  Candidate: [
    { label: 'Tổng quan', href: '/candidate/dashboard', icon: '🏠' },
    { label: 'Thử thách', href: '/challenges', icon: '🎯' },
    { label: 'Bài nộp của tôi', href: '/candidate/my-submissions', icon: '📤' },
    { label: 'Hồ sơ', href: '/profile', icon: '👤' },
  ],
  Employer: [
    { label: 'Tổng quan', href: '/employer/dashboard', icon: '🏠' },
    { label: 'Thử thách của tôi', href: '/challenges', icon: '🎯' },
    { label: 'Tạo thử thách', href: '/employer/challenges/create', icon: '➕' },
    { label: 'Talent Pool', href: '/talent-pool', icon: '⭐' },
  ],
};
