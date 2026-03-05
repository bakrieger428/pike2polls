'use client';

import { Alert, Button } from '@/components/ui';

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
        <div className="flex justify-end">
          <Button onClick={onNext} size="lg">
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
