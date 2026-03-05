'use client';

import { Input, Button } from '@/components/ui';
import { useState } from 'react';

export interface NameStepProps {
  initialValues?: { first_name: string; last_name: string };
  onNext: (data: { first_name: string; last_name: string }) => void;
  onBack: () => void;
}

/**
 * Step 2: Name
 * Collects first and last name
 */
export function NameStep({ initialValues = { first_name: '', last_name: '' }, onNext, onBack }: NameStepProps) {
  const [firstName, setFirstName] = useState(initialValues.first_name);
  const [lastName, setLastName] = useState(initialValues.last_name);
  const [errors, setErrors] = useState<{ first_name?: string; last_name?: string }>({});

  const validate = (): boolean => {
    const newErrors: { first_name?: string; last_name?: string } = {};

    if (!firstName.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    } else if (firstName.trim().length > 50) {
      newErrors.first_name = 'First name must be less than 50 characters';
    }

    if (!lastName.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    } else if (lastName.trim().length > 50) {
      newErrors.last_name = 'Last name must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext({ first_name: firstName.trim(), last_name: lastName.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="group" aria-labelledby="name-heading">
      <div>
        <h2 id="name-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          What&apos;s your name?
        </h2>
        <p className="text-body-md text-text-secondary">
          Please enter your legal name as it appears on your voter registration.
        </p>
      </div>

      <Input
        id="first_name"
        label="First Name"
        value={firstName}
        onChange={(e) => {
          setFirstName(e.target.value);
          if (errors.first_name) setErrors({ ...errors, first_name: undefined });
        }}
        error={errors.first_name}
        autoComplete="given-name"
        required
      />

      <Input
        id="last_name"
        label="Last Name"
        value={lastName}
        onChange={(e) => {
          setLastName(e.target.value);
          if (errors.last_name) setErrors({ ...errors, last_name: undefined });
        }}
        error={errors.last_name}
        autoComplete="family-name"
        required
      />

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Continue
        </Button>
      </div>
    </form>
  );
}
