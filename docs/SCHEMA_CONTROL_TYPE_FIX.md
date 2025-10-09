# Schema Control Type Fix - October 3, 2025

## Issue

Schema validation failed when loading the updated hardware configuration because the Zod schema definition was missing control types used by the extraction script.

### Error Message

```
Schema validation failed: hardware.outputs.0.control: Invalid enum value.
Expected 'not-used' | 'push-button' | 'toggle-button' | 'slider' | 'half-bridge',
received 'dimmer'
```

This error occurred for all 16 dimmer channels and 2 special-function channels.

## Root Cause

**Mismatch between extraction script and schema definition:**

### Extraction Script Output (`extract-empirbus-channels.py`)

Generated these control types based on EmpirBus signal names:

- `"dimmer"` - Channels with DCU (Dimmer Control Unit) signals
- `"toggle-button"` - Channels with only toggle/mom signals
- `"special-function"` - Channels with special function settings

### Schema Definition (`packages/schema/src/schema.ts`)

Only accepted these control types:

```typescript
export const OutputControlTypeSchema = z.enum([
  'not-used',
  'push-button',
  'toggle-button',
  'slider',
  'half-bridge',
]);
```

**Missing:** `'dimmer'` and `'special-function'`

## Solution

Updated the schema to include all control types used by the extraction script:

```typescript
export const OutputControlTypeSchema = z.enum([
  'not-used',
  'push-button',
  'toggle-button',
  'slider',
  'half-bridge',
  'dimmer', // ✅ ADDED
  'special-function', // ✅ ADDED
]);
```

## Files Changed

### 1. Schema Definition

**File:** `packages/schema/src/schema.ts`  
**Lines:** 242-249

**Before:**

```typescript
export const OutputControlTypeSchema = z.enum([
  'not-used',
  'push-button',
  'toggle-button',
  'slider',
  'half-bridge',
]);
```

**After:**

```typescript
export const OutputControlTypeSchema = z.enum([
  'not-used',
  'push-button',
  'toggle-button',
  'slider',
  'half-bridge',
  'dimmer',
  'special-function',
]);
```

### 2. Rebuild and Redeploy

```bash
# Rebuild schema package
pnpm --filter @gcg/schema build

# Rebuild HMI UI with updated schema
pnpm --filter @gcg/hmi-ui build

# Create new deployment package
pnpm --filter @gcg/hmi-ui deploy:web
```

## Verification

### ✅ Schema Tests Pass

```bash
pnpm --filter @gcg/schema test
# 19 tests passed
```

### ✅ Build Succeeds

```bash
pnpm --filter @gcg/hmi-ui build
# Build successful, no errors
```

### ✅ Deployment Package Created

```
Location: garmin-hmi-deployment-20251003_143857.zip
Size: 752K
Status: Ready for device upload
```

## Control Type Mapping Reference

| Control Type       | Component Type | Description                       | Channels    |
| ------------------ | -------------- | --------------------------------- | ----------- |
| `dimmer`           | `dimmer`       | Intensity control (0-100%)        | 16 channels |
| `toggle-button`    | `toggle`       | Simple on/off control             | 5 channels  |
| `special-function` | `button`       | Custom function, momentary action | 2 channels  |
| `not-used`         | -              | Channel not configured            | -           |
| `push-button`      | `button`       | Momentary action                  | Legacy      |
| `slider`           | `dimmer`       | Slider control (legacy name)      | Legacy      |
| `half-bridge`      | `dimmer`       | H-bridge motor control            | Legacy      |

## Hardware Configuration Now Valid

All 23 channels in the hardware config now validate correctly:

```json
{
  "systemType": "core",
  "outputs": [
    {
      "id": "core-01",
      "channel": 1,
      "control": "dimmer", // ✅ Now valid
      "label": "Core 1"
    },
    // ... 15 more dimmer channels
    {
      "id": "core-03",
      "channel": 3,
      "control": "toggle-button", // ✅ Valid
      "label": "Core 3"
    },
    // ... 4 more toggle channels
    {
      "id": "core-11",
      "channel": 11,
      "control": "special-function", // ✅ Now valid
      "label": "Core 11"
    }
    // ... 1 more special function channel
  ]
}
```

## Impact

### Schema Package (`@gcg/schema`)

- ✅ Type definitions updated
- ✅ All tests passing
- ✅ Type safety maintained
- ✅ Backward compatible (old types still valid)

### HMI UI (`@gcg/hmi-ui`)

- ✅ Schema loads without validation errors
- ✅ All 23 hardware channels recognized
- ✅ Correct component types assigned
- ✅ Ready for device testing

### Web Configurator (`@gcg/web-configurator`)

- ⚠️ Needs update to use new control type names
- Current: Uses `"push-button"`, `"slider"` (legacy)
- Should use: `"special-function"`, `"dimmer"` (consistent)

## Next Steps

### 1. Update Web Configurator (Optional)

Update `CONTROL_COMPONENT_MAP` to use consistent naming:

**File:** `packages/web-configurator/src/constants/hardware.ts`

```typescript
export const CONTROL_COMPONENT_MAP = {
  'not-used': null,
  'special-function': {
    // Changed from "push-button"
    component: 'button' as const,
    action: 'momentary' as const,
  },
  'toggle-button': {
    component: 'toggle' as const,
  },
  dimmer: {
    // Changed from "slider"
    component: 'dimmer' as const,
  },
  'half-bridge': {
    component: 'dimmer' as const,
  },
} as const;
```

### 2. Device Testing

Upload `garmin-hmi-deployment-20251003_143857.zip` to Garmin device and verify:

- Schema loads without errors
- All 23 channels available
- Toggle channels (3, 4, 6, 7, 8) functional
- Physical outputs respond correctly

### 3. Documentation Updates

- ✅ Integration flow documented
- ✅ Control type mapping documented
- ⏸️ Update web configurator docs after naming update

## Lessons Learned

1. **Keep extraction script and schema in sync**: Control type enums must match between data generation and validation
2. **Test full pipeline**: Validate that generated configs can be loaded by the app
3. **Consistent naming**: Use the same control type names across all components
4. **Schema as source of truth**: Schema package defines valid values, all other code must align

## Status

✅ **RESOLVED** - Schema validation now works with full hardware configuration  
✅ **DEPLOYED** - New package ready for device testing  
⏸️ **PENDING** - Web configurator naming consistency update (optional)

---

**Fixed by:** Schema package update  
**Date:** October 3, 2025  
**Deployment:** garmin-hmi-deployment-20251003_143857.zip
