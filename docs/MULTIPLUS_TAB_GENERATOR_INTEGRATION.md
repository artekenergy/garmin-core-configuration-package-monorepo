# Multiplus Tab Generator Integration Complete

**Date:** October 16, 2025  
**Status:** ✅ Deployed - Ready for Device Testing

## Summary

Successfully integrated the MultiplusControl component into the tab generator system. The Power tab now automatically generates Multiplus L1 and L2 control components based on the `schema.power.multiplus` configuration.

## What Was Changed

### 1. Tab Generator Updates (`tabGenerator.ts`)

Added `applyPowerConfig()` function that:

- Checks `schema.power.multiplus.l1` and `.l2` flags
- Creates or ensures `section-ac-power` section exists
- Generates multiplus-control components with proper bindings
- Maps to hardware config signal channels

### 2. Component Generation Logic

When `power.multiplus.l1 = true`:

```typescript
{
  id: 'comp-multiplus-l1',
  type: 'multiplus-control',
  label: 'Multiplus L1',
  leg: 1,
  bindings: {
    acInVoltage: { channel: 'signal-leg-one-ac-in-voltage' },
    acOutVoltage: { channel: 'signal-leg-one-ac-out-voltage' },
    acOutCurrent: { channel: 'signal-leg-one-ac-out-amperage' },
    modeOff: { channel: 'press-multiplus-off' },
    modeOn: { channel: 'press-multi-on' },
    modeChargerOnly: { channel: 'press-multiplus-charger-only' }
  }
}
```

When `power.multiplus.l2 = true`:

```typescript
{
  id: 'comp-multiplus-l2',
  type: 'multiplus-control',
  label: 'Multiplus L2',
  leg: 2,
  bindings: {
    acInVoltage: { channel: 'signal-leg-two-ac-in-voltage' },
    acOutVoltage: { channel: 'signal-leg-two-ac-out-voltage' },
    acOutCurrent: { channel: 'signal-leg-two-ac-out-amperage' },
    modeOff: { channel: 'press-multiplus-two-off' },
    modeOn: { channel: 'press-multiplus-two-on' },
    modeChargerOnly: { channel: 'press-multiplus-two-charger-only' }
  }
}
```

## Hardware Signal Mapping

### AC Leg 1 Signals (L1)

| Binding         | Channel Name                   | Signal ID |
| --------------- | ------------------------------ | --------- |
| acInVoltage     | signal-leg-one-ac-in-voltage   | 151       |
| acOutVoltage    | signal-leg-one-ac-out-voltage  | 154       |
| acOutCurrent    | signal-leg-one-ac-out-amperage | 155       |
| modeOff         | press-multiplus-off            | 132       |
| modeOn          | press-multi-on                 | 133       |
| modeChargerOnly | press-multiplus-charger-only   | 134       |

### AC Leg 2 Signals (L2)

| Binding         | Channel Name                     | Signal ID |
| --------------- | -------------------------------- | --------- |
| acInVoltage     | signal-leg-two-ac-in-voltage     | TBD       |
| acOutVoltage    | signal-leg-two-ac-out-voltage    | TBD       |
| acOutCurrent    | signal-leg-two-ac-out-amperage   | TBD       |
| modeOff         | press-multiplus-two-off          | TBD       |
| modeOn          | press-multiplus-two-on           | TBD       |
| modeChargerOnly | press-multiplus-two-charger-only | TBD       |

**Note:** L2 signal IDs need to be verified in hardware-config.json

## Files Modified

1. **`packages/hmi-ui/src/utils/tabGenerator.ts`**
   - Added `applyPowerConfig()` function (lines 167-270)
   - Updated `regenerateTabContent()` to call power config (line 293)

## Build Results

```
✓ Schema package built successfully
✓ HMI UI built successfully
  - Bundle size: 216.04 kB (gzip: 38.25 kB)
  - Increase from 213.54 kB: +2.5 kB (expected for new component)
✓ Web configurator built successfully
✓ Deployment package created: garmin-hmi-deployment-20251016_095651.zip (780K)
```

## Current Schema Configuration

The default schema.json currently has:

```json
{
  "power": {
    "batteryManagement": "victron",
    "acLegs": 2,
    "multiplus": {
      "l1": true,
      "l2": true
    }
  }
}
```

This means **both** Multiplus L1 and L2 controls will appear on the Power tab when the app loads.

## How It Works

1. **Schema Load** → `schema-loader.ts` loads schema.json
2. **Tab Generation** → `tabGenerator.ts` processes each tab
3. **Power Tab Detection** → Checks if `tab.preset === 'power'`
4. **Config Application** → `applyPowerConfig()` runs
5. **Component Creation** → Multiplus components added to `section-ac-power`
6. **Rendering** → ComponentRenderer displays MultiplusControl components

## Testing Checklist

When you deploy to the device:

### Visual Checks

- [ ] Navigate to Power tab
- [ ] Verify "AC Power" section exists
- [ ] Check Multiplus L1 control is visible
- [ ] Check Multiplus L2 control is visible
- [ ] Verify layout matches design (2x2 grid for readings, 3 buttons)

### Functional Checks

- [ ] AC IN voltage displays correctly (should show ~120V when on shore power)
- [ ] AC OUT voltage displays correctly
- [ ] AC OUT current displays correctly (shows load in amps)
- [ ] OFF button sends press/release to signal 132
- [ ] ON button sends press/release to signal 133
- [ ] CHARGER button sends press/release to signal 134
- [ ] Active mode button highlights correctly

### WebSocket Checks

- [ ] Open browser DevTools console
- [ ] Look for "[MultiplusControl]" log messages
- [ ] Verify press/release messages logged when buttons clicked
- [ ] Confirm channel IDs resolve correctly

## Next Steps

### Immediate

1. **Upload Package** - Deploy `garmin-hmi-deployment-20251016_095651.zip` to device
2. **Test on Device** - Verify all functionality works
3. **Verify Signal IDs** - Confirm L2 signal mappings in hardware config

### Future Enhancements

1. **Add Individual Components** - Gauges for AC voltage/current outside composite
2. **Add Generator Control** - Similar pattern for generator start/stop
3. **Add Shore Power Indicator** - Show when plugged in vs. inverter mode
4. **Add Power Consumption Graph** - Historical AC usage visualization
5. **Add Battery State of Charge** - Integration with Victron BMV/SmartShunt

## Web Configurator Updates

The web configurator now includes these changes in its export package. Users can:

1. Open http://localhost:3000
2. Navigate to Power tab configuration
3. Enable/disable `multiplus.l1` and `multiplus.l2`
4. Export generates schema with proper settings
5. HMI UI automatically creates controls when enabled

## Documentation

See also:

- `MULTIPLUS_CONTROL_COMPONENT.md` - Component implementation details
- `HARDWARE_CONFIG_QUICKSTART.md` - Signal mapping reference
- `COMPONENT_BINDING_GUIDE.md` - Binding system overview
