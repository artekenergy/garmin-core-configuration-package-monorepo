# Drag-and-Drop Component Palette

**Date:** January 2025  
**Status:** ✅ Complete

## Overview

Implemented full drag-and-drop functionality for adding components from the Component Palette to sections. Users can now either click components or drag them directly into target sections, providing a more intuitive and efficient workflow.

## Key Features

### 1. Draggable Component Items

All components in the Component Palette are now draggable:

- **Visual Feedback:** Cursor changes from `grab` to `grabbing` during drag
- **Data Transfer:** Component information (channelId, componentType) sent via drag event
- **Copy Effect:** Shows copy cursor indicating component won't be removed from palette

### 2. Drop Zones

Both section managers accept drops:

- **HomeSectionManager:** Sections 1 and 2 as drop targets
- **SectionManager:** All sections in any tab as drop targets
- **Visual Indication:** Dashed blue border and highlighted background when dragging over
- **Smart Targeting:** Automatically adds component to the correct section

### 3. Dual Interaction Methods

Users can add components two ways:

- **Click:** Original method - click component in palette (uses selected section)
- **Drag & Drop:** New method - drag component to specific section
- **Flexibility:** Both methods work identically, user preference

## Implementation

### Component Palette Updates

**Made Items Draggable:**

```tsx
<div
  className={styles.paletteItem}
  draggable
  onDragStart={(e) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        channelId: channel.id,
        componentType: 'switching',
      })
    );
  }}
  onClick={() => onAddComponent(channel.id, 'switching')}
  title={`Drag to section or click to add ${componentType}`}
>
  {/* Component content */}
</div>
```

**Key Properties:**

- `draggable={true}` - Makes element draggable
- `onDragStart` - Captures component data
- `e.dataTransfer.setData()` - Stores channel ID and type
- `e.dataTransfer.effectAllowed = 'copy'` - Shows copy cursor

**CSS Updates:**

```css
.paletteItem {
  cursor: grab;
  user-select: none;
}

.paletteItem:active {
  cursor: grabbing;
}
```

### HomeSectionManager Drop Zones

**State Management:**

```typescript
const [dragOverSection, setDragOverSection] = useState<string | null>(null);
```

**Drop Handlers:**

```typescript
const handleDrop = (e: React.DragEvent, sectionId: string) => {
  e.preventDefault();
  e.stopPropagation();
  setDragOverSection(null);

  try {
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    if (data.channelId && data.componentType) {
      onAddComponent(data.channelId, data.componentType, sectionId);
    }
  } catch (error) {
    console.error('Failed to parse drop data:', error);
  }
};

const handleDragOver = (e: React.DragEvent, sectionId: string) => {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy';
  setDragOverSection(sectionId);
};

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.currentTarget === e.target) {
    setDragOverSection(null);
  }
};
```

**Section Block with Drop Zone:**

```tsx
<div
  className={`${styles.sectionBlock} ${isDragOver ? styles.dragOver : ''}`}
  onDrop={(e) => handleDrop(e, sectionId)}
  onDragOver={(e) => handleDragOver(e, sectionId)}
  onDragLeave={handleDragLeave}
>
  {/* Section content */}
</div>
```

**CSS for Drag Over State:**

```css
.sectionBlock.dragOver {
  border-color: var(--color-primary);
  border-style: dashed;
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: scale(1.01);
}
```

### SectionManager Drop Zones

**Same pattern applied to regular sections:**

```typescript
// State
const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);

// Handlers (identical to HomeSectionManager)
const handleDrop = (e: React.DragEvent, sectionId: string) => {
  // ... same implementation
  onAddComponent(data.channelId, data.componentType, sectionId);
};

// Section item with drop zone
<div
  className={`${styles.sectionItem} ${isDragOver ? styles.dragOver : ''}`}
  onDrop={(e) => handleDrop(e, section.id)}
  onDragOver={(e) => handleDragOver(e, section.id)}
  onDragLeave={handleDragLeave}
>
  {/* Section content */}
</div>
```

**CSS:**

```css
.sectionItem.dragOver {
  border-color: var(--color-primary);
  border-style: dashed;
  background: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: scale(1.02);
}
```

### EditorPage Updates

**Enhanced `handleAddComponent`:**

```typescript
const handleAddComponent = (
  channelId: string,
  componentType?: string,
  targetSectionId?: string
) => {
  // Use targetSectionId if provided (from drag-drop), otherwise use selectedSectionId
  const sectionId = targetSectionId || selectedSectionId;

  if (!selectedTabId || !sectionId) {
    alert('Please select a section first');
    return;
  }

  // ... component creation logic

  // Add component to target section
  const updatedTabs = schema.tabs.map((tab) =>
    tab.id === selectedTabId
      ? {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === sectionId
              ? { ...section, components: [...section.components, newComponent] }
              : section
          ),
        }
      : tab
  );

  updateSchema({ ...schema, tabs: updatedTabs });
};
```

**Passed to Both Managers:**

```tsx
{
  selectedTabId === 'tab-home' ? (
    <HomeSectionManager
      schema={schema}
      selectedTabId={selectedTabId}
      onUpdate={updateSchema}
      onAddComponent={handleAddComponent}
    />
  ) : (
    <SectionManager
      schema={schema}
      selectedTabId={selectedTabId}
      onUpdate={updateSchema}
      onSelectSection={setSelectedSectionId}
      selectedSectionId={selectedSectionId}
      onAddComponent={handleAddComponent}
    />
  );
}
```

## User Experience

### Visual Flow

1. **Palette Item:**
   - Default: `cursor: grab`
   - Hover: Slight transform
   - Active drag: `cursor: grabbing`

2. **During Drag:**
   - Dragged item follows cursor
   - Target sections highlight with dashed border
   - Blue tint and glow effect on valid drop zones

3. **On Drop:**
   - Highlight instantly disappears
   - Component added to section
   - Component list updates immediately
   - Original item remains in palette (reusable)

### Interaction Methods Comparison

| Method          | Section Selection         | Speed                   | Precision    |
| --------------- | ------------------------- | ----------------------- | ------------ |
| **Click**       | Must select section first | Faster for batch adding | Less precise |
| **Drag & Drop** | Implicit via drop target  | Slightly slower         | More precise |

### Best Practices for Users

**Use Click When:**

- Adding multiple components to the same section
- Section is already selected
- Working quickly with keyboard navigation

**Use Drag-and-Drop When:**

- Adding components to different sections
- Visual workflow preferred
- Precise placement matters
- No section pre-selected

## Technical Details

### Data Transfer Protocol

**Drag Data Structure:**

```json
{
  "channelId": "empirbus-core-0-0",
  "componentType": "switching"
}
```

or

```json
{
  "channelId": "battery-voltage",
  "componentType": "signal-value"
}
```

### Event Flow

1. **onDragStart** (Palette Item)
   - Sets `effectAllowed = 'copy'`
   - Serializes component data to JSON
   - Stores in `dataTransfer`

2. **onDragOver** (Drop Zone)
   - Prevents default (allows drop)
   - Sets `dropEffect = 'copy'`
   - Updates drag-over state
   - Applies visual feedback

3. **onDragLeave** (Drop Zone)
   - Clears drag-over state
   - Removes visual feedback
   - Guards against nested element events

4. **onDrop** (Drop Zone)
   - Prevents default
   - Parses JSON data
   - Calls `onAddComponent` with target section
   - Clears drag-over state

### Browser Compatibility

Uses HTML5 Drag and Drop API:

- ✅ Chrome/Edge 4+
- ✅ Firefox 3.5+
- ✅ Safari 3.1+
- ✅ Opera 12+
- ⚠️ Mobile browsers (limited support, click still works)

### Performance Considerations

- **Minimal Re-renders:** Only drag-over section re-renders during drag
- **Event Delegation:** Single handler per section
- **JSON Parsing:** Only on drop, not during drag
- **CSS Transitions:** GPU-accelerated transform and opacity

## Accessibility

### Keyboard Support

For users who can't drag-and-drop:

- ✅ Click method fully functional
- ✅ Keyboard navigation works
- ✅ Enter/Space to add component
- ⚠️ No keyboard-only drag-and-drop (HTML5 limitation)

### Screen Readers

- Drop zones announced as interactive regions
- Component additions announced via live region updates
- Titles describe drag-and-drop capability

### ARIA Attributes

```tsx
<div role="button" aria-label={`${channel.label} - Drag to section or click to add`} tabIndex={0}>
  {/* Component */}
</div>
```

## Edge Cases Handled

✅ **Invalid Drop Target** - Prevented via event handlers  
✅ **Drag Outside Application** - Cleaned up via dragLeave  
✅ **Multiple Rapid Drags** - State properly reset each time  
✅ **Disabled Sections** - Still accept drops (section becomes target)  
✅ **No Section Selected** - Drop still works via targetSectionId  
✅ **Malformed Data** - Try-catch prevents crashes

## Future Enhancements

### Component Reordering

Allow dragging components within sections:

```typescript
const handleComponentDrop = (fromIndex: number, toIndex: number) => {
  const reordered = arrayMove(components, fromIndex, toIndex);
  updateSection({ components: reordered });
};
```

### Cross-Section Dragging

Drag components between sections:

```typescript
onDragStart={(e) => {
  e.dataTransfer.setData('application/json', JSON.stringify({
    type: 'existing-component',
    componentId: comp.id,
    sourceSectionId: section.id
  }));
}}
```

### Drag Preview Customization

Custom drag image:

```typescript
onDragStart={(e) => {
  const dragImage = document.createElement('div');
  dragImage.textContent = `🔘 ${channel.label}`;
  document.body.appendChild(dragImage);
  e.dataTransfer.setDragImage(dragImage, 0, 0);
  setTimeout(() => document.body.removeChild(dragImage), 0);
}}
```

### Multi-Select Drag

Drag multiple components at once:

```typescript
const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());

onDragStart={(e) => {
  e.dataTransfer.setData('application/json', JSON.stringify({
    componentIds: Array.from(selectedComponents),
    componentType: 'bulk'
  }));
}}
```

## Testing

### Manual Test Cases

✅ Drag switching component to Home Section 1  
✅ Drag signal value to Home Section 2  
✅ Drag component to regular tab section  
✅ Drag over multiple sections (highlights correctly)  
✅ Drop on disabled section (still works)  
✅ Drag outside app (cleans up state)  
✅ Click still works alongside drag  
✅ Component appears in target section  
✅ Component count updates  
✅ Component list shows new item

### Visual Regression Tests

✅ Drag-over state shows dashed border  
✅ Transform animation smooth  
✅ No layout shift during drag  
✅ Cursor changes appropriately  
✅ Hover effects don't conflict with drag

## Files Modified

- **packages/web-configurator/src/components/ComponentPalette.tsx**
  - Changed `<button>` to `<div>` for drag support
  - Added `draggable`, `onDragStart` props
  - Updated help text to "Click or drag to add"
- **packages/web-configurator/src/components/ComponentPalette.module.css**
  - Added `cursor: grab` and `cursor: grabbing`
  - Added `user-select: none`
- **packages/web-configurator/src/components/HomeSectionManager.tsx**
  - Added `dragOverSection` state
  - Added `handleDrop`, `handleDragOver`, `handleDragLeave`
  - Added `onAddComponent` prop
  - Added drag handlers to section blocks
- **packages/web-configurator/src/components/HomeSectionManager.module.css**
  - Added `.dragOver` styles
- **packages/web-configurator/src/components/SectionManager.tsx**
  - Added `dragOverSectionId` state
  - Added drag handlers
  - Added `onAddComponent` prop
  - Added drag handlers to section items
- **packages/web-configurator/src/components/SectionManager.module.css**
  - Added `.dragOver` styles
- **packages/web-configurator/src/pages/EditorPage.tsx**
  - Updated `handleAddComponent` signature to accept `targetSectionId`
  - Passed `onAddComponent` to both managers

## Related Documentation

- [COMPONENT_PALETTE_REUSABLE_UPDATE.md](./COMPONENT_PALETTE_REUSABLE_UPDATE.md) - Reusable components
- [HOME_SECTION_ENHANCEMENTS.md](./HOME_SECTION_ENHANCEMENTS.md) - Home section features
- [EDITOR_TAB_DRAG_DROP.md](./EDITOR_TAB_DRAG_DROP.md) - Tab drag-and-drop
