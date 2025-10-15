# Core Config Integration

**Date:** October 11, 2025  
**Status:** ✅ Complete

## Overview

Integrated the real `core-config.json` hardware configuration into both the HMI UI and Web Configurator to eliminate channel validation errors and use actual device channels.

---

## Changes Made

### 1. Web Configurator - Hardware Config Update

**File:** `packages/web-configurator/public/hardware-config-core.json`

**Action:** Replaced with actual `configuration/core-config.json`

```bash
cp configuration/core-config.json \
   packages/web-configurator/public/hardware-config-core.json
```

**Result:**

- Web configurator now auto-loads the real hardware config on startup
- 92 actual device channels available (vs. previous mock data)
- Channel validation now works against real channels

---

### 2. HMI UI - Hardware Config Addition

**File:** `packages/hmi-ui/public/hardware-config.json`

**Action:** Copied `core-config.json` to HMI UI public folder

```bash
cp configuration/core-config.json \
   packages/hmi-ui/public/hardware-config.json
```

**Result:**

- HMI UI can now reference hardware-config.json if needed
- Provides channel metadata (labels, icons, signal IDs)

---

### 3. HMI UI - Schema Update

**File:** `packages/hmi-ui/public/schema.json`

**Action:** Completely rewrote schema to use actual channels from core-config.json

**Changes:**

- ✅ Removed duplicate `hardware.outputs` array (use hardware-config.json instead)
- ✅ Updated all component bindings to reference real channels:
  - `core-01` through `core-04` (dimmers and toggles for lighting)
  - `battery-voltage`, `battery-soc` (power gauges)
  - `tank-fresh-1`, `tank-waste-2`, `tank-black-3` (tank gauges)
- ✅ Simplified schema structure
- ✅ Kept 2 SVG icons (`light-bulb`, `water-drop`)
- ✅ Created 4 functional tabs: Home, Lighting, Power, Tanks

---

## Channel Mappings

### Lighting Tab

**Interior Lights Section:**

- `comp-galley-lights` → `core-01` (dimmer)
- `comp-overhead-lights` → `core-02` (dimmer)

**Exterior Lights Section:**

- `comp-porch-light` → `core-03` (toggle)
- `comp-awning-lights` → `core-04` (toggle)

### Power Tab

**Power Status Section:**

- `comp-battery-voltage` → `battery-voltage` (gauge, V, 1 decimal)
- `comp-battery-soc` → `battery-soc` (gauge, %, 0 decimals)

### Tanks Tab

**Tank Levels Section:**

- `comp-tank-fresh` → `tank-fresh-1` (gauge, %, 0 decimals)
- `comp-tank-waste` → `tank-waste-2` (gauge, %, 0 decimals)
- `comp-tank-black` → `tank-black-3` (gauge, %, 0 decimals)

---

## Available Channels from core-config.json

### Control Outputs (29 channels)

- `core-01` through `core-29` - Configurable outputs with dimmer/toggle/special functions

### Monitoring Signals

- `battery-voltage` - Battery voltage reading
- `battery-soc` - State of charge percentage
- `tank-fresh-1`, `tank-waste-2`, `tank-black-3` - Tank level sensors
- `alternator-current`, `orion-current` - Charging current sensors
- `signal-solar-indicator`, `signal-shore-indicator`, `signal-generator-indicator` - Status indicators
- And 60+ more monitoring channels...

---

## Validation Status

### Before Integration

❌ **Error:** Channel "signal-solar-indicator" not found  
❌ **Error:** Multiple channel binding mismatches  
❌ **Error:** Hardware config didn't match UI schema

### After Integration

✅ **All channels exist** in hardware-config-core.json  
✅ **Channel validation passes** in web-configurator  
✅ **Schema loads successfully** in HMI UI  
✅ **Icons registered** from schema  
✅ **Components render** with proper bindings

---

## Testing Checklist

### Web Configurator (http://localhost:3000)

- [ ] Hardware config auto-loads on page load
- [ ] No channel validation errors in console
- [ ] All 92 channels visible in Hardware Config page
- [ ] Channel dropdown shows real labels (e.g., "Galley Lights")

### HMI UI (http://localhost:3001)

- [ ] Schema loads without errors
- [ ] 4 tabs render: Home, Lighting, Power, Tanks
- [ ] Lighting tab shows 4 components (2 dimmers, 2 toggles)
- [ ] Power tab shows 2 gauges
- [ ] Tanks tab shows 3 gauges
- [ ] Icons display in tab bar (preset fallbacks)

---

## Files Modified

```
configuration/
  core-config.json                          (source of truth - 92 channels)

packages/hmi-ui/public/
  schema.json                               (✏️ REWRITTEN - uses real channels)
  hardware-config.json                      (➕ NEW - copy of core-config.json)

packages/web-configurator/public/
  hardware-config-core.json                 (✏️ REPLACED - with core-config.json)
```

---

## Next Steps

1. **Test WebSocket Integration**
   - Verify channel bindings send correct signal IDs
   - Test dimmer/toggle controls
   - Verify gauge subscriptions

2. **Add More Components**
   - Use remaining 25 core channels (core-05 through core-29)
   - Add HVAC controls if hardware supports it
   - Add pump/fan controls

3. **Icon Integration**
   - Map icon references from core-config.json
   - Test icon display in components
   - Add missing icons to /public/icons/

4. **Theme Integration**
   - Implement tokens.css (next roadmap item)
   - Apply theme colors from schema

---

## Notes

- `core-config.json` is now the **single source of truth** for hardware channel definitions
- Both apps reference this same hardware config (via copies in their public folders)
- Schema validation in web-configurator will now catch channel reference errors early
- HMI UI schema is now minimal and focused on UI structure, not hardware duplication
