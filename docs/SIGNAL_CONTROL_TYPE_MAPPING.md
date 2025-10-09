# Signal Name → Control Type Mapping

## Quick Reference

**This is the key to understanding how EmpirBus channels map to HMI components!**

### The Rule

The **signal names** in Unit 2 (MFD/WDU) determine what type of control the HMI should show:

```
Signal Name Pattern          → Control Type
─────────────────────────────────────────────
dcu-channel-X                → dimmer
toggle-channel-X (no dcu)    → toggle-button
mom-channel-X (no dcu)       → toggle-button
special-function-X           → special-function
```

## Examples

### Example 1: Dimmer Channel

**Signal Info:**

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
  "description": "dcu-channel-1"  // ← This makes it a dimmer!
}
```

**Result:** Control type = `dimmer`

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

### Example 2: Toggle Button

**Signal Info:**

```json
{
  "signalId": 48,
  "description": "toggle-channel-3-on-off" // No dcu signal!
}
```

**Result:** Control type = `toggle-button`

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

### Example 3: Special Function

**Signal Info:**

```json
{
  "signalId": 53,
  "description": "special-function-11"
}
```

**Result:** Control type = `special-function`

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

## Why This Matters

### For Developers

- You don't have to guess which component to use
- Hardware config tells you: `"control": "dimmer"` or `"control": "toggle-button"`
- Just look at the control type and pick the matching component

### For Configuration

- Extraction script automatically detects control types
- Signal names are the source of truth
- Channel names (core-channel-X) are just labels

### For WebSocket Messages

- Dimmer → `messagetype: 17, messagecmd: 3` (with 0-100 value)
- Toggle → `messagetype: 17, messagecmd: 1` (with 0 or 1)
- Special → `messagetype: 17, messagecmd: 1` (momentary press)

## Unit 2 (MFD/WDU)

```xml
<unit id="2" serial="0" name="MFD / WDU" unitTypeId="200">
```

**This unit contains all user-facing control channels:**

- Buttons bound to channels
- Sliders bound to channels
- Indicators bound to channels
- Gauges bound to channels

**The signal naming in this unit is what determines your HMI component types.**

## Your Current Setup

Based on extraction from `core-v2_9-30-25_v1.ebp`:

- **16 Dimmer channels** (have `dcu-channel-X` signal)
- **5 Toggle channels** (have `toggle-channel-X` but NO `dcu-`)
- **2 Special function channels** (have `special-function-X`)

## Complete Documentation

For full details, see:

- `/docs/EMPIRBUS_SIGNAL_NAMING_CONVENTION.md` - Complete reference
- `/docs/EMPIRBUS_CHANNEL_MAPPING.md` - Channel mapping guide
- `/CHANNEL_MAPPING_QUICKSTART.md` - Quick setup guide

---

**Bottom Line:** The `dcu-`, `mom-`, and `toggle-` prefixes in signal names tell you how to control the channel. The extraction script reads these and sets the correct control type automatically. 🎯
