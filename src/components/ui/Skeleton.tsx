import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Skeleton Component
 *
 * Accessible loading placeholder component that indicates content is loading.
 * Meets WCAG 2.1 AA standards with proper ARIA attributes.
 *
 * Features:
 * - Smooth shimmer animation
 * - Customizable sizes and shapes
 * - Screen reader support
 * - Can be used for text, images, cards, etc.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-32" /> // Text skeleton
 * <Skeleton className="h-48 w-full rounded-lg" /> // Image skeleton
 * <Skeleton className="h-24 w-full" variant="card" /> // Card skeleton
 * ```
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant for different use cases
   * @default 'default'
   */
  variant?: 'default' | 'text' | 'circular' | 'card' | 'button';

  /**
   * Whether to show the animation
   * @default true
   */
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = 'default',
  animate = true,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    default: 'rounded-md',
    text: 'rounded h-4',
    circular: 'rounded-full',
    card: 'rounded-lg',
    button: 'rounded-md h-11',
  };

  return (
    <div
      className={cn(
        'bg-neutral-200 dark:bg-neutral-700',
        variantClasses[variant],
        animate && 'animate-pulse',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      {...props}
    >
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

/**
 * SkeletonCard Component
 *
 * Pre-configured skeleton for card components.
 *
 * @example
 * ```tsx
 * <SkeletonCard />
 * ```
 */
export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('p-4 border border-border-light rounded-lg', className)}
      {...props}
    >
      <Skeleton className="h-6 w-3/4 mb-4" variant="text" />
      <Skeleton className="h-4 w-full mb-2" variant="text" />
      <Skeleton className="h-4 w-5/6 mb-2" variant="text" />
      <Skeleton className="h-4 w-4/6" variant="text" />
    </div>
  );
}

/**
 * SkeletonList Component
 *
 * Pre-configured skeleton for list items.
 *
 * @example
 * ```tsx
 * <SkeletonList count={5} />
 * ```
 */
export function SkeletonList({
  count = 3,
  className,
}: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)} role="status" aria-live="polite">
      <span className="sr-only">Loading list items...</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton variant="circular" className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" variant="text" />
            <Skeleton className="h-3 w-1/2" variant="text" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonTable Component
 *
 * Pre-configured skeleton for table rows.
 *
 * @example
 * ```tsx
 * <SkeletonTable rows={5} columns={4} />
 * ```
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} role="status" aria-live="polite">
      <span className="sr-only">Loading table data...</span>
      {/* Header */}
      <div className="flex space-x-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-8 flex-1" variant="text" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-12 flex-1"
              variant="text"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
