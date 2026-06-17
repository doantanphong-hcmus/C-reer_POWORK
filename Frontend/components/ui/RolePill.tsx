import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Role = 'employer' | 'candidate' | 'system';

interface RolePillProps extends HTMLAttributes<HTMLSpanElement> {
  role: Role;
}

const roleStyles: Record<Role, string> = {
  employer: 'bg-[rgba(124,111,247,0.15)] text-[#a89ff5] border-[rgba(124,111,247,0.35)]',
  candidate: 'bg-[rgba(34,197,94,0.12)] text-[#4ade80] border-[rgba(34,197,94,0.3)]',
  system: 'bg-background-tertiary text-foreground-secondary border-border-secondary',
};

const roleLabels: Record<Role, string> = {
  employer: 'Employer',
  candidate: 'Candidate',
  system: 'Hệ thống',
};

export function RolePill({ role, className, children, ...props }: RolePillProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-pill border-hairline px-[9px] py-0.5 text-2xs font-medium',
        roleStyles[role],
        className
      )}
      {...props}
    >
      {children ?? roleLabels[role]}
    </span>
  );
}
