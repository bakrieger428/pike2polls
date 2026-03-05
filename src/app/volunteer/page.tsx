 'use client';

import Link from 'next/link';
import { Card, Alert } from '@/components/ui';
import { Container } from '@/components/layout';

export default function VolunteerPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-section" aria-labelledby="volunteer-hero-heading">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 id="volunteer-hero-heading" className="text-display-lg font-bold text-text-primary mb-6 text-balance">
              Volunteer for Pike2ThePolls
            </h1>
            <p className="text-body-lg text-text-secondary mb-8 text-balance">
              Help ensure every Pike Township resident can exercise their right to vote
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/volunteer/signup"
                className="btn btn-primary px-8 py-4 text-body-lg min-h-[48px] inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 hover:bg-primary-700 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
              >
                Sign Up to Volunteer
              </Link>
              <button
                onClick={() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-outline px-8 py-4 text-body-lg min-h-[48px] inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 hover:bg-primary-50 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
              >
                Learn More
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Volunteer Opportunities Section */}
      <section id="opportunities" className="py-section bg-background" aria-labelledby="opportunities-heading">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 id="opportunities-heading" className="text-display-xl font-bold text-text-primary text-center mb-12">
              Volunteer Opportunities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Driver Opportunity */}
              <Card
                title="Driver"
                titleAs="h3"
                hoverable
                className="h-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-center" aria-hidden="true">
                    <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>

                  <div>
                    <h4 className="text-heading-md font-semibold text-text-primary mb-2">Description</h4>
                    <p className="text-body-md text-text-secondary">
                      Drive residents to and from polling places on early voting days and election day. Help ensure every citizen can access their polling location.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-heading-md font-semibold text-text-primary mb-2">Requirements</h4>
                    <ul className="space-y-2 text-body-md text-text-secondary">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Valid driver&apos;s license</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Reliable vehicle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Current auto insurance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Good driving record</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-heading-md font-semibold text-text-primary mb-2">Time Commitment</h4>
                    <p className="text-body-md text-text-secondary">
                      Flexible opportunities available. Choose your availability during early voting (April 25 - May 3) or on Election Day (May 5).
                    </p>
                  </div>
                </div>
              </Card>

              {/* Logistical Support Opportunity */}
              <Card
                title="Logistical Support"
                titleAs="h3"
                hoverable
                className="h-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-center" aria-hidden="true">
                    <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>

                  <div>
                    <h4 className="text-heading-md font-semibold text-text-primary mb-2">Description</h4>
                    <p className="text-body-md text-text-secondary">
                      Assist with driver/rider check-in, phone calls, scheduling, and other support tasks to keep the operation running smoothly.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-heading-md font-semibold text-text-primary mb-2">Requirements</h4>
                    <ul className="space-y-2 text-body-md text-text-secondary">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Strong organizational skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Phone and computer skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Friendly, professional demeanor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Attention to detail</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-heading-md font-semibold text-text-primary mb-2">Time Commitment</h4>
                    <p className="text-body-md text-text-secondary">
                      Flexible opportunities available. Choose your availability during early voting (April 25 - May 3) or on Election Day (May 5).
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-section bg-neutral-50" aria-labelledby="benefits-heading">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="benefits-heading" className="text-display-xl font-bold text-text-primary text-center mb-8">
              Why Volunteer?
            </h2>

            <Card className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Help Your Community
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    Ensure every Pike Township resident can exercise their constitutional right to vote, regardless of transportation challenges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Flexible Scheduling
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    Choose the days and hours that work for you. Whether you can spare a few hours or a full day, your time makes a difference.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Non-Partisan Civic Engagement
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    Be part of a community effort that transcends party politics. We help all voters, regardless of who they choose to vote for.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Supportive Team
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    Work alongside Annette Johnson and the Pike2ThePolls team. We provide training, support, and appreciation for our volunteers.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Important Dates Section */}
      <section className="py-section bg-background" aria-labelledby="volunteer-dates-heading">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 id="volunteer-dates-heading" className="text-display-xl font-bold text-text-primary text-center mb-8">
              Important Dates
            </h2>

            <Card className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-caption-sm font-semibold text-primary-700 uppercase">Period</div>
                  <div className="text-heading-lg font-bold text-primary-600">Apr 25</div>
                  <div className="text-caption-sm text-primary-600">- May 3</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Early Voting
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    Volunteers needed for various shifts throughout early voting period at Pike Township Public Library
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-caption-sm font-semibold text-neutral-700 uppercase">Date</div>
                  <div className="text-heading-lg font-bold text-neutral-600">TBD</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-heading-md font-semibold text-text-primary mb-1">
                    Volunteer Training
                  </h3>
                  <p className="text-body-md text-text-secondary">
                    Mandatory training session for all volunteers. Date and time to be announced.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="badge badge-neutral">Required</span>
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
                    Biggest volunteer need of the year! Multiple shifts available throughout the day.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="badge badge-primary">High Priority</span>
                </div>
              </div>
            </Card>

            <Alert variant="info" className="mt-6">
              <p className="text-body-md">
                <strong>Training provided:</strong> All volunteers will receive training on procedures, safety protocols, and best practices for helping voters.
              </p>
            </Alert>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-section bg-neutral-50" aria-labelledby="volunteer-contact-heading">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="volunteer-contact-heading" className="text-display-xl font-bold text-text-primary mb-6">
              Questions About Volunteering?
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              We&apos;d love to hear from you and help you get involved.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <Card>
                <h3 id="volunteer-email-contact" className="text-heading-md font-semibold text-text-primary mb-4 flex items-center gap-2">
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
                <p className="text-body-sm text-text-secondary mt-2">
                  For volunteer inquiries and coordination
                </p>
              </Card>

              <Card>
                <h3 id="volunteer-phone-contact" className="text-heading-md font-semibold text-text-primary mb-4 flex items-center gap-2">
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
                <p className="text-body-sm text-text-secondary mt-2">
                  Call with questions about volunteering
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-section bg-primary-600" aria-labelledby="volunteer-cta-heading">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="volunteer-cta-heading" className="text-display-lg font-bold text-white mb-6 text-balance">
              Ready to Make a Difference?
            </h2>
            <p className="text-body-lg text-white/90 mb-8 text-balance">
              Join our team of dedicated volunteers and help ensure every voice is heard. Sign up today to get started.
            </p>
            <Link
              href="/volunteer/signup"
              className="btn bg-secondary-500 text-white px-8 py-4 text-body-lg min-h-[48px] inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200 hover:bg-secondary-600 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            >
              Sign Up to Volunteer
            </Link>
            <p className="text-body-md text-white/80 mt-6">
              Questions? <Link href="/faq" className="underline font-medium text-white hover:text-white">Check our FAQ</Link> or{' '}
              <a href="mailto:support@pike2thepolls.com" className="underline font-medium text-white hover:text-white">contact us</a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
