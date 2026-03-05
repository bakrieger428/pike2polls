import { Container } from '@/components/layout';
import { Alert } from '@/components/ui';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  id: string;
}

const faqItems: FAQItem[] = [
  {
    id: 'who-eligible',
    question: 'Who is eligible for a ride?',
    answer: (
      <p className="text-body-md text-text-secondary">
        Any Pike Township resident who is registered to vote in Indiana is eligible.
        You must be a resident of Pike Township (Marion County) and at least 18 years old.
        We do not have income, vehicle ownership, or disability restrictions.
      </p>
    ),
  },
  {
    id: 'cost',
    question: 'How much does the ride cost?',
    answer: (
      <p className="text-body-md text-text-secondary">
        <strong>Nothing!</strong> This service is completely free, provided by the Pike2ThePolls Team as a community service to ensure all residents can exercise their right to vote.
      </p>
    ),
  },
  {
    id: 'sign-up',
    question: 'How do I sign up for a ride?',
    answer: (
      <div className="space-y-3 text-body-md text-text-secondary">
        <p>
          Fill out our simple online sign-up form, which takes about 5 minutes.
          We&apos;ll ask for:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Your name and contact information</li>
          <li>Your address in Pike Township</li>
          <li>Your preferred voting date (early voting or election day)</li>
          <li>Your preferred pickup time</li>
        </ul>
        <p>
          After you submit, we&apos;ll contact you to confirm your ride details.
        </p>
      </div>
    ),
  },
  {
    id: 'pickup-location',
    question: 'Where will I be picked up?',
    answer: (
      <p className="text-body-md text-text-secondary">
        Your driver will pick you up at the address you provide on the sign-up form.
        This should be your home address or another location where you&apos;ll be waiting.
        Please be ready and waiting at your pickup location at least 10 minutes before
        your scheduled time.
      </p>
    ),
  },
  {
    id: 'accessible',
    question: 'Are the vehicles wheelchair accessible?',
    answer: (
      <p className="text-body-md text-text-secondary">
        Yes! We have wheelchair-accessible vehicles available. Please note that you need
        a wheelchair-accessible vehicle when you sign up, and we will ensure an
        appropriate vehicle is assigned to your ride.
      </p>
    ),
  },
  {
    id: 'early-voting',
    question: 'Can I get a ride for early voting?',
    answer: (
      <p className="text-body-md text-text-secondary">
        Absolutely! We provide rides for both early voting and election day.
        During the sign-up process, you can select your preferred voting date.
        Early voting takes place at the City-County Building in downtown Indianapolis.
      </p>
    ),
  },
  {
    id: 'guest',
    question: 'Can a family member or caregiver come with me?',
    answer: (
      <p className="text-body-md text-text-secondary">
        Yes, family members and caregivers are welcome to accompany you.
        Please note this in your sign-up so we can ensure adequate seating.
        There is no additional charge for accompanying riders.
      </p>
    ),
  },
  {
    id: 'return-trip',
    question: 'Will I get a ride back home?',
    answer: (
      <p className="text-body-md text-text-secondary">
        Yes! Your ride includes both the trip to your polling place and the return trip home.
        Your driver will coordinate with you at the polling place about when to pick you up.
        Most trips take 15-30 minutes, but this can vary based on wait times at the polls.
      </p>
    ),
  },
  {
    id: 'cancellation',
    question: 'What if I need to cancel or reschedule?',
    answer: (
      <p className="text-body-md text-text-secondary">
        Please contact us as soon as possible if you need to cancel or reschedule your ride.
        You can call us at <a href="tel:3179781131" className="text-primary-600 underline hover:text-primary-700">(317) 978-1131</a> or email <a href="mailto:support@pike2thepolls.com" className="text-primary-600 underline hover:text-primary-700">support@pike2thepolls.com</a>.
        We appreciate at least 24 hours notice so we can offer your ride to another resident.
      </p>
    ),
  },
  {
    id: 'bring',
    question: 'What should I bring with me?',
    answer: (
      <div className="space-y-3 text-body-md text-text-secondary">
        <p>When you go to vote, remember to bring:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>A valid Indiana driver&apos;s license or state ID with your current address</li>
          <li>If your address has changed, bring a utility bill or bank statement with your current address</li>
          <li>Any mobility aids you typically use</li>
          <li>A face mask (optional, based on your comfort level)</li>
        </ul>
      </div>
    ),
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-neutral-50 py-section border-b border-border-light" aria-labelledby="faq-heading">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 id="faq-heading" className="text-display-xl font-bold text-text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-body-lg text-text-secondary">
              Find answers to common questions about our ride-to-the-polls program.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-section" aria-labelledby="faq-questions-heading">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-questions-heading" className="sr-only">
              Questions and Answers
            </h2>

            <Alert variant="info" className="mb-8">
              <p className="text-body-md">
                <strong>Don&apos;t see your question here?</strong> Contact us at{' '}
                <a href="mailto:support@pike2thepolls.com" className="underline font-medium">
                  support@pike2thepolls.com
                </a>
                {' '}or call{' '}
                <a href="tel:3179781131" className="underline font-medium">
                  (317) 978-1131
                </a>
                {' '}for assistance.
              </p>
            </Alert>

            <div className="space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.id}
                  className="group bg-surface rounded-card border border-border-light overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-surface-hover transition-colors focus-visible:outline-focus-ring focus-visible:outline-offset-2">
                    <h3 className="text-heading-md font-semibold text-text-primary pr-4">
                      {item.question}
                    </h3>
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 group-open:bg-primary-600 group-open:text-white transition-colors">
                      <svg
                        className="w-4 h-4 transform group-open:rotate-180 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-0">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Privacy Policy Section */}
      <section id="privacy" className="py-section bg-neutral-50" aria-labelledby="privacy-heading">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="privacy-heading" className="text-display-xl font-bold text-text-primary mb-6">
              Privacy Policy
            </h2>

            <div className="prose prose-slate max-w-none">
              <div className="bg-surface rounded-card border border-border-light p-6 space-y-4 text-body-md text-text-secondary">
                <p>
                  Your privacy is important to the Pike2ThePolls Team.
                  This policy explains how we collect, use, and protect your personal information.
                </p>

                <h3 id="information-collected" className="text-heading-lg font-semibold text-text-primary pt-4">
                  Information We Collect
                </h3>
                <p>
                  When you sign up for a ride, we collect:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Home address (to verify residency and coordinate pickup)</li>
                  <li>Preferred voting date and time</li>
                  <li>Accessibility requirements</li>
                </ul>

                <h3 id="information-use" className="text-heading-lg font-semibold text-text-primary pt-4">
                  How We Use Your Information
                </h3>
                <p>
                  Your information is used solely to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Coordinate your ride to the polling place</li>
                  <li>Verify Pike Township residency eligibility</li>
                  <li>Contact you about ride confirmations or schedule changes</li>
                </ul>

                <h3 id="information-sharing" className="text-heading-lg font-semibold text-text-primary pt-4">
                  Information Sharing
                </h3>
                <p>
                  <strong>We do not sell, rent, or share your personal information with third parties</strong> for marketing purposes.
                  Your information may only be shared with:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Drivers assigned to provide your transportation</li>
                </ul>

                <h3 id="data-security" className="text-heading-lg font-semibold text-text-primary pt-4">
                  Data Security
                </h3>
                <p>
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                  However, no method of transmission over the internet is 100% secure.
                </p>

                <h3 id="data-retention" className="text-heading-lg font-semibold text-text-primary pt-4">
                  Data Retention
                </h3>
                <p>
                  Your information will be retained for the duration of the election cycle
                  and then securely destroyed in accordance with Indiana record retention laws.
                </p>

                <h3 id="your-rights" className="text-heading-lg font-semibold text-text-primary pt-4">
                  Your Rights
                </h3>
                <p>
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Opt out of future communications</li>
                </ul>

                <Alert variant="info" className="mt-6">
                  <p className="text-body-md">
                    <strong>Contact Us:</strong> To exercise your rights or ask questions about
                    our privacy practices, contact us at{' '}
                    <a href="mailto:support@pike2thepolls.com" className="underline font-medium">
                      support@pike2thepolls.com
                    </a>.
                  </p>
                </Alert>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Terms & Disclosures Section */}
      <section id="terms" className="py-section" aria-labelledby="terms-heading">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="terms-heading" className="text-display-xl font-bold text-text-primary mb-6">
              Terms of Service & Disclosures
            </h2>

            <div className="bg-surface rounded-card border border-border-light p-6 space-y-6 text-body-md text-text-secondary">
              <div>
                <h3 id="service-availability" className="text-heading-lg font-semibold text-text-primary mb-3">
                  Service Availability
                </h3>
                <p>
                  Ride services are available on a first-come, first-served basis.
                  We will make every effort to accommodate all requests but cannot guarantee
                  availability for all preferred times. Services are provided only within
                  Pike Township, Marion County, Indiana.
                </p>
              </div>

              <div>
                <h3 id="eligibility-verification" className="text-heading-lg font-semibold text-text-primary mb-3">
                  Eligibility Verification
                </h3>
                <p>
                  By using this service, you confirm that you are a resident of Pike Township
                  and are registered to vote in Indiana. We reserve the right to verify
                  residency and voter registration status. Providing false information may
                  result in denial of service.
                </p>
              </div>

              <div>
                <h3 id="code-of-conduct" className="text-heading-lg font-semibold text-text-primary mb-3">
                  Code of Conduct
                </h3>
                <p>
                  All passengers must:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Treat drivers and fellow passengers with respect</li>
                  <li>Follow all applicable laws while aboard the vehicle</li>
                  <li>Wear seat belts at all times during transport</li>
                  <li>Refrain from smoking, vaping, or alcohol consumption</li>
                  <li>Not engage in disruptive or aggressive behavior</li>
                </ul>
                <p className="mt-3">
                  We reserve the right to refuse service to individuals who violate this code of conduct.
                </p>
              </div>

              <div>
                <h3 id="liability-waiver" className="text-heading-lg font-semibold text-text-primary mb-3">
                  Liability Disclaimer
                </h3>
                <p>
                  The Pike2ThePolls program provides transportation services as a
                  community convenience. While we take reasonable precautions to ensure
                  passenger safety, we assume no liability for:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Delays caused by traffic, weather, or circumstances beyond our control</li>
                  <li>Personal items left in vehicles</li>
                  <li>Injuries resulting from passenger misconduct</li>
                  <li>Missed voting opportunities due to delays</li>
                </ul>
              </div>

              <div>
                <h3 id="political-neutrality" className="text-heading-lg font-semibold text-text-primary mb-3">
                  Political Neutrality
                </h3>
                <p>
                  The Pike2ThePolls program is a non-partisan service provided to ensure
                  all residents can exercise their constitutional right to vote.
                  We do not endorse any political party, candidate, or ballot initiative.
                  Drivers are prohibited from discussing politics or influencing your vote.
                </p>
              </div>

              <div>
                <h3 id="emergency-contact" className="text-heading-lg font-semibold text-text-primary mb-3">
                  Emergency Contact
                </h3>
                <p>
                  If you experience an emergency during your ride, immediately call 911.
                  For non-emergency issues, contact our team at{' '}
                  <a href="tel:3179781131" className="text-primary-600 underline hover:text-primary-700">
                    (317) 978-1131
                  </a>.
                </p>
              </div>

              <Alert variant="warning">
                <p className="text-body-md">
                  <strong>Age Requirement:</strong> This service is available only to individuals
                  18 years of age or older who are eligible to vote in Indiana elections.
                  Minors may not use this service unless accompanied by a parent or legal guardian.
                </p>
              </Alert>
            </div>
          </div>
        </Container>
      </section>

      {/* Print-friendly notice */}
      <div className="no-print bg-neutral-100 py-4 border-t border-border-light">
        <Container>
          <p className="text-caption-sm text-text-tertiary text-center">
            This page is printer-friendly. Use your browser&apos;s print function to save a copy.
          </p>
        </Container>
      </div>
    </>
  );
}
