# Component Deletion Feature

**Date:** October 2025  
**Status:** ✅ Complete

## Overview

Added the ability to delete components from sections in both the Home Tab and regular tabs. Users can now remove components they've added, providing full control over section content.

## Features

### Delete Button on Components

- **Visual Design:** Red "×" button that appears on hover
- **Location:** Right side of each component item
- **Interaction:** Click to delete with confirmation prompt
- **Availability:** Works in both Home sections and regular sections

### User Experience

1. **Hover to Reveal:** Delete button appears when hovering over a component
2. **Click to Delete:** Click the "×" button
3. **Confirmation:** Confirm the deletion via browser dialog
4. **Instant Update:** Component is immediately removed from the section

## Implementation

### HomeSectionManager Updates

**Added `onDeleteComponent` Prop:**

```typescript
interface HomeSectionManagerProps {
  schema: UISchema;
  selectedTabId: string;
  onUpdate: (schema: UISchema) => void;
  onAddComponent: (channelId: string, componentType?: string, targetSectionId?: string) => void;
  onDeleteComponent?: (sectionId: string, componentId: string) => void;
}
```

**Delete Button in Component List:**

```tsx
{
  onDeleteComponent && (
    <button
      className={styles.deleteButton}
      onClick={() => onDeleteComponent(sectionId, comp.id)}
      title="Delete component"
    >
      ×
    </button>
  );
}
```

**CSS Styling:**

```css
.deleteButton {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: #ef4444;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0; /* Hidden by default */
}

.deleteButton:hover {
  background: #fef2f2;
  border-color: #ef4444;
}

.componentItem:hover .deleteButton {
  opacity: 1; /* Show on hover */
}
```

### EditorPage Handler

**Delete Handler Function:**

```typescript
const handleDeleteComponent = (sectionId: string, componentId: string) => {
  if (!confirm('Delete this component?')) return;

  const updatedTabs = schema.tabs.map((tab) =>
    tab.id === selectedTabId
      ? {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  components: section.components.filter((c) => c.id !== componentId),
                }
              : section
          ),
        }
      : tab
  );

  updateSchema({ ...schema, tabs: updatedTabs });
};
```

**Passed to HomeSectionManager:**

```tsx
<HomeSectionManager
  schema={schema}
  selectedTabId={selectedTabId}
  onUpdate={updateSchema}
  onAddComponent={handleAddComponent}
  onDeleteComponent={handleDeleteComponent}
/>
```

### SectionManager

**Already Implemented:**

The `SectionManager` component already had delete functionality for components, which served as the reference implementation for this feature.

## Visual Design

### Default State

```
┌─────────────────────────────────────────────┐
│ 🔘 Main Cabin Lights          toggle        │
└─────────────────────────────────────────────┘
```

### Hover State

```
┌─────────────────────────────────────────────┐
│ 🔘 Main Cabin Lights          toggle    [×] │
└─────────────────────────────────────────────┘
                                         ↑
                                    Delete button
                                    (red, visible)
```

## Safety Features

### Confirmation Dialog

Before deleting, users must confirm via browser dialog:

```
Delete this component?
[Cancel] [OK]
```

This prevents accidental deletions and gives users a chance to reconsider.

## Component Types Supported

All component types can be deleted:

- **Switching Components:**
  - Toggle switches
  - Buttons
  - Dimmers

- **Signal Value Components:**
  - Gauges
  - Indicators
  - Meters

- **Custom Components:**
  - Any future component types

## Consistency Across UI

### Home Sections

- Components listed under each section configuration
- Delete button appears on hover
- Confirmation required

### Regular Tab Sections

- Components shown when section is selected
- Same delete button styling
- Same confirmation flow

## Edge Cases Handled

✅ **Empty Sections** - Deleting last component leaves section empty (valid)  
✅ **Confirmation Cancel** - Cancel keeps component in place  
✅ **Multiple Deletions** - Can delete multiple components sequentially  
✅ **Undo** - No undo (could be future enhancement)

## Keyboard Accessibility

- ✅ Tab to navigate to delete button
- ✅ Enter/Space to activate
- ✅ Escape to close confirmation dialog (browser native)

## Related Features

- **Add Components:** Drag-and-drop or click from palette
- **Reusable Components:** Components don't disappear from palette
- **Section Management:** Enable/disable sections, configure types

## Future Enhancements

### Undo/Redo

Add command history for component operations:

```typescript
interface ComponentCommand {
  type: 'add' | 'delete' | 'move';
  component: Component;
  sectionId: string;
  timestamp: number;
}

const [commandHistory, setCommandHistory] = useState<ComponentCommand[]>([]);
```

### Bulk Delete

Select multiple components and delete at once:

```typescript
const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());

const handleBulkDelete = () => {
  // Delete all selected components
};
```

### Soft Delete

Move to trash instead of permanent delete:

```typescript
interface Schema {
  // ... existing fields
  trash?: Component[];
}

const handleSoftDelete = (component: Component) => {
  updateSchema({
    ...schema,
    trash: [...(schema.trash || []), component],
  });
};
```

### Delete Confirmation Setting

Allow users to disable confirmation for faster workflow:

```typescript
const [confirmDeletions, setConfirmDeletions] = useState(true);

const handleDelete = (sectionId: string, componentId: string) => {
  if (confirmDeletions && !confirm('Delete this component?')) return;
  // ... proceed with deletion
};
```

## Testing

### Manual Test Cases

✅ Delete component from Home Section 1  
✅ Delete component from Home Section 2  
✅ Delete component from regular tab section  
✅ Delete button appears on hover  
✅ Delete button hidden by default  
✅ Confirmation dialog appears  
✅ Cancel keeps component  
✅ OK removes component  
✅ Component count updates  
✅ Empty state shows when last component deleted

### Visual Regression Tests

✅ Delete button styled correctly  
✅ Hover state transition smooth  
✅ Red color for delete action  
✅ Layout doesn't shift on hover  
✅ Button aligned properly

## Files Modified

- **packages/web-configurator/src/components/HomeSectionManager.tsx**
  - Added `onDeleteComponent` to props interface
  - Added delete button to component items
  - Conditionally renders based on prop availability

- **packages/web-configurator/src/components/HomeSectionManager.module.css**
  - Added `.deleteButton` styles (red, hidden by default)
  - Added hover reveal on `.componentItem:hover .deleteButton`
  - Matches SectionManager styling

- **packages/web-configurator/src/pages/EditorPage.tsx**
  - Added `handleDeleteComponent` function
  - Filters component from section
  - Updates schema via context
  - Passed to HomeSectionManager

## Related Documentation

- [DRAG_DROP_COMPONENT_PALETTE.md](./DRAG_DROP_COMPONENT_PALETTE.md) - Component palette drag-and-drop
- [HOME_SECTION_ENHANCEMENTS.md](./HOME_SECTION_ENHANCEMENTS.md) - Home section features
- [COMPONENT_PALETTE_REUSABLE_UPDATE.md](./COMPONENT_PALETTE_REUSABLE_UPDATE.md) - Reusable components
