import React from 'react';
import { SelectHTMLAttributes, forwardRef } from 'react';

/**
 * Select Component
 *
 * Accessible dropdown select component.
 * Meets WCAG 2.1 AA standards including:
 * - Touch target minimum 44x44px
 * - Visible focus indicators
 * - Proper label association
 * - Error states with ARIA attributes
 */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Select label text
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
   * Helper text to display below select
   */
  helperText?: string;

  /**
   * Full width select
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Options to display
   */
  options: SelectOption[];

  /**
   * Placeholder option text
   */
  placeholder?: string;

  /**
   * Select container class name
   */
  containerClassName?: string;
}

/**
 * Select Component
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: 'early-voting-1', label: 'October 26, 2026 - 8AM-6PM' },
 *   { value: 'early-voting-2', label: 'November 2, 2026 - 8AM-6PM' },
 *   { value: 'election-day', label: 'November 5, 2026 - 6AM-6PM' },
 * ];
 *
 * <Select
 *   label="Select your preferred voting date"
 *   options={options}
 *   placeholder="Choose a date..."
 *   required
 *   error={errors.votingDate}
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      fullWidth = true,
      options,
      placeholder = 'Select an option...',
      containerClassName = '',
      className = '',
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID (call unconditionally)
    const generatedId = React.useId();
    const selectId = id || `select-${generatedId}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const successId = success ? `${selectId}-success` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    const selectClasses = `
      input
      ${error ? 'input-error' : ''}
      ${success ? 'input-success' : ''}
      ${fullWidth ? 'w-full' : ''}
      cursor-pointer
      ${className}
    `.trim();

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`space-y-2 ${widthClass} ${containerClassName}`.trim()}>
        {label && (
          <label htmlFor={selectId} className="label">
            {label}
            {required && <span className="label-required" aria-label="required">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : success ? successId : helperId
            }
            aria-required={required}
            disabled={disabled}
            required={required}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary"
            aria-hidden="true"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

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

Select.displayName = 'Select';
