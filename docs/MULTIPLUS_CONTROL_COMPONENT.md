# MultiplusControl Component Implementation

**Date:** January 16, 2025  
**Status:** ✅ Complete - Ready for Tab Generator Integration

## Overview

Created a new composite component for controlling Victron MultiPlus inverter/chargers. This component combines multiple signal readings and control buttons into a unified interface.

## Component Features

### Visual Layout

```
┌─────────────────────────────┐
│      Multiplus L1/L2        │
├─────────────────────────────┤
│  AC IN      │  AC OUT       │
│   120V      │   118V        │
├─────────────────────────────┤
│      CURRENT: 15.2A         │
├─────────────────────────────┤
│  [Off] [On] [Charger Only]  │
└─────────────────────────────┘
```

### Functionality

- **AC Input Voltage Display** - Shows incoming AC voltage
- **AC Output Voltage Display** - Shows outgoing AC voltage
- **AC Output Current Display** - Shows current draw in amps
- **Mode Control Buttons** - Three momentary buttons:
  - **OFF** - Turn inverter/charger off
  - **ON** - Turn inverter/charger on
  - **CHARGER** - Charger-only mode (no inverter)

### Signal Bindings

The component supports these optional bindings:

| Binding           | Type     | Purpose                         | Example Signal ID |
| ----------------- | -------- | ------------------------------- | ----------------- |
| `acInVoltage`     | empirbus | Input AC voltage reading        | 151               |
| `acOutVoltage`    | empirbus | Output AC voltage reading       | 154               |
| `acOutCurrent`    | empirbus | Output AC current reading       | 155               |
| `modeOff`         | empirbus | Momentary button - OFF mode     | 132               |
| `modeOn`          | empirbus | Momentary button - ON mode      | 133               |
| `modeChargerOnly` | empirbus | Momentary button - Charger mode | 134               |

## Files Created/Modified

### New Files

1. **`packages/hmi-ui/src/components/MultiplusControl.tsx`**
   - Main component implementation
   - Uses Preact signals for reactive state
   - WebSocket integration for hardware communication
   - ES2017 compliant (no optional chaining)

2. **`packages/hmi-ui/src/components/MultiplusControl.css`**
   - Component-specific styles
   - Grid layout for readings
   - Button states (normal, hover, active)
   - Responsive design for smaller screens

3. **`packages/schema/src/components/multiplus-control.ts`**
   - Zod schema definition
   - TypeScript type exports
   - Validation for bindings and properties

### Modified Files

1. **`packages/schema/src/components/index.ts`**
   - Added MultiplusControlComponentSchema to union
   - Exported multiplus-control types

2. **`packages/schema/src/types.ts`**
   - Added `'multiplus-control'` to ComponentType union

3. **`packages/hmi-ui/src/components/ComponentRenderer.tsx`**
   - Imported MultiplusControl component
   - Added case for 'multiplus-control' type
   - Fixed type safety in default case

## Component API

### TypeScript Interface

```typescript
interface MultiplusControlComponent {
  id: string;
  type: 'multiplus-control';
  label?: string; // Display label (default: "Multiplus L1" or "Multiplus L2")
  leg?: number; // AC leg number: 1 or 2 (default: 1)
  icon?: string;
  tooltip?: string;
  disabled?: boolean;
  visible?: boolean;
  bindings?: {
    acInVoltage?: Binding;
    acOutVoltage?: Binding;
    acOutCurrent?: Binding;
    modeOff?: Binding;
    modeOn?: Binding;
    modeChargerOnly?: Binding;
  };
}
```

### Example Component Definition

```json
{
  "id": "multiplus-l1",
  "type": "multiplus-control",
  "label": "Multiplus L1",
  "leg": 1,
  "bindings": {
    "acInVoltage": {
      "type": "empirbus",
      "channel": "signal-leg-one-ac-in-voltage",
      "property": "value"
    },
    "acOutVoltage": {
      "type": "empirbus",
      "channel": "signal-leg-one-ac-out-voltage",
      "property": "value"
    },
    "acOutCurrent": {
      "type": "empirbus",
      "channel": "signal-leg-one-ac-out-amperage",
      "property": "value"
    },
    "modeOff": {
      "type": "empirbus",
      "channel": "press-multiplus-off",
      "property": "state"
    },
    "modeOn": {
      "type": "empirbus",
      "channel": "press-multi-on",
      "property": "state"
    },
    "modeChargerOnly": {
      "type": "empirbus",
      "channel": "press-multiplus-charger-only",
      "property": "state"
    }
  }
}
```

## WebSocket Communication

### Mode Button Behavior

When a mode button is clicked:

1. Resolve binding to EmpirBus channel ID
2. Send press message (value = true)
3. Wait 100ms
4. Send release message (value = false)
5. Update local UI state

### Example WebSocket Messages

```javascript
// Button Press
{
  type: "toggle",
  channelId: 132,
  value: true
}

// Button Release (100ms later)
{
  type: "toggle",
  channelId: 132,
  value: false
}
```

## Integration Status

### ✅ Completed

- [x] Component TypeScript implementation
- [x] CSS styling with responsive design
- [x] Zod schema definition
- [x] Schema type exports
- [x] Component registry integration
- [x] WebSocket communication pattern
- [x] Type safety across packages
- [x] ES2017 compliance

### 🚧 Next Steps

1. **Tab Generator Integration**
   - Update `tabGenerator.ts` to create multiplus-control components
   - Read `schema.power.multiplus.l1` and `l2` flags
   - Map to hardware config signals (151, 154, 155, 132-134)

2. **Testing**
   - Build and deploy updated packages
   - Test on physical device
   - Verify WebSocket signal subscriptions
   - Test mode button actions

3. **Documentation**
   - Add to component documentation
   - Update schema examples

## Hardware Configuration Mapping

For Core board with Victron MultiPlus on AC Leg 1:

| UI Component Binding | Hardware Config Signal         | Signal ID |
| -------------------- | ------------------------------ | --------- |
| acInVoltage          | signal-leg-one-ac-in-voltage   | 151       |
| acOutVoltage         | signal-leg-one-ac-out-voltage  | 154       |
| acOutCurrent         | signal-leg-one-ac-out-amperage | 155       |
| modeOff              | press-multiplus-off            | 132       |
| modeOn               | press-multi-on                 | 133       |
| modeChargerOnly      | press-multiplus-charger-only   | 134       |

## Notes

- Component follows established patterns from Button.tsx and Gauge.tsx
- Uses resolveBindingToChannelId() for binding resolution
- Mode buttons use momentary action pattern (press + release)
- Local state tracks current mode for visual feedback
- Supports both L1 and L2 configurations via `leg` property
- All bindings are optional for flexible configurations
