import React, { HTMLAttributes, forwardRef } from 'react';

/**
 * Container Component
 *
 * Responsive container for content layout.
 * Provides consistent max-width and horizontal padding.
 */

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width of the container
   * @default 'lg'
   */
  size?: ContainerSize;

  /**
   * Remove horizontal padding
   * @default false
   */
  noPadding?: boolean;

  /**
   * Center content horizontally
   * @default true
   */
  centered?: boolean;

  /**
   * Make container full height
   * @default false
   */
  fullHeight?: boolean;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-3xl', // 768px
  md: 'max-w-4xl', // 896px
  lg: 'max-w-6xl', // 1152px
  xl: 'max-w-7xl', // 1280px
  full: 'max-w-full',
};

/**
 * Container Component
 *
 * @example
 * ```tsx
 * <Container>
 *   <h1>Page content here</h1>
 * </Container>
 *
 * <Container size="sm" centered>
 *   <p>Narrower content column</p>
 * </Container>
 *
 * <Container size="xl" noPadding>
 *   <div>Full-bleed content</div>
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'lg',
      noPadding = false,
      centered = true,
      fullHeight = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const sizeClass = sizeClasses[size];
    const paddingClass = noPadding ? '' : 'px-container';
    const centerClass = centered ? 'mx-auto' : '';
    const heightClass = fullHeight ? 'min-h-screen' : '';

    return (
      <div
        ref={ref}
        className={`${sizeClass} ${paddingClass} ${centerClass} ${heightClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
