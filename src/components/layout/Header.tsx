'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Header Component
 *
 * Accessible site header with logo and navigation.
 * Meets WCAG 2.1 AA standards including:
 * - Semantic HTML5 header element
 * - Skip navigation target
 * - Proper heading hierarchy
 * - Mobile menu button (44x44px touch target)
 * - Current page indication via aria-current
 */

export interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface HeaderProps {
  /**
   * Site name/title
   * @default 'Pike2ThePolls'
   */
  siteName?: string;

  /**
   * Home page URL
   * @default '/'
   */
  homeUrl?: string;

  /**
   * Navigation items
   */
  navItems?: NavItem[];

  /**
   * CTA button config
   */
  cta?: {
    label: string;
    href: string;
    ariaLabel?: string;
  };

  /**
   * Mobile menu open state
   */
  isMobileMenuOpen?: boolean;

  /**
   * Mobile menu toggle callback
   */
  onMobileMenuToggle?: () => void;

  /**
   * Theme toggle component
   */
  themeToggle?: React.ReactNode;
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'FAQ', href: '/faq' },
];

/**
 * Header Component
 *
 * @example
 * ```tsx
 * <Header
 *   siteName="Pike2ThePolls"
 *   navItems={[
 *     { label: 'Home', href: '/' },
 *     { label: 'FAQ', href: '/faq' },
 *   ]}
 *   cta={{ label: 'Sign Up', href: '/signup' }}
 * />
 * ```
 */
export function Header({
  siteName = 'Pike2ThePolls',
  homeUrl = '/',
  navItems = defaultNavItems,
  cta,
  isMobileMenuOpen = false,
  onMobileMenuToggle,
  themeToggle,
}: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border-light shadow-sm">
      <div className="container mx-auto px-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Site Name */}
          <div className="flex-shrink-0">
            <Link
              href={homeUrl}
              className="text-heading-lg font-bold text-primary-600 hover:text-primary-700 focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
              aria-label={`${siteName} home page`}
            >
              {siteName}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
          </nav>

          {/* Theme Toggle & CTA Button (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {themeToggle && (
              <div className="flex items-center">
                {themeToggle}
              </div>
            )}
            {cta && (
              <Link
                href={cta.href}
                aria-label={cta.ariaLabel}
                className="btn btn-primary px-6 py-3 text-body-md min-h-[44px] inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 hover:bg-primary-700 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
              >
                {cta.label}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          {onMobileMenuToggle && (
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover focus-visible:outline-focus-ring focus-visible:outline-offset-2"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              onClick={onMobileMenuToggle}
            >
              <span className="sr-only">Toggle navigation menu</span>
              {/* Hamburger icon */}
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
                // Close icon
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
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {onMobileMenuToggle && isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border-light bg-background"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-container py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
                  onClick={() => onMobileMenuToggle()}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Theme Toggle in Mobile Menu */}
            {themeToggle && (
              <div className="flex items-center px-4 py-3">
                {themeToggle}
                <span className="ml-3 text-body-md font-medium text-text-secondary">
                  Toggle Theme
                </span>
              </div>
            )}

            {cta && (
              <div className="pt-2">
                <Link
                  href={cta.href}
                  onClick={() => onMobileMenuToggle()}
                  aria-label={cta.ariaLabel}
                  className="btn btn-primary w-full px-6 py-3 text-body-md min-h-[44px] inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 hover:bg-primary-700 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
