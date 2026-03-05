import React from 'react';
import Link from 'next/link';

/**
 * Footer Component
 *
 * Accessible site footer with contact info and links.
 * Meets WCAG 2.1 AA standards including:
 * - Semantic HTML5 footer element
 * - Proper heading hierarchy
 * - Accessible link labels
 * - Print-friendly (can be hidden via .no-print)
 */

export interface FooterLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  /**
   * Copyright text
   * @default '© 2026 Pike2ThePolls. All rights reserved.'
   */
  copyright?: string;

  /**
   * Organization name
   * @default 'Pike2ThePolls'
   */
  organization?: string;

  /**
   * Contact information
   */
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };

  /**
   * Footer sections with links
   */
  sections?: FooterSection[];

  /**
   * Additional footer content
   */
  children?: React.ReactNode;
}

const defaultSections: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Sign Up', href: '/signup' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/faq#privacy' },
      { label: 'Terms of Service', href: '/faq#terms' },
    ],
  },
];

/**
 * Footer Component
 *
 * @example
 * ```tsx
 * <Footer
 *   organization="Pike Township Trustee Office"
 *   contact={{
 *     email: "support@pike2thepolls.com",
 *     phone: "(317) 978-1131",
 *     address: "123 Main St, Indianapolis, IN 46268"
 *   }}
 * />
 * ```
 */
export function Footer({
  copyright = `© ${new Date().getFullYear()} Pike2ThePolls. All rights reserved.`,
  organization = 'Pike2ThePolls',
  contact,
  sections = defaultSections,
  children,
}: FooterProps) {
  return (
    <footer className="bg-background border-t border-border-light mt-auto" role="contentinfo">
      <div className="container mx-auto px-container py-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Organization Info */}
          <div className="space-y-4">
            <h2 className="text-heading-lg font-semibold text-text-primary">
              {organization}
            </h2>
            {contact && (
              <address className="not-italic space-y-2 text-body-md text-text-secondary">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-text-tertiary flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-primary-600 focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-text-tertiary flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${contact.phone}`}
                      className="hover:text-primary-600 focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-text-tertiary flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{contact.address}</span>
                  </div>
                )}
              </address>
            )}
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <nav key={section.title} aria-label={`${section.title} navigation`}>
              <h3 className="text-heading-md font-semibold text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-md text-text-secondary hover:text-primary-600 focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
                      aria-label={link.ariaLabel}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Additional content */}
        {children && (
          <div className="mt-8 pt-8 border-t border-border-light">
            {children}
          </div>
        )}

        {/* Copyright */}
        <p className="mt-8 pt-8 border-t border-border-light text-caption-md text-text-tertiary text-center">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
