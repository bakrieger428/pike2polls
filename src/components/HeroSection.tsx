import Link from 'next/link';

/**
 * HeroSection Component
 *
 * Main hero section for the landing page with a compelling message
 * about voting rights and call-to-action buttons.
 *
 * Features:
 * - Responsive gradient background
 * - WCAG 2.1 AA compliant color contrast
 * - Accessible CTA buttons (44x44px touch targets)
 * - Keyboard navigation support
 * - Screen reader optimized
 *
 * @example
 * ```tsx
 * <HeroSection />
 * ```
 */
export interface HeroSectionProps {
  /**
   * Main heading text
   * @default 'Free Rides to the Polls for Pike Township Residents'
   */
  heading?: string;

  /**
   * Subheading/description text
   * @default 'Voting is a constitutional right...'
   */
  description?: string;

  /**
   * Primary CTA button config
   */
  primaryCTA?: {
    label: string;
    href: string;
    ariaLabel?: string;
  };

  /**
   * Secondary CTA button config
   */
  secondaryCTA?: {
    label: string;
    href: string;
    ariaLabel?: string;
  };

  /**
   * Background gradient classes
   * @default 'bg-gradient-to-br from-primary-50 to-secondary-50'
   */
  backgroundClass?: string;

  /**
   * Additional className
   */
  className?: string;
}

export function HeroSection({
  heading = 'Free Rides to the Polls for Pike Township Residents',
  description = 'Voting is a constitutional right, and Annette Johnson believes no citizen should be denied that privilege simply because they lack transportation. She\'s committed to ensuring every Pike Township resident can access the polls—regardless of who they choose to vote for.',
  primaryCTA = { label: 'Sign Up for a Ride', href: '/signup', ariaLabel: 'Sign up for a ride to the polls' },
  secondaryCTA = { label: 'Learn More', href: '/faq', ariaLabel: 'Learn more about the program' },
  backgroundClass = 'bg-gradient-to-br from-primary-50 to-secondary-50',
  className,
}: HeroSectionProps) {
  return (
    <section
      className={`py-section ${backgroundClass} ${className || ''}`}
      aria-labelledby="hero-heading"
    >
      <div className="container mx-auto px-container">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            id="hero-heading"
            className="text-display-lg font-bold text-text-primary mb-6 text-balance"
          >
            {heading}
          </h1>
          <p className="text-body-lg text-text-secondary mb-8 text-balance">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={primaryCTA.href}
              aria-label={primaryCTA.ariaLabel}
              className="btn btn-primary px-8 py-4 text-body-lg min-h-[48px] inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 hover:bg-primary-700 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            >
              {primaryCTA.label}
            </Link>
            <Link
              href={secondaryCTA.href}
              aria-label={secondaryCTA.ariaLabel}
              className="btn btn-outline px-8 py-4 text-body-lg min-h-[48px] inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 hover:bg-primary-50 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            >
              {secondaryCTA.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
