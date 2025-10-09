# Web Configurator ↔️ Schema ↔️ HMI-UI Integration Flow Analysis

**Created:** October 7, 2025  
**Purpose:** Map out the current integration and identify areas needing work

---

## 🎯 High-Level Flow (How It Should Work)

```
┌─────────────────────┐
│  Web Configurator   │  User configures system through UI forms
│   (React + Vite)    │  - Hardware outputs, lighting, power, HVAC, etc.
└──────────┬──────────┘
           │
           │ Builds & Validates
           ▼
┌─────────────────────┐
│   JSON Schema       │  Single source of truth
│ (@gcg/schema pkg)   │  - Defines tabs, sections, components
│                     │  - Hardware config, bindings, channels
└──────────┬──────────┘
           │
           │ Consumed by
           ▼
┌─────────────────────┐
│      HMI-UI         │  Runtime rendering on Garmin device
│  (Preact + Signals) │  - Loads schema.json
│                     │  - Renders UI dynamically
│                     │  - Binds to EmpirBus channels
└─────────────────────┘
```

---

## 📦 Current Package Structure

### 1. **@gcg/schema** (packages/schema/)

- **Purpose:** Shared TypeScript types & Zod validation schemas
- **Exports:**
  - Type definitions (UISchema, Tab, Section, Component, etc.)
  - Zod schemas for validation
  - `validateSchema()` function
- **Status:** ✅ Well-defined, comprehensive

### 2. **web-configurator** (packages/web-configurator/)

- **Purpose:** Visual configuration tool for building schemas
- **Key Files:**
  - `SchemaContext.tsx` - Global state management
  - Configuration Pages (Hardware, Power, Lighting, HVAC, etc.)
  - `EditorPage.tsx` - Tab/section/component editor
  - `ExportPage.tsx` - Package compilation & download
  - `tabGenerator.ts` - Auto-generates tab content from configs
- **Status:** ✅ Functional, needs integration verification

### 3. **hmi-ui** (packages/hmi-ui/)

- **Purpose:** Runtime UI renderer for Garmin devices
- **Key Files:**
  - `App.tsx` - Main application
  - `schema-loader.ts` - Loads & validates schema.json
  - `ComponentRenderer.tsx` - Renders components dynamically
  - `adapters/` - Data adapters (EmpirBus, NMEA2000, mock)
- **Status:** ✅ Functional, needs testing with real schemas

---

## 🔍 Current Integration Points

### ✅ Working Integration Points

1. **Schema Validation**
   - Web configurator uses `validateSchema()` from @gcg/schema
   - Real-time validation in Layout.tsx header
   - Error modal shows detailed validation errors
   - Export page blocks compilation if schema invalid

2. **Tab Content Generation**
   - `tabGenerator.ts` generates sections/components based on config
   - Auto-generates content for:
     - Home tab (Quick Controls, Status)
     - Lighting tab (Interior, Exterior zones)
     - Power tab (Battery, charging, solar, etc.)
     - HVAC tab (Heating, cooling, ventilation)
     - Plumbing tab (Tank levels)
     - Switching tab (Hardware output controls)
   - Regenerates on navigation to Editor page

3. **Export & Compilation**
   - ExportPage compiles complete deployment package
   - Includes schema.json + all HMI assets
   - Merges hardware signal mappings
   - Creates downloadable ZIP

4. **HMI Schema Loading**
   - HMI-UI fetches `/schema.json` on load
   - Validates using same @gcg/schema package
   - Shows detailed error if validation fails
   - Auto-subscribes to signals after successful load

---

## ⚠️ Integration Gaps & Issues to Address

### 🔴 Critical Issues

#### 1. **Schema Export Location Mismatch**

- **Problem:** ExportPage creates ZIP but HMI-UI expects `/schema.json` in public folder
- **Current Flow:**
  ```
  Web Configurator → Download ZIP → User extracts → Manual copy to HMI-UI public/
  ```
- **Need:** Either:
  - Option A: Button to "Deploy to HMI" that copies schema directly
  - Option B: Development server that serves schema to HMI
  - Option C: Document manual deployment process clearly

#### 2. **Channel Binding Verification**

- **Problem:** No way to verify that channels in schema match hardware config
- **Example Issues:**
  - User creates toggle for "deck-lights" but hardware config has "deck-light" (missing 's')
  - Case sensitivity mismatches
  - Typos in channel names
- **Need:**
  - Validation that checks schema channels against hardware config
  - Auto-suggest channel names from hardware config
  - Warning/error when channel doesn't exist

#### 3. **Component Binding Completeness**

- **Problem:** Components created without proper bindings
- **Current State:**
  - Toggle requires `bindings.state`
  - Gauge requires `bindings.value`
  - Dimmer requires `bindings.intensity` + `bindings.state`
- **Need:**
  - Component Palette should enforce binding requirements
  - Visual indicator when component has missing/invalid bindings
  - Guided binding setup when dropping components

#### 4. **Hardware Config → Schema Integration**

- **Problem:** Hardware config uploaded but not deeply integrated
- **Current:** User uploads hardware-config.json, stored separately
- **Need:**
  - Parse hardware config to extract:
    - Available channels
    - Control types (toggle/dimmer/button)
    - Labels
    - Icons (if specified)
  - Use this to populate:
    - Component Palette (only show valid component types)
    - Channel dropdowns (auto-complete)
    - Default labels
  - Validate schema against hardware config

### 🟡 Important Issues

#### 5. **Icon Asset Management**

- **Problem:** Icon picker allows selecting icons but no clear workflow for custom icons
- **Current:** Icons stored as paths in schema
- **Need:**
  - Upload custom icons to deployment package
  - Icon library management
  - Preview how icons look on actual device
  - Icon validation (size, format)

#### 6. **Live Preview/Testing**

- **Problem:** No way to test schema without full export → deploy cycle
- **Need:**
  - "Preview" button that launches HMI-UI with current schema
  - Development mode where HMI-UI fetches from web configurator
  - Hot reload when schema changes

#### 7. **Signal Mapping Visibility**

- **Problem:** Hardware config has signal mappings but not visible in UI
- **Current:** Signals merged during export but user can't see them
- **Need:**
  - Show signal details for each channel
  - Display: channel name, signals, data types
  - Help users understand what data is available

### 🟢 Nice-to-Have Improvements

#### 8. **Component Validation in Editor**

- Show real-time validation errors for individual components
- Highlight components with issues in red
- Tooltip explaining what's wrong

#### 9. **Schema Templates**

- Pre-built templates for common RV types
- "Class A Motorhome", "Travel Trailer", "Fifth Wheel"
- User can start from template and customize

#### 10. **Version Management**

- Track schema versions
- Allow reverting to previous versions
- Compare schemas (diff view)

---

## 🛠️ Proposed Action Plan

### Phase 1: Core Integration (Week 1-2)

**Goal:** Make the basic flow work end-to-end

1. **Task 1.1: Development Mode for HMI**
   - Add dev mode to HMI-UI that fetches schema from web configurator
   - Add "Preview in HMI" button to web configurator
   - Opens HMI in new window/tab with current schema

2. **Task 1.2: Hardware Config Integration**
   - Parse hardware-config.json to extract channels
   - Store channels in SchemaContext
   - Validate component bindings against available channels
   - Show errors when binding to non-existent channel

3. **Task 1.3: Channel Auto-Complete**
   - Add channel dropdown when creating bindings
   - Populate from hardware config
   - Show channel details (control type, label)

### Phase 2: Binding Workflow (Week 3)

**Goal:** Make component binding intuitive and error-proof

4. **Task 2.1: Binding Modal/Panel**
   - When dropping component, show binding setup UI
   - Guide user through required bindings
   - Validate before saving

5. **Task 2.2: Component Validation Visualization**
   - Red border on components with invalid bindings
   - Warning icon with tooltip
   - Fix suggestion in error modal

6. **Task 2.3: Hardware Config Sync**
   - When hardware config changes, re-validate all bindings
   - Show which components are affected
   - Offer to update/fix automatically

### Phase 3: Testing & Polish (Week 4)

**Goal:** Ensure reliability and user experience

7. **Task 3.1: End-to-End Testing**
   - Create test schemas with various configurations
   - Verify export → deploy → render workflow
   - Test all component types with real bindings

8. **Task 3.2: Documentation**
   - Step-by-step guides
   - Video walkthrough
   - Troubleshooting section

9. **Task 3.3: Error Recovery**
   - Graceful handling of invalid schemas
   - Clear error messages
   - Guided fixes

---

## 🧪 Testing Strategy

### Unit Tests

- Schema validation with various inputs
- Channel matching logic
- Component binding validation

### Integration Tests

- Full flow: configure → export → load in HMI
- Hardware config upload and parsing
- Channel binding validation

### End-to-End Tests

- Create schema in web configurator
- Export deployment package
- Load in HMI-UI
- Verify rendering matches configuration

---

## 📊 Success Criteria

### Definition of "Working Integration"

- [ ] User can configure system through web UI
- [ ] Schema validates with clear, actionable errors
- [ ] Hardware config channels are enforced in bindings
- [ ] Preview shows accurate representation of HMI
- [ ] Export creates working deployment package
- [ ] HMI-UI loads and renders schema correctly
- [ ] Components bind to correct EmpirBus channels
- [ ] User can complete full workflow without external help

---

## 💡 Recommendations for Next Steps

### Immediate Focus (Start Here)

1. **Review this document together** - Make sure we're aligned on the problems
2. **Prioritize the gaps** - Which issues are blocking vs. nice-to-have?
3. **Pick one critical issue** - Start with something concrete and testable

### Suggested Starting Point

**I recommend starting with Task 1.2: Hardware Config Integration**

**Why?**

- It's foundational - everything else builds on it
- Clear, measurable outcome
- Solves multiple problems at once:
  - Channel validation
  - Better UX (auto-complete)
  - Prevents user errors

**What it involves:**

1. Parse hardware-config.json when uploaded
2. Extract list of channels with metadata
3. Store in SchemaContext
4. Add validation: check if component bindings reference valid channels
5. Show errors in error modal

**Estimated effort:** 4-8 hours
**Impact:** High - prevents most binding errors

---

## 🤔 Questions to Discuss

1. **Deployment workflow:** Do you want a "Preview" mode or stick with export → manual deploy?
2. **Channel validation:** Should invalid channels be errors (block export) or warnings (allow but highlight)?
3. **Hardware config:** Should it be uploaded once globally or per-schema?
4. **Testing:** Do you have actual hardware to test on, or are we relying on mocked data?
5. **Priority:** Which gaps are most critical for your use case?

---

**Let me know which direction you'd like to go, and we'll start working through it methodically!** 🚀
