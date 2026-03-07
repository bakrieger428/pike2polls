/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * DispatchTab Component
 *
 * Main dispatch interface for:
 * - Viewing rider groups by voting date/time
 * - Filtering groups
 * - Assigning drivers to groups
 * - Viewing route manifests
 *
 * Features:
 * - Filters for voting date and time slot
 * - Geocoding and grouping on demand
 * - Loading states
 * - Error handling
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
import { RiderGroupCard } from './RiderGroupCard';
import { DriverAssigner } from './DriverAssigner';
import { RouteManifest } from './RouteManifest';
import {
  groupRidersByProximity,
  filterGroups,
  getVotingDates,
  getPreferredTimes,
  type RiderGroupWithRiders,
} from '@/lib/grouping';
import { supabase, TABLES, type Signup, type Volunteer, type DriverAssignment } from '@/lib/supabase';

interface DispatchTabProps {
  signups: Signup[];
  volunteers: Volunteer[];
  onRefresh: () => void;
}

export function DispatchTab({ signups, volunteers, onRefresh }: DispatchTabProps) {
  const [groups, setGroups] = useState<RiderGroupWithRiders[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<RiderGroupWithRiders[]>([]);
  const [driverAssignments, setDriverAssignments] = useState<Record<string, DriverAssignment>>({});
  const [selectedVotingDate, setSelectedVotingDate] = useState<string>('all');
  const [selectedTime, setSelectedTime] = useState<string>('all');
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [_isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assigningGroupId, setAssigningGroupId] = useState<string | null>(null);
  const [viewingManifestGroupId, setViewingManifestGroupId] = useState<string | null>(null);

  // Load groups when signups change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadGroups();
  }, [signups]);

  // Load driver assignments
  useEffect(() => {
    loadDriverAssignments();
  }, []);

  // Filter groups when filters or groups change
  useEffect(() => {
    const filtered = filterGroups(groups, selectedVotingDate, selectedTime);
    setFilteredGroups(filtered);
  }, [groups, selectedVotingDate, selectedTime]);

  async function loadGroups() {
    setIsLoadingGroups(true);
    setError(null);

    try {
      // Group riders by proximity
      const riderGroups = await groupRidersByProximity(signups, 2);
      setGroups(riderGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
      console.error('Error loading groups:', err);
    } finally {
      setIsLoadingGroups(false);
    }
  }

  async function loadDriverAssignments() {
    setIsLoadingAssignments(true);

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
    } finally {
      setIsLoadingAssignments(false);
    }
  }

  function handleAssignDriver(groupId: string) {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    setAssigningGroupId(groupId);
  }

  function handleViewManifest(groupId: string) {
    setViewingManifestGroupId(groupId);
  }

  function handleDriverAssignerClose() {
    setAssigningGroupId(null);
  }

  function handleDriverAssignerSave() {
    loadDriverAssignments();
    onRefresh();
  }

  function handleRemoveAssignment(groupId: string) {
    // Refresh driver assignments after removal
    loadDriverAssignments();
    onRefresh();
  }

  const votingDates = getVotingDates(groups);
  const preferredTimes = getPreferredTimes(groups);
  const assignedGroupsCount = Object.keys(driverAssignments).length;

  return (
    <div>
      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-grow">
            <label htmlFor="voting-date-filter" className="block text-body-sm font-medium text-text-primary mb-1">
              Voting Date
            </label>
            <select
              id="voting-date-filter"
              value={selectedVotingDate}
              onChange={(e) => setSelectedVotingDate(e.target.value)}
              className="w-full px-3 py-2 border border-border-dark rounded-md text-body-md"
            >
              <option value="all">All Dates</option>
              {votingDates.map((date) => (
                <option key={date} value={date}>
                  {formatVotingDate(date)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow">
            <label htmlFor="time-filter" className="block text-body-sm font-medium text-text-primary mb-1">
              Preferred Time
            </label>
            <select
              id="time-filter"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-border-dark rounded-md text-body-md"
            >
              <option value="all">All Times</option>
              {preferredTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadGroups}
              isLoading={isLoadingGroups}
              className="w-full sm:w-auto"
            >
              Regroup
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-border-light flex flex-wrap gap-4 text-body-sm text-text-secondary">
          <div>
            <span className="font-medium text-text-primary">Total Groups: </span>
            {groups.length}
          </div>
          <div>
            <span className="font-medium text-text-primary">Assigned: </span>
            {assignedGroupsCount}
          </div>
          <div>
            <span className="font-medium text-text-primary">Unassigned: </span>
            {groups.length - assignedGroupsCount}
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-md" role="alert">
          <p className="text-body-sm text-error-800 mb-2">{error}</p>
          <Button variant="outline" size="sm" onClick={loadGroups}>
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
            This may take a moment as we geocode addresses and calculate distances
          </p>
        </Card>
      ) : filteredGroups.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-body-md text-text-secondary mb-4">
            {groups.length === 0
              ? 'No rider groups yet. Make sure signups have addresses to create groups.'
              : 'No groups match the current filter.'}
          </p>
          {signups.length === 0 && (
            <p className="text-body-sm text-text-tertiary">
              Add ride signups with addresses to get started.
            </p>
          )}
        </Card>
      ) : (
        <div>
          {filteredGroups.map((group) => (
            <RiderGroupCard
              key={group.id}
              group={group}
              volunteers={volunteers}
              driverAssignment={driverAssignments[group.id]}
              onAssignDriver={handleAssignDriver}
              onViewManifest={handleViewManifest}
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
            groups.find((g) => g.id === assigningGroupId)?.voting_date || ''
          }
          preferredTime={
            groups.find((g) => g.id === assigningGroupId)?.preferred_time || ''
          }
          currentAssignment={driverAssignments[assigningGroupId]}
          onClose={handleDriverAssignerClose}
          onSave={handleDriverAssignerSave}
        />
      )}

      {/* Route Manifest Modal */}
      {viewingManifestGroupId && (
        <RouteManifest
          group={groups.find((g) => g.id === viewingManifestGroupId)!}
          driverAssignment={driverAssignments[viewingManifestGroupId]}
          onClose={() => setViewingManifestGroupId(null)}
        />
      )}
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
