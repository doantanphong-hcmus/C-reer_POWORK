import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-md border-hairline bg-background-tertiary px-[11px] py-[7px] text-xs text-foreground',
          'placeholder:text-foreground-tertiary',
          'focus:outline-none focus:border-accent transition-colors',
          error ? 'border-error' : 'border-border-secondary',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
