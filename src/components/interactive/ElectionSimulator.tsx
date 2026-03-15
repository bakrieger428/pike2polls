'use client';

import React, { useState, useEffect } from 'react';

interface ElectionSimulatorProps {
  className?: string;
}

interface SimulatorState {
  eligible: number;
  baseTurnout: number;
  noCarPct: number;
  programReach: number;
  conversion: number;
  partisanLean: number;
  origMargin: number;
}

interface ElectionPreset {
  eligible: number;
  baseTurnout: number;
  noCarPct: number;
  programReach: number;
  conversion: number;
  partisanLean: number;
  origMargin: number;
}

const electionPresets: Record<string, ElectionPreset> = {
  ga2021: {
    eligible: 7500000,
    baseTurnout: 60,
    noCarPct: 14,
    programReach: 35,
    conversion: 70,
    partisanLean: 68,
    origMargin: 55000,
  },
  ga2022: {
    eligible: 7700000,
    baseTurnout: 55,
    noCarPct: 14,
    programReach: 30,
    conversion: 65,
    partisanLean: 66,
    origMargin: 35000,
  },
  mi2018: {
    eligible: 7200000,
    baseTurnout: 58,
    noCarPct: 12,
    programReach: 20,
    conversion: 60,
    partisanLean: 62,
    origMargin: 405000,
  },
  nv2016: {
    eligible: 1900000,
    baseTurnout: 57,
    noCarPct: 10,
    programReach: 25,
    conversion: 65,
    partisanLean: 60,
    origMargin: 26000,
  },
  wi2024: {
    eligible: 4300000,
    baseTurnout: 72,
    noCarPct: 11,
    programReach: 40,
    conversion: 70,
    partisanLean: 64,
    origMargin: -30000,
  },
  custom: {
    eligible: 5000000,
    baseTurnout: 55,
    noCarPct: 12,
    programReach: 30,
    conversion: 65,
    partisanLean: 65,
    origMargin: 55000,
  },
};

const ElectionSimulator: React.FC<ElectionSimulatorProps> = ({ className = '' }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [state, setState] = useState<SimulatorState>(electionPresets.custom);

  useEffect(() => {
    if (selectedPreset && electionPresets[selectedPreset]) {
      setState(electionPresets[selectedPreset]);
    }
  }, [selectedPreset]);

  const updateField = (field: keyof SimulatorState, value: number) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  // Calculate results
  const calculateResults = () => {
    const {
      eligible,
      baseTurnout,
      noCarPct,
      programReach,
      conversion,
      partisanLean,
      origMargin,
    } = state;

    const noCarVoters = eligible * (noCarPct / 100);
    const baseNoCarTurnout = baseTurnout * (36 / 66);
    const servedVoters = noCarVoters * (programReach / 100);
    const additionalVoters = Math.round(
      servedVoters * (conversion / 100) * (baseTurnout / 100 - baseNoCarTurnout / 100)
    );
    const newTotalVoters = Math.round(eligible * (baseTurnout / 100)) + additionalVoters;
    const newTurnout = ((newTotalVoters / eligible) * 100).toFixed(1);

    const demShare = partisanLean / 100;
    const repShare = 1 - demShare;
    const netDemVotes = Math.round(additionalVoters * demShare);
    const netRepVotes = Math.round(additionalVoters * repShare);
    const netShift = netDemVotes - netRepVotes;
    const adjustedMargin = origMargin + netShift;

    const origWinner = origMargin >= 0 ? 'D' : 'R';
    const adjWinner = adjustedMargin >= 0 ? 'D' : 'R';

    let verdict: { type: 'flipped' | 'widened' | 'narrowed' | 'shift'; text: string };
    if (origWinner !== adjWinner) {
      verdict = {
        type: 'flipped',
        text: `The transportation program flips the result. Original: ${origWinner === 'D' ? 'Democratic' : 'Republican'} win → New: ${adjWinner === 'D' ? 'Democratic' : 'Republican'} win`,
      };
    } else if (Math.abs(adjustedMargin) > Math.abs(origMargin) && origWinner === 'D') {
      verdict = {
        type: 'widened',
        text: `Democratic margin widens by ${netShift.toLocaleString()} votes due to transportation program`,
      };
    } else if (Math.abs(adjustedMargin) < Math.abs(origMargin) && origWinner === 'R') {
      verdict = {
        type: 'narrowed',
        text: `Republican margin narrows by ${Math.abs(netShift).toLocaleString()} votes due to transportation program`,
      };
    } else {
      verdict = {
        type: 'shift',
        text: `Net shift of ${netShift >= 0 ? '+' : ''}${netShift.toLocaleString()} votes toward Democrats from the transportation program`,
      };
    }

    // Bar visualization
    const totalVotesApprox = newTotalVoters;
    const adjDemPct = 50 + (adjustedMargin / totalVotesApprox) * 50;
    const clampedDem = Math.max(15, Math.min(85, adjDemPct));
    const clampedRep = 100 - clampedDem;

    return {
      additionalVoters,
      newTurnout,
      netDemVotes,
      netRepVotes,
      origMargin,
      adjustedMargin,
      verdict,
      clampedDem,
      clampedRep,
    };
  };

  const results = calculateResults();

  const SliderRow: React.FC<{
    label: string;
    field: keyof SimulatorState;
    value: number;
    min: number;
    max: number;
    step: number;
    suffix?: string;
    displayValue?: string;
  }> = ({ label, field, value, min, max, step, suffix = '', displayValue }) => (
    <div className="sim-slider-row" style={{ marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontSize: '13px',
        }}
      >
        <label
          htmlFor={`sim${field}`}
          style={{
            color: 'var(--color-text, #111827)',
            fontWeight: '500',
          }}
        >
          {label}
        </label>
        <span
          id={`sim${field}Val`}
          style={{
            color: 'var(--color-text-muted, #6b7280)',
            fontWeight: '500',
          }}
        >
          {displayValue !== undefined ? displayValue : `${value.toLocaleString()}${suffix}`}
        </span>
      </div>
      <input
        type="range"
        id={`sim${field}`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => updateField(field, parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: 'var(--color-divider, #e5e7eb)',
          outline: 'none',
          WebkitAppearance: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  );

  return (
    <div className={`election-simulator ${className}`}>
      <div
        className="sim-controls"
        style={{
          backgroundColor: 'var(--color-surface-2, #ffffff)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--color-divider, #e5e7eb)',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="simElection"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text, #111827)',
            }}
          >
            Election Preset
          </label>
          <select
            id="simElection"
            value={selectedPreset}
            onChange={e => setSelectedPreset(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-divider, #e5e7eb)',
              backgroundColor: 'var(--color-surface-1, #ffffff)',
              fontSize: '14px',
              color: 'var(--color-text, #111827)',
            }}
          >
            <option value="custom">Custom Election</option>
            <option value="ga2021">Georgia 2021 Runoffs</option>
            <option value="ga2022">Georgia 2022 Midterms</option>
            <option value="mi2018">Michigan 2018 Midterms</option>
            <option value="nv2016">Nevada 2016 Presidential</option>
            <option value="wi2024">Wisconsin 2024 Election</option>
          </select>
        </div>

        <SliderRow
          label="Eligible Voters"
          field="eligible"
          value={state.eligible}
          min={100000}
          max={20000000}
          step={100000}
          displayValue={state.eligible.toLocaleString()}
        />
        <SliderRow
          label="Base Turnout Rate"
          field="baseTurnout"
          value={state.baseTurnout}
          min={30}
          max={90}
          step={1}
          suffix="%"
        />
        <SliderRow
          label="No-Car Voters"
          field="noCarPct"
          value={state.noCarPct}
          min={5}
          max={30}
          step={1}
          suffix="%"
        />
        <SliderRow
          label="Program Reach"
          field="programReach"
          value={state.programReach}
          min={5}
          max={80}
          step={1}
          suffix="%"
        />
        <SliderRow
          label="Conversion Rate"
          field="conversion"
          value={state.conversion}
          min={20}
          max={95}
          step={1}
          suffix="%"
        />
        <SliderRow
          label="Partisan Lean (Dem)"
          field="partisanLean"
          value={state.partisanLean}
          min={40}
          max={90}
          step={1}
          suffix="%"
          displayValue={`${state.partisanLean}% Dem`}
        />
        <SliderRow
          label="Original Margin"
          field="origMargin"
          value={state.origMargin}
          min={-500000}
          max={500000}
          step={5000}
          displayValue={`${state.origMargin >= 0 ? '+' : ''}${state.origMargin.toLocaleString()}`}
        />
      </div>

      <div
        className="sim-results"
        style={{
          marginTop: '20px',
          backgroundColor: 'var(--color-surface-2, #ffffff)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--color-divider, #e5e7eb)',
        }}
      >
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--color-text, #111827)',
          }}
        >
          Impact Results
        </h3>

        <div
          className="sim-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div
            className="sim-stat-card"
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-surface-1, #f9fafb)',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted, #6b7280)', marginBottom: '4px' }}>
              Additional Voters
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary, #3b82f6)' }}>
              +{results.additionalVoters.toLocaleString()}
            </div>
          </div>

          <div
            className="sim-stat-card"
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-surface-1, #f9fafb)',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted, #6b7280)', marginBottom: '4px' }}>
              New Turnout Rate
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary, #3b82f6)' }}>
              {results.newTurnout}%
            </div>
          </div>

          <div
            className="sim-stat-card"
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-surface-1, #f9fafb)',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted, #6b7280)', marginBottom: '4px' }}>
              Net Dem Votes
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-dem, #2563eb)' }}>
              +{results.netDemVotes.toLocaleString()}
            </div>
          </div>

          <div
            className="sim-stat-card"
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-surface-1, #f9fafb)',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted, #6b7280)', marginBottom: '4px' }}>
              Net Rep Votes
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-rep, #dc2626)' }}>
              +{results.netRepVotes.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '14px',
            }}
          >
            <span style={{ color: 'var(--color-text-muted, #6b7280)' }}>Original Result</span>
            <span
              style={{
                fontWeight: '600',
                color: results.origMargin >= 0 ? 'var(--color-dem, #2563eb)' : 'var(--color-rep, #dc2626)',
              }}
            >
              {results.origMargin >= 0 ? 'D+' : 'R+'}
              {Math.abs(results.origMargin).toLocaleString()}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '14px',
            }}
          >
            <span style={{ color: 'var(--color-text-muted, #6b7280)' }}>Adjusted Result</span>
            <span
              style={{
                fontWeight: '600',
                color: results.adjustedMargin >= 0 ? 'var(--color-dem, #2563eb)' : 'var(--color-rep, #dc2626)',
              }}
            >
              {results.adjustedMargin >= 0 ? 'D+' : 'R+'}
              {Math.abs(results.adjustedMargin).toLocaleString()}
            </span>
          </div>
        </div>

        <div
          className="sim-bar-container"
          style={{
            display: 'flex',
            height: '32px',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            id="simBarDem"
            className="sim-bar-dem"
            style={{
              width: `${results.clampedDem}%`,
              backgroundColor: 'var(--color-dem, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'width 0.3s ease',
            }}
          >
            Dem
          </div>
          <div
            id="simBarRep"
            className="sim-bar-rep"
            style={{
              width: `${results.clampedRep}%`,
              backgroundColor: 'var(--color-rep, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'width 0.3s ease',
            }}
          >
            Rep
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            fontSize: '13px',
            color: 'var(--color-text-muted, #6b7280)',
          }}
        >
          <span>{results.clampedDem.toFixed(1)}%</span>
          <span>{results.clampedRep.toFixed(1)}%</span>
        </div>

        <div
          className={`sim-verdict ${results.verdict.type}`}
          style={{
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.5',
            backgroundColor:
              results.verdict.type === 'flipped'
                ? 'var(--color-accent, #8b5cf6)'
                : results.verdict.type === 'widened'
                ? 'var(--color-success, #10b981)'
                : 'var(--color-warning, #f59e0b)',
            color: 'white',
            fontWeight: '500',
          }}
        >
          {results.verdict.text}
        </div>
      </div>
    </div>
  );
};

export default ElectionSimulator;
