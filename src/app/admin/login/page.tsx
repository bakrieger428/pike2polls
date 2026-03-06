'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input, Button, Card } from '@/components/ui';
import { Container } from '@/components/layout';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log('AdminLoginPage rendering');

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
            <form className="space-y-6" noValidate>
              {/* Email Input */}
              <Input
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@pike2thepolls.com"
                required
              />

              {/* Password Input */}
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
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
                  className="text-primary-600 hover:text-primary-700 underline text-body-sm"
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
              className="text-primary-600 hover:text-primary-700 underline text-body-sm"
            >
              Contact System Administrator
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
