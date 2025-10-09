# System Architecture: Configurator → HMI UI → EmpirBus Integration

**Date**: October 3, 2025  
**Purpose**: Clarify how all pieces work together

---

## 🎯 The Big Picture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. USER DESIGNS UI                                             │
│     ↓                                                            │
│  [Web Configurator] (http://localhost:3000)                     │
│     - Configure hardware (20 channels)                          │
│     - Design tabs/sections/components                           │
│     - Pick icons, choose theme                                  │
│     - Preview live mockup                                       │
│     ↓                                                            │
│  2. EXPORT PACKAGE                                              │
│     ↓                                                            │
│  [config.zip] Generated                                         │
│     ├── schema.json        ← Complete UI definition            │
│     ├── icons/*.svg        ← Icon files                         │
│     └── README.md          ← Deployment instructions            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT TO DEVICE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  3. DEPLOY FILES TO GARMIN HMI                                  │
│     ↓                                                            │
│  Copy to: /web/                                                 │
│     ├── index1.html        ← HMI UI entry point (our app)      │
│     ├── assets/            ← Our Preact bundle                  │
│     ├── schema.json        ← UI configuration                   │
│     └── icons/             ← Icon assets                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    RUNTIME ON DEVICE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  4. USER LAUNCHES APP                                           │
│     ↓                                                            │
│  [Garmin App Selector] (index.html)                             │
│     - Lists all apps from applications.json                     │
│     - User taps "Digital Switching"                             │
│     - Loads index1.html (our HMI UI)                            │
│     ↓                                                            │
│  5. HMI UI RENDERS                                              │
│     ↓                                                            │
│  [Our Preact App] (index1.html)                                 │
│     - Loads schema.json                                         │
│     - Validates with @gcg/schema                                │
│     - Renders tabs/sections/components dynamically             │
│     - Applies theme colors                                      │
│     - Displays icons                                            │
│     ↓                                                            │
│  6. CONNECTS TO EMPIRBUS                                        │
│     ↓                                                            │
│  [WebSocket] ws://localhost:9000/                               │
│     - Opens WebSocket connection to EmpirBus controller         │
│     - Subscribes to channel state updates                       │
│     - Sends control commands (on/off, dim, etc.)                │
│     ↓                                                            │
│  7. USER INTERACTS                                              │
│     ↓                                                            │
│  Toggle Switch → WebSocket Message → CAN Bus → Physical Relay  │
│  Physical State → CAN Bus → WebSocket → UI Updates             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Three Distinct Packages

### 1. **@gcg/schema** (Validation Library)

**Location**: `packages/schema/`  
**Purpose**: TypeScript/Zod validation library  
**Used by**: Both web-configurator AND hmi-ui

**What it does**:

- Defines the schema structure (tabs, sections, components)
- Validates schema.json at runtime
- Provides TypeScript types
- Zero runtime dependencies (just Zod)

**Not included in deployment** - only used for validation

---

### 2. **@gcg/web-configurator** (Design Tool)

**Location**: `packages/web-configurator/`  
**Purpose**: Browser-based schema authoring tool  
**Framework**: React 18  
**Dev Server**: <http://localhost:3000>

**What it does**:

- Visual UI builder
- Hardware configuration (20 CORE channels or 10 CORE-LITE channels)
- Subsystem setup (Power, HVAC, Plumbing, etc.)
- Theme customization
- Icon picker (28 library + custom upload)
- Live preview mockup
- Export to config.zip

**Output**: `config.zip` containing:

- `schema.json` - Complete UI definition
- `icons/` - All icon files (SVG/PNG/JPG)
- `README.md` - Deployment instructions

**Not deployed to device** - runs on developer's computer only

---

### 3. **@gcg/hmi-ui** (Runtime Renderer)

**Location**: `packages/hmi-ui/`  
**Purpose**: Embedded UI that runs on Garmin HMI device  
**Framework**: Preact 10 + Signals  
**Build Target**: ES2017 (Android 10 WebView / Chrome 83)  
**Dev Server**: <http://localhost:3001>

**What it does**:

- Loads schema.json at runtime
- Dynamically renders UI components
- Connects to EmpirBus via WebSocket
- Handles user interactions
- Updates UI based on real hardware state

**Output**: Built to `/web/` folder:

- `index1.html` - Entry point
- `assets/*.js` - Preact bundle (ES2017)
- `assets/*.css` - Styles

**IS deployed to device** - this is the actual HMI app

---

## 🗂️ Garmin File Structure

### Existing Garmin Files (Don't Modify)

```
/web/
├── index.html                    # App selector (Garmin's, keep as-is)
├── appselector.js                # App selector logic
├── manifest.json                 # App selector manifest
├── garmin/
│   ├── empirbus_config.json      # App selector config
│   └── empirbus_config1.json     # OUR app config (points to index1.html)
└── /configuration/
    └── applications.json         # App registry (lists all apps)
```

**Key Entry in applications.json**:

```json
{
  "identifier": "61d547c0-997b-11f0-9a14-4b36b456914c",
  "displayName": [{ "symbol": "default", "description": "Digital Switching" }],
  "path": "index1.html",  ← Points to OUR app
  "showInApplicationSelector": true
}
```

### Our Files (We Create/Replace)

```
/web/
├── index1.html                   # ← OUR Preact app entry (currently blank)
├── manifest1.json                # ← Our app manifest
├── schema.json                   # ← Generated by configurator
├── assets/                       # ← Our Preact bundle
│   ├── main-[hash].js
│   ├── vendor-[hash].js
│   └── main-[hash].css
└── icons/                        # ← Icons from configurator
    ├── Power.svg
    ├── Lights.svg
    └── custom-1.svg
```

---

## 🔄 Data Flow

### At Design Time (Configurator)

```
User Input → Web Configurator → Schema Validation → Preview
                                        ↓
                                  schema.json
                                        ↓
                                Export to config.zip
```

### At Runtime (HMI UI)

```
Device Boot
    ↓
App Selector (index.html)
    ↓
User taps "Digital Switching"
    ↓
Loads index1.html (our Preact app)
    ↓
Fetch /schema.json
    ↓
Validate with @gcg/schema
    ↓
Render UI Components
    ↓
Open WebSocket ws://localhost:9000
    ↓
Subscribe to channel states
    ↓
╔═══════════════════════════════════╗
║    USER INTERACTION LOOP          ║
╠═══════════════════════════════════╣
║  User taps Toggle                 ║
║      ↓                            ║
║  Send WebSocket message           ║
║  { cmd: "momentary",              ║
║    signalId: 1234,                ║
║    state: 1 }                     ║
║      ↓                            ║
║  EmpirBus Controller              ║
║      ↓                            ║
║  CAN Bus Command                  ║
║      ↓                            ║
║  Physical Relay Activates         ║
║      ↓                            ║
║  State Change on CAN              ║
║      ↓                            ║
║  WebSocket receives update        ║
║  { type: "mfdStatus",             ║
║    signalId: 1234,                ║
║    state: 1 }                     ║
║      ↓                            ║
║  UI updates (toggle shows ON)     ║
╚═══════════════════════════════════╝
```

---

## 🔌 EmpirBus Protocol

### WebSocket Connection

**URL**: `ws://localhost:9000/`  
**Protocol**: JSON messages over WebSocket

### Message Types

#### 1. **Control Commands** (UI → Controller)

**Momentary (Push/Toggle Buttons)**:

```json
{
  "cmd": "momentary",
  "signalId": 1234,
  "state": 1 // 1 = press, 0 = release
}
```

**Dimmer (Sliders)**:

```json
{
  "cmd": "dimmer",
  "signalId": 1234,
  "value": 75 // 0-100%
}
```

#### 2. **State Updates** (Controller → UI)

**Status Broadcast**:

```json
{
  "type": "mfdStatus",
  "signalId": 1234,
  "state": 1, // 0 = off, 1 = on
  "value": 75 // For dimmers/sliders
}
```

### Signal ID Mapping

Each hardware channel has a signal ID:

- Defined in .ebp file (EmpirBus configuration)
- Referenced in schema.json (optional `signalId` field)
- Default: Derived from channel number
- Override: Explicitly set in configurator

Example:

```json
{
  "id": "core-12",
  "channel": 12,
  "signalId": 1234  ← Maps to CAN signal ID
}
```

---

## 🎨 Component Rendering

### Hardware Channel → UI Component Mapping

| Control Type    | UI Component | Width        | Binding            |
| --------------- | ------------ | ------------ | ------------------ |
| `not-used`      | (none)       | -            | -                  |
| `push-button`   | Button       | 3 units      | Momentary          |
| `toggle-button` | Toggle       | 3 units      | Momentary + Listen |
| `slider`        | Dimmer       | 6 units      | Dimmer command     |
| `half-bridge`   | Slider pair  | 6 units each | Bidirectional      |

### Schema → Rendered UI

```json
// schema.json
{
  "hardware": {
    "outputs": [
      {
        "id": "core-12",
        "channel": 12,
        "control": "toggle-button",
        "label": "Galley Lights",
        "icon": "/icons/Light.svg"
      }
    ]
  }
}
```

↓ **HMI UI renders** ↓

```tsx
<Toggle
  label="Galley Lights"
  icon="/icons/Light.svg"
  value={channelState[12]}
  onChange={(on) =>
    sendCommand({
      cmd: 'momentary',
      signalId: 1234,
      state: on ? 1 : 0,
    })
  }
/>
```

---

## 🚀 Deployment Workflow

### Step 1: Design in Configurator

```bash
cd packages/web-configurator
pnpm dev
# Open http://localhost:3000
# Design UI, configure hardware, pick theme
# Click "Generate config.zip"
```

### Step 2: Build HMI UI

```bash
cd packages/hmi-ui
pnpm build
# Output: dist/
```

### Step 3: Deploy to Device

```bash
# Copy HMI UI build
cp -r packages/hmi-ui/dist/* /path/to/device/web/

# Rename entry point
mv /path/to/device/web/index.html /path/to/device/web/index1.html

# Extract config.zip
unzip config.zip -d /path/to/device/web/
```

### Step 4: Restart HMI

```bash
# Device-specific restart command
systemctl restart garmin-hmi
```

### Step 5: Test

1. Open app selector
2. Tap "Digital Switching"
3. UI loads with your custom design
4. Interact with controls
5. Verify hardware responds

---

## 🎯 Current Status

### ✅ Complete

- Schema package with validation
- Web configurator (all 6 subsystems)
- Icon picker system
- Theme customization
- Export page with config.zip generation
- HMI UI basic setup (Step 1)

### 🚧 In Progress

- HMI UI Step 2: Schema loader

### ⏸️ Pending

- HMI UI component rendering
- WebSocket integration
- Testing on actual device

---

## 🔑 Key Insights

### 1. **Two Separate Apps**

- **Configurator** = Design tool (runs on dev machine)
- **HMI UI** = Runtime app (runs on Garmin device)
- They never run at the same time
- Connected only through schema.json file

### 2. **Schema is the Bridge**

- Single source of truth
- Validated at design time AND runtime
- Portable between devices
- Version controlled

### 3. **WebSocket is the Hardware Interface**

- Standard protocol (not Garmin-specific)
- JSON messages (easy to work with)
- Bidirectional (send commands, receive updates)
- Local connection (ws://localhost:9000)

### 4. **ES2017 is Critical**

- Android 10 WebView = Chrome 83
- Chrome 83 = ES2017 only
- No modern syntax allowed
- Must transpile everything

### 5. **File Structure Matters**

- index1.html is the entry point (hardcoded in applications.json)
- schema.json must be at /web/schema.json
- Icons must be in /web/icons/
- Don't touch Garmin's existing files

---

## ❓ Questions Answered

**Q: Where does the configurator run?**  
A: On a developer's computer (localhost:3000). Never on the device.

**Q: Where does the HMI UI run?**  
A: On the Garmin HMI device (Android 10 tablet).

**Q: How do they communicate?**  
A: They don't! Configurator exports schema.json, HMI UI loads it.

**Q: What's the WebSocket for?**  
A: HMI UI ↔ EmpirBus Controller communication (hardware control).

**Q: Can I test HMI UI without hardware?**  
A: Yes! We'll build a mock WebSocket adapter for development.

**Q: What happens to index1.html?**  
A: We replace it with our Preact build output.

**Q: How does the device know to load our app?**  
A: applications.json points to index1.html.

**Q: Can I have multiple custom UIs?**  
A: Yes! Use index2.html, index3.html (up to index9.html).

---

## 🎉 Summary

We have **THREE distinct pieces**:

1. **@gcg/schema** - Validation library (shared)
2. **@gcg/web-configurator** - Design tool (dev only)
3. **@gcg/hmi-ui** - Runtime renderer (deployed to device)

They work together through **schema.json** as the contract.

The HMI UI connects to hardware via **WebSocket** and renders UI dynamically based on the schema.

Everything is now clear! Ready to continue with Step 2? 🚀
