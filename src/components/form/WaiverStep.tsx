'use client';

import { Button, Alert } from '@/components/ui';
import { useState } from 'react';

export interface WaiverStepProps {
  initialValues?: {
    liability_waiver: boolean;
    disclaimer: boolean;
  };
  onNext: (data: {
    liability_waiver: boolean;
    disclaimer: boolean;
  }) => void;
  onBack: () => void;
}

/**
 * Step 7: Waiver Agreement
 * Collects required waiver and disclaimer agreements before submission
 */
export function WaiverStep({
  initialValues = { liability_waiver: false, disclaimer: false },
  onNext,
  onBack,
}: WaiverStepProps) {
  const [liabilityWaiver, setLiabilityWaiver] = useState(initialValues.liability_waiver);
  const [disclaimer, setDisclaimer] = useState(initialValues.disclaimer);
  const [errors, setErrors] = useState<{
    liability_waiver?: string;
    disclaimer?: string;
  }>({});
  const [showFullWaiver, setShowFullWaiver] = useState(false);
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  const validate = (): boolean => {
    const newErrors: { liability_waiver?: string; disclaimer?: string } = {};

    if (!liabilityWaiver) {
      newErrors.liability_waiver = 'You must agree to the liability waiver to proceed';
    }

    if (!disclaimer) {
      newErrors.disclaimer = 'You must acknowledge the disclaimer to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext({
        liability_waiver: liabilityWaiver,
        disclaimer: disclaimer,
      });
    }
  };

  const handleLiabilityChange = (checked: boolean) => {
    setLiabilityWaiver(checked);
    if (errors.liability_waiver) {
      setErrors({ ...errors, liability_waiver: undefined });
    }
  };

  const handleDisclaimerChange = (checked: boolean) => {
    setDisclaimer(checked);
    if (errors.disclaimer) {
      setErrors({ ...errors, disclaimer: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="group" aria-labelledby="waiver-heading">
      <div>
        <h2 id="waiver-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          Waiver and Disclaimer
        </h2>
        <p className="text-body-md text-text-secondary">
          Please review and accept the following terms to submit your ride request.
        </p>
      </div>

      {/* Liability Waiver Section */}
      <div className="space-y-4">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-heading-md font-semibold text-text-primary">
              Liability Waiver
            </h3>
            <button
              type="button"
              onClick={() => setShowFullWaiver(!showFullWaiver)}
              className="text-sm text-primary-600 hover:text-primary-700 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-expanded={showFullWaiver}
              aria-controls="liability-waiver-text"
            >
              {showFullWaiver ? 'Show Less' : 'Read Full Waiver'}
            </button>
          </div>

          <div
            id="liability-waiver-text"
            className={`text-body-md text-text-secondary ${showFullWaiver ? '' : 'line-clamp-3'}`}
            aria-hidden={!showFullWaiver}
          >
            <p className="mb-3">
              I hereby hold harmless any and all members, agents, and volunteers participating in the Pike2ThePolls
              Program from any and all legal claims, damages, or liabilities that may arise from my participation in
              this program, including but not limited to transportation to and from polling locations.
            </p>
            <p>
              I understand that I am voluntarily participating in this program and assume all risks associated with
              transportation.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="liability-waiver-checkbox"
            className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer min-h-[56px] ${
              errors.liability_waiver
                ? 'border-error-500 bg-error-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="relative flex items-start pt-1">
              <input
                id="liability-waiver-checkbox"
                type="checkbox"
                checked={liabilityWaiver}
                onChange={(e) => handleLiabilityChange(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
                aria-required="true"
                aria-describedby="liability-waiver-desc"
                aria-invalid={!!errors.liability_waiver}
              />
            </div>
            <div className="flex-1">
              <span id="liability-waiver-desc" className="text-body-md text-text-primary">
                By submitting this request for a ride, I have read and understand the liability waiver and agree to
                the terms of the Pike2ThePolls Program.
                <span className="text-error-600 font-medium" aria-label="required">
                  {' '}*
                </span>
              </span>
            </div>
          </label>

          {errors.liability_waiver && (
            <p
              className="text-body-sm text-error-600 ml-4 mt-1"
              role="alert"
              aria-live="assertive"
            >
              {errors.liability_waiver}
            </p>
          )}
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="space-y-4">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-heading-md font-semibold text-text-primary">
              Disclaimer
            </h3>
            <button
              type="button"
              onClick={() => setShowFullDisclaimer(!showFullDisclaimer)}
              className="text-sm text-primary-600 hover:text-primary-700 underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-expanded={showFullDisclaimer}
              aria-controls="disclaimer-text"
            >
              {showFullDisclaimer ? 'Show Less' : 'Read Full Disclaimer'}
            </button>
          </div>

          <div
            id="disclaimer-text"
            className={`text-body-md text-text-secondary ${showFullDisclaimer ? '' : 'line-clamp-3'}`}
            aria-hidden={!showFullDisclaimer}
          >
            <p>
              I understand that the Pike2ThePolls Program is not affiliated with any Pike Township Government entity
              and is provided by Annette Johnson in her personal capacity as a candidate for re-election. I understand
              that I am not required to vote for any specific candidate as a condition of participating in the
              Pike2ThePolls Program.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="disclaimer-checkbox"
            className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors cursor-pointer min-h-[56px] ${
              errors.disclaimer
                ? 'border-error-500 bg-error-50'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="relative flex items-start pt-1">
              <input
                id="disclaimer-checkbox"
                type="checkbox"
                checked={disclaimer}
                onChange={(e) => handleDisclaimerChange(e.target.checked)}
                className="w-5 h-5 mt-0.5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
                aria-required="true"
                aria-describedby="disclaimer-desc"
                aria-invalid={!!errors.disclaimer}
              />
            </div>
            <div className="flex-1">
              <span id="disclaimer-desc" className="text-body-md text-text-primary">
                I understand that the Pike2ThePolls Program is not affiliated with any Pike Township Government entity
                and is provided by Annette Johnson in her personal capacity as a candidate for re-election. I understand
                that I am not required to vote for any specific candidate as a condition of participating in the
                Pike2ThePolls Program.
                <span className="text-error-600 font-medium" aria-label="required">
                  {' '}*
                </span>
              </span>
            </div>
          </label>

          {errors.disclaimer && (
            <p
              className="text-body-sm text-error-600 ml-4 mt-1"
              role="alert"
              aria-live="assertive"
            >
              {errors.disclaimer}
            </p>
          )}
        </div>
      </div>

      <Alert variant="info">
        <p className="text-body-sm">
          <strong>Note:</strong> Both agreements above must be accepted to submit your ride request. These agreements
          help ensure the safety and transparency of the Pike2ThePolls Program.
        </p>
      </Alert>

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="min-h-[48px]"
        >
          Back
        </Button>
        <Button
          type="submit"
          size="lg"
          className="min-h-[48px]"
        >
          Submit Request
        </Button>
      </div>
    </form>
  );
}
