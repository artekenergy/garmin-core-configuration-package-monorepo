# Schema Signals Null Value Fix

**Date:** October 3, 2025  
**Issue:** Hardware configuration validation failing with null signal values  
**Status:** ✅ Fixed

---

## Problem

The web configurator was throwing a schema validation error:

Schema validation failed:
hardware.outputs.2.signals.toggle: Expected number, received null;
hardware.outputs.2.signals.momentary: Expected number, received null;
hardware.outputs.2.signals.dimmer: Expected number, received null

### Root Cause

The `OutputChannelSchema` in `packages/schema/src/schema.ts` defined signal properties as:

```typescript
signals: z.object({
  toggle: z.number().int().positive().optional(),
  momentary: z.number().int().positive().optional(),
  dimmer: z.number().int().positive().optional(),
}).optional(),
```

This schema allowed:

- ✅ A number (positive integer)
- ✅ Undefined (property not present)
- ❌ **null** (explicitly rejected)

However, the hardware configuration files (`configuration/hardware-config.json`) contained `null` values for outputs that don't use certain signal types:

```json
{
  "id": "core-03",
  "source": "core",
  "channel": 3,
  "control": "toggle-button",
  "signals": {
    "toggle": null, // ❌ Validation error
    "momentary": null, // ❌ Validation error
    "dimmer": null // ❌ Validation error
  }
}
```

**Why null was used:** When a hardware output channel is configured as "not-used" or only needs specific signal types (e.g., toggle-button only needs toggle, not dimmer), the unused signal IDs should be able to be null as a placeholder.

---

## Solution

Updated the schema to allow `null` values for signal properties:

```typescript
signals: z.object({
  toggle: z.number().int().positive().nullable().optional(),
  momentary: z.number().int().positive().nullable().optional(),
  dimmer: z.number().int().positive().nullable().optional(),
}).optional(),
```

### What Changed

Added `.nullable()` to each signal property, which now allows:

- ✅ A positive integer number
- ✅ Undefined (property not present)
- ✅ **null** (explicitly allowed)

---

## Files Modified

### `packages/schema/src/schema.ts`

**Line ~263-267:** Updated `OutputChannelSchema` signals object

**Before:**

```typescript
signals: z.object({
  toggle: z.number().int().positive().optional(),
  momentary: z.number().int().positive().optional(),
  dimmer: z.number().int().positive().optional(),
}).optional(),
```

**After:**

```typescript
signals: z.object({
  toggle: z.number().int().positive().nullable().optional(),
  momentary: z.number().int().positive().nullable().optional(),
  dimmer: z.number().int().positive().nullable().optional(),
}).optional(),
```

---

## Validation

### Test Results

1. **Schema Package Tests:** ✅ All 19 tests passing

   ```bash
   cd packages/schema && pnpm test
   # Test Suites: 1 passed, 1 total
   # Tests:       19 passed, 19 total
   ```

2. **Hardware Config Validation:** ✅ Valid

   ```bash

   # Hardware configuration is VALID
   # System type: core
   # Number of outputs: 23
   # Outputs with null signals: 7
   ```

### Affected Files

The following files in the project contain null signal values and now validate correctly:

- `configuration/hardware-config.json` (7 outputs with null signals)
- `packages/web-configurator/public/deployment-package/configuration/hardware-config.json` (7 outputs)

---

## Design Rationale

### Why Allow Null?

1. **Explicit Intent**: `null` clearly indicates "no signal assigned" vs `undefined` (property omitted)
2. **Data Consistency**: All outputs have the same structure, making parsing easier
3. **Future Proofing**: Easier to add/remove signal assignments without restructuring
4. **Type Safety**: TypeScript can differentiate between `number | null | undefined`

### Type Signature

```typescript
type SignalValue = number | null | undefined;

interface OutputSignals {
  toggle?: SignalValue;
  momentary?: SignalValue;
  dimmer?: SignalValue;
}
```

This allows three states for each signal:

- **number**: Signal is assigned with a specific ID
- **null**: Signal slot exists but is not assigned
- **undefined**: Signal property not included

---

## Impact

### Breaking Changes

None - this is a **non-breaking change** that makes the schema more permissive.

### Benefits

- ✅ Existing hardware configs now validate
- ✅ Web configurator can load without errors
- ✅ More flexible signal assignment
- ✅ Clearer data model

### Migration

No migration needed - existing configs work as-is.

---

## Related Documentation

- [HARDWARE_CONFIG_IMPLEMENTATION.md](./HARDWARE_CONFIG_IMPLEMENTATION.md) - Hardware config system
- [SCHEMA_SPEC.md](./SCHEMA_SPEC.md) - Schema specification
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Overall project status

---

## Next Steps

1. ✅ Schema updated and rebuilt
2. ✅ Tests passing
3. ✅ Hardware config validates
4. 🔲 Web configurator rebuild (has pre-existing TypeScript errors to fix)
5. 🔲 Update documentation if needed

---

**Resolution:** The schema now correctly allows `null` values for optional signal assignments, resolving the validation error while maintaining type safety and data integrity.
