/**
 * RouteManifest Component (Enhanced)
 *
 * Displays enhanced route manifest with:
 * - Driver information and vehicle details
 * - Voting location and drop-off time
 * - Scheduled pickup times (45-min buffer before voting)
 * - Pickup order with addresses and contact info
 * - Actual driving distances and times from Mapbox
 * - Export to PDF/print functionality
 * - Mobile-friendly for drivers on election day
 *
 * NEW features:
 * - Shows voting location as final destination
 * - Time-based schedule (pickup times working backward)
 * - Actual driving times from Mapbox Directions API
 * - Guaranteed arrival at polling place by voting time
 *
 * WCAG 2.1 AA compliant with:
 * - Semantic HTML
 * - Proper ARIA labels
 * - Keyboard navigation
 * - Color contrast 4.5:1 minimum
 * - Touch targets 44x44px minimum
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { type LocationGroup } from '@/lib/grouping-location';
import { calculateRoute, exportRouteAsText, type RouteManifest as RouteManifestType } from '@/lib/routing';
import { type DriverAssignment, type Volunteer, supabase, TABLES } from '@/lib/supabase';

interface RouteManifestProps {
  group: LocationGroup;
  driverAssignment?: DriverAssignment | null;
  onClose: () => void;
}

export function RouteManifest({ group, driverAssignment, onClose }: RouteManifestProps) {
  const [driver, setDriver] = useState<Volunteer | null>(null);
  const [isLoadingDriver, setIsLoadingDriver] = useState(false);
  const [routeManifest, setRouteManifest] = useState<RouteManifestType | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Load driver details
  useEffect(() => {
    if (driverAssignment?.volunteer_id) {
      loadDriver();
    }
  }, [driverAssignment]);

  // Calculate route
  useEffect(() => {
    calculateRouteForGroup();
  }, [group]);

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

  async function calculateRouteForGroup() {
    setIsLoadingRoute(true);
    setRouteError(null);

    try {
      const manifest = await calculateRoute(group);
      setRouteManifest(manifest);
    } catch (err) {
      console.error('Error calculating route:', err);
      setRouteError(err instanceof Error ? err.message : 'Failed to calculate route');
    } finally {
      setIsLoadingRoute(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleExportText() {
    if (!routeManifest) return;

    const text = exportRouteAsText(routeManifest);

    // Create blob and download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `route-manifest-${group.votingDate}-${group.preferredTime}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          {/* Route Error */}
          {routeError && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-md" role="alert">
              <p className="text-body-sm text-error-800">{routeError}</p>
            </div>
          )}

          {/* Route Loading */}
          {isLoadingRoute ? (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
              <p className="text-body-md text-text-secondary">Calculating optimal route...</p>
            </div>
          ) : routeManifest ? (
            <>
              {/* Voting Location */}
              <div className="mb-6 pb-6 border-b border-border-light">
                <h3 className="text-heading-md font-semibold text-text-primary mb-2">
                  {formatVotingDate(group.votingDate)} - {group.preferredTime}
                </h3>
                <div className="grid grid-cols-1 gap-2 text-body-sm text-text-secondary">
                  <div>
                    <span className="font-medium text-text-primary">Voting Location: </span>
                    {routeManifest.votingLocation.name}
                  </div>
                  <div>
                    <span className="font-medium text-text-primary">Address: </span>
                    {routeManifest.votingLocation.address}
                  </div>
                  <div>
                    <span className="font-medium text-text-primary">Drop-off Time: </span>
                    {routeManifest.dropOffTime}
                  </div>
                  <div>
                    <span className="font-medium text-text-primary">Total Riders: </span>
                    {group.riderCount}
                  </div>
                  <div>
                    <span className="font-medium text-text-primary">Total Distance: </span>
                    ~{routeManifest.totalDistance.toFixed(1)} miles
                  </div>
                  <div>
                    <span className="font-medium text-text-primary">Est. Drive Time: </span>
                    ~{routeManifest.totalDriveTime} minutes
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

              {/* Pickup Schedule */}
              <div className="mb-6">
                <h3 className="text-heading-md font-semibold text-text-primary mb-3">
                  Pickup Schedule
                </h3>

                {routeManifest.stops.length === 0 ? (
                  <p className="text-body-sm text-text-secondary">No riders in this group</p>
                ) : (
                  <div className="space-y-3">
                    {routeManifest.stops.map((stop: { rider: { id: string; first_name: string; last_name: string; formattedAddress: string; email?: string; phone?: string }; order: number; distanceFromPrevious: number; driveTimeFromPrevious: number; scheduledPickupTime: string }) => (
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
                              ~{stop.distanceFromPrevious.toFixed(1)} miles ({stop.driveTimeFromPrevious} min) from previous
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Final Drop-off */}
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
                            {routeManifest.dropOffTime}
                          </div>
                        </div>

                        <div className="text-body-sm text-text-secondary mt-1">
                          {routeManifest.votingLocation.name}
                        </div>

                        <div className="text-body-sm text-text-secondary mt-1">
                          {routeManifest.votingLocation.address}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes for Driver */}
              <div className="p-4 bg-surface-bg border border-border-light rounded-md">
                <h4 className="text-heading-sm font-medium text-text-primary mb-2">
                  Driver Instructions
                </h4>
                <ul className="list-disc list-inside text-body-sm text-text-secondary space-y-1">
                  <li>Arrive at first pickup by {routeManifest.firstPickupTime}</li>
                  <li>Call rider if not present within 5 minutes of scheduled time</li>
                  <li>Ensure all riders are safely seated before driving</li>
                  <li>Follow traffic laws and drive safely</li>
                  <li>Contact dispatch if any issues arise</li>
                  <li>All riders must be at polling place by {routeManifest.dropOffTime}</li>
                </ul>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-border-light px-6 py-4 flex flex-col sm:flex-row gap-2 justify-end print:hidden">
          <Button variant="outline" onClick={handleExportText} disabled={!routeManifest}>
            Export Text
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={!routeManifest}>
            🖨️ Print
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
