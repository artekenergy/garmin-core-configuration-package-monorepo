# EmpirBus Signal Naming Convention

**Date:** October 3, 2025  
**Purpose:** Document how EmpirBus signal names determine HMI component control types

## Overview

In EmpirBus, each physical output channel can have multiple **signals** that represent different ways to interact with that channel. The **naming convention** of these signals is what determines how the HMI should present controls for that channel.

## Signal Name Patterns

### Pattern 1: Dimmer Channels (DCU)

**Signal Names:**

- `toggle-channel-X-on-off` - Toggle the channel on/off
- `mom-channel-X-on-off` - Momentary button for the channel
- `dcu-channel-X` - **Dimmer Control Unit (DCU)** - intensity control

**Example (Channel 1):**

```json
{
  "signalId": 14,
  "description": "mom-channel-1-on-off"
},
{
  "signalId": 15,
  "description": "toggle-channel-1-on-off"
},
{
  "signalId": 16,
  "description": "dcu-channel-1"  // ← DCU = Dimmer!
}
```

**Control Type:** `dimmer`

**HMI Component:**

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

**Interaction:**

- User can set intensity from 0-100%
- Sends EmpirBus message: `messagetype: 17, messagecmd: 3, value: 0-100`

---

### Pattern 2: Toggle/Button Channels (No DCU)

**Signal Names:**

- `toggle-channel-X-on-off` - Toggle the channel on/off
- `mom-channel-X-on-off` - Momentary button for the channel
- **NO `dcu-` signal** - No dimming capability

**Example (Channel 3):**

```json
{
  "signalId": 48,
  "description": "toggle-channel-3-on-off"
}
```

**Control Type:** `toggle-button`

**HMI Component:**

```json
{
  "type": "toggle",
  "label": "Bilge Pump",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-03"
    }
  }
}
```

**Interaction:**

- User taps to toggle on/off
- Sends EmpirBus message: `messagetype: 17, messagecmd: 1, value: 0 or 1`

---

### Pattern 3: Special Functions

**Signal Names:**

- `special-function-X` - Special function trigger
- **NO standard toggle/mom/dcu pattern**

**Example (Channel 11):**

```json
{
  "signalId": 53,
  "description": "special-function-11"
}
```

**Control Type:** `special-function`

**HMI Component:**

```json
{
  "type": "button",
  "label": "Horn",
  "action": "momentary",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-11"
    }
  }
}
```

**Interaction:**

- User presses and holds
- Sends EmpirBus message while pressed
- Releases when user lifts finger

---

## Control Type Detection Logic

The extraction script uses this logic to determine control types:

```python
def determine_control_type(signals):
    """
    Determine control type based on signal naming convention

    Logic:
    1. If channel has a 'dcu-' signal → dimmer
    2. If channel has 'toggle-' or 'mom-' but NO 'dcu-' → toggle-button
    3. If channel has 'special-function-' → special-function
    """

    has_dcu = any('dcu-' in sig['description'] for sig in signals)
    has_toggle = any('toggle-' in sig['description'] for sig in signals)
    has_mom = any('mom-' in sig['description'] for sig in signals)
    has_special = any('special-function-' in sig['description'] for sig in signals)

    if has_dcu:
        return 'dimmer'
    elif has_special:
        return 'special-function'
    elif has_toggle or has_mom:
        return 'toggle-button'
    else:
        return 'unknown'
```

## EmpirBus Unit 2 (MFD / WDU)

**Unit Definition:**

```xml
<unit id="2" serial="0" name="MFD / WDU" unitTypeId="200"
      standardUnitVariantNumber="88888888" standardUnitModelName="">
```

**Key Points:**

- Unit 2 contains all the **user-facing control channels**
- Channels 1-29 (excluding sensors and unused channels)
- Signal naming convention applies to all channels in this unit
- The signal names are what the HMI binds to for component interaction

**Why This Matters:**

- **Signal names** determine component type (dimmer vs toggle vs button)
- **Channel names** (core-channel-X) are for human identification
- **Signal IDs** are the actual EmpirBus communication endpoints
- HMI components bind to channels, which resolve to signal IDs via hardware config

## Mapping Flow

```
User Interaction (HMI Component)
  ↓
Component Binding (channel: "core-01")
  ↓
Hardware Config Lookup (channel 1 has signals: 14, 15, 16)
  ↓
Signal Name Check (signal 16 = "dcu-channel-1")
  ↓
Control Type Determined (dimmer)
  ↓
WebSocket Message (messagetype: 17, messagecmd: 3, value: 0-100)
  ↓
EmpirBus Controller (processes dimmer command)
  ↓
Physical Output (sets LED intensity)
```

## Complete Channel Reference

### Dimmer Channels (16 total)

All have **`dcu-channel-X`** signal = intensity control enabled

| Channel | Hardware ID | Signal Pattern                  | Control Type |
| ------- | ----------- | ------------------------------- | ------------ |
| 1       | core-01     | toggle-1 / mom-1 / **dcu-1**    | dimmer       |
| 2       | core-02     | toggle-2 / mom-2 / **dcu-2**    | dimmer       |
| 5       | core-05     | toggle-5 / mom-5 / **dcu-5**    | dimmer       |
| 9       | core-09     | toggle-9 / mom-9 / **dcu-9**    | dimmer       |
| 10      | core-10     | toggle-10 / mom-10 / **dcu-10** | dimmer       |
| 13      | core-13     | toggle-13 / mom-13 / **dcu-13** | dimmer       |
| 17      | core-17     | toggle-17 / mom-17 / **dcu-17** | dimmer       |
| 18      | core-18     | toggle-18 / mom-18 / **dcu-18** | dimmer       |
| 19      | core-19     | toggle-19 / mom-19 / **dcu-19** | dimmer       |
| 20      | core-20     | toggle-20 / mom-20 / **dcu-20** | dimmer       |
| 21      | core-21     | toggle-21 / mom-21 / **dcu-21** | dimmer       |
| 25      | core-25     | toggle-25 / mom-25 / **dcu-25** | dimmer       |
| 26      | core-26     | toggle-26 / mom-26 / **dcu-26** | dimmer       |
| 27      | core-27     | toggle-27 / mom-27 / **dcu-27** | dimmer       |
| 28      | core-28     | toggle-28 / mom-28 / **dcu-28** | dimmer       |
| 29      | core-29     | toggle-29 / mom-29 / **dcu-29** | dimmer       |

### Toggle/Button Channels (5 total)

Have **`toggle-X`** or **`mom-X`** but **NO `dcu-X`** = on/off only

| Channel | Hardware ID | Signal Pattern   | Control Type  |
| ------- | ----------- | ---------------- | ------------- |
| 3       | core-03     | toggle-3 / mom-3 | toggle-button |
| 4       | core-04     | toggle-4 / mom-4 | toggle-button |
| 6       | core-06     | toggle-6 / mom-6 | toggle-button |
| 7       | core-07     | toggle-7 / mom-7 | toggle-button |
| 8       | core-08     | toggle-8 / mom-8 | toggle-button |

### Special Function Channels (2 total)

Have **`special-function-X`** pattern = custom behavior

| Channel | Hardware ID | Signal Pattern      | Control Type     |
| ------- | ----------- | ------------------- | ---------------- |
| 11      | core-11     | special-function-11 | special-function |
| 12      | core-12     | special-function-12 | special-function |

## Usage in HMI Development

### Step 1: Check Hardware Config

```json
// configuration/hardware-config.json
{
  "outputs": [
    {
      "id": "core-01",
      "channel": 1,
      "control": "dimmer", // ← Determined by dcu-channel-1 signal
      "signals": {
        "toggle": 15,
        "momentary": 14,
        "dimmer": 16 // ← dcu-channel-1
      }
    }
  ]
}
```

### Step 2: Choose Component Type

```javascript
// If control = "dimmer" → Use Dimmer component
// If control = "toggle-button" → Use Toggle component
// If control = "special-function" → Use Button component
```

### Step 3: Create Component

```json
{
  "type": "dimmer", // Matches control type
  "label": "Cabin Overhead Lights",
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-01" // References hardware config
    }
  }
}
```

### Step 4: WebSocket Message

```typescript
// Component sends appropriate message based on control type
if (controlType === 'dimmer') {
  // messagetype: 17, messagecmd: 3 (dimmer)
  send({ messagetype: 17, messagecmd: 3, channel: [1, 0, intensity] });
} else if (controlType === 'toggle-button') {
  // messagetype: 17, messagecmd: 1 (toggle)
  send({ messagetype: 17, messagecmd: 1, channel: [1, 0, state] });
}
```

## Key Takeaways

1. **Signal names determine control type**, not channel names
2. **`dcu-` prefix = dimmer capability** (intensity control)
3. **No `dcu-` = toggle/button** (on/off only)
4. **`special-function-` = special behavior** (custom handling)
5. **Hardware config stores this mapping** for runtime lookup
6. **Extraction script automates detection** from signal-info.json

## Related Documentation

- `/docs/EMPIRBUS_CHANNEL_MAPPING.md` - Full channel mapping reference
- `/CHANNEL_MAPPING_QUICKSTART.md` - Quick setup guide
- `/packages/hmi-ui/COMPONENT_BINDING_GUIDE.md` - Component binding architecture
- `/configuration/hardware-config.json` - Generated hardware configuration
- `/configuration/channel-mapping.json` - Complete technical reference

---

**This is critical information for understanding why certain channels are classified as dimmers vs toggles!** The extraction script already implements this logic correctly by checking for the presence of `dcu-` signals.
