import React, { HTMLAttributes, forwardRef } from 'react';

/**
 * Card Component
 *
 * Accessible card component for grouping related content.
 * Meets WCAG 2.1 AA standards including:
 * - Proper heading hierarchy
 * - Sufficient color contrast
 * - Semantic HTML structure
 * - Keyboard navigable when interactive
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card title
   */
  title?: string;

  /**
   * Card title heading level (h1-h6)
   * @default 'h3'
   */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  /**
   * Subtitle text
   */
  subtitle?: string;

  /**
   * Card footer content
   */
  footer?: React.ReactNode;

  /**
   * Add hover effect
   * @default false
   */
  hoverable?: boolean;

  /**
   * Make card interactive (adds button role and tabindex)
   * @default false
   */
  interactive?: boolean;

  /**
   * Padding variant
   * @default 'default'
   */
  padding?: 'none' | 'sm' | 'default' | 'lg';

  /**
   * Remove card background and shadow (outline only)
   * @default false
   */
  _outline?: false; // Renamed to avoid conflict with HTML attribute
}

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  default: 'p-6',
  lg: 'p-8',
};

/**
 * Card Component
 *
 * @example
 * ```tsx
 * <Card title="Welcome to Pike2ThePolls" hoverable>
 *   <p>This is the card content.</p>
 * </Card>
 *
 * <Card
 *   title="Ride Request"
 *   subtitle="Submitted on Oct 15, 2026"
 *   footer={<Button>View Details</Button>}
 * >
 *   <p>Card content here...</p>
 * </Card>
 *
 * <Card interactive onClick={handleClick}>
 *   <p>Click to navigate</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      titleAs = 'h3',
      subtitle,
      footer,
      hoverable = false,
      interactive = false,
      padding = 'default',
      _outline = false, // Unused parameter
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const TitleTag = titleAs;
    const paddingClass = paddingClasses[padding];

    const cardClasses = `
      card
      ${hoverable ? 'card-hover' : ''}
      ${paddingClass}
      ${className}
    `.trim();

    // Interactive card props
    const interactiveProps = interactive
      ? {
          role: 'button' as const,
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              props.onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
            }
          },
        }
      : {};

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...interactiveProps}
        {...props}
      >
        {(title || subtitle) && (
          <div className="mb-4">
            {title && (
              <TitleTag className="text-heading-lg font-semibold text-text-primary mb-1">
                {title}
              </TitleTag>
            )}
            {subtitle && (
              <p className="text-body-sm text-text-tertiary">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children && (
          <div className="text-body-md text-text-secondary">
            {children}
          </div>
        )}

        {footer && (
          <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-between gap-4">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
