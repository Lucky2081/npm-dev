import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'large' | 'default' | 'small';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast',
          'focus-visible:outline-none focus-visible:shadow-focus',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            // Primary
            'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark/90':
              variant === 'primary',
            // Secondary
            'border-2 border-gray-200 bg-transparent text-text-primary hover:bg-bg-secondary hover:border-gray-300':
              variant === 'secondary',
            // Ghost
            'bg-transparent text-primary hover:bg-primary-light': variant === 'ghost',
            // Text
            'bg-transparent text-primary hover:underline': variant === 'text',
          },
          {
            // Large
            'h-14 px-8 text-lg': size === 'large',
            // Default
            'h-11 px-6 text-base': size === 'default',
            // Small
            'h-9 px-4 text-sm': size === 'small',
          },
          'rounded-button',
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
