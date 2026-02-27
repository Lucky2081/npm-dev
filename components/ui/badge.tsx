import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'verified' | 'in-arena' | 'beta' | 'industry' | 'category';
}

export function Badge({ className, variant = 'verified', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-badge text-sm font-medium',
        {
          // Verified
          'bg-success/10 text-success': variant === 'verified',
          // In-Arena
          'border border-gray-200 bg-transparent text-text-secondary': variant === 'in-arena',
          // Beta
          'bg-warning/10 text-warning-dark': variant === 'beta',
          // Industry
          'bg-primary-light text-primary-dark': variant === 'industry',
          // Category
          'bg-bg-tertiary text-text-primary': variant === 'category',
        },
        className
      )}
      {...props}
    >
      {variant === 'verified' && <CheckIcon />}
      {children}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
