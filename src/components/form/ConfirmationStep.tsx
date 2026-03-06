'use client';

import { Button, Card, Alert } from '@/components/ui';

export interface ConfirmationStepProps {
  formData: {
    first_name: string;
    last_name: string;
    is_pike_resident: boolean | null;
    is_registered_voter: boolean | null;
    voting_date: string | null;
    preferred_time: string | null;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
    liability_waiver_agreed?: boolean;
    disclaimer_agreed?: boolean;
  };
  onRestart: () => void;
  error?: string;
  isLoading?: boolean;
}

/**
 * Step 8: Confirmation
 * Displays thank you message, comprehensive submission summary, and print functionality
 */
export function ConfirmationStep({ formData, onRestart, error, isLoading }: ConfirmationStepProps) {
  const votingDateLabels: Record<string, string> = {
    'early-voting-date-1': 'April 24, 2026 - Early Voting',
    'early-voting-date-2': 'April 26, 2026 - Early Voting',
    'election-day': 'May 5, 2026 - Election Day',
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-center py-8" role="status" aria-live="polite">
        <div className="inline-block w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <h2 className="text-heading-xl font-semibold text-text-primary">
          Submitting Your Request...
        </h2>
        <p className="text-body-md text-text-secondary">
          Please wait while we process your information.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6" role="alert" aria-live="assertive">
        <Alert variant="error">
          <p className="font-semibold text-lg mb-2">Unable to Submit Your Request</p>
          <p className="text-body-md">{error}</p>
        </Alert>
        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onRestart}>
            Start Over
          </Button>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="status" aria-live="polite">
      {/* Success Message */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-display-xl font-bold text-text-primary mb-2">
          Thank You, {formData.first_name}!
        </h2>
        <p className="text-body-lg text-text-secondary">
          Your ride request has been submitted successfully.
        </p>
      </div>

      <Alert variant="success">
        <p className="text-body-md">
          We&apos;ll contact you at <strong>{formData.email}</strong> or <strong>{formData.phone}</strong> to confirm your pickup details.
        </p>
      </Alert>

      {/* Summary Card */}
      <Card className="confirmation-summary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-lg font-semibold text-text-primary">
            Request Summary
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="no-print"
            aria-label="Print confirmation"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Confirmation
          </Button>
        </div>

        <dl className="space-y-3 text-body-md">
          {/* Personal Information */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h4 className="text-heading-sm font-semibold text-text-primary mb-3">Personal Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-border-light">
                <dt className="text-text-tertiary">Name:</dt>
                <dd className="font-medium text-text-primary text-right">
                  {formData.first_name} {formData.last_name}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b border-border-light">
                <dt className="text-text-tertiary">Email:</dt>
                <dd className="font-medium text-text-primary text-right">{formData.email}</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-text-tertiary">Phone:</dt>
                <dd className="font-medium text-text-primary text-right">{formData.phone}</dd>
              </div>
            </div>
          </div>

          {/* Voting Information */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h4 className="text-heading-sm font-semibold text-text-primary mb-3">Voting Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-border-light">
                <dt className="text-text-tertiary">Voting Date:</dt>
                <dd className="font-medium text-text-primary text-right">
                  {formData.voting_date ? votingDateLabels[formData.voting_date] : 'N/A'}
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-text-tertiary">Preferred Time:</dt>
                <dd className="font-medium text-text-primary text-right">{formData.preferred_time}</dd>
              </div>
            </div>
          </div>

          {/* Pickup Information */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h4 className="text-heading-sm font-semibold text-text-primary mb-3">Pickup Information</h4>
            <div className="space-y-2">
              {formData.address && (
                <div className="flex justify-between py-2 border-b border-border-light">
                  <dt className="text-text-tertiary">Pickup Address:</dt>
                  <dd className="font-medium text-text-primary text-right max-w-xs">{formData.address}</dd>
                </div>
              )}
              {formData.notes && (
                <div className="py-2">
                  <dt className="text-text-tertiary mb-1">Additional Notes:</dt>
                  <dd className="text-text-primary">{formData.notes}</dd>
                </div>
              )}
            </div>
          </div>

          {/* Waiver Agreements */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h4 className="text-heading-sm font-semibold text-text-primary mb-3">Agreements</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 py-2 border-b border-border-light">
                <div className="flex-shrink-0 mt-1">
                  {formData.liability_waiver_agreed ? (
                    <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-error-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <dt className="font-medium text-text-primary">Liability Waiver</dt>
                  <dd className="text-body-sm text-text-secondary mt-1">
                    {formData.liability_waiver_agreed
                      ? 'You have agreed to the liability waiver terms.'
                      : 'Liability waiver not agreed.'}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3 py-2">
                <div className="flex-shrink-0 mt-1">
                  {formData.disclaimer_agreed ? (
                    <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-error-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <dt className="font-medium text-text-primary">Disclaimer</dt>
                  <dd className="text-body-sm text-text-secondary mt-1">
                    {formData.disclaimer_agreed
                      ? 'You have acknowledged the disclaimer terms.'
                      : 'Disclaimer not acknowledged.'}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </dl>
      </Card>

      {/* Next Steps */}
      <div className="bg-neutral-50 rounded-lg p-6 no-print">
        <h3 className="text-heading-md font-semibold text-text-primary mb-3">
          What Happens Next?
        </h3>
        <ol className="space-y-3 text-body-md text-text-secondary">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-caption-sm font-semibold">
              1
            </span>
            <span>We&apos;ll contact you within 24-48 hours to confirm your pickup time and location.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-caption-sm font-semibold">
              2
            </span>
            <span>On voting day, your driver will pick you up at the scheduled time.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-caption-sm font-semibold">
              3
            </span>
            <span>After you vote, your driver will bring you back home safely.</span>
          </li>
        </ol>
      </div>

      {/* Contact Info */}
      <div className="text-center no-print">
        <p className="text-body-md text-text-secondary mb-4">
          Have questions? Contact us at{' '}
          <a href="mailto:support@pike2thepolls.com" className="text-primary-600 underline hover:text-primary-700">
            support@pike2thepolls.com
          </a>
          {' '}or{' '}
          <a href="tel:3179781131" className="text-primary-600 underline hover:text-primary-700">
            (317) 978-1131
          </a>
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Back to Home
          </Button>
          <Button onClick={() => (window.location.href = '/faq')}>
            View FAQ
          </Button>
        </div>
      </div>
    </div>
  );
}
