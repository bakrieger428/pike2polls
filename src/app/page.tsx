import Link from 'next/link';
import { Card, Alert } from '@/components/ui';
import { Container } from '@/components/layout';
import { HeroSection } from '@/components/HeroSection';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <section className="py-section bg-background" aria-labelledby="how-it-works-heading">
        <Container>
          <h2 id="how-it-works-heading" className="text-display-xl font-bold text-text-primary text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card
              title="1. Sign Up"
              titleAs="h3"
              hoverable
              className="text-center"
            >
              <p className="text-body-md text-text-secondary mb-4">
                Complete our simple form to request your ride. We&apos;ll ask for your
                name, preferred voting date, and contact information.
              </p>
              <div className="flex justify-center" aria-hidden="true">
                <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </Card>

            <Card
              title="2. Get Confirmation"
              titleAs="h3"
              hoverable
              className="text-center"
            >
              <p className="text-body-md text-text-secondary mb-4">
                We&apos;ll contact you to confirm your pickup time and location.
                Rides are scheduled based on your preferred time slot.
              </p>
              <div className="flex justify-center" aria-hidden="true">
                <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </Card>

            <Card
              title="3. Vote!"
              titleAs="h3"
              hoverable
              className="text-center"
            >
              <p className="text-body-md text-text-secondary mb-4">
                Your driver will pick you up at the scheduled time, take you to your
                polling place, and bring you home safely.
              </p>
              <div className="flex justify-center" aria-hidden="true">
                <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Eligibility Section */}
      <section className="py-section bg-neutral-50" aria-labelledby="eligibility-heading">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="eligibility-heading" className="text-display-xl font-bold text-text-primary text-center mb-8">
              Who Is Eligible?
            </h2>

            <Alert variant="info" className="mb-8">
              <p className="text-body-md">
                <strong>Good news:</strong> Most Pike Township residents qualify for our
                ride service! Read below for eligibility requirements.
              </p>
            </Alert>

            <Card className="space-y-6">
              <div>
                <h3 id="residence-requirement" className="text-heading-lg font-semibold text-text-primary mb-3">
                  Residency Requirement
                </h3>
                <p className="text-body-md text-text-secondary">
                  You must be a resident of Pike Township, Indiana (Marion County).
                  Your driver&apos;s license or state ID with your current address will
                  be used to verify residency.
                </p>
              </div>

              <div className="border-t border-border-light pt-6">
                <h3 id="registration-requirement" className="text-heading-lg font-semibold text-text-primary mb-3">
                  Voter Registration
                </h3>
                <p className="text-body-md text-text-secondary">
                  You must be registered to vote in Indiana. Not registered yet?
                  No problem! You can register online at{' '}
                  <a
                    href="https://indianavoters.in.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 underline hover:text-primary-700 focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
                  >
                    IndianaVoters.in.gov
                  </a>
                  {' '}or at your polling place on election day.
                </p>
              </div>

              <div className="border-t border-border-light pt-6">
                <h3 id="no-requirements" className="text-heading-lg font-semibold text-text-primary mb-3">
                  What You Don&apos;t Need
                </h3>
                <ul className="space-y-2 text-body-md text-text-secondary">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No income requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No vehicle ownership restrictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No age restrictions beyond voting age (18+)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No disability or mobility restrictions</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Important Dates Section */}
      <section className="py-section bg-background" aria-labelledby="dates-heading">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="dates-heading" className="text-display-xl font-bold text-text-primary text-center mb-8">
              Important Voting Dates
            </h2>

            <Card className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-caption-sm font-semibold text-primary-700 uppercase">Date</div>
                  <div className="text-heading-lg font-bold text-primary-600">Apr 25</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Early Voting Starts
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    11:00 AM - 6:00 PM at Pike Township Public Library
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-caption-sm font-semibold text-neutral-700 uppercase">Period</div>
                  <div className="text-heading-lg font-bold text-neutral-600">Apr 25</div>
                  <div className="text-caption-sm text-neutral-600">to May 3</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Early Voting Continues
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    Early voting is available daily through May 3rd at Pike Township Public Library
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-caption-sm font-semibold text-primary-700 uppercase">Date</div>
                  <div className="text-heading-lg font-bold text-primary-600">May 3</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Final Day of Early Voting
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    11:00 AM - 6:00 PM at Pike Township Public Library
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-secondary-100 rounded-lg border-2 border-secondary-500">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-caption-sm font-semibold text-secondary-700 uppercase">Date</div>
                  <div className="text-heading-lg font-bold text-secondary-600">May 5</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Election Day
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    9:00 AM - 6:00 PM at your assigned polling place
                    <span className="block text-body-sm mt-1 text-neutral-600">Polls open at 6:00 AM</span>
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="badge badge-primary">Most Popular</span>
                </div>
              </div>
            </Card>

            <Alert variant="warning" className="mt-6">
              <p className="text-body-md">
                <strong>Note:</strong> Dates and times are subject to change.
                Please verify with the{' '}
                <a
                  href="https://indianavoters.in.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  Indiana Voters Portal
                </a>
                {' '}for the most current information.
              </p>
            </Alert>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-section bg-neutral-50" aria-labelledby="contact-heading">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="contact-heading" className="text-display-xl font-bold text-text-primary mb-6">
              Questions?
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              Contact us for assistance by email or phone.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <Card>
                <h3 id="email-contact" className="text-heading-md font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </h3>
                <a
                  href="mailto:support@pike2thepolls.com"
                  className="text-body-md text-primary-600 hover:text-primary-700 underline focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
                >
                  support@pike2thepolls.com
                </a>
              </Card>

              <Card>
                <h3 id="phone-contact" className="text-heading-md font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone
                </h3>
                <a
                  href="tel:3179781131"
                  className="text-body-md text-primary-600 hover:text-primary-700 underline focus-visible:outline-focus-ring focus-visible:outline-offset-2 rounded"
                >
                  (317) 978-1131
                </a>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-section bg-primary-600" aria-labelledby="cta-heading">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-display-lg font-bold text-white mb-6 text-balance">
              Ready to Vote? Let&apos;s Get You There.
            </h2>
            <p className="text-body-lg text-white/90 mb-8 text-balance">
              Don&apos;t let transportation stand in the way of your voice.
              Sign up today for your free ride to the polls.
            </p>
            <Link
              href="/signup"
              className="btn bg-secondary-500 text-white px-8 py-4 text-body-lg min-h-[48px] inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 hover:bg-secondary-600 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            >
              Sign Up Now
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
