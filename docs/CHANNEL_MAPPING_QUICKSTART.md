# Quick Start: Mapping Your Channels

## What Was Generated

I've extracted your EmpirBus Connect 50 v2 configuration and created three files:

### 1. `/configuration/hardware-config.json`

Complete hardware configuration with all 23 channels mapped and categorized.

### 2. `/configuration/component-examples.json`

Example UI components for the first 5 channels showing how to create bindings.

### 3. `/configuration/channel-mapping.json`

Full technical details including signal IDs and original names.

## Your Channel Summary

**Total: 23 output channels**

- **16 Dimmer Channels** → Channels 1, 2, 5, 9, 10, 13, 17-21, 25-29
- **5 Toggle Channels** → Channels 3, 4, 6, 7, 8
- **2 Special Function** → Channels 11, 12

## Next Steps (5 minutes)

### Step 1: Update Channel Labels

Edit `/configuration/hardware-config.json` and change generic labels to your actual devices:

```json
{
  "id": "core-01",
  "channel": 1,
  "control": "dimmer",
  "label": "Cabin Overhead", // ← Change from "Output 1"
  "icon": "/icons/Dimmer.svg"
}
```

### Step 2: Copy to Schema

Copy the `outputs` array to `/packages/hmi-ui/public/schema.json`:

```json
{
  "hardware": {
    "systemType": "core",
    "outputs": [
      // Paste from hardware-config.json here
    ]
  }
}
```

### Step 3: Create Components

Add UI components in the `tabs` section:

```json
{
  "tabs": [
    {
      "id": "tab-lighting",
      "title": "Lighting",
      "sections": [
        {
          "id": "section-cabin",
          "title": "Cabin",
          "components": [
            {
              "id": "comp-cabin-lights",
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

### Step 4: Deploy and Test

```bash
cd packages/hmi-ui
pnpm deploy:web
```

Upload the generated `.zip` file to your Garmin device and test!

## Component Type Cheat Sheet

| Channel Type | Component Type                          | Binding Property |
| ------------ | --------------------------------------- | ---------------- |
| Dimmer       | `"dimmer"`                              | `intensity`      |
| Toggle       | `"toggle"`                              | `state`          |
| Momentary    | `"button"` with `"action": "momentary"` | `action`         |
| Read-only    | `"indicator"`                           | `state`          |

## Example: Complete Lighting Tab

```json
{
  "id": "tab-lighting",
  "title": "Lighting",
  "sections": [
    {
      "id": "section-interior",
      "title": "Interior",
      "components": [
        {
          "id": "comp-cabin",
          "type": "dimmer",
          "label": "Cabin Lights",
          "bindings": { "intensity": { "type": "empirbus", "channel": "core-01" } }
        },
        {
          "id": "comp-galley",
          "type": "dimmer",
          "label": "Galley Lights",
          "bindings": { "intensity": { "type": "empirbus", "channel": "core-02" } }
        }
      ]
    },
    {
      "id": "section-exterior",
      "title": "Exterior",
      "components": [
        {
          "id": "comp-nav",
          "type": "toggle",
          "label": "Nav Lights",
          "bindings": { "state": { "type": "empirbus", "channel": "core-03" } }
        },
        {
          "id": "comp-anchor",
          "type": "toggle",
          "label": "Anchor Light",
          "bindings": { "state": { "type": "empirbus", "channel": "core-04" } }
        }
      ]
    }
  ]
}
```

## Testing Tips

1. **Verify WebSocket connection** - Look for green indicator in UI
2. **Check browser console** - Watch for WebSocket messages
3. **Test one channel at a time** - Confirm each binding works
4. **Monitor channel numbers** - Ensure correct output activates

## Documentation

- **Full Guide:** `/packages/hmi-ui/COMPONENT_BINDING_GUIDE.md`
- **Mapping Details:** `/docs/EMPIRBUS_CHANNEL_MAPPING.md`
- **Generated Files:** `/configuration/*.json`

## Need Help?

Common issues:

- **Wrong channel activates** → Check channel number in hardware config
- **Component doesn't work** → Verify binding references correct ID
- **Dimmer acts like toggle** → Confirm channel supports DCU (dimmer) control

---

**Generated:** October 3, 2025  
**Device:** Connect 50 v2 (Serial: 931207)
