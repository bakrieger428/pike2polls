/**
 * DaySection Component
 *
 * Collapsible section for a voting day containing all time slots.
 *
 * Shows:
 * - Collapsible header with day name and voting location
 * - Drivers assigned for this day with "View Route Manifest" buttons
 * - All time slots for this day (when expanded)
 * - Location groups within each time slot
 *
 * Default state: Collapsed (user preference)
 *
 * WCAG 2.1 AA compliant with:
 * - Semantic HTML
 * - Proper ARIA attributes for expand/collapse
 * - Keyboard navigation
 * - Color contrast 4.5:1 minimum
 * - Touch targets 44x44px minimum
 */

import React, { useState } from 'react';
import { type DaySection as DaySectionType } from '@/lib/grouping-location';
import { DaySectionHeader } from './DaySectionHeader';
import { TimeSlotGroup } from './TimeSlotGroup';
import { Button } from '@/components/ui/Button';
import { type DriverAssignment, type Volunteer } from '@/lib/supabase';

interface DaySectionProps {
  day: DaySectionType;
  volunteers: Volunteer[];
  driverAssignments: Record<string, DriverAssignment>;
  onAssignDriver: (groupId: string) => void;
  onViewDriverManifest: (driverId: string, votingDate: string) => void;
  onRemoveAssignment: (groupId: string) => void;
}

export function DaySection({
  day,
  volunteers,
  driverAssignments,
  onAssignDriver,
  onViewDriverManifest,
  onRemoveAssignment,
}: DaySectionProps) {
  // Local state for expand/collapse
  const [isExpanded, setIsExpanded] = useState(day.isExpanded);

  function handleToggle() {
    setIsExpanded(!isExpanded);
  }

  // Get unique drivers assigned to this day
  const assignedDriverIds = Array.from(
    new Set(
      Object.values(driverAssignments)
        .filter(assignment => day.timeSlots.some(slot =>
          slot.locationGroups.some(group => group.id === assignment.group_id)
        ))
        .map(assignment => assignment.volunteer_id)
    )
  );

  return (
    <div className="mb-6">
      <DaySectionHeader
        day={{ ...day, isExpanded }}
        onToggle={handleToggle}
      />

      {/* Collapsible Content */}
      {isExpanded && (
        <div
          id={`day-section-${day.votingDate}`}
          className="pl-4 pr-2"
          role="region"
          aria-labelledby={`day-header-${day.votingDate}`}
        >
          {/* Voting Location Detail */}
          <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-md">
            <div className="text-body-sm text-text-secondary">
              <span className="font-medium text-text-primary">Voting Location: </span>
              {day.votingLocation.name}
            </div>
            <div className="text-body-sm text-text-secondary">
              <span className="font-medium text-text-primary">Address: </span>
              {day.votingLocation.address}
            </div>
          </div>

          {/* Drivers Assigned to This Day */}
          {assignedDriverIds.length > 0 && (
            <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-md">
              <h4 className="text-heading-sm font-medium text-text-primary mb-2">
                Drivers Assigned for {day.displayName}
              </h4>
              <div className="space-y-2">
                {assignedDriverIds.map(driverId => {
                  const driver = volunteers.find(v => v.id === driverId);
                  if (!driver) return null;

                  const timeBlockCount = day.timeSlots.filter(slot =>
                    slot.locationGroups.some(group =>
                      driverAssignments[group.id]?.volunteer_id === driverId
                    )
                  ).length;

                  return (
                    <div
                      key={driverId}
                      className="flex items-center justify-between p-2 bg-white border border-success-200 rounded-md"
                    >
                      <div className="text-body-sm text-text-secondary">
                        <span className="font-medium text-text-primary">
                          {driver.first_name} {driver.last_name}
                        </span>
                        <span className="text-text-tertiary ml-2">
                          ({timeBlockCount} time block{timeBlockCount !== 1 ? 's' : ''})
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDriverManifest(driverId, day.votingDate)}
                      >
                        View Route Manifest
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Time Slots */}
          {day.timeSlots.length === 0 ? (
            <div className="p-4 bg-surface-bg border border-border-light rounded-md text-center">
              <p className="text-body-sm text-text-secondary">
                No riders scheduled for {day.displayName.toLowerCase()}
              </p>
            </div>
          ) : (
            <div>
              {day.timeSlots.map((timeSlot) => (
                <TimeSlotGroup
                  key={timeSlot.preferredTime}
                  timeSlot={timeSlot}
                  volunteers={volunteers}
                  driverAssignments={driverAssignments}
                  onAssignDriver={onAssignDriver}
                  onViewDriverManifest={onViewDriverManifest}
                  onRemoveAssignment={onRemoveAssignment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
