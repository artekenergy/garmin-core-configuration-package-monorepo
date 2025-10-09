# Auto-Generated Tab Content System

## Overview

The HMI configurator now intelligently generates tab content based on your system configuration. When you enable subsystems like HVAC, lighting, or plumbing, the corresponding tabs automatically populate with relevant sections and components.

## How It Works

### 1. Configuration-Driven Content

When you configure subsystems (Power, HVAC, Lighting, etc.), the system can automatically generate appropriate UI components:

- **Lighting Tab**: If you configure lighting modules, it creates dimmer controls for each zone
- **Power Tab**: Automatically adds battery gauges, charging indicators based on your power configuration
- **HVAC Tab**: Creates heating/cooling/ventilation controls based on what you've enabled
- **Switching Tab**: Generates toggle/button controls from your hardware outputs
- **Plumbing Tab**: Creates tank level gauges for each configured tank

### 2. Auto-Enable Tabs

Tabs are automatically enabled/disabled based on whether you've configured that subsystem:

- **Home**: Always enabled (for favorites)
- **Lighting**: Enabled if lighting modules are configured
- **Power**: Always enabled (essential monitoring)
- **HVAC**: Enabled if heating, cooling, or ventilation is configured
- **Switching**: Enabled if output channels are configured
- **Plumbing**: Enabled if plumbing is enabled in configuration

### 3. Regenerate Button

The Editor page now has a **"⚡ Regenerate Content"** button that:

1. Regenerates all tab sections/components based on current configuration
2. Auto-enables/disables tabs based on what's configured
3. **Warning**: Replaces any manually added components (prompts for confirmation)

## What Gets Generated

### Home Tab

- **Favorites Section**: Empty by default, for user customization

### Lighting Tab

Based on `schema.lighting`:

```typescript
{
  enabled: true,
  modules: 2,        // Number of dimmer modules
  zonesPerModule: 4  // Zones per module (2 or 4)
}
```

Generates:

- **Light Zones Section**: Dimmer for each zone (modules × zonesPerModule)
  - Example: 2 modules × 4 zones = 8 dimmer controls
  - Each labeled "Zone 1", "Zone 2", etc.
  - Channel: `light-zone-{number}`

### Power Tab

Based on `schema.power`:

```typescript
{
  dcCharging: {
    secondAlternator: true,
    orionXs: true
  },
  acLegs: 2,
  multiplus: {
    l1: true,
    l2: false
  }
}
```

Generates:

- **Battery Section**: Always included
  - Battery Voltage (gauge, 0-16V)
  - State of Charge (circular gauge, 0-100%)
- **DC Charging Section**: If alternator or Orion XS enabled
  - Alternator gauge (if secondAlternator = true)
  - Orion XS gauge (if orionXs = true)

### HVAC Tab

Based on `schema.hvac`:

```typescript
{
  heating: {
    enabled: true,
    sources: {
      diesel: true,
      electric: false,
      engine: false
    },
    distribution: {
      floor: false,
      fans: true
    },
    hotWater: true,
    auxZone: false
  },
  cooling: {
    enabled: true,
    brand: 'truma'
  },
  ventilation: {
    enabled: true,
    fans: 2
  }
}
```

Generates:

- **Heating Section**: If heating.enabled
  - Interior Temperature gauge
  - Toggles for each enabled heat source (diesel, electric, engine)
  - Dimmer for fan speed (if distribution.fans)
  - Toggle for hot water (if hotWater)
- **Auxiliary Zone Section**: If auxZone enabled
  - Aux zone temperature gauge
  - Aux heat toggle
- **Cooling Section**: If cooling.enabled
  - Air conditioning toggle
- **Ventilation Section**: If ventilation.enabled
  - Dimmer for each vent fan (count from ventilation.fans)

### Switching Tab

Based on `schema.hardware.outputs` and `schema.accessories`:

```typescript
{
  outputs: [
    { id: 'out-1', control: 'toggle-button', label: 'Cabin Lights' },
    { id: 'out-2', control: 'push-button', label: 'Water Pump' },
  ],
  accessories: {
    awning: {
      enabled: true,
      light: true
    },
    slides: {
      enabled: true
    }
  }
}
```

Generates:

- **Switches Section**: From hardware outputs
  - Toggle for each 'toggle-button' output
  - Button for each 'push-button' output
  - Uses output label if provided
- **Accessories Section**: If accessories configured
  - Awning Extend/Retract buttons
  - Awning Light toggle (if awning.light)
  - Slides Extend/Retract buttons

### Plumbing Tab

Based on `schema.plumbing`:

```typescript
{
  enabled: true,
  monitoringSource: 'cerbo-gx',
  count: 3,
  tanks: [
    { type: 'fresh', name: 'Fresh Water' },
    { type: 'waste', name: 'Gray Water' },
    { type: 'black', name: 'Black Water' }
  ]
}
```

Generates:

- **Tank Levels Section**: Gauge for each tank
  - Linear progress bars (0-100%)
  - Uses tank name or defaults to type
  - Channel: `tank-{type}-{index}`
- **Water System Section**: Always included
  - Water pump toggle
  - Water pressure gauge (0-60 PSI)

## Channel Naming Conventions

The system uses consistent channel naming:

| Component        | Channel Pattern                   | Example                |
| ---------------- | --------------------------------- | ---------------------- |
| Light zones      | `light-zone-{N}`                  | `light-zone-1`         |
| Battery voltage  | `battery-voltage`                 | `battery-voltage`      |
| Battery SOC      | `battery-soc`                     | `battery-soc`          |
| Alternator       | `alternator-current`              | `alternator-current`   |
| Orion XS         | `orion-current`                   | `orion-current`        |
| Interior temp    | `interior-temperature`            | `interior-temperature` |
| Diesel heater    | `diesel-heater`                   | `diesel-heater`        |
| Heat fan         | `heat-fan`                        | `heat-fan`             |
| Air conditioner  | `air-conditioner`                 | `air-conditioner`      |
| Vent fans        | `vent-fan-{N}`                    | `vent-fan-1`           |
| Awning           | `awning-extend`, `awning-retract` | `awning-extend`        |
| Slides           | `slides-extend`, `slides-retract` | `slides-extend`        |
| Tank levels      | `tank-{type}-{N}`                 | `tank-fresh-1`         |
| Water pump       | `water-pump`                      | `water-pump`           |
| Water pressure   | `water-pressure`                  | `water-pressure`       |
| Hardware outputs | Uses output ID                    | `out-channel-1`        |

## Usage Workflow

### Step 1: Configure Your System

1. Go to **Hardware Config** - Define your output channels
2. Go to **Power Config** - Configure charging sources
3. Go to **HVAC Config** - Enable heating/cooling/ventilation
4. Go to **Lighting Config** - Set up dimmer modules
5. Go to **Plumbing Config** - Configure tanks
6. Go to **Accessories Config** - Enable awning/slides

### Step 2: Regenerate Content

1. Go to **Editor** page
2. Click **"⚡ Regenerate Content"** button
3. Confirm the regeneration (warning: replaces manual components)
4. Tabs auto-populate with appropriate controls!

### Step 3: Customize (Optional)

After regeneration, you can still:

- **Add manual components** using the Component Palette
- **Reorder sections** within tabs
- **Edit component labels** and properties
- **Disable tabs** you don't need

## Manual vs Auto-Generated

### Auto-Generated (Regenerate Button)

✅ Fast setup based on configuration  
✅ Consistent component types and naming  
✅ Automatically enables/disables tabs  
⚠️ Replaces all existing components

### Manual (Component Palette)

✅ Complete control over every component  
✅ Mix and match any components  
✅ Preserves existing components  
⚠️ More time-consuming for large systems

**Best Practice**: Use regenerate for initial setup, then manually fine-tune.

## Implementation Details

### Functions

Located in `packages/web-configurator/src/utils/tabGenerator.ts`:

#### `regenerateTabContent(schema: UISchema): UISchema`

Regenerates all tab sections and components based on system configuration. Preserves tab enabled state and order.

**Returns**: Updated schema with new tab content

#### `autoEnableTabs(schema: UISchema): UISchema`

Auto-enables or disables tabs based on whether subsystems are configured.

**Returns**: Updated schema with tabs enabled/disabled

### Component Types

All generated components use proper TypeScript types:

```typescript
// Toggle
{
  type: 'toggle',
  label: string,
  bindings: {
    state: { type: 'empirbus', channel: string }
  }
}

// Button (momentary)
{
  type: 'button',
  action: 'momentary',
  label: string,
  bindings: {
    action: { type: 'empirbus', channel: string }
  }
}

// Dimmer
{
  type: 'dimmer',
  label: string,
  min: 0,
  max: 100,
  step: 1,
  bindings: {
    intensity: { type: 'empirbus', channel: string }
  }
}

// Gauge
{
  type: 'gauge',
  label: string,
  variant: 'numeric' | 'linear' | 'circular',
  min: number,
  max: number,
  decimals: number,
  unit: string,
  bindings: {
    value: { type: 'empirbus', channel: string }
  }
}
```

## Future Enhancements

- **Template System**: Save/load custom tab templates
- **Smart Component Placement**: Group similar components automatically
- **Preview Before Regenerate**: Show what will be generated before confirming
- **Selective Regeneration**: Regenerate only specific tabs
- **Hardware Auto-Detection**: Auto-configure based on connected devices
- **Component Suggestions**: AI-powered layout recommendations

## Example Configurations

### Small RV Setup

```json
{
  "lighting": { "enabled": true, "modules": 1, "zonesPerModule": 4 },
  "power": { "dcCharging": { "secondAlternator": false, "orionXs": false } },
  "plumbing": {
    "enabled": true,
    "tanks": [
      { "type": "fresh", "name": "" },
      { "type": "waste", "name": "" }
    ]
  }
}
```

**Result**: 4 light zones, basic battery monitoring, 2 tanks

### Large Motorhome Setup

```json
{
  "lighting": { "enabled": true, "modules": 4, "zonesPerModule": 4 },
  "power": { "dcCharging": { "secondAlternator": true, "orionXs": true } },
  "hvac": {
    "heating": { "enabled": true, "sources": { "diesel": true }, "distribution": { "fans": true } },
    "cooling": { "enabled": true },
    "ventilation": { "enabled": true, "fans": 2 }
  },
  "plumbing": {
    "enabled": true,
    "tanks": [
      { "type": "fresh", "name": "Fresh" },
      { "type": "waste", "name": "Gray" },
      { "type": "black", "name": "Black" }
    ]
  },
  "accessories": { "awning": { "enabled": true, "light": true }, "slides": { "enabled": true } }
}
```

**Result**: 16 light zones, advanced power monitoring, full HVAC control, 3 tanks, accessories

## Related Documentation

- [Preset Tabs System](./PRESET_TABS_SYSTEM.md) - Tab structure and management
- [Hardware Config](./HARDWARE_CONFIG_QUICKSTART.md) - Setting up output channels
- [Schema Specification](./SCHEMA_SPEC.md) - Complete schema documentation
- [Component Setup](./GAUGE_AND_INDICATOR_SETUP.md) - Manual component creation
