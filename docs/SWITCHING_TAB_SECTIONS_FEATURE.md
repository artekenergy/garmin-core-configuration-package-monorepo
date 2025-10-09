# Switching Tab Sections Feature

## Overview

The Switching Tab has a unique **hybrid configuration model** where one section is fully customizable and the remaining sections are auto-generated based on accessory configurations.

## Implementation Date

October 2025

## Tab Structure

### 1. Configurable Section (Manual)

**Section 1: Custom Controls**

- ✅ Fully editable
- ✅ Supports **both** switching and signal-value components
- ✅ Drag-and-drop from component palette
- ✅ Add/delete components
- ✅ Fixed section title ("Custom Controls")
- ✅ Enable/disable toggle

**Unique Feature**: This is the **only section in the app** that accepts both switching components (buttons, sliders) AND signal-value components (gauges, indicators) in the same section.

### 2. Auto-Generated Sections (Read-Only)

These sections appear automatically based on **Accessories Configuration**:

#### Section 2: Control Keypad (🎹)

- Appears when: `accessories.keypad.enabled = true`
- Generated from: Keypad count and buttons configuration
- Components: Keypad control buttons
- Status: 🔒 Read-only

#### Section 3: Awning Control (☂️)

- Appears when: `accessories.awning.enabled = true`
- Generated from: Awning and light configuration
- Components: Awning extend/retract, light control
- Status: 🔒 Read-only

#### Section 4: Slide-Out Rooms (📐)

- Appears when: `accessories.slides.enabled = true`
- Generated from: Slide-out configuration
- Components: Slide controls, keypad security
- Status: 🔒 Read-only

## User Experience

### Configurable Section

1. **Section Selection**
   - Click section to select
   - Visual feedback: blue border, checkmark, "SELECTED" badge
   - Same selection indicators as Home/Lighting tabs

2. **Component Management**
   - Drag components from palette (both switching and signal types available)
   - Delete components via hover-revealed buttons
   - Empty state shows hint about dual component support

3. **Section Configuration**
   - Fixed section title ("Custom Controls")
   - Toggle section on/off
   - Changes persist immediately

### Auto-Generated Sections

1. **Visual Distinction**
   - "AUTO" tag on each auto-generated section
   - Slightly reduced opacity (0.95)
   - Lock icon (🔒) on each component
   - Cannot be selected or edited

2. **Info Box**
   - Blue info banner explains auto-generation
   - Clear messaging about source (Accessories Config)
   - Guidance on how to modify (via config page)

3. **Empty State**
   - Shows when no accessories enabled
   - Guides users to Accessories Config page
   - Explains how to generate these sections

### Component Palette Behavior

When custom section selected:

- **Shows ALL components** (switching + signal-values)
- No filtering applied
- User can add any type
- Hint indicates dual component support

When auto-generated section selected or no section selected:

- Palette remains available
- Cannot drop on auto-generated sections
- Visual feedback prevents confusion

## Technical Implementation

### Files Created

1. **Component**: `SwitchingSectionManager.tsx`
   - Manages both configurable and auto-generated sections
   - Props: schema, selectedTabId, onUpdate, onAddComponent, onDeleteComponent, selectedSectionId, onSelectSection
   - Renders custom section with full edit capability
   - Renders auto-generated sections conditionally

2. **Styles**: `SwitchingSectionManager.module.css`
   - Configurable section styles (matches Home/Lighting)
   - Auto-generated section styles (distinct visual treatment)
   - Info box styling
   - Component item layouts
   - Responsive design

### Files Modified

1. **Schema**: `packages/schema/src/schema.ts`
   - Added `SwitchingTabConfigSchema`
   - Added `switchingTab` to `UISchemaSchema`
   - Exported `SwitchingTabConfig` type
   - Schema structure:
     ```typescript
     switchingTab: {
       customSection: {
         enabled: boolean;
         title: string;
       }
     }
     ```

2. **EditorPage**: `packages/web-configurator/src/pages/EditorPage.tsx`
   - Imported `SwitchingSectionManager`
   - Added conditional rendering for `tab-switching`
   - Updated `getCurrentSectionType()` to return `null` for switching tab (shows both types)
   - Passes all necessary props to manager

### Schema Structure

```typescript
export const SwitchingTabConfigSchema = z
  .object({
    customSection: z
      .object({
        enabled: z.boolean().default(true),
        title: z.string().min(1).max(30).default('Custom Controls'),
      })
      .default({
        enabled: true,
        title: 'Custom Controls',
      }),
  })
  .default({
    customSection: { enabled: true, title: 'Custom Controls' },
  });

// In UISchemaSchema:
switchingTab: SwitchingTabConfigSchema.optional();
```

### Conditional Logic

```typescript
// In EditorPage.tsx
{selectedTabId === 'tab-switching' ? (
  <SwitchingSectionManager
    schema={schema}
    selectedTabId={selectedTabId}
    onUpdate={updateSchema}
    onAddComponent={handleAddComponent}
    onDeleteComponent={handleDeleteComponent}
    selectedSectionId={selectedSectionId}
    onSelectSection={setSelectedSectionId}
  />
) : // other tabs...
}
```

### Component Palette Filtering

```typescript
// For Switching tab custom section - show both types
if (selectedTabId === 'tab-switching') {
  const currentTab = schema.tabs.find((t) => t.id === selectedTabId);
  const customSection = currentTab?.sections[0];

  if (customSection?.id === selectedSectionId) {
    return null; // null means show all component types
  }
}
```

## Auto-Generation Logic

Auto-generated sections are created by the **tab generator utility** when:

1. User enables accessories in Accessories Config page
2. User clicks "Regenerate Content" button
3. Schema is loaded with accessories enabled

The sections are populated based on:

- `schema.accessories.keypad` → Keypad section
- `schema.accessories.awning` → Awning section
- `schema.accessories.slides` → Slide-out section

## Benefits

1. **Flexibility**: Custom section accepts any component type for maximum flexibility
2. **Automation**: Accessory sections auto-generate, saving configuration time
3. **Consistency**: Auto-generated sections stay in sync with accessory config
4. **Clarity**: Visual distinction between editable vs auto-generated
5. **Prevention**: Lock icons and read-only state prevent editing confusion
6. **Guidance**: Info boxes explain the system clearly

## Design Decisions

### Why Hybrid Model?

- **Custom section**: Users need flexibility for miscellaneous controls
- **Auto sections**: Accessories have standard patterns, better auto-generated
- **Dual component support**: Some users want switching + monitoring in same view

### Why Auto-Generate Accessories?

- Accessories have predictable UI patterns
- Configuration drives component creation
- Reduces manual setup burden
- Ensures consistency with system config

### Why Lock Auto-Generated Sections?

- Prevent conflicts between manual edits and config
- Clear separation of concerns
- Guides users to proper configuration location
- Maintains system integrity

## Future Enhancements

Potential improvements:

- Add preview of what would be generated
- "Sync from Config" button for manual refresh
- Show last sync timestamp
- Visual diff when config changes but not regenerated
- Batch operations for auto-generated components

## Related Documentation

- [Accessories Config Page](../packages/web-configurator/src/pages/AccessoriesConfigPage.tsx)
- [Read-Only Tabs Feature](./READ_ONLY_TABS_FEATURE.md)
- [Component Palette](./COMPONENT_PALETTE_REUSABLE_UPDATE.md)
- [Drag & Drop System](./EDITOR_TAB_DRAG_DROP.md)
- [Component Deletion](./COMPONENT_DELETION_FEATURE.md)

## Testing Checklist

### Configurable Section

- [ ] Navigate to Switching tab → verify custom section appears
- [ ] Select custom section → verify selection indicators
- [ ] Drag switching component → verify it adds successfully
- [ ] Drag signal-value component → verify it adds successfully
- [ ] Verify component palette shows both types
- [ ] Verify section title is fixed as "Custom Controls"
- [ ] Toggle section off → verify it disables
- [ ] Delete component → verify deletion works
- [ ] Verify empty state shows dual component hint

### Auto-Generated Sections

- [ ] Enable keypad in Accessories Config → regenerate → verify keypad section appears
- [ ] Enable awning in Accessories Config → regenerate → verify awning section appears
- [ ] Enable slides in Accessories Config → regenerate → verify slides section appears
- [ ] Verify "AUTO" tags visible on all auto sections
- [ ] Verify lock icons on all auto-generated components
- [ ] Try to select auto section → verify it's not selectable
- [ ] Try to drag to auto section → verify drop rejected
- [ ] Disable all accessories → verify "no accessories" message shows

### Integration

- [ ] Verify regenerate button updates auto sections
- [ ] Toggle tabs → verify state persists
- [ ] Save/load schema → verify switching config persists
- [ ] Check validation passes with mixed components
- [ ] Verify export includes switching tab configuration
- [ ] Test responsive layout on smaller screens

### Component Palette

- [ ] Custom section selected → verify both types visible
- [ ] Auto section selected → verify palette still available
- [ ] No section selected → verify palette shows default
- [ ] Switching components work correctly
- [ ] Signal-value components work correctly
