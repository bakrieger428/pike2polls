'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Input, Button, Alert, Card } from '@/components/ui';
import { Container } from '@/components/layout';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isAuthenticated, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/admin';
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    // Basic validation
    if (!email.trim()) {
      setFormError('Please enter your email address');
      return;
    }

    if (!password) {
      setFormError('Please enter your password');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        // Handle common errors
        if (signInError.message.includes('Invalid login credentials')) {
          setFormError('Invalid email or password. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setFormError('Please confirm your email address before logging in.');
        } else {
          setFormError(signInError.message);
        }
      }
      // If successful, the useEffect will handle redirect
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-section flex items-center">
      <Container size="sm">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-display-xl font-bold text-primary-600">
                Pike2ThePolls
              </h1>
            </Link>
            <h2 className="text-heading-xl font-semibold text-text-primary mb-2">
              Admin Login
            </h2>
            <p className="text-body-md text-text-secondary">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Login Form Card */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Error Alert */}
              {(formError || error) && (
                <Alert variant="error" role="alert">
                  {formError || error}
                </Alert>
              )}

              {/* Email Input */}
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError(null);
                }}
                error={formError && !email.trim() ? 'Email is required' : undefined}
                autoComplete="email"
                placeholder="admin@pike2thepolls.com"
                required
                disabled={isLoading || isSubmitting}
              />

              {/* Password Input */}
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError(null);
                }}
                error={formError && !password ? 'Password is required' : undefined}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                disabled={isLoading || isSubmitting}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading || isSubmitting}
                disabled={isLoading || isSubmitting}
              >
                Sign In
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-border-light space-y-3">
              <p className="text-caption-sm text-text-tertiary text-center">
                For security, this login is restricted to authorized Pike Township Trustee Office staff.
              </p>
              <div className="text-center">
                <Link
                  href="/"
                  className="text-primary-600 hover:text-primary-700 underline text-body-sm focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </Card>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-body-sm text-text-tertiary mb-2">
              Need help accessing your account?
            </p>
            <a
              href="mailto:trustee@pike2thepolls.com"
              className="text-primary-600 hover:text-primary-700 underline text-body-sm focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
            >
              Contact System Administrator
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
