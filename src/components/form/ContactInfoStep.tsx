'use client';

import { Input, Textarea, Button, Alert } from '@/components/ui';
import { useState, useEffect, useRef } from 'react';

// Place interface from Google Places API
interface Place {
  formatted_address?: string;
  fetchFields(options: { fields: string[] }): Promise<void>;
}

// Type for the place select event handler
type PlaceSelectHandler = (event: { placePrediction: { toPlace: () => Place } }) => void;

// Type for the PlaceAutocompleteElement instance
interface PlaceAutocompleteElementInstance {
  element: HTMLInputElement;
  addEventListener(event: string, handler: PlaceSelectHandler): void;
}

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

  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<unknown>(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Only load if we have an API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey || !addressInputRef.current) {
      return;
    }

    // Load Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleCallback`;
    script.async = true;
    script.defer = true;

    // Set up callback for when script loads
    (window as typeof globalThis & {
      initGoogleCallback?: () => Promise<void>;
    }).initGoogleCallback = async () => {
      try {
        // Request needed libraries
        const googleWin = window as typeof globalThis & {
          google?: {
            maps: {
              importLibrary: (library: string) => Promise<unknown>;
              places?: {
                PlaceAutocompleteElement: new (options?: Record<string, unknown>) => PlaceAutocompleteElementInstance;
              };
            };
          }
        };

        if (!googleWin.google) {
          throw new Error('Google Maps API not loaded');
        }

        await googleWin.google.maps.importLibrary('places');

        // Check if input element still exists
        if (!addressInputRef.current) {
          return;
        }

        // Access the places library after it's loaded
        if (!googleWin.google.maps.places) {
          throw new Error('Google Maps Places library not loaded');
        }

        // Create the PlaceAutocompleteElement
        const PlaceAutocompleteElement = googleWin.google.maps.places.PlaceAutocompleteElement;
        const placeAutocomplete = new PlaceAutocompleteElement({});

        // Replace the input with the autocomplete element
        if (addressInputRef.current.parentNode) {
          addressInputRef.current.parentNode.replaceChild(placeAutocomplete as unknown as Node, addressInputRef.current);
          // Update ref to point to the new element
          placeAutocomplete.element = addressInputRef.current;
          autocompleteRef.current = placeAutocomplete;

          // Add the gmp-placeselect listener
          placeAutocomplete.addEventListener('gmp-placeselect', async ({ placePrediction }) => {
            const place = placePrediction.toPlace();
            await place.fetchFields({ fields: ['formattedAddress'] });

            if (place.formatted_address) {
              setAddress(place.formatted_address);
              setErrors((prev) => ({ ...prev, address: undefined }));
            }
          });
        }
      } catch (error) {
        console.error('Error initializing Google Places autocomplete:', error);
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const globalWindow = window as typeof globalThis & {
        initGoogleCallback?: () => Promise<void>;
      };
      if (globalWindow.initGoogleCallback) {
        delete globalWindow.initGoogleCallback;
      }
    };
  }, []);

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

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (errors.address) setErrors({ ...errors, address: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug logging
    console.log("Address value:", address);
    console.log("Address trimmed:", address.trim());
    console.log("Input element value:", addressInputRef.current?.value);
    
    if (validate()) {
      onNext({
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
      });
    }
  };

  const hasGooglePlacesApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

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

      <div>
        <Input
          id="address"
          label="Pickup Address"
          inputRef={addressInputRef}
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          error={errors.address}
          autoComplete="street-address"
          placeholder={hasGooglePlacesApiKey ? "Start typing to search for your address..." : "123 Main St, Indianapolis, IN 46268"}
          helperText={hasGooglePlacesApiKey ? "Type your address to see suggestions." : "Enter the address where you would like to be picked up."}
          required
        />
        {!hasGooglePlacesApiKey && (
          <p className="text-caption-sm text-text-tertiary mt-1">
            💡 Tip: Add a Google Places API key to enable address autocomplete
          </p>
        )}
      </div>

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
