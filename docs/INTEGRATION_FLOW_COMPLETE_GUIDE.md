# Complete Integration Flow: EmpirBus → Schema → Components

**Date:** October 3, 2025  
**Purpose:** Document the complete data flow from EmpirBus channels to rendered UI components

## Overview

This guide traces the complete path from physical hardware channels in your EmpirBus project through to interactive UI components on the Garmin display.

```
EmpirBus Project (.ebp)
  ↓ [Python Extraction Script]
Hardware Config (JSON)
  ↓ [Web Configurator]
UI Schema (schema.json)
  ↓ [HMI UI Runtime]
Rendered Components (Preact)
  ↓ [WebSocket Adapter]
Physical Hardware (via EmpirBus)
```

---

## Part 1: EmpirBus → Hardware Config

### 1.1 Source: EmpirBus Project File

**File:** `core-v2_9-30-25_v1.ebp` (25,560 lines XML)

**Unit 1 - Connect 50 v2 (Output Channels):**

```xml
<unit id="1" name="Connect 50 v2">
  <channel number="1" name="core-channel-1" direction="Output"
           outMainChannelSettingId="48" />
  <channel number="2" name="core-channel-2" direction="Output"
           outMainChannelSettingId="48" />
  <!-- ... channels 3-29 -->
</unit>
```

**Unit 2 - MFD/WDU (Input Signals):**

```xml
<unit id="2" name="MFD / WDU">
  <!-- Control signals for output channels -->
  <channel number="14" name="mom-channel-1-on-off" direction="Input" />
  <channel number="15" name="toggle-channel-1-on-off" direction="Input" />
  <channel number="16" name="dcu-channel-1" direction="Input" />
  <!-- ... 200+ input signals -->
</unit>
```

**Key Properties:**

- **Output channels**: Physical hardware outputs (channels 1-29)
- **Input signals**: Control signals that map to outputs (signals 14-199)
- **`outMainChannelSettingId`**: Determines channel type (48=toggle, 53=special)
- **Signal names**: Determine control capabilities (dcu=dimmer, toggle=toggle, mom=momentary)

### 1.2 Extraction: Python Script

**File:** `scripts/extract-empirbus-channels.py`

**Process:**

1. Parse .ebp XML to find output channels
2. Load signal-info.json with signal definitions
3. Match signals to channels by name pattern
4. Determine control type from signal presence

**Key Logic:**

```python
def map_channels_to_signals(ebp_channels, signals):
    for ch in ebp_channels:
        ch_num = ch['number']

        # Look for standard signal names
        toggle_desc = f"toggle-channel-{ch_num}-on-off"
        mom_desc = f"mom-channel-{ch_num}-on-off"
        dcu_desc = f"dcu-channel-{ch_num}"

        toggle_sig = signal_lookup.get(toggle_desc)
        mom_sig = signal_lookup.get(mom_desc)
        dcu_sig = signal_lookup.get(dcu_desc)

        # Determine control type
        if dcu_sig:
            control_type = "dimmer"      # Has intensity control
        elif ch['settingId'] == 53:
            control_type = "special-function"
        else:
            control_type = "toggle-button"  # Simple on/off
```

**Signal Name Convention (Now 100% Consistent):**

- `toggle-channel-X-on-off` → Toggle signal (all channels)
- `mom-channel-X-on-off` → Momentary signal (all channels)
- `dcu-channel-X` → Dimmer/intensity signal (16 channels have this)
- `special-function-X` → Special function (channels 11, 12)

### 1.3 Output: Hardware Configuration

**File:** `configuration/hardware-config.json`

**Structure:**

```json
{
  "systemType": "core",
  "outputs": [
    {
      "id": "core-01", // Hardware channel ID (string)
      "source": "core", // System type
      "channel": 1, // Physical channel number
      "control": "dimmer", // Control type (determined by signals)
      "label": "Core 1", // Human-readable name
      "icon": "/icons/Dimmer.svg",
      "signals": {
        "toggle": 15, // Signal ID for toggle
        "momentary": 14, // Signal ID for momentary
        "dimmer": 16 // Signal ID for dimmer (if present)
      },
      "originalName": "core-channel-1" // Name from .ebp file
    }
    // ... 22 more channels
  ]
}
```

**Control Type Mapping:**

- **`dimmer`** (16 channels): Has `dcu-channel-X` signal → supports intensity 0-100%
- **`toggle-button`** (5 channels): Has toggle/mom but NO dcu → simple on/off
- **`special-function`** (2 channels): settingId=53 → custom behavior

---

## Part 2: Hardware Config → UI Schema

### 2.1 Web Configurator: Component Palette

**File:** `packages/web-configurator/src/components/ComponentPalette.tsx`

**Purpose:** Show available hardware channels that can be added to UI

**Logic:**

```typescript
// Get configured channels (not "not-used")
const configuredChannels = schema.hardware?.outputs.filter(
  (output) => output.control !== 'not-used'
);

// Filter out channels already used in UI
const usedComponentIds = new Set<string>();
schema.tabs.forEach((tab) => {
  tab.sections.forEach((section) => {
    section.components.forEach((component) => {
      usedComponentIds.add(component.id);
    });
  });
});

const availableChannels = configuredChannels.filter((channel) => {
  const componentId = `comp-${channel.id}`;
  return !usedComponentIds.has(componentId);
});
```

### 2.2 Web Configurator: Control Type Mapping

**File:** `packages/web-configurator/src/constants/hardware.ts`

**Mapping Table:**

```typescript
export const CONTROL_COMPONENT_MAP = {
  'not-used': null,
  'push-button': {
    component: 'button' as const,
    action: 'momentary' as const,
  },
  'toggle-button': {
    component: 'toggle' as const,
  },
  slider: {
    component: 'dimmer' as const,
  },
  'half-bridge': {
    component: 'dimmer' as const,
  },
  dimmer: {
    component: 'dimmer' as const,
  },
} as const;
```

**Important:** The web configurator uses these old names, but we can update them to match:

- `"push-button"` → should be `"special-function"` or `"momentary"`
- `"toggle-button"` → matches our extraction output ✅
- `"dimmer"` → matches our extraction output ✅
- `"slider"` and `"half-bridge"` → legacy names we should update

### 2.3 Web Configurator: Component Creation

**File:** `packages/web-configurator/src/pages/EditorPage.tsx`

**When user drags channel from palette:**

```typescript
const handleAddComponent = (channelId: string) => {
  // Find hardware channel
  const channel = schema.hardware?.outputs.find((o) => o.id === channelId);
  if (!channel) return;

  // Get component type from control type
  const mapping = CONTROL_COMPONENT_MAP[channel.control];
  if (!mapping) return;

  // Build component based on control type
  const componentId = `comp-${channel.id}`;
  let newComponent: Component;

  if (mapping.component === 'button') {
    newComponent = {
      id: componentId,
      type: 'button',
      label: channel.label || `${channel.source} ${channel.channel}`,
      action: mapping.action,
      bindings: {
        action: {
          type: 'empirbus',
          channel: channelId, // References hardware ID: "core-01"
        },
      },
    };
  } else if (mapping.component === 'toggle') {
    newComponent = {
      id: componentId,
      type: 'toggle',
      label: channel.label,
      bindings: {
        state: {
          type: 'empirbus',
          channel: channelId, // References hardware ID: "core-01"
        },
      },
    };
  } else if (mapping.component === 'dimmer') {
    newComponent = {
      id: componentId,
      type: 'dimmer',
      label: channel.label,
      min: 0,
      max: 100,
      step: 5,
      bindings: {
        intensity: {
          type: 'empirbus',
          channel: channelId, // References hardware ID: "core-01"
        },
      },
    };
  }

  // Add component to selected section
  // ... (updateSchema logic)
};
```

### 2.4 Output: UI Schema

**File:** `packages/hmi-ui/public/schema.json`

**Complete Structure:**

```json
{
  "schemaVersion": "0.1.0",
  "metadata": {
    "projectName": "Marine HMI",
    "author": "Jordan Burgess",
    "createdAt": "2025-10-03T00:00:00.000Z"
  },
  "hardware": {
    "systemType": "core",
    "outputs": [
      {
        "id": "core-01",
        "source": "core",
        "channel": 1,
        "control": "dimmer",
        "label": "Cabin Overhead Lights",
        "icon": "/icons/Dimmer.svg"
      }
      // ... all hardware channels
    ]
  },
  "tabs": [
    {
      "id": "lighting",
      "title": "Lighting",
      "icon": "/icons/lightbulb.svg",
      "sections": [
        {
          "id": "interior",
          "title": "Interior Lights",
          "components": [
            {
              "id": "comp-core-01",
              "type": "dimmer",
              "label": "Cabin Overhead",
              "min": 0,
              "max": 100,
              "step": 5,
              "bindings": {
                "intensity": {
                  "type": "empirbus",
                  "channel": "core-01" // References hardware.outputs[0].id
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

**Key Points:**

- **Hardware section**: Defines available channels (from hardware-config.json)
- **Components section**: References hardware channels via `channel` ID
- **Binding**: Links component property (`intensity`) to hardware channel (`core-01`)

---

## Part 3: UI Schema → Rendered Components

### 3.1 HMI UI: Schema Loading

**File:** `packages/hmi-ui/src/utils/schema-loader.ts`

**Process:**

```typescript
export async function loadSchema(config = {}) {
  const { schemaPath = '/schema.json' } = config;

  // Fetch schema
  const response = await fetch(schemaPath);
  const schemaData = await response.json();

  // Validate with Zod
  const result = validateSchema(schemaData);

  if (result.success) {
    // Store in global signal
    schemaSignal.value = result.data;
  } else {
    errorSignal.value = 'Schema validation failed';
  }
}
```

### 3.2 HMI UI: Component Renderer

**File:** `packages/hmi-ui/src/components/ComponentRenderer.tsx`

**Component Factory Pattern:**

```typescript
export function ComponentRenderer(props: ComponentRendererProps) {
  const { component } = props;

  switch (component.type) {
    case 'toggle':
      return <Toggle component={component} />;

    case 'button':
      return <Button component={component} />;

    case 'dimmer':
      return <Dimmer component={component} />;

    case 'gauge':
      return <Gauge component={component} />;

    case 'indicator':
      return <Indicator component={component} />;

    case 'slider':
      return <Slider component={component} />;

    default:
      return <div>Unknown component: {component.type}</div>;
  }
}
```

### 3.3 HMI UI: Toggle Component Example

**File:** `packages/hmi-ui/src/components/Toggle.tsx`

**Render Logic:**

```typescript
export function Toggle(props: ToggleProps) {
  const { component } = props;
  const [state, setState] = useState(false);

  const handleToggle = () => {
    const newState = !state;
    setState(newState);

    // Send to hardware via WebSocket
    if (component.bindings?.state) {
      const binding = component.bindings.state;

      if (binding.type === 'empirbus') {
        // Resolve channel ID to numeric channel
        const channelId = resolveBindingToChannelId(binding);

        if (channelId !== null) {
          // Send EmpirBus message
          sendEmpirBusMessage({
            messagetype: 17,
            messagecmd: 1,  // Toggle command
            channel: [
              channelId & 0xff,          // Low byte
              (channelId >> 8) & 0xff,   // High byte
              newState ? 1 : 0           // State
            ]
          });
        }
      }
    }
  };

  return (
    <div className={styles.toggle} onClick={handleToggle}>
      <div className={state ? styles.on : styles.off}>
        {component.label}
      </div>
    </div>
  );
}
```

### 3.4 HMI UI: Binding Resolver

**File:** `packages/hmi-ui/src/utils/binding-resolver.ts`

**Channel Resolution:**

```typescript
export function resolveBindingToChannelId(binding: Binding): number | null {
  if (binding.type !== 'empirbus') {
    return null;
  }

  const channelRef = binding.channel; // "core-01" (string)
  const schema = schemaSignal.value;

  if (!schema?.hardware) {
    return null;
  }

  // Find hardware output by ID
  const output = schema.hardware.outputs.find((out) => out.id === channelRef);

  if (!output) {
    return null;
  }

  return output.channel; // Returns 1 (number)
}
```

**Flow:**

1. Component has binding: `{ type: 'empirbus', channel: 'core-01' }`
2. Resolver looks up `'core-01'` in `schema.hardware.outputs`
3. Finds: `{ id: 'core-01', channel: 1, control: 'dimmer', ... }`
4. Returns numeric channel: `1`
5. WebSocket message uses numeric channel: `[1, 0, value]`

---

## Part 4: Components → Physical Hardware

### 4.1 WebSocket Adapter

**File:** `packages/hmi-ui/src/adapters/websocket-adapter.ts`

**Message Format:**

```typescript
interface EmpirBusMessage {
  messagetype: number; // 17 = control, 128 = heartbeat ACK
  messagecmd: number; // 1 = toggle, 3 = dimmer
  channel: number[]; // [channelLo, channelHi, value]
}

export class WebSocketAdapter {
  private ws: WebSocket | null = null;

  connect() {
    this.ws = new WebSocket(`ws://${host}/ws`);

    this.ws.onopen = () => {
      connectionStateSignal.value = 'connected';
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Handle heartbeat requests
      if (message.messagetype === 48) {
        this.sendHeartbeatAck();
      }

      // Handle status updates
      if (message.messagetype === 16) {
        // Update component states
      }
    };
  }

  send(message: EmpirBusMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  sendHeartbeatAck() {
    this.send({
      messagetype: 128, // Heartbeat ACK
      messagecmd: 0,
      channel: [],
    });
  }
}
```

### 4.2 Message Types by Component

**Toggle Component:**

```javascript
// Toggle on/off
{
  messagetype: 17,  // Control message
  messagecmd: 1,    // Toggle command
  channel: [1, 0, 1]  // Channel 1, state=on
}
```

**Dimmer Component:**

```javascript
// Set intensity to 75%
{
  messagetype: 17,  // Control message
  messagecmd: 3,    // Dimmer command
  channel: [1, 0, 75]  // Channel 1, intensity=75
}
```

**Button Component (Momentary):**

```javascript
// Press
{
  messagetype: 17,
  messagecmd: 1,
  channel: [11, 0, 1]  // Channel 11, pressed
}

// Release
{
  messagetype: 17,
  messagecmd: 1,
  channel: [11, 0, 0]  // Channel 11, released
}
```

### 4.3 Physical Hardware Response

**EmpirBus Controller:**

1. Receives WebSocket message
2. Decodes channel number (bytes 0-1)
3. Decodes command and value
4. Sends signal to physical output
5. LED/relay/dimmer responds
6. Sends status update back to HMI

---

## Complete Flow Example: Dimmer Component

### Step-by-Step Trace

**1. EmpirBus Project**

```xml
<channel number="1" name="core-channel-1" direction="Output"
         outMainChannelSettingId="48" />
```

**2. Unit 2 Signals**

```xml
<channel number="14" name="mom-channel-1-on-off" direction="Input" />
<channel number="15" name="toggle-channel-1-on-off" direction="Input" />
<channel number="16" name="dcu-channel-1" direction="Input" />
```

**3. Extraction Script**

```python
# Finds: dcu-channel-1 signal exists
# Determines: control_type = "dimmer"
```

**4. Hardware Config**

```json
{
  "id": "core-01",
  "channel": 1,
  "control": "dimmer",
  "signals": {
    "toggle": 15,
    "momentary": 14,
    "dimmer": 16
  }
}
```

**5. Web Configurator**

```typescript
// User drags "core-01" from palette
// Mapping: control="dimmer" → component="dimmer"
// Creates dimmer component with binding
```

**6. UI Schema**

```json
{
  "type": "dimmer",
  "label": "Cabin Lights",
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-01"
    }
  }
}
```

**7. Component Renderer**

```typescript
// Reads component.type === 'dimmer'
// Renders <Dimmer component={...} />
```

**8. User Interaction**

```typescript
// User slides to 75%
// Component calls: sendEmpirBusMessage()
// Binding resolver: "core-01" → channel 1
```

**9. WebSocket Message**

```json
{
  "messagetype": 17,
  "messagecmd": 3,
  "channel": [1, 0, 75]
}
```

**10. Physical Hardware**

```
→ EmpirBus controller receives message
→ Decodes: Channel 1, intensity 75%
→ PWM output to LED driver
→ Cabin lights dim to 75%
→ Status update sent back to HMI
```

---

## Key Integration Points

### 1. Signal Names → Control Types

**Critical Mapping:**

```
dcu-channel-X present      → control="dimmer"     → component="dimmer"
toggle-X only, no dcu      → control="toggle"     → component="toggle"
special-function-X         → control="special"    → component="button"
```

### 2. Channel ID Format

**String IDs throughout:**

```
Hardware Config:  "core-01"
UI Schema:        "core-01"
Binding:          channel: "core-01"
Resolver:         looks up "core-01" → returns 1
WebSocket:        uses numeric 1
```

### 3. Component Property Binding

**Binding Names:**

- Toggle: `bindings.state`
- Button: `bindings.action`
- Dimmer: `bindings.intensity`
- Gauge: `bindings.value`
- Indicator: `bindings.state`
- Slider: `bindings.value`

### 4. Web Configurator Update Needed

**Current mapping uses old names:**

```typescript
// OLD (current)
"push-button": { component: "button", action: "momentary" }
"toggle-button": { component: "toggle" }
"slider": { component: "dimmer" }

// SHOULD BE (to match extraction)
"special-function": { component: "button", action: "momentary" }
"toggle-button": { component: "toggle" }
"dimmer": { component: "dimmer" }
```

---

## Testing Checklist

### Integration Test Path

**1. Extraction Works ✅**

```bash
python3 scripts/extract-empirbus-channels.py
# Verify: hardware-config.json generated
# Verify: All 23 channels mapped
# Verify: Control types correct (16 dimmers, 5 toggles, 2 special)
```

**2. Hardware Config → Schema ✅**

```
# In Web Configurator:
1. Load hardware-config.json
2. Verify channels appear in palette
3. Drag channel to section
4. Verify correct component type created
5. Verify binding references correct channel ID
```

**3. Schema → Components ✅**

```
# In HMI UI:
1. Load schema.json
2. Verify component renders
3. Verify label displays correctly
4. Verify component type matches control type
```

**4. Components → WebSocket ⏸️ (Next Step)**

```
# Testing interaction:
1. Click toggle → should send messagetype 17, cmd 1
2. Slide dimmer → should send messagetype 17, cmd 3
3. Press button → should send press/release messages
4. Verify channel number correct in message
```

**5. WebSocket → Hardware ⏸️ (Final Validation)**

```
# On actual device:
1. Connect to EmpirBus controller
2. Interact with component
3. Verify physical output responds
4. Verify status updates received
```

---

## Summary

**Complete Integration Chain:**

```
┌─────────────────────────────────────────────────────────────┐
│ EmpirBus Project (.ebp)                                     │
│ • Output channels: core-channel-1 through core-channel-29  │
│ • Input signals: toggle/mom/dcu patterns                   │
│ • Signal names determine control capabilities              │
└────────────────────┬────────────────────────────────────────┘
                     │ Python Extraction Script
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Hardware Config (JSON)                                      │
│ • Channel IDs: "core-01", "core-02", etc.                 │
│ • Control types: "dimmer", "toggle-button", "special"     │
│ • Signal IDs mapped: toggle=15, mom=14, dimmer=16         │
└────────────────────┬────────────────────────────────────────┘
                     │ Web Configurator
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ UI Schema (schema.json)                                     │
│ • Hardware section: Available channels                     │
│ • Components: Reference channels via bindings              │
│ • Binding: { type: "empirbus", channel: "core-01" }       │
└────────────────────┬────────────────────────────────────────┘
                     │ HMI UI Schema Loader
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Component Renderer (Preact)                                 │
│ • Factory pattern: type → component class                  │
│ • Binding resolver: "core-01" → numeric channel 1         │
│ • Event handlers: interaction → WebSocket message          │
└────────────────────┬────────────────────────────────────────┘
                     │ WebSocket Adapter
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ EmpirBus Controller (Physical Hardware)                    │
│ • Receives JSON messages over WebSocket                   │
│ • Decodes channel number and command                       │
│ • Controls physical outputs (LEDs, relays, dimmers)       │
│ • Sends status updates back to HMI                        │
└─────────────────────────────────────────────────────────────┘
```

**100% Consistent Naming Convention Achieved! 🎉**

All signal channels now use the standard pattern (`toggle-channel-X`, `mom-channel-X`, `dcu-channel-X`), making the integration flow predictable and maintainable throughout the entire stack.
