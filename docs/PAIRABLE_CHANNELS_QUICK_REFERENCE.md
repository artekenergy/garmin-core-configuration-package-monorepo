# Hardware Configuration: Pairable Channels - Quick Reference

## Overview

CORE channels 3, 4, 12, and 13 have specialized control options to support both independent operation and half-bridge motor control.

---

## Control Type Options

### Pairable Channels: 3, 4, 12, 13

| Control Type    | Description                   | Use Case                         | Icon Support |
| --------------- | ----------------------------- | -------------------------------- | ------------ |
| **Not Used**    | Channel disabled              | N/A                              | ❌           |
| **Momentary**   | Push-button (momentary)       | Horn, wipers, momentary switches | ✅           |
| **Toggle**      | Toggle button (latching)      | Lights, fans, on/off controls    | ✅           |
| **Half-Bridge** | Motor control (bidirectional) | Awnings, slides, jacks, lifts    | ✅           |

### All Other Channels

| Control Type      | Description       | Use Case          |
| ----------------- | ----------------- | ----------------- |
| **Not Used**      | Channel disabled  | N/A               |
| **Push Button**   | Momentary control | Buttons, switches |
| **Toggle Button** | Latching control  | On/off devices    |
| **Slider**        | Variable control  | Dimmers, fans     |

---

## Half-Bridge Pairing Behavior

### Automatic Pairing Rules

When you select **Half-Bridge** for any pairable channel:

| You Select               | System Also Sets         | Pair Status |
| ------------------------ | ------------------------ | ----------- |
| Channel 3 → Half-Bridge  | Channel 4 → Half-Bridge  | ✅ Paired   |
| Channel 4 → Half-Bridge  | Channel 3 → Half-Bridge  | ✅ Paired   |
| Channel 12 → Half-Bridge | Channel 13 → Half-Bridge | ✅ Paired   |
| Channel 13 → Half-Bridge | Channel 12 → Half-Bridge | ✅ Paired   |

### Independent Configuration

Each channel in a pair can have:

- ✅ **Unique label** (e.g., "Extend" / "Retract")
- ✅ **Unique icon** (e.g., ➡️ / ⬅️)
- ✅ Both channels remain editable

### Un-pairing

To remove a half-bridge pair, change **either channel** to:

- Momentary
- Toggle
- Not Used

**Result**: The pair channel automatically changes to the same control type, and the pair is removed.

**Example**:

- Change Channel 12 from Half-Bridge → Toggle
- Channel 13 automatically changes from Half-Bridge → Toggle
- Pair is removed, both channels are now independent toggles

---

## Configuration Examples

### Example 1: Independent Toggle Controls

```
CORE #3: Toggle
  Label: "Cabin Lights"
  Icon: lightbulb.svg
  Status: Independent

CORE #4: Momentary
  Label: "Horn"
  Icon: speaker.svg
  Status: Independent
```

### Example 2: Half-Bridge Motor Control

```
CORE #12: Half-Bridge
  Label: "Awning Extend"
  Icon: arrow-right.svg
  Status: Paired with #13

CORE #13: Half-Bridge
  Label: "Awning Retract"
  Icon: arrow-left.svg
  Status: Paired with #12
```

### Example 3: Mixed Configuration

```
CORE #3: Toggle
  Label: "Deck Lights"
  Icon: lightbulb.svg
  Status: Independent

CORE #4: Toggle
  Label: "Nav Lights"
  Icon: navigation.svg
  Status: Independent

CORE #12: Half-Bridge
  Label: "Slide Extend"
  Icon: arrow-right.svg
  Status: Paired with #13

CORE #13: Half-Bridge
  Label: "Slide Retract"
  Icon: arrow-left.svg
  Status: Paired with #12
```

---

## Visual Indicators

### In the UI

- **HALF-BRIDGE Badge**: Appears on paired channels
- **Control Dropdown**: Shows only valid options for each channel type
- **Icon Picker**: Available for Momentary, Toggle, and Half-Bridge control types

### Channel Card Display

```
┌─────────────────────────────────────────────┐
│ CORE #12               [HALF-BRIDGE]        │
│ ┌──────────────────────────────────────────┐│
│ │ Half-Bridge                          ▼  ││
│ └──────────────────────────────────────────┘│
│                                              │
│ Label: [Awning Extend________________]      │
│                                              │
│ Icon:  [➡️ arrow-right.svg]  [✕]            │
└─────────────────────────────────────────────┘
```

---

## Schema Structure

When channels are configured as half-bridge:

```json
{
  "hardware": {
    "systemType": "core",
    "outputs": [
      {
        "id": "core-12",
        "source": "core",
        "channel": 12,
        "label": "Awning Extend",
        "control": "half-bridge",
        "icon": "icons/arrow-right.svg"
      },
      {
        "id": "core-13",
        "source": "core",
        "channel": 13,
        "label": "Awning Retract",
        "control": "half-bridge",
        "icon": "icons/arrow-left.svg"
      }
    ],
    "halfBridgePairs": [
      {
        "source": "core",
        "channelA": 12,
        "channelB": 13,
        "enabled": true
      }
    ]
  }
}
```

---

## Common Use Cases

### Motor Controls (Half-Bridge)

- Awnings (extend/retract)
- Slide-outs (extend/retract)
- Jacks (up/down)
- Power steps (extend/retract)
- Lifts (raise/lower)

### Independent Controls (Momentary/Toggle)

- Lighting zones
- Horn/bells
- Windshield wipers
- Fans
- Pumps
- Heaters

---

## Quick Tips

✅ **DO:**

- Use Half-Bridge for bidirectional motor control
- Give each channel in a pair unique labels describing the direction
- Use directional icons (arrows) for half-bridge channels
- Use Momentary for horn, wipers, or momentary switches
- Use Toggle for lights, fans, or on/off controls

❌ **DON'T:**

- Try to manually pair channels (it's automatic)
- Forget to label both channels in a half-bridge pair
- Use generic labels like "Motor 1" (be specific: "Awning Extend")
- Mix up which channel is which direction

---

## Related Documentation

- [HALF_BRIDGE_PAIRING_UPDATE.md](./HALF_BRIDGE_PAIRING_UPDATE.md) - Detailed update notes
- [HARDWARE_CONFIG_QUICKSTART.md](./HARDWARE_CONFIG_QUICKSTART.md) - Hardware configuration guide
- [HARDWARE_CONFIG_IMPLEMENTATION.md](./HARDWARE_CONFIG_IMPLEMENTATION.md) - Technical implementation

---

**Last Updated**: October 7, 2025
