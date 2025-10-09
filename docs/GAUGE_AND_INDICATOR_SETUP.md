# Gauge and Indicator Component Setup Guide

## Overview

Gauge and Indicator components display **read-only sensor data** from the EmpirBus system:

- **Gauge**: Numeric sensors (temperature, voltage, pressure, etc.)
- **Indicator**: Status lights (warnings, alarms, system states)

These components are **different from Toggle/Button/Dimmer** which control outputs. Gauges and Indicators monitor inputs/sensors.

## Current Implementation Status

### ✅ HMI UI Components (Runtime)

The actual HMI UI running on the Garmin device has full support:

**Gauge Component** (`packages/hmi-ui/src/components/Gauge.tsx`)

- Subscribes to Type 16, Cmd 5 (numeric signals)
- Three variants: `numeric`, `linear`, `circular`
- Configurable: min, max, decimals, unit
- Reactive signal state updates
- Styled in `components.css`

**Indicator Component** (`packages/hmi-ui/src/components/Indicator.tsx`)

- Subscribes to Type 16, Cmd 1 (toggle/boolean signals)
- Three variants: `led`, `badge`, `icon`
- States: on/off/warning/error
- Reactive signal state updates
- Styled in `components.css`

Both registered in `ComponentRenderer.tsx` and will work when deployed.

### ⚠️ Web-Configurator (Design Tool)

The web-configurator currently **only handles output channels** (controls). To add gauges and indicators, you need to:

## How to Add Gauges/Indicators

### Method 1: Manual Schema Editing (Current Approach)

Since the web-configurator doesn't have an inputs/sensors UI yet, manually add components to your schema JSON:

#### Example: Adding a Temperature Gauge

````json
{
  "tabs": [
    {
      "id": "monitoring",
      "label": "Monitoring",
      "sections": [
        {
          "id": "temps",
          "label": "Temperatures",
          "columns": 6,
          "components": [
            {
              "id": "gauge-int-temp",
              "type": "gauge",
              "label": "Interior Temp",
              "variant": "numeric",
              "min": -40,
              "max": 125,
              "decimals": 1,
              "unit": "°F",
              "bindings": {
                "value": {
                  "type": "empirbus",
                  "channel": 2
                }
              },
              "width": 3
            }
          ]
        }
      ]
    }
  ]
}
 ```text

#### Example: Adding Status Indicators

```json
{
  "components": [
    {
      "id": "indicator-low-oil",
      "type": "indicator",
      "label": "Low Oil Pressure",
      "variant": "led",
      "color": "red",
      "bindings": {
        "state": {
          "type": "empirbus",
          "channel": 150
        }
      },
      "width": 2
    }
  ]
}

### Method 2: Future Enhancement - Add Inputs to Web-Configurator

To properly support gauges/indicators in the web-configurator, we'd need to:

1. **Extend the Schema** (`packages/schema/src/schema.ts`):

```typescript
export const HardwareConfigSchema = z.object({
  systemType: HardwareSystemTypeSchema.default('core'),
  outputs: z.array(OutputChannelSchema),
  inputs: z.array(InputChannelSchema).optional(), // NEW!
  halfBridgePairs: z.array(HalfBridgePairSchema).optional(),
  signalMap: z.record(z.string(), SignalMapEntrySchema).optional(),
});

export const InputChannelSchema = z.object({
  id: z.string(),
  label: z.string(),
  channel: z.number(),
  source: z.enum(['core', 'core-lite', 'genesis', 'nmea2000']),
  type: z.enum(['temperature', 'voltage', 'pressure', 'rpm', 'level', 'boolean']),
  signalId: z.number(), // Direct signal ID for sensors
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.string().optional(),
});
 ```text
 ```text

1. **Add Hardware Inputs Page** (like `HardwareConfigPage.tsx`):
   - UI to configure sensor channels
   - Map physical sensors to signal IDs
   - Specify sensor types and ranges

2. **Extend Component Palette**:
   - Add "Sensor" category
   - Show available inputs alongside outputs
   - Auto-create gauge/indicator based on sensor type

3. **Update CONTROL_COMPONENT_MAP**:

```typescript
export const SENSOR_COMPONENT_MAP = {
  temperature: { component: 'gauge', variant: 'numeric' },
  voltage: { component: 'gauge', variant: 'linear' },
  pressure: { component: 'gauge', variant: 'circular' },
  rpm: { component: 'gauge', variant: 'numeric' },
  level: { component: 'gauge', variant: 'linear' },
  boolean: { component: 'indicator', variant: 'led' },
};
````

1. **Add Preview Components**:
   - `GaugePreview.tsx` for visual design
   - `IndicatorPreview.tsx` for visual design

## Signal IDs Reference

Common EmpirBus signal IDs (from `signal-info.json`):

### Sensors (Type 16, Cmd 5 - Numeric)

- Signal 2: Interior temperature
- Signal 3: Exterior temperature
- Signal 4: Starter battery voltage
- Signal 5-20: Various analog sensors

### Status (Type 16, Cmd 1 - Boolean)

- Signal 100+: System status flags
- Signal 150+: Warning/alarm states

Check your `web/signal-info.json` file for the complete list of available signals in your system.

## Binding Types

### EmpirBus Direct Binding (Recommended for Sensors)

```json
{
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": 2 // Signal ID
    }
  }
}
```

### NMEA2000 Binding (For Marine Networks)

```json
{
  "bindings": {
    "value": {
      "type": "nmea2000",
      "pgn": 127505, // Fluid level PGN
      "instance": 0
    }
  }
}
```

## Component Configuration

### Gauge Variants

**Numeric** - Large number display

```json
{
  "type": "gauge",
  "variant": "numeric",
  "decimals": 2,
  "unit": "V"
}
```

**Linear** - Horizontal progress bar

```json
{
  "type": "gauge",
  "variant": "linear",
  "min": 0,
  "max": 100,
  "unit": "%"
}
```

**Circular** - Arc gauge (dial)

```json
{
  "type": "gauge",
  "variant": "circular",
  "min": 0,
  "max": 5000,
  "unit": "RPM"
}
```

### Indicator Variants

**LED** - Simple status light

```json
{
  "type": "indicator",
  "variant": "led",
  "color": "red"
}
```

**Badge** - Status with label

```json
{
  "type": "indicator",
  "variant": "badge"
}
```

**Icon** - Custom icon with state

```json
{
  "type": "indicator",
  "variant": "icon",
  "icon": "⚠️"
}
```

## Testing

1. **Add component to schema** (manually edit JSON or in web-configurator editor)
2. **Export deployment package** from web-configurator
3. **Upload to Garmin device**
4. **Verify signal subscription** in browser console:
   [SignalSubscription] Subscribing to signal 2 (numeric)
5. **Check WebSocket messages**:
   - Type 16, Cmd 5 for numeric values
   - Type 16, Cmd 1 for boolean states

## Example: Complete Monitoring Tab

```json
{
  "tabs": [
    {
      "id": "monitoring",
      "label": "System Monitor",
      "icon": "📊",
      "sections": [
        {
          "id": "voltages",
          "label": "Electrical",
          "columns": 6,
          "components": [
            {
              "id": "gauge-battery",
              "type": "gauge",
              "label": "Battery",
              "variant": "linear",
              "min": 10,
              "max": 16,
              "decimals": 2,
              "unit": "V",
              "bindings": { "value": { "type": "empirbus", "channel": 4 } },
              "width": 6
            }
          ]
        },
        {
          "id": "temperatures",
          "label": "Temperatures",
          "columns": 6,
          "components": [
            {
              "id": "gauge-int-temp",
              "type": "gauge",
              "label": "Interior",
              "variant": "circular",
              "min": -40,
              "max": 125,
              "decimals": 1,
              "unit": "°F",
              "bindings": { "value": { "type": "empirbus", "channel": 2 } },
              "width": 3
            },
            {
              "id": "gauge-ext-temp",
              "type": "gauge",
              "label": "Exterior",
              "variant": "circular",
              "min": -40,
              "max": 125,
              "decimals": 1,
              "unit": "°F",
              "bindings": { "value": { "type": "empirbus", "channel": 3 } },
              "width": 3
            }
          ]
        },
        {
          "id": "warnings",
          "label": "Warnings",
          "columns": 6,
          "components": [
            {
              "id": "indicator-low-oil",
              "type": "indicator",
              "label": "Low Oil",
              "variant": "led",
              "color": "red",
              "bindings": { "state": { "type": "empirbus", "channel": 150 } },
              "width": 2
            },
            {
              "id": "indicator-high-temp",
              "type": "indicator",
              "label": "High Temp",
              "variant": "led",
              "color": "yellow",
              "bindings": { "state": { "type": "empirbus", "channel": 151 } },
              "width": 2
            }
          ]
        }
      ]
    }
  ]
}
```

## Next Steps

To fully integrate gauges/indicators into the web-configurator:

1. Extend schema with `inputs` array
2. Create `HardwareInputsPage.tsx` for sensor configuration
3. Update `ComponentPalette` to show available sensors
4. Add `GaugePreview` and update `IndicatorPreview` components
5. Update `EditorPage` to handle sensor-based components
6. Add validation for sensor signal IDs

For now, manually editing the schema JSON works perfectly - the HMI UI runtime fully supports these components!
