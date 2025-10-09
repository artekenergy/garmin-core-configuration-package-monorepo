# Schema Design Specification v0.1.0

## Overview
This document defines the JSON schema structure for the Garmin Core Graphics Configurator (GCG) system.

---

## 🎯 Design Principles

1. **Single Source of Truth**: Schema defines everything about the UI
2. **Validation-First**: Must be validated before use
3. **Type Safety**: Generate TypeScript types from schema
4. **Extensible**: Easy to add new component types
5. **Portable**: Can be serialized, transferred, and stored

---

## 📦 Schema Structure

### Root Object

```typescript
interface GCGSchema {
  version: "0.1.0";                    // REQUIRED: Schema version
  metadata: SchemaMetadata;             // REQUIRED: Project info
  theme: ThemeConfiguration;            // REQUIRED: Visual theming
  icons: Record<string, IconDefinition>; // REQUIRED: Icon registry
  tabs: Tab[];                          // REQUIRED: UI tabs (min 1)
}
```

---

### Metadata

```typescript
interface SchemaMetadata {
  name: string;                         // Human-readable project name
  description?: string;                 // Optional description
  author?: string;                      // Creator/organization
  createdAt: string;                    // ISO 8601 timestamp
  updatedAt: string;                    // ISO 8601 timestamp
  targetDevice?: string;                // e.g., "Garmin HMI 7000"
}
```

**Example:**
```json
{
  "metadata": {
    "name": "Yacht Lighting Control",
    "description": "Custom UI for 50ft yacht lighting system",
    "author": "Marine Systems Inc",
    "createdAt": "2025-10-02T10:00:00Z",
    "updatedAt": "2025-10-02T14:30:00Z",
    "targetDevice": "Garmin HMI 7000"
  }
}
```

---

### Theme Configuration

```typescript
interface ThemeConfiguration {
  colors: {
    primary: string;                    // Hex color (e.g., "#0066CC")
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
    border: string;
  };
  fonts: {
    primary: string;                    // Font family name
    sizes: {
      small: number;                    // px
      medium: number;
      large: number;
    };
  };
  spacing: {
    unit: number;                       // Base spacing unit (px)
  };
  borderRadius: number;                 // Default border radius (px)
}
```

**Example:**
```json
{
  "theme": {
    "colors": {
      "primary": "#0066CC",
      "secondary": "#FF6B35",
      "background": "#000000",
      "surface": "#1A1A1A",
      "text": "#FFFFFF",
      "textSecondary": "#AAAAAA",
      "success": "#00CC66",
      "warning": "#FFAA00",
      "error": "#CC3333",
      "border": "#333333"
    },
    "fonts": {
      "primary": "Garmin DejaVu Sans",
      "sizes": {
        "small": 12,
        "medium": 16,
        "large": 24
      }
    },
    "spacing": {
      "unit": 8
    },
    "borderRadius": 4
  }
}
```

---

### Icons

```typescript
interface IconDefinition {
  id: string;                           // Unique identifier
  filename: string;                     // e.g., "lights-on.svg"
  path: string;                         // Relative path in bundle
  alt?: string;                         // Accessibility text
}

type IconRegistry = Record<string, IconDefinition>;
```

**Example:**
```json
{
  "icons": {
    "lightbulb-on": {
      "id": "lightbulb-on",
      "filename": "lightbulb-on.svg",
      "path": "/assets/icons/lightbulb-on.svg",
      "alt": "Light On"
    },
    "lightbulb-off": {
      "id": "lightbulb-off",
      "filename": "lightbulb-off.svg",
      "path": "/assets/icons/lightbulb-off.svg",
      "alt": "Light Off"
    }
  }
}
```

**Validation Rules:**
- All icon IDs must be unique
- All referenced icons must exist in registry
- Filenames must be valid paths
- Supported formats: `.svg`, `.png`, `.jpg`

---

### Tabs

```typescript
interface Tab {
  id: string;                           // Unique within schema
  label: string;                        // Display name
  icon?: string;                        // Icon ID from registry
  sections: Section[];                  // Layout sections (min 1)
  order: number;                        // Display order
}
```

**Example:**
```json
{
  "tabs": [
    {
      "id": "tab-interior-lights",
      "label": "Interior Lights",
      "icon": "lightbulb-on",
      "order": 0,
      "sections": [...]
    }
  ]
}
```

**Validation Rules:**
- Tab IDs must be unique across entire schema
- Order must be sequential starting at 0
- At least one section required

---

### Sections

```typescript
interface Section {
  id: string;                           // Unique within tab
  label?: string;                       // Optional section title
  layout: "grid" | "flex";              // Layout mode
  gridColumns?: number;                 // If layout="grid"
  components: Component[];              // UI components (min 1)
  order: number;                        // Display order within tab
}
```

**Example:**
```json
{
  "sections": [
    {
      "id": "section-cabin-lights",
      "label": "Cabin Lights",
      "layout": "grid",
      "gridColumns": 3,
      "order": 0,
      "components": [...]
    }
  ]
}
```

---

### Components

All components share a base interface:

```typescript
interface BaseComponent {
  id: string;                           // Unique across entire schema
  type: ComponentType;                  // Component variant
  label: string;                        // Display label
  icon?: string;                        // Icon ID from registry
  bindings: Bindings;                   // Data connections
  order: number;                        // Display order in section
  disabled?: boolean;                   // UI disabled state
}

type ComponentType = 
  | "toggle"
  | "button" 
  | "dimmer"
  | "gauge"
  | "indicator"
  | "slider";
```

---

#### Component Type: Toggle

Binary on/off switch.

```typescript
interface ToggleComponent extends BaseComponent {
  type: "toggle";
  variant?: "switch" | "checkbox";     // UI style
  defaultState?: boolean;               // Initial state
}
```

**Example:**
```json
{
  "id": "comp-cabin-light-1",
  "type": "toggle",
  "label": "Galley Light",
  "icon": "lightbulb-on",
  "variant": "switch",
  "defaultState": false,
  "order": 0,
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "out-channel-1",
      "property": "state"
    }
  }
}
```

---

#### Component Type: Button

Momentary action button.

```typescript
interface ButtonComponent extends BaseComponent {
  type: "button";
  action: "momentary" | "toggle";      // Button behavior
  variant?: "primary" | "secondary" | "danger";
}
```

**Example:**
```json
{
  "id": "comp-anchor-light",
  "type": "button",
  "label": "Anchor Light",
  "icon": "anchor",
  "action": "toggle",
  "variant": "primary",
  "order": 1,
  "bindings": {
    "action": {
      "type": "empirbus",
      "channel": "out-channel-5",
      "property": "trigger"
    }
  }
}
```

---

#### Component Type: Dimmer

Variable intensity control (0-100%).

```typescript
interface DimmerComponent extends BaseComponent {
  type: "dimmer";
  min?: number;                         // Default: 0
  max?: number;                         // Default: 100
  step?: number;                        // Default: 1
  defaultValue?: number;                // Initial value
  unit?: string;                        // Display unit (e.g., "%")
}
```

**Example:**
```json
{
  "id": "comp-salon-dimmer",
  "type": "dimmer",
  "label": "Salon Lights",
  "icon": "brightness",
  "min": 0,
  "max": 100,
  "step": 5,
  "defaultValue": 50,
  "unit": "%",
  "order": 2,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "out-channel-2",
      "property": "intensity"
    }
  }
}
```

---

#### Component Type: Gauge

Read-only numeric display with optional min/max.

```typescript
interface GaugeComponent extends BaseComponent {
  type: "gauge";
  min?: number;
  max?: number;
  unit: string;                         // e.g., "V", "°C", "RPM"
  decimalPlaces?: number;               // Default: 0
  variant?: "linear" | "radial";        // Display style
  warningThreshold?: number;            // Yellow indicator
  criticalThreshold?: number;           // Red indicator
}
```

**Example:**
```json
{
  "id": "comp-battery-voltage",
  "type": "gauge",
  "label": "Battery Voltage",
  "icon": "battery",
  "min": 0,
  "max": 16,
  "unit": "V",
  "decimalPlaces": 1,
  "variant": "linear",
  "warningThreshold": 11.5,
  "criticalThreshold": 10.5,
  "order": 3,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "in-starter-battery-voltage",
      "property": "value"
    }
  }
}
```

---

#### Component Type: Indicator

Status light (on/off/warning/error).

```typescript
interface IndicatorComponent extends BaseComponent {
  type: "indicator";
  variant?: "dot" | "badge" | "icon";   // Visual style
}
```

**Example:**
```json
{
  "id": "comp-bilge-alarm",
  "type": "indicator",
  "label": "Bilge High",
  "icon": "alert",
  "variant": "badge",
  "order": 4,
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "in-channel-8",
      "property": "state"
    }
  }
}
```

---

#### Component Type: Slider

Adjustable value input.

```typescript
interface SliderComponent extends BaseComponent {
  type: "slider";
  min: number;
  max: number;
  step?: number;                        // Default: 1
  defaultValue?: number;
  unit?: string;
  orientation?: "horizontal" | "vertical";
}
```

**Example:**
```json
{
  "id": "comp-hvac-temp",
  "type": "slider",
  "label": "Cabin Temp",
  "icon": "thermometer",
  "min": 16,
  "max": 30,
  "step": 0.5,
  "defaultValue": 22,
  "unit": "°C",
  "orientation": "horizontal",
  "order": 5,
  "bindings": {
    "value": {
      "type": "nmea2000",
      "pgn": 130312,
      "field": "setpoint"
    }
  }
}
```

---

### Bindings

Bindings connect components to data sources.

```typescript
interface Bindings {
  [key: string]: Binding;               // e.g., "state", "value", "action"
}

type Binding = EmpirBusBinding | NMEA2000Binding | StaticBinding;

interface EmpirBusBinding {
  type: "empirbus";
  channel: string;                      // Channel name from .ebp file
  property: string;                     // "state" | "intensity" | "value"
}

interface NMEA2000Binding {
  type: "nmea2000";
  pgn: number;                          // Parameter Group Number
  field: string;                        // Field name in PGN
  instance?: number;                    // Device instance
}

interface StaticBinding {
  type: "static";
  value: any;                           // Fixed value (for testing)
}
```

**Example:**
```json
{
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "out-channel-1",
      "property": "state"
    },
    "voltage": {
      "type": "nmea2000",
      "pgn": 127506,
      "field": "batteryVoltage",
      "instance": 0
    }
  }
}
```

**Validation Rules:**
- All binding keys must match component type expectations
- EmpirBus channels must exist in loaded `.ebp` configuration
- NMEA2000 PGNs must be valid (consult NMEA spec)

---

## ✅ Complete Example Schema

```json
{
  "version": "0.1.0",
  "metadata": {
    "name": "Yacht Control Panel",
    "description": "Main lighting and monitoring dashboard",
    "author": "Marine Tech Solutions",
    "createdAt": "2025-10-02T10:00:00Z",
    "updatedAt": "2025-10-02T14:30:00Z",
    "targetDevice": "Garmin HMI 7000"
  },
  "theme": {
    "colors": {
      "primary": "#0066CC",
      "secondary": "#FF6B35",
      "background": "#000000",
      "surface": "#1A1A1A",
      "text": "#FFFFFF",
      "textSecondary": "#AAAAAA",
      "success": "#00CC66",
      "warning": "#FFAA00",
      "error": "#CC3333",
      "border": "#333333"
    },
    "fonts": {
      "primary": "Garmin DejaVu Sans",
      "sizes": {
        "small": 12,
        "medium": 16,
        "large": 24
      }
    },
    "spacing": {
      "unit": 8
    },
    "borderRadius": 4
  },
  "icons": {
    "lightbulb-on": {
      "id": "lightbulb-on",
      "filename": "lightbulb-on.svg",
      "path": "/assets/icons/lightbulb-on.svg",
      "alt": "Light On"
    },
    "battery": {
      "id": "battery",
      "filename": "battery.svg",
      "path": "/assets/icons/battery.svg",
      "alt": "Battery"
    }
  },
  "tabs": [
    {
      "id": "tab-interior",
      "label": "Interior",
      "icon": "lightbulb-on",
      "order": 0,
      "sections": [
        {
          "id": "section-cabin",
          "label": "Cabin Lights",
          "layout": "grid",
          "gridColumns": 3,
          "order": 0,
          "components": [
            {
              "id": "comp-galley-light",
              "type": "toggle",
              "label": "Galley",
              "icon": "lightbulb-on",
              "variant": "switch",
              "defaultState": false,
              "order": 0,
              "bindings": {
                "state": {
                  "type": "empirbus",
                  "channel": "out-channel-1",
                  "property": "state"
                }
              }
            },
            {
              "id": "comp-salon-dimmer",
              "type": "dimmer",
              "label": "Salon",
              "icon": "lightbulb-on",
              "min": 0,
              "max": 100,
              "step": 5,
              "defaultValue": 50,
              "unit": "%",
              "order": 1,
              "bindings": {
                "value": {
                  "type": "empirbus",
                  "channel": "out-channel-2",
                  "property": "intensity"
                }
              }
            }
          ]
        },
        {
          "id": "section-monitoring",
          "label": "Monitoring",
          "layout": "flex",
          "order": 1,
          "components": [
            {
              "id": "comp-battery-voltage",
              "type": "gauge",
              "label": "Battery",
              "icon": "battery",
              "min": 0,
              "max": 16,
              "unit": "V",
              "decimalPlaces": 1,
              "variant": "linear",
              "warningThreshold": 11.5,
              "criticalThreshold": 10.5,
              "order": 0,
              "bindings": {
                "value": {
                  "type": "empirbus",
                  "channel": "in-starter-battery-voltage",
                  "property": "value"
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

---

## 🔒 Validation Rules Summary

### Version
- ✅ MUST be exactly `"0.1.0"`

### Component IDs
- ✅ MUST be unique across entire schema
- ✅ MUST match pattern: `^[a-z][a-z0-9-]*$`

### Icons
- ✅ All referenced icon IDs MUST exist in `icons` registry
- ✅ Icon filenames MUST be valid paths
- ✅ Icon paths MUST start with `/assets/icons/`

### Tabs
- ✅ At least 1 tab required
- ✅ Tab IDs unique within schema

### Sections
- ✅ At least 1 section per tab
- ✅ Section IDs unique within tab

### Components
- ✅ At least 1 component per section
- ✅ Component types MUST be valid
- ✅ Required fields present for each type

### Bindings
- ✅ EmpirBus channels MUST match `.ebp` file
- ✅ NMEA2000 PGNs MUST be valid numbers

---

## 🚀 Next Steps

1. Implement this schema in Zod
2. Generate TypeScript types
3. Create fixture examples
4. Write comprehensive tests
5. Document migration path for v0.2.0

---

**Last Updated**: October 2, 2025  
**Schema Version**: 0.1.0
