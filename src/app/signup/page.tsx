import { Metadata } from 'next';
import Link from 'next/link';
import { MultiStepForm } from '@/components/form';
import { Container } from '@/components/layout';
import { Alert } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign Up for a Ride | Pike2ThePolls',
  description: 'Pike Township residents can sign up for free rides to polling places on election day. Complete our simple form to request your ride today.',
  robots: 'index, follow',
};

export default function SignupPage() {
  return (
    <div className="py-section bg-neutral-50 min-h-screen">
      <Container size="md">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-display-xl font-bold text-text-primary mb-4">
            Sign Up for Your Ride
          </h1>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Complete the form below to request your free ride to the polls.
            It only takes about 5 minutes, and we&apos;ll confirm your details within 24-48 hours.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-card shadow-card border border-border-light p-6 md:p-8">
          {/* Info Alert */}
          <div className="mb-6">
            <Alert variant="info">
              <p className="text-body-sm">
                <strong>Before you start:</strong> Please make sure you&apos;re a Pike Township resident
                and registered to vote in Indiana. This service is free and available to all eligible residents.
              </p>
            </Alert>
          </div>

          {/* Multi-Step Form */}
          <MultiStepForm />
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 underline text-body-md focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
          >
            ← Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
