'use client';

import { Alert, Button } from '@/components/ui';

export interface VoterRegistrationStepProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step 3: Voter Registration
 * Confirms the user is registered to vote
 */
export function VoterRegistrationStep({ value, onChange, onNext, onBack }: VoterRegistrationStepProps) {
  return (
    <div className="space-y-6" role="group" aria-labelledby="voter-registration-heading">
      <h2 id="voter-registration-heading" className="text-heading-xl font-semibold text-text-primary">
        Are you registered to vote in Indiana?
      </h2>

      <p className="text-body-md text-text-secondary">
        You must be registered to vote to use this service. Not registered yet? No problem!
      </p>

      <fieldset className="space-y-4">
        <legend className="sr-only">Voter registration status</legend>

        <label
          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            value === true
              ? 'border-primary-600 bg-primary-50'
              : 'border-border-dark bg-surface hover:border-neutral-300'
          }`}
        >
          <input
            type="radio"
            name="is_registered_voter"
            value="yes"
            checked={value === true}
            onChange={() => onChange(true)}
            className="w-5 h-5"
            aria-describedby="registered-yes-desc"
          />
          <div>
            <span className="block text-heading-md font-medium text-text-primary">Yes</span>
            <span id="registered-yes-desc" className="text-body-sm text-text-secondary">
              I&apos;m registered to vote in Indiana
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
            name="is_registered_voter"
            value="no"
            checked={value === false}
            onChange={() => onChange(false)}
            className="w-5 h-5"
            aria-describedby="registered-no-desc"
          />
          <div>
            <span className="block text-heading-md font-medium text-text-primary">No</span>
            <span id="registered-no-desc" className="text-body-sm text-text-secondary">
              I need to register or update my registration
            </span>
          </div>
        </label>
      </fieldset>

      {value === false && (
        <Alert variant="warning" role="alert">
          <p className="font-semibold mb-2">You need to be registered to vote to use this service.</p>
          <p className="text-body-sm mb-3">
            Registering is easy and can be done online. You can also register at your polling place on election day.
          </p>
          <div className="space-y-2">
            <a
              href="https://indianavoters.in.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block btn btn-primary text-body-md"
            >
              Register Online at IndianaVoters.in.gov
            </a>
            <p className="text-body-sm text-text-tertiary">
              Once you&apos;re registered, come back and sign up for your ride!
            </p>
          </div>
        </Alert>
      )}

      {value === true && (
        <div className="flex justify-between gap-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={onNext} size="lg">
            Continue
          </Button>
        </div>
      )}

      {value === false && (
        <div className="flex justify-start">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
