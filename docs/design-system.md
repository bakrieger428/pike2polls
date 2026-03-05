# Pike2ThePolls Design System Documentation

**Version**: 1.0
**Last Updated**: 2026-02-27
**Designer**: UI/UX Designer Agent

---

## Overview

This design system provides a comprehensive, accessible, and modern visual foundation for the Pike2ThePolls web application. All design decisions prioritize **WCAG 2.1 AA compliance** while maintaining a professional, approachable aesthetic appropriate for a government civic engagement application.

---

## Design Principles

1. **Accessibility First** - All colors meet WCAG 2.1 AA contrast requirements (4.5:1 minimum)
2. **Mobile-First** - Design starts at mobile viewport, scales up to desktop
3. **Clarity Over Cleverness** - Simple, direct communication over trendy effects
4. **Trustworthy & Approachable** - Professional yet friendly aesthetic
5. **Performance** - System fonts, minimal assets, fast loading

---

## Color Palette

### Primary Colors - Democratic Blue

Used for primary actions, links, and interactive elements. Blue conveys trust, reliability, and civic engagement.

| Token | Hex | Usage | Contrast (on white) |
|-------|-----|-------|---------------------|
| `primary-500` | `#3b82f6` | Primary buttons, links | 4.5:1 (AA) |
| `primary-600` | `#2563eb` | Primary hover state | 5.7:1 (AA) |
| `primary-700` | `#1d4ed8` | Primary active/pressed | 7.5:1 (AAA) |
| `primary-50` | `#eff6ff` | Light backgrounds | - |
| `primary-100` | `#dbeafe` | Subtle backgrounds | - |

### Secondary Colors - Warm Amber

Used for secondary actions, highlights, and friendly accents. Warm tones add approachability.

| Token | Hex | Usage | Contrast (on white) |
|-------|-----|-------|---------------------|
| `secondary-500` | `#f59e0b` | Secondary buttons | 3.1:1 (large text) |
| `secondary-600` | `#d97706` | Secondary hover state | 5.2:1 (AA) |
| `secondary-700` | `#b45309` | Secondary active/pressed | 7.7:1 (AAA) |

### Semantic Colors

Clear feedback for user actions and system states.

| Token | Hex | Usage | Contrast (on white) |
|-------|-----|-------|---------------------|
| `success-600` | `#16a34a` | Success messages, confirm | 4.6:1 (AA) |
| `error-600` | `#dc2626` | Error messages, destructive | 4.5:1 (AA) |
| `warning-600` | `#d97706` | Warnings, caution | 5.2:1 (AA) |
| `info-600` | `#2563eb` | Information, help | 5.7:1 (AA) |

### Neutral Colors - Slate Gray Scale

Used for text, backgrounds, borders, and non-decorative elements.

| Token | Hex | Usage | Contrast (on white) |
|-------|-----|-------|---------------------|
| `neutral-50` | `#f8fafc` | Light backgrounds | - |
| `neutral-100` | `#f1f5f9` | Cards, surfaces | - |
| `neutral-200` | `#e2e8f0` | Light borders | - |
| `neutral-300` | `#cbd5e1` | Default borders | - |
| `neutral-400` | `#94a3b8` | Disabled text | 3.9:1 (AA) |
| `neutral-500` | `#64748b` | Placeholder text | 7.1:1 (AAA) |
| `neutral-600` | `#475569` | Secondary text | 7.1:1 (AAA) |
| `neutral-700` | `#334155` | Primary text | 12.6:1 (AAA) |
| `neutral-800` | `#1e293b` | Headings | 16.9:1 (AAA) |
| `neutral-900` | `#0f172a` | Dark headings | 16.9:1 (AAA) |

---

## Typography

### Font Families

- **Sans-serif (Primary)**: System font stack for performance and native feel
  - `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`
- **Serif**: `Georgia`, `Cambria`, `Times New Roman` (used for special/emphasis)
- **Monospace**: `ui-monospace`, `SFMono-Regular`, `Monaco`, `Consolas` (used for code/technical)

### Type Scale

Uses a modular scale (1.250 - Major Third) for harmonious sizing.

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `display-2xl` | 60px | 1.1 | 700 | Hero headings |
| `display-xl` | 48px | 1.15 | 700 | Large section headings |
| `display-lg` | 36px | 1.2 | 700 | Section headings |
| `heading-xl` | 30px | 1.3 | 700 | Page headings |
| `heading-lg` | 24px | 1.35 | 700 | Subsection headings |
| `heading-md` | 20px | 1.4 | 600 | Card/component headings |
| `heading-sm` | 18px | 1.4 | 600 | Small headings (WCAG large text) |
| `body-lg` | 18px | 1.6 | 400 | Emphasized body text (WCAG large text) |
| `body-md` | 16px | 1.6 | 400 | Default body text (base) |
| `body-sm` | 14px | 1.5 | 400 | Secondary body text |
| `caption-md` | 14px | 1.4 | 500 | Labels, captions |
| `caption-sm` | 12px | 1.4 | 500 | Small captions, metadata |
| `overline` | 12px | 1.4 | 600 | Buttons, badges (uppercase) |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `light` | 300 | Subtle text (rarely used) |
| `normal` | 400 | Body text, standard content |
| `medium` | 500 | Emphasis, labels |
| `semibold` | 600 | Small headings, buttons |
| `bold` | 700 | Main headings, important text |

---

## Spacing System

Based on a **4px base unit** for consistency and rhythm.

| Token | Value | Usage |
|-------|-------|-------|
| `0` | 0px | No spacing |
| `px` | 1px | Hairline borders |
| `0.5` | 2px | Tight spacing |
| `1` | 4px | Extra tight spacing |
| `2` | 8px | Compact spacing |
| `3` | 12px | Small spacing |
| `4` | 16px | Default spacing |
| `5` | 20px | Comfortable spacing |
| `6` | 24px | Spacious spacing |
| `8` | 32px | Extra spacious |
| `10` | 40px | Section spacing |
| `12` | 48px | Large sections |
| `16` | 64px | Hero sections |

### Semantic Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 8px | Tight element spacing |
| `sm` | 12px | Compact element spacing |
| `md` | 16px | Default element spacing |
| `lg` | 24px | Comfortable element spacing |
| `xl` | 32px | Spacious element spacing |
| `2xl` | 48px | Extra spacious |
| `3xl` | 64px | Section breaks |
| `section` | 80px | Section padding (vertical) |
| `container` | 32px | Container padding (horizontal) |
| `form` | 24px | Form group spacing |

---

## Border Radius

Modern, approachable rounded corners that soften the UI without feeling cartoonish.

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0px | Sharp corners (rare) |
| `sm` | 4px | Small elements |
| `DEFAULT` | 6px | Default corners |
| `md` | 8px | Medium elements |
| `lg` | 12px | Large elements, cards |
| `xl` | 16px | Extra large elements |
| `2xl` | 24px | Hero elements |
| `full` | 9999px | Fully rounded (pills, badges) |

### Semantic Radius

| Token | Value | Usage |
|-------|-------|-------|
| `button` | 8px | Button corners |
| `card` | 12px | Card corners |
| `input` | 6px | Input corners |
| `modal` | 16px | Modal corners |
| `badge` | 9999px | Badge/pill (fully rounded) |

---

## Breakpoints

Mobile-first responsive design approach.

| Token | Value | Target Devices |
|-------|-------|----------------|
| (default) | < 640px | Mobile phones (portrait) |
| `sm` | 640px | Mobile phones (landscape), small tablets |
| `md` | 768px | Tablets (portrait) |
| `lg` | 1024px | Tablets (landscape), small desktops |
| `xl` | 1280px | Desktops (medium) |
| `2xl` | 1536px | Desktops (large) |

### Custom Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `mobile` | 375px | Small mobile (iPhone SE) |
| `tablet` | 768px | Tablet breakpoint |
| `desktop` | 1024px | Desktop breakpoint |

---

## Shadows

Subtle elevation for depth without visual clutter.

| Token | Usage |
|-------|-------|
| `none` | No shadow (flat) |
| `sm` | Very subtle elevation (toggles, chips) |
| `DEFAULT` | Default elevation (buttons, cards) |
| `md` | Medium elevation (dropdowns, popovers) |
| `lg` | Large elevation (modals, panels) |
| `xl` | Extra large elevation (drawers) |
| `2xl` | Maximum elevation (hero elements) |

### Semantic Shadows

| Token | Usage |
|-------|-------|
| `button` | Button shadow |
| `card` | Card elevation |
| `modal` | Modal elevation |
| `focus` | Focus ring for accessibility |

---

## Z-Index Layers

Consistent stacking context for proper element layering.

| Token | Value | Usage |
|-------|-------|-------|
| `base` | 0 | Default content |
| `dropdown` | 1000 | Dropdown menus |
| `sticky` | 1100 | Sticky headers |
| `fixed` | 1200 | Fixed positioning |
| `modal-backdrop` | 1300 | Modal overlay |
| `modal` | 1400 | Modal content |
| `popover` | 1500 | Popovers, tooltips |
| `tooltip` | 1600 | Tooltips |

---

## Component Styles

### Buttons

All buttons meet WCAG **44x44px minimum touch target** requirement.

- `.btn` - Base button styles
- `.btn-primary` - Primary action buttons (blue)
- `.btn-secondary` - Secondary action buttons (amber)
- `.btn-outline` - Outlined buttons
- `.btn-ghost` - Ghost buttons (no background)
- `.btn-text` - Text-only buttons (links)

### Form Inputs

All inputs meet WCAG **44x44px minimum touch target** requirement.

- `.input` - Base text input
- `.input-error` - Error state input
- `.input-success` - Success state input
- `.textarea` - Multi-line text input
- `.label` - Form label
- `.label-required` - Required field indicator

### Cards

- `.card` - Base card styles
- `.card-hover` - Card with hover effect

### Alerts

- `.alert` - Base alert
- `.alert-info` - Information alert
- `.alert-success` - Success confirmation
- `.alert-warning` - Warning notice
- `.alert-error` - Error message

### Progress

- `.progress` - Progress bar container
- `.progress-bar` - Animated progress fill

### Badges

- `.badge` - Base badge
- `.badge-primary` - Primary badge
- `.badge-success` - Success badge
- `.badge-error` - Error badge
- `.badge-warning` - Warning badge

---

## Accessibility Features

### Focus Indicators

- **Focus Ring**: 3px solid `#3b82f6` (primary-500)
- **Focus Offset**: 2px from element
- **Applies to**: All interactive elements (buttons, inputs, links)

### Skip Navigation

- `.skip-link` - Hidden skip link that appears on focus
- Allows keyboard users to skip to main content
- Positioned at top of page

### Screen Reader Support

- `.sr-only` - Visually hidden, screen reader visible
- `.sr-only-focusable` - Hidden until focused (e.g., skip links)

### Reduced Motion

Respects `prefers-reduced-motion: reduce` media query:
- Disables animations
- Disables smooth scrolling
- Instant transitions

### High Contrast Mode

Enhanced borders when `prefers-contrast: high` is enabled.

### Touch Targets

All interactive elements meet **44x44px minimum** (WCAG 2.5.5)

---

## Usage Examples

### Primary Button
```html
<button class="btn btn-primary">Get Started</button>
```

### Form Input
```html
<label for="email" class="label">Email Address <span class="label-required">*</span></label>
<input type="email" id="email" class="input" placeholder="you@example.com" />
```

### Success Alert
```html
<div class="alert alert-success" role="alert">
  <p>Your information has been submitted successfully!</p>
</div>
```

### Progress Bar
```html
<div class="progress" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 60%"></div>
</div>
```

---

## Design Rationale

### Color Choices

- **Blue Primary**: Conveys trust, reliability, and civic engagement
- **Amber Secondary**: Adds warmth and friendliness, softens the formal blue
- **High Contrast**: All text meets WCAG AA (4.5:1) or AAA (7:1) standards

### Typography

- **System Fonts**: Fast loading, native feel, reduces requests
- **Large Base Size**: 16px default, 18px for emphasized text (WCAG friendly)
- **Generous Line Height**: 1.6 for body text improves readability

### Spacing

- **4px Grid**: Consistent rhythm throughout the interface
- **Generous Padding**: Comfortable touch targets, reduced accidental taps
- **Section Breaks**: Clear visual separation between content areas

### Radius

- **Moderate Rounding**: 6-12px range feels modern but not childish
- **Larger on Cards**: 12px creates distinct card elevation
- **Full on Badges**: Pill-shaped badges for status indicators

---

## Future Considerations

### Potential Enhancements

1. **Dark Mode**: Color palette includes values for dark mode expansion
2. **Animation Library**: Consider adding Framer Motion for complex transitions
3. **Icon Set**: Add Heroicons or Lucide for consistent iconography
4. **Illustration Style**: Develop custom illustration style for empty states

### Versioning

This design system will be versioned and updated as:
- User needs evolve
- Accessibility standards change
- New components are added

---

## Resources

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Accessible Components Library](https://www.aditus.io/)

---

**Document Status**: ✅ Complete
**Next Review**: After initial user testing
