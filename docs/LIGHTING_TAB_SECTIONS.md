# Lighting Tab Section Configuration

**Date:** October 2025  
**Status:** ✅ Complete

## Overview

Implemented configurable sections for the Lighting tab, similar to the Home tab. Users can now enable/disable and configure interior and exterior lighting sections independently.

## Key Features

### Two Configurable Sections

**Interior Lights Section:**

- 💡 Icon indicator
- Configurable title (default: "Interior Lights")
- Enable/disable toggle
- Description: "Control interior lighting zones and dimmers"

**Exterior Lights Section:**

- 🌟 Icon indicator
- Configurable title (default: "Exterior Lights")
- Enable/disable toggle
- Description: "Control exterior and accent lighting"

### Section Management Features

- **Enable/Disable Toggles** - Turn sections on/off independently
- **Custom Titles** - Rename sections (max 30 characters)
- **Clear Selection State** - Visual indicators show selected section
- **Component Management** - Add/remove lighting controls
- **Drag-and-Drop Support** - Drop components from palette
- **Component Count** - Badge shows number of components

## Schema Implementation

### Lighting Tab Configuration

**Schema Structure:**

```typescript
export const LightingSectionConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().min(1).max(30).default('Section'),
});

export const LightingTabConfigSchema = z
  .object({
    interior: LightingSectionConfigSchema.default({
      enabled: true,
      title: 'Interior Lights',
    }),
    exterior: LightingSectionConfigSchema.default({
      enabled: true,
      title: 'Exterior Lights',
    }),
  })
  .default({
    interior: { enabled: true, title: 'Interior Lights' },
    exterior: { enabled: true, title: 'Exterior Lights' },
  });
```

**Type Exports:**

```typescript
export type LightingTabConfig = z.infer<typeof LightingTabConfigSchema>;
export type LightingSectionConfig = z.infer<typeof LightingSectionConfigSchema>;
```

**Added to UISchema:**

```typescript
export const UISchemaSchema = z.object({
  // ... other fields
  lightingTab: LightingTabConfigSchema.optional(),
  // ... other fields
});
```

## Component Implementation

### LightingSectionManager Component

**Props Interface:**

```typescript
interface LightingSectionManagerProps {
  schema: UISchema;
  selectedTabId: string;
  onUpdate: (schema: UISchema) => void;
  onAddComponent: (channelId: string, componentType?: string, targetSectionId?: string) => void;
  onDeleteComponent?: (sectionId: string, componentId: string) => void;
  selectedSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
}
```

**Key Functions:**

```typescript
// Update section configuration
const updateSection = (
  sectionKey: 'interior' | 'exterior',
  updates: Partial<{ enabled: boolean; title: string }>
) => {
  // Updates lightingTab config
  // Updates actual tab section titles
  // Triggers schema update
};

// Toggle section enabled state
const toggleSectionEnabled = (sectionKey: 'interior' | 'exterior') => {
  const currentSection = lightingTabConfig[sectionKey];
  updateSection(sectionKey, { enabled: !currentSection?.enabled });
};
```

**Drag-and-Drop Handlers:**

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
```

### EditorPage Integration

**Conditional Rendering:**

```typescript
{selectedTabId === 'tab-home' ? (
  <HomeSectionManager {...props} />
) : selectedTabId === 'tab-lighting' ? (
  <LightingSectionManager {...props} />
) : (
  <SectionManager {...props} />
)}
```

## User Interface

### Section Layout

**Interior Lights Section:**

```
┌──────────────────────────────────────────────┐ ✓
│ 💡 Interior Lights [SELECTED]  ○ Enabled    │
│ ──────────────────────────────────────────── │
│ ℹ Control interior lighting zones & dimmers  │
│                                              │
│ Section Title: [Interior Lights        ]    │
│                                              │
│ Components in this section:            [2]  │
│ ┌──────────────────────────────────────┐   │
│ │ 🎚️ Cabin Dimmer         dimmer   [×]│   │
│ │ 🔘 Reading Lights        toggle   [×]│   │
│ └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

**Exterior Lights Section:**

```
┌──────────────────────────────────────────────┐
│ 🌟 Exterior Lights           ○ Enabled      │
│ ──────────────────────────────────────────── │
│ ℹ Control exterior and accent lighting       │
│                                              │
│ Section Title: [Exterior Lights        ]    │
│                                              │
│ Components in this section:            [1]  │
│ ┌──────────────────────────────────────┐   │
│ │ 🔘 Patio Lights          toggle   [×]│   │
│ └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

### Visual States

**Selected Section:**

- Blue border
- Light blue background tint
- ✓ Checkmark badge in top-right
- "SELECTED" badge in header
- Box shadow with blue glow

**Disabled Section:**

- 50% opacity
- Gray background
- No hover effects
- Toggle shows "Disabled" state

**Drag-Over State:**

- Dashed blue border
- Blue background tint
- Scale transform (1.01)
- Clear drop zone indicator

## User Experience

### Configuration Workflow

1. **Navigate to Lighting Tab**
   - Click "Lighting" in tab list
   - LightingSectionManager loads

2. **Select a Section**
   - Click Interior or Exterior section
   - Section highlights with selected state
   - Component Palette filters to switching components

3. **Configure Section**
   - Enable/disable via toggle
   - Edit section title
   - View section description

4. **Add Components**
   - Click components in palette, or
   - Drag components from palette to section
   - Components appear in list

5. **Manage Components**
   - Hover over component to see delete button
   - Click × to remove component
   - View component count badge

### Default Configuration

**On First Load:**

```javascript
{
  interior: {
    enabled: true,
    title: 'Interior Lights'
  },
  exterior: {
    enabled: true,
    title: 'Exterior Lights'
  }
}
```

Both sections enabled by default with descriptive titles.

## Comparison with Home Tab

### Similarities

✓ Enable/disable toggles  
✓ Custom section titles  
✓ Visual selection indicators  
✓ Drag-and-drop support  
✓ Component management  
✓ Clear state indicators

### Differences

| Feature            | Home Tab                        | Lighting Tab             |
| ------------------ | ------------------------------- | ------------------------ |
| **Section Types**  | switching, signal-values, image | switching only           |
| **Type Selection** | Type cards to choose            | Fixed to switching       |
| **Image Upload**   | Yes (for image type)            | No                       |
| **Section Names**  | section1, section2              | interior, exterior       |
| **Icons**          | Based on type                   | 💡 Interior, 🌟 Exterior |
| **Descriptions**   | Based on type                   | Fixed descriptive text   |

## Component Types

### Supported Components

**Lighting sections only accept switching components:**

- **Toggles** - On/off switches
- **Buttons** - Momentary actions
- **Dimmers** - Variable intensity control

**Not supported:**

- Gauges
- Indicators
- Signal value components

This is enforced by the Component Palette filtering system.

## Integration Points

### Schema Context

Lighting tab configuration stored in `schema.lightingTab`:

```typescript
interface UISchema {
  // ... other fields
  lightingTab?: {
    interior: {
      enabled: boolean;
      title: string;
    };
    exterior: {
      enabled: boolean;
      title: string;
    };
  };
  // ... other fields
}
```

### Tab Generator

When regenerating content, lighting sections are created based on:

1. `schema.lighting.enabled` - System enabled
2. `schema.lighting.modules` - Number of modules
3. Hardware outputs configured for lighting

### Component Palette

Palette filters to switching components when lighting section selected:

```typescript
const currentSectionType = getCurrentSectionType();
// Returns 'switching' for all lighting sections
```

## CSS Styling

### Key Styles

**Section Block:**

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
  /* Checkmark badge styles */
}
```

**Description Box:**

```css
.description {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.05);
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
}
```

## Accessibility

### Keyboard Support

- ✅ Sections clickable (can be made keyboard accessible)
- ✅ Toggle accessible via Tab key
- ✅ Input fields focusable
- ✅ Clear visual focus states

### Screen Reader Support

- Section titles announced
- Selected state communicated via badge
- Toggle state announced (Enabled/Disabled)
- Component count readable

### ARIA Enhancements (Future)

Could add:

```tsx
<div
  role="button"
  aria-pressed={isSelected}
  aria-label={`${sectionKey} lights section, ${isEnabled ? 'enabled' : 'disabled'}`}
  tabIndex={0}
>
```

## Testing

### Manual Test Cases

✅ Enable/disable Interior section  
✅ Enable/disable Exterior section  
✅ Edit Interior title  
✅ Edit Exterior title  
✅ Click Interior section → shows selected  
✅ Click Exterior section → Interior deselected  
✅ Add component to Interior  
✅ Add component to Exterior  
✅ Delete component from section  
✅ Drag-and-drop to section  
✅ Component count updates  
✅ Hover effects work  
✅ Toggle doesn't trigger selection  
✅ Input doesn't trigger selection

### Edge Cases

✅ Both sections disabled → still selectable for config  
✅ Very long titles → truncated at 30 chars  
✅ No components → shows empty state  
✅ Toggle during drag → works correctly  
✅ Switch tabs → selection persists

## Future Enhancements

### Lighting Zones

Add support for lighting zones:

```typescript
interface LightingZone {
  id: string;
  name: string;
  channels: string[];
}

interface LightingSectionConfig {
  enabled: boolean;
  title: string;
  zones?: LightingZone[];
}
```

### Scene Support

Add lighting scenes:

```tsx
<div className={styles.scenes}>
  <button onClick={() => applyScene('evening')}>🌆 Evening</button>
  <button onClick={() => applyScene('night')}>🌙 Night</button>
  <button onClick={() => applyScene('movie')}>🎬 Movie</button>
</div>
```

### RGB/Color Support

For RGB lighting:

```typescript
interface RGBChannel extends OutputChannel {
  type: 'rgb';
  colors: ['red', 'green', 'blue'];
}
```

```tsx
<ColorPicker value={color} onChange={setColor} />
```

### Grouping

Group related lights:

```tsx
<div className={styles.group}>
  <h5>Bedroom Lights</h5>
  <Component id="bedroom-main" />
  <Component id="bedroom-reading" />
</div>
```

## Files Modified

- **packages/schema/src/schema.ts**
  - Added `LightingSectionConfigSchema`
  - Added `LightingTabConfigSchema`
  - Added `lightingTab` to `UISchemaSchema`
  - Exported `LightingTabConfig` and `LightingSectionConfig` types

- **packages/web-configurator/src/components/LightingSectionManager.tsx** (NEW)
  - Created lighting section manager component
  - Implements interior/exterior section configuration
  - Supports enable/disable, title editing
  - Handles component management
  - Drag-and-drop support

- **packages/web-configurator/src/components/LightingSectionManager.module.css** (NEW)
  - Complete styling for lighting sections
  - Selected state styles
  - Toggle switch styles
  - Component list styles
  - Description box styles

- **packages/web-configurator/src/pages/EditorPage.tsx**
  - Added import for `LightingSectionManager`
  - Added conditional rendering for lighting tab
  - Passes all necessary props

## Related Documentation

- [HOME_SECTION_SELECTION.md](./HOME_SECTION_SELECTION.md) - Similar implementation for Home tab
- [HOME_SECTION_ENHANCEMENTS.md](./HOME_SECTION_ENHANCEMENTS.md) - Home section features
- [SECTION_TYPE_FILTERING.md](./SECTION_TYPE_FILTERING.md) - Component filtering system
- [LIGHTING_SUBSYSTEM_COMPLETE.md](./LIGHTING_SUBSYSTEM_COMPLETE.md) - Lighting system overview
