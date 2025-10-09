# EmpirBus Channel Mapping Summary

**Generated:** October 3, 2025  
**Source:** core-v2_9-30-25_v1.ebp  
**Device:** Connect 50 v2 (Serial: 931207)

## Overview

Your EmpirBus system has been mapped and categorized into **23 output channels**:

- **16 Dimmer channels** - Variable intensity control (0-100%)
- **5 Toggle channels** - Simple on/off switches
- **2 Special function channels** - Requires custom configuration

### How Control Types Are Determined

The **signal names** in Unit 2 (MFD/WDU) determine the control type:

- **`dcu-channel-X`** signal present → **Dimmer** (intensity control)
- **`toggle-channel-X`** or **`mom-channel-X`** only → **Toggle button** (on/off)
- **`special-function-X`** → **Special function** (custom behavior)

📖 **See `/docs/EMPIRBUS_SIGNAL_NAMING_CONVENTION.md` for complete details**

## Channel Summary by Type

### Dimmer Channels (16 total)

These channels support variable intensity control and can be used with dimmer components:

| Channel | ID      | Label     | Signal IDs                      |
| ------- | ------- | --------- | ------------------------------- |
| 1       | core-01 | Output 1  | Toggle: 15, Mom: 14, DCU: 16    |
| 2       | core-02 | Output 2  | Toggle: 72, Mom: 71, DCU: 73    |
| 5       | core-05 | Output 5  | Toggle: 75, Mom: 74, DCU: 76    |
| 9       | core-09 | Output 9  | Toggle: 78, Mom: 77, DCU: 79    |
| 10      | core-10 | Output 10 | Toggle: 81, Mom: 80, DCU: 82    |
| 13      | core-13 | Output 13 | Toggle: 84, Mom: 83, DCU: 85    |
| 17      | core-17 | Output 17 | Toggle: 87, Mom: 86, DCU: 88    |
| 18      | core-18 | Output 18 | Toggle: 90, Mom: 89, DCU: 91    |
| 19      | core-19 | Output 19 | Toggle: 93, Mom: 92, DCU: 94    |
| 20      | core-20 | Output 20 | Toggle: 96, Mom: 95, DCU: 97    |
| 21      | core-21 | Output 21 | Toggle: 99, Mom: 98, DCU: 100   |
| 25      | core-25 | Output 25 | Toggle: 102, Mom: 101, DCU: 103 |
| 26      | core-26 | Output 26 | Toggle: 105, Mom: 104, DCU: 106 |
| 27      | core-27 | Output 27 | Toggle: 108, Mom: 107, DCU: 109 |
| 28      | core-28 | Output 28 | Toggle: 111, Mom: 110, DCU: 112 |
| 29      | core-29 | Output 29 | Toggle: 114, Mom: 113, DCU: 115 |

### Toggle/Button Channels (5 total)

These channels support simple on/off control:

| Channel | ID      | Label    | Notes           |
| ------- | ------- | -------- | --------------- |
| 3       | core-03 | Output 3 | Standard toggle |
| 4       | core-04 | Output 4 | Standard toggle |
| 6       | core-06 | Output 6 | Standard toggle |
| 7       | core-07 | Output 7 | Standard toggle |
| 8       | core-08 | Output 8 | Standard toggle |

### Special Function Channels (2 total)

These channels have special configuration (settingId: 53):

| Channel | ID      | Label     | Notes                          |
| ------- | ------- | --------- | ------------------------------ |
| 11      | core-11 | Output 11 | Requires special configuration |
| 12      | core-12 | Output 12 | Requires special configuration |

## Generated Configuration Files

### 1. hardware-config.json

Complete hardware configuration ready to paste into your schema.json:

```json
{
  "hardware": {
    "systemType": "core",
    "outputs": [
      // ... copy from configuration/hardware-config.json
    ]
  }
}
```

### 2. component-examples.json

Example UI component definitions for the first 5 channels. Use these as templates:

```json
{
  "id": "comp-core-01",
  "type": "dimmer",
  "label": "Cabin Lights",
  "min": 0,
  "max": 100,
  "step": 5,
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-01"
    }
  }
}
```

### 3. channel-mapping.json

Full technical details including signal IDs and original EmpirBus names.

## How to Use This Mapping

### Step 1: Update Hardware Configuration

Open `packages/hmi-ui/public/schema.json` and replace the hardware section:

```json
{
  "hardware": {
    "systemType": "core",
    "outputs": [
      {
        "id": "core-01",
        "source": "core",
        "channel": 1,
        "control": "dimmer",
        "label": "Cabin Lights", // ← Update this label
        "icon": "/icons/Dimmer.svg"
      }
      // ... add more outputs
    ]
  }
}
```

**Important:** Update the `label` field for each output to match your actual installation (e.g., "Cabin Lights", "Nav Lights", "Water Pump", etc.)

### Step 2: Create UI Components

Add components in the `tabs` section that reference your hardware outputs:

```json
{
  "tabs": [
    {
      "id": "tab-lighting",
      "title": "Lighting",
      "sections": [
        {
          "id": "section-cabin",
          "title": "Cabin Lights",
          "components": [
            {
              "id": "comp-cabin-overhead",
              "type": "dimmer",
              "label": "Overhead Lights",
              "min": 0,
              "max": 100,
              "step": 5,
              "bindings": {
                "intensity": {
                  "type": "empirbus",
                  "channel": "core-01" // References hardware output
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

### Step 3: Test on Device

1. Run the deployment script:

   ```bash
   cd packages/hmi-ui
   pnpm deploy:web
   ```

2. Upload `garmin-hmi-deployment-TIMESTAMP.zip` to your Garmin device

3. Test each component to verify it controls the correct output

## Component Type Reference

### For Dimmer Channels

Use the **dimmer** component type:

```json
{
  "type": "dimmer",
  "label": "Cabin Lights",
  "min": 0,
  "max": 100,
  "step": 5,
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-01"
    }
  }
}
```

### For Toggle Channels

Use the **toggle** component type:

```json
{
  "type": "toggle",
  "label": "Water Pump",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-03"
    }
  }
}
```

### For Momentary Actions

Use the **button** component type:

```json
{
  "type": "button",
  "label": "Horn",
  "action": "momentary",
  "bindings": {
    "action": {
      "type": "empirbus",
      "channel": "core-03"
    }
  }
}
```

### For Status Display

Use the **indicator** component type:

```json
{
  "type": "indicator",
  "label": "Generator Running",
  "color": "green",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-05"
    }
  }
}
```

## Common Use Cases

### Lighting Control

- **Dimmer channels (core-01, core-02, etc.)** - Cabin lights, salon lights, galley lights
- **Toggle channels (core-03-08)** - Nav lights, anchor light, exterior lights

### Pumps and Fans

- **Toggle channels** - Water pump, bilge pump, ventilation fans

### Special Functions

- **Momentary actions** - Horn, door locks, window controls

## Naming Recommendations

Update the `label` field in hardware-config.json to reflect your actual installation:

**Lighting:**

- "Cabin Overhead"
- "Salon Lights"
- "Galley Lights"
- "Nav Lights"
- "Anchor Light"
- "Deck Lights"

**Pumps:**

- "Fresh Water Pump"
- "Bilge Pump"
- "Wash Down Pump"

**Fans:**

- "Cabin Fan"
- "Engine Room Fan"
- "Max Air Fan"

**Other:**

- "Horn"
- "Windlass"
- "Searchlight"

## WebSocket Message Format

When a user interacts with a component, the HMI UI sends these messages:

### Toggle/Button (ON/OFF)

```javascript
{
  messagetype: 17,
  messagecmd: 1,
  size: 3,
  data: [
    channelId & 0xff,        // Low byte: e.g., 1
    (channelId >> 8) & 0xff, // High byte: e.g., 0
    state ? 1 : 0            // 1 = ON, 0 = OFF
  ]
}
```

Example: Turn on Channel 1

```javascript
{ messagetype: 17, messagecmd: 1, size: 3, data: [1, 0, 1] }
```

### Dimmer (0-100%)

```javascript
{
  messagetype: 17,
  messagecmd: 3,
  size: 3,
  data: [
    channelId & 0xff,        // Low byte
    (channelId >> 8) & 0xff, // High byte
    intensity                // 0-100
  ]
}
```

Example: Set Channel 1 to 75%

```javascript
{ messagetype: 17, messagecmd: 3, size: 3, data: [1, 0, 75] }
```

## Troubleshooting

### Component doesn't control the output

1. Verify the channel number matches your physical wiring
2. Check that the component binding references the correct hardware ID
3. Use browser DevTools to monitor WebSocket messages
4. Confirm the channel type (dimmer vs toggle) matches the component type

### Wrong channel activates

- The channel number in hardware-config.json must match your EmpirBus project
- Use the channel-mapping.json file to verify signal IDs

### Dimmer doesn't work

- Verify the channel has DCU signal support (check channel-mapping.json)
- Ensure you're using messagetype 17, messagecmd 3 for dimmer control

## Next Steps

1. ✅ Channel mapping complete - Review hardware-config.json
2. ⏸️ Update channel labels - Edit hardware-config.json with real names
3. ⏸️ Copy to schema - Replace hardware section in packages/hmi-ui/public/schema.json
4. ⏸️ Create components - Add UI components in tabs section
5. ⏸️ Deploy and test - Run `pnpm deploy:web` and test on device

## Reference Files

- **Hardware Config:** `configuration/hardware-config.json`
- **Component Examples:** `configuration/component-examples.json`
- **Full Mapping:** `configuration/channel-mapping.json`
- **Binding Guide:** `packages/hmi-ui/COMPONENT_BINDING_GUIDE.md`
- **Extraction Script:** `scripts/extract-empirbus-channels.py`

---

**Generated by:** extract-empirbus-channels.py  
**Last Updated:** October 3, 2025
