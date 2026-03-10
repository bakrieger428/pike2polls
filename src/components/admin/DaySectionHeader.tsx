/**
 * DaySectionHeader Component
 *
 * Collapsible header for a voting day section.
 *
 * Shows:
 * - Day display name (e.g., "Early Voting Day 1")
 * - Voting location address
 * - Summary statistics (total riders, total groups)
 * - Expand/collapse toggle button
 *
 * WCAG 2.1 AA compliant with:
 * - Semantic HTML
 * - Proper ARIA attributes for expand/collapse
 * - Keyboard navigation
 * - Color contrast 4.5:1 minimum
 * - Touch targets 44x44px minimum
 */

import React from 'react';
import { type DaySection as DaySectionType } from '@/lib/grouping-location';

interface DaySectionHeaderProps {
  day: DaySectionType;
  onToggle: () => void;
}

export function DaySectionHeader({ day, onToggle }: DaySectionHeaderProps) {
  return (
    <div className="mb-4">
      {/* Day Header - Clickable to toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-white border border-border-light rounded-md hover:bg-surface-bg transition-colors"
        aria-expanded={day.isExpanded}
        aria-controls={`day-section-${day.votingDate}`}
      >
        <div className="flex items-center gap-3">
          {/* Expand/Collapse Icon */}
          <span
            className="text-primary-600 transition-transform duration-200"
            aria-hidden="true"
            style={{
              transform: day.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            ▶
          </span>

          <div className="text-left">
            <h3 className="text-heading-md font-semibold text-text-primary">
              {day.displayName}
            </h3>
            <p className="text-body-sm text-text-secondary">
              {day.votingLocation.shortName}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-body-sm font-medium text-text-primary">
              {day.totalGroups} group{day.totalGroups !== 1 ? 's' : ''}
            </div>
            <div className="text-body-sm text-text-secondary">
              {day.totalRiders} rider{day.totalRiders !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </button>

      {/* Voting Location Address (visible when collapsed) */}
      {!day.isExpanded && (
        <div className="mt-2 pl-12 pr-4">
          <div className="text-body-sm text-text-tertiary flex items-start gap-2">
            <span aria-hidden="true">📍</span>
            <span>{day.votingLocation.address}</span>
          </div>
        </div>
      )}
    </div>
  );
}
