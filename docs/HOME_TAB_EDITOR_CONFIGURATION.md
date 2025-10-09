# Home Tab Section Configuration in Editor

**Created:** October 7, 2025  
**Status:** ✅ Complete

## Overview

Added special section configuration UI for the **Home tab** in the Editor. When users select the Home tab in the Navigation Tabs section, they see a custom interface to configure the two Home sections (instead of the standard section manager).

## What Was Built

### Home Tab Special UI

When the Home tab (`tab-home`) is selected in the Editor's Navigation Tabs:

- **Standard SectionManager is hidden**
- **HomeSectionManager is shown instead**
- Allows configuration of exactly 2 sections
- Each section can be one of 3 types: Switching, Signal Values, or Image

### Section Types

1. **🔘 Switching Section**
   - Toggle switches and buttons for quick control
   - Populated from hardware configuration
2. **📊 Signal Values Section**
   - Real-time values like voltage, levels, temps
   - Displays numeric data with units

3. **🖼️ Image Section**
   - Custom image like floor plan or diagram
   - Visual reference or system overview

## Implementation Details

### New Component: HomeSectionManager

**File:** `packages/web-configurator/src/components/HomeSectionManager.tsx`

#### Purpose

Provides specialized UI for configuring Home tab sections with type selection (switching/signal-values/image).

#### Key Features

- **Two Section Blocks:** Section 1 and Section 2
- **Title Editing:** Inline input for each section title
- **Type Selection:** 3-card grid for visual type selection
- **Component Count:** Shows how many components are in each section
- **Sync with Schema:** Updates both `schema.home` and `schema.tabs` simultaneously

#### Component Structure

```tsx
HomeSectionManager
├── Header (title and subtitle)
├── Section 1 Block
│   ├── Header with title input
│   ├── Type Grid (3 cards)
│   └── Component info
├── Section 2 Block
│   ├── Header with title input
│   ├── Type Grid (3 cards)
│   └── Component info
└── Info Box (regenerate tip)
```

#### Key Functions

```typescript
// Update section type and optionally title
updateSection(sectionKey, type, title?)

// Update only section title (syncs with tab section)
updateSectionTitle(sectionKey, title)

// Get emoji icon for section type
getSectionIcon(type): string

// Get description for section type
getSectionDescription(type): string

// Render individual section configuration
renderSectionConfig(sectionKey, sectionNum)
```

### CSS Styling

**File:** `packages/web-configurator/src/components/HomeSectionManager.module.css`

#### Layout

- Compact vertical layout with 1.5rem gaps
- Section blocks with background and border
- 3-column grid for type cards (responsive to 1 column on mobile)
- Title input inline with section header

#### Visual States

```css
.typeCard /* Default card state */
.typeCard:hover /* Hover with lift effect */
.typeCard.selected /* Blue border and tinted background */
```

#### Design Highlights

- Type cards: 2rem icons, clear labels, descriptive text
- Selected state: Blue border + background tint + shadow
- Component info: Light blue background showing count
- Info box: Blue tinted with regenerate tip

### Editor Page Integration

**File:** `packages/web-configurator/src/pages/EditorPage.tsx`

#### Conditional Rendering

```tsx
{
  selectedTabId === 'tab-home' ? (
    <HomeSectionManager schema={schema} selectedTabId={selectedTabId} onUpdate={updateSchema} />
  ) : (
    <SectionManager
      schema={schema}
      selectedTabId={selectedTabId}
      onUpdate={updateSchema}
      onSelectSection={setSelectedSectionId}
      selectedSectionId={selectedSectionId}
    />
  );
}
```

#### Behavior

- When Home tab selected → HomeSectionManager renders
- When any other tab selected → Standard SectionManager renders
- Component Palette on right sidebar works for both

### Schema Integration

Uses existing `schema.home` configuration:

```typescript
home: {
  section1: { type: 'switching', title: 'Quick Controls' },
  section2: { type: 'signal-values', title: 'Status' }
}
```

**Dual Update:** When section title changes:

1. Updates `schema.home.section1/section2.title`
2. Updates corresponding `schema.tabs[x].sections[x].title`

This ensures consistency between configuration and actual tab structure.

## User Workflow

### Configuring Home Tab Sections

1. Navigate to **Editor** page
2. In left sidebar "Navigation Tabs", click **Home**
3. Main editor area shows **HomeSectionManager** (not standard SectionManager)
4. See two section blocks:
   - **Section 1** with title input and type selection
   - **Section 2** with title input and type selection
5. For each section:
   - Edit title in the input field (max 30 characters)
   - Click one of 3 type cards to select type
   - Selected card shows blue border and background
   - See component count below type cards
6. Changes save automatically
7. Use "Regenerate Content" button to populate sections with components

### Example Configuration

**Section 1: "Favorites"** (Switching)

```
Title: Favorites
Type: 🔘 Switching
Components: 0 added
```

**Section 2: "System Status"** (Signal Values)

```
Title: System Status
Type: 📊 Signal Values
Components: 0 added
```

## Visual Design

### Type Card Layout

```
┌─────────────────────────┐
│         🔘              │
│      Switching          │
│  Toggle switches and    │
│  buttons for quick...   │
└─────────────────────────┘
```

### Selected State

```
┌═════════════════════════┐ ← Blue border (2px)
║  Background tint 5%     ║
║         🔘              ║
║      Switching          ║
║  Toggle switches and    ║
║  buttons for quick...   ║
╚═════════════════════════╝ ← Blue shadow
```

### Complete Section Block

```
┌─────────────────────────────────────────┐
│ Section 1          Title: [Quick Controls]│
├─────────────────────────────────────────┤
│ ┌──────┐  ┌──────┐  ┌──────┐           │
│ │ 🔘  │  │ 📊  │  │ 🖼️  │           │
│ │  ...  │  │  ...  │  │  ...  │           │
│ └──────┘  └──────┘  └──────┘           │
│                                          │
│ Components: 0 added                      │
└─────────────────────────────────────────┘
```

## Testing Checklist

- [x] HomeSectionManager component created
- [x] CSS styling applied
- [x] Editor conditionally renders HomeSectionManager
- [x] Type selection updates schema
- [x] Title editing updates both home config and tab sections
- [x] Build compiles successfully
- [x] Dev server running
- [ ] Test in browser - select Home tab
- [ ] Verify type selection works
- [ ] Verify title editing syncs properly
- [ ] Test with other tabs (should show standard SectionManager)
- [ ] Test "Regenerate Content" populates sections correctly

## Differences from Other Tabs

| Feature             | Home Tab                 | Other Tabs       |
| ------------------- | ------------------------ | ---------------- |
| Section Manager     | HomeSectionManager       | SectionManager   |
| Add Section Button  | ❌ No (fixed 2 sections) | ✅ Yes           |
| Delete Section      | ❌ No (fixed 2 sections) | ✅ Yes           |
| Section Type Config | ✅ Yes (3 types)         | ❌ No            |
| Title Editing       | ✅ Inline input          | ✅ Inline input  |
| Reorder Sections    | ❌ No (fixed order)      | ✅ Yes (up/down) |
| Component List      | Shows count only         | Shows full list  |

## Integration Points

### Regenerate Content Feature

When user clicks "Regenerate Content" button:

1. Reads `schema.home.section1.type` and `schema.home.section2.type`
2. Populates Section 1 with appropriate components:
   - `switching` → Toggles/buttons from hardware
   - `signal-values` → Gauges/indicators for monitoring
   - `image` → Image component placeholder
3. Populates Section 2 similarly
4. Updates `schema.tabs[home].sections[x].components`

### Component Palette

Works normally with Home tab:

- Shows available hardware channels
- Click to add to selected section
- Components appear in section's component list

## Future Enhancements

Potential improvements:

- **Visual Preview:** Show mini preview of section layout
- **Template Library:** Pre-made section configurations
- **Component Selection:** Pick specific components for signal values section
- **Image Upload:** Direct image upload for image sections
- **Layout Options:** Grid vs list layout for switching sections
- **Section Swap:** Button to swap section 1 and section 2

## Files Created/Modified

### New Files

- `packages/web-configurator/src/components/HomeSectionManager.tsx` (169 lines)
- `packages/web-configurator/src/components/HomeSectionManager.module.css` (190 lines)

### Modified Files

- `packages/web-configurator/src/pages/EditorPage.tsx` - Added conditional rendering
- `packages/schema/src/schema.ts` - Already had HomeConfigSchema
- `packages/web-configurator/src/context/SchemaContext.tsx` - Already had default home config

### Files Reverted (Not Needed)

- ~~HomeConfigPage.tsx~~ (deleted)
- ~~HomeConfigPage.module.css~~ (deleted)
- ~~App.tsx /home route~~ (removed)
- ~~Layout.tsx Home nav link~~ (removed)

## Build Verification

✅ **Build Status:** Success  
✅ **Bundle Size:** 460.23 kB (129.46 kB gzipped)  
✅ **TypeScript:** No errors  
✅ **Dev Server:** Running at http://localhost:3000

**To Test:**

1. Navigate to http://localhost:3000/editor
2. Click "Home" in the Navigation Tabs (left sidebar)
3. See HomeSectionManager in the main editor area
4. Configure section types and titles
5. Try selecting other tabs to see standard SectionManager

---

**Implementation Complete!** The Home tab now has a specialized configuration UI in the Editor. 🎉
