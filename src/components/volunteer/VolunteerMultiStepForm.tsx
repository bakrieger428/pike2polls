'use client';

import { useState, useCallback } from 'react';
import { VolunteerNameStep } from './VolunteerNameStep';
import { VolunteerRoleStep } from './VolunteerRoleStep';
import { VolunteerDaysStep } from './VolunteerDaysStep';
import { VolunteerHoursStep } from './VolunteerHoursStep';
import { VolunteerConfirmationStep } from './VolunteerConfirmationStep';
import { supabase, type VolunteerInsert, handleSupabaseError } from '@/lib/supabase';
import { Alert } from '@/components/ui';
import type { TimeSlot } from '@/lib/volunteer-validation';

type FormStep = 'contact' | 'roles' | 'days' | 'hours' | 'confirmation' | 'success';

export interface VolunteerMultiStepFormProps {
  onComplete?: () => void;
}

export function VolunteerMultiStepForm({ onComplete }: VolunteerMultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('contact');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Form data state
  const [formData, setFormData] = useState({
    // Contact info
    first_name: '',
    last_name: '',
    email: '',
    phone: '',

    // Roles
    is_driver: false,
    is_logistical_support: false,

    // Days
    may_2: false,
    may_3: false,
    may_5: false,
    all_days: false,

    // Hours
    time_slots: [] as TimeSlot[],

    // Notes
    notes: '',
  });

  // Step order for progress calculation
  const steps: FormStep[] = ['contact', 'roles', 'days', 'hours', 'confirmation'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  // Navigation handlers
  const goToStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
    setError(undefined);
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      const steps: FormStep[] = ['contact', 'roles', 'days', 'hours', 'confirmation'];
      goToStep(steps[prevIndex]);
    }
  }, [currentStepIndex, goToStep]);

  // Submit to Supabase
  const submitToSupabase = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Validate all required fields are present
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.email ||
        !formData.phone ||
        (!formData.is_driver && !formData.is_logistical_support) ||
        (!formData.may_2 && !formData.may_3 && !formData.may_5 && !formData.all_days) ||
        formData.time_slots.length === 0
      ) {
        throw new Error('Missing required fields');
      }

      const insertData: VolunteerInsert = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        is_driver: formData.is_driver,
        is_logistical_support: formData.is_logistical_support,
        may_2: formData.may_2,
        may_3: formData.may_3,
        may_5: formData.may_5,
        all_days: formData.all_days,
        time_slots: formData.time_slots,
        notes: formData.notes || undefined,
        status: 'pending',
      };

      const { error: insertError } = await supabase
        .from('volunteers')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      goToStep('success');
      onComplete?.();
    } catch (err) {
      const appError = handleSupabaseError(err);
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, goToStep, onComplete]);

  // Step handlers
  const handleContactNext = (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }) => {
    setFormData({ ...formData, ...data });
    goToStep('roles');
  };

  const handleRolesNext = (data: {
    is_driver: boolean;
    is_logistical_support: boolean;
  }) => {
    setFormData({ ...formData, ...data });
    goToStep('days');
  };

  const handleDaysNext = (data: {
    may_2: boolean;
    may_3: boolean;
    may_5: boolean;
    all_days: boolean;
  }) => {
    setFormData({ ...formData, ...data });
    goToStep('hours');
  };

  const handleHoursNext = (timeSlots: TimeSlot[]) => {
    setFormData({ ...formData, time_slots: timeSlots });
    goToStep('confirmation');
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'contact':
        return (
          <VolunteerNameStep
            initialValues={{
              first_name: formData.first_name,
              last_name: formData.last_name,
              email: formData.email,
              phone: formData.phone,
            }}
            onNext={handleContactNext}
            onBack={() => (window.location.href = '/')}
          />
        );

      case 'roles':
        return (
          <VolunteerRoleStep
            values={{
              is_driver: formData.is_driver,
              is_logistical_support: formData.is_logistical_support,
            }}
            onChange={(data) => setFormData({ ...formData, ...data })}
            onNext={() => handleRolesNext({
              is_driver: formData.is_driver,
              is_logistical_support: formData.is_logistical_support,
            })}
            onBack={goBack}
          />
        );

      case 'days':
        return (
          <VolunteerDaysStep
            values={{
              may_2: formData.may_2,
              may_3: formData.may_3,
              may_5: formData.may_5,
              all_days: formData.all_days,
            }}
            onChange={(data) => setFormData({ ...formData, ...data })}
            onNext={() => handleDaysNext({
              may_2: formData.may_2,
              may_3: formData.may_3,
              may_5: formData.may_5,
              all_days: formData.all_days,
            })}
            onBack={goBack}
          />
        );

      case 'hours':
        return (
          <VolunteerHoursStep
            values={formData.time_slots}
            onChange={(slots) => setFormData({ ...formData, time_slots: slots })}
            onNext={() => handleHoursNext(formData.time_slots)}
            onBack={goBack}
          />
        );

      case 'confirmation':
        return (
          <VolunteerConfirmationStep
            formData={{
              first_name: formData.first_name,
              last_name: formData.last_name,
              email: formData.email,
              phone: formData.phone,
              is_driver: formData.is_driver,
              is_logistical_support: formData.is_logistical_support,
              may_2: formData.may_2,
              may_3: formData.may_3,
              may_5: formData.may_5,
              all_days: formData.all_days,
              time_slots: formData.time_slots,
              notes: formData.notes || undefined,
            }}
            onSubmit={submitToSupabase}
            error={error}
            isLoading={isLoading}
          />
        );

      case 'success':
        return (
          <div className="space-y-6" role="status" aria-live="polite">
            <Alert variant="success">
              <div className="text-center">
                <div className="text-5xl mb-4" aria-hidden="true">🎉</div>
                <h2 className="text-heading-xl font-semibold text-text-primary mb-2">
                  Thank You for Volunteering!
                </h2>
                <p className="text-body-md text-text-secondary">
                  Your volunteer application has been submitted successfully.
                </p>
              </div>
            </Alert>

            <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
              <h3 className="text-heading-md font-semibold text-text-primary">
                What Happens Next?
              </h3>
              <ul className="space-y-3 text-body-md text-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 text-xl" aria-hidden="true">✓</span>
                  <span>We&apos;ll review your application within 1-2 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 text-xl" aria-hidden="true">✓</span>
                  <span>We&apos;ll contact you at <strong>{formData.email}</strong> or <strong>{formData.phone}</strong> to discuss opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 text-xl" aria-hidden="true">✓</span>
                  <span>We&apos;ll provide training and all the information you need to be successful</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
              <h3 className="text-heading-md font-semibold text-text-primary mb-2">
                Questions?
              </h3>
              <p className="text-body-md text-text-secondary">
                Feel free to contact us at{' '}
                <a
                  href="mailto:support@pike2thepolls.com"
                  className="text-primary-600 underline hover:text-primary-700 font-medium"
                >
                  support@pike2thepolls.com
                </a>
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="btn btn-primary"
              >
                Return to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Don't show progress bar for success step
  const showProgress = currentStep !== 'success';

  return (
    <div className="w-full">
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption-md font-medium text-text-tertiary">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-caption-md font-medium text-primary-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="w-full bg-neutral-200 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Volunteer form progress"
          >
            <div
              className="h-2 bg-primary-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="min-h-[300px]">
        {renderStep()}
      </div>
    </div>
  );
}
