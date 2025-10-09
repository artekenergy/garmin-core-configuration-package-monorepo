# Fixed Viewport Layout & Responsive Design

**Status**: ✅ Implemented  
**Date**: October 8, 2025  
**Affects**: HMI-UI display layout and responsive behavior

## Overview

The HMI-UI has been configured as a **fixed viewport, touch-optimized interface** with no scrolling. This matches the behavior of embedded displays where the entire UI must fit within the physical screen dimensions.

## Target Displays

### Serv 7 (Horizontal)

- **Resolution**: 958 x 489 pixels
- **Aspect Ratio**: 1.9591 (wide)
- **Optimizations**: Compact spacing, 2-column grid, smaller font sizes

### Serv 10 (Horizontal)

- **Resolution**: 1084 x 606 pixels
- **Aspect Ratio**: 1.7887 (wide)
- **Optimizations**: Balanced spacing, 3-column grid, standard font sizes

## Layout Structure

```
┌─────────────────────────────────────┐
│     StatusBar (Fixed Header)        │ ~60-80px
├─────────────────────────────────────┤
│                                     │
│     Main Content (Fixed)            │ Flex: 1
│     - No scrolling                  │ (fills space)
│     - Grid-based sections           │
│     - Touch-optimized               │
│                                     │
├─────────────────────────────────────┤
│     TabBar (Fixed Footer)           │ 60-80px
└─────────────────────────────────────┘
```

## Key Design Principles

### 1. Fixed Viewport

- No scrolling on any axis
- Content must fit within available height
- `overflow: hidden` on html, body, and main content
- `position: fixed` prevents bounce/overscroll

### 2. Touch-Friendly Targets

- Minimum 44px touch targets for all interactive elements
- Adequate spacing between clickable items
- Large, clear icons and labels

### 3. Responsive Breakpoints

#### Serv 7 (≤958 x 489px)

```css
@media screen and (max-width: 958px) and (max-height: 489px) {
  /* Compact spacing */
  padding: 0.5rem;
  gap: 0.75rem;

  /* 2-column grid */
  grid-template-columns: repeat(2, 1fr);

  /* Smaller text */
  font-size: 0.75rem;
}
```

#### Serv 10 (≤1084 x 606px)

```css
@media screen and (max-width: 1084px) and (max-height: 606px) {
  /* Balanced spacing */
  padding: 0.875rem;
  gap: 0.875rem;

  /* 3-column grid */
  grid-template-columns: repeat(3, 1fr);

  /* Standard text */
  font-size: 0.875rem;
}
```

#### Default (Larger displays)

```css
/* 4-column grid */
grid-template-columns: repeat(4, 1fr);
padding: 1rem;
gap: 1rem;
```

### 4. Component Scaling

**StatusBar**:

- Serv 7: 0.5rem padding, 0.75rem font
- Serv 10: 0.875rem padding, 0.875rem font
- Default: 1rem padding, 0.875rem font

**TabBar**:

- Serv 7: 60px height
- Serv 10: 75px height
- Default: 80px height

**Main Content**:

- Serv 7: 0.5rem padding, 0.75rem gaps
- Serv 10: 0.875rem padding, 0.875rem gaps
- Default: 1rem padding, 1rem gaps

## CSS Files

### responsive.css

Contains all media queries and viewport-specific optimizations:

- Display-specific breakpoints
- Grid layout rules
- Touch target sizing
- Landscape optimizations
- Overscroll prevention

### main.css

Base global styles:

- Fixed html/body positioning
- No-scroll configuration
- Root element sizing
- CSS custom properties

## Implementation Details

### Fixed Positioning

```css
html,
body {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: auto;
  overscroll-behavior: none;
}
```

### Main Content Area

```tsx
<div
  className="gcg-main-content"
  style={{
    flex: 1,
    overflow: 'hidden',
    padding: '1rem',
  }}
>
  {/* Content renders here */}
</div>
```

### Grid Sections

```css
.gcg-section-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Adjusts per breakpoint */
  gap: 1rem;
  width: 100%;
}
```

## Testing Recommendations

### 1. Browser DevTools

- Open Chrome DevTools
- Toggle device toolbar (Cmd+Shift+M)
- Create custom devices:
  - **Serv 7**: 958 x 489
  - **Serv 10**: 1084 x 606
- Test touch mode (pointer: coarse)

### 2. Checklist

- [ ] No scrollbars appear
- [ ] Content fits within viewport
- [ ] Touch targets are ≥44px
- [ ] Grid adapts to screen size
- [ ] StatusBar and TabBar scale correctly
- [ ] No overscroll bounce
- [ ] Landscape orientation optimized

### 3. Physical Display Testing

- Deploy to actual Serv 7/10 hardware
- Test touch interactions
- Verify text legibility
- Check component spacing
- Validate color contrast

## Future Enhancements

### Phase 2 (Planned)

- Dynamic component sizing based on available height
- Auto-hiding sections when space is limited
- Collapsible sections with expand/collapse
- Horizontal scrolling for overflow (carousel style)

### Phase 3 (Planned)

- Virtual scrolling for large component lists
- Zoom/pan gestures for detailed views
- Multi-page sections with pagination
- Adaptive font scaling

## Related Files

- `/packages/hmi-ui/src/styles/responsive.css` - Responsive rules
- `/packages/hmi-ui/src/styles/main.css` - Global styles
- `/packages/hmi-ui/src/App.tsx` - Main layout structure
- `/packages/hmi-ui/src/components/StatusBar.tsx` - Header component
- `/packages/hmi-ui/src/components/TabBar.tsx` - Footer navigation

## Browser Compatibility

**Target**: Chrome/WebView 83 (Android 10)

- ES2017 JavaScript
- CSS Grid Level 1
- Flexbox
- CSS Custom Properties
- Media Queries Level 4

All features are fully supported in the target environment.
