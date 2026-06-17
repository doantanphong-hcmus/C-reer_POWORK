import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'open' | 'blind' | 'done' | 'fail' | 'invited';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  open: 'bg-success-bg text-success border-[rgba(34,197,94,0.3)]',
  blind: 'bg-warning-bg text-warning border-[rgba(245,158,11,0.3)]',
  done: 'bg-info-bg text-info border-[rgba(96,165,250,0.3)]',
  fail: 'bg-background-tertiary text-foreground-secondary border-border-secondary',
  invited: 'bg-[rgba(124,111,247,0.15)] text-[#a89ff5] border-[rgba(124,111,247,0.3)]',
};

export function Badge({ variant = 'open', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-pill border-hairline px-[9px] py-0.5 text-2xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
