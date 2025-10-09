# HMI Component Design System

**Date**: October 8, 2025  
**Status**: 🚧 In Progress  
**Phase**: 1 - Component Library

---

## 🎯 Design Philosophy

### Core Principles

1. **Touch-First**: All components optimized for 7" touchscreen (1280×800 or 1024×600)
2. **ES2017 Compliant**: No optional chaining (`?.`), no nullish coalescing (`??`)
3. **Reactive by Default**: Preact signals for state management
4. **Hardware-Driven**: Components subscribe to WebSocket signals, display actual hardware state
5. **Consistent Styling**: All components follow the same visual language

### Visual Language

- **Modern Dark Theme**: Professional cockpit/control panel aesthetic
- **Depth & Dimension**: Subtle gradients, shadows, and highlights for 3D effect
- **Clear States**: Obvious visual feedback for on/off, active/inactive, disabled
- **Smooth Animations**: 200-300ms transitions using cubic-bezier easing
- **Accessibility**: Proper ARIA labels, focus states, keyboard support

---

## 🎨 Component Specifications

### 1. Toggle Component

**Purpose**: Binary on/off switch for controlling outputs (lights, pumps, fans)

**Variants**:

- `default` - Horizontal switch with sliding thumb (primary)
- `round` - Circular button (for tight spaces)
- `switch` - iOS-style toggle switch
- `checkbox` - Traditional checkbox (legacy)

**Schema Definition**:

```json
{
  "id": "comp-pantry-light",
  "type": "toggle",
  "label": "Pantry Light",
  "variant": "default",
  "icon": "💡",
  "tooltip": "Main pantry overhead LED",
  "disabled": false,
  "visible": true,
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-12"
    }
  }
}
```

**Visual States**:

- **Off**: Dark gray background, thumb on left, muted label
- **On**: Primary blue background, thumb on right, bright label, glowing effect
- **Hover**: Subtle lift, shadow increase
- **Pressed**: Depressed (translateY +1px)
- **Disabled**: 40% opacity, no interaction

**WebSocket Behavior**:

- **User Action**: Sends TWO messages (press=1, release=0) with 75ms delay
- **Display State**: Shows actual state from Type 16 Cmd 1 subscription feedback
- **No Optimistic UI**: State updates only when hardware confirms

**Implementation Notes**:

- Track element: 3rem × 1.5rem with rounded ends
- Thumb element: 1.25rem circle, transitions left/right
- Click handler on entire button element (not just track)
- Signal ID resolved from `bindings.state` channel reference

---

### 2. Button Component

**Purpose**: Momentary action trigger (horn, door unlock, water pump prime)

**Variants**:

- `default` - Rectangular button with depth
- `primary` - Blue highlight for primary actions
- `danger` - Red for critical actions (emergency stop)
- `round` - Circular button (matches round toggle)

**Schema Definition**:

```json
{
  "id": "comp-water-pump",
  "type": "button",
  "label": "Prime Pump",
  "action": "momentary",
  "variant": "primary",
  "icon": "💧",
  "tooltip": "Hold to prime water pump",
  "bindings": {
    "action": {
      "type": "empirbus",
      "channel": "core-15"
    }
  }
}
```

**Visual States**:

- **Rest**: 3D gradient, slight shadow
- **Hover**: Brighter gradient, increased shadow
- **Pressed**: Depressed look, reduced shadow, darker gradient
- **Disabled**: Grayed out, no depth

**WebSocket Behavior**:

- **Press Down**: Sends value=1 immediately
- **Hold**: Continues sending (no repeat, single press)
- **Release**: Sends value=0 on pointer up/leave/cancel
- **Safety**: Ensures release sent even if pointer leaves button area

**Implementation Notes**:

- Use pointer events (down, up, cancel, leave)
- Local state tracks `isPressed` for visual feedback
- No subscription feedback needed (momentary action)
- Must handle all pointer cancel cases (drag off screen, etc.)

---

### 3. Indicator Component

**Purpose**: Read-only status display (LED light, status badge)

**Variants**:

- `led` - Simple circular LED (default)
- `badge` - LED with text label
- `icon` - Custom icon with state color

**Schema Definition**:

```json
{
  "id": "comp-engine-running",
  "type": "indicator",
  "label": "Engine Running",
  "variant": "led",
  "color": "green",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "engine-status"
    }
  }
}
```

**Visual States**:

- **Off**: Gray circle (rgba(148, 163, 184, 0.3))
- **On**: Bright color with glow effect
- **Warning**: Yellow/amber
- **Error**: Red

**Colors**:

- Green: `#10b981` (success, running, normal)
- Yellow: `#f59e0b` (warning, caution)
- Red: `#ef4444` (error, fault, critical)
- Blue: `#3b82f6` (info, active)
- White: `#f1f5f9` (neutral)

**WebSocket Behavior**:

- **Read-Only**: No user interaction
- **Subscription**: Listens to Type 16 Cmd 1 toggle state
- **Auto-Update**: Re-renders when signal state changes

---

### 4. Gauge Component

**Purpose**: Display numeric sensor values (temperature, voltage, tank level)

**Variants**:

- `numeric` - Just the number (default, most compact)
- `linear` - Horizontal progress bar with value
- `circular` - Arc gauge (analog look)

**Schema Definition**:

```json
{
  "id": "comp-battery-voltage",
  "type": "gauge",
  "label": "House Battery",
  "variant": "numeric",
  "min": 0,
  "max": 15,
  "unit": "V",
  "decimals": 1,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "battery-voltage"
    }
  }
}
```

**Visual Elements**:

- Value display: Large, bold font
- Unit label: Smaller, secondary color
- Range indicator (linear/circular): Shows min-max scale
- Color coding (optional): Green/yellow/red based on thresholds

**WebSocket Behavior**:

- **Read-Only**: No user interaction
- **Subscription**: Listens to Type 16 Cmd 5 numeric state
- **Formatting**: Applies decimal places, unit suffix
- **Range Calculation**: `(value - min) / (max - min) * 100%`

---

### 5. Dimmer Component

**Purpose**: Variable intensity control for dimmable lights (0-100%)

**Variants**:

- `default` - Combined toggle + slider

**Schema Definition**:

```json
{
  "id": "comp-living-room-lights",
  "type": "dimmer",
  "label": "Living Room",
  "min": 0,
  "max": 100,
  "step": 1,
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-08"
    }
  }
}
```

**Visual Elements**:

- Toggle button (top): On/off control
- Slider (bottom): Intensity adjustment
- Value display: Shows current percentage
- Fill bar: Visual representation of intensity level

**WebSocket Behavior**:

- **Toggle**: Sends press/release to toggle signal ID
- **Slider**: Sends Type 16 Cmd 4 dimmer messages
- **Dual Subscription**:
  - Toggle state from Cmd 1
  - Intensity value from Cmd 4
- **Drag Prevention**: Don't update slider during active drag

**Implementation Notes**:

- Resolve TWO signal IDs from same channel reference
- Use `isDragging` signal to prevent update conflicts
- Update slider only when not focused and not dragging
- Send dimmer value on input event, throttled

---

### 6. Slider Component

**Purpose**: Adjustable numeric input (temperature setpoint, speed control)

**Variants**:

- `horizontal` - Left-to-right slider (default)
- `vertical` - Bottom-to-top slider

**Schema Definition**:

```json
{
  "id": "comp-temp-setpoint",
  "type": "slider",
  "label": "Temperature",
  "orientation": "horizontal",
  "min": 60,
  "max": 80,
  "step": 1,
  "unit": "°F",
  "showValue": true,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "hvac-setpoint"
    }
  }
}
```

**Visual Elements**:

- Track: Full-width rail
- Fill: Colored section from min to current value
- Thumb: Draggable handle
- Value display: Current value with unit
- Min/Max labels: Optional range indicators

**WebSocket Behavior**:

- **Interaction**: Sends numeric value on change
- **Subscription**: Type 16 Cmd 5 for current value
- **Throttling**: Debounce updates during drag
- **Range Validation**: Clamp to min/max

---

## 🎨 CSS Architecture

### Variable System

```css
/* Theme Colors */
--color-primary: #3b82f6;
--color-primary-light: #60a5fa;
--color-primary-dark: #2563eb;

--color-success: #10b981;
--color-warning: #f59e0b;
--color-danger: #ef4444;
--color-info: #3b82f6;

/* Background Colors */
--color-bg-primary: #0f172a;
--color-bg-secondary: #1e293b;
--color-bg-tertiary: #334155;

/* Text Colors */
--color-text-primary: #f1f5f9;
--color-text-secondary: #94a3b8;
--color-text-muted: #64748b;

/* Component States */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* Spacing */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;

/* Border Radius */
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
--radius-full: 9999px;
```

### Component Class Naming

**Pattern**: `.gcg-{component}[__{element}][--{modifier}]`

Examples:

- `.gcg-toggle` - Base component
- `.gcg-toggle__track` - Sub-element
- `.gcg-toggle__thumb` - Sub-element
- `.gcg-toggle--on` - State modifier
- `.gcg-toggle--round` - Variant modifier
- `.gcg-toggle--disabled` - State modifier

### Gradient System

**3D Depth Effect**:

```css
/* Raised/Convex */
background: linear-gradient(145deg, #3a4a5c, #2d3a48);
box-shadow:
  0 4px 6px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);

/* Pressed/Concave */
background: linear-gradient(145deg, #2d3a48, #3a4a5c);
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);

/* Active/Glowing */
background: linear-gradient(145deg, #3b82f6, #2563eb);
box-shadow:
  0 4px 6px rgba(0, 0, 0, 0.3),
  0 0 12px rgba(59, 130, 246, 0.5);
```

---

## 📦 Component File Structure

Each component should follow this structure:

```tsx
/**
 * {Component} Component
 *
 * {Description of purpose}
 *
 * ES2017 compliant - no optional chaining or nullish coalescing.
 */

import { useComputed } from '@preact/signals';
import type { {Component}Component } from '@gcg/schema';
import { getWebSocketAdapter } from '../state/websocket-state';
import { resolveBindingToChannelId } from '../utils/binding-resolver';
import { getSignalState } from '../state/signal-state';

interface {Component}Props {
  component: {Component}Component;
  value?: {ValueType};
  onChange?: (value: {ValueType}) => void;
}

export function {Component}(props: {Component}Props) {
  const { component, value, onChange } = props;

  // 1. Resolve signal IDs from bindings
  // 2. Subscribe to signal state
  // 3. Compute current value/state
  // 4. Define event handlers
  // 5. Build class names
  // 6. Return JSX

  return (
    <div className="gcg-component-wrapper">
      {/* Component markup */}
      {component.tooltip && (
        <div className="gcg-component-tooltip">{component.tooltip}</div>
      )}
    </div>
  );
}
```

---

## ✅ Build Checklist

### For Each Component:

- [ ] TypeScript interface matches schema exactly
- [ ] Resolves signal IDs from bindings
- [ ] Subscribes to appropriate signal state (toggle/numeric/dimmer)
- [ ] Computes reactive value using `useComputed`
- [ ] Sends correct WebSocket message format
- [ ] Handles all pointer events properly
- [ ] Applies correct CSS classes (base + variant + state)
- [ ] Shows tooltip if provided
- [ ] Supports disabled state
- [ ] Has proper ARIA attributes
- [ ] No ES2018+ syntax (no `?.` or `??`)
- [ ] Console logging for debugging
- [ ] Matches visual design specification

---

## 🚀 Next Steps

1. **Rebuild Toggle** - Start fresh with complete specification
2. **Rebuild Button** - Ensure all pointer events handled
3. **Rebuild Indicator** - Add all color states
4. **Rebuild Gauge** - Implement all 3 variants
5. **Rebuild Dimmer** - Fix dual signal handling
6. **Build Slider** - New component, complete implementation
7. **Update ComponentRenderer** - Handle all types and variants
8. **Test with Mock Schema** - Verify all components render
9. **Update CSS** - Ensure consistent styling across all

---

**Author**: GitHub Copilot  
**Status**: Ready to implement
