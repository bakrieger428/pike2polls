'use client';

import { Input, Textarea, Button, Alert } from '@/components/ui';
import { useState } from 'react';

export interface ContactInfoStepProps {
  initialValues?: {
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  onNext: (data: {
    email: string;
    phone: string;
    address: string;
    notes?: string;
  }) => void;
  onBack: () => void;
  isLoading?: boolean;
}

/**
 * Step 6: Contact Information
 * Collects email, phone, address (required for pickup), and optional notes
 */
export function ContactInfoStep({
  initialValues = { email: '', phone: '', address: '', notes: '' },
  onNext,
  onBack,
  isLoading = false,
}: ContactInfoStepProps) {
  const [email, setEmail] = useState(initialValues.email);
  const [phone, setPhone] = useState(initialValues.phone);
  const [address, setAddress] = useState(initialValues.address || '');
  const [notes, setNotes] = useState(initialValues.notes || '');
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    address?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; phone?: string; address?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!address.trim()) {
      newErrors.address = 'Pickup address is required';
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    if (errors.address) setErrors({ ...errors, address: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext({
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" role="group" aria-labelledby="contact-info-heading">
      <div>
        <h2 id="contact-info-heading" className="text-heading-xl font-semibold text-text-primary mb-2">
          How can we contact you?
        </h2>
        <p className="text-body-md text-text-secondary">
          We need your contact information to confirm your ride details.
        </p>
      </div>

      <Alert variant="info">
        <p className="text-body-sm">
          <strong>Privacy:</strong> Your information is only used to coordinate your ride. We never share your data with third parties.
          See our{' '}
          <a href="/faq#privacy" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            Privacy Policy
          </a>
          {' '}for details.
        </p>
      </Alert>

      <Input
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: undefined });
        }}
        error={errors.email}
        autoComplete="email"
        placeholder="you@example.com"
        required
      />

      <Input
        id="phone"
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        error={errors.phone}
        autoComplete="tel"
        placeholder="(317) 978-1131"
        helperText="We'll call or text to confirm your ride details."
        required
      />

      <Input
        id="address"
        label="Pickup Address"
        value={address}
        onChange={handleAddressChange}
        error={errors.address}
        autoComplete="street-address"
        placeholder="123 Main St, Indianapolis, IN 46268"
        helperText="Enter the address where you would like to be picked up."
        required
      />

      <Textarea
        id="notes"
        label="Additional Notes (Optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any accessibility needs, special instructions, or questions..."
        rows={3}
        maxLength={500}
        showCount
        helperText="Let us know about any mobility aids, accessibility requirements, or other needs."
      />

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button type="submit" size="lg" isLoading={isLoading}>
          Continue
        </Button>
      </div>
    </form>
  );
}
