/**
 * RouteManifest Component
 *
 * Displays route manifest with:
 * - Driver information and vehicle details
 * - Pickup order with addresses and contact info
 * - Export to PDF/print functionality
 * - Mobile-friendly for drivers on election day
 *
 * WCAG 2.1 AA compliant with:
 * - Semantic HTML
 * - Proper ARIA labels
 * - Keyboard navigation
 * - Color contrast 4.5:1 minimum
 * - Touch targets 44x44px minimum
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { type RiderGroupWithRiders } from '@/lib/grouping';
import { calculatePickupOrder } from '@/lib/grouping';
import { type DriverAssignment, type Volunteer, supabase, TABLES } from '@/lib/supabase';

interface RouteManifestProps {
  group: RiderGroupWithRiders;
  driverAssignment?: DriverAssignment | null;
  onClose: () => void;
}

export function RouteManifest({ group, driverAssignment, onClose }: RouteManifestProps) {
  const [driver, setDriver] = useState<Volunteer | null>(null);
  const [isLoadingDriver, setIsLoadingDriver] = useState(false);

  // Load driver details
  React.useEffect(() => {
    if (driverAssignment?.volunteer_id) {
      loadDriver();
    }
  }, [driverAssignment]);

  async function loadDriver() {
    if (!driverAssignment?.volunteer_id) return;

    setIsLoadingDriver(true);
    try {
      const { data, error } = await supabase
        .from(TABLES.VOLUNTEERS)
        .select('*')
        .eq('id', driverAssignment.volunteer_id)
        .single();

      if (error) throw error;
      setDriver(data);
    } catch (err) {
      console.error('Error loading driver:', err);
    } finally {
      setIsLoadingDriver(false);
    }
  }

  const pickupOrder = calculatePickupOrder(group);
  const totalDistance = pickupOrder.reduce((sum, stop) => sum + stop.distanceFromPrevious, 0);

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="route-manifest-title"
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border-light px-6 py-4 print:hidden">
          <div className="flex items-center justify-between">
            <h2 id="route-manifest-title" className="text-heading-lg font-semibold text-text-primary">
              Route Manifest
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
          {/* Group Info */}
          <div className="mb-6 pb-6 border-b border-border-light">
            <h3 className="text-heading-md font-semibold text-text-primary mb-2">
              {group.group_name || 'Rider Group'}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-body-sm text-text-secondary">
              <div>
                <span className="font-medium text-text-primary">Date: </span>
                {formatVotingDate(group.voting_date)}
              </div>
              <div>
                <span className="font-medium text-text-primary">Time: </span>
                {group.preferred_time}
              </div>
              <div>
                <span className="font-medium text-text-primary">Riders: </span>
                {group.riderCount}
              </div>
              <div>
                <span className="font-medium text-text-primary">Total Distance: </span>
                ~{totalDistance.toFixed(1)} miles
              </div>
            </div>
          </div>

          {/* Driver Info */}
          {driverAssignment && (
            <div className="mb-6 pb-6 border-b border-border-light">
              <h3 className="text-heading-md font-semibold text-text-primary mb-3">
                Driver Information
              </h3>

              {isLoadingDriver ? (
                <p className="text-body-sm text-text-secondary">Loading driver information...</p>
              ) : driver ? (
                <div className="space-y-2 text-body-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium text-text-primary">Name: </span>
                      {driver.first_name} {driver.last_name}
                    </div>
                    <div>
                      <span className="font-medium text-text-primary">Status: </span>
                      <span className="inline-flex px-2 py-1 rounded-full text-caption-md font-medium bg-success-100 text-success-800 ml-1">
                        {driverAssignment.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium text-text-primary">Email: </span>
                      <a href={`mailto:${driver.email}`} className="text-primary-600 hover:text-primary-700 print:no-underline">
                        {driver.email}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium text-text-primary">Phone: </span>
                      <a href={`tel:${driver.phone}`} className="text-primary-600 hover:text-primary-700 print:no-underline">
                        {driver.phone}
                      </a>
                    </div>
                  </div>

                  {driver.vehicle_make_model && (
                    <div>
                      <span className="font-medium text-text-primary">Vehicle: </span>
                      {driver.vehicle_make_model}
                    </div>
                  )}

                  {driver.number_of_seats && (
                    <div>
                      <span className="font-medium text-text-primary">Seats: </span>
                      {driver.number_of_seats}
                    </div>
                  )}

                  {driver.license_plate && (
                    <div>
                      <span className="font-medium text-text-primary">License Plate: </span>
                      {driver.license_plate}
                    </div>
                  )}

                  {driverAssignment.notes && (
                    <div className="mt-2 p-2 bg-surface-bg border border-border-light rounded">
                      <span className="font-medium text-text-primary">Notes: </span>
                      {driverAssignment.notes}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-body-sm text-text-secondary">Unable to load driver information</p>
              )}
            </div>
          )}

          {/* Pickup Order */}
          <div className="mb-6">
            <h3 className="text-heading-md font-semibold text-text-primary mb-3">
              Pickup Order
            </h3>

            {pickupOrder.length === 0 ? (
              <p className="text-body-sm text-text-secondary">No riders in this group</p>
            ) : (
              <div className="space-y-3">
                {pickupOrder.map((stop, _index) => (
                  <div
                    key={stop.rider.id}
                    className="flex items-start gap-3 p-3 border border-border-light rounded-md"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                        {stop.order}
                      </div>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="text-body-md font-medium text-text-primary">
                        {stop.rider.first_name} {stop.rider.last_name}
                      </div>
                      <div className="text-body-sm text-text-secondary mt-1">
                        {stop.rider.formattedAddress || stop.rider.address}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {stop.rider.email && (
                          <a
                            href={`mailto:${stop.rider.email}`}
                            className="text-caption-sm text-primary-600 hover:text-primary-700 print:no-underline"
                          >
                            {stop.rider.email}
                          </a>
                        )}
                        {stop.rider.phone && (
                          <a
                            href={`tel:${stop.rider.phone}`}
                            className="text-caption-sm text-primary-600 hover:text-primary-700 print:no-underline"
                          >
                            {stop.rider.phone}
                          </a>
                        )}
                      </div>
                      {stop.distanceFromPrevious > 0 && (
                        <div className="text-caption-sm text-text-tertiary mt-1">
                          ~{stop.distanceFromPrevious.toFixed(1)} miles from previous stop
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes for Driver */}
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
