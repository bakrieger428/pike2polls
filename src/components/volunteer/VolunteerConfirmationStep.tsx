'use client';

import { Button, Alert, Card } from '@/components/ui';
import type { VolunteerFormData } from '@/lib/volunteer-validation';
import { formatVolunteerDays } from '@/lib/volunteer-validation';

export interface VolunteerConfirmationStepProps {
  formData: VolunteerFormData;
  onSubmit: () => void;
  error?: string;
  isLoading?: boolean;
}

/**
 * Step 5: Confirmation
 * Displays summary of all volunteer information and submits to database
 */
export function VolunteerConfirmationStep({
  formData,
  onSubmit,
  error,
  isLoading = false,
}: VolunteerConfirmationStepProps) {
  const roleLabels = {
    is_driver: 'Driver',
    is_logistical_support: 'Logistical Support',
  };

  const selectedRoles = Object.entries({
    is_driver: formData.is_driver,
    is_logistical_support: formData.is_logistical_support,
  })
    .filter(([_, isSelected]) => isSelected)
    .map(([key]) => roleLabels[key as keyof typeof roleLabels]);

  const selectedDays = formatVolunteerDays({
    may_2: formData.may_2,
    may_3: formData.may_3,
    may_5: formData.may_5,
    all_days: formData.all_days,
  });

  return (
    <div className="space-y-6" role="group" aria-labelledby="confirmation-heading">
      <div>
        <h2 id="confirmation-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          Review Your Volunteer Information
        </h2>
        <p className="text-body-md text-text-secondary">
          Please review your information below before submitting.
        </p>
      </div>

      {error && (
        <Alert variant="error" role="alert" aria-live="assertive">
          <p className="font-semibold mb-1">Submission Error</p>
          <p className="text-body-sm">{error}</p>
        </Alert>
      )}

      <Card className="bg-surface p-6 space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-heading-md font-semibold text-text-primary mb-3 pb-2 border-b border-neutral-200">
            Contact Information
          </h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="text-body-sm font-medium text-text-tertiary">Name:</dt>
              <dd className="text-body-md text-text-secondary">
                {formData.first_name} {formData.last_name}
              </dd>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="text-body-sm font-medium text-text-tertiary">Email:</dt>
              <dd className="text-body-md text-text-secondary">{formData.email}</dd>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="text-body-sm font-medium text-text-tertiary">Phone:</dt>
              <dd className="text-body-md text-text-secondary">{formData.phone}</dd>
            </div>
          </dl>
        </div>

        {/* Volunteer Roles */}
        <div>
          <h3 className="text-heading-md font-semibold text-text-primary mb-3 pb-2 border-b border-neutral-200">
            Volunteer Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map((role) => (
              <span
                key={role}
                className="badge badge-primary text-body-sm"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-heading-md font-semibold text-text-primary mb-3 pb-2 border-b border-neutral-200">
            Availability
          </h3>
          <dl className="space-y-2">
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="text-body-sm font-medium text-text-tertiary">Days:</dt>
              <dd className="text-body-md text-text-secondary">{selectedDays}</dd>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <dt className="text-body-sm font-medium text-text-tertiary">Time Slots:</dt>
              <dd className="text-body-md text-text-secondary">
                <ul className="space-y-1">
                  {formData.time_slots.map((slot) => (
                    <li key={slot} className="flex items-center gap-2">
                      <span className="text-primary-600">•</span>
                      <span>{slot}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        {/* Notes (if provided) */}
        {formData.notes && (
          <div>
            <h3 className="text-heading-md font-semibold text-text-primary mb-3 pb-2 border-b border-neutral-200">
              Additional Notes
            </h3>
            <p className="text-body-md text-text-secondary italic">{formData.notes}</p>
          </div>
        )}
      </Card>

      <Alert variant="info">
        <p className="text-body-sm">
          <strong>Next Steps:</strong> After you submit, we&apos;ll review your information and contact you within 1-2 business days to discuss volunteer opportunities and provide further details.
        </p>
      </Alert>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
          disabled={isLoading}
        >
          Start Over
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          {isLoading ? 'Submitting...' : 'Submit Volunteer Application'}
        </Button>
      </div>
    </div>
  );
}
