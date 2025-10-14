# Home Tab Component Review

**Date:** October 14, 2025  
**Status:** Component-by-Component Analysis  
**Current Schema:** garmin-bundle/web/schema.json

---

## 📋 Current Home Tab Configuration

### Schema Structure

```json
{
  "id": "tab-home",
  "title": "Home",
  "preset": "home",
  "enabled": true,
  "sections": [
    {
      "id": "section-home-1",
      "title": "Quick Controls",
      "enabled": true,
      "components": [
        {
          "id": "comp-core-01",
          "type": "dimmer",
          "label": "Stabilizer",
          "min": 0,
          "max": 100,
          "step": 5,
          "bindings": { "intensity": { "type": "empirbus", "channel": "core-01" } }
        },
        {
          "id": "comp-core-09",
          "type": "toggle",
          "variant": "round",
          "label": "Slide Motor",
          "icon": "plumbing",
          "bindings": { "state": { "type": "empirbus", "channel": "core-09" } }
        }
      ]
    },
    {
      "id": "section-home-2",
      "title": "Status",
      "enabled": true,
      "type": "signal-values",
      "components": [
        {
          "id": "comp-signal-battery-soc",
          "type": "gauge",
          "label": "State of Charge",
          "min": 0,
          "max": 100,
          "unit": "%",
          "decimals": 0,
          "bindings": { "value": { "type": "static", "value": 0 } }
        },
        {
          "id": "comp-signal-solar-voltage",
          "type": "gauge",
          "label": "Solar Voltage",
          "min": 0,
          "max": 16,
          "unit": "V",
          "decimals": 1,
          "bindings": { "value": { "type": "static", "value": 0 } }
        }
      ]
    }
  ]
}
```

### Layout Behavior

**File:** `packages/hmi-ui/src/components/HomeLayout.tsx`

- **0 sections:** Shows "No sections configured" message
- **1 section:** Full width display
- **2 sections:** Side-by-side 50/50 split
- **Responsive:** Stacks sections vertically on smaller screens

---

## 🔧 Component Inventory

### Available Component Types

| Type          | File            | Status      | Used in Home            |
| ------------- | --------------- | ----------- | ----------------------- |
| **Toggle**    | `Toggle.tsx`    | ✅ Complete | ✅ Yes (Slide Motor)    |
| **Button**    | `Button.tsx`    | ✅ Complete | ❌ Not used             |
| **Dimmer**    | `Dimmer.tsx`    | ✅ Complete | ✅ Yes (Stabilizer)     |
| **Slider**    | `Slider.tsx`    | ✅ Complete | ❌ Not used             |
| **Gauge**     | `Gauge.tsx`     | ✅ Complete | ✅ Yes (Battery, Solar) |
| **Indicator** | `Indicator.tsx` | ✅ Complete | ❌ Not used             |

---

## 📊 Component Deep Dive

### 1. Toggle Component

**File:** `packages/hmi-ui/src/components/Toggle.tsx`

**Current Usage in Home:**

```json
{
  "id": "comp-core-09",
  "type": "toggle",
  "variant": "round",
  "label": "Slide Motor",
  "icon": "plumbing",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-09"
    }
  }
}
```

**Capabilities:**

- ✅ On/Off binary control
- ✅ WebSocket integration (Type 16, Cmd 1 - Toggle)
- ✅ Subscription feedback (displays actual hardware state)
- ✅ Multiple variants: `default`, `switch`, `round`, `checkbox`
- ✅ Icon support (optional)
- ✅ Disabled state
- ✅ Tooltip support
- ✅ Press/release mechanism (75ms delay)

**Visual Variants:**

1. **Default/Switch:** Horizontal slider track with thumb
2. **Round:** Circular button with icon, fills with accent when ON
3. **Checkbox:** Traditional checkbox style

**WebSocket Protocol:**

- Sends: Press (1) → 75ms delay → Release (0)
- Receives: Hardware state updates via Type 16, Cmd 1 subscription
- Signal ID: Resolved from channel binding (e.g., "core-09" → toggle signal)

**Props:**

- `component: ToggleComponent` (schema definition)
- `value?: boolean` (optional override for testing)
- `onChange?: (value: boolean) => void` (optional callback)

**Current Issues:**

- ✅ No known issues
- ✅ ES2017 compliant
- ✅ Touch-optimized

---

### 2. Dimmer Component

**File:** `packages/hmi-ui/src/components/Dimmer.tsx`

**Current Usage in Home:**

```json
{
  "id": "comp-core-01",
  "type": "dimmer",
  "label": "Stabilizer",
  "min": 0,
  "max": 100,
  "step": 5,
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-01"
    }
  }
}
```

**Capabilities:**

- ✅ Combined toggle + intensity control
- ✅ WebSocket integration (dual signals):
  - Type 16, Cmd 1 - Toggle (on/off)
  - Type 16, Cmd 4 - Dimmer (0-100%)
- ✅ Subscription feedback for both toggle and intensity
- ✅ Touch-friendly slider
- ✅ Min/max/step configuration
- ✅ Visual fill bar showing intensity
- ✅ Disabled state
- ✅ Tooltip support

**Layout:**

```
┌─────────────────────────────────────┐
│  Stabilizer                    75%  │
│  ┌──────────────────────────────┐   │
│  │  ON    ████████████████░░░   │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**WebSocket Protocol:**

- **Toggle:** Press (1) → 75ms → Release (0)
- **Dimmer:** Single value (0-100%)
- **Signal IDs:** Resolves both toggle and dimmer signals from channel

**Behavior:**

- Toggle button controls on/off
- Slider adjusts intensity (0-100%)
- Intensity updates ONLY when not dragging (prevents feedback loop)
- Displays hardware state from subscriptions
- Slider locked to slider position during drag

**Props:**

- `component: DimmerComponent` (schema definition)
- `value?: number` (optional override)
- `onChange?: (value: number) => void` (optional callback)

**Current Issues:**

- ✅ No known issues
- ✅ Prevents slider jumping during drag
- ✅ ES2017 compliant

---

### 3. Gauge Component

**File:** `packages/hmi-ui/src/components/Gauge.tsx`

**Current Usage in Home:**

```json
{
  "id": "comp-signal-battery-soc",
  "type": "gauge",
  "label": "State of Charge",
  "min": 0,
  "max": 100,
  "unit": "%",
  "decimals": 0,
  "bindings": {
    "value": {
      "type": "static",
      "value": 0
    }
  }
},
{
  "id": "comp-signal-solar-voltage",
  "type": "gauge",
  "label": "Solar Voltage",
  "min": 0,
  "max": 16,
  "unit": "V",
  "decimals": 1,
  "bindings": {
    "value": {
      "type": "static",
      "value": 0
    }
  }
}
```

**Capabilities:**

- ✅ Read-only numeric display
- ✅ WebSocket integration (Type 16, Cmd 5 - Numeric values)
- ✅ Multiple variants: `circular`, `linear`, `numeric`
- ✅ Unit display (V, %, A, W, etc.)
- ✅ Decimal precision control
- ✅ Min/max range configuration
- ✅ Percentage calculation for visual gauges
- ✅ Static binding support (for testing)

**Visual Variants:**

1. **Circular Gauge (Arc/Dial):**

```
    ┌─────────┐
    │  ╭───╮  │
    │ ╭ 87% ╮ │
    │ ╰─────╯ │
    └─────────┘
```

2. **Linear Gauge (Progress Bar):**

```
    ┌─────────────────────┐
    │ ████████░░░░░  87%  │
    └─────────────────────┘
```

3. **Numeric (Text Only):**

```
    ┌─────────┐
    │  87%    │
    └─────────┘
```

**WebSocket Protocol:**

- Receives: Type 16, Cmd 5 numeric values
- Extracts: `state.raw` for current value
- No sending (read-only component)

**Display Logic:**

- Value from signal state (if available)
- Fallback to props value (for testing)
- Default to 0
- Formatted with specified decimal places
- Percentage calculated: `((value - min) / (max - min)) * 100`

**Props:**

- `component: GaugeComponent` (schema definition)
- `value?: number` (optional override)

**Current Issues:**

- ⚠️ **Static bindings in Home tab** - Gauges currently use `"type": "static"` which means they show 0
- 🔲 **TODO:** Update bindings to EmpirBus signals from Cerbo GX
  - Battery SOC → Signal from Cerbo
  - Solar Voltage → Signal from Cerbo

---

### 4. Button Component

**File:** `packages/hmi-ui/src/components/Button.tsx`

**Current Usage in Home:** ❌ **Not currently used**

**Capabilities:**

- ✅ Momentary press/hold action
- ✅ WebSocket integration (Type 16, Cmd 1 - Momentary)
- ✅ Press and release messaging
- ✅ Visual variants: `default`, `primary`, `danger`, `round`
- ✅ Icon support
- ✅ Disabled state
- ✅ Tooltip support
- ✅ Pointer event handling (unified mouse/touch)
- ✅ Pointer capture (ensures release sent even if pointer leaves)

**Visual Variants:**

1. **Default:** Standard rectangular button
2. **Primary:** Highlighted button (accent color)
3. **Danger:** Red button for destructive actions
4. **Round:** Circular button with icon

**WebSocket Protocol:**

- **Press:** Sends value=1 immediately on pointer down
- **Hold:** Keeps value=1 while pressed (no repeat)
- **Release:** Sends value=0 on pointer up or cancel
- **Safety:** Always sends release, even if pointer leaves button

**Use Cases:**

- Horn/beep
- Door unlock
- Pump prime
- Slide extend/retract
- Awning extend/retract
- Any momentary action

**Props:**

- `component: ButtonComponent` (schema definition)
- `onAction?: (pressed: boolean) => void` (optional callback)

**Example Usage:**

```json
{
  "type": "button",
  "variant": "round",
  "label": "Horn",
  "icon": "horn",
  "bindings": {
    "action": {
      "type": "empirbus",
      "channel": "core-05"
    }
  }
}
```

**Current Issues:**

- ✅ No known issues
- ✅ Pointer capture prevents missed releases
- ✅ ES2017 compliant

---

### 5. Slider Component

**File:** `packages/hmi-ui/src/components/Slider.tsx`

**Current Usage in Home:** ❌ **Not currently used**

**Capabilities:**

- ✅ Adjustable numeric value control
- ✅ WebSocket integration (Type 16, Cmd 4 - Dimmer messages)
- ✅ Horizontal and vertical orientations
- ✅ Min/max/step configuration
- ✅ Unit display
- ✅ Current value display
- ✅ Subscription feedback
- ✅ Drag-safe updates (no jumping)
- ✅ Disabled state
- ✅ Tooltip support

**Visual Display:**

```
┌─────────────────────────────────────┐
│  Temperature                        │
│  ├───────●─────────────────┤  72°F  │
│  60°                       85°      │
└─────────────────────────────────────┘
```

**Orientation Variants:**

- **Horizontal:** Left-right slider (default)
- **Vertical:** Bottom-top slider (for specialized UIs)

**WebSocket Protocol:**

- Sends: Dimmer message (0-100% scaled from slider range)
- Receives: Dimmer state updates
- Scaling: Slider range (min-max) ↔ Percentage (0-100%)

**Use Cases:**

- Temperature setpoints
- Fan speeds
- Pump speeds
- Audio volume
- Any continuous value adjustment

**Props:**

- `component: SliderComponent` (schema definition)
- `value?: number` (optional override)
- `onChange?: (value: number) => void` (optional callback)

**Example Usage:**

```json
{
  "type": "slider",
  "label": "Temperature",
  "min": 60,
  "max": 85,
  "step": 1,
  "unit": "°F",
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "core-heating-setpoint"
    }
  }
}
```

**Current Issues:**

- ✅ No known issues
- ✅ Prevents slider jumping during drag
- ✅ ES2017 compliant

---

### 6. Indicator Component

**File:** `packages/hmi-ui/src/components/Indicator.tsx`

**Current Usage in Home:** ❌ **Not currently used**

**Capabilities:**

- ✅ Read-only status light/LED
- ✅ WebSocket integration (Type 16, Cmd 1 - Toggle state)
- ✅ Multiple variants: `led`, `badge`, `icon`
- ✅ State types: `on`, `off`, `warning`, `error`
- ✅ Static binding support
- ✅ Subscription feedback

**Visual Variants:**

1. **LED:**

```
┌─────────────┐
│ ● Running   │
└─────────────┘
```

2. **Badge:**

```
┌─────────────┐
│ [ON] System │
└─────────────┘
```

3. **Icon:**

```
┌─────────────┐
│  ⚠️ Warning │
└─────────────┘
```

**State Colors:**

- **On:** Green (active/running)
- **Off:** Gray (inactive/stopped)
- **Warning:** Yellow/orange (attention needed)
- **Error:** Red (critical issue)

**WebSocket Protocol:**

- Receives: Type 16, Cmd 1 toggle state
- Extracts: `state.state` boolean
- No sending (read-only component)

**Use Cases:**

- System status (generator running, pump on, etc.)
- Fault indicators
- Connection status
- Door/window open/closed
- Any binary status display

**Props:**

- `component: IndicatorComponent` (schema definition)
- `value?: boolean | 'warning' | 'error'` (optional override)

**Example Usage:**

```json
{
  "type": "indicator",
  "variant": "led",
  "label": "Generator Running",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "generator-status"
    }
  }
}
```

**Current Issues:**

- ✅ No known issues
- ✅ Supports static bindings for testing
- ✅ ES2017 compliant

---

## 🔍 Current Home Tab Analysis

### Section 1: Quick Controls

**Purpose:** Frequently-used controls for quick access

**Current Components:**

1. **Stabilizer (Dimmer)** - Core channel 1
   - ✅ Working correctly
   - ✅ On/off toggle + intensity slider
   - ✅ Bound to hardware channel
   - ✅ Icon: 💧

2. **Slide Motor (Toggle)** - Core channel 9
   - ✅ Working correctly
   - ✅ Round variant toggle button
   - ✅ Bound to hardware channel
   - ✅ Icon: plumbing

**Issues:**

- ❌ **Limited components** - Only 2 components for "quick controls"
- ⚠️ **Not user-customized** - Should allow users to add their favorites
- ⚠️ **Mixed purposes** - Stabilizer and Slide Motor don't seem related

**Recommendations:**

1. Add more common controls:
   - Water pump toggle
   - Awning extend/retract buttons
   - All Lights master toggle
   - Kitchen/galley lights
2. Allow user customization in web configurator
3. Group related controls together

---

### Section 2: Status

**Purpose:** At-a-glance system monitoring

**Current Components:**

1. **State of Charge (Gauge)** - Battery SOC
   - ⚠️ **Static binding (value: 0)** - Shows 0% always
   - 🔲 **TODO:** Bind to Cerbo GX battery SOC signal
   - ✅ Numeric gauge variant
   - ✅ Unit: %

2. **Solar Voltage (Gauge)** - Solar panel voltage
   - ⚠️ **Static binding (value: 0)** - Shows 0V always
   - 🔲 **TODO:** Bind to Cerbo GX solar voltage signal
   - ✅ Numeric gauge variant
   - ✅ Unit: V, 1 decimal place

**Issues:**

- ❌ **Static bindings** - Gauges don't show real data
- ❌ **Limited metrics** - Only 2 status indicators
- ❌ **No variety** - Both are numeric gauges (could use circular/linear)

**Recommendations:**

1. Update bindings to EmpirBus signals:
   ```json
   {
     "bindings": {
       "value": {
         "type": "empirbus",
         "channel": "cerbo-battery-soc"
       }
     }
   }
   ```
2. Add more status indicators:
   - Battery voltage
   - Solar power (Watts)
   - Tank levels
   - AC input/output
   - Temperature readings
3. Use variety of gauge variants:
   - Circular for battery SOC
   - Linear for tank levels
   - Numeric for voltages

---

## 📋 Component Enhancement Checklist

### Immediate Fixes (HIGH Priority)

#### 1. Fix Static Bindings

- [ ] Update Battery SOC gauge binding to Cerbo GX signal
- [ ] Update Solar Voltage gauge binding to Cerbo GX signal
- [ ] Test with real device to verify data display
- [ ] Add fallback values if signal not available

#### 2. Add More Quick Controls

- [ ] Add water pump toggle
- [ ] Add awning control buttons
- [ ] Add master lights toggle
- [ ] Add kitchen/galley lights dimmer
- [ ] Allow user to customize via web configurator

#### 3. Add More Status Indicators

- [ ] Battery voltage gauge
- [ ] Solar power gauge (Watts)
- [ ] Fresh water tank indicator
- [ ] AC input status indicator
- [ ] Temperature gauge (cabin temp)

### Component Improvements (MEDIUM Priority)

#### 4. Enable Component Property

- [ ] Add `enabled` property to component schema
- [ ] Filter disabled components in Section.tsx
- [ ] Update web configurator to toggle enabled state
- [ ] Add visual indicator for disabled components in editor

#### 5. Component Validation

- [ ] Validate bindings against available hardware
- [ ] Show warnings for invalid channel references
- [ ] Auto-disable components with missing bindings
- [ ] Add binding validation to export process

#### 6. Empty State Handling

- [ ] Show message when section has no enabled components
- [ ] Hide section title if empty
- [ ] Add "Add Component" prompt in empty sections

### Advanced Features (LOW Priority)

#### 7. Component Groups

- [ ] Allow grouping related components
- [ ] Collapsible groups
- [ ] Group headers with icons

#### 8. Component Templates

- [ ] Quick Controls preset (common switches)
- [ ] Power Monitoring preset (battery, solar, AC gauges)
- [ ] Tank Levels preset (all tank gauges)
- [ ] HVAC preset (temp controls)

#### 9. Favorites System

- [ ] Pin favorite components to Home tab
- [ ] Quick-add from other tabs
- [ ] Reorder by drag-and-drop

---

## 🎯 Next Steps

### Immediate Actions

1. **Fix Gauge Bindings (30 min)**
   - Update schema with correct EmpirBus signal references
   - Test on device
   - Verify data display

2. **Add Component Enablement (2 hours)**
   - Add `enabled` property to schema
   - Update Section.tsx to filter
   - Update web configurator UI
   - Test enable/disable functionality

3. **Add More Home Components (1 hour)**
   - Add 3-5 common quick controls
   - Add 3-5 common status indicators
   - Balance section sizes
   - Test responsive layout

### Component-by-Component Enhancement Plan

**Week 1: Toggle Component**

- Review current implementation ✅ (Already complete)
- No changes needed
- Document usage patterns

**Week 2: Dimmer Component**

- Review current implementation ✅ (Already complete)
- No changes needed
- Document usage patterns

**Week 3: Gauge Component**

- Fix static bindings
- Add variant examples (circular, linear, numeric)
- Add color-coded ranges (green/yellow/red)
- Add trend indicators (↑↓ arrows)

**Week 4: Button Component**

- Add to Home tab examples
- Create common button patterns (Horn, Door, etc.)
- Document use cases

**Week 5: Slider Component**

- Add to Home tab examples
- Create temperature control example
- Document use cases

**Week 6: Indicator Component**

- Add to Home tab Status section
- Create status light examples
- Add warning/error states
- Document use cases

---

## 📊 Component Usage Summary

| Component | Implemented | Used in Home | Binding Status | Priority       |
| --------- | ----------- | ------------ | -------------- | -------------- |
| Toggle    | ✅ Complete | ✅ Yes (1x)  | ✅ Working     | 🟢 Good        |
| Dimmer    | ✅ Complete | ✅ Yes (1x)  | ✅ Working     | 🟢 Good        |
| Gauge     | ✅ Complete | ✅ Yes (2x)  | ⚠️ Static      | 🔴 Fix Now     |
| Button    | ✅ Complete | ❌ No        | N/A            | 🟡 Add Example |
| Slider    | ✅ Complete | ❌ No        | N/A            | 🟡 Add Example |
| Indicator | ✅ Complete | ❌ No        | N/A            | 🟡 Add Example |

**Overall Home Tab Status:** ⚠️ **Partial** - Working but needs enhancements

---

## 🔧 Technical Details

### WebSocket Integration

All components use the same WebSocket adapter pattern:

```typescript
import { getWebSocketAdapter } from '../state/websocket-state';

const wsAdapter = getWebSocketAdapter();
if (wsAdapter && wsAdapter.isConnected()) {
  wsAdapter.send(message);
}
```

### Signal State Subscription

All components use the same signal state pattern:

```typescript
import { getSignalState } from '../state/signal-state';

const signalState = signalId !== null ? getSignalState(signalId) : null;

const currentValue = useComputed(() => {
  if (signalState && signalState.value) {
    return signalState.value.value;
  }
  return defaultValue;
});
```

### Binding Resolution

All components use the same binding resolver:

```typescript
import { resolveBindingToChannelId } from '../utils/binding-resolver';

const signalId = resolveBindingToChannelId(binding, 'toggle'); // or 'dimmer', 'momentary'
```

This provides:

- ✅ Consistent WebSocket integration
- ✅ Unified state management
- ✅ Reliable signal resolution
- ✅ Predictable behavior across all components

---

## 📚 Documentation References

- `docs/HOME_TAB_LAYOUT.md` - Layout system documentation
- `docs/HOME_TAB_CONFIGURATION.md` - Configuration guide
- `docs/HOME_TAB_USAGE_GUIDE.md` - User guide
- `docs/HMI_COMPONENT_DESIGN_SYSTEM.md` - Component design system
- `docs/COMPONENT_BINDING_GUIDE.md` - Binding documentation

---

**Last Updated:** October 14, 2025  
**Components Reviewed:** 6/6  
**Status:** Ready for Enhancement Planning
