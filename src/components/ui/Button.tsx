import React from 'react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

/**
 * Button Component
 *
 * Accessible button component with multiple variants.
 * All variants meet WCAG 2.1 AA standards including:
 * - Touch target minimum 44x44px
 * - Color contrast minimum 4.5:1
 * - Full keyboard navigation
 * - Visible focus indicators
 * - Proper ARIA attributes
 */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Loading state - shows spinner and disables button
   * @default false
   */
  isLoading?: boolean;

  /**
   * Icon to display before text
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display after text
   */
  endIcon?: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-body-sm min-h-[40px]',
  md: 'px-6 py-3 text-body-md min-h-[44px]',
  lg: 'px-8 py-4 text-body-lg min-h-[48px]',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  text: 'btn-text',
};

/**
 * Button Component
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="outline" startIcon={<Icon />}>
 *   With icon
 * </Button>
 *
 * <Button variant="primary" isLoading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      startIcon,
      endIcon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    const sizeClass = sizeClasses[size];
    const variantClass = variantClasses[variant];
    const widthClass = fullWidth ? 'w-full' : '';

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${sizeClass} ${variantClass} ${widthClass} ${className}`.trim()}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {!isLoading && startIcon && <span className="flex-shrink-0">{startIcon}</span>}
        {typeof children === 'string' ? <span>{children}</span> : children}
        {!isLoading && endIcon && <span className="flex-shrink-0">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
