# Home Tab Special Layout

**Status**: ✅ Implemented  
**Date**: October 8, 2025  
**Affects**: HMI-UI Home tab rendering

## Overview

The Home tab has a **special layout** that differs from regular tabs. Instead of stacking sections vertically, the Home tab supports:

- **1 section**: Full-width layout (fills entire content area)
- **2 sections**: Side-by-side layout (50/50 split)

This design maximizes screen real estate and provides a dashboard-like experience on the home screen.

## Implementation

### HomeLayout Component

**Location**: `/packages/hmi-ui/src/components/HomeLayout.tsx`

**Logic**:

```tsx
function HomeLayout({ sections }) {
  if (sections.length === 0) {
    return <EmptyState />;
  }

  if (sections.length === 1) {
    // Full width
    return <Section section={sections[0]} />;
  }

  // 2 sections: side-by-side
  return (
    <div className="gcg-home-layout--dual">
      <Section section={sections[0]} />
      <Section section={sections[1]} />
    </div>
  );
}
```

### CSS Grid Layout

**Location**: `/packages/hmi-ui/src/styles/grid.css`

#### Default (Large displays)

```css
.gcg-home-layout--dual {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 50/50 split */
  gap: 1.5rem;
}
```

#### Serv 10 (1084x606)

```css
.gcg-home-layout--dual {
  gap: 1.25rem; /* Smaller gap */
}
```

#### Serv 7 (958x489)

```css
.gcg-home-layout--dual {
  grid-template-columns: 1fr; /* Single column */
  grid-template-rows: 1fr 1fr; /* Two rows */
  gap: 1rem;
}
```

**Note**: On Serv 7, two sections stack vertically due to limited horizontal space.

## Visual Layout

### Single Section (Full Width)

```
┌────────────────────────────────────────┐
│ Quick Controls                         │
├────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│ │Tog1│ │Tog2│ │Tog3│ │Tog4│          │
│ └────┘ └────┘ └────┘ └────┘          │
│                                        │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│ │Tog5│ │Tog6│ │Tog7│ │Tog8│          │
│ └────┘ └────┘ └────┘ └────┘          │
└────────────────────────────────────────┘
```

### Two Sections (Side-by-Side)

```
┌─────────────────────┬─────────────────────┐
│ Quick Controls      │ Status              │
├─────────────────────┼─────────────────────┤
│ ┌────┐ ┌────┐      │ ┌────┐ ┌────┐      │
│ │Tog1│ │Tog2│      │ │Ind1│ │Ind2│      │
│ └────┘ └────┘      │ └────┘ └────┘      │
│                     │                     │
│ ┌────┐ ┌────┐      │ ┌────┐ ┌────┐      │
│ │Tog3│ │Tog4│      │ │Ind3│ │Ind4│      │
│ └────┘ └────┘      │ └────┘ └────┘      │
└─────────────────────┴─────────────────────┘
```

### Serv 7 - Two Sections (Stacked)

```
┌────────────────────────────────────────┐
│ Quick Controls                         │
├────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐                 │
│ │Toggle 1│ │Toggle 2│                 │
│ └────────┘ └────────┘                 │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│ Status                                 │
├────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐                 │
│ │Indic 1 │ │Indic 2 │                 │
│ └────────┘ └────────┘                 │
└────────────────────────────────────────┘
```

## Schema Configuration

### Home Tab Structure

The schema defines the home tab configuration:

```json
{
  "home": {
    "section1": {
      "enabled": true,
      "type": "switching",
      "title": "Quick Controls"
    },
    "section2": {
      "enabled": true,
      "type": "signal-values",
      "title": "Status"
    }
  },
  "tabs": [
    {
      "id": "tab-home",
      "preset": "home",
      "title": "Home",
      "sections": [
        {
          "id": "section-quick-controls",
          "title": "Quick Controls",
          "components": [...]
        },
        {
          "id": "section-status",
          "title": "Status",
          "components": [...]
        }
      ]
    }
  ]
}
```

### Section Types

**Switching (Quick Controls)**:

- Toggle buttons for frequently used controls
- Typical components: Toggle, Round Toggle, Button
- Example: Lights, pumps, fans

**Signal Values (Status)**:

- Read-only indicators and gauges
- Typical components: Indicator, Gauge
- Example: Battery voltage, tank levels, temperatures

## Detection Logic

In `App.tsx`, we detect the Home tab using:

```tsx
const isHomeTab = activeTab.preset === 'home' || activeTab.id === 'tab-home';
```

This checks for:

1. `preset: 'home'` property
2. `id: 'tab-home'` fallback

## Use Cases

### Dashboard Home Screen

- **Left**: Quick access toggles (lights, pumps)
- **Right**: Status indicators (battery, tanks)

### Single-Purpose Home

- **Full width**: All favorite controls in one section
- Maximizes grid space for more components

### Compact Display (Serv 7)

- Automatically stacks sections vertically
- Maintains usability on smaller screens

## Responsive Behavior

| Display | Layout               | Gap     | Notes           |
| ------- | -------------------- | ------- | --------------- |
| Default | Side-by-side         | 1.5rem  | 50/50 split     |
| Serv 10 | Side-by-side         | 1.25rem | Smaller gap     |
| Serv 7  | Stacked (top/bottom) | 1rem    | Vertical layout |

## Performance

**CSS Grid Benefits**:

- Hardware-accelerated layout
- No JavaScript for responsive behavior
- Minimal reflows
- Efficient memory usage

**CSS Containment**:

```css
.gcg-home-layout {
  contain: layout style;
}
```

## Testing

### Browser DevTools

1. Open `localhost:3001`
2. Navigate to Home tab
3. Toggle Device Toolbar (Cmd+Shift+M)
4. Test layouts:
   - **Default**: 50/50 side-by-side
   - **Serv 10 (1084x606)**: 50/50 with smaller gap
   - **Serv 7 (958x489)**: Stacked vertically

### Test Cases

- ✅ 0 sections (empty state)
- ✅ 1 section (full width)
- ✅ 2 sections (side-by-side)
- ✅ 2 sections on Serv 7 (stacked)
- ✅ Different component types in each section

## Future Enhancements

### Phase 2

- [ ] Configurable split ratio (60/40, 70/30)
- [ ] Draggable divider between sections
- [ ] Collapsible sections
- [ ] Custom section ordering

### Phase 3

- [ ] 3+ sections with auto-layout
- [ ] Widget-based home screen
- [ ] Customizable grid per section
- [ ] Saved layouts/presets

## Related Files

- `/packages/hmi-ui/src/components/HomeLayout.tsx` - Component
- `/packages/hmi-ui/src/styles/grid.css` - Styles
- `/packages/hmi-ui/src/App.tsx` - Tab detection logic
- `/docs/CSS_GRID_STRATEGY.md` - Overall grid system

## Comparison to Regular Tabs

| Feature          | Home Tab        | Regular Tabs       |
| ---------------- | --------------- | ------------------ |
| Section layout   | Side-by-side    | Stacked vertically |
| Max sections     | 2 (recommended) | Unlimited          |
| Layout component | `HomeLayout`    | Direct `Section`   |
| Responsive       | Stack on Serv 7 | Always stack       |
| Purpose          | Dashboard       | Category/subsystem |

---

**Home tab layout ready for production! 🏠**
