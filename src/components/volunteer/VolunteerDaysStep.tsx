'use client';

import { Card, Button, Alert } from '@/components/ui';

export interface VolunteerDaysStepProps {
  values: {
    may_2: boolean;
    may_3: boolean;
    may_5: boolean;
    all_days: boolean;
  };
  onChange: (values: {
    may_2: boolean;
    may_3: boolean;
    may_5: boolean;
    all_days: boolean;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step 3: Availability Days
 * User selects which days they're available to volunteer
 */
export function VolunteerDaysStep({
  values,
  onChange,
  onNext,
  onBack,
}: VolunteerDaysStepProps) {
  const { may_2, may_3, may_5, all_days } = values;
  const hasSelection = may_2 || may_3 || may_5 || all_days;

  const handleDayToggle = (day: 'may_2' | 'may_3' | 'may_5') => {
    // If selecting a specific day and "All Days" was checked, uncheck it
    const newAllDays = day === 'may_2' || day === 'may_3' || day === 'may_5'
      ? false
      : all_days;

    onChange({
      may_2: day === 'may_2' ? !may_2 : may_2,
      may_3: day === 'may_3' ? !may_3 : may_3,
      may_5: day === 'may_5' ? !may_5 : may_5,
      all_days: newAllDays,
    });
  };

  const handleAllDaysToggle = () => {
    if (!all_days) {
      // Checking "All Days" - select all individual days
      onChange({
        may_2: true,
        may_3: true,
        may_5: true,
        all_days: true,
      });
    } else {
      // Unchecking "All Days" - clear all selections
      onChange({
        may_2: false,
        may_3: false,
        may_5: false,
        all_days: false,
      });
    }
  };

  const dayOptions = [
    {
      key: 'may_2' as const,
      label: 'May 2, 2026',
      description: 'Early Voting - 11:00 AM - 6:00 PM',
    },
    {
      key: 'may_3' as const,
      label: 'May 3, 2026',
      description: 'Early Voting - 11:00 AM - 6:00 PM',
    },
    {
      key: 'may_5' as const,
      label: 'May 5, 2026',
      description: 'Election Day - 8:00 AM - 6:00 PM',
    },
  ];

  return (
    <div className="space-y-6" role="group" aria-labelledby="days-heading">
      <div>
        <h2 id="days-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          When are you available?
        </h2>
        <p className="text-body-md text-text-secondary">
          Select the days you can volunteer. You can choose one day, multiple days, or all days.
        </p>
      </div>

      <Alert variant="info">
        <p className="text-body-sm">
          <strong>Early Voting:</strong> May 2 & 3 at Pike Township Public Library (11 AM - 6 PM){' '}
          <br />
          <strong>Election Day:</strong> May 5 at polling locations (8 AM - 6 PM)
        </p>
      </Alert>

      <fieldset className="space-y-3">
        <legend className="sr-only">Availability day options</legend>

        {dayOptions.map((option) => {
          const isSelected = values[option.key];
          return (
            <Card
              key={option.key}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 ring-primary-600 bg-primary-50'
                  : 'hover:bg-surface-hover bg-surface'
              }`}
              onClick={() => handleDayToggle(option.key)}
              aria-hidden="true"
            >
              <label className="flex items-start gap-4 cursor-pointer p-4">
                <input
                  type="checkbox"
                  name="volunteer_day"
                  value={option.key}
                  checked={isSelected}
                  onChange={() => handleDayToggle(option.key)}
                  className="w-5 h-5 mt-1 flex-shrink-0"
                  aria-describedby={`${option.key}-desc`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-heading-md font-medium">{option.label}</span>
                    {isSelected && (
                      <span className="badge badge-primary text-caption-sm">Selected</span>
                    )}
                  </div>
                  <p id={`${option.key}-desc`} className="text-body-sm text-text-secondary">
                    {option.description}
                  </p>
                </div>
              </label>
            </Card>
          );
        })}

        <Card
          className={`cursor-pointer transition-all ${
            all_days
              ? 'ring-2 ring-primary-600 bg-primary-50'
              : 'hover:bg-surface-hover bg-surface'
          }`}
          onClick={handleAllDaysToggle}
          aria-hidden="true"
        >
          <label className="flex items-start gap-4 cursor-pointer p-4">
            <input
              type="checkbox"
              name="volunteer_day"
              value="all_days"
              checked={all_days}
              onChange={handleAllDaysToggle}
              className="w-5 h-5 mt-1 flex-shrink-0"
              aria-describedby="all-days-desc"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-heading-md font-medium">All Days</span>
                {all_days && (
                  <span className="badge badge-primary text-caption-sm">Selected</span>
                )}
              </div>
              <p id="all-days-desc" className="text-body-sm text-text-secondary">
                Available for May 2, May 3, and May 5
              </p>
            </div>
          </label>
        </Card>

        {!hasSelection && (
          <p role="alert" aria-live="polite" className="text-body-sm text-error-600 mt-2">
            Please select at least one day to continue
          </p>
        )}
      </fieldset>

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext} disabled={!hasSelection} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
