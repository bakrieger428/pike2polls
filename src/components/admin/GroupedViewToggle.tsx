/**
 * GroupedViewToggle Component
 *
 * Toggle button for switching between list and grouped views
 * on the Ride Signups tab.
 *
 * WCAG 2.1 AA compliant with:
 * - Proper button semantics
 * - ARIA pressed state
 * - Keyboard navigation
 * - Touch target 44x44px minimum
 */

import React from 'react';

interface GroupedViewToggleProps {
  isGrouped: boolean;
  onToggle: (isGrouped: boolean) => void;
  groupCount?: number;
}

export function GroupedViewToggle({ isGrouped, onToggle, groupCount }: GroupedViewToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!isGrouped)}
      aria-pressed={isGrouped}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors
        min-h-[44px] touch-manipulation
        ${
          isGrouped
            ? 'bg-primary-600 text-white'
            : 'bg-neutral-100 text-text-secondary hover:bg-neutral-200'
        }
      `}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {isGrouped ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        )}
      </svg>

      <span>
        {isGrouped ? 'List View' : 'Grouped View'}
        {groupCount !== undefined && !isGrouped && ` (${groupCount})`}
      </span>
    </button>
  );
}
