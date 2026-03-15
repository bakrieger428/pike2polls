'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * ThemeToggle Component
 *
 * Accessible dark mode toggle button with smooth transitions.
 * Meets WCAG 2.1 AA standards.
 *
 * Features:
 * - System preference detection
 * - Sun/moon icon animation
 * - Screen reader support
 * - Keyboard navigation
 * - 44x44px touch target
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-visible:outline-focus-ring focus-visible:outline-offset-2"
        aria-label="Toggle theme"
        disabled
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        <span className="sr-only">Toggle theme</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-visible:outline-focus-ring focus-visible:outline-offset-2 transition-colors"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>

      {/* Sun icon (shown in dark mode) */}
      <svg
        className={`w-5 h-5 transition-transform duration-200 ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon icon (shown in light mode) */}
      <svg
        className={`w-5 h-6 absolute transition-transform duration-200 ${!isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
