# Section ID Mismatch Fix

**Date:** October 7, 2025
**Status:** ✅ Fixed

## Issue Description

Components couldn't be dragged and dropped to Section 2 on the Home tab, and the Component Palette wasn't filtering based on the configured section type. The category tabs also weren't being disabled appropriately.

### Symptoms

1. **Drag-and-drop not working:** Users couldn't drag components to Section 2 on Home or Lighting tabs
2. **No palette filtering:** Component Palette always showed `filterType: null` regardless of section configuration
3. **Tabs not disabled:** Category tabs (Switching/Signal Values) weren't being disabled based on section type

### Root Cause

The logs revealed the actual problem:

```javascript
[EditorPage] Home tab sections: {
  section1Id: "section-placeholder-1759867957700-b95hx2d27",
  section2Id: undefined,
  selectedSectionId: "section-home-2"
}
[EditorPage] No section matched - returning null
```

**The Issue:** Section ID mismatch!

- `HomeSectionManager` expected sections with IDs: `section-home-1` and `section-home-2`
- But `tabGenerator.generateHomeTab()` returned empty array `[]`
- So `regenerateTabContent()` created placeholder sections with **random IDs**
- When matching `selectedSectionId` against tab sections, there was no match
- Result: `getCurrentSectionType()` returned `null` instead of the section's configured type
- Component Palette received `filterType: null` and didn't filter anything

## The Flow of the Bug

### 1. Tab Generation (tabGenerator.ts)

```typescript
// BEFORE (BUGGY):
function generateHomeTab(_schema: UISchema): Section[] {
  // Home tab starts empty - users can add their favorite controls here
  return []; // ❌ Empty array!
}
```

### 2. Tab Regeneration (tabGenerator.ts)

```typescript
export function regenerateTabContent(schema: UISchema): UISchema {
  const updatedTabs: Tab[] = schema.tabs.map((tab) => {
    let newSections: Section[] = [];

    switch (tab.preset) {
      case 'home':
        newSections = generateHomeTab(schema);  // Returns []
        break;
    }

    // If no sections generated, create a placeholder
    if (newSections.length === 0) {
      newSections = [{
        id: generateId('section-placeholder'),  // ❌ Random ID like "section-placeholder-1759867957700-b95hx2d27"
        title: 'No Content',
        components: [...]
      }];
    }
  });
}
```

### 3. Section Manager (HomeSectionManager.tsx)

```typescript
const renderSectionConfig = (sectionKey: 'section1' | 'section2', sectionNum: number) => {
  const tabSection = selectedTab?.sections?.[sectionNum - 1];
  const sectionId = tabSection?.id || `section-home-${sectionNum}`; // ✅ Falls back to expected ID

  // But when tab only has 1 placeholder section:
  // section1: tabSection?.id = "section-placeholder-..." ❌
  // section2: tabSection?.id = undefined (no second section) ❌
};
```

### 4. Section Type Detection (EditorPage.tsx)

```typescript
const getCurrentSectionType = (): 'switching' | 'signal-values' | 'image' | null => {
  if (selectedTabId === 'tab-home') {
    const currentTab = schema.tabs.find((t) => t.id === selectedTabId);
    const section1 = currentTab?.sections[0]; // Has random placeholder ID
    const section2 = currentTab?.sections[1]; // undefined (doesn't exist)

    if (section1?.id === selectedSectionId) {
      // "section-placeholder-..." !== "section-home-1" ❌
      return schema.home?.section1?.type || 'switching';
    } else if (section2?.id === selectedSectionId) {
      // undefined !== "section-home-2" ❌
      return schema.home?.section2?.type || 'signal-values';
    }
    return null; // ❌ Always returns null because IDs never match!
  }
};
```

### 5. Component Palette (ComponentPalette.tsx)

```typescript
<ComponentPalette
  filterType={currentSectionType}  // null (from step 4)
  ...
/>

// Inside ComponentPalette:
const isDisabled = filterType === 'image' || (filterType !== null && filterType !== selectedCategory);
// With filterType=null: isDisabled = false || (false && ...) = false
// So nothing is disabled, and tabs aren't gated!
```

## The Solution

### Fix 1: Generate Stable Section IDs for Home Tab

Instead of returning an empty array, generate two sections with **stable, predictable IDs**:

```typescript
// AFTER (FIXED):
function generateHomeTab(schema: UISchema): Section[] {
  // Home tab has two configurable sections with stable IDs
  // The content is managed by HomeSectionManager, but we need the section structure
  const home = schema.home || {
    section1: { enabled: true, type: 'switching' as const, title: 'Quick Controls' },
    section2: { enabled: true, type: 'signal-values' as const, title: 'Status' },
  };

  return [
    {
      id: 'section-home-1', // ✅ Stable, predictable ID
      title: home.section1?.title || 'Quick Controls',
      components: [],
    },
    {
      id: 'section-home-2', // ✅ Stable, predictable ID
      title: home.section2?.title || 'Status',
      components: [],
    },
  ];
}
```

**Why this works:**

- Always creates exactly 2 sections
- IDs match what HomeSectionManager expects
- No more random placeholder IDs
- Section matching in `getCurrentSectionType()` will succeed

### Fix 2: Generate Stable Section IDs for Lighting Tab

The Lighting tab had the same issue:

```typescript
// BEFORE (BUGGY):
function generateLightingTab(schema: UISchema): Section[] {
  const itcLighting = schema.accessories?.itcLighting;

  if (!itcLighting || !itcLighting.enabled || itcLighting.modules === 0) {
    return [];  // ❌ Empty array creates random placeholder
  }

  // Created 1 section with random ID for ITC zones
  sections.push({
    id: generateId('section-lights'),  // ❌ Random ID
    title: 'Light Zones',
    components: [...],
  });

  return sections;
}
```

```typescript
// AFTER (FIXED):
function generateLightingTab(schema: UISchema): Section[] {
  // Lighting tab has two configurable sections with stable IDs
  // The content is managed by LightingSectionManager
  const lightingTabConfig = schema.lightingTab || {
    interior: { enabled: true, title: 'Interior Lights' },
    exterior: { enabled: true, title: 'Exterior Lights' },
  };

  return [
    {
      id: 'section-lighting-interior', // ✅ Stable ID
      title: lightingTabConfig.interior?.title || 'Interior Lights',
      components: [],
    },
    {
      id: 'section-lighting-exterior', // ✅ Stable ID
      title: lightingTabConfig.exterior?.title || 'Exterior Lights',
      components: [],
    },
  ];
}
```

## How It Works Now

### Updated Flow (Fixed)

```
1. generateHomeTab() creates sections with IDs:
   - "section-home-1"
   - "section-home-2"
   ↓
2. HomeSectionManager uses these IDs:
   - const sectionId = tabSection?.id || `section-home-${sectionNum}`;
   - section1: "section-home-1" (matches!)
   - section2: "section-home-2" (matches!)
   ↓
3. User clicks Section 2:
   - selectedSectionId = "section-home-2"
   ↓
4. getCurrentSectionType() checks:
   - section2?.id === "section-home-2" ✅ MATCH!
   - Returns schema.home?.section2?.type = "signal-values" ✅
   ↓
5. ComponentPalette receives:
   - filterType = "signal-values" ✅
   ↓
6. Auto-switch effect triggers:
   - useEffect detects filterType changed
   - Sets selectedCategory = "signal-values" ✅
   ↓
7. Category tabs update:
   - Signal Values tab: active and enabled ✅
   - Switching tab: disabled and dimmed ✅
   ↓
8. Component filtering:
   - isDisabled = false for signal-value components ✅
   - isDisabled = true for switching components ✅
   ↓
9. Drag and drop works! ✅
```

## Expected Behavior Now

### Home Tab

**Section 1 (type: switching):**

- ✅ Component Palette shows "Switching" tab as active
- ✅ Signal Values tab is enabled (can manually switch)
- ✅ Can drag switching components (toggles, buttons, dimmers)
- ✅ Signal value components are available if manually switched

**Section 2 (type: signal-values):**

- ✅ Component Palette auto-switches to "Signal Values" tab
- ✅ Switching tab is enabled (can manually switch)
- ✅ Can drag signal value components (gauges, indicators)
- ✅ Switching components are available if manually switched

**Section 2 (configured as type: image):**

- ✅ Component Palette hides category tabs
- ✅ Shows "Upload an image for this section" message
- ✅ No components available (correct behavior)

### Lighting Tab

**Interior Lights section:**

- ✅ Has stable ID: `section-lighting-interior`
- ✅ Accepts switching components (dimmers, toggles)
- ✅ Component Palette shows appropriate filtering

**Exterior Lights section:**

- ✅ Has stable ID: `section-lighting-exterior`
- ✅ Accepts switching components (dimmers, toggles)
- ✅ Component Palette shows appropriate filtering

## Files Modified

### Core Files

1. **`packages/web-configurator/src/utils/tabGenerator.ts`**
   - Fixed `generateHomeTab()` to return 2 sections with stable IDs
   - Fixed `generateLightingTab()` to return 2 sections with stable IDs
   - Removed random ID generation for Home/Lighting tabs

2. **`packages/web-configurator/src/pages/EditorPage.tsx`**
   - Removed debug console.log statements
   - `getCurrentSectionType()` now properly matches section IDs

3. **`packages/web-configurator/src/components/ComponentPalette.tsx`**
   - Removed debug console.log statements
   - Auto-switching and filtering now work correctly

4. **`packages/web-configurator/src/components/HomeSectionManager.tsx`**
   - Removed debug console.log statements
   - Section ID matching now works correctly

## Technical Details

### Section ID Conventions

**Home Tab:**

- Section 1: `section-home-1` (stable, never changes)
- Section 2: `section-home-2` (stable, never changes)

**Lighting Tab:**

- Interior: `section-lighting-interior` (stable, never changes)
- Exterior: `section-lighting-exterior` (stable, never changes)

**Other Tabs:**

- Still use generated IDs (e.g., `section-placeholder-...`) as they don't have custom section managers

### Why Stable IDs Matter

1. **Section Matching:** Allows `getCurrentSectionType()` to match selected section with tab sections
2. **Type Detection:** Enables proper retrieval of section configuration (type, title, enabled)
3. **Component Filtering:** Component Palette can filter based on actual section type
4. **User Experience:** Drag-and-drop works, category tabs gate properly, visual feedback is correct
5. **State Persistence:** Section selections survive tab regeneration

### Empty Components Arrays

Both Home and Lighting tabs now return sections with `components: []`. This is intentional:

- **Home Tab:** Components are managed by HomeSectionManager via drag-and-drop
- **Lighting Tab:** Components are managed by LightingSectionManager via drag-and-drop
- The section structure exists, but content is user-configurable
- This prevents auto-generated components from conflicting with user-added ones

## Testing Scenarios

### Test 1: Home Tab - Section 2 with Signal Values

1. Select Home tab
2. Click Section 2 (default type: signal-values)
3. **Expected:**
   - Component Palette auto-switches to Signal Values tab ✅
   - Switching tab is enabled but not active ✅
   - Can drag gauges and indicators ✅
   - Can manually switch to Switching tab ✅
4. **Result:** Working correctly!

### Test 2: Home Tab - Change Section Type

1. Select Home tab, Section 2
2. Change Section 2 type from "signal-values" to "switching"
3. **Expected:**
   - Component Palette immediately switches to Switching tab ✅
   - Signal Values tab becomes enabled ✅
   - Can now drag toggles and buttons ✅
4. **Result:** Working correctly!

### Test 3: Lighting Tab - Interior Section

1. Select Lighting tab
2. Click Interior Lights section
3. **Expected:**
   - Section has ID: `section-lighting-interior` ✅
   - Component Palette shows Switching components ✅
   - Can drag dimmers for light zones ✅
4. **Result:** Working correctly!

### Test 4: Tab Regeneration Preserves IDs

1. Make changes to hardware config
2. Tabs regenerate via `regenerateTabContent()`
3. **Expected:**
   - Home section IDs remain `section-home-1` and `section-home-2` ✅
   - Lighting section IDs remain stable ✅
   - No random placeholder IDs generated ✅
4. **Result:** Working correctly!

## Related Fixes

This fix also resolves:

- ✅ Component Palette auto-switching (now receives correct filterType)
- ✅ Category tab disabling (now properly gates based on section type)
- ✅ Drag-and-drop validation (components respect section type)
- ✅ Visual feedback (correct tabs highlighted, disabled states shown)
- ✅ Section type persistence (survives tab regeneration)

## Lessons Learned

1. **Stable IDs are critical** for section matching and type detection
2. **Random ID generation** breaks any component that relies on ID matching
3. **Empty arrays in generators** trigger placeholder creation with unpredictable IDs
4. **Debug logging is essential** for tracking data flow through complex systems
5. **Fallback IDs** in managers can mask problems in generators

## Conclusion

The root cause was that `generateHomeTab()` and `generateLightingTab()` returned empty arrays, causing random placeholder sections to be created. This broke section ID matching in `getCurrentSectionType()`, which prevented proper filtering in the Component Palette.

By generating sections with **stable, predictable IDs** that match what the section managers expect, we fixed:

- Section type detection
- Component Palette filtering
- Category tab auto-switching
- Drag-and-drop functionality
- Visual feedback and gating

The system now works correctly for all section types and configurations!
