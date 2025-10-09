# Signal Naming Convention - Documentation Complete ✅

**Date:** October 3, 2025  
**Status:** Signal naming convention fully documented

## What Was Clarified

You explained the critical relationship between **EmpirBus signal names** and **HMI control types**:

> "The actually button/slider/indicator, gauge info is going to be binded/mapped to these channels and the name of the channel is what indicates how to map them."

### Key Insight

In **Unit 2 (MFD / WDU)**, the signal naming convention determines control types:

- **DCU** (Dimmer Control Unit) → Channel supports intensity control (0-100%)
- **MOM** (Momentary) → Channel can be used as momentary button
- **TOGGLE** → Channel can be used as toggle switch

## Signal Pattern Examples

### Dimmer Channel (has DCU signal)

```
Signal 14: "mom-channel-1-on-off"
Signal 15: "toggle-channel-1-on-off"
Signal 16: "dcu-channel-1"  ← This makes it a dimmer!
```

**Result:** HMI shows dimmer slider with 0-100% control

### Toggle Channel (no DCU signal)

```
Signal 48: "toggle-channel-3-on-off"
(No dcu-channel-3 signal)
```

**Result:** HMI shows on/off toggle button

### Special Function

```
Signal 53: "special-function-11"
```

**Result:** HMI shows momentary button (press and hold)

## Documentation Created

### 1. Complete Technical Reference

**`/docs/EMPIRBUS_SIGNAL_NAMING_CONVENTION.md`** (350+ lines)

- Signal name patterns explained
- Control type detection logic
- Complete examples for all 23 channels
- Mapping flow diagrams
- Usage in HMI development

### 2. Quick Reference

**`/SIGNAL_CONTROL_TYPE_MAPPING.md`** (150+ lines)

- One-page quick lookup
- Clear examples
- Bottom-line explanations
- Reference to complete docs

### 3. Updated Extraction Script

**`scripts/extract-empirbus-channels.py`**

- Added header comments explaining signal naming
- Enhanced inline documentation for control type detection
- References new documentation

### 4. Updated Channel Mapping Guide

**`/docs/EMPIRBUS_CHANNEL_MAPPING.md`**

- Added "How Control Types Are Determined" section
- Links to signal naming convention docs
- Clear explanation in overview

## Why This Documentation Is Critical

### For Development

```typescript
// Hardware config tells you the control type
const output = schema.hardware.outputs.find(o => o.id === 'core-01');
console.log(output.control); // "dimmer"

// Now you know to use a dimmer component!
<Dimmer label="Cabin Lights" channel="core-01" />
```

### For Configuration

- Extraction script automatically detects control types by checking signal names
- No manual configuration needed
- Signal names are source of truth

### For Understanding

- Explains WHY certain channels are dimmers vs toggles
- Not arbitrary - it's based on EmpirBus signal definitions
- DCU signal = dimming hardware capability

## Your Current System

Based on signal analysis:

### 16 Dimmer Channels

All have `dcu-channel-X` signal → support intensity control

- Channels: 1, 2, 5, 9, 10, 13, 17, 18, 19, 20, 21, 25, 26, 27, 28, 29
- Use with: Dimmer components, Slider components
- WebSocket: `messagetype: 17, messagecmd: 3, value: 0-100`

### 5 Toggle Channels

Have `toggle-channel-X` but NO `dcu-` signal → on/off only

- Channels: 3, 4, 6, 7, 8
- Use with: Toggle components, Switch components
- WebSocket: `messagetype: 17, messagecmd: 1, value: 0 or 1`

### 2 Special Function Channels

Have `special-function-X` signal → custom behavior

- Channels: 11, 12
- Use with: Button components (momentary action)
- WebSocket: `messagetype: 17, messagecmd: 1` (while pressed)

## Unit 2 (MFD / WDU) Role

```xml
<unit id="2" serial="0" name="MFD / WDU" unitTypeId="200">
```

**This unit is the HMI control interface:**

- Contains all user-facing control channels
- Signal definitions determine available controls
- Buttons, sliders, indicators, gauges all bind to these channels
- Signal naming convention tells you what controls to show

## Integration Example

### Step 1: Check Hardware Config

```json
{
  "id": "core-01",
  "channel": 1,
  "control": "dimmer", // ← Determined by dcu-channel-1 signal
  "signals": {
    "toggle": 15, // toggle-channel-1-on-off
    "momentary": 14, // mom-channel-1-on-off
    "dimmer": 16 // dcu-channel-1 ← This is why it's a dimmer!
  }
}
```

### Step 2: Create Component

```json
{
  "type": "dimmer", // Match the control type
  "label": "Cabin Overhead Lights",
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-01" // References hardware output
    }
  }
}
```

### Step 3: Component Renders

```typescript
// Component checks control type and renders appropriate UI
if (output.control === 'dimmer') {
  return <DimmerSlider min={0} max={100} />;
} else if (output.control === 'toggle-button') {
  return <ToggleSwitch />;
}
```

## Related Documentation

All documentation cross-references this critical concept:

1. **`/docs/EMPIRBUS_SIGNAL_NAMING_CONVENTION.md`** - Complete reference
2. **`/SIGNAL_CONTROL_TYPE_MAPPING.md`** - Quick lookup
3. **`/docs/EMPIRBUS_CHANNEL_MAPPING.md`** - Channel reference
4. **`/CHANNEL_MAPPING_QUICKSTART.md`** - Quick start guide
5. **`/packages/hmi-ui/COMPONENT_BINDING_GUIDE.md`** - Component architecture
6. **`/configuration/hardware-config.json`** - Generated config (ready to use)
7. **`/configuration/channel-mapping.json`** - Technical reference

## Summary

✅ **Signal naming convention fully documented**  
✅ **Control type detection logic explained**  
✅ **Examples for all 23 channels**  
✅ **Extraction script updated with comments**  
✅ **Integration examples provided**  
✅ **Cross-references added to all docs**

**The key takeaway:** DCU signals indicate dimming capability, which determines that the HMI should present a dimmer/slider control instead of a simple on/off toggle. This is hardware-driven - if the EmpirBus controller supports dimming (has DCU signal), the HMI should offer intensity control. 🎯

---

**Next Steps:**

1. Copy hardware-config.json to schema.json
2. Update channel labels with actual device names
3. Create UI components matching control types
4. Deploy and test on Garmin device
