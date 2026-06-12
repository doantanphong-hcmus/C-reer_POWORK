import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface AnonChipProps extends HTMLAttributes<HTMLSpanElement> {
  code: number | string;
}

export function AnonChip({ code, className, ...props }: AnonChipProps) {
  const formatted = typeof code === 'number' ? String(code).padStart(3, '0') : code;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] rounded-pill border-hairline border-dashed border-border-secondary',
        'bg-background-tertiary px-[9px] py-[3px] text-2xs text-foreground-tertiary',
        className
      )}
      {...props}
    >
      <span aria-hidden>👤</span>
      Ứng viên #{formatted}
    </span>
  );
}
