# Read-Only Tabs Feature

## Overview

The Editor page now distinguishes between **editable tabs** (where users can manually add/remove components) and **read-only tabs** (where content is auto-generated from system configurations).

## Implementation Date

January 2025

## Affected Tabs

### Read-Only Tabs (Auto-Generated)

- **Power Tab** (`tab-power`) - ⚡
  - Generated from power system configuration
  - Displays power management components
  - Cannot be edited directly

- **HVAC Tab** (`tab-hvac`) - ❄️
  - Generated from HVAC system configuration
  - Displays HVAC control components
  - Cannot be edited directly

### Editable Tabs (Manual Configuration)

- **Home Tab** (`tab-home`) - 🏠
  - Two configurable sections with type selection
  - Sections can be switching, signal-values, or image types
  - Full component management

- **Lighting Tab** (`tab-lighting`) - 💡
  - Interior and exterior sections
  - Enable/disable sections
  - Full component management

- **Other Tabs** - Custom tabs created by users
  - Standard section management
  - Add/remove/reorder sections
  - Full component management

## User Experience

### When Viewing Read-Only Tab

1. **Main Editor Area**: Displays `ReadOnlySectionView` component showing:
   - Clear header with tab name and description
   - Info box explaining the auto-generated nature
   - Preview of all sections with:
     - Section number and title
     - Component count
     - First 3 components with icons
     - "+N more" indicator for additional components
   - Action guidance cards:
     - "Configure System" - explains how to modify via config
     - "Regenerate Content" - explains the regeneration process

2. **Component Palette**: Hidden and replaced with a message explaining:
   - The tab is read-only
   - Components cannot be added directly
   - How to modify the content (via system config or regenerate)

3. **Tab Management**: Users can still:
   - Toggle the tab on/off
   - Reorder tabs
   - View tab in preview mode

### When Viewing Editable Tab

Normal editing experience with:

- Component palette visible
- Section management available
- Drag-and-drop enabled
- Add/delete components enabled

## Technical Implementation

### Files Created/Modified

1. **New Component**: `ReadOnlySectionView.tsx`
   - Displays read-only preview of auto-generated tabs
   - Shows sections, components, and guidance
   - Props: `schema`, `selectedTabId`, `tabName`, `description`, `icon`

2. **New Styles**: `ReadOnlySectionView.module.css`
   - Info box with icon and content
   - Section cards with numbering
   - Component chips with icons
   - Action guidance cards
   - Responsive layout

3. **Modified**: `EditorPage.tsx`
   - Imported `ReadOnlySectionView`
   - Added conditional rendering for `tab-power` and `tab-hvac`
   - Hides component palette for read-only tabs
   - Shows read-only message in right sidebar

4. **Modified**: `EditorPage.module.css`
   - Added `.readOnlyMessage` styles
   - Styled lock icon and informational text

### Conditional Logic

```typescript
// In EditorPage.tsx
{selectedTabId === 'tab-power' ? (
  <ReadOnlySectionView
    schema={schema}
    selectedTabId={selectedTabId}
    tabName="Power Management"
    description="Auto-generated from power system configuration..."
    icon="⚡"
  />
) : selectedTabId === 'tab-hvac' ? (
  <ReadOnlySectionView
    schema={schema}
    selectedTabId={selectedTabId}
    tabName="HVAC System"
    description="Auto-generated from HVAC system configuration..."
    icon="❄️"
  />
) : (
  // Regular editable section managers
)}
```

## Benefits

1. **Clarity**: Users clearly understand which tabs are editable vs auto-generated
2. **Consistency**: Auto-generated content stays in sync with system config
3. **Guidance**: Users know how to modify content properly
4. **Prevention**: Eliminates confusion about manual edits conflicting with config
5. **Transparency**: Users can see current content without editing capability

## Future Enhancements

Potential improvements:

- Add "Configure" button that navigates to system config page
- Add "Regenerate" button in the read-only view itself
- Show last regeneration timestamp
- Display source configuration file path
- Add comparison view between current and potential regenerated content

## Related Documentation

- [Editor Tab Drag & Drop](./EDITOR_TAB_DRAG_DROP.md)
- [Component Deletion Feature](./COMPONENT_DELETION_FEATURE.md)
- [Power Subsystem Complete](./POWER_SUBSYSTEM_COMPLETE.md)
- [HVAC Subsystem Complete](./HVAC_SUBSYSTEM_COMPLETE.md)
- [Hardware Config Implementation](./HARDWARE_CONFIG_IMPLEMENTATION.md)

## Testing Checklist

- [ ] Navigate to Power tab → verify read-only view displays
- [ ] Navigate to HVAC tab → verify read-only view displays
- [ ] Verify component palette hidden for read-only tabs
- [ ] Verify read-only message appears in right sidebar
- [ ] Check section preview shows correct sections
- [ ] Check component chips display first 3 components
- [ ] Verify "+N more" indicator for sections with >3 components
- [ ] Test tab toggle still works for read-only tabs
- [ ] Test tab reordering still works for read-only tabs
- [ ] Navigate to Home tab → verify normal editing works
- [ ] Navigate to Lighting tab → verify normal editing works
- [ ] Navigate to custom tab → verify normal editing works
- [ ] Verify regenerate button updates read-only tabs
- [ ] Check responsive layout on smaller screens
