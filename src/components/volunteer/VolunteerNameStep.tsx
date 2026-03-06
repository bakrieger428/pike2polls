'use client';

import { Input, Button } from '@/components/ui';
import { useState } from 'react';

export interface VolunteerNameStepProps {
  initialValues?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  onNext: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }) => void;
  onBack: () => void;
}

/**
 * Step 1: Name & Contact Info
 * Collects first name, last name, email, and phone number
 */
export function VolunteerNameStep({
  initialValues = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  },
  onNext,
  onBack,
}: VolunteerNameStepProps) {
  const [firstName, setFirstName] = useState(initialValues.first_name);
  const [lastName, setLastName] = useState(initialValues.last_name);
  const [email, setEmail] = useState(initialValues.email);
  const [phone, setPhone] = useState(initialValues.phone);
  const [errors, setErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    } = {};

    // First name validation
    if (!firstName.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    } else if (firstName.trim().length > 50) {
      newErrors.first_name = 'First name must be less than 50 characters';
    }

    // Last name validation
    if (!lastName.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    } else if (lastName.trim().length > 50) {
      newErrors.last_name = 'Last name must be less than 50 characters';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return value;
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (errors.phone) setErrors({ ...errors, phone: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="group" aria-labelledby="contact-heading">
      <div>
        <h2 id="contact-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          Let&apos;s get started!
        </h2>
        <p className="text-body-md text-text-secondary">
          Please provide your contact information so we can reach you about volunteer opportunities.
        </p>
      </div>

      <Input
        id="volunteer_first_name"
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
        id="volunteer_last_name"
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

      <Input
        id="volunteer_email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: undefined });
        }}
        error={errors.email}
        autoComplete="email"
        required
      />

      <Input
        id="volunteer_phone"
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        error={errors.phone}
        autoComplete="tel"
        placeholder="(317) 978-1131"
        helperText="We'll call or text to confirm your volunteer details."
        required
      />

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Home
        </Button>
        <Button type="submit" size="lg">
          Continue
        </Button>
      </div>
    </form>
  );
}
