# Visual Editor Implementation - Phase 2, Step 2.2

**Status:** ✅ Complete  
**Date:** October 2, 2025  
**Phase:** 2 - Web Configurator  
**Step:** 2.2 - Visual Editor

---

## Overview

Built a complete visual editor that allows users to design their HMI interface with:

1. **Tab Management** - Create, rename, delete, and reorder tabs
2. **Section Management** - Organize components into collapsible sections
3. **Component Palette** - Add hardware channels as UI components
4. **Real-time Validation** - Immediate feedback on schema changes
5. **3-Column Layout** - Tabs (left), Sections (center), Components (right)

---

## Files Created/Modified

### New Components

#### 1. `TabManager.tsx` + `TabManager.module.css`
**Purpose:** Manage tabs (top-level navigation)

**Features:**
- Add new tabs with custom titles
- Rename tabs inline
- Delete tabs (with confirmation, minimum 1 tab required)
- Reorder tabs (move left/right)
- Visual selection state
- Component/section count display

**Key Functions:**
- `handleAddTab()` - Creates new tab with default section
- `handleDeleteTab()` - Removes tab and updates selection
- `handleRenameTab()` - Updates tab title
- `handleMoveTab()` - Reorders tabs in schema

---

#### 2. `SectionManager.tsx` + `SectionManager.module.css`
**Purpose:** Manage sections within selected tab

**Features:**
- Add new sections
- Rename sections inline
- Delete sections (minimum 1 section per tab)
- Reorder sections (move up/down)
- Toggle collapsible state
- Show component list when section selected
- Delete individual components

**Key Functions:**
- `handleAddSection()` - Adds section to current tab
- `handleDeleteSection()` - Removes section and updates selection
- `handleToggleCollapsible()` - Sets collapsible property
- `handleMoveSection()` - Reorders sections within tab
- `handleDeleteComponent()` - Removes component from section

---

#### 3. `ComponentPalette.tsx` + `ComponentPalette.module.css`
**Purpose:** Display available hardware channels as draggable components

**Features:**
- Lists all configured hardware channels
- Filters out already-used channels
- Shows component type (toggle, button, dimmer)
- Shows channel info (source, number)
- Click to add to selected section
- Empty state when no channels or all used

**Logic:**
```typescript
// Get configured channels (not "not-used")
const configuredChannels = hardware.outputs.filter(
  (output) => output.control !== 'not-used'
);

// Filter out already-used components
const usedComponentIds = getAllComponentIds(schema);
const availableChannels = configuredChannels.filter(
  (channel) => !usedComponentIds.has(`comp-${channel.id}`)
);
```

---

### Updated Files

#### 4. `EditorPage.tsx` - Complete Rewrite
**Before:** Placeholder with mockup UI  
**After:** Fully functional 3-column editor

**Structure:**
```
EditorPage
├── Header (validation badge)
└── Editor Layout (3 columns)
    ├── Left Sidebar → TabManager
    ├── Main Editor → SectionManager + Validation Errors
    └── Right Sidebar → ComponentPalette
```

**Key Logic:**
```typescript
const handleAddComponent = (channelId: string) => {
  const channel = schema.hardware?.outputs.find((o) => o.id === channelId);
  const mapping = CONTROL_COMPONENT_MAP[channel.control];
  
  // Build component based on control type
  let newComponent;
  if (mapping.component === 'button') {
    newComponent = {
      type: 'button',
      action: mapping.action, // 'momentary'
      bindings: { action: { type: 'empirbus', channel: channelId } }
    };
  } else if (mapping.component === 'toggle') {
    newComponent = {
      type: 'toggle',
      bindings: { state: { type: 'empirbus', channel: channelId } }
    };
  } else if (mapping.component === 'dimmer') {
    newComponent = {
      type: 'dimmer',
      min: channel.range?.min ?? 0,
      max: channel.range?.max ?? 100,
      step: channel.range?.step ?? 1,
      bindings: { intensity: { type: 'empirbus', channel: channelId } }
    };
  }
  
  // Add to selected section
  updateSchemaSections(newComponent);
};
```

---

#### 5. `EditorPage.module.css` - New Layout Styles
**Layout:**
- 3-column grid: 280px | flex | 280px
- Fixed height (no scrolling at top level)
- Individual column scrolling
- Bordered sidebars
- Responsive spacing

---

#### 6. `schema.ts` - Exported Types
Added type exports for component use:
```typescript
export type Tab = z.infer<typeof TabSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Component = z.infer<typeof ComponentSchema>;
```

---

## User Workflow

### Complete Example: Creating a Lighting Control Interface

1. **Configure Hardware (already done in Step 2.1)**
   - Go to Hardware tab
   - Set Channel 1: "Galley Lights", Toggle Button
   - Set Channel 2: "Reading Lights", Slider

2. **Create Tab**
   - Click "+ Add Tab" in left sidebar
   - Name it "Lighting"
   - Tab created with default "New Section"

3. **Configure Section**
   - Click on "New Section" to select it
   - Rename to "Main Lights"
   - Toggle collapsible icon (📁/📂)

4. **Add Components**
   - Right sidebar shows available channels:
     - "Galley Lights" (toggle)
     - "Reading Lights" (dimmer)
   - Click "Galley Lights" → Added to "Main Lights" section
   - Click "Reading Lights" → Added to "Main Lights" section

5. **Organize**
   - Both components now show in section component list
   - Delete button (×) next to each component
   - Section shows "2 components"

6. **Create Another Section**
   - Click "+ Section"
   - Name it "Accent Lights"
   - Add more channels

7. **Reorder**
   - Use ↑↓ buttons to move "Accent Lights" above "Main Lights"
   - Use ←→ buttons to move "Lighting" tab position

---

## Schema Integration

### Before Adding Component
```json
{
  "tabs": [
    {
      "id": "tab-main",
      "title": "Main",
      "sections": [
        {
          "id": "section-controls",
          "title": "Controls",
          "components": []  // Empty
        }
      ]
    }
  ]
}
```

### After Adding "Galley Lights" Toggle
```json
{
  "tabs": [
    {
      "id": "tab-main",
      "title": "Main",
      "sections": [
        {
          "id": "section-controls",
          "title": "Controls",
          "components": [
            {
              "id": "comp-core-01",      // Generated from channel ID
              "type": "toggle",
              "label": "Galley Lights",   // From hardware config
              "bindings": {
                "state": {
                  "type": "empirbus",
                  "channel": "core-01"    // Links to hardware channel
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

## Key Features Implemented

### ✅ Tab Management
- Add/delete/rename tabs
- Minimum 1 tab enforced
- Reorder with ←→ buttons
- Visual selection state
- Auto-select first tab on load
- Meta info: section count, component count

### ✅ Section Management
- Add/delete/rename sections
- Minimum 1 section per tab enforced
- Reorder with ↑↓ buttons
- Toggle collapsible property (📁/📂 icon)
- Expandable component list when selected
- Delete individual components with confirmation

### ✅ Component Palette
- Shows only available (unused) channels
- Filters by hardware configuration
- One-click add to section
- Visual feedback (hover, transform)
- Empty states:
  - No hardware configured
  - All channels used
- Component type badges (toggle, button, dimmer)

### ✅ Real-time Validation
- All changes immediately validated
- Error badge in header
- Detailed error list at bottom of editor
- Path and message for each error
- Truncated to 10 errors (with "...X more" message)

### ✅ Keyboard Support
- **Enter** - Confirm add tab/section
- **Escape** - Cancel add form
- **Tab** - Navigate between inputs
- Inline editing with click-to-edit

---

## Technical Architecture

### State Management

**Global State** (SchemaContext):
- `schema` - Complete UI schema
- `updateSchema()` - Triggers validation
- `validationResult` - Zod validation results

**Local State** (EditorPage):
- `selectedTabId` - Currently active tab
- `selectedSectionId` - Currently active section

**State Flow:**
```
User Action
    ↓
Component Event Handler
    ↓
Update Schema (immutable)
    ↓
updateSchema() in SchemaContext
    ↓
Automatic Validation (useEffect)
    ↓
UI Re-renders with New State
```

### Component Hierarchy
```
EditorPage
├── TabManager
│   └── Tab Items (map)
│       ├── Title Input
│       ├── Move Buttons
│       └── Delete Button
├── SectionManager
│   └── Section Items (map)
│       ├── Title Input
│       ├── Actions (collapsible, move, delete)
│       └── Component List (if selected)
│           └── Component Items (map)
└── ComponentPalette
    └── Channel Items (map)
        ├── Icon
        ├── Label
        ├── Type Badge
        └── Channel Info
```

### Data Binding

**Hardware Channel → UI Component:**
```typescript
// Hardware Config (from HardwareConfigPage)
{
  id: "core-01",
  source: "core",
  channel: 1,
  label: "Galley Lights",
  control: "toggle-button",  // Control type
  signalId: 100
}

// Mapped to Component (in EditorPage)
{
  id: "comp-core-01",        // comp-{channelId}
  type: "toggle",            // From CONTROL_COMPONENT_MAP
  label: "Galley Lights",    // Copied from channel
  bindings: {
    state: {
      type: "empirbus",
      channel: "core-01"     // References hardware channel
    }
  }
}
```

**Control Type Mapping:**
```typescript
CONTROL_COMPONENT_MAP = {
  "push-button":   { component: "button", action: "momentary" },
  "toggle-button": { component: "toggle" },
  "slider":        { component: "dimmer" },
  "half-bridge":   { component: "dimmer" }
}
```

---

## Visual Design

### Layout Grid
```
┌──────────────────────────────────────────────────────────────┐
│                       Header (Validation)                     │
├──────────┬────────────────────────────────┬──────────────────┤
│   Tabs   │         Sections               │    Components    │
│   280px  │           flex (1fr)           │      280px       │
│          │                                │                  │
│  ┌─────┐ │  ┌──────────────────────────┐ │  ┌────────────┐  │
│  │Tab 1│ │  │ Section 1               ×│ │  │ Galley     │  │
│  │Tab 2│◄┼─▶│ - Component 1          ×│ │  │ Lights     │  │
│  │...  │ │  │ - Component 2          ×│ │  │ [toggle]   │  │
│  └─────┘ │  └──────────────────────────┘ │  ├────────────┤  │
│          │  ┌──────────────────────────┐ │  │ Reading    │  │
│  + Add   │  │ Section 2               ×│ │  │ Lights     │  │
│    Tab   │  │ (empty)                  │ │  │ [dimmer]   │  │
│          │  └──────────────────────────┘ │  └────────────┘  │
│          │                                │                  │
│          │  + Section                     │  Available: 2    │
│          │                                │                  │
│  Scroll  │          Scroll                │     Scroll       │
└──────────┴────────────────────────────────┴──────────────────┘
```

### Color System
- **Primary:** #2563eb (blue) - Selected states, buttons
- **Surface:** Light gray background
- **Border:** #e5e7eb (gray-200)
- **Success:** #10b981 (green) - Validation success
- **Error:** #ef4444 (red) - Validation errors, delete buttons

### Interactions
- **Hover** - Border color change, slight transform
- **Selected** - Primary border, box shadow
- **Disabled** - Reduced opacity, no-allowed cursor
- **Click** - Immediate state update (no loading states needed)

---

## Validation Examples

### Valid Schema
```
✓ Valid (green badge in header)
```

### Invalid Schema
```
⚠ 3 errors (red badge in header)

Bottom of editor shows:
- tabs.0.sections.0.components.0.id: ID must start with letter
- tabs.0.sections.0.components.0.label: String must contain at least 1 character
- tabs.1.title: String must contain at most 30 characters
```

---

## Testing Checklist

### ✅ Tab Operations
- [x] Add new tab
- [x] Rename tab (inline edit)
- [x] Delete tab (with confirmation)
- [x] Cannot delete last tab
- [x] Move tab left/right
- [x] Selection persists after operations

### ✅ Section Operations
- [x] Add new section
- [x] Rename section (inline edit)
- [x] Delete section (with confirmation)
- [x] Cannot delete last section in tab
- [x] Move section up/down
- [x] Toggle collapsible state
- [x] Component list expands when selected

### ✅ Component Operations
- [x] Add component from palette
- [x] Component appears in section list
- [x] Delete component from section
- [x] Channel removed from palette after use
- [x] Channel reappears in palette after deletion

### ✅ Validation
- [x] Schema validates on every change
- [x] Error badge shows count
- [x] Error list shows path and message
- [x] Success badge when valid

### ✅ State Management
- [x] Tab selection preserved
- [x] Section selection auto-updates
- [x] Schema updates immutable
- [x] No data loss on operations

---

## Integration with Phase 2.1 (Hardware Config)

The editor now **directly consumes** the hardware configuration:

```typescript
// From HardwareConfigPage
schema.hardware.outputs = [
  {
    id: "core-01",
    control: "toggle-button",
    label: "Galley Lights"
  }
]

// Used in ComponentPalette
const availableChannels = schema.hardware.outputs.filter(
  (output) => output.control !== 'not-used' && !alreadyUsed(output.id)
);

// Converted to Component in handleAddComponent
const component = {
  id: `comp-${channel.id}`,
  type: CONTROL_COMPONENT_MAP[channel.control].component,
  label: channel.label,
  bindings: buildBindings(channel)
};
```

**Flow:**
1. User configures hardware channels (Phase 2.1)
2. Channels appear in Component Palette (Phase 2.2)
3. User adds channels to sections
4. Components reference hardware via bindings
5. Preview page will render components (Phase 2.3)
6. Export page will generate config (Phase 2.4)

---

## Next Steps (Phase 2.3 - Preview Page)

Now that users can design schemas, we need to:

1. **Render Components** - Display toggle, button, dimmer UI elements
2. **Interactive Preview** - Clickable buttons, working sliders
3. **Theme Switcher** - Light/dark mode toggle
4. **Device Mockup** - Show HMI in realistic Garmin display
5. **Tab Navigation** - Switch between designed tabs

The Preview page will consume the schema and render actual Preact components (matching the Phase 3 HMI UI components).

---

## Known Limitations & Future Enhancements

### Current Limitations
- No drag-and-drop (click-to-add only)
- No component property editor (uses channel defaults)
- No icon picker (uses channel icon)
- No undo/redo
- No copy/paste components

### Planned Enhancements
- **Property Editor Panel** - Edit component label, icon, variant
- **Drag-and-Drop** - Reorder components within/between sections
- **Component Templates** - Save and reuse component configurations
- **Keyboard Shortcuts** - Ctrl+Z (undo), Ctrl+C/V (copy/paste)
- **Visual Preview in Editor** - Mini component preview cards
- **Bulk Operations** - Multi-select and batch delete

---

## Summary

**What we built:**
A complete visual editor with tab/section/component management, real-time validation, and hardware channel integration.

**Why it matters:**
This is the **core tool** for installers. They can now design complete HMI interfaces without writing code or editing JSON manually.

**What's next:**
Preview page to visualize the designed interface with actual rendered components.

---

**Status:** ✅ Ready for Phase 2.3 (Preview Page)  
**Completion Date:** October 2, 2025  
**Dev Server:** http://localhost:3000/editor
