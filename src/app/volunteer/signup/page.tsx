import { Metadata } from 'next';
import { VolunteerMultiStepForm } from '@/components/volunteer';
import { Container } from '@/components/layout';
import { Alert } from '@/components/ui';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Volunteer Signup - Pike2ThePolls',
  description: 'Sign up to volunteer with Pike2ThePolls and help Pike Township residents get to the polls.',
};

export default function VolunteerSignupPage() {
  return (
    <Container>
      <div className="max-w-2xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-heading-2xl font-bold text-text-primary mb-4">
            Volunteer with Pike2ThePolls
          </h1>
          <p className="text-body-lg text-text-secondary">
            Help us ensure every Pike Township resident can exercise their right to vote.
            Your time and dedication can make a real difference in our community.
          </p>
        </div>

        {/* Info Alert */}
        <Alert variant="info" className="mb-8">
          <div className="text-body-md">
            <p className="font-semibold mb-2">Volunteer Opportunities</p>
            <ul className="space-y-1 text-body-sm text-text-secondary">
              <li>• <strong>Drivers:</strong> Provide transportation to polling places</li>
              <li>• <strong>Logistical Support:</strong> Help with coordination, check-in, and phone calls</li>
              <li>• <strong>Flexible Scheduling:</strong> Available on May 2, 3, and 5, 2026</li>
            </ul>
          </div>
        </Alert>

        {/* Volunteer Form */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <VolunteerMultiStepForm />
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-body-md text-primary-600 underline hover:text-primary-700"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </Container>
  );
}
