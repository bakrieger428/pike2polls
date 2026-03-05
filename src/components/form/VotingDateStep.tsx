'use client';

import { Card, Button, Alert } from '@/components/ui';

export interface VotingDateStepProps {
  value: 'early-voting-date-1' | 'early-voting-date-2' | 'election-day' | null;
  onChange: (value: 'early-voting-date-1' | 'early-voting-date-2' | 'election-day') => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step 4: Voting Date
 * User selects early voting dates or election day
 */
export function VotingDateStep({ value, onChange, onNext, onBack }: VotingDateStepProps) {
  const votingDateOptions = [
    {
      value: 'early-voting-date-1' as const,
      label: 'Early Voting - May 2, 2026',
      description: '11:00 AM - 6:00 PM at Pike Township Public Library',
      recommended: false,
    },
    {
      value: 'early-voting-date-2' as const,
      label: 'Early Voting - May 3, 2026',
      description: '11:00 AM - 6:00 PM at Pike Township Public Library',
      recommended: false,
    },
    {
      value: 'election-day' as const,
      label: 'Election Day - May 5, 2026',
      description: '8:00 AM - 6:00 PM at your precinct polling place',
      recommended: true,
    },
  ] as const;

  return (
    <div className="space-y-6" role="group" aria-labelledby="voting-date-heading">
      <div>
        <h2 id="voting-date-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          When would you like to vote?
        </h2>
        <p className="text-body-md text-text-secondary">
          Select your preferred voting date. Rides are available for early voting on May 2nd and 3rd at Pike Township Public Library.
        </p>
      </div>

      <Alert variant="info">
        <p className="text-body-sm">
          <strong>Note:</strong> Dates are subject to change. We&apos;ll confirm your ride details closer to the election.
        </p>
      </Alert>

      <fieldset className="space-y-3">
        <legend className="sr-only">Voting date options</legend>

        {votingDateOptions.map((option) => (
          <Card
            key={option.value}
            className={`cursor-pointer transition-all ${
              value === option.value
                ? 'ring-2 ring-primary-600 bg-primary-50'
                : 'hover:bg-surface-hover bg-surface'
            }`}
            onClick={() => onChange(option.value)}
            aria-hidden="true"
          >
            <label className={`flex items-start gap-4 cursor-pointer ${value === option.value ? 'text-primary-700' : ''}`}>
              <input
                type="radio"
                name="voting_date"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="w-5 h-5 mt-1 flex-shrink-0"
                aria-describedby={`${option.value}-desc`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-heading-md font-medium">{option.label}</span>
                  {option.recommended && (
                    <span className="badge badge-primary text-caption-sm">Most Popular</span>
                  )}
                </div>
                <p id={`${option.value}-desc`} className="text-body-sm text-text-secondary">
                  {option.description}
                </p>
              </div>
            </label>
          </Card>
        ))}
      </fieldset>

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={!value} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
