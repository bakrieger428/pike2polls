# Interactive Components

React/TypeScript implementations of interactive data visualization components for the Pike2ThePolls application.

## Components

### USStateMap
D3.js-powered interactive map of the United States showing voter transportation programs by state.

**Features:**
- D3.js geoAlbersUsa projection
- TopoJSON state boundaries
- Color-coded legal status (success/warning/error/muted)
- Interactive hover and click handlers
- Responsive design with auto-resize
- Dark mode support via CSS variables

**Usage:**
```tsx
import { USStateMap } from '@/components/interactive';

<USStateMap onStateClick={(stateName, data) => console.log(stateName, data)} />
```

### MapTooltip
Floating tooltip component for displaying state information on hover.

**Features:**
- Fixed positioning following cursor
- Dynamic color coding
- Structured data display
- Scroll prevention

**Usage:**
```tsx
import { MapTooltip } from '@/components/interactive';

<MapTooltip
  visible={tooltip.visible}
  x={tooltip.x}
  y={tooltip.y}
  stateName={tooltip.stateName}
  data={tooltip.data}
/>
```

### ElectionSimulator
Real-time election impact calculator with 7 input parameters and preset scenarios.

**Features:**
- 7 interactive sliders
- 6 election presets (Georgia 2021/2022, Michigan 2018, etc.)
- Real-time calculations
- Visual bar chart
- Verdict system (flipped/widened/narrowed/shift)
- Responsive grid layout

**Usage:**
```tsx
import { ElectionSimulator } from '@/components/interactive';

<ElectionSimulator />
```

## Installation

Dependencies required:
```bash
npm install d3 topojson-client
```

## Development

### File Structure
```
interactive/
├── USStateMap.tsx       # D3.js map component
├── MapTooltip.tsx       # Tooltip component
├── ElectionSimulator.tsx # Simulator component
├── index.ts             # Export barrel
└── README.md            # This file
```

### Key Technologies
- React 19 with hooks (useState, useEffect, useRef)
- TypeScript strict mode
- D3.js v7 for map projection and rendering
- TopoJSON for US state boundaries
- CSS variables for theming

### State Data (USStateMap)
All 50 states + DC with:
- Legal status (none/regulated/restricted)
- Color coding
- Average distance to polls
- Active programs
- Historical notes

### Simulator Parameters
1. Eligible voters (100K - 20M)
2. Base turnout rate (30% - 90%)
3. No-car voters (5% - 30%)
4. Program reach (5% - 80%)
5. Conversion rate (20% - 95%)
6. Partisan lean (40% - 90% Dem)
7. Original margin (-500K to +500K)

### Calculation Logic
```
noCarVoters = eligible × (noCarPct / 100)
baseNoCarTurnout = baseTurnout × (36 / 66)  // 30-point gap
servedVoters = noCarVoters × (programReach / 100)
additionalVoters = servedVoters × (conversion / 100) ×
                   (baseTurnout - baseNoCarTurnout)
netShift = (additionalVoters × DemShare) -
           (additionalVoters × RepShare)
adjustedMargin = origMargin + netShift
```

## Styling

Components use CSS variables from the main application:

```css
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
```

## Accessibility

- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast meets WCAG 2.1 AA
- Touch targets minimum 44x44px

## Performance

- Debounced map resize (300ms)
- CDN-cached TopoJSON data
- Efficient React state management
- CSS transitions for smooth animations
- Memoized calculations in simulator

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Required features:
- ES2020+ (async/await, optional chaining)
- CSS Custom Properties
- SVG support
- Fetch API

## Testing

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import { USStateMap } from '@/components/interactive';

test('renders map container', () => {
  render(<USStateMap />);
  const map = screen.getByRole('img', { name: /interactive map/i });
  expect(map).toBeInTheDocument();
});
```

## Documentation

See `docs/INTERACTIVE_COMPONENTS.md` for complete implementation details, API documentation, and usage examples.

## Contributing

When modifying interactive components:
1. Test with keyboard navigation
2. Verify color contrast ratios
3. Check responsive behavior (375px - 1920px)
4. Validate TypeScript strict mode
5. Test dark mode switching
6. Profile performance with React DevTools

## License

Part of the Pike2ThePolls project. Same license terms as the main application.
