'use client';

import { useState, useCallback } from 'react';
import { ResidentCheckStep } from './ResidentCheckStep';
import { NameStep } from './NameStep';
import { VoterRegistrationStep } from './VoterRegistrationStep';
import { VotingDateStep } from './VotingDateStep';
import { PreferredTimeStep } from './PreferredTimeStep';
import { ContactInfoStep } from './ContactInfoStep';
import { WaiverStep } from './WaiverStep';
import { ConfirmationStep } from './ConfirmationStep';
import { supabase, TABLES, type SignupInsert, handleSupabaseError } from '@/lib/supabase';
import { Alert } from '@/components/ui';

type FormStep = 'resident' | 'name' | 'voter' | 'voting-date' | 'time' | 'contact' | 'waiver' | 'confirmation' | 'ineligible';

export interface MultiStepFormProps {
  onComplete?: () => void;
}

export function MultiStepForm({ onComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>('resident');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Form data state
  const [formData, setFormData] = useState({
    is_pike_resident: null as boolean | null,
    first_name: '',
    last_name: '',
    is_registered_voter: null as boolean | null,
    voting_date: null as 'early-voting-date-1' | 'early-voting-date-2' | 'election-day' | null,
    preferred_time: null as '8:00 AM' | '9:00 AM' | '11:00 AM' | '12:00 PM' | '1:00 PM' | '2:00 PM' | '3:00 PM' | '4:00 PM' | '5:00 PM' | '6:00 PM' | null,
    email: '',
    phone: '',
    address: '',  // Now required
    notes: '',
    liability_waiver: false,
    disclaimer: false,
  });

  // Step order for progress calculation
  const steps: FormStep[] = ['resident', 'name', 'voter', 'voting-date', 'time', 'contact', 'waiver', 'confirmation'];
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
      const steps: FormStep[] = ['resident', 'name', 'voter', 'voting-date', 'time', 'contact', 'waiver', 'confirmation'];
      goToStep(steps[prevIndex]);
    }
  }, [currentStepIndex, goToStep]);

  // Submit to Supabase
  const submitToSupabase = useCallback(async (waiverData?: { liability_waiver: boolean; disclaimer: boolean }) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Use provided waiver data or fall back to formData
      const liabilityWaiver = waiverData?.liability_waiver ?? formData.liability_waiver;
      const disclaimer = waiverData?.disclaimer ?? formData.disclaimer;

      // Validate all required fields are present
      if (
        !formData.is_pike_resident ||
        !formData.is_registered_voter ||
        !formData.voting_date ||
        !formData.preferred_time ||
        !formData.address ||
        !liabilityWaiver ||
        !disclaimer
      ) {
        throw new Error('Missing required fields');
      }

      const insertData: SignupInsert = {
        is_pike_resident: formData.is_pike_resident,
        first_name: formData.first_name,
        last_name: formData.last_name,
        is_registered_voter: formData.is_registered_voter,
        voting_date: formData.voting_date,
        preferred_time: formData.preferred_time,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        notes: formData.notes || undefined,
        liability_waiver_agreed: liabilityWaiver,
        disclaimer_agreed: disclaimer,
        status: 'pending',
      };

      const { error: insertError } = await supabase
        .from(TABLES.SIGNUPS)
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      goToStep('confirmation');
      onComplete?.();
    } catch (err) {
      const appError = handleSupabaseError(err);
      setError(appError.message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, goToStep, onComplete]);

  // Step handlers
  const handleResidentCheck = (isResident: boolean) => {
    setFormData({ ...formData, is_pike_resident: isResident });
    if (isResident) {
      goToStep('name');
    } else {
      goToStep('ineligible');
    }
  };

  const handleNameNext = (data: { first_name: string; last_name: string }) => {
    setFormData({ ...formData, ...data });
    goToStep('voter');
  };

  const handleVoterCheck = (isRegistered: boolean) => {
    setFormData({ ...formData, is_registered_voter: isRegistered });
    if (isRegistered) {
      goToStep('voting-date');
    }
    // If not registered, stay on this step (component shows registration info)
  };

  const handleVotingDateNext = () => {
    goToStep('time');
  };

  const handleTimeNext = () => {
    goToStep('contact');
  };

  const handleContactNext = (data: {
    email: string;
    phone: string;
    address?: string;
    notes?: string;
  }) => {
    setFormData({ ...formData, ...data });
    goToStep('waiver');
  };

  const handleWaiverNext = (data: {
    liability_waiver: boolean;
    disclaimer: boolean;
  }) => {
    // Update form data first
    setFormData({ ...formData, ...data });
    // Pass the data directly to avoid state synchronization issues
    submitToSupabase(data);
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'resident':
        return (
          <ResidentCheckStep
            value={formData.is_pike_resident}
            onChange={handleResidentCheck}
            onNext={() => {}}
          />
        );

      case 'name':
        return (
          <NameStep
            initialValues={{ first_name: formData.first_name, last_name: formData.last_name }}
            onNext={handleNameNext}
            onBack={goBack}
          />
        );

      case 'voter':
        return (
          <VoterRegistrationStep
            value={formData.is_registered_voter}
            onChange={handleVoterCheck}
            onNext={() => {}}
            onBack={goBack}
          />
        );

      case 'voting-date':
        return (
          <VotingDateStep
            value={formData.voting_date}
            onChange={(value) => setFormData({ ...formData, voting_date: value })}
            onNext={handleVotingDateNext}
            onBack={goBack}
          />
        );

      case 'time':
        return (
          <PreferredTimeStep
            value={formData.preferred_time}
            onChange={(value) => setFormData({ ...formData, preferred_time: value })}
            onNext={handleTimeNext}
            onBack={goBack}
            votingDate={formData.voting_date}
          />
        );

      case 'contact':
        return (
          <ContactInfoStep
            initialValues={{
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              notes: formData.notes,
            }}
            onNext={handleContactNext}
            onBack={goBack}
            isLoading={isLoading}
          />
        );

      case 'waiver':
        return (
          <WaiverStep
            initialValues={{
              liability_waiver: formData.liability_waiver,
              disclaimer: formData.disclaimer,
            }}
            onNext={handleWaiverNext}
            onBack={goBack}
          />
        );

      case 'confirmation':
        // At confirmation step, all required fields should be non-null
        return (
          <ConfirmationStep
            formData={{
              first_name: formData.first_name,
              last_name: formData.last_name,
              is_pike_resident: formData.is_pike_resident!,
              is_registered_voter: formData.is_registered_voter!,
              voting_date: formData.voting_date!,
              preferred_time: formData.preferred_time!,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,  // Now required
              notes: formData.notes || undefined,
              liability_waiver_agreed: formData.liability_waiver,
              disclaimer_agreed: formData.disclaimer,
            }}
            onRestart={() => window.location.reload()}
            error={error}
            isLoading={isLoading}
          />
        );

      case 'ineligible':
        return (
          <div className="space-y-6" role="alert" aria-live="assertive">
            <Alert variant="error">
              <p className="font-semibold text-lg mb-2">Not Eligible for This Service</p>
              <p className="text-body-md mb-3">
                We&apos;re sorry, but the Pike2ThePolls ride service is only available to Pike Township residents.
              </p>
              <p className="text-body-sm text-text-tertiary">
                If you have questions or believe this is an error, please contact us.
              </p>
            </Alert>
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="text-heading-md font-semibold text-text-primary mb-3">
                Other Resources
              </h3>
              <ul className="space-y-2 text-body-md text-text-secondary">
                <li>
                  <a href="https://indianavoters.in.gov" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-primary-700">
                    Indiana Voters Portal
                  </a>
                  {' '} - Find your polling place and registration info
                </li>
                <li>
                  <a href="mailto:trustee@pike2thepolls.com" className="text-primary-600 underline hover:text-primary-700">
                    Contact us
                  </a>
                  {' '} - We can help direct you to your township&apos;s resources
                </li>
              </ul>
            </div>
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="btn btn-outline"
              >
                Back to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Don't show progress bar for ineligible or confirmation steps
  const showProgress = currentStep !== 'ineligible' && currentStep !== 'confirmation';

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
          <div className="w-full bg-neutral-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Form progress">
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
