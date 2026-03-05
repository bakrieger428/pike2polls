'use client';

import { Select, Button } from '@/components/ui';

export interface PreferredTimeStepProps {
  value: '8:00 AM' | '9:00 AM' | '11:00 AM' | '12:00 PM' | '1:00 PM' | '2:00 PM' | '3:00 PM' | '4:00 PM' | '5:00 PM' | '6:00 PM' | null;
  onChange: (value: '8:00 AM' | '9:00 AM' | '11:00 AM' | '12:00 PM' | '1:00 PM' | '2:00 PM' | '3:00 PM' | '4:00 PM' | '5:00 PM' | '6:00 PM') => void;
  onNext: () => void;
  onBack: () => void;
  votingDate: 'early-voting-date-1' | 'early-voting-date-2' | 'election-day' | null;
}

/**
 * Step 5: Preferred Time
 * User selects their preferred pickup time
 */
export function PreferredTimeStep({ value, onChange, onNext, onBack, votingDate }: PreferredTimeStepProps) {
  /**
   * Get available time options based on voting date
   * - Early voting: Times from 11:00 AM - 6:00 PM
   * - Election day: Times from 8:00 AM - 6:00 PM
   */
  const getAvailableTimes = (
    date: 'early-voting-date-1' | 'early-voting-date-2' | 'election-day' | null
  ): readonly ['8:00 AM', '9:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'] | ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'] => {
    if (date === 'election-day') {
      // Show all times for election day (8 AM - 6 PM)
      return ['8:00 AM', '9:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'] as const;
    } else {
      // Early voting: start at 11:00 AM
      return ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'] as const;
    }
  };

  const timeOptions = getAvailableTimes(votingDate);

  const timeOptionsList = timeOptions.map((time) => ({
    value: time,
    label: time,
  }));

  return (
    <div className="space-y-6" role="group" aria-labelledby="preferred-time-heading">
      <div>
        <h2 id="preferred-time-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          What time would you prefer to vote?
        </h2>
        <p className="text-body-md text-text-secondary">
          Select your preferred pickup time. We&apos;ll contact you to confirm the exact time.
        </p>
      </div>

      <Select
        id="preferred_time"
        label="Preferred Time"
        options={timeOptionsList}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as typeof timeOptions[number])}
        placeholder="Select a time..."
        required
        helperText="We'll schedule your ride based on this preference. Times may vary based on availability."
      />

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
