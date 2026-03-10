/**
 * DispatchTab Component (Refactored)
 *
 * Main dispatch interface for:
 * - Viewing rider groups by voting day → time slot → address
 * - Assigning drivers to location groups
 * - Viewing route manifests with time-based schedules
 *
 * NEW hierarchical organization:
 * - DaySection (collapsible, one per voting day)
 *   ├── TimeSlotGroup (one per time slot)
 *     └── LocationGroupCard (riders at same address)
 *
 * Features:
 * - Hierarchical organization (no more filters)
 * - Collapsible day sections (collapsed by default)
 * - Location-based grouping (same address = same group)
 * - Time-based route manifests with voting locations
 * - Enhanced driver assignment
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
import { Card } from '@/components/ui/Card';
import { DaySection } from './DaySection';
import { DriverAssigner } from './DriverAssigner';
import { DriverRouteManifest } from './DriverRouteManifest';
import { groupRidersByLocation, type DaySection as DaySectionType, type LocationGroup } from '@/lib/grouping-location';
import { calculateDriverSchedule, getVotingLocationCoords } from '@/lib/routing';
import { supabase, TABLES, type Signup, type Volunteer, type DriverAssignment } from '@/lib/supabase';

interface DispatchTabProps {
  signups: Signup[];
  volunteers: Volunteer[];
  onRefresh: () => void;
}

export function DispatchTab({ signups, volunteers, onRefresh }: DispatchTabProps) {
  const [daySections, setDaySections] = useState<DaySectionType[]>([]);
  const [locationGroupsMap, setLocationGroupsMap] = useState<Record<string, LocationGroup>>({});
  const [driverAssignments, setDriverAssignments] = useState<Record<string, DriverAssignment>>({});
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assigningGroupId, setAssigningGroupId] = useState<string | null>(null);
  const [viewingDriverManifest, setViewingDriverManifest] = useState<{
    driverId: string;
    votingDate: string;
  } | null>(null);
  const [driverSchedule, setDriverSchedule] = useState<any>(null);

  // Load location groups when signups change
  useEffect(() => {
    loadLocationGroups();
  }, [signups]);

  // Load driver assignments
  useEffect(() => {
    loadDriverAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLocationGroups() {
    setIsLoadingGroups(true);
    setError(null);

    try {
      // Group riders by location (voting day → time slot → address)
      const sections = await groupRidersByLocation(signups);
      setDaySections(sections);

      // Build a map of all location groups for easy lookup
      const groupsMap: Record<string, LocationGroup> = {};
      for (const section of sections) {
        for (const timeSlot of section.timeSlots) {
          for (const group of timeSlot.locationGroups) {
            groupsMap[group.id] = group;
          }
        }
      }
      setLocationGroupsMap(groupsMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
      console.error('Error loading groups:', err);
    } finally {
      setIsLoadingGroups(false);
    }
  }

  async function loadDriverAssignments() {
    try {
      const { data, error } = await supabase
        .from(TABLES.DRIVER_ASSIGNMENTS)
        .select('*');

      if (error) throw error;

      // Create a map of group_id -> assignment
      const assignmentMap: Record<string, DriverAssignment> = {};
      for (const assignment of data || []) {
        assignmentMap[assignment.group_id] = assignment;
      }

      setDriverAssignments(assignmentMap);
    } catch (err) {
      console.error('Error loading driver assignments:', err);
    }
  }

  function handleAssignDriver(_groupId: string) {
    setAssigningGroupId(_groupId);
  }

  async function handleViewDriverManifest(driverId: string, votingDate: string) {
    setViewingDriverManifest({ driverId, votingDate });

    try {
      // Get all location groups for this driver on this voting day
      const allGroupsForDriver = Object.values(locationGroupsMap).filter(
        group => group.votingDate === votingDate && driverAssignments[group.id]?.volunteer_id === driverId
      );

      // Get voting location coordinates
      const votingLocationCoords = await getVotingLocationCoords(votingDate);

      // Calculate driver schedule
      const schedule = await calculateDriverSchedule(
        driverId,
        votingDate,
        allGroupsForDriver,
        votingLocationCoords
      );

      setDriverSchedule(schedule);
    } catch (err) {
      console.error('Error loading driver schedule:', err);
    }
  }

  function handleDriverAssignerClose() {
    setAssigningGroupId(null);
  }

  function handleDriverAssignerSave() {
    loadDriverAssignments();
    onRefresh();
  }

  function handleRemoveAssignment(_groupId: string) {
    // Refresh driver assignments after removal
    loadDriverAssignments();
    onRefresh();
  }

  function handleDriverManifestClose() {
    setViewingDriverManifest(null);
    setDriverSchedule(null);
  }

  // Calculate overall statistics
  const totalGroups = Object.values(locationGroupsMap).length;
  const totalRiders = Object.values(locationGroupsMap).reduce((sum, group) => sum + group.riderCount, 0);
  const assignedGroupsCount = Object.keys(driverAssignments).length;

  return (
    <div>
      {/* Stats Card */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-grow">
            <h2 className="text-heading-md font-semibold text-text-primary mb-1">
              Rider Dispatch
            </h2>
            <p className="text-body-sm text-text-secondary">
              Organize riders by voting day, time, and location
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadLocationGroups}
              isLoading={isLoadingGroups}
            >
              Regroup
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-border-light flex flex-wrap gap-4 text-body-sm text-text-secondary">
          <div>
            <span className="font-medium text-text-primary">Total Days: </span>
            {daySections.length}
          </div>
          <div>
            <span className="font-medium text-text-primary">Total Riders: </span>
            {totalRiders}
          </div>
          <div>
            <span className="font-medium text-text-primary">Total Groups: </span>
            {totalGroups}
          </div>
          <div>
            <span className="font-medium text-text-primary">Assigned: </span>
            {assignedGroupsCount}
          </div>
          <div>
            <span className="font-medium text-text-primary">Unassigned: </span>
            {totalGroups - assignedGroupsCount}
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-md" role="alert">
          <p className="text-body-sm text-error-800 mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={loadLocationGroups}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading */}
      {isLoadingGroups ? (
        <Card className="p-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
          <p className="text-body-md text-text-secondary">Creating rider groups...</p>
          <p className="text-body-sm text-text-tertiary mt-2">
            This may take a moment as we geocode addresses and organize by location
          </p>
        </Card>
      ) : daySections.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-body-md text-text-secondary mb-4">
            No rider groups yet.
          </p>
          <p className="text-body-sm text-text-tertiary">
            Add ride signups with addresses to get started.
          </p>
        </Card>
      ) : (
        <div>
          {/* Day Sections */}
          {daySections.map((day) => (
            <DaySection
              key={day.votingDate}
              day={day}
              volunteers={volunteers}
              driverAssignments={driverAssignments}
              onAssignDriver={handleAssignDriver}
              onViewDriverManifest={handleViewDriverManifest}
              onRemoveAssignment={handleRemoveAssignment}
            />
          ))}
        </div>
      )}

      {/* Driver Assigner Modal */}
      {assigningGroupId && (
        <DriverAssigner
          groupId={assigningGroupId}
          votingDate={
            locationGroupsMap[assigningGroupId]?.votingDate || ''
          }
          preferredTime={
            locationGroupsMap[assigningGroupId]?.preferredTime || ''
          }
          currentAssignment={driverAssignments[assigningGroupId]}
          onClose={handleDriverAssignerClose}
          onSave={handleDriverAssignerSave}
        />
      )}

      {/* Driver Route Manifest Modal */}
      {viewingDriverManifest && driverSchedule && (
        <DriverRouteManifest
          schedule={driverSchedule}
          driverAssignment={driverAssignments[Object.keys(locationGroupsMap).find(
            groupId => driverAssignments[groupId]?.volunteer_id === viewingDriverManifest.driverId && locationGroupsMap[groupId].votingDate === viewingDriverManifest.votingDate
          )!]!}
          volunteer={volunteers.find(v => v.id === viewingDriverManifest.driverId)!}
          onClose={handleDriverManifestClose}
        />
      )}
    </div>
  );
}
