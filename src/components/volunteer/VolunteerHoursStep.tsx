'use client';

import { Card, Button } from '@/components/ui';
import { TIME_SLOTS, type TimeSlot } from '@/lib/volunteer-validation';

export interface VolunteerHoursStepProps {
  values: TimeSlot[];
  onChange: (values: TimeSlot[]) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step 4: Available Hours
 * User selects which time slots they're available on their selected days
 */
export function VolunteerHoursStep({
  values,
  onChange,
  onNext,
  onBack,
}: VolunteerHoursStepProps) {
  const hasSelection = values.length > 0;

  const handleTimeSlotToggle = (slot: TimeSlot) => {
    if (values.includes(slot)) {
      onChange(values.filter((s) => s !== slot));
    } else {
      onChange([...values, slot]);
    }
  };

  const handleSelectAll = () => {
    if (values.length === TIME_SLOTS.length) {
      // All selected - deselect all
      onChange([]);
    } else {
      // Select all
      onChange([...TIME_SLOTS]);
    }
  };

  const isAllSelected = values.length === TIME_SLOTS.length;

  return (
    <div className="space-y-6" role="group" aria-labelledby="hours-heading">
      <div>
        <h2 id="hours-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          What times are you available?
        </h2>
        <p className="text-body-md text-text-secondary">
          Select all time slots you&apos;re available. You may choose more than one.
        </p>
      </div>

      <div className="bg-neutral-50 rounded-lg p-4">
        <p className="text-body-sm text-text-secondary mb-2">
          <strong>Time Schedule:</strong>
        </p>
        <ul className="text-body-sm text-text-secondary space-y-1">
          <li>• Early Voting (May 2-3): 11:00 AM - 6:00 PM</li>
          <li>• Election Day (May 5): 8:00 AM - 6:00 PM</li>
        </ul>
        <p className="text-body-sm text-text-secondary mt-2">
          Time slots are 4-hour blocks. Select all blocks you&apos;re available.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">Available time slots</legend>

        {TIME_SLOTS.map((slot) => {
          const isSelected = values.includes(slot);
          // Add period labels
          const getPeriodLabel = (timeSlot: string) => {
            if (timeSlot.startsWith('8:00 AM')) return '(Morning)';
            if (timeSlot.startsWith('12:00 PM')) return '(Afternoon)';
            if (timeSlot.startsWith('4:00 PM')) return '(Evening)';
            return '';
          };
          return (
            <Card
              key={slot}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 ring-primary-600 bg-primary-50'
                  : 'hover:bg-surface-hover bg-surface'
              }`}
              onClick={() => handleTimeSlotToggle(slot)}
              aria-hidden="true"
            >
              <label className="flex items-start gap-4 cursor-pointer p-4">
                <input
                  type="checkbox"
                  name="time_slot"
                  value={slot}
                  checked={isSelected}
                  onChange={() => handleTimeSlotToggle(slot)}
                  className="w-5 h-5 mt-1 flex-shrink-0"
                  aria-label={`${slot} ${getPeriodLabel(slot)}`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-heading-md font-medium">{slot}</span>
                    <span className="text-body-sm text-text-tertiary">{getPeriodLabel(slot)}</span>
                    {isSelected && (
                      <span className="badge badge-primary text-caption-sm">Selected</span>
                    )}
                  </div>
                </div>
              </label>
            </Card>
          );
        })}

        <Card
          className={`cursor-pointer transition-all border-2 border-dashed ${
            isAllSelected
              ? 'ring-2 ring-primary-600 bg-primary-50 border-primary-600'
              : 'hover:bg-surface-hover bg-surface border-neutral-300'
          }`}
          onClick={handleSelectAll}
          aria-hidden="true"
        >
          <label className="flex items-center justify-center gap-3 cursor-pointer p-4">
            <input
              type="checkbox"
              name="select_all_hours"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="w-5 h-5 flex-shrink-0"
            />
            <span className="text-heading-md font-medium">
              {isAllSelected ? 'Deselect All' : 'Select All Time Slots'}
            </span>
          </label>
        </Card>

        {!hasSelection && (
          <p role="alert" aria-live="polite" className="text-body-sm text-error-600 mt-2">
            Please select at least one time slot to continue
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
