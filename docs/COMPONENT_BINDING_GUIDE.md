# Component Binding Guide for EmpirBus Digital Switching

## Overview

This guide explains how UI components in the HMI UI are mapped to physical outputs on the EmpirBus digital switching controller (Connect 50 v2). The binding system creates a bridge between:

1. **EmpirBus Project File** (.ebp) - Defines physical hardware channels
2. **Signal Info** (signal-info.json) - Maps signal IDs to channel types
3. **Schema Hardware Config** (schema.json) - Defines logical outputs with friendly IDs
4. **UI Components** (schema.json tabs) - Visual controls that users interact with

## The Binding Flow

```
User Interaction → UI Component → Binding Resolver → WebSocket Message → EmpirBus Controller
                                          ↓
                                   Hardware Config
                                          ↓
                                   Channel Number
```

## 1. EmpirBus Project Structure

The `.ebp` file (EmpirBus project) defines the physical hardware configuration. From `core-v2_9-30-25_v1.ebp`:

### Unit Configuration

```xml
<unit id="1" serial="931207" name="Connect 50 v2" unitTypeId="20">
  <unitChannelGroup channelGroupId="...">
    <!-- Physical channels, components, and connections -->
  </unitChannelGroup>
</unit>
```

### Signal Data Transfer Packets

The netlist contains encoded channel data that maps to physical outputs:

```xml
<netListTransferPacket data="MJmU+0ANAwAAAAIAAAkAEiAAAAEAAwYAAAEDGAAA..." />
```

These packets encode the relationship between:

- **Signal IDs** (1-1793 in signal-info.json)
- **Channel numbers** (1-N on the Connect 50)
- **Control types** (momentary, toggle, dimmer)

## 2. Signal Info Mapping

`signal-info.json` provides metadata about each signal:

```json
{
  "signalId": 15,
  "description": "toggle-channel-1-on-off",
  "type": 0,
  "channelType": 1, // 1 = toggle, 2 = momentary, 3 = dimmer
  "dataItemFormatType": 0,
  "dataType": 0,
  "channelSettingType": 0
}
```

### Channel Types

- **0**: Not used
- **1**: Binary toggle (on/off)
- **2**: Momentary (push button)
- **3**: Variable/dimmer (0-100%)
- **5**: Analog input/sensor

## 3. Schema Hardware Configuration

The schema defines **logical outputs** with user-friendly identifiers:

```json
{
  "hardware": {
    "systemType": "core",
    "outputs": [
      {
        "id": "core-01", // String ID for referencing
        "source": "core", // Controller source
        "channel": 1, // Physical channel number
        "control": "toggle-button", // Control type
        "label": "Cabin Lights", // User-facing name
        "icon": "/icons/Light.svg" // Icon path
      },
      {
        "id": "core-02",
        "source": "core",
        "channel": 2,
        "control": "toggle-button",
        "label": "Nav Lights",
        "icon": "/icons/Light.svg"
      },
      {
        "id": "core-03",
        "source": "core",
        "channel": 3,
        "control": "push-button",
        "label": "Horn",
        "icon": "/icons/Sound.svg"
      },
      {
        "id": "dcu-01",
        "source": "dcu",
        "channel": 16,
        "control": "dimmer",
        "label": "Salon Lights",
        "icon": "/icons/Dimmer.svg"
      }
    ]
  }
}
```

### Output Properties

| Property  | Type   | Description                                             |
| --------- | ------ | ------------------------------------------------------- |
| `id`      | string | Unique identifier (e.g., "core-01", "dcu-01")           |
| `source`  | string | Controller type ("core", "dcu", "aux")                  |
| `channel` | number | Physical channel number on controller                   |
| `control` | string | Control type ("toggle-button", "push-button", "dimmer") |
| `label`   | string | Human-readable name                                     |
| `icon`    | string | Icon path (optional)                                    |

## 4. Component Bindings

UI components reference hardware outputs by their string ID:

### Toggle Component Example

```json
{
  "id": "comp-cabin-lights",
  "type": "toggle",
  "label": "Cabin Lights",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-01" // References hardware.outputs[0]
    }
  }
}
```

### Button Component Example

```json
{
  "id": "comp-horn",
  "type": "button",
  "label": "Horn",
  "action": "momentary",
  "bindings": {
    "action": {
      "type": "empirbus",
      "channel": "core-03" // References hardware.outputs[2]
    }
  }
}
```

### Dimmer Component Example

```json
{
  "id": "comp-salon-lights",
  "type": "dimmer",
  "label": "Salon Lights",
  "min": 0,
  "max": 100,
  "step": 5,
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "dcu-01" // References dimmer output
    }
  }
}
```

### Indicator Component Example

```json
{
  "id": "comp-generator-status",
  "type": "indicator",
  "label": "Generator Running",
  "color": "green",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-05" // Read-only status
    }
  }
}
```

## 5. Binding Types

### EmpirBus Binding

```typescript
{
  type: "empirbus",
  channel: string,           // References hardware.outputs[].id
  property?: "state" | "intensity" | "value"
}
```

### NMEA2000 Binding (Future)

```typescript
{
  type: "nmea2000",
  pgn: number,               // Parameter Group Number
  field: string,             // Data field name
  instance?: number          // Device instance
}
```

### Static Binding (Testing)

```typescript
{
  type: "static",
  value: any                 // Fixed value for testing
}
```

## 6. Binding Resolution Process

The `binding-resolver.ts` utility performs the lookup:

```typescript
// 1. Component has a binding with string channel reference
const binding = {
  type: 'empirbus',
  channel: 'core-01',
};

// 2. Resolver looks up in hardware.outputs
const output = schema.hardware.outputs.find((out) => out.id === 'core-01');
// output = { id: "core-01", channel: 1, control: "toggle-button", ... }

// 3. Extract numeric channel ID
const channelId = output.channel; // 1

// 4. Encode for WebSocket message
const lo = channelId & 0xff; // Low byte: 1
const hi = (channelId >> 8) & 0xff; // High byte: 0

// 5. Create EmpirBus message
const message = {
  messagetype: 17, // Control command
  messagecmd: 1, // Toggle/set state
  size: 3,
  data: [lo, hi, state ? 1 : 0], // [1, 0, 1] = Channel 1 ON
};

// 6. Send via WebSocket
wsAdapter.send(message);
```

## 7. WebSocket Message Protocol

### Outgoing Messages (UI → Controller)

**Toggle/Button Control** (messagetype: 17, messagecmd: 1)

```javascript
{
  messagetype: 17,
  messagecmd: 1,
  size: 3,
  data: [
    channelId & 0xff,        // Low byte of channel
    (channelId >> 8) & 0xff, // High byte of channel
    state ? 1 : 0            // 1 = ON, 0 = OFF
  ]
}
```

**Dimmer Control** (messagetype: 17, messagecmd: 3)

```javascript
{
  messagetype: 17,
  messagecmd: 3,
  size: 3,
  data: [
    channelId & 0xff,        // Low byte of channel
    (channelId >> 8) & 0xff, // High byte of channel
    intensity                // 0-100 (percentage)
  ]
}
```

**Heartbeat ACK** (messagetype: 128, messagecmd: 0)

```javascript
{
  messagetype: 128,
  messagecmd: 0,
  size: 1,
  data: [0x00]
}
```

### Incoming Messages (Controller → UI)

**Status Update** (messagetype: 16)

```javascript
{
  messagetype: 16,
  messagecmd: varies,
  size: varies,
  data: [...]  // Contains channel state updates
}
```

**Heartbeat Request** (messagetype: 48, messagecmd: 5)

```javascript
{
  messagetype: 48,
  messagecmd: 5,
  size: varies,
  data: [...]
}
// Auto-responds with heartbeat ACK
```

## 8. Creating Bindings: Step-by-Step

### Step 1: Identify Physical Output

From your EmpirBus project, determine:

- Which Connect 50 channel controls the output? (e.g., Channel 5)
- What type of control? (toggle, momentary, dimmer)
- What signal ID is used? (from signal-info.json)

### Step 2: Add to Hardware Config

Add an entry in `schema.json`:

```json
{
  "hardware": {
    "outputs": [
      {
        "id": "core-05",
        "source": "core",
        "channel": 5,
        "control": "toggle-button",
        "label": "Galley Lights",
        "icon": "/icons/Light.svg"
      }
    ]
  }
}
```

### Step 3: Create UI Component

Add a component in the tabs section:

```json
{
  "tabs": [
    {
      "id": "tab-lighting",
      "title": "Lighting",
      "sections": [
        {
          "id": "section-interior",
          "title": "Interior Lights",
          "components": [
            {
              "id": "comp-galley-lights",
              "type": "toggle",
              "label": "Galley Lights",
              "bindings": {
                "state": {
                  "type": "empirbus",
                  "channel": "core-05" // References hardware output
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

### Step 4: Component Automatically Binds

The runtime system:

1. Loads the schema
2. Resolves `"core-05"` → `channel: 5`
3. User clicks toggle → sends message: `[17, 1, 3, [5, 0, 1]]`
4. Controller turns on output channel 5

## 9. Component Binding Reference

### Toggle Component

```typescript
bindings: {
  state: EmpirBusBinding; // Required: controls on/off state
}
```

**Use Cases:**

- Lights (cabin, nav, exterior)
- Pumps (water, bilge)
- Fans
- Any binary on/off device

### Button Component

```typescript
bindings: {
  action?: EmpirBusBinding,  // Momentary action
  state?: EmpirBusBinding    // Toggle action (at least one required)
}
```

**Use Cases:**

- Horn (momentary)
- Door locks (momentary)
- Reset buttons (momentary)
- Mode switches (toggle)

### Dimmer Component

```typescript
bindings: {
  intensity: EmpirBusBinding; // Required: controls 0-100% level
}
```

**Use Cases:**

- Dimmable lights
- Fan speed control
- Variable outputs

### Gauge Component

```typescript
bindings: {
  value: EmpirBusBinding; // Required: displays numeric value
}
```

**Use Cases:**

- Tank levels
- Battery voltage
- Temperature
- Pressure

### Indicator Component

```typescript
bindings: {
  state: EmpirBusBinding; // Required: displays status
}
```

**Use Cases:**

- Generator running status
- Fault indicators
- System status lights

## 10. Advanced: Multi-Source Bindings

For systems with multiple controllers:

```json
{
  "hardware": {
    "outputs": [
      // Connect 50 (Core) outputs
      {
        "id": "core-01",
        "source": "core",
        "channel": 1,
        "control": "toggle-button"
      },
      // DCU (Dimmer Control Unit) outputs
      {
        "id": "dcu-01",
        "source": "dcu",
        "channel": 16,
        "control": "dimmer"
      },
      // Auxiliary module outputs
      {
        "id": "aux-01",
        "source": "aux",
        "channel": 100,
        "control": "toggle-button"
      }
    ]
  }
}
```

The binding resolver handles routing to the correct controller based on the `source` field.

## 11. Validation

The schema system validates bindings at load time:

**Valid Binding:**

```json
{
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-01" // ✅ Exists in hardware.outputs
    }
  }
}
```

**Invalid Binding (catches errors):**

```json
{
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-99" // ❌ Not defined in hardware.outputs
    }
  }
}
```

The resolver returns `null` for invalid bindings, preventing errors.

## 12. Testing Bindings

### Step 1: Verify Hardware Config

```javascript
const output = schema.hardware.outputs.find((o) => o.id === 'core-01');
console.log(output);
// { id: 'core-01', channel: 1, control: 'toggle-button', ... }
```

### Step 2: Test Resolution

```javascript
import { resolveBindingToChannelId } from './utils/binding-resolver';

const binding = { type: 'empirbus', channel: 'core-01' };
const channelId = resolveBindingToChannelId(binding);
console.log(channelId); // 1
```

### Step 3: Monitor WebSocket Messages

Open browser DevTools → Network → WS → Messages:

```
→ {"messagetype":17,"messagecmd":1,"size":3,"data":[1,0,1]}
← {"messagetype":16,"messagecmd":0,"size":3,"data":[1,0,1]}
```

## 13. Best Practices

### Naming Conventions

- **Hardware IDs**: Use source prefix + number (e.g., `core-01`, `dcu-01`)
- **Component IDs**: Use descriptive names (e.g., `comp-cabin-lights`)
- **Labels**: Keep user-friendly and concise

### Grouping

Organize outputs by function:

```json
{
  "hardware": {
    "outputs": [
      // Lighting
      { "id": "core-01", "label": "Cabin Lights" },
      { "id": "core-02", "label": "Nav Lights" },

      // Pumps
      { "id": "core-10", "label": "Fresh Water Pump" },
      { "id": "core-11", "label": "Bilge Pump" }
    ]
  }
}
```

### Icon Consistency

Use consistent icons for similar functions:

- `/icons/Light.svg` - All lights
- `/icons/Power.svg` - All power switches
- `/icons/Water.svg` - All water-related outputs

### Documentation

Comment your hardware config:

```json
{
  "id": "core-05",
  "label": "Galley Lights"
  // Connected to LED strip in galley via relay R5
  // Max current: 5A
  // Uses signal ID 15 (toggle-channel-1-on-off)
}
```

## 14. Troubleshooting

### Issue: Component doesn't control output

**Check:**

1. Hardware config has correct channel number
2. Component binding references correct hardware ID
3. WebSocket connection is established
4. Message is being sent (check DevTools)

### Issue: Wrong channel activates

**Solution:** Verify channel number in hardware config matches EmpirBus project

### Issue: Binding validation fails

**Solution:** Ensure channel ID uses lowercase alphanumeric with hyphens only

### Issue: No WebSocket messages sent

**Check:**

1. Connection status indicator (should be green)
2. Binding resolver returns non-null channel ID
3. Component has `bindings` property defined

## 15. Summary

The binding system creates a three-layer abstraction:

```
Physical Layer (EmpirBus)
  ↓
Logical Layer (Hardware Config)
  ↓
UI Layer (Components)
```

**Key Points:**

1. Hardware config defines outputs with friendly string IDs
2. Components reference outputs by string ID
3. Binding resolver translates string → channel number
4. WebSocket adapter sends messages to controller
5. Schema validation ensures correctness

This architecture allows:

- ✅ Flexible UI layouts without changing hardware config
- ✅ Type-safe bindings with validation
- ✅ Easy reconfiguration without code changes
- ✅ Clear separation of concerns
- ✅ Support for multiple controller types
