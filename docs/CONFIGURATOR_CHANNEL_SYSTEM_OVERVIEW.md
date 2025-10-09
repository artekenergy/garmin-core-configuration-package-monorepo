# Configurator Channel & System Type Configuration Overview

This document explains the channel configuration architecture and system type management in `configurator/app.js`.

---

## System Types

The configurator supports two hardware platform types:

### 1. **CORE** (Default)
- **20 output channels** across specific channel numbers
- Supports **half-bridge pairing** (channels 3+4, 12+13)
- Full feature set including advanced power management

### 2. **CORE LITE**
- **10 output channels** (6 CORE-LITE + 4 Genesis)
- Simplified configuration
- No half-bridge pairing support

---

## Channel Definitions

### CORE Channels (20 total)
```javascript
const CORE_CHANNELS = [
  { source: "core", channel: 1 },
  { source: "core", channel: 2 },
  { source: "core", channel: 3 },   // Can pair with 4
  { source: "core", channel: 4 },   // Can pair with 3
  { source: "core", channel: 5 },
  { source: "core", channel: 9 },
  { source: "core", channel: 10 },
  { source: "core", channel: 11 },
  { source: "core", channel: 12 },  // Can pair with 13
  { source: "core", channel: 13 },  // Can pair with 12
  { source: "core", channel: 17 },
  { source: "core", channel: 18 },
  { source: "core", channel: 19 },
  { source: "core", channel: 20 },
  { source: "core", channel: 21 },
  { source: "core", channel: 25 },
  { source: "core", channel: 26 },
  { source: "core", channel: 27 },
  { source: "core", channel: 28 },
  { source: "core", channel: 29 },
]
```

**Key characteristics:**
- Non-sequential channel numbering (gaps exist: 6, 7, 8, 14, 15, 16, 22, 23, 24, 30+)
- Channels 3+4 and 12+13 can be paired for half-bridge motor control
- Each channel has a unique ID format: `core-01`, `core-02`, etc. (zero-padded)

### CORE LITE Channels (10 total)
```javascript
const CORE_LITE_CHANNELS = [
  { source: "core-lite", channel: 1 },
  { source: "core-lite", channel: 2 },
  { source: "core-lite", channel: 3 },
  { source: "core-lite", channel: 4 },
  { source: "core-lite", channel: 5 },
  { source: "core-lite", channel: 6 },
  { source: "genesis", channel: 1 },
  { source: "genesis", channel: 2 },
  { source: "genesis", channel: 3 },
  { source: "genesis", channel: 4 },
]
```

**Key characteristics:**
- Split between two sources: `core-lite` (6 channels) and `genesis` (4 channels)
- Sequential numbering within each source
- No half-bridge pairing support
- Unique ID format: `core-lite-01`, `genesis-01`, etc.

---

## Channel Configuration Model

Each channel (output) has the following structure:

```javascript
{
  id: "core-12",              // Unique identifier (source-channel zero-padded)
  source: "core",             // Hardware source (core | core-lite | genesis)
  channel: 12,                // Channel number on that source
  label: "Galley Lights",     // User-defined display name
  control: "toggle-button",   // Control type (see below)
  icon: "icons/Light.svg",    // Optional icon path or data URL
  signalId: 1234,             // Optional override signal ID for protocol
  range: {                    // Only for slider controls
    min: 0,
    max: 100,
    step: 1
  }
}
```

---

## Control Types

Each channel can be assigned one of these control types:

### 1. **not-used**
- Channel is disabled and won't appear in the HMI
- No UI component generated
- Default state for unconfigured channels

### 2. **push-button** (Momentary)
- Press-and-release behavior
- Maps to `momentary` component
- Binding:
  ```javascript
  {
    press: { cmd: "momentary", signalId, state: 1 },
    release: { cmd: "momentary", signalId, state: 0 }
  }
  ```
- Width: 3 grid units
- Use cases: Door locks, momentary lights, horn

### 3. **toggle-button** (Latching)
- On/off toggle with state feedback
- Maps to `toggle` component
- Binding:
  ```javascript
  {
    press: { cmd: "momentary", signalId, state: 1 },
    release: { cmd: "momentary", signalId, state: 0 },
    listen: [{ type: "mfdStatus", signalId }]  // State feedback
  }
  ```
- Width: 3 grid units
- Use cases: Lights, fans, pumps with on/off state

### 4. **slider** (Dimmer)
- Variable control from 0-100%
- Maps to `dimmer` component
- Binding:
  ```javascript
  {
    send: { cmd: "dimmer", signalId }
  }
  ```
- Props: `{ min: 0, max: 100, step: 1 }`
- Width: 6 grid units
- Use cases: Dimmable lights, variable speed fans, PWM outputs

### 5. **half-bridge** (CORE only, special case)
- Paired motor control (forward/reverse)
- Automatically creates paired sliders for both channels
- Only available for predefined pairs: 3+4, 12+13
- Both channels forced to `slider` control type
- Fixed range: 0-100%
- Use cases: Window actuators, slide-outs, awnings

---

## Half-Bridge Pairing (CORE Only)

### Predefined Pairs
```javascript
const HALF_BRIDGE_PAIRS = [
  { source: "core", a: 3, b: 4, label: "Core 3 + 4" },
  { source: "core", a: 12, b: 13, label: "Core 12 + 13" },
]
```

### Pairing Behavior

When a user enables half-bridge pairing:

1. **Primary Channel** (lower number: 3 or 12)
   - User can edit label and control settings
   - Control type automatically set to `slider`
   - Changes apply to both channels

2. **Secondary Channel** (higher number: 4 or 13)
   - Label input disabled (inherits from primary)
   - Control selector disabled
   - Settings locked (reads from primary)
   - Placeholder shows pairing status

3. **State Storage**
   ```javascript
   options.halfBridgePairs = {
     "core:3-4": true,    // Enabled
     "core:12-13": false  // Disabled
   }
   ```

4. **UI Generation**
   - Only primary channel appears in page components
   - Both channels share the same signal ID
   - One slider controls bidirectional movement

### Enabling/Disabling Pairs

**To enable:**
- Select "Half Bridge (Pair)" from control dropdown on **either** channel
- Both channels become sliders automatically
- Primary channel controls the configuration

**To disable:**
- Switch primary channel to any other control type
- Pairing disabled for both channels
- Each channel becomes independent again

---

## Signal ID Assignment

The configurator supports three levels of signal ID assignment:

### 1. **Channel Number (Default)**
```javascript
// If no override exists, use channel number as signal ID
signalId = output.channel  // e.g., channel 12 → signal 12
```

### 2. **Output-Level Override**
```javascript
// User can manually set a specific signal ID per output
output.signalId = 1234
```

### 3. **Signal Map Override (Highest Priority)**
Loaded from `configuration/signal-map.json`:

```javascript
// Simple mapping (one signal per channel)
{
  "core:12": 5678
}

// Complex mapping (different signals per control type)
{
  "core:12": {
    "push-button": 5678,
    "toggle-button": 5679,
    "slider": 5680,
    "default": 5678
  }
}
```

**Resolution order:**
1. Check signal-map.json for exact control type match
2. Check signal-map.json for component family match (momentary/toggle/dimmer)
3. Check signal-map.json for "default" key
4. Use output.signalId if defined
5. Fall back to channel number

---

## System Type Switching

### What Happens When User Changes System Type

```javascript
systemTypeEl.addEventListener("change", () => {
  state.config.system.type = systemTypeEl.value  // "core" or "core-lite"
  syncOutputsToType(systemTypeEl.value)
  renderOutputs()
  refreshOutput()
  renderEditor()
})
```

### `syncOutputsToType()` Process

1. **Generate Template**
   - Load channel list for selected system type
   - Create base output objects with default settings

2. **Preserve Existing Configuration**
   - Map existing outputs by `source:channel` key
   - Merge preserved settings into new template:
     - `label` (display name)
     - `control` (type)
     - `icon` (image path)
     - `range` (min/max/step for sliders)
     - `signalId` (override)

3. **Handle Orphaned Channels**
   - Channels that don't exist in new system type are dropped
   - Example: CORE channel 29 is lost when switching to CORE LITE

4. **Prune Page Components**
   - Remove any UI components that reference deleted channels
   - Validate remaining components have valid signal IDs

5. **Sync Nodes**
   - Update all page components to match new output configurations
   - Adjust component types if control changed
   - Preserve layouts and tabs where possible

---

## System Options Structure

Each system type maintains a comprehensive options object:

```javascript
config.system.options = {
  // Component flags
  components: {
    heater: true,
    cooling: true,
    ventilation: true,
    solarPrimary: false,
    solarAux: false
  },

  // Legacy tank counts (for backward compatibility)
  tanks: {
    fresh: 1,
    grey: 1,
    black: 1
  },

  // Half-bridge pairing (CORE only)
  halfBridgePairs: {
    "core:3-4": false,
    "core:12-13": false
  },

  // Power subsystem
  power: {
    dcCharging: {
      secondAlternator: true,
      orionXs: false
    },
    acLegs: 2,
    multiplus: {
      l1: true,
      l2: true
    }
  },

  // HVAC subsystem
  hvac: {
    heating: {
      sources: { diesel: false, electric: false, engine: false },
      distribution: { floor: false, fans: false },
      hotWater: false,
      auxZone: false
    },
    cooling: {
      brand: ""  // "recpro" | "truma" | "cruisencomfort"
    },
    ventilation: {
      fans: 1  // 1 or 2
    }
  },

  // Switching subsystem
  switching: {
    keypad: {
      enabled: false,
      count: 1,
      buttonsPerKeypad: 8  // 5-16
    },
    awning: {
      enabled: false,
      light: false,
      controlType: "rvc"  // "rvc" | "analog"
    },
    slides: {
      enabled: false,
      controlType: "rvc",
      keypadSecured: false
    }
  },

  // Plumbing subsystem (structured model)
  plumbing: {
    enabled: true,
    count: 3,  // 1-4 tanks
    tanks: [
      { type: "fresh", name: "Main Tank" },
      { type: "waste", name: "" },
      { type: "black", name: "" }
    ]
  },

  // Lighting subsystem
  lighting: {
    rgb: false,
    itcModules: 0,      // 0-2 when RGB enabled, 0+ otherwise
    itcModuleZones: 2   // 2 or 4 zones per module
  }
}
```

---

## Component-to-Control Mapping

Internal mapping that drives UI generation:

```javascript
const CONTROL_COMPONENT_MAP = {
  "push-button": {
    component: "momentary",
    width: 3,
    buildBinding(signalId) { /* ... */ }
  },
  "toggle-button": {
    component: "toggle",
    width: 3,
    buildBinding(signalId) { /* ... */ },
  },
  "slider": {
    component: "dimmer",
    width: 6,
    buildBinding(signalId) { /* ... */ },
    buildProps(output) { /* ... */ }
  }
}
```

**Flow:**
1. User selects control type in UI
2. System looks up descriptor in `CONTROL_COMPONENT_MAP`
3. Creates HMI component node with:
   - Component name (`momentary` | `toggle` | `dimmer`)
   - Width (grid units)
   - Binding (WebSocket message structure)
   - Props (min/max/step for sliders)

---

## Channel Validation Rules

### When Selecting Control Type

1. **Not Used**
   - Always allowed
   - Disables channel completely
   - Icon upload disabled

2. **Push Button / Toggle Button**
   - Allowed on any channel
   - Requires signal ID (channel, override, or mapped)
   - Icon upload enabled

3. **Slider**
   - Allowed on any channel
   - Requires signal ID
   - Range is fixed (0-100, step 1)
   - Cannot edit range in current version

4. **Half-Bridge (CORE only)**
   - Only shown for channels 3, 4, 12, 13
   - Automatically pairs channels
   - Forces both to slider control
   - Locks secondary channel settings

### Signal ID Validation

When adding a component to a page:
```javascript
const usableOutputs = outputs.filter((output) => {
  // Must have valid control type
  if (!CONTROL_COMPONENT_MAP[output.control]) return false
  
  // Must have signal ID
  const signalId = getSignalIdForOutput(output)
  if (signalId === undefined) return false
  
  // Skip secondary half-bridge channels
  const pair = findPairForOutput(output)
  if (pair && !isPrimary(output, pair)) return false
  
  // Must not already be assigned to this page
  return !assignedSignals.has(signalId)
})
```

---

## Migration and Backward Compatibility

### Legacy Data Handling

The configurator handles several legacy formats:

1. **DC Charger (string → object)**
   ```javascript
   // Old format
   power.dcCharger = "second-alternator"
   
   // Migrates to
   power.dcCharging = {
     secondAlternator: true,
     orionXs: false
   }
   ```

2. **Boolean subsystems → Structured configs**
   ```javascript
   // Old format
   switching.keypad = true
   
   // Migrates to
   switching.keypad = {
     enabled: true,
     count: 1,
     buttonsPerKeypad: 8
   }
   ```

3. **Tank counts → Structured tanks**
   ```javascript
   // Old format
   tanks: { fresh: 2, grey: 1, black: 1 }
   
   // Migrates to
   plumbing: {
     enabled: true,
     count: 4,
     tanks: [
       { type: "fresh", name: "" },
       { type: "fresh", name: "" },
       { type: "waste", name: "" },
       { type: "black", name: "" }
     ]
   }
   ```

### Preserving User Data on Type Switch

When switching from CORE → CORE LITE:
- ✅ Preserved: Labels, icons, control types for channels 1-6
- ❌ Lost: Channels 9-29 (don't exist in CORE LITE)
- ❌ Lost: Half-bridge pairing settings
- ✅ Preserved: All system options (power, HVAC, etc.)

When switching from CORE LITE → CORE:
- ✅ Preserved: All CORE LITE channel settings
- ✅ Added: New channels 9-29 with default settings
- ✅ Available: Half-bridge pairing options

---

## Best Practices

### For System Integrators

1. **Choose system type first** before configuring channels
2. **Name all active channels** with meaningful labels
3. **Assign icons** for visual clarity in HMI
4. **Use signal map** for complex signal routing instead of manual overrides
5. **Test half-bridge pairings** before deploying to hardware

### For Developers

1. **Always validate signalId** before creating components
2. **Check for pairing** before allowing channel edits
3. **Preserve user data** during migrations
4. **Use getSignalIdForOutput()** for consistent ID resolution
5. **Sync nodes after output changes** to keep UI consistent

---

## Example: Configuring a Lighting System

### Step 1: Select System Type
- Choose **CORE** for full feature set

### Step 2: Configure Channels
```javascript
// Channel 1: Main overhead lights (toggle)
{
  id: "core-01",
  source: "core",
  channel: 1,
  label: "Overhead Lights",
  control: "toggle-button",
  icon: "icons/Lightin.svg",
  signalId: 100  // From signal map
}

// Channel 2: Reading lights (dimmer)
{
  id: "core-02",
  source: "core",
  channel: 2,
  label: "Reading Lights",
  control: "slider",
  icon: "icons/Lightin.svg",
  signalId: 101,
  range: { min: 0, max: 100, step: 1 }
}

// Channel 3-4: Electric awning (half-bridge)
{
  id: "core-03",
  source: "core",
  channel: 3,
  label: "Awning Motor",
  control: "slider",  // Forced by half-bridge
  signalId: 102
}
{
  id: "core-04",
  source: "core",
  channel: 4,
  label: "Awning Motor",  // Inherited from channel 3
  control: "slider",      // Forced by half-bridge
  signalId: 102           // Same as channel 3
}
```

### Step 3: Enable Components
```javascript
options.components.lighting = true
options.lighting = {
  rgb: true,
  itcModules: 2,
  itcModuleZones: 4
}
```

### Step 4: Add to Pages
- Toggle button (3 units wide) → "Lighting" page
- Dimmer slider (6 units wide) → "Lighting" page
- Half-bridge control appears as single slider for awning

---

## Data Flow Diagram

```
User Action
    ↓
Change System Type
    ↓
syncOutputsToType()
    ↓
┌─────────────────────────────────────┐
│ Generate Template (CORE or LITE)   │
│ - Load channel definitions          │
│ - Create base output objects        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Merge Existing Configuration        │
│ - Match by source:channel           │
│ - Preserve label, control, icon     │
│ - Keep range and signalId           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Prune Invalid Components            │
│ - Remove orphaned page components   │
│ - Remove invalid signal IDs         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Sync Nodes with Outputs             │
│ - Update component types            │
│ - Update bindings                   │
│ - Update props (range, etc.)        │
└─────────────────────────────────────┘
    ↓
Re-render UI
```

---

## Summary

The channel configuration system provides:

- **Flexible hardware support** (CORE vs CORE LITE)
- **Multiple control types** (momentary, toggle, dimmer)
- **Advanced features** (half-bridge pairing for motors)
- **Signal routing** (channel → signal ID mapping)
- **Data preservation** (settings survive system type changes)
- **Backward compatibility** (handles legacy formats)

This architecture enables building complex HMI configurations while maintaining a clean, validated data model.
