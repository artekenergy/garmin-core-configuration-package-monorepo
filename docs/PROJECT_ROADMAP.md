# Garmin Core Graphics Configurator - Project Roadmap

## 📅 Created: October 2, 2025

## 🎯 Project Goal
Build a schema-driven system for customizing Garmin EmpirBus HMI device UIs without being locked into Garmin's stock graphics pipeline.

---

## 📁 Current State Audit

### Existing Files (from Garmin)
```
core_v2_9-30-25_v1/
├── core-v2_9-30-25_v1.ebp          # System config (Connect 50 v2, 29 channels)
├── configuration/
│   └── applications.json            # App registry (4 apps defined)
├── services/                        # Service definition files
├── web/
│   ├── index.html                   # Main app selector (working)
│   ├── index1.html                  # ⚠️ BLANK - Our HMI UI target
│   ├── manifest1.json               # Points to index1.html
│   ├── garmin/
│   │   └── empirbus_config1.json    # Links to index1.html
│   ├── images/                      # Icons and assets
│   ├── locales/                     # i18n files
│   └── css/                         # Styling
```

### Key Constraints
- **Target WebView**: Android 10 / Chrome 83
- **JavaScript Target**: ES2017 (no modern syntax unless transpiled)
- **Entry Point**: `index1.html` (currently empty)
- **App ID**: `61d547c0-997b-11f0-9a14-4b36b456914c`
- **Display Name**: "Digital Switching"

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MONOREPO STRUCTURE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  packages/                                                   │
│  ├── schema/           (@gcg/schema)                        │
│  │   ├── src/                                               │
│  │   │   ├── schema.json      # JSON Schema definition     │
│  │   │   ├── validator.ts     # Zod validation logic       │
│  │   │   ├── types.ts         # TypeScript types           │
│  │   │   └── index.ts         # Public API                 │
│  │   ├── tests/                                             │
│  │   │   ├── validator.test.ts                             │
│  │   │   └── fixtures/         # Test schemas              │
│  │   ├── package.json                                       │
│  │   └── tsconfig.json                                      │
│  │                                                           │
│  ├── web-configurator/  (React)                            │
│  │   ├── src/                                               │
│  │   │   ├── App.tsx           # Main shell                │
│  │   │   ├── pages/                                         │
│  │   │   │   ├── Editor.tsx    # Schema authoring          │
│  │   │   │   ├── Preview.tsx   # Live preview              │
│  │   │   │   └── Export.tsx    # ZIP generator             │
│  │   │   ├── components/                                    │
│  │   │   │   ├── TabEditor.tsx                             │
│  │   │   │   ├── ComponentEditor.tsx                       │
│  │   │   │   └── ValidationDisplay.tsx                     │
│  │   │   └── main.tsx                                       │
│  │   ├── package.json                                       │
│  │   ├── vite.config.ts                                     │
│  │   └── tsconfig.json                                      │
│  │                                                           │
│  └── hmi-ui/           (Preact + Signals)                  │
│      ├── src/                                               │
│      │   ├── main.tsx          # Entry point               │
│      │   ├── App.tsx           # Root component            │
│      │   ├── components/                                    │
│      │   │   ├── factory.ts    # Component factory         │
│      │   │   ├── Toggle.tsx                                │
│      │   │   ├── Button.tsx                                │
│      │   │   ├── Dimmer.tsx                                │
│      │   │   └── Gauge.tsx                                 │
│      │   ├── state/                                         │
│      │   │   └── signals.ts    # Global state              │
│      │   ├── adapters/                                      │
│      │   │   └── bindings.ts   # EmpirBus/NMEA adapter     │
│      │   └── utils/                                         │
│      │       └── schema-loader.ts                          │
│      ├── package.json                                       │
│      ├── vite.config.ts        # ES2017 target!            │
│      └── tsconfig.json                                      │
│                                                              │
├── package.json         # Root workspace config             │
├── pnpm-workspace.yaml  # Monorepo definition               │
└── tsconfig.base.json   # Shared TS config                  │
└────────────────────────────────────────────────────────────┘
```

---

## 🎬 Phase 1: Foundation (CURRENT PHASE)

### Step 1.1: Create Monorepo Structure ✅ COMPLETE
- [x] Initialize pnpm workspace
- [x] Create base package.json files
- [x] Set up shared TypeScript config
- [x] Add .gitignore
- [x] Install all dependencies
- [x] Verify package linking
- [x] Run initial tests

**Completed**: October 2, 2025

### Step 1.2: Build `@gcg/schema` Package ✅ COMPLETE
- [x] Define initial schema.json structure
  - Schema version: `0.1.0`
  - Tabs, sections, components (all 6 types)
  - Icon references (SVG/PNG/JPG)
  - Bindings structure (EmpirBus, NMEA2000, Static)
  - Metadata (name, version, author, dates)
- [x] Create Zod validator
  - Version validation (semantic versioning)
  - Unique component ID validation
  - Icon reference validation
  - Type safety (discriminated unions)
  - Custom refinements (min < max, button bindings)
- [x] Write TypeScript type definitions
  - All types auto-inferred from Zod
  - ValidationResult union type
- [x] Set up Jest testing
  - 19 tests (all passing)
  - 88.5% statement coverage
- [x] Create fixture examples
  - Minimal valid schema
  - Complex multi-tab schema (all component types)
  - Bindings showcase (all 3 binding types)
  - 6 invalid schema examples
- [x] Write comprehensive tests
  - Component type tests (Toggle, Button, Dimmer, Gauge, Indicator, Slider)
  - Binding type tests (EmpirBus, NMEA2000, Static)
  - Invalid schema tests (duplicate IDs, invalid references, etc.)

**Completed**: October 2, 2025  
**See**: `STEP_1_2_COMPLETE.md` for detailed completion report

**Exit Criteria:**
- ✅ All tests passing (19/19) ✅
- ✅ Can import types in other packages ✅
- ✅ Validation catches all defined error cases ✅

---

## 🎬 Phase 2: Web Configurator Scaffold

### Step 2.1: React App Setup ✅ COMPLETE
- [x] Initialize Vite + React + TypeScript
- [x] Install dependencies (@gcg/schema, react-router-dom, etc.)
- [x] Set up routing (Editor/Preview/Export)
- [x] Create base layout shell
- [x] Implement SchemaContext for state management
- [x] Integrate @gcg/schema validation
- [x] Create all three pages (Editor, Preview, Export)
- [x] Add CSS Modules styling
- [x] Implement download schema.json feature

**Completed**: October 2, 2025  
**See**: `STEP_2_1_COMPLETE.md` for detailed completion report  
**Dev Server**: http://localhost:3000

**Exit Criteria:**
- ✅ React app runs without errors ✅
- ✅ All three pages accessible ✅
- ✅ Schema validation working ✅
- ✅ Base layout implemented ✅

### Step 2.2: Editor Page (CURRENT STEP)
- [ ] Tab management UI
- [ ] Section management UI
- [ ] Component picker
- [ ] Property editors (labels, icons, bindings)
- [ ] Real-time validation display
- [ ] Icon asset uploader

### Step 2.3: Preview Page
- [ ] Render schema as mockup UI
- [ ] Simulate component interactions
- [ ] Toggle between light/dark themes

### Step 2.4: Export Page
- [ ] Generate config.zip
- [ ] Include schema.json
- [ ] Include only referenced icons
- [ ] Add deployment instructions

**Exit Criteria:**
- ✅ Can create valid schema visually
- ✅ Export produces valid ZIP
- ✅ No console errors

---

## 🎬 Phase 3: HMI UI Scaffold

### Step 3.1: Preact App Setup
- [ ] Initialize Vite + Preact + TypeScript
- [ ] Configure ES2017 build target
- [ ] Install @gcg/schema + @preact/signals
- [ ] Test build output for compatibility

### Step 3.2: Schema Loader
- [ ] Fetch schema.json at runtime
- [ ] Validate against @gcg/schema
- [ ] Handle errors gracefully
- [ ] Mock data for development

### Step 3.3: Component Factory
- [ ] Map schema component types to Preact components
- [ ] Implement Toggle component
- [ ] Implement Button component
- [ ] Implement Dimmer component
- [ ] Implement Gauge component
- [ ] Handle unknown types

### Step 3.4: State Management
- [ ] Set up Preact signals
- [ ] Component state tracking
- [ ] Bindings mock adapter (WebSocket stub)

### Step 3.5: Integration with index1.html
- [ ] Build output to `web/` directory
- [ ] Update index1.html with bundle reference
- [ ] Test in actual HMI environment (or emulator)

**Exit Criteria:**
- ✅ Schema loads correctly
- ✅ Components render
- ✅ Bundle is ES2017-compatible
- ✅ File size is reasonable

---

## 🎬 Phase 4: Advanced Features (Later)

- [ ] Bindings adapter (real WebSocket → CAN)
- [ ] Advanced component types
- [ ] Animations and transitions
- [ ] Multi-language support
- [ ] Theme switcher
- [ ] Hot-reload schema updates
- [ ] Deployment automation

---

## 🚨 Critical Success Factors

### 1. **Don't Get Ahead of Yourself**
- Build incrementally
- Test each layer before moving to the next
- Resist the urge to add features prematurely

### 2. **Respect the Constraints**
- WebView 83 = No optional chaining, nullish coalescing, etc.
- Use Babel/Vite to transpile correctly
- Test in real environment early

### 3. **Schema is King**
- Both apps MUST respect the schema
- Version mismatches = hard errors
- Migration strategy for schema changes

### 4. **Security**
- Change default Garmin credentials
- Validate all external input
- No sensitive data in schema files

---

## 📝 Next Actions

**TODAY (October 2, 2025):**
1. ✅ Review this roadmap
2. ⬜ Create monorepo structure
3. ⬜ Scaffold `@gcg/schema` package
4. ⬜ Define initial schema.json format
5. ⬜ Write first Zod validator

**THIS WEEK:**
- Complete `@gcg/schema` with tests
- Start Web Configurator scaffold

**THIS MONTH:**
- Complete Web Configurator MVP
- Start HMI UI scaffold
- First end-to-end test

---

## 🔗 References

- **Garmin App ID**: `61d547c0-997b-11f0-9a14-4b36b456914c`
- **Target Entry**: `web/index1.html`
- **EmpirBus Config**: `web/garmin/empirbus_config1.json`
- **System Config**: `core-v2_9-30-25_v1.ebp`

---

**Last Updated**: October 2, 2025
**Status**: Phase 1, Step 1.2 - Monorepo setup complete, ready to build @gcg/schema
