/**
 * TimeSlotGroup Component
 *
 * Displays all location groups for a specific time slot on a voting day.
 *
 * Shows:
 * - Time slot header (e.g., "9:00 AM")
 * - Summary of riders and groups in this time slot
 * - List of location groups (riders at same address)
 *
 * WCAG 2.1 AA compliant with:
 * - Semantic HTML
 * - Proper heading hierarchy
 * - Keyboard navigation
 * - Color contrast 4.5:1 minimum
 */

import React from 'react';
import { type TimeSlotGroup as TimeSlotGroupType } from '@/lib/grouping-location';
import { LocationGroupCard } from './LocationGroupCard';
import { type DriverAssignment, type Volunteer } from '@/lib/supabase';

interface TimeSlotGroupProps {
  timeSlot: TimeSlotGroupType;
  volunteers: Volunteer[];
  driverAssignments: Record<string, DriverAssignment>;
  onAssignDriver: (groupId: string) => void;
  onViewDriverManifest: (driverId: string, votingDate: string) => void;
  onRemoveAssignment: (groupId: string) => void;
}

export function TimeSlotGroup({
  timeSlot,
  volunteers,
  driverAssignments,
  onAssignDriver,
  onViewDriverManifest,
  onRemoveAssignment,
}: TimeSlotGroupProps) {
  return (
    <div className="mb-6">
      {/* Time Slot Header */}
      <div className="mb-3 pb-2 border-b border-border-light">
        <h4 className="text-heading-sm font-semibold text-text-primary">
          {timeSlot.preferredTime}
        </h4>
        <p className="text-body-sm text-text-secondary">
          {timeSlot.totalGroups} location group{timeSlot.totalGroups !== 1 ? 's' : ''} •
          {' '}
          {timeSlot.totalRiders} rider{timeSlot.totalRiders !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Location Groups */}
      {timeSlot.locationGroups.length === 0 ? (
        <div className="p-4 bg-surface-bg border border-border-light rounded-md text-center">
          <p className="text-body-sm text-text-secondary">
            No riders grouped for this time slot
          </p>
        </div>
      ) : (
        <div>
          {timeSlot.locationGroups.map((group) => (
            <LocationGroupCard
              key={group.id}
              group={group}
              volunteers={volunteers}
              driverAssignment={driverAssignments[group.id]}
              onAssignDriver={onAssignDriver}
              onViewDriverManifest={onViewDriverManifest}
              onRemoveAssignment={onRemoveAssignment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
