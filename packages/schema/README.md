# @gcg/schema

> **Schema validation and TypeScript types for Garmin Core Graphics Configurator**

## Overview

This package provides:
- JSON schema definition for GCG UI layouts
- Zod runtime validation
- TypeScript type generation
- Test fixtures and examples

## Installation

This is a workspace package. It's automatically linked when you run `pnpm install` from the monorepo root.

## Usage

```typescript
import { validateSchema, type GCGSchema } from '@gcg/schema';

// Validate a schema
const result = validateSchema(mySchemaJson);

if (result.success) {
  console.log('Valid schema:', result.data);
} else {
  console.error('Validation errors:', result.error);
}
```

## API

### `validateSchema(data: unknown): Result<GCGSchema>`

Validates a JSON object against the GCG schema.

**Returns**: 
- `{ success: true, data: GCGSchema }` if valid
- `{ success: false, error: ZodError }` if invalid

### Types

```typescript
import type {
  GCGSchema,
  Tab,
  Section,
  Component,
  ToggleComponent,
  ButtonComponent,
  DimmerComponent,
  GaugeComponent,
  Binding,
} from '@gcg/schema';
```

## Schema Version

Current version: **0.1.0**

See [SCHEMA_SPEC.md](../../SCHEMA_SPEC.md) for complete specification.

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Test with coverage
pnpm test:coverage
```

## Testing

Tests are located in `tests/` directory with fixtures in `tests/fixtures/`.

Test coverage requirement: **80%** for all metrics.
