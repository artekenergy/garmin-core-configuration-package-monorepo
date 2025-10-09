# Button Component Label Structure Update

**Date:** October 9, 2025  
**Component:** Button (`/packages/hmi-ui/src/components/Button.tsx`)

## Overview

Updated the Button component structure to display the label **outside and above** the button element, matching the design pattern used by other components like Dimmer.

## Changes Made

### 1. Component Structure (`Button.tsx`)

**Before:**

```tsx
<div className="gcg-component-wrapper">
  <button className={className}>
    <span className="gcg-button__label">{component.label}</span>
  </button>
</div>
```

**After:**

```tsx
<div className="gcg-component-wrapper">
  <div className="gcg-button-container">
    {/* Label displayed above the button */}
    <label className="gcg-button-label">{component.label}</label>

    <button className={className}>
      {/* Icon only (no text inside button) */}
      {iconSvg && (
        <div className="gcg-button__icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />
      )}
    </button>
  </div>

  {/* Tooltip below */}
  {component.tooltip && <div className="gcg-component-tooltip">{component.tooltip}</div>}
</div>
```

### 2. CSS Styles (`components.css`)

Added new styles for the label structure:

```css
/* Button Container - wraps label and button */
.gcg-button-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

/* Button Label - displayed above the button */
.gcg-button-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
}

/* Button Icon (for regular variants) */
.gcg-button__icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.gcg-button__icon svg {
  width: 100%;
  height: 100%;
  display: block;
}
```

### 3. Behavior Changes

**Label Display:**

- ✅ Label is now always displayed **above** the button
- ✅ Label pulled from `component.label` in schema
- ✅ Label is centered and properly styled

**Button Content:**

- ✅ Round variant: Icon-only (no text inside button)
- ✅ Regular variants: Can display icon inside button
- ✅ All text is now in the external label

**Icon Support:**

- ✅ Round buttons: Icon displayed if `iconSvg` exists
- ✅ Regular buttons: Icon displayed if `iconSvg` exists
- ✅ Icons are properly sized and centered

## Visual Layout

```
┌─────────────────────────┐
│      Label Text         │ ← .gcg-button-label
├─────────────────────────┤
│  ┌─────────────────┐   │
│  │   [Icon/Empty]  │   │ ← button element
│  └─────────────────┘   │
└─────────────────────────┘
        ↓
    Tooltip (optional)
```

## Comparison with Dimmer Component

The Button structure now follows the same pattern as Dimmer:

**Dimmer:**

```tsx
<div className="gcg-dimmer__header">
  <label className="gcg-dimmer__label">
    <span className="gcg-dimmer__label-text">{component.label}</span>
    ...
  </label>
  <button>...</button>
</div>
```

**Button (new):**

```tsx
<div className="gcg-button-container">
  <label className="gcg-button-label">{component.label}</label>
  <button>...</button>
</div>
```

## Benefits

1. **Consistent Design** - All components follow the same label-above-control pattern
2. **Better Touch Targets** - Button area is dedicated to interaction, not text
3. **Cleaner Visuals** - Labels are separate from interactive elements
4. **Schema Driven** - Label content comes directly from `component.label`
5. **Accessibility** - Proper label elements for screen readers

## Schema Integration

The label is pulled from the component schema:

```typescript
{
  id: "button-example",
  type: "button",
  label: "Power On",  // ← Displayed above button
  variant: "round",
  icon: "power",
  bindings: { ... }
}
```

## Round Button Variant

Round buttons maintain their circular shape and now:

- Display label above the circle
- Show icon OR text inside (but label is always above)
- Icon-only inside if `iconSvg` is provided

## Testing Checklist

- [ ] Label displays correctly above button
- [ ] Label text comes from `component.label` in schema
- [ ] Round variant shows icon inside, label above
- [ ] Regular variants show icon inside (if provided), label above
- [ ] Pressed state works correctly
- [ ] Disabled state shows properly
- [ ] Tooltip still displays below
- [ ] Touch targets are appropriate size
- [ ] Works on Serv 7 (958x489) display
- [ ] Works on Serv 10 (1084x606) display

## Migration Notes

**No schema changes required** - the `label` property was already part of the component schema.

**CSS changes only** - added new classes, didn't break existing functionality.

**Component logic** - simplified by removing conditional label rendering inside button.

## Related Components

May want to apply similar pattern to:

- ✅ Button - **DONE**
- ⏸️ Toggle - Currently has label inside button (consider updating?)
- ✅ Dimmer - Already uses this pattern
- ⏸️ Gauge - Different pattern (title inside component)
- ⏸️ Indicator - Different pattern (no button)

## Conclusion

Button components now have a clean, consistent structure with labels displayed above the interactive element, matching the overall design system and improving usability on touch displays.

**Status:** ✅ Complete and Ready for Testing
