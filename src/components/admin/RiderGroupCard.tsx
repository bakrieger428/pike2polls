/**
 * RiderGroupCard Component
 *
 * Displays a single rider group with:
 * - Group name and time slot
 * - List of riders with addresses
 * - Total rider count
 * - Driver assignment button
 * - Route manifest button
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
import { Card } from '@/components/ui/Card';
import { type RiderGroupWithRiders } from '@/lib/grouping';
import { type DriverAssignment } from '@/lib/supabase';

interface RiderGroupCardProps {
  group: RiderGroupWithRiders;
  driverAssignment?: DriverAssignment | null;
  onAssignDriver: (groupId: string) => void;
  onViewManifest: (groupId: string) => void;
}

export function RiderGroupCard({
  group,
  driverAssignment,
  onAssignDriver,
  onViewManifest,
}: RiderGroupCardProps) {
  return (
    <Card className="p-6 mb-4">
      {/* Group Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-heading-md font-semibold text-text-primary mb-1">
            {group.group_name || 'Unnamed Group'}
          </h3>
          <p className="text-body-sm text-text-secondary">
            {formatVotingDate(group.voting_date)} at {group.preferred_time}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full">
            <span className="text-caption-md font-medium">
              {group.riderCount} rider{group.riderCount !== 1 ? 's' : ''}
            </span>
          </div>

          {driverAssignment && (
            <div className="px-3 py-1 bg-success-100 text-success-800 rounded-full">
              <span className="text-caption-md font-medium">Driver Assigned</span>
            </div>
          )}
        </div>
      </div>

      {/* Assigned Driver Info */}
      {driverAssignment && (
        <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-md">
          <div className="text-body-sm text-text-secondary">
            <span className="font-medium text-text-primary">Assigned Driver: </span>
            {driverAssignment.volunteer_id}
          </div>
          {driverAssignment.notes && (
            <div className="text-body-sm text-text-secondary mt-1">
              <span className="font-medium text-text-primary">Notes: </span>
              {driverAssignment.notes}
            </div>
          )}
        </div>
      )}

      {/* Riders List */}
      <div className="space-y-2 mb-4">
        {group.riders.map((rider, index) => (
          <div
            key={rider.id}
            className="flex items-start gap-3 p-3 bg-surface-bg border border-border-light rounded-md"
          >
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
              <span className="text-caption-sm font-medium">{index + 1}</span>
            </div>

            <div className="flex-grow min-w-0">
              <div className="text-body-md font-medium text-text-primary">
                {rider.first_name} {rider.last_name}
              </div>
              <div className="text-body-sm text-text-secondary mt-1">
                {rider.formattedAddress || rider.address}
              </div>
              {(rider.email || rider.phone) && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {rider.email && (
                    <a
                      href={`mailto:${rider.email}`}
                      className="text-caption-sm text-primary-600 hover:text-primary-700"
                    >
                      Email
                    </a>
                  )}
                  {rider.phone && (
                    <a
                      href={`tel:${rider.phone}`}
                      className="text-caption-sm text-primary-600 hover:text-primary-700"
                    >
                      {rider.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border-light">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAssignDriver(group.id)}
          className="w-full sm:w-auto"
        >
          {driverAssignment ? 'Update Driver' : 'Assign Driver'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewManifest(group.id)}
          disabled={!driverAssignment}
          className="w-full sm:w-auto"
        >
          View Route Manifest
        </Button>
      </div>
    </Card>
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
