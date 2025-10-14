# Home Tab Bindings Guide

**Date:** October 14, 2025  
**Purpose:** Understanding and configuring component bindings for WebSocket communication

---

## 🔌 Understanding Binding Types

The HMI UI supports **3 binding types** for connecting components to data sources:

### 1. **`empirbus` Binding** (EmpirBus/Garmin Protocol)

**What it is:**

- References channels from the hardware configuration
- Used for **Core channels** (switches, dimmers, outputs)
- WebSocket messages sent as **Type 16 (MFD Status)**

**Schema Structure:**

```typescript
{
  type: 'empirbus',
  channel: 'core-01',     // String reference to hardware output
  property: 'state'       // Optional: 'state', 'intensity', 'value'
}
```

**How it works:**

1. Component has binding: `{ type: 'empirbus', channel: 'core-01' }`
2. Binding resolver looks up `core-01` in `hardware.outputs[]`
3. Finds the output with signal IDs: `{ toggle: 15, momentary: 14, dimmer: 16 }`
4. Based on component action type, selects appropriate signal ID:
   - Toggle component → uses `toggle` signal (15)
   - Dimmer component → uses `dimmer` signal (16) and `toggle` signal (15)
   - Button component → uses `momentary` signal (14)
5. Encodes signal ID as low/high byte pair

6. Sends WebSocket message as **Type 16, various commands**

**WebSocket Protocol (Type 16 - MFD Status):**

- **Cmd 1 (Toggle):** Send press (1) and release (0) for toggle/momentary actions
- **Cmd 4 (Dimmer):** Send intensity value (0-100%)
- **Cmd 5 (Numeric):** Receive numeric sensor values
- **Subscription feedback:** Type 16 messages come back with actual hardware state

### 2. **`nmea2000` Binding** (NMEA2000 Protocol)

**What it is:**

- References NMEA2000 PGN (Parameter Group Number) messages
- Used for marine sensor data (tanks, navigation, engine, etc.)
- WebSocket messages sent as **Type 16 with NMEA encoding**

**Schema Structure:**

```typescript
{
  type: 'nmea2000',
  pgn: 127505,           // PGN number (e.g., Fluid Level)

  field: 'level',        // Field name within PGN
  instance: 0            // Device instance (optional)
}
```

**Example Use Cases:**

- Tank levels (PGN 127505)
- Battery status (PGN 127508)
- Temperature (PGN 130312)

- Navigation data (PGN 129029, 129026)

**Status:** Not fully implemented yet (TODO in binding-resolver.ts)

### 3. **`static` Binding** (Testing/Mocking)

**What it is:**

- Fixed value for testing without hardware
- No WebSocket messages sent
- Component displays the static value

**Schema Structure:**

```typescript
{
  type: 'static',
  value: 75              // Any value (boolean, number, string)
}
```

**Use Cases:**

- Component testing
- UI demos
- Placeholder before hardware available  
  **Reference Files:**

- Schema: `garmin-bundle/web/schema.json`
- Hardware Config: `configuration/hardware-config-core.json`

---

## 📋 Current Bindings Analysis

### Section 1: Quick Controls

#### ✅ Component 1: Stabilizer (Dimmer)

```json
{
  "id": "comp-core-01",
  "type": "dimmer",
  "label": "Stabilizer",
  "min": 0,
  "max": 100,

  "step": 5,
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-01"  ✅ CORRECT
    }
  }
}
```

**Hardware Config Reference:**

```json
{
  "id": "core-01",
  "source": "core",
  "channel": 1,

  "control": "dimmer",
  "label": "Core 1",
  "icon": "/icons/Dimmer.svg",
  "signals": {
    "toggle": 15,
    "momentary": 14,
    "dimmer": 16
  }
}
```

**Status:** ✅ **Working correctly**

- Binding resolves to signal IDs: toggle=15, momentary=14, dimmer=16
- Component will send toggle commands and dimmer values
- No changes needed

---

#### ✅ Component 2: Slide Motor (Toggle)

```json
{
  "id": "comp-core-09",

  "type": "toggle",
  "variant": "round",
  "label": "Slide Motor",
  "icon": "plumbing",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-09"  ✅ CORRECT
    }
  }
}
```

**Hardware Config Reference:**

```json
{
  "id": "core-09",
  "source": "core",
  "channel": 9,
  "control": "dimmer",
  "label": "Core 9",
  "icon": "/icons/Dimmer.svg",
  "signals": {
    "toggle": 78,
    "momentary": 77,
    "dimmer": 79
  }
}
```

**Status:** ✅ **Working correctly**

- Binding resolves to signal ID: toggle=78
- Component will send toggle commands
- No changes needed

---

### Section 2: Status

#### ❌ Component 1: State of Charge (Gauge) - NEEDS FIX

**Current (BROKEN):**

```json
{
  "id": "comp-signal-battery-soc",
  "type": "gauge",

  "label": "State of Charge",
  "min": 0,
  "max": 100,
  "unit": "%",
  "decimals": 0,
  "bindings": {
    "value": {
      "type": "static",     ❌ STATIC - Shows 0%
      "value": 0
    }
  }
}
```

**Available Hardware Signals:**

**Option 1: BMS Battery SOC (Signal 149) - RECOMMENDED**

```json
{
  "id": "battery-soc",
  "source": "bms",
  "channel": "battery-soc",
  "control": "signal-value",
  "label": "Battery State of Charge",
  "icon": "/icons/Battery.svg",
  "signals": {
    "value": 149  ✅ This is the signal we want
  }
}

```

**Option 2: BMS State of Charge (Signal 149) - Same as Option 1**

```json
{
  "id": "signal-bms-battery-state-of-charge",
  "source": "bms",
  "channel": 149,
  "control": "signal-value",
  "label": "BMS State of Charge",
  "icon": "/icons/Battery.svg",
  "signals": {
    "value": 149  ✅ Same signal
  }
}
```

**CORRECTED BINDING (Use Option 1):**

```json
{
  "id": "comp-signal-battery-soc",
  "type": "gauge",
  "label": "State of Charge",
  "min": 0,
  "max": 100,
  "unit": "%",
  "decimals": 0,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "battery-soc"  ✅ FIXED - Will show real SOC
    }
  }

}
```

**Alternative (using signal ID directly):**

```json
{
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "signal-bms-battery-state-of-charge"
    }
  }
}
```

---

#### ❌ Component 2: Solar Voltage (Gauge) - NEEDS FIX

**Current (BROKEN):**

```json
{
  "id": "comp-signal-solar-voltage",
  "type": "gauge",
  "label": "Solar Voltage",
  "min": 0,
  "max": 16,
  "unit": "V",
  "decimals": 1,
  "bindings": {
    "value": {
      "type": "static",     ❌ STATIC - Shows 0V
      "value": 0
    }

  }
}
```

**Available Hardware Signals:**

**Option 1: Primary Solar Voltage (Signal 153) - RECOMMENDED**

```json
{
  "id": "signal-primary-solar-voltage",
  "source": "solar",
  "channel": 153,
  "control": "signal-value",
  "label": "Primary Solar Voltage",

  "icon": "/icons/Solar.svg",
  "signals": {
    "value": 153  ✅ This is the signal we want
  }
}
```

**Option 2: Auxiliary Solar Voltage (Signal 158)**

```json
{
  "id": "signal-aux-solar-voltage",
  "source": "solar",
  "channel": 158,
  "control": "signal-value",
  "label": "Auxiliary Solar Voltage",
  "icon": "/icons/Solar.svg",
  "signals": {
    "value": 158
  }
}
```

**CORRECTED BINDING:**

```json
{
  "id": "comp-signal-solar-voltage",
  "type": "gauge",
  "label": "Solar Voltage",
  "min": 0,
  "max": 60,  ⚠️ UPDATE: Solar voltage can be higher than 16V
  "unit": "V",
  "decimals": 1,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "signal-primary-solar-voltage"  ✅ FIXED
    }
  }
}
```

---

## 🔧 Complete Corrected Home Tab Schema

Here's the complete updated section with all bindings fixed:

```json
{
  "id": "tab-home",
  "title": "Home",
  "preset": "home",
  "enabled": true,
  "sections": [
    {
      "id": "section-home-1",
      "title": "Quick Controls",
      "enabled": true,
      "components": [
        {
          "id": "comp-core-01",
          "type": "dimmer",
          "label": "Stabilizer",
          "min": 0,
          "max": 100,
          "step": 5,
          "bindings": {
            "intensity": {
              "type": "empirbus",
              "channel": "core-01"
            }
          }
        },
        {
          "id": "comp-core-09",
          "type": "toggle",
          "variant": "round",
          "label": "Slide Motor",
          "icon": "plumbing",
          "bindings": {
            "state": {
              "type": "empirbus",
              "channel": "core-09"
            }
          }
        }
      ]
    },
    {
      "id": "section-home-2",
      "title": "Status",
      "enabled": true,
      "type": "signal-values",
      "components": [
        {
          "id": "comp-signal-battery-soc",
          "type": "gauge",
          "label": "State of Charge",
          "min": 0,
          "max": 100,
          "unit": "%",
          "decimals": 0,
          "bindings": {
            "value": {
              "type": "empirbus",
              "channel": "battery-soc"
            }
          }
        },
        {
          "id": "comp-signal-solar-voltage",
          "type": "gauge",
          "label": "Solar Voltage",
          "min": 0,
          "max": 60,
          "unit": "V",
          "decimals": 1,
          "bindings": {
            "value": {
              "type": "empirbus",
              "channel": "signal-primary-solar-voltage"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📊 Available Signals for Enhancement

### Power/Battery Signals

| Channel ID                           | Label                   | Signal ID | Use For             |
| ------------------------------------ | ----------------------- | --------- | ------------------- |
| `battery-voltage`                    | Battery Voltage         | 197       | Voltage gauge       |
| `battery-soc`                        | Battery State of Charge | 149       | ✅ Already using    |
| `signal-bms-battery-voltage`         | BMS Battery Voltage     | 146       | Voltage gauge (alt) |
| `signal-bms-battery-amperage`        | BMS Battery Amperage    | 148       | Current gauge       |
| `signal-bms-battery-state-of-charge` | BMS State of Charge     | 149       | ✅ Already using    |
| `signal-bms-time-to-go`              | BMS Time To Go          | 150       | Time remaining      |
| `signal-dc-loads`                    | DC Loads                | 147       | Load monitoring     |

### Solar Signals

| Channel ID                      | Label                    | Signal ID | Use For           |
| ------------------------------- | ------------------------ | --------- | ----------------- |
| `signal-primary-solar-voltage`  | Primary Solar Voltage    | 153       | ✅ Already using  |
| `signal-primary-solar-amperage` | Primary Solar Amperage   | 157       | Solar current     |
| `signal-aux-solar-voltage`      | Auxiliary Solar Voltage  | 158       | Aux solar voltage |
| `signal-aux-solar-amperage`     | Auxiliary Solar Amperage | 159       | Aux solar current |
| `signal-solar-indicator`        | Solar Indicator          | 156       | Status indicator  |

### Tank Signals

| Channel ID            | Label            | Signal ID | Use For            |
| --------------------- | ---------------- | --------- | ------------------ |
| `tank-fresh-1`        | Fresh Water Tank | 201       | Tank level %       |
| `tank-waste-2`        | Waste Water Tank | 202       | Tank level %       |
| `tank-black-3`        | Black WaterTank  | 203       | Tank level %       |
| `signal-fresh-tank-1` | Fresh Tank 1     | 197       | Tank level % (alt) |
| `signal-grey-tank-1`  | Grey Tank 1      | 199       | Tank level %       |

| `signal-black-tank-1` | Black Tank 1 | 198 | Tank level % |

### AC Power Signals

| Channel ID                       | Label                 | Signal ID | Use For            |
| -------------------------------- | --------------------- | --------- | ------------------ |
| `signal-leg-one-ac-in-voltage`   | Leg 1 AC In Voltage   | 151       | AC input voltage   |
| `signal-leg-one-ac-out-voltage`  | Leg 1 AC Out Voltage  | 154       | AC output voltage  |
| `signal-leg-one-ac-out-amperage` | Leg 1 AC Out Amperage | 155       | AC output current  |
| `indicator-shore-power`          | Shore Power Indicator | 160       | Shore power status |

### DC Charging Signals

| Channel ID           | Label               | Signal ID | Use For          |
| -------------------- | ------------------- | --------- | ---------------- |
| `alternator-current` | Alternator Current  | 339       | Charging current |
| `orion-current`      | Orion DC-DC Current | 340       | DC-DC charging   |

---

## ✨ Recommended Additional Components

### For Quick Controls Section

**1. Water Pump Toggle**

```json
{
  "id": "comp-water-pump",
  "type": "toggle",
  "variant": "round",
  "label": "Water Pump",
  "icon": "water-pump",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-02" // or whichever core channel controls pump
    }
  }
}
```

**2. Awning Control Buttons**

```json

{
  "id": "comp-awning-extend",
  "type": "button",
  "label": "Awning Extend",
  "icon": "awning",
  "bindings": {
    "action": {
      "type": "empirbus",
      "channel": "mom-awning-extend"  // Signal for momentary action
    }
  }
},
{
  "id": "comp-awning-retract",
  "type": "button",
  "label": "Awning Retract",
  "icon": "awning",
  "bindings": {
    "action": {

      "type": "empirbus",
      "channel": "mom-awning-retract"
    }
  }
}
```

**3. Awning LED Toggle**

```json
{
  "id": "comp-awning-led",
  "type": "toggle",
  "variant": "round",
  "label": "Awning Lights",
  "icon": "light",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "pbc-awning-led-on-off"
    }
  }
}
```

### For Status Section

**1. Battery Voltage Gauge**

```json
{
  "id": "comp-battery-voltage",
  "type": "gauge",
  "variant": "numeric",
  "label": "Battery Voltage",
  "min": 11,
  "max": 15,
  "unit": "V",
  "decimals": 2,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "signal-bms-battery-voltage" // Signal 146
    }
  }
}
```

**2. Battery Current Gauge**

```json
{
  "id": "comp-battery-current",
  "type": "gauge",
  "variant": "numeric",
  "label": "Battery Current",
  "min": -200,
  "max": 200,
  "unit": "A",
  "decimals": 1,

  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "signal-bms-battery-amperage" // Signal 148
    }
  }
}
```

**3. Solar Power Gauge (calculated from V × A)**

```json
{
  "id": "comp-solar-power",
  "type": "gauge",
  "variant": "linear",
  "label": "Solar Power",
  "min": 0,
  "max": 1000,
  "unit": "W",

  "decimals": 0,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "signal-primary-solar-amperage" // Signal 157
    }
  }
}
```

**4. Fresh Water Tank Indicator**

```json
{
  "id": "comp-fresh-tank",
  "type": "gauge",

  "variant": "linear",
  "label": "Fresh Water",
  "min": 0,
  "max": 100,
  "unit": "%",
  "decimals": 0,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "tank-fresh-1" // Signal 201
    }
  }
}
```

**5. Shore Power Indicator**

```json
{
  "id": "comp-shore-power",
  "type": "indicator",
  "variant": "led",
  "label": "Shore Power",
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "indicator-shore-power" // Signal 160
    }
  }
}
```

**6. AC Input Voltage Gauge**

```json
{
  "id": "comp-ac-input,
  "type": "gauge",
  "variant": "numeric",

  "label": "AC Input",
  "min": 0,
  "max": 150,
  "unit": "V",
  "decimals": 1,
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "signal-leg-one-ac-in-voltage"  // Signal 151
    }
  }
}
```

---

## 🔍 Binding Resolution Logic

### How Channel IDs Resolve to Signal IDs

The binding resolver (`packages/hmi-ui/src/utils/binding-resolver.ts`) works as follows:

1. **Input:** Channel ID (e.g., `"battery-soc"`)

2. **Lookup:** Find hardware config entry by ID
3. **Extract:** Get signal ID based on action type:
   - `'toggle'` → `signals.toggle`
   - `'momentary'` → `signals.momentary`
   - `'dimmer'` → `signals.dimmer`
   - `undefined` (for gauges/indicators) → `signals.value`
4. **Output:** Numeric signal ID (e.g., `149`)

### Example Resolution

**Gauge Component:**

```javascript
// Component binding
{
  "bindings": {
    "value": {
      "type": "empirbus",
      "channel": "battery-soc"
    }
  }
}

// Hardware config lookup
{

  "id": "battery-soc",
  "signals": {
    "value": 149
  }
}

// Result: Signal ID = 149
```

**Toggle Component:**

```javascript
// Component binding
{
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-09"
    }
  }
}

// Hardware config lookup
{
  "id": "core-09",
  "signals": {
    "toggle": 78,
    "momentary": 77,
    "dimmer": 79
  }
}

// Result: Signal ID = 78 (toggle)
```

**Dimmer Component:**

```javascript
// Component binding<http://172.16.11.7:8888>
{
  "bindings": {
    "intensity": {
      "type": "empirbus",
      "channel": "core-01"
    }
  }
}

// Hardware config lookup
{
  "id": "core-01",
  "signals": {
    "toggle": 15,

    "momentary": 14,
    "dimmer": 16
  }
}

// Result: Toggle ID = 15, Dimmer ID = 16

```

---

## 📝 Implementation Steps

### Step 1: Update Gauge Bindings (5 minutes)

1. Open `garmin-bundle/web/schema.json`
2. Find the Home tab section (around line 430)
3. Update the two gauge components as shown above

4. Save the file

### Step 2: Test on Device (5 minutes)

1. Deploy to device: `cd packages/hmi-ui && pnpm build && ./scripts/deploy-to-web.sh`
2. Access device at <http://172.16.11.7:8888>
3. Verify gauges show real data:
   - Battery SOC should show actual percentage

   - Solar voltage should show actual voltage

### Step 3: Add More Components (Optional - 15 minutes)

1. Add 2-3 more quick controls from recommendations
2. Add 3-4 more status indicators from recommendations
3. Test each component on device

### Step 4: Validate Signal Subscription (5 minutes)

1. Open browser console (F12)
2. Look for WebSocket messages:

   ```
   [WebSocket] Connected to ws://...
   [SignalState] Registered signal: 149 (Battery SOC)
   [SignalState] Registered signal: 153 (Solar Voltage)
   [SignalState] Updated signal 149: { state: { raw: 87 } }
   ```

3. Verify components update when hardware changes

---

## ⚠️ Common Issues & Solutions

### Issue 1: Gauge Shows 0

**Cause:** Static binding or wrong signal ID  
**Solution:** Update binding to use correct hardware channel ID

### Issue 2: Signal Not Updating

**Cause:** WebSocket not subscribed to signal  
**Solution:** Check console for subscription messages, verify signal ID exists in hardware config

### Issue 3: Wrong Units/Range

**Cause:** Min/max values don't match signal range  
**Solution:** Update min/max based on expected signal values

### Issue 4: Component Not Responding

**Cause:** Wrong action type (toggle vs dimmer vs momentary)  
**Solution:** Match component type to hardware control type:

- Toggle component → `control: "toggle-button"`
- Dimmer component → `control: "dimmer"`
- Button component → `control: "push-button"`
- Gauge component → `control: "signal-value"`

---

## 🎯 Next Steps

1. **Fix Critical Bindings** ✅
   - Update Battery SOC gauge
   - Update Solar Voltage gauge

2. **Enhance Quick Controls**
   - Add water pump toggle
   - Add awning controls
   - Add lighting controls

3. **Enhance Status Section**
   - Add battery voltage
   - Add battery current
   - Add tank levels
   - Add AC status

4. **Test Everything**
   - Verify all signals update correctly
   - Check WebSocket subscriptions
   - Validate user interactions

---

**Last Updated:** October 14, 2025  
**Status:** Ready to implement binding fixes
