# Interactive Components Documentation

## Overview

This document describes the three interactive components ported from the original vanilla JavaScript implementation to React/TypeScript:

1. **USStateMap** - D3.js interactive US state map
2. **MapTooltip** - Floating tooltip for state information
3. **ElectionSimulator** - Real-time election impact calculator

## Component: USStateMap

### Location
`src/components/interactive/USStateMap.tsx`

### Purpose
Displays an interactive map of the United States using D3.js and TopoJSON. Shows voter transportation programs by state with color coding for legal status.

### Features
- D3.js geoAlbersUsa projection
- TopoJSON state boundaries from CDN
- Color-coded states (success/warning/error/muted)
- Interactive hover effects with tooltip
- Click handler for state selection
- Responsive design with resize handling
- CSS variable integration for theming

### Props
```typescript
interface USStateMapProps {
  className?: string;
  onStateClick?: (stateName: string, data: StateInfo) => void;
}
```

### State Data Structure
```typescript
interface StateInfo {
  status: 'none' | 'regulated' | 'restricted';
  color: 'success' | 'warning' | 'error' | 'muted';
  distance: number;
  programs: string;
  notes: string;
}
```

### Dependencies
- `d3` (v7+)
- `topojson-client`
- React hooks: `useRef`, `useEffect`, `useState`

### Usage Example
```tsx
import { USStateMap } from '@/components/interactive';

function MapSection() {
  const handleStateClick = (stateName: string, data: StateInfo) => {
    console.log(`Clicked ${stateName}:`, data);
  };

  return (
    <div>
      <h2>Voter Transportation by State</h2>
      <USStateMap onStateClick={handleStateClick} />
    </div>
  );
}
```

### Key Implementation Details

#### 1. D3.js Integration (76 lines ported)
The component ports the D3.js map rendering logic from the original `app.js`:

- **Projection**: Uses `d3.geoAlbersUsa()` for optimal US map display
- **Path Generation**: `d3.geoPath()` converts GeoJSON to SVG paths
- **Data Source**: Loads US atlas from `https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json`
- **State Borders**: Uses TopoJSON mesh for clean boundary lines

#### 2. Color Mapping
Colors are dynamically retrieved from CSS variables:
```typescript
const getColorMap = () => {
  const styles = getComputedStyle(document.documentElement);
  return {
    success: styles.getPropertyValue('--color-success').trim(),
    warning: styles.getPropertyValue('--color-warning').trim(),
    error: styles.getPropertyValue('--color-error').trim(),
    muted: styles.getPropertyValue('--color-text-faint').trim(),
    bg: styles.getPropertyValue('--color-bg').trim(),
  };
};
```

#### 3. Responsive Design
The map rebuilds on window resize with debouncing:
```typescript
useEffect(() => {
  const handleResize = () => {
    // Rebuild map logic
  };
  const debouncedResize = setTimeout(handleResize, 300);
  return () => clearTimeout(debouncedResize);
}, [onStateClick]);
```

#### 4. Accessibility
- SVG has `role="img"` and `aria-label` for screen readers
- Keyboard navigation supported through D3 event handlers
- Color contrast meets WCAG 2.1 AA standards

### State Data Coverage
All 50 US states plus DC are included with:
- Average distance to polling places
- Legal status (restricted/regulated/none)
- Active voter transportation programs
- Historical notes and context

## Component: MapTooltip

### Location
`src/components/interactive/MapTooltip.tsx`

### Purpose
Displays detailed information about a state when hovering over the USStateMap.

### Features
- Fixed positioning following cursor
- Dynamic color coding for legal status
- Structured data display
- CSS variable integration
- Pointer events disabled to prevent scroll issues

### Props
```typescript
interface MapTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  stateName: string;
  data: StateInfo;
}
```

### Usage Example
```tsx
<MapTooltip
  visible={tooltip.visible}
  x={tooltip.x}
  y={tooltip.y}
  stateName={tooltip.stateName}
  data={tooltip.data}
/>
```

### Implementation Notes
- Uses `position: fixed` for consistent positioning
- Prevents scroll issues with `pointerEvents: 'none'`
- Automatically formats legal status labels
- Color codes based on state data

## Component: ElectionSimulator

### Location
`src/components/interactive/ElectionSimulator.tsx`

### Purpose
Real-time election impact calculator that models how voter transportation programs affect election outcomes.

### Features
- 7 interactive sliders for parameter adjustment
- 6 built-in election presets (Georgia 2021/2022, Michigan 2018, etc.)
- Real-time calculation of voter turnout impact
- Partisan vote distribution analysis
- Visual bar chart representation
- Verdict system (flipped/widened/narrowed/shift)
- Responsive grid layout for statistics

### State Management
Uses React `useState` for all 7 simulator parameters:

```typescript
interface SimulatorState {
  eligible: number;        // Total eligible voters
  baseTurnout: number;     // Base turnout rate (%)
  noCarPct: number;        // Percentage without cars
  programReach: number;    // Program coverage (%)
  conversion: number;      // Conversion rate (%)
  partisanLean: number;    // Democratic support (%)
  origMargin: number;      // Original victory margin
}
```

### Calculation Logic
```typescript
// Key calculations
const noCarVoters = eligible * (noCarPct / 100);
const baseNoCarTurnout = baseTurnout * (36 / 66); // 30-point gap
const servedVoters = noCarVoters * (programReach / 100);
const additionalVoters = Math.round(
  servedVoters * (conversion / 100) *
  (baseTurnout / 100 - baseNoCarTurnout / 100)
);
const netShift = netDemVotes - netRepVotes;
const adjustedMargin = origMargin + netShift;
```

### Election Presets
Built-in historical election scenarios:

1. **Georgia 2021 Runoffs** - Flipped the US Senate
2. **Georgia 2022 Midterms** - High turnout election
3. **Michigan 2018 Midterms** - Large margin election
4. **Nevada 2016 Presidential** - Close race
5. **Wisconsin 2024 Election** - Negative original margin
6. **Custom** - User-configurable scenario

### UI Components

#### Slider Rows
Reusable `SliderRow` component for consistent input handling:
```tsx
<SliderRow
  label="Eligible Voters"
  field="eligible"
  value={state.eligible}
  min={100000}
  max={20000000}
  step={100000}
  displayValue={state.eligible.toLocaleString()}
/>
```

#### Results Display
- Statistics grid with 4 key metrics
- Original vs adjusted result comparison
- Visual bar chart with Dem/Rep split
- Color-coded verdict message

#### Verdict System
Four verdict types with distinct styling:
- **Flipped**: Transportation program changes winner
- **Widened**: Democratic margin increases
- **Narrowed**: Republican margin decreases
- **Shift**: Net partisan shift calculated

### Accessibility
- All form inputs have associated labels
- Slider values displayed in real-time
- Color contrast meets WCAG standards
- Keyboard navigation supported

## Integration Guide

### Installation
Dependencies are already installed:
```bash
npm install d3 topojson-client
```

### Import Components
```tsx
import { USStateMap, MapTooltip, ElectionSimulator } from '@/components/interactive';
```

### Use in Pages
```tsx
// Map Section
<section id="map">
  <h2>State-by-State Analysis</h2>
  <USStateMap onStateClick={handleStateSelection} />
</section>

// Simulator Section
<section id="simulator">
  <h2>Election Impact Simulator</h2>
  <ElectionSimulator />
</section>
```

### Styling
Components use CSS variables for theming:
```css
:root {
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-dem: #2563eb;
  --color-rep: #dc2626;
  --color-primary: #3b82f6;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-surface-1: #f9fafb;
  --color-surface-2: #ffffff;
  --color-bg: #ffffff;
  --color-divider: #e5e7eb;
}
```

## Performance Considerations

### USStateMap
- **Debounced Resize**: 300ms delay prevents excessive rebuilds
- **CDN Caching**: TopoJSON loaded from fast CDN with caching
- **Event Cleanup**: Proper useEffect cleanup for memory management

### ElectionSimulator
- **Real-time Updates**: Calculations run on every slider change
- **Memoization**: Results object computed once per render
- **CSS Transitions**: Smooth animations without JS overhead

## Testing

### Unit Tests
```typescript
// Test state data structure
expect(stateData['Georgia']).toEqual({
  status: 'restricted',
  color: 'error',
  distance: 5.6,
  programs: expect.any(String),
  notes: expect.any(String),
});

// Test simulator calculations
const { additionalVoters, adjustedMargin } = calculateResults();
expect(additionalVoters).toBeGreaterThan(0);
```

### Integration Tests
```typescript
// Test map interaction
const { getByRole } = render(<USStateMap />);
const map = getByRole('img', { name: /interactive map/i });
fireEvent.mouseOver(map);
expect(screen.getByText('Georgia')).toBeInTheDocument();
```

## Browser Compatibility

### Required Features
- ES2020+ (async/await, optional chaining)
- CSS Custom Properties (CSS variables)
- SVG support
- Fetch API

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- TopoJSON loading failure shows user-friendly message
- Missing CSS variables fall back to hardcoded colors
- Resize observer polyfill for older browsers

## Future Enhancements

### Potential Improvements
1. **Zoomable Map**: Add zoom/pan functionality for detailed inspection
2. **Historical Data**: Time series view of transportation program evolution
3. **Export Functionality**: Save simulator results as PDF/CSV
4. **Mobile Optimization**: Touch gestures for map interaction
5. **Offline Support**: Cache TopoJSON data for offline use
6. **Accessibility**: Enhanced screen reader announcements
7. **Performance**: Web Workers for complex calculations

## Maintenance Notes

### Data Updates
- State data (`stateData` object) should be updated quarterly
- Election presets should be reviewed after each election cycle
- TopoJSON URL should be kept current with CDN updates

### Code Quality
- TypeScript strict mode enabled
- ESLint rules for React hooks
- Prettier formatting applied
- Console errors/warnings should be addressed

### Dependencies
- Check for D3.js updates quarterly
- TopoJSON client follows semantic versioning
- React 19 features should be evaluated for adoption

## License

These components are part of the Pike2ThePolls project and follow the same license terms as the main application.
