# Solar Power System Configuration

## Overview

Added solar power system configuration to the Power Configuration page, allowing users to enable solar arrays with automatic primary array inclusion and optional auxiliary array support.

**Date**: October 7, 2025  
**Feature**: Solar power configuration with primary and auxiliary arrays

## Schema Changes

### PowerConfigSchema Update

Added new `solar` configuration object to the power schema:

```typescript
solar: z.object({
  enabled: z.boolean().default(false),
  primaryArray: z.boolean().default(true), // Always enabled when solar is enabled
  auxiliaryArray: z.boolean().default(false),
}).default({
  enabled: false,
  primaryArray: true,
  auxiliaryArray: false,
});
```

**Location**: `packages/schema/src/schema.ts`

### Type Definition

```typescript
export type PowerConfig = {
  dcCharging: {
    secondAlternator: boolean;
    orionXs: boolean;
  };
  solar: {
    enabled: boolean;
    primaryArray: boolean;
    auxiliaryArray: boolean;
  };
  acLegs: number;
  multiplus: {
    l1: boolean;
    l2: boolean;
  };
};
```

## UI Implementation

### Solar Configuration Section

**Location**: `packages/web-configurator/src/pages/PowerConfigPage.tsx`

#### Features

1. **Toggle Switch Header**
   - Enable/disable entire solar system with a toggle switch
   - Located in section header for easy access
   - Clear visual state indication

2. **Primary Array (Always Enabled)**
   - Automatically enabled when solar system is turned on
   - Checkbox displayed but disabled (read-only state)
   - Visual indication with checkmark always shown
   - Label: "Main solar array (always included)"

3. **Auxiliary Array (Optional)**
   - Can be toggled on/off when solar system is enabled
   - Interactive checkbox
   - Label: "Additional solar array"

4. **Information Box**
   - Displays when solar is enabled
   - Explains monitoring via Victron SmartSolar MPPT controllers
   - Notes Venus GX/Cerbo GX connectivity requirement

### Business Logic

```typescript
const updateSolar = (updates: Partial<PowerConfig['solar']>) => {
  const newSolar = {
    ...power.solar,
    ...updates,
  };

  // When enabling solar, always enable primary array
  if (updates.enabled === true) {
    newSolar.primaryArray = true;
  }

  // When disabling solar, disable auxiliary array too
  if (updates.enabled === false) {
    newSolar.auxiliaryArray = false;
  }

  updatePower({
    solar: newSolar,
  });
};
```

**Rules**:

1. Enabling solar → Primary array automatically enabled
2. Disabling solar → Auxiliary array automatically disabled
3. Primary array cannot be manually disabled while solar is enabled
4. Auxiliary array can only be toggled when solar is enabled

## UI Components

### Toggle Switch Styling

Added new CSS components for the solar section:

```css
.titleRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  flex-shrink: 0;
}

.slider {
  /* iOS-style toggle switch */
  background-color: #cbd5e1; /* Off state */
  border-radius: 34px;
  transition: 0.4s;
}

.switch input:checked + .slider {
  background-color: var(--color-primary); /* On state */
}
```

**Location**: `packages/web-configurator/src/pages/PowerConfigPage.module.css`

## Configuration Summary

The summary section now includes solar information:

```tsx
<div className={styles.summaryItem}>
  <div className={styles.summaryLabel}>Solar Power</div>
  <div className={styles.summaryValue}>
    {power.solar.enabled ? (
      <ul>
        <li>Primary Array</li>
        {power.solar.auxiliaryArray && <li>Auxiliary Array</li>}
      </ul>
    ) : (
      'Not configured'
    )}
  </div>
</div>
```

### Summary Display States

| Solar State | Primary | Auxiliary | Display                                |
| ----------- | ------- | --------- | -------------------------------------- |
| Disabled    | N/A     | N/A       | "Not configured"                       |
| Enabled     | ✓       | ✗         | "• Primary Array"                      |
| Enabled     | ✓       | ✓         | "• Primary Array<br>• Auxiliary Array" |

## Context Default Values

Updated `SchemaContext.tsx` to include solar defaults:

```typescript
power: {
  dcCharging: {
    secondAlternator: false,
    orionXs: false,
  },
  solar: {
    enabled: false,
    primaryArray: true,
    auxiliaryArray: false,
  },
  acLegs: 2,
  multiplus: {
    l1: false,
    l2: false,
  },
}
```

## User Flow

### Enabling Solar

1. User toggles "Solar Power System" switch to ON
2. Section expands showing array options
3. Primary Array checkbox automatically checked and disabled
4. Auxiliary Array checkbox available for selection
5. Info box appears with MPPT monitoring details

### Adding Auxiliary Array

1. Solar system must be enabled first
2. User checks "Auxiliary Array" checkbox
3. Change reflected immediately in summary section
4. Both arrays now shown in configuration

### Disabling Solar

1. User toggles "Solar Power System" switch to OFF
2. Section collapses
3. Auxiliary array setting automatically cleared
4. Summary shows "Not configured"

## Visual Layout

```
┌──────────────────────────────────────────────────────┐
│ ☀️ Solar Power System              [Toggle Switch]  │
│ Configure solar array charging system                │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────────┐  ┌─────────────────────┐ │
│  │ ☀️  Primary Array   │  │ 🌤️  Auxiliary Array│ │
│  │  (always included)  │  │  (optional)         │ │
│  │          ✓          │  │                     │ │
│  └──────────────────────┘  └─────────────────────┘ │
│                                                       │
│  ℹ️ Note: Solar arrays monitored via SmartSolar...  │
└──────────────────────────────────────────────────────┘
```

## Technical Details

### Files Modified

1. **packages/schema/src/schema.ts**
   - Added `solar` object to `PowerConfigSchema`
   - Includes `enabled`, `primaryArray`, `auxiliaryArray` fields

2. **packages/web-configurator/src/pages/PowerConfigPage.tsx**
   - Added `updateSolar()` handler with business logic
   - Added Solar section UI with toggle and checkboxes
   - Updated summary section to include solar info
   - Updated default power config to include solar

3. **packages/web-configurator/src/pages/PowerConfigPage.module.css**
   - Added `.titleRow` for header layout
   - Added `.switch` and `.slider` for toggle styling

4. **packages/web-configurator/src/context/SchemaContext.tsx**
   - Updated default schema to include solar configuration

### Build Verification

```bash
✅ packages/schema build - Done in 84ms
✅ packages/hmi-ui build - Done in 953ms
✅ packages/web-configurator build - Done in 3.4s

Bundle sizes:
- CSS: 76.29 kB (gzip: 11.45 kB)
- JS: 453.75 kB (gzip: 128.02 kB)
```

## Integration Points

### EmpirBus Signal Mapping

When solar is enabled, the system should monitor:

- Primary Array: `solar-primary-voltage`, `solar-primary-current`, `solar-primary-power`
- Auxiliary Array: `solar-aux-voltage`, `solar-aux-current`, `solar-aux-power`

### Victron Integration

- SmartSolar MPPT controllers provide charging data
- Venus GX/Cerbo GX acts as data aggregator
- NMEA2000 or VE.Direct protocol for communication

## Benefits

1. **User-Friendly**: Simple toggle to enable/disable entire system
2. **Smart Defaults**: Primary array always included automatically
3. **Flexibility**: Optional auxiliary array for expandability
4. **Consistent UX**: Matches patterns from other configuration sections
5. **Clear Feedback**: Summary section shows complete solar configuration
6. **Safe Configuration**: Prevents invalid states (e.g., auxiliary without solar)

## Future Enhancements

Potential additions for future versions:

- Multiple auxiliary arrays (expandable beyond 2 total)
- Array wattage/size configuration
- MPPT controller model selection
- Battery bank integration
- Solar production forecasting
- Historical data visualization

---

**Status**: ✅ Complete  
**Build**: Passing  
**Feature**: Solar power configuration with primary and auxiliary arrays  
**User Flow**: Tested and validated
