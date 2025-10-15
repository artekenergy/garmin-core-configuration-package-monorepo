# Tab-by-Tab Implementation Plan

**Date:** October 14, 2025  
**Status:** Planning Phase  
**Goal:** Detailed breakdown of each preset tab's requirements, current state, and enhancement needs

---

## 📋 Overview

This document provides a comprehensive analysis of all 6 preset tabs in the HMI UI, detailing their:

- **Current State** - What's implemented today
- **Schema Structure** - Tab/subtab/section configuration
- **Component Requirements** - What components should appear
- **Hardware Integration** - Which channels/signals are used
- **UI/UX Needs** - Layout, interactions, visual design
- **Enhancement Priorities** - What needs to be built next

---

## 🏠 Tab 1: HOME

### Purpose

Quick access dashboard with favorite controls and status monitoring. Users customize this tab for their most-used features.

### Current State

**Implementation Status:** ✅ **COMPLETE**

- ✅ Special 2-section layout (side-by-side on large screens)
- ✅ HomeLayout component rendering
- ✅ Section type system (switching, signal-values, image, mixed)
- ✅ Component palette filtering by section type
- ✅ Drag-and-drop component adding
- ✅ Web configurator page (`/home`)

**Files:**

- `packages/hmi-ui/src/components/HomeLayout.tsx`
- `packages/web-configurator/src/pages/HomePage.tsx`
- `packages/web-configurator/src/components/HomeSectionManager.tsx`

### Schema Structure

```json
{
  "home": {
    "section1": {
      "enabled": true,
      "type": "switching",
      "title": "Quick Controls"
    },
    "section2": {
      "enabled": true,
      "type": "signal-values",
      "title": "Status"
    }
  },
  "tabs": [
    {
      "id": "tab-home",
      "preset": "home",
      "title": "Home",
      "enabled": true,
      "sections": [
        {
          "id": "section-home-1",
          "title": "Quick Controls",
          "type": "switching",
          "enabled": true,
          "components": [
            // User-customizable components
          ]
        },
        {
          "id": "section-home-2",
          "title": "Status",
          "type": "signal-values",
          "enabled": true,
          "components": [
            // Gauges, indicators, values
          ]
        }
      ]
    }
  ]
}
```

### Component Requirements

**Section 1 (Quick Controls):**

- **Type:** `switching`
- **Allowed Components:** Toggle, Button, Dimmer, Slider
- **Purpose:** Most-used controls for quick access
- **Typical Contents:**
  - All Lights toggle
  - Awning controls
  - Water pump
  - Slide controls
  - Frequently-used individual lights

**Section 2 (Status):**

- **Type:** `signal-values`
- **Allowed Components:** Gauge, Indicator
- **Purpose:** At-a-glance system monitoring
- **Typical Contents:**
  - Battery voltage/SOC
  - Tank levels
  - Solar power
  - AC input/output
  - Temperature readings

### Hardware Integration

**No fixed hardware mapping** - Users choose which channels to display.

**Typical Bindings:**

- Quick Controls → Core channels (1-29) for switching/dimming
- Status → EmpirBus signals from Cerbo GX (battery, solar, tanks)

### UI/UX Features

**Layout:**

```
┌─────────────────────────────────────────┐
│  Status Bar                              │
├───────────────────┬─────────────────────┤
│                   │                     │
│  Section 1        │  Section 2          │
│  Quick Controls   │  Status             │
│                   │                     │
│  ┌────┬────┬────┐ │  ┌──────┬──────┐   │
│  │ 🔦 │ 🚿 │ 🎯 │ │  │ Batt │ Tank │   │
│  └────┴────┴────┘ │  └──────┴──────┘   │
│  ┌────┬────┬────┐ │  ┌──────┬──────┐   │
│  │ 💡 │ 🔌 │ 🎛️ │ │  │ Solar│ Temp │   │
│  └────┴────┴────┘ │  └──────┴──────┘   │
│                   │                     │
└───────────────────┴─────────────────────┘
│  Tab Bar (Home selected)                │
└─────────────────────────────────────────┘
```

**Responsive Behavior:**

- **Large screens (1084x606):** Two sections side-by-side
- **Medium screens (958x489):** Two sections stacked vertically (Section 1 on top)
- **Small screens:** Same as medium

**Special Features:**

- Section titles can be customized
- Sections can be enabled/disabled independently
- Empty sections show placeholder message
- Drag-and-drop component reordering

### Enhancement Priorities

**Phase 1 - Schema-Driven Enablement:**

- ✅ Already supports section enabling/disabling
- 🔲 Add component `enabled` property filtering
- 🔲 Validate bindings against available hardware

**Phase 2 - UX Polish:**

- 🔲 Empty state when both sections disabled
- 🔲 Loading skeleton for sections
- 🔲 Smooth transitions when adding/removing components

**Phase 3 - Advanced Features:**

- 🔲 Section templates (presets for common layouts)
- 🔲 Component favorites/pinning
- 🔲 Quick edit mode (rearrange without configurator)

### Known Issues

- None currently

### Documentation

- ✅ `docs/HOME_TAB_LAYOUT.md`
- ✅ `docs/HOME_TAB_CONFIGURATION.md`
- ✅ `docs/HOME_TAB_USAGE_GUIDE.md`
- ✅ `docs/HOME_TAB_EDITOR_CONFIGURATION.md`

---

## 💡 Tab 2: LIGHTING

### Purpose

Control all lighting systems - interior, exterior, and RGB lighting.

### Current State

**Implementation Status:** ✅ **COMPLETE with Subtabs**

- ✅ Subtab system (Interior, Exterior, RGB)
- ✅ SubtabBar component rendering
- ✅ Section-to-subtab mapping
- ✅ Web configurator page (`/lighting`)
- ✅ LightingSectionManager component
- ✅ Subtab enable/disable/title/icon editing

**Files:**

- `packages/hmi-ui/src/components/SubtabBar.tsx`
- `packages/hmi-ui/src/utils/tabGenerator.ts` (applyLightingConfig)
- `packages/web-configurator/src/pages/LightingPage.tsx`
- `packages/web-configurator/src/components/LightingSectionManager.tsx`
- `packages/schema/src/tabs/lighting-tab.ts`

### Schema Structure

```json
{
  "lightingTab": {
    "interior": {
      "enabled": true,
      "title": "Interior",
      "icon": "💡"
    },
    "exterior": {
      "enabled": true,
      "title": "Exterior",
      "icon": "🌟"
    },
    "rgb": {
      "enabled": false,
      "title": "RGB",
      "icon": "🌈"
    }
  },
  "tabs": [
    {
      "id": "tab-lighting",
      "preset": "lighting",
      "title": "Lighting",
      "enabled": true,
      "sections": [
        {
          "id": "section-lighting-interior",
          "title": "Interior",
          "enabled": true,
          "components": [
            // Interior light controls
          ]
        },
        {
          "id": "section-lighting-exterior",
          "title": "Exterior",
          "enabled": true,
          "components": [
            // Exterior light controls
          ]
        },
        {
          "id": "section-lighting-rgb",
          "title": "RGB",
          "enabled": false,
          "components": [
            // RGB light controls
          ]
        }
      ]
    }
  ]
}
```

### Subtab Configuration

**Interior Subtab:**

- **Purpose:** Cabin overhead lights, reading lamps, galley lights, etc.
- **Typical Components:** Toggle buttons, Dimmers
- **Hardware:** Core channels configured as `toggle-button` or `dimmer`
- **Example Channels:** Overhead lights, under-cabinet lights, reading lamps

**Exterior Subtab:**

- **Purpose:** Porch lights, underbody lights, step lights, awning lights
- **Typical Components:** Toggle buttons, Dimmers
- **Hardware:** Core channels for exterior lighting
- **Example Channels:** Porch light, step lights, awning LED strip

**RGB Subtab:**

- **Purpose:** Color-changing LED strips (if equipped)
- **Typical Components:** Color pickers, Brightness sliders, Effect selectors
- **Hardware:** RGB controllers via EmpirBus or specialized RGB channels
- **Status:** Optional - disabled by default (not all systems have RGB)

### Component Requirements

**Per Subtab:**

- **Toggle Buttons:** On/off control for individual lights
- **Dimmers:** Brightness control for dimmable lights
- **Sliders:** Alternative dimmer UI
- **Indicators:** Show light status when controlled elsewhere

**Common Patterns:**

- "All Interior Lights" master toggle
- "All Exterior Lights" master toggle
- Grouped lights (e.g., "Galley Lights" controls multiple fixtures)

### Hardware Integration

**Channel Mapping:**

- Interior lights → Core channels with `control: "toggle-button"` or `"dimmer"`
- Exterior lights → Core channels with exterior-specific labels/icons
- RGB lights → Specialized RGB controllers or ITC modules

**Signal IDs:**

- Each channel has 3 signals: `toggle`, `momentary`, `dimmer`
- Components bind to appropriate signal based on control type
- Signal ID pattern: `(channel × 3) + offset`

**Auto-Population:**

- `generateLightingTab()` scans hardware config
- Filters outputs by icon/label keywords (light, lamp, LED, etc.)
- Creates components automatically for lighting channels
- Groups by interior/exterior based on keywords

### UI/UX Features

**Layout:**

```
┌─────────────────────────────────────────┐
│  Status Bar                              │
├─────────────────────────────────────────┤
│  💡 Interior  │  🌟 Exterior  │ 🌈 RGB  │ ← Subtab Bar
├─────────────────────────────────────────┤
│                                         │
│  Interior Lights                        │
│                                         │
│  ┌────────┬────────┬────────┬────────┐ │
│  │ Galley │ Cabin  │ Reading│ Under  │ │
│  │ Lights │ Lights │ Lamp   │ Cabinet│ │
│  │  ON    │  OFF   │  ON    │  OFF   │ │
│  └────────┴────────┴────────┴────────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Overhead Lights Dimmer          │   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░ 75%  │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
│  Tab Bar (Lighting selected)            │
└─────────────────────────────────────────┘
```

**Subtab Behavior:**

- Show subtab bar when 2+ subtabs enabled
- Hide subtab bar when ≤1 subtab enabled (show that subtab directly)
- Active subtab highlighted with accent color underline
- Switching subtabs changes visible components
- Subtab selection persists per tab

**Responsive Grid:**

- 4 columns on large screens
- 3 columns on medium screens
- 2 columns on small screens

### Enhancement Priorities

**Phase 1 - Hardware-Driven Enablement:**

- 🔲 Auto-detect lighting channels from hardware config
- 🔲 Auto-create components for detected lights
- 🔲 Filter components by enabled channels
- 🔲 Show warning when no lights configured

**Phase 2 - UX Enhancements:**

- 🔲 "All Lights" master control (per subtab)
- 🔲 Scene support (save/recall lighting presets)
- 🔲 Dimmer synchronization (multiple lights at same level)
- 🔲 Night mode (dim all lights to low level)

**Phase 3 - Advanced Features:**

- 🔲 RGB color picker component
- 🔲 RGB effect presets (fade, rainbow, strobe)
- 🔲 Scheduling (automatic on/off times)
- 🔲 Occupancy integration (auto-on with motion)

### Known Issues

- None currently

### Documentation

- ✅ `docs/LIGHTING_SUBTAB_SYSTEM.md`
- ✅ `docs/LIGHTING_TAB_SECTIONS.md`

---

## ⚡ Tab 3: POWER

### Purpose

Monitor and control power systems - batteries, charging, inverter, solar.

### Current State

**Implementation Status:** ⚠️ **PARTIAL**

- ✅ Tab exists in schema
- ✅ Web configurator page (`/power`)
- ✅ PowerSectionManager component
- ⚠️ No special layout (uses standard section grid)
- ❌ No subtab system
- ❌ Limited auto-generation logic

**Files:**

- `packages/web-configurator/src/pages/PowerPage.tsx`
- `packages/web-configurator/src/components/PowerSectionManager.tsx`
- `packages/hmi-ui/src/utils/tabGenerator.ts` (generatePowerTab - basic)

### Schema Structure

```json
{
  "power": {
    "dcCharging": {
      "secondAlternator": true,
      "orionXs": true
    },
    "solar": {
      "enabled": true,
      "primaryArray": true,
      "auxiliaryArray": true
    },
    "batteryManagement": "victron",
    "acLegs": 2,
    "multiplus": {
      "l1": true,
      "l2": true
    }
  },
  "tabs": [
    {
      "id": "tab-power",
      "preset": "power",
      "title": "Power",
      "enabled": true,
      "sections": [
        {
          "id": "section-power-batteries",
          "title": "Batteries",
          "enabled": true,
          "components": [
            // Battery voltage, SOC, current gauges
          ]
        },
        {
          "id": "section-power-solar",
          "title": "Solar",
          "enabled": true,
          "components": [
            // Solar power, voltage, current gauges
          ]
        },
        {
          "id": "section-power-inverter",
          "title": "Inverter",
          "enabled": true,
          "components": [
            // AC input/output, inverter controls
          ]
        },
        {
          "id": "section-power-charging",
          "title": "Charging",
          "enabled": true,
          "components": [
            // DC charging sources, alternator, etc.
          ]
        }
      ]
    }
  ]
}
```

### Component Requirements

**Section 1: Batteries**

- **Components:** Gauges, Indicators
- **Metrics:**
  - Battery voltage (12V/24V system)
  - State of Charge (SOC %)
  - Current (Amps in/out)
  - Time remaining
  - Temperature (if available)
- **Hardware:** Victron Cerbo GX signals via EmpirBus

**Section 2: Solar**

- **Components:** Gauges, Indicators
- **Metrics:**
  - Solar power (Watts)
  - Solar voltage
  - Solar current
  - Yield today (kWh)
  - Primary array vs Auxiliary array (if equipped)
- **Hardware:** Victron MPPT controllers via Cerbo GX

**Section 3: Inverter/AC**

- **Components:** Gauges, Toggle buttons
- **Metrics:**
  - AC Input (shore power or generator)
    - Voltage (L1, L2)
    - Current
    - Frequency
  - AC Output (inverter)
    - Voltage
    - Current
    - Power (Watts)
  - Multiplus mode (Charge only, Inverter only, On, Off)
- **Controls:**
  - Inverter On/Off toggle
  - AC Input limit slider
- **Hardware:** Victron Multiplus via Cerbo GX

**Section 4: DC Charging**

- **Components:** Gauges, Indicators
- **Metrics:**
  - Alternator 1 (engine) - Voltage, Current
  - Alternator 2 (if equipped) - Voltage, Current
  - Orion XS DC-DC (if equipped) - Input/Output, Current
  - DC input from other sources
- **Hardware:** Victron devices via Cerbo GX

### Hardware Integration

**Primary Source:** Victron Cerbo GX via EmpirBus

**Signal Types:**

- Read-only values (most power metrics)
- Control signals (inverter on/off, AC limit)

**Schema Configuration:**
The `power` section in schema drives what sections appear:

- `dcCharging.secondAlternator: true` → Show Alt 2 gauge
- `dcCharging.orionXs: true` → Show Orion XS gauge
- `solar.enabled: true` → Show Solar section
- `solar.auxiliaryArray: true` → Show Aux Solar gauge
- `multiplus.l1/l2: true` → Show L1/L2 AC gauges

**Auto-Generation:**
`generatePowerTab()` should create gauges based on schema config.

### UI/UX Features

**Layout:**

```
┌─────────────────────────────────────────┐
│  Status Bar                              │
├─────────────────────────────────────────┤
│                                         │
│  Batteries                              │
│  ┌──────────┬──────────┬──────────┐    │
│  │ Voltage  │   SOC    │ Current  │    │
│  │  13.2V   │   87%    │  12.3A   │    │
│  └──────────┴──────────┴──────────┘    │
│                                         │
│  Solar                                  │
│  ┌──────────┬──────────┬──────────┐    │
│  │  Power   │ Voltage  │ Current  │    │
│  │  456W    │  18.7V   │  24.4A   │    │
│  └──────────┴──────────┴──────────┘    │
│                                         │
│  Inverter / AC                          │
│  ┌──────────┬──────────┬──────────┐    │
│  │AC Input  │AC Output │ Inverter │    │
│  │  120V    │  118V    │   ON     │    │
│  └──────────┴──────────┴──────────┘    │
│                                         │
└─────────────────────────────────────────┘
│  Tab Bar (Power selected)               │
└─────────────────────────────────────────┘
```

**Section Organization:**

- Sections stacked vertically
- Each section has title + grid of gauges
- Collapsible sections (future enhancement)
- Empty sections hidden (e.g., Solar if not equipped)

**Gauge Types:**

- **Numeric Gauges:** Voltage, Current, Power (with units)
- **Percentage Gauges:** SOC, Battery %
- **LED Indicators:** Charging status, Inverter status
- **Radial Gauges:** Larger displays for key metrics (optional)

### Enhancement Priorities

**Phase 1 - Auto-Generation (HIGH):**

- 🔲 Implement `generatePowerTab()` logic
- 🔲 Create gauges based on `power` schema config
- 🔲 Map schema flags to component creation
- 🔲 Handle missing hardware gracefully (hide sections)

**Phase 2 - UX Polish (MEDIUM):**

- 🔲 Collapsible sections
- 🔲 Large gauge variant for key metrics
- 🔲 Color-coded gauges (green/yellow/red based on thresholds)
- 🔲 Trend indicators (arrows for charging/discharging)

**Phase 3 - Advanced Features (LOW):**

- 🔲 Historical graphs (voltage/SOC over time)
- 🔲 Power flow diagram (visual of energy flow)
- 🔲 Alerts/warnings for low battery, overload, etc.
- 🔲 Inverter mode selection (Charge Only, Inverter Only, On, Off)

**Phase 4 - Subtab System (FUTURE):**

- 🔲 Subtabs for Batteries, Solar, AC, DC?
- 🔲 Or keep as stacked sections?
- 🔲 Decision: Depends on amount of content

### Known Issues

- ⚠️ `generatePowerTab()` is minimal - doesn't create components automatically
- ⚠️ No validation of `power` schema config
- ⚠️ No error handling for missing Cerbo GX signals

### Documentation

- ❌ No dedicated Power tab documentation yet
- 🔲 **NEEDED:** `docs/POWER_TAB_IMPLEMENTATION.md`

---

## 🌡️ Tab 4: HVAC

### Purpose

Control heating, cooling, and ventilation systems.

### Current State

**Implementation Status:** ✅ **COMPLETE with Subtabs**

- ✅ Subtab system (Heating, Cooling, Ventilation)
- ✅ Web configurator page (`/hvac`)
- ✅ HVACSectionManager component
- ✅ Schema-driven subtab enablement
- ✅ Section-to-subtab mapping

**Files:**

- `packages/web-configurator/src/pages/HVACPage.tsx`
- `packages/web-configurator/src/components/HVACSectionManager.tsx`
- `packages/hmi-ui/src/utils/tabGenerator.ts` (applyHVACConfig)
- `packages/schema/src/tabs/hvac-tab.ts`

### Schema Structure

```json
{
  "hvac": {
    "heating": {
      "enabled": true,
      "sources": {
        "diesel": true,
        "electric": true,
        "engine": true
      },
      "distribution": {
        "floor": true,
        "fans": true
      },
      "hotWater": true,
      "auxZone": true
    },
    "cooling": {
      "enabled": true,
      "brand": "recpro"
    },
    "ventilation": {
      "enabled": true,
      "fans": 2
    }
  },
  "hvacTab": {
    "heating": {
      "enabled": true,
      "title": "Heating",
      "icon": "🔥"
    },
    "cooling": {
      "enabled": true,
      "title": "Cooling",
      "icon": "❄️"
    },
    "ventilation": {
      "enabled": true,
      "title": "Ventilation",
      "icon": "💨"
    }
  },
  "tabs": [
    {
      "id": "tab-hvac",
      "preset": "hvac",
      "title": "HVAC",
      "enabled": true,
      "sections": [
        {
          "id": "section-hvac-heating",
          "title": "Heating",
          "enabled": true,
          "components": [
            // Heating controls and status
          ]
        },
        {
          "id": "section-hvac-cooling",
          "title": "Cooling",
          "enabled": true,
          "components": [
            // AC controls and status
          ]
        },
        {
          "id": "section-hvac-ventilation",
          "title": "Ventilation",
          "enabled": true,
          "components": [
            // Fan controls
          ]
        }
      ]
    }
  ]
}
```

### Subtab Configuration

**Heating Subtab:**

- **Purpose:** Furnace/heater control, hot water heater
- **Sources:** Diesel furnace, Electric heater, Engine coolant heat
- **Distribution:** Floor vents, Overhead fans
- **Components:** Toggles, Temperature setpoint sliders, Mode selectors
- **Hardware:** RVC/EmpirBus control of HVAC systems

**Cooling Subtab:**

- **Purpose:** Air conditioner control
- **Brands:** Dometic, RecPro, etc.
- **Components:** On/Off toggle, Fan speed, Temperature setpoint, Mode (Auto/Cool/Fan)
- **Hardware:** RVC control of roof AC units

**Ventilation Subtab:**

- **Purpose:** Roof vents, exhaust fans, fresh air intake
- **Components:** Fan toggles, Speed sliders
- **Hardware:** Core channels or RVC fan controllers

### Component Requirements

**Heating Subtab:**

- **Furnace Control:**
  - On/Off toggle
  - Temperature setpoint slider (60-85°F)
  - Mode selector (Auto, Heat, Off)
  - Current temperature gauge
- **Hot Water Heater:**
  - On/Off toggle
  - Temperature setpoint
  - Status indicator
- **Zone Controls (if multi-zone):**
  - Zone 1 / Zone 2 toggles
  - Individual setpoints
- **Fan Distribution:**
  - Overhead fan toggles
  - Fan speed sliders

**Cooling Subtab:**

- **AC Unit 1:**
  - On/Off toggle
  - Temperature setpoint slider (65-85°F)
  - Fan speed (Low/Med/High)
  - Mode (Cool/Fan/Auto)
  - Current temperature gauge
- **AC Unit 2 (if equipped):**
  - Same controls as Unit 1
- **Status Indicators:**
  - Compressor running
  - Fan running
  - Power draw

**Ventilation Subtab:**

- **Roof Vent/Fan Controls:**
  - Fan 1 On/Off
  - Fan 1 Speed (0-100%)
  - Fan 2 On/Off
  - Fan 2 Speed (if equipped)
- **Fresh Air Controls:**
  - Fresh air damper position
  - Intake fan control

### Hardware Integration

**Control Protocol:** RVC (Recreational Vehicle CAN bus)

**Device Integration:**

- Furnace: RVC commands via Cerbo GX or direct CAN
- Air Conditioner: RVC commands (Dometic, RecPro, etc.)
- Fans: Core channels or RVC fan controllers
- Thermostats: RVC temperature sensors

**Signal Types:**

- Control: On/Off, Setpoint, Mode, Fan Speed
- Status: Current temp, Running status, Fault codes

**Auto-Generation:**
`generateHVACTab()` should create sections based on `hvac` config:

- If `hvac.heating.enabled: true` → Create Heating section with furnace controls
- If `hvac.cooling.enabled: true` → Create Cooling section with AC controls
- If `hvac.ventilation.enabled: true` → Create Ventilation section with fan controls

### UI/UX Features

**Layout:**

```
┌─────────────────────────────────────────┐
│  Status Bar                              │
├─────────────────────────────────────────┤
│  🔥 Heating  │  ❄️ Cooling  │  💨 Vent  │ ← Subtab Bar
├─────────────────────────────────────────┤
│                                         │
│  Furnace                                │
│  ┌────────┬────────────────┬──────────┐│
│  │  ON    │  Setpoint: 72°F│ Current  ││
│  │  [🔥]  │  ░░░░░░░░░░░   │   68°F   ││
│  └────────┴────────────────┴──────────┘│
│                                         │
│  Hot Water                              │
│  ┌────────┬────────────────┐           │
│  │  ON    │  Temp: 130°F   │           │
│  │  [💧]  │  ░░░░░░░░░░░   │           │
│  └────────┴────────────────┘           │
│                                         │
│  Zone Controls                          │
│  ┌────────┬────────┐                   │
│  │ Zone 1 │ Zone 2 │                   │
│  │  ON    │  OFF   │                   │
│  └────────┴────────┘                   │
│                                         │
└─────────────────────────────────────────┘
│  Tab Bar (HVAC selected)                │
└─────────────────────────────────────────┘
```

**Subtab Behavior:**

- Show subtab bar when 2+ subtabs enabled
- Hide subtab bar if only one HVAC system enabled
- Subtabs enable/disable based on `hvacTab` config

**Temperature Controls:**

- Large, touch-friendly sliders for setpoints
- +/- buttons as alternative to slider
- Display both setpoint and current temperature
- Color-coded (red for heating, blue for cooling)

### Enhancement Priorities

**Phase 1 - Auto-Generation (HIGH):**

- 🔲 Implement smart `generateHVACTab()` logic
- 🔲 Create components based on `hvac` schema config
- 🔲 Map heating sources to controls
- 🔲 Handle multi-zone heating
- 🔲 Support multiple AC units

**Phase 2 - UX Enhancements (MEDIUM):**

- 🔲 Visual thermostat component
- 🔲 Schedule support (auto-adjust temps by time)
- 🔲 Quick presets (Sleep mode, Away mode, Comfort mode)
- 🔲 Temperature trend graphs

**Phase 3 - Advanced Features (LOW):**

- 🔲 Humidity control and monitoring
- 🔲 Smart mode (auto switch heating/cooling)
- 🔲 Energy usage tracking
- 🔲 Filter change reminders
- 🔲 Fault code display

### Known Issues

- ⚠️ `generateHVACTab()` creates empty sections - no auto components yet
- ⚠️ No validation of HVAC hardware availability
- ⚠️ Missing thermostat component (using generic slider)

### Documentation

- ❌ No dedicated HVAC tab documentation yet
- 🔲 **NEEDED:** `docs/HVAC_TAB_IMPLEMENTATION.md`

---

## 🔌 Tab 5: SWITCHING

### Purpose

Manual switches and accessory controls not categorized elsewhere.

### Current State

**Implementation Status:** ✅ **COMPLETE with Subtabs**

- ✅ Subtab system (Switches, Accessories)
- ✅ Web configurator page (`/switching`)
- ✅ SwitchingSectionManager component
- ✅ Schema-driven subtab configuration
- ✅ Optional custom section support

**Files:**

- `packages/web-configurator/src/pages/SwitchingPage.tsx`
- `packages/web-configurator/src/components/SwitchingSectionManager.tsx`
- `packages/hmi-ui/src/utils/tabGenerator.ts` (applySwitchingConfig)
- `packages/schema/src/tabs/switching-tab.ts`

### Schema Structure

```json
{
  "switchingTab": {
    "switches": {
      "enabled": true,
      "title": "Switches",
      "icon": "🔌"
    },
    "accessories": {
      "enabled": true,
      "title": "Accessories",
      "icon": "⚡"
    },
    "customSection": {
      "enabled": true,
      "title": "Custom",
      "icon": "🔧"
    }
  },
  "tabs": [
    {
      "id": "tab-switching",
      "preset": "switching",
      "title": "Switching",
      "enabled": true,
      "sections": [
        {
          "id": "section-switching-switches",
          "title": "Switches",
          "enabled": true,
          "components": [
            // General switches
          ]
        },
        {
          "id": "section-switching-accessories",
          "title": "Accessories",
          "enabled": true,
          "components": [
            // Accessory controls
          ]
        }
      ]
    }
  ]
}
```

### Subtab Configuration

**Switches Subtab:**

- **Purpose:** General-purpose on/off controls
- **Typical Contents:**
  - Kitchen appliances
  - Entertainment systems
  - Security systems
  - Miscellaneous loads
- **Components:** Toggle buttons, Indicators

**Accessories Subtab:**

- **Purpose:** RV accessories with special controls
- **Typical Contents:**
  - Awning (extend/retract with limit switches)
  - Slides (extend/retract with position feedback)
  - Step lights
  - Entry lights
  - Generator controls
- **Components:** Buttons (momentary), Toggles, Indicators

**Custom Section (Optional):**

- **Purpose:** User-defined miscellaneous category
- **Configurable title/icon**
- **Can be disabled**

### Component Requirements

**Switches Subtab:**

- **Toggle Buttons:** On/off control
- **Indicators:** LED status lights
- **Typical Devices:**
  - Coffee maker
  - TV/Stereo
  - Fireplace
  - Security system
  - Ceiling fans
  - Outdoor speakers

**Accessories Subtab:**

- **Awning Control:**
  - Extend button (momentary)
  - Retract button (momentary)
  - Position indicator (extended/retracted/partial)
  - Auto-stop at limits
- **Slide Control:**
  - Extend button (momentary)
  - Retract button (momentary)
  - Position indicators (per slide)
  - Keypad security (require PIN to operate)
- **Step Lights:**
  - Auto on/off with entry door
  - Manual override toggle
- **Generator:**
  - Start/Stop buttons
  - Status indicators (running, fault)
  - Hour meter gauge

### Hardware Integration

**Channel Types:**

- Toggle switches → Core channels with `control: "toggle-button"`
- Momentary buttons → Core channels with `control: "push-button"`
- Accessories → RVC commands or Core channels

**Special Accessories:**

- **Awning:** RVC awning control (if RVC-equipped) or relay outputs
- **Slides:** Analog position sensing or RVC slide control
- **Generator:** RVC generator control or discrete start/stop relays

**Auto-Generation:**
`generateSwitchingTab()` should:

- Scan hardware config for uncategorized channels
- Exclude channels already used in Lighting/HVAC/Plumbing
- Create switches for remaining toggle/push-button channels
- Group by subtab (switches vs accessories)

### UI/UX Features

**Layout:**

```
┌─────────────────────────────────────────┐
│  Status Bar                              │
├─────────────────────────────────────────┤
│  🔌 Switches  │  ⚡ Accessories          │ ← Subtab Bar
├─────────────────────────────────────────┤
│                                         │
│  General Switches                       │
│  ┌────────┬────────┬────────┬────────┐ │
│  │ Coffee │   TV   │  Fan   │Security│ │
│  │  OFF   │  ON    │  OFF   │  ON    │ │
│  └────────┴────────┴────────┴────────┘ │
│                                         │
│  Appliances                             │
│  ┌────────┬────────┬────────┐          │
│  │Fireplace│Speakers│ Heater │          │
│  │  ON    │  OFF   │  ON    │          │
│  └────────┴────────┴────────┘          │
│                                         │
└─────────────────────────────────────────┘
│  Tab Bar (Switching selected)           │
└─────────────────────────────────────────┘
```

**Accessories Subtab Special Layouts:**

**Awning Control:**

```
┌───────────────────────────────────┐
│  Awning                           │
│  ┌───────────┬───────────┐        │
│  │  EXTEND   │  RETRACT  │        │
│  │    [→]    │    [←]    │        │
│  └───────────┴───────────┘        │
│  Status: [████████░░] 80% Extended│
└───────────────────────────────────┘
```

**Slide Control:**

```
┌───────────────────────────────────┐
│  Slide 1 - Living Room            │
│  ┌───────────┬───────────┐        │
│  │   OPEN    │   CLOSE   │        │
│  │    [⇄]    │    [⇄]    │        │
│  └───────────┴───────────┘        │
│  Status: ● Extended               │
└───────────────────────────────────┘
```

**Subtab Behavior:**

- Show subtab bar when 2+ subtabs enabled
- Hide if only one subtab enabled
- Custom section can be disabled in schema

### Enhancement Priorities

**Phase 1 - Auto-Generation (HIGH):**

- 🔲 Implement `generateSwitchingTab()` logic
- 🔲 Filter out channels used in other tabs
- 🔲 Auto-categorize by keywords (awning, slide, etc.)
- 🔲 Create appropriate component types

**Phase 2 - Accessory Controls (MEDIUM):**

- 🔲 Dedicated Awning component (extend/retract with limits)
- 🔲 Dedicated Slide component (multi-slide support)
- 🔲 Generator control component (start/stop/status)
- 🔲 Position indicators for awning/slides

**Phase 3 - Advanced Features (LOW):**

- 🔲 Timer controls (run for X minutes then auto-off)
- 🔲 Interlocks (prevent conflicting operations)
- 🔲 Favorites (quick access to frequently-used switches)
- 🔲 Activity log (track when switches operated)

### Known Issues

- ⚠️ `generateSwitchingTab()` creates empty sections
- ⚠️ No special components for awning/slides (using generic buttons)
- ⚠️ No position feedback visualization

### Documentation

- ✅ `docs/SWITCHING_TAB_SECTIONS_FEATURE.md`
- ✅ `docs/SWITCHING_TAB_QUICK_SUMMARY.md`

---

## 💧 Tab 6: PLUMBING

### Purpose

Tank level monitoring and water system controls.

### Current State

**Implementation Status:** ⚠️ **PARTIAL**

- ✅ Tab exists in schema
- ✅ Web configurator page (`/plumbing`)
- ✅ PlumbingSectionManager component
- ⚠️ No subtabs (single section only)
- ⚠️ Limited auto-generation
- ❌ No dedicated tank gauge component

**Files:**

- `packages/web-configurator/src/pages/PlumbingPage.tsx`
- `packages/web-configurator/src/components/PlumbingSectionManager.tsx`
- `packages/hmi-ui/src/utils/tabGenerator.ts` (generatePlumbingTab - basic)
- `packages/schema/src/tabs/plumbing-tab.ts`

### Schema Structure

```json
{
  "plumbing": {
    "enabled": true,
    "monitoringSource": "cerbo-gx",
    "count": 3,
    "tanks": [
      {
        "type": "fresh",
        "name": "Fresh Water"
      },
      {
        "type": "waste",
        "name": "Gray Water"
      },
      {
        "type": "black",
        "name": "Black Water"
      }
    ]
  },
  "plumbingTab": {
    "switchingSection": {
      "enabled": false,
      "title": "Plumbing Controls"
    }
  },
  "tabs": [
    {
      "id": "tab-plumbing",
      "preset": "plumbing",
      "title": "Plumbing",
      "enabled": true,
      "sections": [
        {
          "id": "section-tank-levels",
          "title": "Tank Levels",
          "enabled": true,
          "components": [
            // Tank level gauges
          ]
        },
        {
          "id": "section-plumbing-controls",
          "title": "Water Controls",
          "enabled": true,
          "components": [
            // Water pump, heater, etc.
          ]
        }
      ]
    }
  ]
}
```

### Component Requirements

**Section 1: Tank Levels**

- **Components:** Tank gauges (custom visual component)
- **Fresh Water Tank:**
  - Level gauge (0-100%)
  - Capacity (e.g., "45 gal / 60 gal")
  - Visual tank indicator (vertical bar with fill level)
  - Low level warning
- **Gray Water Tank:**
  - Level gauge (0-100%)
  - Capacity
  - Visual tank indicator
  - High level warning
- **Black Water Tank:**
  - Level gauge (0-100%)
  - Capacity
  - Visual tank indicator
  - High level warning

**Section 2: Water Controls**

- **Water Pump:**
  - On/Off toggle
  - Pressure gauge (PSI)
  - Flow indicator
- **Water Heater:**
  - On/Off toggle
  - Temperature gauge
  - Mode (Electric/Gas/Both)
- **Tank Heaters:**
  - On/Off toggles for tank heating elements
- **Dump Valves (if electric):**
  - Gray dump valve (momentary)
  - Black dump valve (momentary)
  - Status indicators

### Hardware Integration

**Tank Monitoring:**

- **Source:** Victron Cerbo GX via EmpirBus
- **Sensors:** Resistive or capacitive tank sensors
- **Signals:** Tank 1-6 level percentages

**Water Controls:**

- **Pump:** Core channel toggle or RVC water pump control
- **Heater:** Core channel or RVC water heater control
- **Valves:** Core channels (if electric dump valves)

**Schema-Driven:**

- `plumbing.count` → Number of tanks (1-6)
- `plumbing.tanks[]` → Tank types and names
- `plumbing.monitoringSource` → "cerbo-gx" or "genesis"

**Auto-Generation:**
`generatePlumbingTab()` should:

- Create tank gauges based on `plumbing.tanks` array
- Create water pump control if channel configured
- Create water heater control if channel configured
- Hide section if `plumbing.enabled: false`

### UI/UX Features

**Layout:**

```
┌─────────────────────────────────────────┐
│  Status Bar                              │
├─────────────────────────────────────────┤
│                                         │
│  Tank Levels                            │
│                                         │
│  ┌─────────┬─────────┬─────────┐       │
│  │ Fresh   │  Gray   │  Black  │       │
│  │ ┌─────┐ │ ┌─────┐ │ ┌─────┐ │       │
│  │ │█████│ │ │███░░│ │ │██░░░│ │       │
│  │ │█████│ │ │███░░│ │ │██░░░│ │       │
│  │ │█████│ │ │███░░│ │ │██░░░│ │       │
│  │ │█████│ │ │░░░░░│ │ │░░░░░│ │       │
│  │ │█████│ │ │░░░░░│ │ │░░░░░│ │       │
│  │ └─────┘ │ └─────┘ │ └─────┘ │       │
│  │   95%   │   62%   │   38%   │       │
│  │ 57/60gal│ 19/31gal│ 15/40gal│       │
│  └─────────┴─────────┴─────────┘       │
│                                         │
│  Water Controls                         │
│  ┌──────────┬──────────┬──────────┐    │
│  │Water Pump│  Heater  │Tank Heat │    │
│  │   ON     │   ON     │   OFF    │    │
│  └──────────┴──────────┴──────────┘    │
│                                         │
└─────────────────────────────────────────┘
│  Tab Bar (Plumbing selected)            │
└─────────────────────────────────────────┘
```

**Tank Gauge Component:**

- **Visual:** Vertical bar with fill level (like a real tank)
- **Colors:**
  - Fresh Water: Blue
  - Gray Water: Gray
  - Black Water: Dark brown/black
- **Indicators:**
  - Green: Normal levels
  - Yellow: Warning (Fresh <20%, Waste >80%)
  - Red: Critical (Fresh <10%, Waste >95%)
- **Text:**
  - Percentage (large)
  - Gallons/Liters (small)

**Responsive Behavior:**

- 3 tanks side-by-side on large screens
- 2-up on medium screens
- 1-up (stacked) on small screens

### Enhancement Priorities

**Phase 1 - Auto-Generation (HIGH):**

- 🔲 Implement `generatePlumbingTab()` logic
- 🔲 Create tank gauges from `plumbing.tanks` array
- 🔲 Create water pump/heater controls from hardware config
- 🔲 Handle variable tank count (1-6 tanks)

**Phase 2 - Tank Gauge Component (HIGH):**

- 🔲 Create dedicated TankGauge component
- 🔲 Visual vertical tank representation
- 🔲 Color-coded by tank type
- 🔲 Warning/critical level indicators
- 🔲 Gallons/Liters display

**Phase 3 - UX Enhancements (MEDIUM):**

- 🔲 Tank history graphs (usage over time)
- 🔲 Dump valve controls (if electric)
- 🔲 Fresh water fill indicator (while filling)
- 🔲 Alerts for low fresh / high waste

**Phase 4 - Advanced Features (LOW):**

- 🔲 Usage tracking (gallons per day)
- 🔲 Estimated time until full/empty
- 🔲 Winterization mode (drain all tanks)
- 🔲 Tank calibration (adjust sensor readings)

### Known Issues

- ⚠️ `generatePlumbingTab()` creates empty sections
- ⚠️ No dedicated tank gauge component (using generic gauges)
- ⚠️ Tank colors/types not visually distinguished
- ⚠️ No warning indicators for tank levels

### Documentation

- ❌ No dedicated Plumbing tab documentation yet
- 🔲 **NEEDED:** `docs/PLUMBING_TAB_IMPLEMENTATION.md`

---

## 📊 Tab Comparison Matrix

| Feature               | Home         | Lighting    | Power      | HVAC        | Switching    | Plumbing   |
| --------------------- | ------------ | ----------- | ---------- | ----------- | ------------ | ---------- |
| **Status**            | ✅ Complete  | ✅ Complete | ⚠️ Partial | ✅ Complete | ✅ Complete  | ⚠️ Partial |
| **Subtabs**           | ❌ No        | ✅ Yes (3)  | ❌ No      | ✅ Yes (3)  | ✅ Yes (2-3) | ❌ No      |
| **Auto-Gen**          | ✅ Yes       | ✅ Yes      | ⚠️ Basic   | ⚠️ Basic    | ⚠️ Basic     | ⚠️ Basic   |
| **Special Layout**    | ✅ Yes       | ❌ No       | ❌ No      | ❌ No       | ❌ No        | ❌ No      |
| **Custom Components** | ❌ No        | ❌ No       | ❌ No      | ❌ No       | ⚠️ Needed    | ⚠️ Needed  |
| **Web Configurator**  | ✅ Yes       | ✅ Yes      | ✅ Yes     | ✅ Yes      | ✅ Yes       | ✅ Yes     |
| **Documentation**     | ✅ Excellent | ✅ Good     | ❌ None    | ❌ None     | ✅ Good      | ❌ None    |
| **Priority**          | ✅ Complete  | ✅ Complete | 🔴 High    | 🟡 Medium   | 🟡 Medium    | 🔴 High    |

---

## 🎯 Overall Implementation Priorities

### Phase 1: Complete Basic Functionality (HIGH)

**Power Tab:**

1. Implement `generatePowerTab()` auto-generation
2. Create sections based on `power` schema config
3. Map schema flags to gauge creation
4. Test with real Cerbo GX data

**Plumbing Tab:**

1. Implement `generatePlumbingTab()` auto-generation
2. Create tank gauges from `plumbing.tanks` array
3. Create water pump/heater controls
4. Add basic tank visual component

**All Tabs:**

1. Add component `enabled` property filtering
2. Validate hardware bindings
3. Show warnings for missing hardware
4. Empty state handling

### Phase 2: Custom Components (MEDIUM)

**Plumbing Tab:**

1. TankGauge component with visual tank representation
2. Color-coded by tank type
3. Warning/critical indicators

**Switching Tab:**

1. AwningControl component (extend/retract with position)
2. SlideControl component (multi-slide support)
3. GeneratorControl component (start/stop/status)

**HVAC Tab:**

1. Thermostat component (visual temperature control)
2. Mode selector component
3. Multi-zone support

### Phase 3: Advanced Features (LOW)

**All Tabs:**

1. Historical data graphs
2. Scheduling/automation
3. Alerts and notifications
4. Usage tracking and analytics

---

## 📚 Documentation Needed

### High Priority

- 🔲 `docs/POWER_TAB_IMPLEMENTATION.md`
- 🔲 `docs/PLUMBING_TAB_IMPLEMENTATION.md`
- 🔲 `docs/HVAC_TAB_IMPLEMENTATION.md`

### Medium Priority

- 🔲 `docs/TAB_AUTO_GENERATION_SYSTEM.md`
- 🔲 `docs/HARDWARE_BINDING_VALIDATION.md`
- 🔲 `docs/CUSTOM_COMPONENT_DEVELOPMENT.md`

### Low Priority

- 🔲 `docs/TAB_BEST_PRACTICES.md`
- 🔲 `docs/RVC_INTEGRATION_GUIDE.md`

---

## 🚀 Recommended Next Steps

1. **Review this document** - Confirm priorities and approach
2. **Choose starting point:**
   - Option A: Complete Power tab (monitoring critical)
   - Option B: Complete Plumbing tab (simpler, good practice)
   - Option C: Build custom components first (reusable across tabs)
3. **Set up development environment** - Device testing access
4. **Create feature branch** - `feature/tab-completion`
5. **Start with auto-generation logic** - Foundation for all tabs
6. **Build incrementally** - One tab at a time, test on device
7. **Document as you go** - Update docs for each completed tab

---

**Last Updated:** October 14, 2025  
**Version:** 1.0  
**Status:** Ready for Review
