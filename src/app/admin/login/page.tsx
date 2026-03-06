import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Login | Pike2ThePolls',
  robots: 'noindex, nofollow',
};

export default function AdminLoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '4rem 0' }}>
      <div style={{ maxWidth: '28rem', width: '100%', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/">
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1.5rem', display: 'inline-block' }}>
              Pike2ThePolls
            </h1>
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
            Admin Login
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280' }}>
            Sign in to access the admin dashboard
          </p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@pike2thepolls.com"
                required
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.375rem', border: '1px solid #374151', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.375rem', border: '1px solid #374151', fontSize: '1rem' }}
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: 'white', fontWeight: '500', borderRadius: '0.375rem', border: 'none', fontSize: '1rem', cursor: 'pointer', minHeight: '44px' }}
            >
              Sign In
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
              For security, this login is restricted to authorized Pike Township Trustee Office staff.
            </p>
            <div style={{ textAlign: 'center' }}>
              <Link
                href="/"
                style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.875rem' }}
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
            Need help accessing your account?
          </p>
          <a
            href="mailto:trustee@pike2thepolls.com"
            style={{ color: '#2563eb', textDecoration: 'underline', fontSize: '0.875rem' }}
          >
            Contact System Administrator
          </a>
        </div>
      </div>
    </div>
  );
}
