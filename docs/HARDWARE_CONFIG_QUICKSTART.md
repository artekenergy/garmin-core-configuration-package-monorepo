# Hardware Configuration Feature - Quick Start

## What We Just Built 🚀

Added a complete **Hardware Configuration** page to the web configurator with:

- ✅ **System type selection** (CORE vs CORE LITE)
- ✅ **20 output channels** for CORE, 10 for CORE LITE
- ✅ **Control type mapping** (push-button → momentary, toggle → toggle, slider → dimmer)
- ✅ **Half-bridge pairing** for motor control (CORE channels 3+4, 12+13)
- ✅ **Signal ID assignment** for protocol communication
- ✅ **Visual channel cards** with labels, status badges, and summaries

## Files Created/Modified

### Schema Package
- `packages/schema/src/schema.ts` - Added hardware config types

### Web Configurator
- `packages/web-configurator/src/constants/hardware.ts` - Channel definitions & utilities
- `packages/web-configurator/src/pages/HardwareConfigPage.tsx` - Main UI component
- `packages/web-configurator/src/pages/HardwareConfigPage.module.css` - Styles
- `packages/web-configurator/src/App.tsx` - Added `/hardware` route
- `packages/web-configurator/src/components/Layout.tsx` - Added Hardware nav link
- `packages/web-configurator/src/context/SchemaContext.tsx` - Updated default schema

## How to Test

1. **Dev server is already running** at http://localhost:3000
2. Navigate to **🔌 Hardware** tab (should be default)
3. Try these actions:

### Test System Type Switching
- Click "CORE LITE" radio button
- Observe: Channel count changes from 20 → 10
- Click "CORE" radio button
- Observe: Channel count changes back to 20

### Test Channel Configuration
- Find "CORE #1" card
- Change control dropdown to "Toggle Button"
- Type "Galley Lights" in label field
- Observe: Signal ID shows "Signal: 1", Component shows "→ toggle"

### Test Half-Bridge Pairing (CORE only)
- Find "CORE #12" card
- Change control to "Half-Bridge Pair"
- Observe:
  - ✅ Both #12 and #13 show "PAIRED" badge
  - ✅ Both forced to "slider" control
  - ✅ Channel #13 label input disabled (reads from #12)
  - ✅ "Half-Bridge Pairs" section shows "CORE #12 + #13" as "ENABLED"

### Test Summary Statistics
- Configure a few channels with different control types
- Scroll to "Summary" section
- Observe: Counts update in real-time

## Schema Structure

When you configure hardware, the schema now looks like:

```json
{
  "schemaVersion": "0.1.0",
  "metadata": { ... },
  "hardware": {
    "systemType": "core",
    "outputs": [
      {
        "id": "core-01",
        "source": "core",
        "channel": 1,
        "label": "Galley Lights",
        "control": "toggle-button",
        "signalId": 100
      }
    ],
    "halfBridgePairs": [
      {
        "source": "core",
        "channelA": 12,
        "channelB": 13,
        "enabled": true
      }
    ]
  },
  "tabs": [ ... ]
}
```

## What's Next?

This hardware configuration is the **foundation** for:

1. **Visual Editor** (Phase 2.2) - Drag channels to tabs/sections
2. **Preview Page** (Phase 2.3) - Render actual UI components with bindings
3. **Export Page** (Phase 2.4) - Generate config.zip with channel mappings

## Key Concepts

### Control Type → Component Mapping

| Control Type    | HMI Component | Width | Use Case |
|----------------|---------------|-------|----------|
| Push Button    | `button` (momentary) | 3 units | Door locks, horn |
| Toggle Button  | `toggle` | 3 units | Lights, fans, pumps |
| Slider         | `dimmer` | 6 units | Dimmable lights, PWM |
| Half-Bridge    | `dimmer` (bidirectional) | 6 units | Motors, awnings |

### CORE Channels (20 total)
Non-sequential: 1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 17-21, 25-29

### CORE LITE Channels (10 total)
- 6 CORE-LITE: 1-6
- 4 Genesis: 1-4

## Troubleshooting

### Schema Validation Errors
Check the header for error badge. Hardware config is validated automatically via `@gcg/schema`.

### TypeScript Errors
All files have zero compilation errors. If you see errors, try:
```bash
cd packages/web-configurator
pnpm run build
```

### Dev Server Issues
Server is running on port 3000. If you need to restart:
```bash
cd packages/web-configurator
pnpm dev
```

## Documentation

Full implementation details in: `HARDWARE_CONFIG_IMPLEMENTATION.md`

---

**Status:** ✅ Ready to use  
**Test URL:** http://localhost:3000/hardware
