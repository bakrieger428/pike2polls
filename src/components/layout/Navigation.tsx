'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Navigation Component
 *
 * Standalone responsive navigation component.
 * Features:
 * - Desktop horizontal nav with hover states
 * - Mobile slide-in menu with backdrop
 * - Full keyboard navigation
 * - Focus trap when mobile menu is open
 * - Current page indication
 * - Meets WCAG 2.1 AA standards
 */

export interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface NavigationProps {
  /**
   * Navigation items
   */
  items: NavItem[];

  /**
   * ARIA label for the navigation
   * @default 'Main navigation'
   */
  ariaLabel?: string;

  /**
   * Custom logo element
   */
  logo?: React.ReactNode;

  /**
   * Logo href
   * @default '/'
   */
  logoHref?: string;

  /**
   * Mobile menu breakpoint
   * @default 'md'
   */
  mobileBreakpoint?: 'sm' | 'md' | 'lg';

  /**
   * Mobile menu position
   * @default 'right'
   */
  mobilePosition?: 'left' | 'right';

  /**
   * Additional className
   */
  className?: string;
}

/**
 * Navigation Component
 *
 * @example
 * ```tsx
 * <Navigation
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Sign Up', href: '/signup' },
 *     { label: 'FAQ', href: '/faq' },
 *   ]}
 *   logo={<div>MyLogo</div>}
 * />
 * ```
 */
export function Navigation({
  items,
  ariaLabel = 'Main navigation',
  logo,
  logoHref = '/',
  mobileBreakpoint = 'md',
  mobilePosition = 'right',
  className = '',
}: NavigationProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = mobileMenuRef.current?.querySelectorAll(
        'a, button'
      ) as NodeListOf<HTMLElement>;

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    // Focus first item when menu opens
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const breakpointClasses = {
    sm: 'hidden sm:flex',
    md: 'hidden md:flex',
    lg: 'hidden lg:flex',
  };

  const mobilePositionClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <nav className={className} aria-label={ariaLabel}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        {logo && (
          <Link
            href={logoHref}
            className="focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
            aria-label="Home"
          >
            {logo}
          </Link>
        )}

        {/* Desktop Navigation */}
        <div className={breakpointClasses[mobileBreakpoint]} items-center gap-1>
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={isActive ? firstFocusableRef : undefined}
                className={`
                  px-4 py-2 rounded-md text-body-md font-medium transition-colors
                  ${isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }
                  focus-visible:outline-focus-ring focus-visible:outline-offset-2
                `}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={mobileMenuButtonRef}
          type="button"
          className={`flex ${breakpointClasses[mobileBreakpoint]} items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-visible:outline-focus-ring focus-visible:outline-offset-2`}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation-menu"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Toggle navigation menu</span>
          {!isMobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div
            ref={mobileMenuRef}
            id="mobile-navigation-menu"
            className={`fixed top-0 bottom-0 w-64 max-w-[80vw] bg-background shadow-xl z-50 ${mobilePositionClasses[mobilePosition]} transform transition-transform duration-200 ease-in-out`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-light">
                {logo && (
                  <Link
                    href={logoHref}
                    className="focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
                    aria-label="Home"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {logo}
                  </Link>
                )}
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-visible:outline-focus-ring focus-visible:outline-offset-2"
                  aria-label="Close navigation menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Items */}
              <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
                <ul className="space-y-1" role="menu">
                  {items.map((item, index) => {
                    const isActive = pathname === item.href;
                    const isFirst = index === 0;
                    const isLast = index === items.length - 1;

                    return (
                      <li key={item.href} role="none">
                        <Link
                          href={item.href}
                          ref={
                            isFirst
                              ? (firstFocusableRef as React.RefObject<HTMLAnchorElement>)
                              : isLast
                              ? (lastFocusableRef as React.RefObject<HTMLAnchorElement>)
                              : undefined
                          }
                          role="menuitem"
                          className={`
                            block px-4 py-3 rounded-md text-body-md font-medium transition-colors
                            ${isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                            }
                            focus-visible:outline-focus-ring focus-visible:outline-offset-2
                          `}
                          aria-label={item.ariaLabel}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
