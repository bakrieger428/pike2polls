'use client';

import { useState } from 'react';
import { Alert, Button } from '@/components/ui';
import { Turnstile } from '@marsidev/react-turnstile';

export interface ResidentCheckStepProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  onNext: () => void;
}

/**
 * Step 1: Resident Check
 * Confirms the user is a Pike Township resident
 */
export function ResidentCheckStep({ value, onChange, onNext }: ResidentCheckStepProps) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!turnstileToken) {
      setTurnstileError('Please complete the security verification');
      return;
    }
    setTurnstileError(null);
    onNext();
  };

  return (
    <div className="space-y-6" role="group" aria-labelledby="resident-check-heading">
      <h2 id="resident-check-heading" className="text-heading-xl font-semibold text-text-primary">
        Are you a resident of Pike Township, Indiana?
      </h2>

      <p className="text-body-md text-text-secondary">
        This service is available only to Pike Township residents in Marion County, Indiana.
      </p>

      <fieldset className="space-y-4">
        <legend className="sr-only">Residency status</legend>

        <label
          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            value === true
              ? 'border-primary-600 bg-primary-50'
              : 'border-border-dark bg-surface hover:border-neutral-300'
          }`}
        >
          <input
            type="radio"
            name="is_pike_resident"
            value="yes"
            checked={value === true}
            onChange={() => onChange(true)}
            className="w-5 h-5"
            aria-describedby="yes-desc"
          />
          <div>
            <span className="block text-heading-md font-medium text-text-primary">Yes</span>
            <span id="yes-desc" className="text-body-sm text-text-secondary">
              I live in Pike Township, Indiana
            </span>
          </div>
        </label>

        <label
          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            value === false
              ? 'border-error-600 bg-error-50'
              : 'border-border-dark bg-surface hover:border-neutral-300'
          }`}
        >
          <input
            type="radio"
            name="is_pike_resident"
            value="no"
            checked={value === false}
            onChange={() => onChange(false)}
            className="w-5 h-5"
            aria-describedby="no-desc"
          />
          <div>
            <span className="block text-heading-md font-medium text-text-primary">No</span>
            <span id="no-desc" className="text-body-sm text-text-secondary">
              I live in a different township
            </span>
          </div>
        </label>
      </fieldset>

      {value === false && (
        <Alert variant="error" role="alert">
          <p className="font-semibold mb-2">We&apos;re sorry, but this service is only available to Pike Township residents.</p>
          <p className="text-body-sm">
            If you believe you&apos;ve received this message in error, or need assistance finding your township&apos;s resources,
            please contact us at{' '}
            <a href="mailto:trustee@pike2thepolls.com" className="underline font-medium">
              trustee@pike2thepolls.com
            </a>
            {' '}or call{' '}
            <a href="tel:3179781131" className="underline font-medium">
              (317) 978-1131
            </a>
            .
          </p>
        </Alert>
      )}

      {value === true && (
        <>
          {/* Cloudflare Turnstile Bot Protection */}
          <div className="space-y-2">
            <p className="text-body-sm text-text-secondary">
              Please complete the security verification below to continue.
            </p>

            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
              <div className="min-h-[65px]">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => {
                    setTurnstileToken(token);
                    setTurnstileError(null);
                  }}
                  onError={() => {
                    setTurnstileError('Security verification failed. Please try again.');
                    setTurnstileToken(null);
                  }}
                  onExpire={() => {
                    setTurnstileToken(null);
                    setTurnstileError('Security verification expired. Please try again.');
                  }}
                  options={{
                    theme: 'light',
                    size: 'normal',
                  }}
                />
              </div>
            ) : (
              <Alert variant="error" role="alert">
                <p className="text-body-sm">
                  <strong>Security Configuration Missing:</strong> The Turnstile site key is not configured.
                  Please add <code>NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> to your environment variables.
                  <br /><br />
                  Get your free site key at{' '}
                  <a
                    href="https://dash.cloudflare.com/sign-up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Cloudflare Dashboard
                  </a>
                </p>
              </Alert>
            )}

            {turnstileError && (
              <p className="text-body-sm text-error-600" role="alert">
                {turnstileError}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleContinue}
              size="lg"
              disabled={!turnstileToken}
            >
              Continue
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
