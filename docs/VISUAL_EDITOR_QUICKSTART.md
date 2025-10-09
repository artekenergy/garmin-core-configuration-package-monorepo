# Visual Editor - Quick Start Guide

## ✅ What We Just Built

A complete **Visual Schema Editor** with:
- ✅ Tab management (add, rename, delete, reorder)
- ✅ Section management (add, rename, delete, reorder, collapsible)
- ✅ Component palette (hardware channels → UI components)
- ✅ Real-time validation
- ✅ 3-column layout (Tabs | Sections | Components)

---

## 🚀 Test It Now!

Your dev server is running at **http://localhost:3000/editor**

### Quick Test Workflow

1. **Go to Hardware Tab** (http://localhost:3000/hardware)
   - Select "CORE" system type
   - Configure Channel 1:
     - Control: "Toggle Button"
     - Label: "Galley Lights"
   - Configure Channel 2:
     - Control: "Slider"  
     - Label: "Reading Lights"

2. **Go to Editor Tab** (http://localhost:3000/editor)
   - You'll see default "Main" tab selected
   - Left sidebar shows: **Tabs** section
   - Center shows: **Sections** in "Main" tab
   - Right sidebar shows: **Available Components** (2 channels)

3. **Add a New Tab**
   - Click "+ Add Tab" in left sidebar
   - Type "Lighting"
   - Press Enter
   - New "Lighting" tab created with default "New Section"

4. **Configure Section**
   - Section "New Section" is auto-selected
   - Click on the title, rename to "Main Lights"
   - Click 📂 icon to toggle collapsible state (becomes 📁)

5. **Add Components**
   - Right sidebar shows:
     ```
     Available Components: 2
     
     [Galley Lights]
     toggle
     CORE #1
     
     [Reading Lights]  
     dimmer
     CORE #2
     ```
   - Click "Galley Lights" → Component added to "Main Lights" section!
   - Click "Reading Lights" → Component added to section!
   - Both disappear from palette (already used)

6. **View Components**
   - "Main Lights" section now shows:
     - "2 components"
     - Expandable list:
       - **toggle** Galley Lights [×]
       - **dimmer** Reading Lights [×]

7. **Add Another Section**
   - Click "+ Section" button
   - Name it "Accent Lights"
   - Press Enter

8. **Reorder Sections**
   - Select "Accent Lights"
   - Click ↑ button to move it above "Main Lights"

9. **Manage Tabs**
   - Select different tabs from left sidebar
   - Use ←→ buttons to reorder tabs
   - Try deleting a tab (confirmation dialog appears)

10. **Check Validation**
    - Header shows validation status
    - If errors: Red badge with count
    - If valid: Green "✓ Valid" badge

---

## 📁 Files Created (8 new files)

### Components
1. `TabManager.tsx` (198 lines) - Tab CRUD + reordering
2. `TabManager.module.css` (163 lines) - Tab UI styles
3. `SectionManager.tsx` (306 lines) - Section CRUD + component list
4. `SectionManager.module.css` (220 lines) - Section UI styles
5. `ComponentPalette.tsx` (117 lines) - Hardware channel selector
6. `ComponentPalette.module.css` (117 lines) - Palette UI styles

### Pages
7. `EditorPage.tsx` (Complete rewrite, 177 lines) - Main editor layout
8. `EditorPage.module.css` (Replaced, 127 lines) - 3-column grid

### Schema Types
9. `schema.ts` (Updated) - Exported Tab, Section, Component types

---

## 🎨 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Schema Editor              [✓ Valid] or [⚠ X errors]  │
├───────────┬────────────────────────────┬────────────────┤
│   TABS    │        SECTIONS           │   COMPONENTS   │
│           │                            │                │
│ ┌───────┐ │ ┌────────────────────────┐│ ┌────────────┐ │
│ │ Main ◄┼─┼▶│ Main Lights          ↑│││ │ Galley     │ │
│ │Lightin│ │ │ ├─ toggle: Galley    ││││ │ Lights     │ │
│ │...    │ │ │ └─ dimmer: Reading   ││││ │ [TOGGLE]   │ │
│ └───────┘ │ └────────────────────────┘││ ├────────────┤ │
│           │ ┌────────────────────────┐││ │ Reading    │ │
│ + Add Tab │ │ Accent Lights        ↓│││ │ Lights     │ │
│           │ │ (empty)                │││ │ [DIMMER]   │ │
│           │ └────────────────────────┘││ └────────────┘ │
│           │                            │                │
│           │ + Section                  │ Available: 2   │
└───────────┴────────────────────────────┴────────────────┘
```

---

## 🔗 Integration with Hardware Config

The editor **consumes** hardware configuration directly:

```typescript
// Step 1: Hardware Config creates channels
hardware.outputs = [
  {
    id: "core-01",
    control: "toggle-button",
    label: "Galley Lights"
  }
]

// Step 2: Editor shows in Component Palette
ComponentPalette filters: control !== "not-used" && !alreadyUsed

// Step 3: User clicks to add → Creates component
{
  id: "comp-core-01",
  type: "toggle",           // Mapped from "toggle-button"
  label: "Galley Lights",   // Copied from channel
  bindings: {
    state: {
      type: "empirbus",
      channel: "core-01"     // References hardware
    }
  }
}
```

---

## 🎯 Key Features

### Tab Operations
- **Add:** Click "+ Add Tab", type name, press Enter
- **Rename:** Click on title inline, type new name
- **Delete:** Click × button (confirms, minimum 1 tab)
- **Reorder:** Use ← → buttons

### Section Operations
- **Add:** Click "+ Section", type name
- **Rename:** Click on title inline
- **Delete:** Click × button (minimum 1 section per tab)
- **Reorder:** Use ↑ ↓ buttons
- **Collapsible:** Toggle 📁/📂 icon

### Component Operations
- **Add:** Click channel in Component Palette
- **View:** Expands when section selected
- **Delete:** Click × next to component name
- **Reuse:** Deleting component returns it to palette

### Validation
- **Real-time:** Updates on every change
- **Badge:** Shows error count or ✓ Valid
- **Error List:** Shows at bottom of editor
- **Format:** `path: message` (e.g., `tabs.0.title: Required`)

---

## 🚦 Testing Checklist

Try these operations to verify everything works:

- [ ] Add 3 tabs
- [ ] Rename a tab
- [ ] Try to delete the last tab (should block)
- [ ] Reorder tabs with ← → buttons
- [ ] Add 2 sections to a tab
- [ ] Toggle collapsible on a section
- [ ] Move sections with ↑ ↓ buttons
- [ ] Add all available components
- [ ] Delete a component (should reappear in palette)
- [ ] Check validation badge updates
- [ ] Switch between tabs (selection persists)

---

## 🐛 Known Issues (Minor)

- **Unused imports warning:** TypeScript complains about imported types that are only used in type assertions (non-blocking)
- **Fast Refresh warning:** `useSchema` export incompatible with HMR (requires full page reload on SchemaContext changes)

Both are **cosmetic** and don't affect functionality.

---

## 📊 Progress Summary

### Completed (Phase 2)
- ✅ Step 2.1: Hardware Configuration (Channel setup, half-bridge pairing)
- ✅ Step 2.2: **Visual Editor** (Tab/Section/Component management) ← **JUST COMPLETED**

### Next Steps
- ⏸️ Step 2.3: Preview Page (Render actual components)
- ⏸️ Step 2.4: Export Page (Generate config.zip)

---

## 🎨 Visual Examples

### Default State
```
Tabs: [Main]
Sections: [Controls]  
Components: [] (empty)
Available: All configured hardware channels
```

### After Adding Components
```
Tabs: [Main, Lighting, HVAC]
Sections: [Main Lights, Accent Lights]
Components:
  - Main Lights:
    • toggle: Galley Lights
    • dimmer: Reading Lights
  - Accent Lights:
    • toggle: Under-Cabinet Lights
Available: 0 (all channels used)
```

---

## 📖 Full Documentation

See `VISUAL_EDITOR_IMPLEMENTATION.md` for:
- Complete technical architecture
- State management details
- Component hierarchy diagrams
- Data binding examples
- Future enhancement plans

---

## 🎉 Success Criteria

You'll know it's working when you can:
1. ✅ Create a tab named "Lighting"
2. ✅ Add a section named "Main Lights"
3. ✅ Click "Galley Lights" in palette → See it appear in section
4. ✅ Click × next to component → See it disappear and return to palette
5. ✅ Validation badge shows "✓ Valid"

---

**Ready to test?** → http://localhost:3000/editor 🚀
