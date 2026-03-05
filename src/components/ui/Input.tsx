import React from 'react';
import { InputHTMLAttributes, forwardRef } from 'react';

/**
 * Input Component
 *
 * Accessible text input component.
 * Meets WCAG 2.1 AA standards including:
 * - Touch target minimum 44x44px
 * - Visible focus indicators
 * - Proper label association
 * - Error states with ARIA attributes
 */

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label text
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Success message to display
   */
  success?: string;

  /**
   * Helper text to display below input
   */
  helperText?: string;

  /**
   * Full width input
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Input container class name
   */
  containerClassName?: string;

  /**
   * Ref to the input element
   */
  inputRef?: React.RefObject<HTMLInputElement>;
}

/**
 * Input Component
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email address"
 *   type="email"
 *   placeholder="you@example.com"
 *   required
 *   error={errors.email}
 * />
 *
 * <Input
 *   label="Full name"
 *   helperText="Enter your legal name"
 *   success="Looks good!"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      fullWidth = true,
      containerClassName = '',
      className = '',
      id,
      required,
      inputRef,
      ...props
    },
    ref
  ) => {
    // Generate unique ID (call unconditionally)
    const generatedId = React.useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const successId = success ? `${inputId}-success` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const inputClasses = `
      input
      ${error ? 'input-error' : ''}
      ${success ? 'input-success' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim();

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`space-y-2 ${widthClass} ${containerClassName}`.trim()}>
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {required && <span className="label-required" aria-label="required">*</span>}
          </label>
        )}

        <input
          ref={inputRef || ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : success ? successId : helperId
          }
          aria-required={required}
          required={required}
          {...props}
        />

        {error && (
          <p id={errorId} className="text-caption-sm text-error-600" role="alert">
            {error}
          </p>
        )}

        {success && !error && (
          <p id={successId} className="text-caption-sm text-success-600">
            {success}
          </p>
        )}

        {helperText && !error && !success && (
          <p id={helperId} className="text-caption-sm text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
