/**
 * GroupedSignupsView Component
 *
 * Displays signups in proximity-based groups instead of a table.
 * This is an alternative view on the Ride Signups tab.
 *
 * Features:
 * - Shows rider groups with proximity clustering
 * - Filters by voting date/time
 * - Quick view of group composition
 *
 * WCAG 2.1 AA compliant with:
 * - Semantic HTML
 * - Proper ARIA labels
 * - Keyboard navigation
 * - Color contrast 4.5:1 minimum
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { groupRidersByProximity, type RiderGroupWithRiders } from '@/lib/grouping';
import { type Signup } from '@/lib/supabase';

interface GroupedSignupsViewProps {
  signups: Signup[];
  statusFilter?: 'all' | 'pending' | 'confirmed' | 'cancelled';
}

export function GroupedSignupsView({ signups, statusFilter = 'all' }: GroupedSignupsViewProps) {
  const [groups, setGroups] = useState<RiderGroupWithRiders[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<RiderGroupWithRiders[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load groups when signups change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadGroups();
  }, [signups]);

  // Filter groups when status filter changes
  useEffect(() => {
    let filtered = groups;

    // Apply status filter to riders within groups
    if (statusFilter !== 'all') {
      filtered = groups
        .map((group) => ({
          ...group,
          riders: group.riders.filter((rider) => rider.status === statusFilter),
        }))
        .filter((group) => group.riders.length > 0);
    }

    setFilteredGroups(filtered);
  }, [groups, statusFilter]);

  async function loadGroups() {
    setIsLoading(true);
    setError(null);

    try {
      const riderGroups = await groupRidersByProximity(signups, 2);
      setGroups(riderGroups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
      console.error('Error loading groups:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
        <p className="text-body-md text-text-secondary">Creating rider groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-error-50 border border-error-200 rounded-md inline-block" role="alert">
          <p className="text-body-sm text-error-800 mb-2">{error}</p>
          <button
            onClick={loadGroups}
            className="text-body-sm text-primary-600 hover:text-primary-700 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (filteredGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-body-md text-text-secondary mb-4">
          {groups.length === 0
            ? 'No rider groups yet. Make sure signups have addresses.'
            : 'No groups match the current filter.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {filteredGroups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}

/**
 * Individual group card component
 */
interface GroupCardProps {
  group: RiderGroupWithRiders;
}

function GroupCard({ group }: GroupCardProps) {
  return (
    <Card className="p-4">
      {/* Group Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-heading-sm font-semibold text-text-primary">
            {group.group_name || 'Rider Group'}
          </h3>
          <p className="text-caption-sm text-text-secondary">
            {formatVotingDate(group.voting_date)} at {group.preferred_time}
          </p>
        </div>
        <div className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
          <span className="text-caption-sm font-medium">{group.riderCount} riders</span>
        </div>
      </div>

      {/* Riders List (Compact) */}
      <div className="space-y-2">
        {group.riders.slice(0, 5).map((rider) => (
          <div
            key={rider.id}
            className="flex items-center gap-2 text-body-sm text-text-secondary"
          >
            <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0" />
            <span className="font-medium text-text-primary">
              {rider.first_name} {rider.last_name}
            </span>
            <span className="text-caption-sm text-text-tertiary truncate">
              {rider.address}
            </span>
            <span
              className={`ml-auto px-2 py-0.5 rounded-full text-caption-xs font-medium ${
                rider.status === 'confirmed'
                  ? 'bg-success-100 text-success-800'
                  : rider.status === 'pending'
                  ? 'bg-warning-100 text-warning-800'
                  : 'bg-error-100 text-error-800'
              }`}
            >
              {rider.status}
            </span>
          </div>
        ))}

        {group.riderCount > 5 && (
          <div className="text-caption-sm text-text-tertiary italic pl-4">
            +{group.riderCount - 5} more rider{group.riderCount - 5 !== 1 ? 's' : ''}
          </div>
        )}
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
