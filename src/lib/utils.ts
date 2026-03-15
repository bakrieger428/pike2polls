import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 *
 * Combines clsx for conditional classes and tailwind-merge to resolve
 * Tailwind class conflicts. This is useful for component composition
 * where className props need to override default classes.
 *
 * @param inputs - Class names to merge
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * <div className={cn('px-4 py-2', isActive && 'bg-blue-500', className)} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
