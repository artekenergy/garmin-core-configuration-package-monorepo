# Genesis Board Management

## Date: October 7, 2025

## Overview

Added support for configurable Genesis boards in the Hardware Configuration page. Users can now add multiple Genesis boards (each with 4 output channels) based on their system type.

---

## Genesis Board Limits

### CORE System

- **Included Genesis Boards**: 0 (optional add-on)
- **Maximum Genesis Boards**: 4
- **Total Genesis Channels**: Up to 16 (4 boards × 4 channels each)
- **Channel Numbering**: GENESIS #1 through #16

### CORE LITE System

- **Included Genesis Boards**: 1 (always included)
- **Additional Genesis Boards**: Up to 3 more
- **Maximum Total Genesis Boards**: 4
- **Total Genesis Channels**: 4 to 16 (1-4 boards × 4 channels each)
- **Channel Numbering**: GENESIS #1 through #16

---

## How It Works

### Channel Allocation

Each Genesis board provides 4 output channels:

| Board Number | Channels                   |
| ------------ | -------------------------- |
| Board 1      | GENESIS #1, #2, #3, #4     |
| Board 2      | GENESIS #5, #6, #7, #8     |
| Board 3      | GENESIS #9, #10, #11, #12  |
| Board 4      | GENESIS #13, #14, #15, #16 |

### Configuration Options

Genesis channels support the same control types as other channels:

- **Push Button** (momentary control)
- **Toggle Button** (latching control)
- **Slider** (variable control)

All Genesis channels support icon selection.

---

## User Interface

### Genesis Board Selector

Located between the **System Type** section and **Output Channels** section:

```
┌─────────────────────────────────────────────────────────────┐
│ Genesis Boards                                              │
├─────────────────────────────────────────────────────────────┤
│ Each Genesis board provides 4 additional output channels.   │
│ CORE systems support up to 4 Genesis boards.                │
│                                                             │
│ Number of Genesis Boards:                                   │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                             │
│ │ 0 │ │ 1 │ │ 2 │ │ 3 │ │ 4 │                             │
│ └───┘ └───┘ └───┘ └───┘ └───┘                             │
│                                                             │
│ ℹ️ 2 boards = 8 Genesis channels (GENESIS #1 - #8)         │
└─────────────────────────────────────────────────────────────┘
```

### Features

- **Button Grid**: Click any number to set board count
  - CORE: 0-4 boards
  - CORE LITE: 1-4 boards (1 is minimum, always included)
- **Active State**: Selected button is highlighted
- **Info Display**: Shows total channel count and range when boards are added
- **Real-time Update**: Channel grid updates immediately when board count changes

---

## Usage Examples

### Example 1: Adding Genesis Boards to CORE

```
Initial State:
  System Type: CORE
  Genesis Boards: 0
  Total Channels: 20 CORE channels

User Action: Click "2" button

Result:
  Genesis Boards: 2
  Total Channels: 20 CORE + 8 Genesis = 28 channels
  Channel Grid Shows:
    - CORE #1 through #29
    - GENESIS #1 through #8
```

### Example 2: Adding Genesis Boards to CORE LITE

```
Initial State:
  System Type: CORE LITE
  Genesis Boards: 1 (included)
  Total Channels: 6 CORE-LITE + 4 Genesis = 10 channels

User Action: Click "3" button

Result:
  Genesis Boards: 3
  Total Channels: 6 CORE-LITE + 12 Genesis = 18 channels
  Channel Grid Shows:
    - CORE-LITE #1 through #6
    - GENESIS #1 through #12
```

### Example 3: Switching System Types

```
Initial State:
  System Type: CORE
  Genesis Boards: 4
  Total Channels: 20 CORE + 16 Genesis = 36 channels

User Action: Change system type to CORE LITE

Result:
  System Type: CORE LITE
  Genesis Boards: 4 (maintained, within CORE LITE's 1-4 range)
  Total Channels: 6 CORE-LITE + 16 Genesis = 22 channels
  Note: CORE channels replaced with CORE-LITE channels
```

---

## Configuration Preservation

### Adding Boards

When increasing the Genesis board count:

- ✅ Existing channel configurations are preserved
- ✅ New channels are added as "Not Used"
- ✅ Labels and icons retained

### Removing Boards

When decreasing the Genesis board count:

- ⚠️ Channels from removed boards are deleted
- ⚠️ Configurations (labels, icons, control types) are lost
- ✅ Channels from remaining boards are preserved

### System Type Changes

When switching between CORE and CORE LITE:

- ✅ Genesis board count adjusted to new maximum if necessary
- ✅ CORE and CORE-LITE channel configs preserved where possible
- ✅ Genesis channels within new limit are preserved
- ⚠️ Genesis channels exceeding new limit are removed

---

## Schema Structure

### Hardware Config with Genesis Boards

```typescript
{
  "hardware": {
    "systemType": "core",
    "genesisBoards": 2,
    "outputs": [
      // CORE channels
      {
        "id": "core-01",
        "source": "core",
        "channel": 1,
        "control": "toggle-button",
        "label": "Cabin Lights"
      },
      // Genesis channels
      {
        "id": "genesis-01",
        "source": "genesis",
        "channel": 1,
        "control": "push-button",
        "label": "Horn"
      },
      {
        "id": "genesis-05",
        "source": "genesis",
        "channel": 5,
        "control": "slider",
        "label": "Fan Speed"
      }
    ]
  }
}
```

### Channel ID Format

- **CORE**: `core-01`, `core-02`, etc.
- **CORE-LITE**: `core-lite-01`, `core-lite-02`, etc.
- **Genesis**: `genesis-01`, `genesis-02`, etc.

---

## Technical Implementation

### Files Modified

**1. Schema (`packages/schema/src/schema.ts`)**

```typescript
export const HardwareConfigSchema = z.object({
  systemType: HardwareSystemTypeSchema.default('core'),
  outputs: z.array(OutputChannelSchema),
  halfBridgePairs: z.array(HalfBridgePairSchema).optional(),
  signalMap: z.record(z.string(), SignalMapEntrySchema).optional(),
  genesisBoards: z.number().int().min(0).max(4).default(0),
});
```

**2. Hardware Constants (`packages/web-configurator/src/constants/hardware.ts`)**

```typescript
export function generateGenesisChannels(
  boardCount: number
): Pick<OutputChannel, 'source' | 'channel'>[] {
  const channels: Pick<OutputChannel, 'source' | 'channel'>[] = [];
  for (let board = 1; board <= boardCount; board++) {
    for (let channel = 1; channel <= 4; channel++) {
      channels.push({
        source: 'genesis',
        channel: (board - 1) * 4 + channel,
      });
    }
  }
  return channels;
}
```

**3. Hardware Config Page (`packages/web-configurator/src/pages/HardwareConfigPage.tsx`)**

- Added `handleGenesisBoardsChange()` function
- Updated `channelDefinitions` to include Genesis channels
- Added Genesis board selector UI
- Updated system type change logic to handle board limits

**4. Schema Context (`packages/web-configurator/src/context/SchemaContext.tsx`)**

- Updated default schema to include `genesisBoards: 0`

---

## Channel Display

Genesis channels appear in the channel grid alongside CORE/CORE-LITE channels:

```
┌──────────────────────────────────────────┐
│ GENESIS #1                               │
│ ┌────────────────────────────────────┐   │
│ │ Push Button                    ▼  │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Label: [Horn_____________________]       │
│                                          │
│ Icon:  [🔊 speaker.svg]  [✕]            │
└──────────────────────────────────────────┘
```

---

## Best Practices

### ✅ DO

- Add Genesis boards before configuring channels
- Document which boards control which devices
- Use clear labels for Genesis channels
- Test configurations before deploying

### ❌ DON'T

- Remove boards with configured channels without backing up
- Exceed the system's Genesis board limit
- Forget to configure newly added boards
- Switch system types without noting Genesis limits

---

## Common Use Cases

### Use Case 1: Expanding CORE System

**Scenario**: Need more outputs for additional lighting zones

- Add Genesis boards (up to 4)
- Each board adds 4 channels
- Configure channels as needed

### Use Case 2: CORE LITE with Accessories

**Scenario**: Basic system needing extra controls

- CORE LITE provides 6 base channels
- Add Genesis boards for accessories (up to 3)
- Total: 6 + (3×4) = 18 channels

### Use Case 3: Modular Configuration

**Scenario**: Phased installation

- Start with 0 Genesis boards
- Add boards as features are installed
- Configurations preserved when adding boards

---

## Migration Notes

### Existing Configurations

Configurations created before Genesis board management will:

- Default to `genesisBoards: 0`
- Preserve any existing Genesis channel outputs
- May show Genesis channels even with board count 0 (legacy data)

### Recommended Actions

1. Open Hardware Configuration page
2. Set correct Genesis board count based on existing outputs
3. Verify all Genesis channels appear
4. Save configuration

---

## Troubleshooting

### Problem: Genesis Channels Don't Appear

**Solution**: Check Genesis board count is greater than 0

### Problem: Can't Add More Boards

**Solution**: Check if you've reached the system limit (4 for CORE, 3 for CORE LITE)

### Problem: Channels Disappeared After System Change

**Solution**: Genesis board count may have been reduced. Check if board count exceeds new system limit.

### Problem: Board Count Reset

**Solution**: May have switched system types. Verify system type and re-add boards if needed.

---

## Related Documentation

- [HARDWARE_CONFIG_QUICKSTART.md](./HARDWARE_CONFIG_QUICKSTART.md) - Hardware configuration overview
- [HARDWARE_CONFIG_IMPLEMENTATION.md](./HARDWARE_CONFIG_IMPLEMENTATION.md) - Implementation details
- [PAIRABLE_CHANNELS_QUICK_REFERENCE.md](./PAIRABLE_CHANNELS_QUICK_REFERENCE.md) - Channel pairing reference

---

**Status**: ✅ Complete  
**Build**: ✅ Passing  
**Last Updated**: October 7, 2025
