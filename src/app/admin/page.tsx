'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button, Card, Alert } from '@/components/ui';
import { Container } from '@/components/layout';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/**
 * Admin Dashboard Page
 *
 * Main admin dashboard for managing ride signups.
 * Protected by AdminProtected wrapper in layout.tsx
 */
export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-section">
      <Container>
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-display-xl font-bold text-text-primary mb-2">
                Admin Dashboard
              </h1>
              <p className="text-body-md text-text-secondary">
                Manage ride signups and view requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.email && (
                <span className="hidden sm:inline text-caption-sm text-text-tertiary">
                  {user.email}
                </span>
              )}
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {user?.email && (
            <p className="text-caption-sm text-text-tertiary sm:hidden">
              Signed in as: {user.email}
            </p>
          )}
        </div>

        {/* Welcome Card */}
        <Card className="mb-6">
          <Alert variant="info">
            <h2 className="text-heading-lg font-semibold mb-2">
              Welcome to the Pike2ThePolls Admin Dashboard
            </h2>
            <p className="text-body-md mb-4">
              This dashboard allows you to view and manage ride signup requests from Pike Township residents.
            </p>
            <p className="text-body-sm text-text-tertiary">
              <strong>Note:</strong> The full dashboard functionality will be implemented once the Supabase database is set up.
            </p>
          </Alert>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6">
            <div className="text-heading-lg font-bold text-primary-600 mb-1">
              --
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Total Signups
            </div>
          </Card>

          <Card className="text-center p-6">
            <div className="text-heading-lg font-bold text-warning-600 mb-1">
              --
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Pending
            </div>
          </Card>

          <Card className="text-center p-6">
            <div className="text-heading-lg font-bold text-success-600 mb-1">
              --
            </div>
            <div className="text-caption-sm text-text-tertiary uppercase tracking-wide">
              Confirmed
            </div>
          </Card>
        </div>

        {/* Recent Signups Section */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-xl font-semibold text-text-primary">
              Recent Signups
            </h2>
            <Button variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          <Alert variant="info">
            <p className="text-body-md">
              <strong>Database not yet configured.</strong>
            </p>
            <p className="text-body-sm text-text-tertiary mt-2">
              Once the Supabase database is set up and the signups table is created,
              this section will display all ride signup requests with filtering and management options.
            </p>
            <div className="mt-4">
              <Link
                href="/signup"
                className="text-primary-600 hover:text-primary-700 underline text-body-sm"
              >
                View Signup Form →
              </Link>
            </div>
          </Alert>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-heading-md font-semibold text-text-primary mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/" className="block">
              <Card className="hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <div>
                    <div className="text-heading-md font-medium text-text-primary">
                      View Public Site
                    </div>
                    <div className="text-caption-sm text-text-tertiary">
                      Go to the home page
                    </div>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/faq" className="block">
              <Card className="hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-heading-md font-medium text-text-primary">
                      View FAQ
                    </div>
                    <div className="text-caption-sm text-text-tertiary">
                      Frequently asked questions
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
