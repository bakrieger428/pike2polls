'use client';

import { Card, Button, Alert } from '@/components/ui';

export interface VolunteerRoleStepProps {
  values: {
    is_driver: boolean;
    is_logistical_support: boolean;
  };
  onChange: (values: {
    is_driver: boolean;
    is_logistical_support: boolean;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Step 2: Volunteer Roles
 * User selects which volunteer roles they're interested in (can select multiple)
 */
export function VolunteerRoleStep({
  values,
  onChange,
  onNext,
  onBack,
}: VolunteerRoleStepProps) {
  const { is_driver, is_logistical_support } = values;
  const hasSelection = is_driver || is_logistical_support;

  const handleRoleToggle = (role: 'driver' | 'logistical') => {
    if (role === 'driver') {
      onChange({
        is_driver: !is_driver,
        is_logistical_support,
      });
    } else {
      onChange({
        is_driver,
        is_logistical_support: !is_logistical_support,
      });
    }
  };

  return (
    <div className="space-y-6" role="group" aria-labelledby="role-heading">
      <div>
        <h2 id="role-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          How would you like to help?
        </h2>
        <p className="text-body-md text-text-secondary">
          Select one or both volunteer roles. You can make a difference in multiple ways!
        </p>
      </div>

      <Alert variant="info">
        <p className="text-body-sm">
          <strong>Thank you for volunteering!</strong> Your support helps ensure Pike Township residents can exercise their right to vote.
        </p>
      </Alert>

      <fieldset className="space-y-4">
        <legend className="sr-only">Volunteer role options</legend>

        <Card
          className={`cursor-pointer transition-all ${
            is_driver
              ? 'ring-2 ring-primary-600 bg-primary-50'
              : 'hover:bg-surface-hover bg-surface'
          }`}
          onClick={() => handleRoleToggle('driver')}
          aria-hidden="true"
        >
          <label className="flex items-start gap-4 cursor-pointer p-4">
            <input
              type="checkbox"
              name="volunteer_role"
              value="driver"
              checked={is_driver}
              onChange={() => handleRoleToggle('driver')}
              className="w-5 h-5 mt-1 flex-shrink-0"
              aria-describedby="driver-role-desc"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-heading-md font-medium">Driver</span>
                {is_driver && (
                  <span className="badge badge-primary text-caption-sm">Selected</span>
                )}
              </div>
              <p id="driver-role-desc" className="text-body-sm text-text-secondary">
                Provide transportation to polling places for Pike Township residents. Must have a valid driver&apos;s license and reliable vehicle.
              </p>
            </div>
          </label>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            is_logistical_support
              ? 'ring-2 ring-primary-600 bg-primary-50'
              : 'hover:bg-surface-hover bg-surface'
          }`}
          onClick={() => handleRoleToggle('logistical')}
          aria-hidden="true"
        >
          <label className="flex items-start gap-4 cursor-pointer p-4">
            <input
              type="checkbox"
              name="volunteer_role"
              value="logistical"
              checked={is_logistical_support}
              onChange={() => handleRoleToggle('logistical')}
              className="w-5 h-5 mt-1 flex-shrink-0"
              aria-describedby="logistical-role-desc"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-heading-md font-medium">Logistical Support</span>
                {is_logistical_support && (
                  <span className="badge badge-primary text-caption-sm">Selected</span>
                )}
              </div>
              <p id="logistical-role-desc" className="text-body-sm text-text-secondary">
                Help with coordination, check-in, phone calls, and other essential tasks that keep the campaign running smoothly.
              </p>
            </div>
          </label>
        </Card>

        {!hasSelection && (
          <p role="alert" aria-live="polite" className="text-body-sm text-error-600 mt-2">
            Please select at least one role to continue
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
