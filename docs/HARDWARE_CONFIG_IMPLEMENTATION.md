# Hardware Configuration Implementation

**Status:** ✅ Complete  
**Date:** October 2, 2025  
**Phase:** 2 - Web Configurator  
**Feature:** Hardware & Channel Configuration

---

## Overview

Added a comprehensive **Hardware Configuration** page to the web configurator that allows users to:

1. Select hardware system type (CORE vs CORE LITE)
2. Configure output channels (20 for CORE, 10 for CORE LITE)
3. Map control types to components (push-button → momentary, toggle-button → toggle, slider → dimmer)
4. Enable half-bridge pairing for motor control (CORE only)
5. Assign signal IDs for protocol communication

This implementation adapts the legacy configurator's channel system (documented in `CONFIGURATOR_CHANNEL_SYSTEM_OVERVIEW.md`) to our new schema-driven architecture.

---

## Files Created

### 1. Schema Extensions (`packages/schema/src/schema.ts`)

Added TypeScript types and Zod schemas for hardware configuration:

```typescript
// Hardware system types
HardwareSystemTypeSchema = z.enum(["core", "core-lite"])

// Output control types
OutputControlTypeSchema = z.enum([
  "not-used",
  "push-button",
  "toggle-button", 
  "slider",
  "half-bridge",
])

// Output channel configuration
OutputChannelSchema = z.object({
  id: string,              // e.g., "core-01", "genesis-02"
  source: "core" | "core-lite" | "genesis",
  channel: number,
  label: string,
  control: OutputControlType,
  icon: string,
  signalId: number,
  range: { min, max, step },
})

// Half-bridge pair (motor control)
HalfBridgePairSchema = z.object({
  source: HardwareSource,
  channelA: number,
  channelB: number,
  enabled: boolean,
})

// Complete hardware config
HardwareConfigSchema = z.object({
  systemType: "core" | "core-lite",
  outputs: OutputChannel[],
  halfBridgePairs: HalfBridgePair[],
  signalMap: Record<string, number | object>,
})
```

**Extended `UISchemaSchema`** to include optional `hardware` property.

---

### 2. Hardware Constants (`packages/web-configurator/src/constants/hardware.ts`)

Defines the available channels for each system type:

**CORE Channels (20 total):**
- Non-sequential: 1, 2, 3, 4, 5, 9-13, 17-21, 25-29
- Half-bridge pairs: 3+4, 12+13

**CORE LITE Channels (10 total):**
- 6 CORE-LITE channels (1-6)
- 4 Genesis channels (1-4)

**Utility Functions:**
- `generateChannelId()` - Create ID like "core-01"
- `parseChannelId()` - Extract source and channel number
- `findHalfBridgePair()` - Check if channel can pair
- `isPrimaryChannel()` - Determine primary vs secondary in pair

**Control-to-Component Mapping:**
```typescript
{
  "push-button"   → { component: "button", action: "momentary", width: 3 }
  "toggle-button" → { component: "toggle", width: 3 }
  "slider"        → { component: "dimmer", width: 6 }
  "half-bridge"   → { component: "dimmer", width: 6 }
}
```

---

### 3. Hardware Config Page (`packages/web-configurator/src/pages/HardwareConfigPage.tsx`)

React component with three main sections:

#### **A. System Type Selector**
- Radio buttons for CORE vs CORE LITE
- Preserves existing channel configs when switching
- Drops orphaned channels (e.g., CORE channel 29 when switching to CORE LITE)
- Clears half-bridge pairs when switching to CORE LITE

#### **B. Channel Grid**
- Displays all available channels for selected system type
- Each channel card shows:
  - **Channel ID** (e.g., "CORE #12")
  - **Control type dropdown** (not-used, push-button, toggle-button, slider, half-bridge)
  - **Label input** (user-defined name)
  - **Signal ID** (derived from channel or override)
  - **Component mapping** (shows which HMI component it maps to)
  - **Pair badge** (if part of active half-bridge)

**Interaction logic:**
- Selecting "Half-Bridge Pair" automatically:
  - Enables the pair in `halfBridgePairs` array
  - Forces both channels to "slider" control type
  - Locks the secondary channel (read-only)
  - Shows "PAIRED" badge on both channels
  
- Secondary channels in active pairs:
  - Label inherited from primary
  - Control selector disabled
  - Cannot be edited independently

#### **C. Half-Bridge Pairs Section** (CORE only)
- Lists predefined pairs: Core 3+4, Core 12+13
- Shows ENABLED/DISABLED status badges
- Updated automatically when channels configured

#### **D. Summary Section**
- Active channels count
- Breakdown by control type (push buttons, toggles, sliders)

---

### 4. Styles (`packages/web-configurator/src/pages/HardwareConfigPage.module.css`)

CSS Modules with:
- Responsive grid layout (auto-fill, 300px min)
- Interactive channel cards with hover states
- System type radio buttons with custom styling
- Status badges (paired, enabled/disabled)
- Summary statistics cards

---

## Schema Integration

### Before (Phase 2.1)
```json
{
  "schemaVersion": "0.1.0",
  "metadata": { ... },
  "tabs": [ ... ]
}
```

### After (Phase 2.2 - Hardware Config)
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
      },
      {
        "id": "core-12",
        "source": "core",
        "channel": 12,
        "label": "Awning Motor",
        "control": "slider"
      },
      {
        "id": "core-13",
        "source": "core",
        "channel": 13,
        "label": "Awning Motor",
        "control": "slider"
      }
    ],
    "halfBridgePairs": [
      {
        "source": "core",
        "channelA": 12,
        "channelB": 13,
        "enabled": true
      }
    ],
    "signalMap": {}
  },
  "tabs": [ ... ]
}
```

---

## Navigation & Routing

### Updated Routes (`App.tsx`)
```tsx
<Route path="/" element={<Navigate to="/hardware" />} />
<Route path="/hardware" element={<HardwareConfigPage />} />  ← NEW
<Route path="/editor" element={<EditorPage />} />
<Route path="/preview" element={<PreviewPage />} />
<Route path="/export" element={<ExportPage />} />
```

### Updated Navigation (`Layout.tsx`)
Added "🔌 Hardware" as first nav item (left-most position).

---

## Key Features Implemented

### ✅ System Type Selection
- Switch between CORE (20 channels) and CORE LITE (10 channels)
- Automatic channel list regeneration
- Configuration preservation where possible

### ✅ Channel Configuration
- Label assignment (user-friendly names)
- Control type selection (5 types)
- Visual feedback (badges, hover states)
- Disabled state for secondary half-bridge channels

### ✅ Half-Bridge Pairing (CORE only)
- Predefined pairs: 3+4, 12+13
- Automatic pairing when "half-bridge" selected
- Locks secondary channel configuration
- Visual indicators (PAIRED badge)
- Shared signal ID for both channels

### ✅ Signal ID Management
- Default: channel number = signal ID
- Override: user-defined signal ID
- Signal map: complex routing (future enhancement)

### ✅ Control-to-Component Mapping
- `push-button` → `button` component (momentary action)
- `toggle-button` → `toggle` component (latching)
- `slider` → `dimmer` component (0-100%)
- `half-bridge` → `dimmer` component (bidirectional)

### ✅ Real-time Validation
- Schema validation via `@gcg/schema` package
- TypeScript type safety throughout
- Error feedback in header (existing from Phase 2.1)

---

## User Flow Example

### Configuring a Lighting System

1. **Select System Type:**
   - Choose "CORE" for full feature set

2. **Configure Channel 1 (Overhead Lights):**
   - Control: Toggle Button
   - Label: "Galley Lights"
   - Result: Creates `toggle` component with signal ID 1

3. **Configure Channel 2 (Dimmer):**
   - Control: Slider
   - Label: "Reading Lights"
   - Result: Creates `dimmer` component with 0-100% range

4. **Configure Channels 12-13 (Awning Motor):**
   - Control: Half-Bridge Pair (on either channel)
   - Label: "Awning Motor" (on primary channel 12)
   - Result:
     - Enables pair 12+13
     - Both channels forced to "slider"
     - Channel 13 locked (inherits from 12)
     - Single `dimmer` component for bidirectional control

5. **Summary Shows:**
   - Active Channels: 3 / 20
   - Push Buttons: 0
   - Toggle Buttons: 1
   - Sliders: 2

---

## Technical Architecture

### State Management
- **Global state:** `SchemaContext` (existing from Phase 2.1)
- **Local state:** `selectedChannel` (UI selection only)
- **Derived state:** `channelDefinitions` (computed from systemType + outputs)

### Data Flow
```
User Action (select control type)
    ↓
handleChannelUpdate()
    ↓
Check for half-bridge logic
    ↓
Update schema.hardware.outputs[]
    ↓
updateSchema() in SchemaContext
    ↓
Validation runs automatically (useEffect)
    ↓
UI re-renders with new state
```

### Half-Bridge Logic
```typescript
if (control === "half-bridge") {
  1. Find pair definition (3+4 or 12+13)
  2. Enable pair in halfBridgePairs array
  3. Force both channels to "slider" control
  4. Lock secondary channel
  5. Apply shared signal ID
}
```

---

## Future Enhancements

### Signal Map Implementation
Currently, `signalMap` is stored but not actively used. Future work:

```typescript
// Complex signal routing
signalMap: {
  "core:12": {
    "push-button": 5678,
    "toggle-button": 5679,
    "slider": 5680,
    "default": 5678
  }
}
```

**Resolution order:**
1. Check signalMap for exact control type
2. Check signalMap for component family (momentary/toggle/dimmer)
3. Check signalMap for "default" key
4. Use output.signalId if defined
5. Fall back to channel number

### Icon Upload
Add icon picker/uploader for channel cards:
- SVG support
- PNG/JPG support
- Data URL embedding
- Icon library browser

### Range Editor for Sliders
Allow customization of min/max/step for slider controls:
- Default: 0-100, step 1
- Custom: e.g., 20-80, step 5 for fan speed

### Drag-to-Reorder
Allow visual reordering of channels for better organization in HMI.

### Import/Export Channel Configs
- Save/load channel configurations as presets
- Share configurations between projects
- Version control for channel mappings

---

## Testing Checklist

### ✅ Schema Validation
- [x] Hardware config schema validates correctly
- [x] TypeScript types exported and usable
- [x] No compilation errors

### ✅ System Type Switching
- [x] CORE → CORE LITE preserves channels 1-6
- [x] CORE LITE → CORE preserves all channels
- [x] Half-bridge pairs cleared when switching to CORE LITE
- [x] Orphaned channels removed correctly

### ✅ Channel Configuration
- [x] Label updates persist in schema
- [x] Control type changes update schema
- [x] Signal ID displayed correctly
- [x] Component mapping shown accurately

### ✅ Half-Bridge Pairing
- [x] Selecting "half-bridge" enables pair
- [x] Both channels forced to "slider"
- [x] Secondary channel locked
- [x] PAIRED badge displayed
- [x] Disabling removes pair

### ✅ UI/UX
- [x] Responsive grid layout
- [x] Hover states functional
- [x] Selected state highlights card
- [x] Disabled state dims card
- [x] Summary statistics accurate

---

## Integration with Existing Phase 2.1 Work

### Schema Context
- Extended default schema to include `hardware` object
- Validation automatically includes hardware config
- No breaking changes to existing schema structure

### Navigation
- Added "Hardware" as first nav item
- Set `/hardware` as default route (redirects from `/`)
- All other routes unchanged

### Export Page
- Hardware config automatically included in JSON export
- Download feature works with extended schema

---

## Alignment with Legacy Configurator

This implementation **adapts** (not replicates) the legacy system documented in `CONFIGURATOR_CHANNEL_SYSTEM_OVERVIEW.md`:

### Preserved Concepts
- ✅ CORE vs CORE LITE system types
- ✅ 20-channel CORE configuration (non-sequential numbering)
- ✅ 10-channel CORE LITE configuration (6 + 4 Genesis)
- ✅ Half-bridge pairs (3+4, 12+13)
- ✅ Control type to component mapping
- ✅ Signal ID resolution (channel → signalId)

### Modernized Approaches
- 🔄 Schema-first architecture (Zod validation)
- 🔄 React functional components (vs vanilla JS)
- 🔄 TypeScript strict mode (vs untyped JS)
- 🔄 CSS Modules (vs global CSS)
- 🔄 Immutable state updates (React hooks)

### Deferred Features
- ⏸️ System options (power, HVAC, plumbing, etc.) - Phase 2.3+
- ⏸️ Signal map complex routing - Future enhancement
- ⏸️ Icon upload/management - Future enhancement
- ⏸️ Range customization for sliders - Future enhancement

---

## Summary

**What we built:**
A complete hardware configuration page that enables visual setup of output channels, control type mapping, and half-bridge motor control. Fully integrated with the schema validation system and web configurator navigation.

**Why it matters:**
This is the **foundation** for the HMI UI. Every component in the Editor page will reference these hardware channels. The control-to-component mapping defined here drives the entire UI generation pipeline.

**Next steps:**
Now that hardware channels are configured, we can proceed with:
- **Phase 2.2:** Visual editor for adding components to tabs/sections (referencing hardware channels)
- **Phase 2.3:** Preview page rendering components with hardware bindings
- **Phase 2.4:** Export page generating complete config.zip with channel mappings

---

**Status:** ✅ Ready for Phase 2.2 (Visual Editor)  
**Completion Date:** October 2, 2025
