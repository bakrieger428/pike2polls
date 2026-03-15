'use client';

import React, { useEffect } from 'react';

interface StateInfo {
  status: 'none' | 'regulated' | 'restricted';
  color: 'success' | 'warning' | 'error' | 'muted';
  distance: number;
  programs: string;
  notes: string;
}

interface MapTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  stateName: string;
  data: StateInfo;
}

const MapTooltip: React.FC<MapTooltipProps> = ({ visible, x, y, stateName, data }) => {
  useEffect(() => {
    // Prevent tooltip from causing scroll issues
    if (visible) {
      document.body.style.overflow = '';
    }
  }, [visible]);

  if (!visible) return null;

  const getStatusLabel = () => {
    switch (data.status) {
      case 'restricted':
        return 'Restrictions';
      case 'regulated':
        return 'Regulated';
      default:
        return 'No specific restriction';
    }
  };

  const getStatusColor = () => {
    switch (data.color) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      className="map-tooltip visible"
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div
        className="tooltip-content"
        style={{
          backgroundColor: 'var(--color-surface-2, #ffffff)',
          border: '1px solid var(--color-divider, #e5e7eb)',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '280px',
          fontSize: '14px',
        }}
      >
        <h4
          style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--color-text, #111827)',
          }}
        >
          {stateName}
        </h4>

        <div
          className="tt-stat"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '13px',
          }}
        >
          <span className="tt-label" style={{ color: 'var(--color-text-muted, #6b7280)' }}>
            Avg. Distance to Poll
          </span>
          <span className="tt-value" style={{ fontWeight: '500', color: 'var(--color-text, #111827)' }}>
            {data.distance} mi
          </span>
        </div>

        <div
          className="tt-stat"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '13px',
          }}
        >
          <span className="tt-label" style={{ color: 'var(--color-text-muted, #6b7280)' }}>
            Legal Status
          </span>
          <span
            className="tt-value"
            style={{
              fontWeight: '500',
              color: getStatusColor(),
            }}
          >
            {getStatusLabel()}
          </span>
        </div>

        <div
          className="tt-stat"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '6px',
            fontSize: '13px',
          }}
        >
          <span className="tt-label" style={{ color: 'var(--color-text-muted, #6b7280)' }}>
            Active Programs
          </span>
          <span
            className="tt-value"
            style={{
              fontWeight: '500',
              color: 'var(--color-text, #111827)',
              textAlign: 'right',
              maxWidth: '180px',
            }}
          >
            {data.programs}
          </span>
        </div>

        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: 'var(--color-text-muted, #6b7280)',
            lineHeight: '1.4',
          }}
        >
          {data.notes}
        </div>
      </div>
    </div>
  );
};

export default MapTooltip;
