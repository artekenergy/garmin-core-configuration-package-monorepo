# Modular Schema Structure Guide

## Overview

The schema has been refactored from a single 669-line file into a modular structure with **39 exported schemas** organized into logical domains. This improves maintainability, discoverability, and enables tree-shaking.

## Directory Structure

```
src/
├── bindings/           # Data source bindings (EmpirBus, NMEA2000, Static)
│   ├── empirbus.ts
│   ├── nmea2000.ts
│   ├── static.ts
│   └── index.ts
├── components/         # UI component schemas
│   ├── base.ts
│   ├── toggle.ts
│   ├── button.ts
│   ├── dimmer.ts
│   ├── gauge.ts
│   ├── indicator.ts
│   ├── slider.ts
│   └── index.ts
├── structure/          # Tab, section, and icon schemas
│   ├── section.ts
│   ├── tab.ts
│   ├── icon.ts
│   └── index.ts
├── hardware/           # Hardware configuration schemas
│   ├── types.ts
│   ├── output-channel.ts
│   ├── half-bridge.ts
│   ├── signal-map.ts
│   ├── config.ts
│   └── index.ts
├── subsystems/         # Subsystem configurations
│   ├── power.ts
│   ├── hvac.ts
│   ├── plumbing.ts
│   ├── accessories.ts
│   ├── lighting.ts
│   └── index.ts
├── tabs/               # Tab-specific configurations
│   ├── subtab.ts
│   ├── lighting-tab.ts
│   ├── hvac-tab.ts
│   ├── switching-tab.ts
│   ├── plumbing-tab.ts
│   └── index.ts
├── theme/              # Theme configuration
│   └── index.ts
├── metadata/           # Schema metadata
│   └── index.ts
├── root/               # Root UISchema
│   └── index.ts
├── index.ts            # Main entry point
├── types.ts            # Helper types & validation results
├── validators.ts       # Custom validation logic
└── schema.ts           # DEPRECATED: Old monolithic file
```

## Usage Examples

### Import Everything (Recommended)

```typescript
import {
  UISchemaSchema,
  ComponentSchema,
  BindingSchema,
  type UISchema,
  type Component,
} from '@gcg/schema';
```

### Import Specific Domains

```typescript
// Just bindings
import { EmpirBusBindingSchema } from '@gcg/schema/bindings';

// Just components
import { ToggleComponentSchema, ButtonComponentSchema } from '@gcg/schema/components';

// Just hardware
import { HardwareConfigSchema, OutputChannelSchema } from '@gcg/schema/hardware';

// Just subsystems
import { PowerConfigSchema, HVACConfigSchema } from '@gcg/schema/subsystems';
```

### Import Individual Files (Advanced)

```typescript
import { EmpirBusBindingSchema } from '@gcg/schema/bindings/empirbus';
import { ToggleComponentSchema } from '@gcg/schema/components/toggle';
import { PowerConfigSchema } from '@gcg/schema/subsystems/power';
```

## Benefits

### ✅ Modularity

Each file has a single, clear responsibility (50-150 lines each).

### ✅ Discoverability

Easy to find schemas by domain:

- Need a button component? → `components/button.ts`
- Need power config? → `subsystems/power.ts`
- Need hardware types? → `hardware/types.ts`

### ✅ Tree-Shaking

Bundlers can eliminate unused code when importing specific schemas.

### ✅ Testability

Test each schema domain in isolation.

### ✅ Maintainability

- Changes are localized to specific files
- Less merge conflicts
- Easier code reviews

### ✅ Performance

- Faster IDE intellisense
- Faster type-checking
- Parallel compilation

## Migration from Old Schema

The old `schema.ts` file is still present but **DEPRECATED**. All imports should migrate to the new structure.

### Before (Old)

```typescript
import { UISchemaSchema, ComponentSchema } from '@gcg/schema/schema';
```

### After (New)

```typescript
import { UISchemaSchema, ComponentSchema } from '@gcg/schema';
```

All exports are backward compatible through the main `index.ts`.

## File Size Guidelines

Individual schema files follow these guidelines:

- **< 50 lines**: Simple schemas (types, enums)
- **50-100 lines**: Standard schemas (components, configs)
- **100-150 lines**: Complex schemas (with validations)
- **> 150 lines**: Should be split into smaller files

## Schema Counts by Domain

- **Bindings**: 4 schemas (3 types + 1 union)
- **Components**: 8 schemas (7 types + 1 union)
- **Structure**: 3 schemas (section, tab, icon)
- **Hardware**: 5 schemas (types, channel, pair, map, config)
- **Subsystems**: 5 schemas (power, hvac, plumbing, accessories, lighting)
- **Tabs**: 5 schemas (subtab + 4 tab configs)
- **Theme**: 1 schema
- **Metadata**: 1 schema
- **Root**: 1 schema (UISchema)

**Total**: 39 exported schemas + 20 exported types

## Adding New Schemas

When adding new schemas:

1. **Determine the domain** (bindings, components, hardware, etc.)
2. **Create a new file** in the appropriate directory
3. **Export the schema and type** from the file
4. **Add to domain index.ts** if not auto-exported
5. **Keep files under 150 lines** - split if needed
6. **Update this guide** if adding a new domain

Example:

```typescript
// src/components/color-picker.ts
import { z } from 'zod';
import { BaseComponentSchema } from './base';
import { BindingSchema } from '../bindings';

export const ColorPickerComponentSchema = BaseComponentSchema.extend({
  type: z.literal('color-picker'),
  format: z.enum(['rgb', 'hsv', 'hex']).optional(),
  bindings: z.object({
    color: BindingSchema,
  }),
});

export type ColorPickerComponent = z.infer<typeof ColorPickerComponentSchema>;
```

Then add to `components/index.ts`:

```typescript
export * from './color-picker';
```

## Testing

Each domain can be tested independently:

```typescript
// tests/components/toggle.test.ts
import { ToggleComponentSchema } from '@gcg/schema/components/toggle';

describe('ToggleComponentSchema', () => {
  it('validates a valid toggle', () => {
    const result = ToggleComponentSchema.safeParse({
      id: 'my-toggle',
      type: 'toggle',
      label: 'Test Toggle',
      bindings: {
        state: { type: 'empirbus', channel: 'test-channel' },
      },
    });
    expect(result.success).toBe(true);
  });
});
```

## Deprecation Timeline

1. **Phase 1** (Current): Both old and new schemas available
2. **Phase 2** (Next release): Add deprecation warnings to `schema.ts`
3. **Phase 3** (Future release): Remove `schema.ts` entirely

## Questions?

See [SCHEMA_SPEC.md](../../docs/SCHEMA_SPEC.md) for the full schema specification.
