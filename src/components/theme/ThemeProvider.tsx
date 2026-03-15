'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ComponentProps } from 'react';

/**
 * ThemeProvider Component
 *
 * Wraps the application with next-themes for dark mode support.
 * Must be wrapped in a client component since next-themes uses React context.
 *
 * Features:
 * - System preference detection
 * - Smooth theme transitions
 * - No flash of unstyled content (FOUC)
 * - Persistent theme selection
 *
 * @example
 * ```tsx
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *   {children}
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
