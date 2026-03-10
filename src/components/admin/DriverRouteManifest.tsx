/**
 * DriverRouteManifest Component
 *
 * Displays complete driver schedule for a voting day with multi-block routing.
 *
 * Shows:
 * - All time blocks assigned to driver on this voting day
 * - Pickup route for each time block
 * - Transition times between blocks (polling place to next pickup)
 * - Feasibility warnings if schedule is impossible
 * - Driver information and vehicle details
 * - Export to PDF/print functionality
 *
 * WCAG 2.1 AA compliant with:
 * - Semantic HTML
 * - Proper ARIA labels
 * - Keyboard navigation
 * - Color contrast 4.5:1 minimum
 * - Touch targets 44x44px minimum
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { type DriverSchedule } from '@/lib/routing';
import { type DriverAssignment, type Volunteer } from '@/lib/supabase';

interface DriverRouteManifestProps {
  schedule: DriverSchedule;
  driverAssignment: DriverAssignment;
  volunteer: Volunteer;
  onClose: () => void;
}

export function DriverRouteManifest({
  schedule,
  driverAssignment,
  volunteer,
  onClose,
}: DriverRouteManifestProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="driver-manifest-title"
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border-light px-6 py-4 print:hidden">
          <div className="flex items-center justify-between">
            <h2 id="driver-manifest-title" className="text-heading-lg font-semibold text-text-primary">
              Driver Route Manifest
            </h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Printable Header */}
        <div className="px-6 py-4 hidden print:block">
          <h1 className="text-2xl font-bold text-center mb-1">Pike2ThePolls</h1>
          <p className="text-center text-sm text-gray-600 mb-4">Driver Route Manifest</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Driver Information */}
          <div className="mb-6 pb-6 border-b border-border-light">
            <h3 className="text-heading-md font-semibold text-text-primary mb-3">
              Driver Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-body-sm">
              <div>
                <span className="font-medium text-text-primary">Name: </span>
                {volunteer.first_name} {volunteer.last_name}
              </div>
              <div>
                <span className="font-medium text-text-primary">Status: </span>
                <span className="inline-flex px-2 py-1 rounded-full text-caption-md font-medium bg-success-100 text-success-800 ml-1">
                  {driverAssignment.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-text-primary">Email: </span>
                <a href={`mailto:${volunteer.email}`} className="text-primary-600 hover:text-primary-700 print:no-underline">
                  {volunteer.email}
                </a>
              </div>
              <div>
                <span className="font-medium text-text-primary">Phone: </span>
                <a href={`tel:${volunteer.phone}`} className="text-primary-600 hover:text-primary-700 print:no-underline">
                  {volunteer.phone}
                </a>
              </div>
              {volunteer.vehicle_make_model && (
                <div>
                  <span className="font-medium text-text-primary">Vehicle: </span>
                  {volunteer.vehicle_make_model}
                </div>
              )}
              {volunteer.number_of_seats && (
                <div>
                  <span className="font-medium text-text-primary">Seats: </span>
                  {volunteer.number_of_seats}
                </div>
              )}
              {volunteer.license_plate && (
                <div>
                  <span className="font-medium text-text-primary">License Plate: </span>
                  {volunteer.license_plate}
                </div>
              )}
            </div>

            {driverAssignment.notes && (
              <div className="mt-3 p-3 bg-surface-bg border border-border-light rounded-md">
                <span className="font-medium text-text-primary">Notes: </span>
                {driverAssignment.notes}
              </div>
            )}
          </div>

          {/* Schedule Overview */}
          <div className="mb-6 pb-6 border-b border-border-light">
            <h3 className="text-heading-md font-semibold text-text-primary mb-3">
              {formatVotingDate(schedule.votingDate)} Schedule
            </h3>

            <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-md">
              <div className="text-body-sm text-text-secondary">
                <span className="font-medium text-text-primary">Voting Location: </span>
                {schedule.votingLocation.name}
              </div>
              <div className="text-body-sm text-text-secondary">
                <span className="font-medium text-text-primary">Address: </span>
                {schedule.votingLocation.address}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-body-sm">
                <div>
                  <span className="font-medium text-text-primary">Time Blocks: </span>
                  {schedule.timeBlocks.length}
                </div>
                <div>
                  <span className="font-medium text-text-primary">Total Riders: </span>
                  {schedule.totalRiders}
                </div>
                <div>
                  <span className="font-medium text-text-primary">Total Groups: </span>
                  {schedule.totalGroups}
                </div>
                <div>
                  <span className="font-medium text-text-primary">Schedule: </span>
                  {schedule.isFeasible ? (
                    <span className="text-success-700 font-medium">✓ Feasible</span>
                  ) : (
                    <span className="text-error-700 font-medium">✗ Impossible</span>
                  )}
                </div>
              </div>
            </div>

            {/* Warnings */}
            {schedule.warnings.length > 0 && (
              <div className="space-y-2">
                {schedule.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-md ${
                      warning.includes('IMPOSSIBLE')
                        ? 'bg-error-50 border-error-200 text-error-800'
                        : 'bg-warning-50 border-warning-200 text-warning-800'
                    }`}
                    role="alert"
                  >
                    <p className="text-body-sm">{warning}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Block Routes */}
          <div className="mb-6">
            <h3 className="text-heading-md font-semibold text-text-primary mb-3">
              Pickup Schedule
            </h3>

            {schedule.timeBlocks.length === 0 ? (
              <div className="p-4 bg-surface-bg border border-border-light rounded-md text-center">
                <p className="text-body-sm text-text-secondary">
                  No riders assigned to this driver for this voting day
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {schedule.timeBlocks.map((blockRoute, blockIndex) => (
                  <div key={blockIndex} className="border border-border-light rounded-md overflow-hidden">
                    {/* Time Block Header */}
                    <div className="bg-primary-50 px-4 py-3 border-b border-primary-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-heading-md font-semibold text-text-primary">
                          {blockRoute.timeBlock.preferredTime} Block
                        </h4>
                        <div className="text-body-sm text-text-secondary">
                          {blockRoute.route.stops.length} pickup{blockRoute.route.stops.length !== 1 ? 's' : ''} •
                          {' '}
                          {blockRoute.route.totalDistance.toFixed(1)} miles •
                          {' '}
                          {blockRoute.route.totalDriveTime} min drive
                        </div>
                      </div>
                    </div>

                    {/* Pickup Stops */}
                    <div className="p-4 space-y-3">
                      {blockRoute.route.stops.map((stop, stopIndex) => (
                        <div
                          key={stopIndex}
                          className="flex items-start gap-3 p-3 bg-surface-bg border border-border-light rounded-md"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                              {stopIndex + 1}
                            </div>
                          </div>

                          <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="text-body-md font-medium text-text-primary">
                                {stop.rider.first_name} {stop.rider.last_name}
                              </div>
                              <div className="text-body-md font-semibold text-primary-600 ml-2 flex-shrink-0">
                                {stop.scheduledPickupTime}
                              </div>
                            </div>

                            <div className="text-body-sm text-text-secondary mt-1">
                              {stop.rider.formattedAddress}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-1">
                              {stop.rider.email && (
                                <a
                                  href={`mailto:${stop.rider.email}`}
                                  className="text-caption-sm text-primary-600 hover:text-primary-700"
                                >
                                  {stop.rider.email}
                                </a>
                              )}
                              {stop.rider.phone && (
                                <a
                                  href={`tel:${stop.rider.phone}`}
                                  className="text-caption-sm text-primary-600 hover:text-primary-700"
                                >
                                  {stop.rider.phone}
                                </a>
                              )}
                            </div>

                            {stop.distanceFromPrevious > 0 && (
                              <div className="text-caption-sm text-text-tertiary mt-1">
                                ~{stop.distanceFromPrevious.toFixed(1)} miles ({stop.driveTimeFromPrevious} min) from previous
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Drop-off at Polling Place */}
                      <div className="flex items-start gap-3 p-3 bg-success-50 border border-success-200 rounded-md">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-success-600 text-white rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="text-body-md font-medium text-text-primary">
                              Drop-off at Polling Place
                            </div>
                            <div className="text-body-md font-semibold text-success-700 ml-2 flex-shrink-0">
                              {blockRoute.dropOffTime}
                            </div>
                          </div>

                          <div className="text-body-sm text-text-secondary mt-1">
                            {schedule.votingLocation.name}
                          </div>

                          <div className="text-body-sm text-text-secondary mt-1">
                            {schedule.votingLocation.address}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transition to Next Block */}
                    {blockIndex < schedule.timeBlocks.length - 1 && (
                      <div className="px-4 py-3 bg-surface-bg border-t border-border-light">
                        <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                          <span aria-hidden="true">⬇️</span>
                          <span>
                            Transition to {schedule.timeBlocks[blockIndex + 1].timeBlock.preferredTime} block
                          </span>
                        </div>
                        <div className="text-body-sm text-text-tertiary mt-1">
          Travel from polling place to next pickup location
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions for Driver */}
          <div className="p-4 bg-surface-bg border border-border-light rounded-md">
            <h4 className="text-heading-sm font-medium text-text-primary mb-2">
              Driver Instructions
            </h4>
            <ul className="list-disc list-inside text-body-sm text-text-secondary space-y-1">
              <li>Arrive at first pickup location 10 minutes before scheduled time</li>
              <li>Call rider if not present within 5 minutes of scheduled time</li>
              <li>Ensure all riders are safely seated before driving</li>
              <li>Follow traffic laws and drive safely</li>
              <li>Contact dispatch if any issues arise</li>
              <li>All riders must be at polling place by their scheduled voting time</li>
              {schedule.timeBlocks.length > 1 && (
                <li>You have {schedule.timeBlocks.length} time blocks - plan your transitions carefully</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-border-light px-6 py-4 flex flex-col sm:flex-row gap-2 justify-end print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            🖨️ Print Manifest
          </Button>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Format voting date for display
 */
function formatVotingDate(votingDate: string): string {
  switch (votingDate) {
    case 'early-voting-date-1':
      return 'Early Voting Day 1';
    case 'early-voting-date-2':
      return 'Early Voting Day 2';
    case 'election-day':
      return 'Election Day';
    default:
      return votingDate;
  }
}
