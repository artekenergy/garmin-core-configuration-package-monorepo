# System Architecture and Deployment Flow

**Complete End-to-End Guide: From Schema to Garmin Display**

**Last Updated**: October 8, 2025

---

## 🎯 The Big Picture

This system replaces Garmin's locked-down graphics editor with a flexible, version-controlled workflow:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          OLD GARMIN WORKFLOW                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  System XML → Garmin Online Editor → .ebp Bundle → Upload to Display  │
│                                                                         │
│  ❌ Locked into Garmin's UI patterns                                   │
│  ❌ No version control                                                 │
│  ❌ Limited customization                                              │
│  ❌ Can't maintain across installations                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          NEW GCG WORKFLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Configure System (Web Configurator)                                │
│     ├─ Power Systems (DC charging, AC legs, shore power)              │
│     ├─ HVAC (zones, units, cooling/heating)                           │
│     ├─ Lighting (zones, fixtures, dimmers)                            │
│     ├─ Hardware Outputs (Core/Genesis boards, channels)               │
│     └─ UI Layout (tabs, sections, components)                         │
│         ↓                                                              │
│  2. Generate Schema (JSON + Icons)                                     │
│     └─ schema.json: Complete UI definition with bindings              │
│         ↓                                                              │
│  3. Build HMI UI (Preact App)                                          │
│     ├─ Transpile to ES2017 (WebView 83 compatible)                    │
│     ├─ Bundle: index.js, vendor.js, signals.js                        │
│     └─ Styles: index.css                                              │
│         ↓                                                              │
│  4. Package Deployment (ZIP)                                           │
│     ├─ web/index1.html (HMI UI entry point)                           │
│     ├─ web/hmi-assets/ (JS/CSS bundles)                               │
│     ├─ web/schema.json (your configuration)                           │
│     ├─ web/icons/ (SVG icon library)                                  │
│     └─ [all other Garmin web assets]                                  │
│         ↓                                                              │
│  5. Create .ebp Package (EmpirBus format)                              │
│     └─ [Currently manual - uses Garmin tools]                         │
│         ↓                                                              │
│  6. Upload to Garmin Display                                           │
│     └─ Display loads index1.html → Renders your custom UI             │
│                                                                         │
│  ✅ Full UI control                                                    │
│  ✅ Git-versioned schemas                                              │
│  ✅ Reusable templates                                                 │
│  ✅ Live preview before deployment                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 The Three Core Packages

### 1. **@gcg/schema** - TypeScript Type Definitions

**Location**: `/packages/schema/`

**Purpose**: Shared TypeScript types and validation for the UI schema.

**What it contains**:

- Type definitions for all UI components (Toggle, Button, Indicator, Gauge, etc.)
- Schema structure types (Tabs, Sections, Bindings)
- Hardware configuration types (Outputs, Channels, Signal Mappings)
- JSON Schema validation

**How it's used**:

```typescript
// In web-configurator:
import type { UISchema, ToggleComponent } from '@gcg/schema';

// In hmi-ui:
import type { Component } from '@gcg/schema';
import { validateSchema } from '@gcg/schema';
```

**Key files**:

- `src/types.ts` - All TypeScript interfaces
- `src/validation.ts` - JSON Schema validation
- `src/index.ts` - Public exports

---

### 2. **@gcg/web-configurator** - Configuration Builder

**Location**: `/packages/web-configurator/`

**Purpose**: Web app for creating and editing HMI configurations (runs at localhost:3000)

**What it does**:

1. **System Configuration**:
   - Power systems (DC charging, AC distribution, shore power)
   - HVAC zones and equipment
   - Lighting zones and fixtures
   - Hardware outputs (Core/Genesis boards, channel assignments)

2. **UI Layout Editor**:
   - Create tabs (Home, Power, HVAC, Lighting, etc.)
   - Add sections to tabs
   - Place UI components (toggles, buttons, indicators, gauges)
   - Configure bindings (link UI to hardware channels)

3. **Icon Management**:
   - Library of 28+ pre-loaded SVG icons
   - Custom icon upload support
   - Visual picker interface
   - Icon assignment to buttons/toggles

4. **Export & Package**:
   - Validate complete schema
   - Generate `schema.json` with all configuration
   - Fetch complete deployment package (web assets, services, etc.)
   - Bundle everything into `config.zip`
   - Download ready-to-deploy package

**Key files**:

- `src/pages/ExportPage.tsx` - Package compilation and download
- `src/context/SchemaContext.tsx` - Global schema state
- `src/components/IconPickerModal.tsx` - Icon selection UI
- `public/icons/` - SVG icon library (copied to deployment package)

**Tech stack**:

- React 18
- React Router
- TypeScript
- Vite

---

### 3. **@gcg/hmi-ui** - Embedded UI Renderer

**Location**: `/packages/hmi-ui/`

**Purpose**: Lightweight Preact app that runs ON the Garmin display (the actual HMI interface)

**What it does**:

1. **Runtime Schema Loading**:

   ```typescript
   // On startup:
   fetch('/schema.json')
     .then((schema) => validateSchema(schema))
     .then((schema) => renderUI(schema));
   ```

2. **Dynamic Component Rendering**:
   - Reads schema tabs/sections/components
   - Maps component types to Preact components
   - Resolves bindings to hardware channels
   - Subscribes to signal state changes

3. **Component Library**:
   - **Toggle**: Binary on/off switches (lights, pumps, fans)
   - **Button**: Momentary push buttons (start generators, open doors)
   - **Indicator**: Status LEDs and badges (battery state, errors)
   - **Gauge**: Circular/linear/numeric displays (tank levels, voltage)
   - **Dimmer**: Brightness sliders (lighting control)
   - **Slider**: Generic value controls

4. **State Management** (Preact Signals):
   - Schema signal: Loaded configuration
   - Signal states: Hardware channel values (Type 16 Cmd 1 toggle states, etc.)
   - Reactive updates: UI automatically reflects hardware changes

5. **WebSocket Communication** (Phase 6 - Not Yet Implemented):
   - Connect to EmpirBus WebSocket server
   - Send commands: User clicks toggle → WebSocket → Hardware channel
   - Receive updates: Hardware state change → WebSocket → Update UI

**Critical Constraints**:

The Garmin display uses **Android 10 WebView (Chrome 83)**, which only supports **ES2017**:

```typescript
// ❌ FORBIDDEN SYNTAX (won't run on device):
const value = obj?.property          // Optional chaining
const result = value ?? 'default'    // Nullish coalescing
import('./module.js')                // Dynamic imports

// ✅ ALLOWED SYNTAX (ES2017):
const value = obj && obj.property
const result = value !== null && value !== undefined ? value : 'default'
async function loadModule() { ... }
```

**Build Configuration**:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2017', // ← CRITICAL
    minify: 'terser',
    terserOptions: {
      ecma: 2017, // ← CRITICAL
    },
  },
});
```

**Key files**:

- `src/App.tsx` - Main application entry
- `src/components/ComponentRenderer.tsx` - Type → Component mapper
- `src/components/Toggle.tsx`, `Button.tsx`, etc. - UI components
- `src/utils/schema-loader.ts` - Schema fetching and validation
- `src/state/schema-signal.ts` - Reactive schema state
- `src/state/signal-state.ts` - Hardware signal state
- `public/new-hmi-configuration-schema-2.json` - Dev/test schema

**Tech stack**:

- Preact 10 (3KB React alternative)
- @preact/signals (reactive state)
- TypeScript
- Vite (build tool)

---

## 🔄 The Complete Data Flow

### Phase 1: Configuration Creation

**User interacts with Web Configurator** (localhost:3000):

```
┌─────────────────────────────────────────────────────────────┐
│  Web Configurator UI                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Power Page                                              │
│     └─ Enable DC Charging (2nd alternator)                 │
│     └─ Enable Shore Power                                  │
│     └─ Configure 2 AC Legs                                 │
│         ↓                                                   │
│     Creates schema.power = {                               │
│       dcCharging: { secondAlternator: true },              │
│       acLegs: 2,                                           │
│       shorePower: { enabled: true }                        │
│     }                                                       │
│                                                             │
│  2. Hardware Page                                           │
│     └─ Add Core Board (24 outputs)                         │
│     └─ Assign Channel 1: "Saloon Lights" (toggle-button)  │
│     └─ Pick icon: /icons/Light.svg                         │
│         ↓                                                   │
│     Creates schema.hardware.outputs = [{                   │
│       id: "core-01",                                       │
│       source: "core",                                      │
│       channel: 1,                                          │
│       control: "toggle-button",                            │
│       label: "Saloon Lights",                              │
│       icon: "/icons/Light.svg",                            │
│       signals: { toggle: 3841 }  // Type 16 Cmd 1         │
│     }]                                                      │
│                                                             │
│  3. UI Layout Page                                          │
│     └─ Create "Home" tab                                   │
│     └─ Add "Lighting" section                              │
│     └─ Place Toggle component                              │
│     └─ Bind to core-01 channel                             │
│         ↓                                                   │
│     Creates schema.tabs = [{                               │
│       id: "home",                                          │
│       label: "Home",                                       │
│       sections: [{                                         │
│         id: "lighting",                                    │
│         label: "Lighting",                                 │
│         components: [{                                     │
│           type: "toggle",                                  │
│           label: "Saloon Lights",                          │
│           icon: "light-icon-id",                           │
│           bindings: {                                      │
│             state: { type: "empirbus", id: "core-01" }    │
│           }                                                 │
│         }]                                                  │
│       }]                                                    │
│     }]                                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 2: Export & Package

**User clicks "Compile & Download Package"** on Export page:

```typescript
// ExportPage.tsx implementation:

async function handleCompilePackage() {
  const zip = new JSZip();

  // 1. Enhance schema with signal mappings
  const hwConfig = await fetch('/deployment-package/configuration/hardware-config.json');
  const enhancedSchema = mergeSignalMappings(schema, hwConfig);
  const schemaJson = JSON.stringify(enhancedSchema, null, 2);

  // 2. Fetch complete deployment package
  const manifest = await fetch('/deployment-package/manifest.json');
  const files = manifest.files; // ~200+ files

  for (const file of files) {
    const content = await fetch(`/deployment-package/${file}`);
    zip.file(file, content); // Creates nested folder structure
  }

  // 3. Overwrite web/schema.json with user's configuration
  zip.file('web/schema.json', schemaJson);

  // 4. Generate downloadable ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadFile(blob, 'hmi-configuration.zip');
}
```

**What's in the deployment package**:

```
config.zip (downloaded)
├── web/
│   ├── index1.html               ← HMI UI entry point (built Preact app)
│   ├── hmi-assets/
│   │   ├── index-[hash].js      ← Main application bundle (~50KB)
│   │   ├── vendor-[hash].js     ← Preact framework (~5KB)
│   │   ├── signals-[hash].js    ← Signals library (~3KB)
│   │   └── index-[hash].css     ← Compiled styles (~10KB)
│   ├── schema.json               ← YOUR CONFIGURATION ⭐
│   ├── icons/                    ← SVG icon library (28+ icons)
│   │   ├── Light.svg
│   │   ├── Power.svg
│   │   ├── Fan.svg
│   │   └── ... (all library icons)
│   ├── index.html                ← Original Garmin UI (untouched)
│   ├── index2.html               ← Other displays (untouched)
│   ├── garmin/                   ← Garmin original assets
│   ├── fonts/
│   ├── images/
│   └── ... (all original Garmin web files)
├── configuration/
│   ├── hardware-config.json      ← Signal mappings
│   ├── channel-mapping.json      ← EmpirBus channel definitions
│   └── applications.json         ← System apps config
└── services/
    └── websocket-server.service  ← Systemd service (future WebSocket)
```

---

### Phase 3: Build & Deploy HMI UI

**When you run** `pnpm build` **in** `/packages/hmi-ui/`:

```bash
# Build process:
pnpm build
  ↓
1. TypeScript compilation (tsc)
   ├─ Check types
   ├─ Ensure ES2017 compatibility
   └─ Catch forbidden syntax (optional chaining, etc.)
      ↓
2. Vite bundling
   ├─ Tree-shake unused code
   ├─ Split chunks: vendor.js, signals.js, index.js
   ├─ Minify with Terser (ecma: 2017)
   ├─ Remove console.logs
   ├─ Hash filenames for cache busting
   └─ Generate index.html with correct asset paths
      ↓
3. Output to dist/
   ├── index.html
   ├── assets/
   │   ├── index-BF_2jC_A.js     (50KB, ES2017)
   │   ├── vendor-azMIOUfB.js    (5KB, Preact)
   │   ├── signals-CIKrY_cu.js   (3KB, @preact/signals)
   │   └── index-B5XhJmhx.css    (10KB, compiled styles)
   └── schema.json               (test schema for dev)
```

**Bundle size**: ~68KB total (~20KB gzipped) - extremely lightweight!

---

### Phase 4: The Schema File

**The schema.json is the heart of the system**. Here's what it contains:

```json
{
  "schemaVersion": "0.1.0",

  "metadata": {
    "name": "Yacht HMI Configuration",
    "version": "1.0.0",
    "author": "Marine Installer Inc",
    "created": "2025-10-08T00:00:00.000Z",
    "description": "Custom HMI for 45ft sailing yacht"
  },

  "hardware": {
    "systemType": "core",
    "outputs": [
      {
        "id": "core-01",              // Unique identifier
        "source": "core",             // Board type (core/genesis)
        "channel": 1,                 // Physical output channel
        "control": "toggle-button",   // UI control type
        "label": "Saloon Lights",     // Display name
        "icon": "/icons/Light.svg",   // Icon reference
        "signals": {
          "toggle": 3841              // Type 16, Cmd 1, Channel 1
        }
      }
      // ... 23 more channels
    ]
  },

  "power": {
    "dcCharging": { ... },
    "acLegs": 2,
    "shorePower": { ... }
  },

  "hvac": { ... },
  "lighting": { ... },

  "tabs": [
    {
      "id": "home",
      "label": "Home",
      "icon": "home-icon-id",
      "sections": [
        {
          "id": "quick-controls",
          "label": "Quick Controls",
          "layout": "grid",
          "columns": 4,
          "components": [
            {
              "type": "toggle",              // Component type
              "id": "comp-saloon-lights",    // Unique ID
              "label": "Saloon Lights",      // Display text
              "icon": "light-icon-id",       // Icon reference
              "variant": "round",            // Style variant
              "bindings": {
                "state": {
                  "type": "empirbus",        // Binding type
                  "id": "core-01"            // Links to hardware.outputs
                }
              }
            }
            // ... more components
          ]
        }
      ]
    }
  ],

  "icons": [
    {
      "id": "light-icon-id",
      "name": "Light",
      "data": "<svg>...</svg>"    // Inline SVG data
    }
  ]
}
```

**Key concepts**:

1. **Hardware Outputs** define the physical channels (Core/Genesis boards)
2. **UI Components** reference outputs via **bindings**
3. **Bindings** link UI to hardware:
   ```typescript
   bindings: {
     state: { type: "empirbus", id: "core-01" }
   }
   // This tells the toggle: "Your state comes from core-01 channel"
   ```
4. **Signal IDs** map to EmpirBus protocol:
   - Type 16, Cmd 1 = Toggle state (on/off)
   - Channel 1 = 3841 (calculated signal ID)

---

### Phase 5: Runtime Execution on Garmin Display

**When the display boots and loads** `index1.html`:

```typescript
// 1. App.tsx - Application Entry Point
import { loadSchema } from './utils/schema-loader';

function App() {
  useEffect(() => {
    loadSchema(); // Fetch /schema.json on startup
  }, []);

  // Wait for schema to load
  if (isLoading.value) return <LoadingSpinner />;
  if (error.value) return <ErrorScreen error={error.value} />;

  // Render tabs from schema
  return <TabNavigation tabs={schemaSignal.value.tabs} />;
}

// 2. schema-loader.ts - Fetch and Validate Schema
export async function loadSchema() {
  isLoadingSignal.value = true;

  try {
    // Fetch schema from /schema.json
    const response = await fetch('/new-hmi-configuration-schema-2.json');
    const data = await response.json();

    // Validate against TypeScript schema
    const validation = validateSchema(data);
    if (!validation.success) {
      throw new Error('Schema validation failed');
    }

    // Store in reactive signal
    schemaSignal.value = data;

    // Auto-subscribe to all bindings
    setupAutoSubscription(data);

    isLoadingSignal.value = false;
  } catch (err) {
    errorSignal.value = err.message;
  }
}

// 3. ComponentRenderer.tsx - Map Schema to Components
export function ComponentRenderer({ component }) {
  switch (component.type) {
    case 'toggle':
      return <Toggle component={component} />;
    case 'button':
      return <Button component={component} />;
    case 'indicator':
      return <Indicator component={component} />;
    case 'gauge':
      return <Gauge component={component} />;
    // ... more types
  }
}

// 4. Toggle.tsx - Render Toggle Component
export function Toggle({ component }) {
  // Resolve binding to channel ID
  const signalId = resolveBindingToChannelId(component.bindings.state);
  // signalId = 3841 (from hardware.outputs.signals.toggle)

  // Subscribe to signal state
  const signalState = getSignalState(signalId);

  // Compute current state
  const isOn = useComputed(() => {
    return signalState.value?.state || false;
  });

  // Render with current state
  return (
    <button
      className={isOn.value ? 'toggle-on' : 'toggle-off'}
      onClick={() => sendToggleCommand(signalId)}
    >
      {component.label}
    </button>
  );
}

// 5. binding-resolver.ts - Link UI to Hardware
export function resolveBindingToChannelId(binding) {
  if (binding.type === 'empirbus') {
    // Look up output in schema.hardware.outputs
    const output = schemaSignal.value.hardware.outputs.find(
      o => o.id === binding.id
    );
    // Return the signal ID
    return output.signals.toggle; // 3841
  }
  return null;
}

// 6. signal-state.ts - Hardware State Management
const signalStates = new Map<number, Signal<ToggleState>>();

export function getSignalState(signalId: number) {
  if (!signalStates.has(signalId)) {
    // Create reactive signal for this channel
    signalStates.set(signalId, signal({ state: false }));
  }
  return signalStates.get(signalId);
}

// Future (Phase 6): WebSocket updates
websocket.on('message', (data) => {
  const { signalId, state } = data;
  const signal = getSignalState(signalId);
  signal.value = { state }; // ← Triggers reactive UI update!
});
```

**The magic**:

1. Schema loads from `/schema.json`
2. Bindings resolve to signal IDs (e.g., 3841 for core-01 toggle)
3. Components subscribe to signal state
4. When state changes (WebSocket in future), UI automatically updates
5. User interactions send commands back to hardware (WebSocket in future)

---

## 🔌 The Missing Piece: WebSocket Communication

**Current state**: HMI UI renders components but doesn't communicate with hardware.

**Phase 6 (Future)**: Implement WebSocket adapter to connect UI to EmpirBus controller.

### How it will work:

```typescript
// websocket-adapter.ts (future implementation)

const ws = new WebSocket('ws://localhost:9001');

// Send command when user clicks toggle
export function sendToggleCommand(signalId: number, state: boolean) {
  ws.send(
    JSON.stringify({
      type: 'command',
      signalId: signalId, // 3841 (Type 16, Cmd 1, Ch 1)
      value: state, // true/false
    })
  );
}

// Receive state updates from hardware
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'state-update') {
    const signal = getSignalState(data.signalId);
    signal.value = { state: data.value };
    // ↑ This automatically updates all UI components
    //   subscribed to this signal!
  }
};
```

**Required backend** (runs on Garmin display):

```
/services/websocket-server.service (systemd service)
  ↓
Node.js WebSocket Server (port 9001)
  ├─ Listens for UI commands
  ├─ Translates to EmpirBus protocol
  ├─ Sends to hardware controller
  ├─ Receives hardware state updates
  └─ Broadcasts to connected UIs
```

---

## 📊 Component Type Reference

### Current Implementation Status:

| Component     | Status             | Purpose                | Example                      |
| ------------- | ------------------ | ---------------------- | ---------------------------- |
| **Toggle**    | ✅ Working         | Binary on/off controls | Lights, pumps, fans          |
| **Button**    | ✅ Working         | Momentary actions      | Start generator, open door   |
| **Indicator** | 🔧 Needs Fix       | Status displays        | Battery charging, fault LEDs |
| **Gauge**     | 🔧 Needs Review    | Value displays         | Tank levels, voltage, temp   |
| **Dimmer**    | ✅ Working         | Brightness control     | Lighting zones               |
| **Slider**    | ⏸️ Not Implemented | Generic value control  | Volume, flow rate            |

### Component Variants:

```typescript
// Toggle variants:
variant: 'round'; // 100px circular button (icon OR text)
variant: 'switch'; // Standard toggle switch

// Indicator variants:
variant: 'led'; // Simple status light (green/yellow/red)
variant: 'badge'; // Status with text label

// Gauge variants:
variant: 'circular'; // Round dial (fuel gauge style)
variant: 'linear'; // Horizontal bar (tank level)
variant: 'numeric'; // Just the number value
```

---

## 🎨 Current Development Focus

You're currently working on **refining the HMI UI components** to match the web-configurator styling:

### Completed:

- ✅ Round buttons: 100px size, blue inactive/white active colors
- ✅ Icon system: Inline SVG with `currentColor` inheritance
- ✅ Icon OR text rendering (mutually exclusive)
- ✅ Schema switched to `new-hmi-configuration-schema-2.json`

### In Progress:

- 🔧 **Indicator component**: Added to schema but not rendering
  - Issue: ComponentRenderer was hardcoding `value={false}`
  - Fix: Removed hardcoded value prop
  - Next: Verify indicators appear and review styling

### Next Steps:

1. Fix indicators (just completed)
2. Review Gauge component (3 variants)
3. Implement Slider component
4. Color scheme alignment with design spec
5. Touch target sizing for mobile use

---

## 🚀 Deployment Checklist

When you're ready to deploy to the actual Garmin display:

### 1. Build HMI UI

```bash
cd packages/hmi-ui
pnpm build
# Output: dist/ folder with ES2017-compatible bundles
```

### 2. Export Configuration

1. Open web configurator: `http://localhost:3000`
2. Configure your complete system
3. Go to Export page
4. Click "Compile & Download Package"
5. Extract `config.zip`

### 3. Verify Package Contents

```bash
unzip config.zip
ls -la web/
# Should see:
# - index1.html (HMI UI entry)
# - hmi-assets/ (JS/CSS bundles)
# - schema.json (your config)
# - icons/ (SVG library)
```

### 4. Create .ebp Package

Use Garmin/EmpirBus tools to package the `web/` directory into `.ebp` format.
(This step is manufacturer-specific and requires their tooling)

### 5. Upload to Display

Upload the `.ebp` file to the Garmin display via USB or network.

### 6. Test on Device

Navigate to the HMI menu and verify:

- UI loads without errors
- Components render correctly
- Touch interactions work
- (Future) WebSocket connects and hardware responds

---

## 📝 Key Takeaways

1. **Schema is King**: Everything is driven by `schema.json` - it's the single source of truth

2. **Three Packages, One System**:
   - **schema**: Types and validation (shared library)
   - **web-configurator**: Build the schema (development tool)
   - **hmi-ui**: Render the schema (production runtime)

3. **Bindings Connect Everything**: Components link to hardware via bindings:

   ```json
   { "type": "empirbus", "id": "core-01" } → hardware.outputs → signals.toggle → 3841
   ```

4. **ES2017 is Critical**: The Garmin display only supports ES2017 - no modern syntax!

5. **Reactive by Design**: Preact signals ensure UI automatically updates when state changes

6. **Icon System**: Icons stored as inline SVG in schema, rendered with `currentColor` for theme support

7. **Future WebSocket**: Phase 6 will add real hardware communication (currently local state only)

---

**Questions or need clarification on any part of the flow?** This is a complex system with many moving parts!
