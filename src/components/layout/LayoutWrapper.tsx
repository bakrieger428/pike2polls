'use client';

import { useState } from 'react';
import { Header } from './Header';

export interface LayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * LayoutWrapper - Client component for interactive layout elements
 * Handles mobile menu state while keeping layout as server component
 */
export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Header
        siteName="Pike2ThePolls"
        navItems={[
          { label: 'Home', href: '/' },
          { label: 'Volunteer', href: '/volunteer' },
          { label: 'FAQ', href: '/faq' },
        ]}
        cta={{ label: 'Sign Up', href: '/signup', ariaLabel: 'Sign up for a ride to the polls' }}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      {children}
    </>
  );
}
