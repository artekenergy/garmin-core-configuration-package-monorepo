# Home Section Selection Enhancement

**Date:** October 2025  
**Status:** ✅ Complete

## Overview

Enhanced the Home tab sections in the Editor to make selection state clearly visible. Users now have clear visual feedback about which section is currently selected.

## Visual Indicators

### 1. Selected State Styling

**Border & Background:**

- Selected section has primary color border (blue)
- Light blue background tint (rgba(59, 130, 246, 0.03))
- Box shadow with blue glow

**Checkmark Badge:**

- ✓ checkmark icon in top-right corner
- White checkmark on blue circular background
- Position: absolute at top-right

**"Selected" Badge:**

- Small badge next to section number in header
- Blue background with white text
- Uppercase "SELECTED" text

### 2. Hover State

All sections show hover effect:

- Border changes to primary color
- Slight box shadow
- Indicates sections are clickable

### 3. Disabled State

Disabled sections:

- 50% opacity
- No hover effect
- Cursor changes to default (not clickable)

## Implementation

### HomeSectionManager Props

**Added Selection Props:**

```typescript
interface HomeSectionManagerProps {
  schema: UISchema;
  selectedTabId: string;
  onUpdate: (schema: UISchema) => void;
  onAddComponent: (channelId: string, componentType?: string, targetSectionId?: string) => void;
  onDeleteComponent?: (sectionId: string, componentId: string) => void;
  selectedSectionId: string | null; // NEW
  onSelectSection: (sectionId: string) => void; // NEW
}
```

### Section Block Updates

**Clickable with Selected State:**

```tsx
const isSelected = selectedSectionId === sectionId;

<div
  className={`${styles.sectionBlock}
    ${!isEnabled ? styles.disabled : ''}
    ${isDragOver ? styles.dragOver : ''}
    ${isSelected ? styles.selected : ''}`}
  onClick={() => onSelectSection(sectionId)}
  // ... drag handlers
>
```

**Section Header with Badge:**

```tsx
<h4>
  Section {sectionNum}
  {isSelected && <span className={styles.selectedBadge}>Selected</span>}
</h4>
```

**Prevent Event Bubbling:**

Interactive elements stop propagation to avoid selecting when clicking inputs:

```tsx
<label className={styles.toggleSwitch} onClick={(e) => e.stopPropagation()}>
  {/* Toggle content */}
</label>

<div className={styles.titleInput} onClick={(e) => e.stopPropagation()}>
  {/* Input content */}
</div>

<div className={styles.typeGrid} onClick={(e) => e.stopPropagation()}>
  {/* Type cards */}
</div>
```

### CSS Styling

**Base Section Block:**

```css
.sectionBlock {
  padding: 1.25rem;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}

.sectionBlock:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
```

**Selected State:**

```css
.sectionBlock.selected {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.03);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.sectionBlock.selected::before {
  content: '✓';
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  z-index: 1;
}
```

**Selected Badge:**

```css
.selectedBadge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary);
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Disabled State:**

```css
.sectionBlock.disabled {
  opacity: 0.5;
  background: var(--color-surface);
  cursor: default;
}

.sectionBlock.disabled:hover {
  border-color: var(--color-border);
  box-shadow: none;
}
```

### EditorPage Integration

**Pass Selection Props:**

```tsx
<HomeSectionManager
  schema={schema}
  selectedTabId={selectedTabId}
  onUpdate={updateSchema}
  onAddComponent={handleAddComponent}
  onDeleteComponent={handleDeleteComponent}
  selectedSectionId={selectedSectionId} // Pass selected section
  onSelectSection={setSelectedSectionId} // Pass selection handler
/>
```

## User Experience

### Before

- No clear indication which section was active
- Users had to remember which section they were working with
- Clicking sections had no visual feedback

### After

**Visual Feedback:**

1. Click Section 1 → Blue border, checkmark badge, "SELECTED" badge
2. Click Section 2 → Section 1 returns to normal, Section 2 shows selected state
3. Hover any section → Border changes to indicate clickability

**Clear State:**

- At a glance, users can see which section is selected
- Multiple visual cues (border, background, checkmark, badge)
- Consistent with existing section selection in regular tabs

## Visual Comparison

### Unselected Section

```
┌────────────────────────────────────┐
│ Section 1           ○ Enabled      │
│ ────────────────────────────────── │
│ Title: [Quick Controls         ]   │
│                                    │
│ [🔘 Switching] [📊 Signal Values]  │
└────────────────────────────────────┘
  ↑ Gray border, white background
```

### Selected Section

```
┌────────────────────────────────────┐✓
│ Section 1 [SELECTED]   ○ Enabled   │
│ ────────────────────────────────── │
│ Title: [Quick Controls         ]   │
│                                    │
│ [🔘 Switching] [📊 Signal Values]  │
└────────────────────────────────────┘
  ↑ Blue border, light blue tint, glow
  ↑ Blue checkmark in top-right corner
  ↑ "SELECTED" badge in header
```

### Hover State

```
┌────────────────────────────────────┐
│ Section 2           ○ Enabled      │ ← Cursor: pointer
│ ────────────────────────────────── │
│ Title: [Status                 ]   │
│                                    │
│ [🔘 Switching] [📊 Signal Values]  │
└────────────────────────────────────┘
  ↑ Blue border on hover, slight shadow
```

## Interaction Flow

1. **User opens Home tab in Editor**
   - No section selected initially (or first section auto-selected)
   - Both sections show normal state

2. **User clicks Section 1**
   - Section 1 shows selected styling
   - Component Palette filters to Section 1's type
   - User can add components

3. **User clicks Section 2**
   - Section 1 returns to normal
   - Section 2 shows selected styling
   - Component Palette filters to Section 2's type

4. **User clicks input fields**
   - Section stays selected
   - Events don't bubble to section click handler

5. **User clicks type cards**
   - Section stays selected
   - Type changes, palette updates

## Accessibility

### Keyboard Navigation

- ✅ Sections are focusable (clickable divs)
- ✅ Enter/Space could activate (browser default for click)
- ✅ Visual focus state (browser default)

### Screen Readers

- Announce: "Section 1 Selected" when badge present
- Checkmark is decorative (CSS ::before, not announced)
- Clear section titles

### ARIA Enhancements (Future)

Could add explicit ARIA attributes:

```tsx
<div
  role="button"
  aria-pressed={isSelected}
  aria-label={`Section ${sectionNum}${isSelected ? ', selected' : ''}`}
  tabIndex={0}
  onClick={() => onSelectSection(sectionId)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectSection(sectionId);
    }
  }}
>
```

## Edge Cases Handled

✅ **Clicking toggle** - Event stopped, doesn't select section  
✅ **Clicking input** - Event stopped, doesn't select section  
✅ **Clicking type cards** - Event stopped, doesn't select section  
✅ **Disabled section** - No cursor change, no selection possible  
✅ **Drag-and-drop** - Works alongside selection  
✅ **No section selected** - All show unselected state

## Related Features

- **Component Palette Filtering** - Uses selected section to filter components
- **Drag-and-Drop** - Can drop to specific section (selected or not)
- **Section Management** - Regular tabs already had selection UI

## Files Modified

- **packages/web-configurator/src/components/HomeSectionManager.tsx**
  - Added `selectedSectionId` and `onSelectSection` props
  - Added `isSelected` check in render
  - Added `onClick` handler to section block
  - Added selected badge in header
  - Added `stopPropagation` to interactive elements

- **packages/web-configurator/src/components/HomeSectionManager.module.css**
  - Added `.selected` class styles
  - Added `::before` checkmark badge
  - Added `.selectedBadge` styles
  - Added hover styles
  - Made section block `cursor: pointer`

- **packages/web-configurator/src/pages/EditorPage.tsx**
  - Passed `selectedSectionId` to HomeSectionManager
  - Passed `onSelectSection={setSelectedSectionId}` to HomeSectionManager

## Future Enhancements

### Auto-Select First Section

Auto-select first enabled section on tab open:

```typescript
useEffect(() => {
  if (selectedTabId === 'tab-home' && !selectedSectionId) {
    const firstSection = schema.tabs.find((t) => t.id === 'tab-home')?.sections[0];
    if (firstSection) {
      setSelectedSectionId(firstSection.id);
    }
  }
}, [selectedTabId]);
```

### Keyboard Navigation

Add arrow key navigation between sections:

```typescript
const handleKeyDown = (e: KeyboardEvent, sectionNum: number) => {
  if (e.key === 'ArrowDown' && sectionNum === 1) {
    onSelectSection(section2Id);
  } else if (e.key === 'ArrowUp' && sectionNum === 2) {
    onSelectSection(section1Id);
  }
};
```

### Selection Persistence

Remember last selected section:

```typescript
localStorage.setItem('lastSelectedHomeSection', sectionId);
```

## Testing

### Manual Test Cases

✅ Click Section 1 → shows selected state  
✅ Click Section 2 → Section 1 deselected, Section 2 selected  
✅ Click toggle → section stays selected, toggle changes  
✅ Click title input → section stays selected, can type  
✅ Click type card → section stays selected, type changes  
✅ Hover section → border highlights  
✅ Disabled section → no hover, no click  
✅ Checkmark badge appears when selected  
✅ "SELECTED" badge appears in header  
✅ Component Palette filters match selected section

## Related Documentation

- [SECTION_TYPE_FILTERING.md](./SECTION_TYPE_FILTERING.md) - Component filtering
- [HOME_SECTION_ENHANCEMENTS.md](./HOME_SECTION_ENHANCEMENTS.md) - Home section features
- [DRAG_DROP_COMPONENT_PALETTE.md](./DRAG_DROP_COMPONENT_PALETTE.md) - Drag-and-drop
