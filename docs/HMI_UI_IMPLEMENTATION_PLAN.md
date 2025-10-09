# HMI UI Implementation Plan

**Date**: October 3, 2025  
**Package**: `@gcg/hmi-ui`  
**Framework**: Preact 10 + Signals  
**Target**: ES2017 (Android 10 WebView / Chrome 83)

---

## 🎯 Goal

Build a lightweight Preact application that:

1. Loads a schema.json file at runtime
2. Renders UI components dynamically based on the schema
3. Binds components to EmpirBus/NMEA2000 data sources
4. Deploys to `/web/index1.html` for Garmin HMI devices

---

## 📋 Implementation Strategy

### Methodical Approach

- **Small steps**: One feature at a time
- **Test early**: Verify each step works before moving on
- **ES2017 strict**: No modern syntax (no `?.`, `??`, etc.)
- **Dev server**: Test in browser, then verify on device

---

## 🏗️ Step-by-Step Build Plan

### Step 1: Project Setup & Entry Point ⏸️

**Goal**: Get a basic Preact app rendering "Hello World"

**Tasks**:

- [ ] Create `src/` directory structure
- [ ] Create `index.html` entry point
- [ ] Create `main.tsx` (Preact bootstrap)
- [ ] Create minimal `App.tsx`
- [ ] Configure `vite.config.ts` (ES2017 target)
- [ ] Add dev server script
- [ ] Test: See "Hello World" at localhost

**Files to create**:

- `src/main.tsx`
- `src/App.tsx`
- `index.html`
- `vite.config.ts`

**Exit criteria**: Dev server runs, renders basic component

---

### Step 2: Schema Loader ⏸️

**Goal**: Load and parse schema.json at runtime

**Tasks**:

- [ ] Create `utils/schema-loader.ts`
- [ ] Fetch schema from `/schema.json` or hardcoded path
- [ ] Validate with `@gcg/schema`
- [ ] Handle loading/error states
- [ ] Store schema in signal
- [ ] Test: Display schema metadata on screen

**Files to create**:

- `src/utils/schema-loader.ts`
- `src/state/schema-signal.ts`

**Exit criteria**: Schema loads and validates successfully

---

### Step 3: Component Factory (Basic) ⏸️

**Goal**: Render a single component type (Toggle)

**Tasks**:

- [ ] Create `components/factory.ts`
- [ ] Create `components/Toggle.tsx` (basic UI only)
- [ ] Map schema component → Preact component
- [ ] Render first tab/section/component
- [ ] Test: See a toggle switch on screen

**Files to create**:

- `src/components/factory.ts`
- `src/components/Toggle.tsx`
- `src/components/ComponentRenderer.tsx`

**Exit criteria**: One toggle component renders from schema

---

### Step 4: Layout System ⏸️

**Goal**: Render full tab/section structure

**Tasks**:

- [ ] Create `components/Tab.tsx`
- [ ] Create `components/Section.tsx`
- [ ] Create `components/TabBar.tsx`
- [ ] Layout tabs horizontally
- [ ] Layout sections in grid
- [ ] Handle tab switching
- [ ] Test: Navigate between tabs

**Files to create**:

- `src/components/Tab.tsx`
- `src/components/Section.tsx`
- `src/components/TabBar.tsx`

**Exit criteria**: Multi-tab layout works, can switch tabs

---

### Step 5: All Component Types ⏸️

**Goal**: Implement remaining 5 component types

**Tasks**:

- [ ] Create `components/Button.tsx`
- [ ] Create `components/Dimmer.tsx`
- [ ] Create `components/Gauge.tsx`
- [ ] Create `components/Indicator.tsx`
- [ ] Create `components/Slider.tsx`
- [ ] Update factory to handle all types
- [ ] Test: Each component renders correctly

**Files to create**: 5 component files

**Exit criteria**: All 6 component types render from schema

---

### Step 6: Static Bindings ⏸️

**Goal**: Display static data (simplest binding type)

**Tasks**:

- [ ] Create `state/bindings.ts`
- [ ] Handle `type: "static"` bindings
- [ ] Display static values in components
- [ ] Test: Toggle shows static on/off state

**Files to create**:

- `src/state/bindings.ts`

**Exit criteria**: Static bindings work for all component types

---

### Step 7: Mock EmpirBus Adapter ⏸️

**Goal**: Simulate EmpirBus data without real hardware

**Tasks**:

- [ ] Create `adapters/empirbus-mock.ts`
- [ ] Mock channel states (on/off, values)
- [ ] Update bindings to read mock data
- [ ] Add dev UI to change mock values
- [ ] Test: Components update when mock data changes

**Files to create**:

- `src/adapters/empirbus-mock.ts`
- `src/adapters/types.ts`

**Exit criteria**: Components respond to mock EmpirBus data

---

### Step 8: Styling & Theme ⏸️

**Goal**: Apply theme colors from schema

**Tasks**:

- [ ] Create base CSS variables
- [ ] Read `schema.theme` configuration
- [ ] Apply primary/secondary/accent colors
- [ ] Style all 6 component types
- [ ] Responsive layout (7" tablet)
- [ ] Test: Theme changes take effect

**Files to create**:

- `src/styles/variables.css`
- `src/styles/components.css`
- `src/utils/theme-loader.ts`

**Exit criteria**: UI looks professional with theme applied

---

### Step 9: Icon Support ⏸️

**Goal**: Display icons on buttons/toggles

**Tasks**:

- [ ] Create `components/Icon.tsx`
- [ ] Load icons from `/icons/` folder
- [ ] Support SVG, PNG, JPG
- [ ] Handle icon references in schema
- [ ] Test: Icons appear on components

**Files to create**:

- `src/components/Icon.tsx`

**Exit criteria**: Icons render on components

---

### Step 10: Real EmpirBus Integration ⏸️

**Goal**: Connect to actual EmpirBus WebSocket

**Tasks**:

- [ ] Create `adapters/empirbus.ts`
- [ ] WebSocket connection to EmpirBus
- [ ] Parse channel state messages
- [ ] Send control commands (on/off, set value)
- [ ] Handle reconnection
- [ ] Test: Real hardware interaction

**Files to create**:

- `src/adapters/empirbus.ts`
- `src/adapters/websocket.ts`

**Exit criteria**: Works on real Garmin HMI device

---

### Step 11: Production Build ⏸️

**Goal**: Build for deployment to HMI device

**Tasks**:

- [ ] Configure Vite for ES2017 output
- [ ] Optimize bundle size
- [ ] Test on Android 10 WebView
- [ ] Create deployment instructions
- [ ] Build to `/web/` folder structure

**Exit criteria**: Runs on target hardware without errors

---

## 🎬 Immediate Next Step

**Start with Step 1: Project Setup & Entry Point**

This will:

1. Create the basic Preact app structure
2. Set up the dev server
3. Get "Hello World" rendering
4. Verify ES2017 transpilation works

---

## 📝 Notes

### Critical Constraints

- ❌ No optional chaining (`?.`)
- ❌ No nullish coalescing (`??`)
- ❌ No dynamic imports
- ✅ async/await is OK (ES2017)
- ✅ Must transpile to ES2017

### Testing Strategy

- Test in browser first (faster iteration)
- Verify on Android emulator (Chrome 83)
- Final test on actual Garmin hardware

### File Structure Preview

```
packages/hmi-ui/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component
│   ├── components/
│   │   ├── factory.ts              # Component factory
│   │   ├── Toggle.tsx
│   │   ├── Button.tsx
│   │   ├── Dimmer.tsx
│   │   ├── Gauge.tsx
│   │   ├── Indicator.tsx
│   │   ├── Slider.tsx
│   │   ├── Tab.tsx
│   │   ├── Section.tsx
│   │   ├── TabBar.tsx
│   │   └── Icon.tsx
│   ├── state/
│   │   ├── schema-signal.ts        # Schema state
│   │   └── bindings.ts             # Data bindings
│   ├── adapters/
│   │   ├── types.ts                # Adapter interfaces
│   │   ├── empirbus-mock.ts        # Development mock
│   │   ├── empirbus.ts             # Real WebSocket
│   │   └── websocket.ts            # WS utilities
│   ├── utils/
│   │   ├── schema-loader.ts        # Load & validate
│   │   └── theme-loader.ts         # Apply theme
│   └── styles/
│       ├── variables.css           # CSS vars
│       └── components.css          # Component styles
├── index.html
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## ✅ Ready to Start?

Let's begin with **Step 1: Project Setup & Entry Point**!
