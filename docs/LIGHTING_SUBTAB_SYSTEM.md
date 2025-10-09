# Lighting Tab Subtab System

**Date:** October 2025  
**Status:** ✅ Complete

## Overview

The Lighting tab now features a **subtab navigation system** that allows users to organize lighting controls into three categories:

1. **Interior** - Interior cabin lighting (dimmers, toggles for cabin lights, reading lights, etc.)
2. **Exterior** - Exterior and accent lighting (patio lights, awning lights, etc.)
3. **RGB** - RGB/Color lighting modules (colored accent lights, mood lighting)

This provides better organization compared to the previous two-section system, and gives users dedicated spaces for different types of lighting.

## Key Features

### Subtab Navigation Bar

- **Horizontal pill-style buttons** below the StatusBar
- **Icons + Labels** for clear identification (💡 Interior, 🌟 Exterior, 🌈 RGB)
- **Active state** with filled background (primary color)
- **Auto-hide** when only one subtab is enabled
- **Touch-friendly** minimum 40px height

### Three Configurable Subtabs

**Interior Subtab:**

- Default icon: 💡
- Default title: "Interior"
- Purpose: Cabin lighting, overhead lights, reading lights, dimmer zones
- Always available

**Exterior Subtab:**

- Default icon: 🌟
- Default title: "Exterior"
- Purpose: Patio lights, accent lights, awning lights, step lights
- Always available

**RGB Subtab:**

- Default icon: 🌈
- Default title: "RGB"
- Purpose: Color-changing LED modules, mood lighting
- **Disabled by default** (enabled when RGB modules are configured)

### Automatic RGB Enable/Disable

The RGB subtab automatically enables/disables based on the lighting configuration:

```typescript
// RGB subtab is enabled when RGB modules are configured
const rgbEnabled = schema.lighting?.rgb?.enabled && schema.lighting?.rgb?.modules > 0;
```

This creates a seamless UX where the RGB subtab appears only when relevant hardware is configured.

## Schema Implementation

### Updated Lighting Tab Config

```typescript
export const LightingSubtabConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().min(1).max(30).default('Subtab'),
  icon: z.string().optional(), // Emoji or icon reference
});

export const LightingTabConfigSchema = z
  .object({
    interior: LightingSubtabConfigSchema.default({
      enabled: true,
      title: 'Interior',
      icon: '💡',
    }),
    exterior: LightingSubtabConfigSchema.default({
      enabled: true,
      title: 'Exterior',
      icon: '🌟',
    }),
    rgb: LightingSubtabConfigSchema.default({
      enabled: false, // Disabled by default
      title: 'RGB',
      icon: '🌈',
    }),
  })
  .default({
    interior: { enabled: true, title: 'Interior', icon: '💡' },
    exterior: { enabled: true, title: 'Exterior', icon: '🌟' },
    rgb: { enabled: false, title: 'RGB', icon: '🌈' },
  });
```

### Schema to Section ID Mapping

```typescript
const subtabSectionMap = {
  interior: 'section-lighting-interior',
  exterior: 'section-lighting-exterior',
  rgb: 'section-lighting-rgb',
};
```

## Component Implementation

### SubtabBar Component

**File:** `packages/hmi-ui/src/components/SubtabBar.tsx`

**Props:**

```typescript
interface SubtabConfig {
  id: string;
  title: string;
  icon?: string;
  enabled: boolean;
}

interface SubtabBarProps {
  subtabs: SubtabConfig[];
  activeSubtabId: string;
  onSubtabChange: (subtabId: string) => void;
}
```

**Features:**

- Filters to only show enabled subtabs
- Auto-hides if ≤ 1 subtab is enabled
- Pill-style button design with icons
- Active state with inverted colors
- ES2017 compliant (no optional chaining)

### Integration in App.tsx

**Subtab state:**

```typescript
const activeSubtabId = useSignal<string>('interior');
```

**Conditional rendering:**

```typescript
// Only show SubtabBar for lighting tab
const isLightingTab = activeTab?.preset === 'lighting';

if (isLightingTab && schema.lightingTab) {
  return <SubtabBar subtabs={...} activeSubtabId={...} onSubtabChange={...} />;
}
```

**Content filtering:**

```typescript
// Filter sections based on active subtab
const targetSectionId = subtabSectionMap[activeSubtabId.value];
const activeSection = activeTab.sections.find(s => s.id === targetSectionId);

if (activeSection) {
  return <Section section={activeSection} />;
}
```

**Tab change behavior:**

```typescript
onTabChange={(tabId) => {
  activeTabId.value = tabId;
  // Reset to first subtab when changing tabs
  activeSubtabId.value = 'interior';
}}
```

## CSS Styling

**File:** `packages/hmi-ui/src/styles/components.css`

```css
.gcg-subtab-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(232, 236, 240, 0.1);
}

.gcg-subtab-bar__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem; /* Pill shape */
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  font-weight: 500;
  min-height: 40px;
}

.gcg-subtab-bar__item--active {
  color: var(--theme-secondary);
  background: var(--theme-primary);
  border-color: var(--theme-primary);
}

.gcg-subtab-bar__icon {
  font-size: 1.25rem;
}

.gcg-subtab-bar__title {
  white-space: nowrap;
  font-weight: 600;
}
```

## Web Configurator Updates

### LightingSectionManager Component

**Updated to support all three subtabs:**

1. **Section key type:**

   ```typescript
   type SectionKey = 'interior' | 'exterior' | 'rgb';
   ```

2. **Icon mapping:**

   ```typescript
   const sectionIconMap = {
     interior: section?.icon || '💡',
     exterior: section?.icon || '🌟',
     rgb: section?.icon || '🌈',
   };
   ```

3. **Description mapping:**

   ```typescript
   const sectionDescriptionMap = {
     interior: 'Control interior lighting zones and dimmers',
     exterior: 'Control exterior and accent lighting',
     rgb: 'Control RGB and color lighting modules',
   };
   ```

4. **Rendering:**
   ```tsx
   {
     renderSectionConfig('interior', 1);
   }
   {
     renderSectionConfig('exterior', 2);
   }
   {
     renderSectionConfig('rgb', 3);
   }
   ```

### Tab Generator

**Updated to create three sections:**

```typescript
function generateLightingTab(schema: UISchema): Section[] {
  const lightingTabConfig = schema.lightingTab || {
    interior: { enabled: true, title: 'Interior' },
    exterior: { enabled: true, title: 'Exterior' },
    rgb: { enabled: false, title: 'RGB' },
  };

  return [
    {
      id: 'section-lighting-interior',
      title: lightingTabConfig.interior.title,
      components: [],
      enabled: true,
    },
    {
      id: 'section-lighting-exterior',
      title: lightingTabConfig.exterior.title,
      components: [],
      enabled: true,
    },
    {
      id: 'section-lighting-rgb',
      title: lightingTabConfig.rgb.title,
      components: [],
      enabled: true,
    },
  ];
}
```

## User Experience

### Configuration Workflow

1. **Navigate to Editor → Lighting Tab**
2. **See three subtab options** in LightingSectionManager
3. **Enable/disable subtabs** via toggles
4. **Edit subtab titles and icons** (optional)
5. **Select a subtab** to configure
6. **Add components** from palette to active subtab

### Runtime Behavior

1. **User selects Lighting tab** from TabBar
2. **SubtabBar appears** below StatusBar (if >1 subtab enabled)
3. **Interior subtab shown by default**
4. **User taps subtab button** to switch (Exterior or RGB)
5. **Content updates** to show selected subtab's components
6. **SubtabBar hides** when switching to other tabs

### Visual Layout

```
┌────────────────────────────────────────────┐
│  StatusBar                                 │
├────────────────────────────────────────────┤
│  [ 💡 Interior ] [ 🌟 Exterior ] [ 🌈 RGB ]│  ← SubtabBar
├────────────────────────────────────────────┤
│                                            │
│  Section Content:                          │
│  ┌──────────┐  ┌──────────┐               │
│  │ Dimmer 1 │  │ Toggle 1 │               │
│  └──────────┘  └──────────┘               │
│                                            │
│  ┌──────────┐  ┌──────────┐               │
│  │ Dimmer 2 │  │ Toggle 2 │               │
│  └──────────┘  └──────────┘               │
│                                            │
├────────────────────────────────────────────┤
│  [ Home ] [ Lighting* ] [ Power ] [ ... ]  │  ← TabBar
└────────────────────────────────────────────┘
```

## Benefits

### Organization

- ✅ Separate spaces for different lighting types
- ✅ Cleaner UI with focused content per subtab
- ✅ Better scalability as lighting systems grow

### User Experience

- ✅ Familiar subtab navigation pattern
- ✅ Quick switching between lighting categories
- ✅ RGB subtab only appears when relevant

### Technical

- ✅ Reusable SubtabBar component
- ✅ Schema-driven configuration
- ✅ Automatic enable/disable based on hardware
- ✅ ES2017 compliant, WebView 83 compatible

## Future Enhancements

### Dynamic Subtab Creation

Allow users to create custom lighting subtabs:

```typescript
interface LightingTabConfig {
  subtabs: LightingSubtab[];
}

interface LightingSubtab {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
}
```

### Scene Integration

Add scene buttons to subtab bar:

```tsx
<SubtabBar subtabs={subtabs} />
<SceneBar scenes={['Evening', 'Night', 'Movie']} />
```

### Subtab Reordering

Allow drag-and-drop to reorder subtabs in configurator.

### Color Picker for RGB

When RGB subtab is selected, show color picker component:

```tsx
{
  activeSubtabId === 'rgb' && <ColorPicker onColorChange={setRgbColor} />;
}
```

## Files Modified

**Schema:**

- `packages/schema/src/schema.ts`
  - Added `LightingSubtabConfigSchema`
  - Updated `LightingTabConfigSchema` with interior/exterior/rgb
  - Added `icon` property to subtabs
  - Exported `LightingSubtabConfig` type

**HMI-UI:**

- `packages/hmi-ui/src/components/SubtabBar.tsx` (NEW)
  - Created SubtabBar component
  - ES2017 compliant implementation
- `packages/hmi-ui/src/App.tsx`
  - Added `activeSubtabId` signal
  - Added SubtabBar rendering logic
  - Added subtab-based content filtering
  - Reset subtab on tab change
- `packages/hmi-ui/src/styles/components.css`
  - Added `.gcg-subtab-bar` styles
  - Pill-style button design
  - Active state styling

**Web Configurator:**

- `packages/web-configurator/src/components/LightingSectionManager.tsx`
  - Updated to support 'rgb' subtab
  - Added icon mapping for all three subtabs
  - Updated section descriptions
  - Changed UI text from "sections" to "subtabs"
- `packages/web-configurator/src/utils/tabGenerator.ts`
  - Added RGB section generation
  - Updated default titles (shorter)
  - Added `enabled: true` to all sections

## Testing Checklist

**Schema:**

- ✅ Schema builds without errors
- ✅ LightingTabConfig has all three subtabs
- ✅ Default values set correctly
- ✅ Icons are optional strings

**HMI-UI:**

- ✅ SubtabBar renders on lighting tab
- ✅ SubtabBar hides with ≤1 enabled subtab
- ✅ Active subtab highlighted correctly
- ✅ Content switches when subtab changes
- ✅ Subtab resets to 'interior' on tab change
- ✅ No errors in browser console

**Web Configurator:**

- ✅ All three subtabs render in LightingSectionManager
- ✅ Can enable/disable each subtab
- ✅ Can edit titles and icons
- ✅ Components can be added to each subtab
- ✅ Section selection works correctly

## Related Documentation

- [LIGHTING_TAB_SECTIONS.md](./LIGHTING_TAB_SECTIONS.md) - Previous two-section system
- [LIGHTING_SUBSYSTEM_COMPLETE.md](./LIGHTING_SUBSYSTEM_COMPLETE.md) - Lighting config page
- [HOME_TAB_LAYOUT.md](./HOME_TAB_LAYOUT.md) - Special layout patterns
- [PRESET_TABS_SYSTEM.md](./PRESET_TABS_SYSTEM.md) - Tab system overview

---

**Lighting subtab system complete! Users can now organize lighting controls into Interior, Exterior, and RGB categories with seamless navigation. 💡🌟🌈**
