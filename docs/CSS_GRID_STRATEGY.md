# CSS Grid Strategy for Tab Content Sections

**Status**: 📋 Planning  
**Date**: October 8, 2025  
**Target**: WebView 83 (Chrome 83) - Full CSS Grid Level 1 support ✅

## Overview

Design a **responsive CSS Grid system** for rendering component sections within tabs. The system must:

- Adapt to Serv 7 (958x489) and Serv 10 (1084x606) displays
- Handle mixed component types (toggles, buttons, dimmers, indicators)
- Be touch-friendly with no scrolling
- Work in WebView 83 (ES2017 compatible)

## Browser Compatibility Check

### CSS Grid Support in WebView 83 (Chrome 83)

✅ **CSS Grid Level 1** - Fully supported  
✅ `display: grid`  
✅ `grid-template-columns`, `grid-template-rows`  
✅ `grid-gap` / `gap`  
✅ `grid-column`, `grid-row` (spanning)  
✅ `grid-auto-flow`  
✅ `minmax()`, `repeat()`, `auto-fill`, `auto-fit`  
✅ `fr` units  
✅ Named grid lines  
✅ `grid-template-areas`

❌ **NOT Supported** (CSS Grid Level 2):

- Subgrid (Chrome 117+)
- Masonry layout (experimental)

**Conclusion**: We can use all CSS Grid Level 1 features safely! 🎉

## Grid Strategy

### 1. Responsive Column System

```css
/* Base: 4-column grid for larger displays */
.gcg-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
}

/* Serv 10 (1084x606): 3 columns */
@media screen and (max-width: 1084px) and (max-height: 606px) {
  .gcg-section {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.875rem;
  }
}

/* Serv 7 (958x489): 2 columns */
@media screen and (max-width: 958px) and (max-height: 489px) {
  .gcg-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}
```

### 2. Component Spanning Rules

Different components need different grid behaviors:

#### Small Components (1 cell)

- **Toggle** - Single grid cell
- **Round Toggle** - Single grid cell
- **Button** - Single grid cell
- **Round Button** - Single grid cell
- **Indicator** - Single grid cell

```css
.gcg-toggle,
.gcg-round-toggle,
.gcg-button,
.gcg-round-button,
.gcg-indicator {
  /* Automatically fills 1 grid cell */
  grid-column: span 1;
}
```

#### Wide Components (2 cells)

- **Dimmer/Slider** - 2 cells wide (needs space for label + slider)

```css
.gcg-dimmer,
.gcg-slider {
  grid-column: span 2;
}

/* On Serv 7 (2 columns), span full width */
@media screen and (max-width: 958px) and (max-height: 489px) {
  .gcg-dimmer,
  .gcg-slider {
    grid-column: span 2; /* Full width */
  }
}
```

#### Full-Width Components (all cells)

- **Gauge** - Full width (needs circular space)
- **Chart** - Full width (needs horizontal space)

```css
.gcg-gauge,
.gcg-chart {
  grid-column: 1 / -1; /* Span all columns */
}
```

### 3. Auto-Flow Strategy

```css
.gcg-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  grid-auto-flow: dense; /* Fill gaps automatically */
}
```

**Benefits**:

- `auto-fit`: Automatically adjusts column count
- `minmax(150px, 1fr)`: Minimum 150px per component (touch-friendly)
- `dense`: Fills gaps when wide components leave holes

**Drawback**: Less predictable on exact breakpoints

**Recommendation**: Use fixed column counts for consistency

### 4. Section Header + Grid Layout

```html
<div class="gcg-section">
  <h2 class="gcg-section__title">Lighting</h2>

  <div class="gcg-section__grid">
    <!-- Components render here -->
    <Toggle />
    <Toggle />
    <Dimmer />
    <!-- Spans 2 cells -->
    <button />
    <Indicator />
  </div>
</div>
```

```css
.gcg-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.gcg-section__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--theme-primary);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(232, 236, 240, 0.1);
}

.gcg-section__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
```

### 5. Vertical Space Management

**Problem**: Fixed viewport = limited vertical space

**Solutions**:

#### Option A: Single Section Per Tab (Recommended)

- Each tab shows ONE section at a time
- Fits easily within viewport
- No scrolling needed
- Simple, predictable

```tsx
// In App.tsx
const activeTab = schema.tabs.find((tab) => tab.id === activeTabId.value);
const firstSection = activeTab?.sections[0]; // Show only first section

return (
  <div className="gcg-section">
    <h2>{firstSection.title}</h2>
    <div className="gcg-section__grid">
      {firstSection.components.map((c) => (
        <ComponentRenderer />
      ))}
    </div>
  </div>
);
```

#### Option B: Scrollable Sections Container

- Vertical scroll within content area
- Shows all sections
- Less ideal for fixed display

```css
.gcg-main-content {
  flex: 1;
  overflow-y: auto; /* Allow scrolling */
  padding: 1rem;
}
```

#### Option C: Collapsible Sections (Phase 2)

- Accordion-style sections
- Expand one at a time
- Good for many sections

```tsx
<Accordion>
  <AccordionItem title="Lighting">
    <SectionGrid components={...} />
  </AccordionItem>
  <AccordionItem title="HVAC">
    <SectionGrid components={...} />
  </AccordionItem>
</Accordion>
```

**Recommendation**: Start with **Option A** (single section), add scrolling if needed

### 6. Component Aspect Ratios

Maintain consistent sizing:

```css
/* Round components: 1:1 aspect ratio */
.gcg-round-toggle,
.gcg-round-button {
  aspect-ratio: 1 / 1;
  min-height: 80px;
}

/* Rectangular components: flexible height */
.gcg-toggle,
.gcg-button {
  min-height: 60px;
  padding: 1rem;
}

/* Dimmers: Wide and short */
.gcg-dimmer {
  min-height: 60px;
  padding: 1rem;
}

/* Indicators: Small and compact */
.gcg-indicator {
  min-height: 40px;
  padding: 0.75rem;
}
```

### 7. Empty Cell Handling

When grid has odd numbers:

```css
/* Fill last row with available space */
.gcg-section__grid {
  grid-auto-flow: row dense;
}

/* Or: Center incomplete rows */
.gcg-section__grid {
  justify-items: center;
}
```

## Implementation Plan

### Phase 1: Basic Grid (Immediate)

1. Create `Section` component with grid layout
2. Add responsive column breakpoints
3. Implement component spanning rules
4. Test on Serv 7 and Serv 10 dimensions

### Phase 2: Refinement

1. Add collapsible sections (accordion)
2. Optimize spacing for vertical space
3. Add empty state messaging
4. Implement drag-to-reorder (configurator only)

### Phase 3: Advanced

1. Virtual scrolling for large component lists
2. Custom grid layouts per section
3. Component grouping/dividers
4. Grid templates (saved layouts)

## Code Structure

### New Files to Create

```
packages/hmi-ui/src/
├── components/
│   └── Section.tsx          # Section container with grid
├── styles/
│   ├── grid.css             # Grid system rules
│   └── section.css          # Section-specific styles
```

### Section Component (Proposed)

```tsx
/**
 * Section Component
 *
 * Renders a titled section with a responsive grid of components.
 */

import { ComponentRenderer } from './ComponentRenderer';
import type { Section as SectionType } from '../types/ui-schema';

interface SectionProps {
  section: SectionType;
}

export function Section(props: SectionProps) {
  const { section } = props;

  return (
    <div className="gcg-section">
      {/* Section Title */}
      <h2 className="gcg-section__title">{section.title}</h2>

      {/* Component Grid */}
      <div className="gcg-section__grid">
        {section.components.map(function (component) {
          return <ComponentRenderer key={component.id} component={component} />;
        })}
      </div>
    </div>
  );
}
```

### Grid CSS (Proposed)

```css
/* ===========================
   Section Grid System
   =========================== */

.gcg-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.gcg-section:last-child {
  margin-bottom: 0;
}

.gcg-section__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--theme-primary);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(232, 236, 240, 0.1);
}

/* Base Grid: 4 columns */
.gcg-section__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
}

/* Component Spanning */
.gcg-dimmer,
.gcg-slider {
  grid-column: span 2;
}

.gcg-gauge,
.gcg-chart {
  grid-column: 1 / -1;
}

/* Serv 10: 3 columns */
@media screen and (max-width: 1084px) and (max-height: 606px) {
  .gcg-section__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.875rem;
  }

  .gcg-section__title {
    font-size: 1.125rem;
  }
}

/* Serv 7: 2 columns */
@media screen and (max-width: 958px) and (max-height: 489px) {
  .gcg-section__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .gcg-section__title {
    font-size: 1rem;
  }

  .gcg-section {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  /* Dimmers span full width on small displays */
  .gcg-dimmer,
  .gcg-slider {
    grid-column: span 2;
  }
}

/* Touch-friendly minimum sizes */
.gcg-section__grid > * {
  min-height: 60px;
}

.gcg-round-toggle,
.gcg-round-button {
  aspect-ratio: 1 / 1;
  min-height: 80px;
}
```

## Testing Strategy

### 1. Browser DevTools Testing

```bash
# Chrome DevTools
1. Open localhost:3001
2. Toggle Device Toolbar (Cmd+Shift+M)
3. Add custom devices:
   - Serv 7: 958 x 489
   - Serv 10: 1084 x 606
4. Test grid layouts at each breakpoint
5. Verify component spacing and sizing
```

### 2. Component Combinations to Test

- **All same type**: 8 toggles in grid
- **Mixed sizes**: 4 toggles + 2 dimmers
- **Full width**: 2 toggles + 1 gauge
- **Odd count**: 7 buttons (incomplete row)
- **Empty section**: 0 components (edge case)

### 3. Viewport Tests

| Display | Columns | Gap   | Expected Layout |
| ------- | ------- | ----- | --------------- |
| Default | 4       | 1rem  | 4 items per row |
| Serv 10 | 3       | 0.875 | 3 items per row |
| Serv 7  | 2       | 0.75  | 2 items per row |

### 4. Vertical Fit Tests

- Measure available height: `viewport - statusBar - tabBar`
- Test with 4, 8, 12, 16 components
- Ensure no overflow on Serv 7 (smallest display)
- Add scrolling if content exceeds viewport

## Performance Considerations

### CSS Grid Performance in WebView 83

✅ **Excellent**: CSS Grid is hardware-accelerated  
✅ **Low memory**: Grid layout is more efficient than flexbox for 2D  
✅ **No JavaScript**: Pure CSS = no runtime overhead

### Best Practices

1. **Avoid `calc()` in grid templates** - Use `fr` units instead
2. **Use `gap` over margins** - Simpler, more performant
3. **Minimize re-layouts** - Fixed column counts > auto-fit
4. **CSS containment** - Add `contain: layout` to sections

```css
.gcg-section {
  contain: layout; /* Isolate layout calculations */
}
```

## Fallback Strategy

**If CSS Grid fails** (extremely unlikely in WebView 83):

```css
/* Flexbox fallback (not needed for WebView 83) */
@supports not (display: grid) {
  .gcg-section__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .gcg-section__grid > * {
    flex: 0 0 calc(25% - 1rem); /* 4 columns */
  }
}
```

## Next Steps

1. ✅ Create `Section.tsx` component
2. ✅ Add `grid.css` stylesheet
3. ✅ Update `App.tsx` to use `<Section>` component
4. ✅ Test on Serv 7 and Serv 10 dimensions
5. ✅ Document grid usage in schema spec
6. ⏸️ Add collapsible sections (Phase 2)
7. ⏸️ Implement vertical scrolling (if needed)

## References

- [CSS Grid Level 1 Spec](https://www.w3.org/TR/css-grid-1/)
- [Can I Use CSS Grid](https://caniuse.com/css-grid) - Chrome 83 ✅
- [MDN CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- WebView 83 = Chrome 83 = Full CSS Grid Level 1 support

---

**Ready to implement!** 🚀
