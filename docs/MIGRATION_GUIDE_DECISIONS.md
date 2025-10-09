# Migration Guide Analysis & Decisions

**Date**: October 2, 2025  
**Context**: Reviewed PREACT_MIGRATION_GUIDE.md against our schema-driven architecture

---

## 🎯 Key Decisions Made

### Decision 1: Migration Scenario
**Choice**: B) Starting fresh with schema-driven approach

**Rationale**: 
- Migration guide is a **reference for protocol details only**
- We're not migrating existing code, we're building new
- Schema-first architecture remains our north star
- Protocol knowledge from guide will be extracted when needed (Phase 3)

---

### Decision 2: Component Type Names
**Choice**: B) Stick with schema spec names

**Component Types (Official)**:
- ✅ `Toggle` - Binary on/off switch
- ✅ `Button` - Momentary or toggle action
- ✅ `Dimmer` - Variable intensity (0-100%)
- ✅ `Gauge` - Read-only numeric display
- ✅ `Indicator` - Status light
- ✅ `Slider` - Adjustable value input

**Mapping to Migration Guide** (for future reference):
- Migration's `MomentaryButton` → Our `Button` with `action: "momentary"`
- Migration's `DimmerSlider` → Our `Dimmer`
- Migration's `SignalValue` → Our `Gauge` or `Indicator`

**Rationale**:
- Schema spec is already well-defined in SCHEMA_SPEC.md
- Consistent naming across all packages
- Clearer semantic meaning
- Migration guide components can be implemented to match our names

---

### Decision 3: Bindings Implementation Priority
**Choice**: A) Phase 1 - Essential for schema validation

**Implementation Plan**:

**Phase 1 (Current)**: Schema Package
- Define `Binding` types in Zod schema
- Validate binding structure (EmpirBus channels, NMEA2000 PGNs)
- **Mock validation only** - don't need real WebSocket yet

**Phase 2**: Web Configurator
- UI for selecting bindings
- Dropdown for channel names (from loaded .ebp file)
- Preview shows static/mock data

**Phase 3**: HMI UI
- **Real bindings adapter** using migration guide's WebSocket code
- Connect to actual EmpirBus controller
- Live data flow

**Rationale**:
- Schema needs to validate binding structure immediately
- But we don't need working WebSocket in Phase 1
- Validation != Implementation
- This allows schema package to be complete without WebSocket complexity

---

### Decision 4: Button Component Design
**Choice**: B) Keep `Button` with `action: "momentary" | "toggle"`

**Schema Definition**:
```typescript
interface ButtonComponent extends BaseComponent {
  type: "button";
  action: "momentary" | "toggle";  // Behavior mode
  variant?: "primary" | "secondary" | "danger";
}
```

**Examples**:
```json
{
  "id": "btn-anchor-light",
  "type": "button",
  "action": "toggle",
  "label": "Anchor Light",
  "bindings": {
    "state": { "type": "empirbus", "channel": "out-channel-5" }
  }
}
```

```json
{
  "id": "btn-horn",
  "type": "button",
  "action": "momentary",
  "label": "Horn",
  "bindings": {
    "action": { "type": "empirbus", "channel": "out-channel-10" }
  }
}
```

**Rationale**:
- Single component type is simpler
- `action` property makes behavior explicit
- Easier to implement in component factory
- Matches common UI patterns

---

## 📋 Updated Migration Guide Status

### What We'll Extract From Migration Guide

#### ✅ **Phase 3: Bindings Adapter**
- WebSocket connection management (`stores/websocket.js`)
- Protocol constants (`PROTOCOL` object)
- Message builders (`buildDimmerCommand`, etc.)
- Message parser (`handleIncomingMessage`)
- Temperature decoder utility
- Heartbeat/ACK logic

#### ✅ **Phase 3: Component Implementation**
- Custom hooks patterns:
  - `useMomentaryControl` → for `Button` with `action: "momentary"`
  - `useDimmerControl` → for `Dimmer` component
  - `useSignalValue` → for `Gauge` component
- Throttling logic for sliders
- Pointer event handling for buttons

#### ❌ **Not Using From Migration Guide**
- Hardcoded JSX components
- `Modal` component (not in Phase 1 spec)
- Direct signal ID references
- Hardcoded UI pages
- Signal metadata loading (we have schema)

---

## 🔄 Architecture Clarification

### Our Actual Architecture (Confirmed)

```
┌─────────────────────────────────────────────────────────┐
│                    INSTALLER FLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Create .ebp file in EmpirBus Studio                 │
│     (defines channels, hardware config)                 │
│                                                          │
│  2. Open Web Configurator                               │
│     - Load .ebp to get channel names                    │
│     - Build UI schema (tabs, components, bindings)      │
│     - Export schema.json + icons → config.zip           │
│                                                          │
│  3. Deploy to HMI device                                │
│     - Upload .ebp to controller                         │
│     - Upload config.zip to HMI                          │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     END USER FLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  HMI Device Boots                                       │
│      ↓                                                   │
│  Load schema.json                                       │
│      ↓                                                   │
│  Validate schema (@gcg/schema)                          │
│      ↓                                                   │
│  Parse tabs, sections, components                       │
│      ↓                                                   │
│  Component Factory generates Preact components          │
│      ↓                                                   │
│  Bindings Adapter maps schema channels to signal IDs    │
│      ↓                                                   │
│  WebSocket connects to controller (migration guide!)    │
│      ↓                                                   │
│  User interacts → Components → Bindings → WebSocket     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Immediate Impact on Phase 1

### Schema Package Must Include:

#### 1. **Binding Types** (from SCHEMA_SPEC.md)
```typescript
type Binding = EmpirBusBinding | NMEA2000Binding | StaticBinding;

interface EmpirBusBinding {
  type: "empirbus";
  channel: string;           // e.g., "out-channel-1"
  property: string;          // "state" | "intensity" | "value"
}

interface NMEA2000Binding {
  type: "nmea2000";
  pgn: number;               // Parameter Group Number
  field: string;
  instance?: number;
}

interface StaticBinding {
  type: "static";
  value: any;                // For testing/mocking
}
```

#### 2. **Validation Rules**
- ✅ Binding type must be valid (`"empirbus"` | `"nmea2000"` | `"static"`)
- ✅ EmpirBus channels must be valid strings (pattern: `^[a-z][a-z0-9-]*$`)
- ✅ NMEA2000 PGNs must be valid numbers
- ⚠️ **NOT validating**: Whether channel exists in .ebp (that's runtime/Web Configurator concern)

#### 3. **Component Types**
```typescript
type ComponentType = 
  | "toggle"
  | "button"     // with action: "momentary" | "toggle"
  | "dimmer"
  | "gauge"
  | "indicator"
  | "slider";
```

---

## 📝 Updated Step 1.2 Tasks

### Phase 1, Step 1.2: Build @gcg/schema Package

**Files to Create**:

1. ✅ `src/schema.ts` - Zod schema definitions
   - All component types (toggle, button, dimmer, gauge, indicator, slider)
   - Binding types (empirbus, nmea2000, static)
   - Button with `action: "momentary" | "toggle"`

2. ✅ `src/types.ts` - TypeScript type exports
   - Inferred from Zod schemas

3. ✅ `src/validators.ts` - Custom validation
   - Component ID uniqueness
   - Icon reference validation
   - Binding structure validation

4. ✅ `src/index.ts` - Public API
   - Export `validateSchema()` function
   - Export all types

5. ✅ `tests/fixtures/*.json` - Test schemas
   - `valid-minimal.json` - Simplest valid schema
   - `valid-complex.json` - All component types
   - `valid-bindings.json` - All binding types
   - `invalid-*.json` - Various error cases

6. ✅ `tests/validators.test.ts` - Validator tests
   - All component types validate correctly
   - Binding validation
   - Error messages are clear

**Success Criteria**:
- ✅ All component types from SCHEMA_SPEC.md implemented
- ✅ Button has `action: "momentary" | "toggle"`
- ✅ All binding types validate correctly
- ✅ 80%+ test coverage
- ✅ All tests passing
- ✅ No TypeScript errors

---

## 🔗 Migration Guide Integration Plan

### Phase 3: HMI UI Implementation

When we get to Phase 3, we'll extract these specific parts:

**File: `packages/hmi-ui/src/adapters/bindings.ts`**
```typescript
// Extract from migration guide:
// - WebSocket connection logic
// - Protocol constants (PROTOCOL object)
// - Message builders (buildDimmerCommand, etc.)
// - Message parser (handleIncomingMessage)

export class BindingsAdapter {
  connect(url: string): void { /* migration guide code */ }
  
  send(binding: Binding, value: any): void {
    // Convert schema binding → protocol message
    // Use migration guide's message builders
  }
  
  subscribe(bindings: Binding[]): void {
    // Convert schema bindings → subscription message
  }
}
```

**File: `packages/hmi-ui/src/stores/websocket.ts`**
```typescript
// Directly from migration guide's stores/websocket.js
// (Preact Signals implementation)
```

**File: `packages/hmi-ui/src/utils/temperature.ts`**
```typescript
// Directly from migration guide's utils/temperature.js
```

---

## ✅ Decision Summary

| Decision Point | Choice | Status |
|---------------|--------|--------|
| Migration scenario | Schema-driven (fresh start) | ✅ Confirmed |
| Component names | Schema spec names | ✅ Confirmed |
| Bindings priority | Phase 1 validation | ✅ Confirmed |
| Button design | `action: "momentary" \| "toggle"` | ✅ Confirmed |

---

## 🚀 Next Action

**Proceed with Phase 1, Step 1.2**: Build `@gcg/schema` package

**Reference Documents**:
- Primary: `SCHEMA_SPEC.md` (our source of truth)
- Secondary: `PREACT_MIGRATION_GUIDE.md` (protocol reference for Phase 3)

**Implementation Note**:
The schema package will validate binding **structure**, not binding **correctness** (i.e., we check the JSON is valid, not that the channel exists in the .ebp file).

---

**Ready to implement the Zod schema!** 🎉

**Last Updated**: October 2, 2025  
**Approved By**: User  
**Next Step**: Create `packages/schema/src/schema.ts`
