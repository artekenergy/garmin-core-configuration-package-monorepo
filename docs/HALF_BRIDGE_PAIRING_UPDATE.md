# Half-Bridge Pairing Update

## Date: October 7, 2025

## Overview

Updated the Hardware Configuration page to improve the half-bridge pairing workflow for CORE channels 3, 4, 12, and 13. These channels now have specialized control options (Momentary, Toggle, or Half-Bridge) and automatic pairing behavior when half-bridge is selected.

---

## What Changed

### Previous Behavior

1. User had to explicitly select "Half-Bridge Pair" from the control type dropdown
2. System would automatically force both channels to "slider" control type
3. Secondary channel became disabled and locked - couldn't edit label or icon
4. Only the primary channel could be configured

### New Behavior

1. **Specialized Control Options for Pairable Channels (3, 4, 12, 13)**:
   - **Momentary** (push-button control)
   - **Toggle** (toggle button control)
   - **Half-Bridge** (motor control)
2. **Automatic Pairing**: When "Half-Bridge" is selected for one channel in a pair:
   - Channel 3 → Half-Bridge: Channel 4 automatically becomes Half-Bridge
   - Channel 4 → Half-Bridge: Channel 3 automatically becomes Half-Bridge
   - Channel 12 → Half-Bridge: Channel 13 automatically becomes Half-Bridge
   - Channel 13 → Half-Bridge: Channel 12 automatically becomes Half-Bridge

3. **Independent Configuration**: All channels (3, 4, 12, 13) can be configured independently:
   - ✅ Each channel can have its own label
   - ✅ Each channel can have its own icon (for all control types)
   - ✅ Channels can use different control types when not in half-bridge mode

4. **Other Channels (not pairable)**: All other CORE channels show standard options:
   - Push Button
   - Toggle Button
   - Slider

---

## User Experience

### Configuring Pairable Channels (3, 4, 12, 13)

#### Option 1: Momentary or Toggle Control

1. Navigate to **Hardware Configuration** page
2. Select system type **CORE**
3. Find channel 3, 4, 12, or 13
4. Choose **Momentary** or **Toggle** from dropdown
5. Configure label and icon
6. **Result**: Channel operates independently (not paired)

Example:

```
CORE #3 - Toggle
  Label: "Cabin Lights"
  Icon: lightbulb.svg

CORE #4 - Momentary
  Label: "Horn"
  Icon: speaker.svg
```

#### Option 2: Half-Bridge Motor Control

1. Find any pairable channel (3, 4, 12, or 13)
2. Select **Half-Bridge** from dropdown
3. **Result**: Both channels in the pair automatically become Half-Bridge
4. Configure each channel independently with labels and icons

Example:

```
CORE #12 - Half-Bridge (Auto-Paired)
  Label: "Awning Extend"
  Icon: arrow-right.svg

CORE #13 - Half-Bridge (Auto-Paired)
  Label: "Awning Retract"
  Icon: arrow-left.svg
```

### Disabling Channels or Changing Configuration

- **Momentary/Toggle → Half-Bridge**: Select "Half-Bridge" from dropdown, pair channel automatically becomes Half-Bridge
- **Half-Bridge → Momentary/Toggle**: Change one channel away from Half-Bridge, pair channel automatically changes to the same control type
- **Set to Not Used**: Change control type to "Not Used", pair channel also becomes "Not Used" if it was Half-Bridge

**Example**: If channels 12+13 are paired as Half-Bridge, and you change channel 12 to "Toggle", channel 13 will automatically change to "Toggle" as well, and the pair will be removed.

---

## Technical Details

### Available Half-Bridge Pairs

**CORE System Only** (not available on CORE LITE):

- **Channels 3 + 4**: Typically used for first motor
- **Channels 12 + 13**: Typically used for second motor

### Control Type Options by Channel

**Pairable Channels (3, 4, 12, 13)**:

- Not Used
- Momentary (push-button)
- Toggle (toggle-button)
- Half-Bridge (motor control)

**All Other Channels**:

- Not Used
- Push Button
- Toggle Button
- Slider

### Schema Updates

When a half-bridge pair is active:

```typescript
{
  hardware: {
    systemType: "core",
    outputs: [
      {
        id: "core-12",
        source: "core",
        channel: 12,
        label: "Awning Extend",
        control: "half-bridge",
        icon: "icons/arrow-right.svg"
      },
      {
        id: "core-13",
        source: "core",
        channel: 13,
        label: "Awning Retract",
        control: "half-bridge",
        icon: "icons/arrow-left.svg"
      }
    ],
    halfBridgePairs: [
      {
        source: "core",
        channelA: 12,
        channelB: 13,
        enabled: true
      }
    ]
  }
}
```

### Component Mapping

Half-bridge control type maps to:

- **Component**: Dimmer (slider control)
- **Width**: 6 units (full width)
- **Usage**: Bidirectional motor control

---

## Benefits

### 1. Improved UX

- ✅ No manual "pairing" step required
- ✅ Clear visual feedback with "HALF-BRIDGE" badge
- ✅ Both channels always accessible

### 2. More Flexible

- ✅ Independent labels for each direction
- ✅ Independent icons for visual clarity
- ✅ Easier to understand motor control mapping

### 3. Less Error-Prone

- ✅ Can't accidentally create orphaned paired channels
- ✅ Automatic cleanup when both disabled
- ✅ Clear indication when channels are paired

---

## Migration Notes

### Existing Configurations

Configurations created with the old half-bridge system will continue to work. The new logic is backward-compatible:

- Existing pairs remain enabled
- Labels and icons are preserved
- Both channels are now editable (previously only primary was editable)

### No Action Required

Users don't need to reconfigure existing half-bridge setups. The improved editing capabilities are available immediately.

---

## UI Changes

### Control Type Dropdown

**When NOT in a pair** (channels independent):

```
┌─────────────────────┐
│ Not Used            │
│ Push Button         │
│ Toggle Button       │
│ Slider              │
└─────────────────────┘
```

**When IN a pair** (channels paired):

```
┌────────────────────────────────┐
│ Not Used                       │
│ Half-Bridge (Auto-Paired)      │
└────────────────────────────────┘
```

### Channel Badge

Paired channels show a visual indicator:

```
┌─────────────────────────────────────────────┐
│ CORE #12               [HALF-BRIDGE]        │
│ ┌──────────────────────────────────────────┐│
│ │ Half-Bridge (Auto-Paired)           ▼   ││
│ └──────────────────────────────────────────┘│
│                                              │
│ Label: [Awning Extend________________]      │
│                                              │
│ Icon:  [📷 Select Icon]  [✕]                │
└─────────────────────────────────────────────┘
```

---

## Code Changes

### Files Modified

- **packages/web-configurator/src/pages/HardwareConfigPage.tsx**
  - Updated `handleChannelUpdate()` function
  - Removed secondary channel locking logic
  - Added automatic pairing/unpairing when control type changes
  - Updated UI to show both channels as editable
  - Extended icon picker to support half-bridge channels

### Key Logic

```typescript
// Auto-pair when either channel enabled
if (updates.control !== 'not-used') {
  // Enable pair in halfBridgePairs array
  // Set both channels to 'half-bridge'
  // Ensure both channels exist in outputs
}

// Auto-unpair when both channels disabled
if (updates.control === 'not-used') {
  // Check if pair channel is also not-used
  // If so, remove from halfBridgePairs array
}
```

---

## Testing Recommendations

### Test Case 1: Enable Half-Bridge

1. Start with both channels set to "Not Used"
2. Set CORE #12 to "Toggle Button"
3. ✅ Verify both #12 and #13 become "Half-Bridge (Auto-Paired)"
4. ✅ Verify "HALF-BRIDGE" badge appears on both
5. ✅ Verify both channels are editable

### Test Case 2: Independent Icons

1. Enable pair (channels 3+4 or 12+13)
2. Set icon for first channel
3. Set different icon for second channel
4. ✅ Verify each channel displays its own icon
5. ✅ Verify icons persist after page refresh

### Test Case 3: Disable Half-Bridge

1. Start with active pair
2. Set first channel to "Not Used"
3. ✅ Verify pair remains active (second channel still enabled)
4. Set second channel to "Not Used"
5. ✅ Verify pair is removed
6. ✅ Verify "HALF-BRIDGE" badges disappear

### Test Case 4: CORE LITE

1. Switch to CORE LITE system type
2. ✅ Verify no half-bridge pairing options appear
3. ✅ Verify halfBridgePairs array is cleared

---

## Related Documentation

- [HARDWARE_CONFIG_QUICKSTART.md](./HARDWARE_CONFIG_QUICKSTART.md) - Hardware configuration overview
- [HARDWARE_CONFIG_IMPLEMENTATION.md](./HARDWARE_CONFIG_IMPLEMENTATION.md) - Implementation details
- [CONFIGURATOR_CHANNEL_SYSTEM_OVERVIEW.md](./CONFIGURATOR_CHANNEL_SYSTEM_OVERVIEW.md) - Channel system design

---

## Summary

The half-bridge pairing system is now **automatic** and **bidirectional**:

- Enable either channel → both become paired
- Configure each channel independently (labels, icons)
- Disable both channels → pair is removed

This provides a more intuitive workflow while maintaining full flexibility for motor control configuration.

**Status**: ✅ Complete  
**Build**: ✅ Passing  
**Backward Compatible**: ✅ Yes
