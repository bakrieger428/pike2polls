import React from 'react';
import { TextareaHTMLAttributes, forwardRef } from 'react';

/**
 * Textarea Component
 *
 * Accessible multiline text input component.
 * Meets WCAG 2.1 AA standards including:
 * - Touch target minimum 44x44px
 * - Visible focus indicators
 * - Proper label association
 * - Error states with ARIA attributes
 * - Resizable with handle
 */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea label text
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
   * Helper text to display below textarea
   */
  helperText?: string;

  /**
   * Full width textarea
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Character count limit
   */
  maxLength?: number;

  /**
   * Current character count (for controlled components)
   */
  currentLength?: number;

  /**
   * Show character count
   * @default false
   */
  showCount?: boolean;

  /**
   * Textarea container class name
   */
  containerClassName?: string;
}

/**
 * Textarea Component
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Additional notes"
 *   placeholder="Enter any additional information..."
 *   rows={4}
 *   maxLength={500}
 *   showCount
 * />
 *
 * <Textarea
 *   label="Address"
 *   error="This field is required"
 *   rows={3}
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      fullWidth = true,
      maxLength,
      currentLength,
      showCount = false,
      containerClassName = '',
      className = '',
      id,
      required,
      value,
      ...props
    },
    ref
  ) => {
    // Generate unique ID (call unconditionally)
    const generatedId = React.useId();
    const textareaId = id || `textarea-${generatedId}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const successId = success ? `${textareaId}-success` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;

    // Calculate current length for display
    const charCount = currentLength ?? (typeof value === 'string' ? value.length : 0);
    const isNearLimit = maxLength && charCount > maxLength * 0.9;
    const isAtLimit = maxLength && charCount >= maxLength;

    const textareaClasses = `
      textarea
      ${error ? 'input-error' : ''}
      ${success ? 'input-success' : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim();

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <div className={`space-y-2 ${widthClass} ${containerClassName}`.trim()}>
        <div className="flex items-center justify-between gap-4">
          {label && (
            <label htmlFor={textareaId} className="label">
              {label}
              {required && <span className="label-required" aria-label="required">*</span>}
            </label>
          )}

          {showCount && maxLength && (
            <span
              className={`text-caption-sm ${isAtLimit ? 'text-error-600' : isNearLimit ? 'text-warning-600' : 'text-text-tertiary'}`}
              aria-live="polite"
            >
              {charCount} / {maxLength}
            </span>
          )}
        </div>

        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : success ? successId : helperId
          }
          aria-required={required}
          maxLength={maxLength}
          value={value}
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

Textarea.displayName = 'Textarea';
