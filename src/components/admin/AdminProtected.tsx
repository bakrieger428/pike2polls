'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Alert, Card } from '@/components/ui';

export interface AdminProtectedProps {
  children: ReactNode;
  /**
   * Require admin privileges (not just authentication)
   * @default true
   */
  requireAdmin?: boolean;
  /**
   * Custom loading component
   */
  loadingComponent?: ReactNode;
  /**
   * Custom access denied component
   */
  accessDeniedComponent?: ReactNode;
}

/**
 * Admin Protected Route Wrapper
 *
 * Protects admin routes by checking authentication and admin status.
 * Redirects to login if not authenticated, shows access denied if not admin.
 *
 * @example
 * ```tsx
 * <AdminProtected>
 *   <AdminDashboard />
 * </AdminProtected>
 * ```
 */
export function AdminProtected({
  children,
  requireAdmin = true,
  loadingComponent,
  accessDeniedComponent,
}: AdminProtectedProps) {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <>{loadingComponent || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center" role="status" aria-live="polite">
            <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
            <p className="text-body-md text-text-secondary">Loading...</p>
          </div>
        </div>
      )}</>
    );
  }

  // Show access denied if not admin (when requireAdmin is true)
  if (requireAdmin && isAuthenticated && !isAdmin) {
    return (
      <>{accessDeniedComponent || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-section">
          <div className="container mx-auto px-container max-w-md">
            <Card>
              <Alert variant="error">
                <h1 className="text-heading-xl font-bold text-error-800 mb-4">
                  Access Denied
                </h1>
                <p className="text-body-md text-error-700 mb-4">
                  You don&apos;t have permission to access the admin dashboard.
                </p>
                <p className="text-body-sm text-error-600 mb-6">
                  Admin access is restricted to authorized Pike Township Trustee Office staff.
                  If you believe this is an error, please contact your system administrator.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="btn btn-outline"
                  >
                    Go to Home
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/admin/login')}
                    className="btn btn-primary"
                  >
                    Try Different Account
                  </button>
                </div>
              </Alert>
              {user?.email && (
                <p className="text-caption-sm text-text-tertiary text-center mt-4">
                  Signed in as: {user.email}
                </p>
              )}
            </Card>
          </div>
        </div>
      )}</>
    );
  }

  // Show children if authenticated and authorized
  if (isAuthenticated && (!requireAdmin || isAdmin)) {
    return <>{children}</>;
  }

  // Default fallback (shouldn't reach here)
  return null;
}
