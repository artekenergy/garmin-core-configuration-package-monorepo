# Home Section Configuration Sync

**Status**: ⚠️ Needs Implementation  
**Date**: October 8, 2025  
**Priority**: High

## Problem

The home tab has **two separate but related configurations**:

### 1. Home Config (`schema.home`)

```json
{
  "home": {
    "section1": {
      "enabled": true,
      "type": "switching",
      "title": "Quick Controls"
    },
    "section2": {
      "enabled": true,
      "type": "signal-values",
      "title": "Status"
    }
  }
}
```

### 2. Tab Sections (`schema.tabs[home].sections[]`)

```json
{
  "tabs": [
    {
      "id": "tab-home",
      "preset": "home",
      "sections": [
        {
          "id": "section-home-1",
          "title": "Quick Controls",
          "enabled": true,  // ← Must match home.section1.enabled
          "components": [...]
        },
        {
          "id": "section-home-2",
          "title": "Status",
          "enabled": true,  // ← Must match home.section2.enabled
          "components": [...]
        }
      ]
    }
  ]
}
```

**Issue**: These two need to stay **in sync** but there's no automatic synchronization.

## Current Behavior

### Web Configurator

- User edits `home.section1.enabled` on Home Config page
- User edits components in `tabs[home].sections[0]` on Editor page
- **No sync happens** between them

### HMI-UI

- Filters sections by `tabs[home].sections[].enabled`
- **Ignores** `home.section1.enabled`
- This creates a mismatch!

## Solution Options

### Option 1: Sync on Export (Recommended)

When exporting the schema, sync home config to tab sections:

```typescript
// In exportSchema() or similar
function syncHomeSectionsToTab(schema: UISchema): UISchema {
  const homeTab = schema.tabs.find((tab) => tab.preset === 'home');

  if (!homeTab || !schema.home) {
    return schema;
  }

  // Sync section1
  if (homeTab.sections[0]) {
    homeTab.sections[0].enabled = schema.home.section1.enabled;
    homeTab.sections[0].title = schema.home.section1.title;
  }

  // Sync section2
  if (homeTab.sections[1]) {
    homeTab.sections[1].enabled = schema.home.section2.enabled;
    homeTab.sections[1].title = schema.home.section2.title;
  }

  return schema;
}
```

**Pros**:

- Simple to implement
- One-time sync before export
- No runtime overhead

**Cons**:

- Sync only happens on export
- Preview might show wrong state

### Option 2: Sync on Every Change

When user changes home config, immediately update tab sections:

```typescript
// In HomeConfigPage.tsx
function handleSectionToggle(sectionKey: 'section1' | 'section2', enabled: boolean) {
  updateSchema((draft) => {
    // Update home config
    draft.home[sectionKey].enabled = enabled;

    // Sync to tab section
    const homeTab = draft.tabs.find((tab) => tab.preset === 'home');
    const sectionIndex = sectionKey === 'section1' ? 0 : 1;

    if (homeTab?.sections[sectionIndex]) {
      homeTab.sections[sectionIndex].enabled = enabled;
    }
  });
}
```

**Pros**:

- Always in sync
- Preview shows correct state
- No sync needed on export

**Cons**:

- More complex
- Need to sync in multiple places

### Option 3: Make HMI-UI Read Both

HMI-UI checks both home config and tab section:

```typescript
// In HomeLayout.tsx
const isSection1Enabled = schema.home.section1.enabled && sections[0].enabled !== false;

const isSection2Enabled = schema.home.section2.enabled && sections[1].enabled !== false;
```

**Pros**:

- Respects both configurations
- More defensive

**Cons**:

- Confusing which is source of truth
- Doesn't fix root problem

## Recommended Implementation

**Use Option 2 (Sync on Change)** + **Option 1 (Sync on Export)** as safety:

### Step 1: Update HomeConfigPage.tsx

```typescript
// When toggling section enabled
const handleSection1Toggle = (enabled: boolean) => {
  updateSchema((draft) => {
    draft.home.section1.enabled = enabled;

    // Sync to tab
    const homeTab = draft.tabs.find((t) => t.preset === 'home' || t.id === 'tab-home');
    if (homeTab?.sections[0]) {
      homeTab.sections[0].enabled = enabled;
    }
  });
};

// When changing section title
const handleSection1TitleChange = (title: string) => {
  updateSchema((draft) => {
    draft.home.section1.title = title;

    // Sync to tab
    const homeTab = draft.tabs.find((t) => t.preset === 'home' || t.id === 'tab-home');
    if (homeTab?.sections[0]) {
      homeTab.sections[0].title = title;
    }
  });
};

// Similar for section2
```

### Step 2: Add Sync on Export (Safety)

```typescript
// In ExportPage.tsx or schema utilities
export function syncHomeConfigToTabs(schema: UISchema): UISchema {
  const homeTab = schema.tabs.find((t) => t.preset === 'home' || t.id === 'tab-home');

  if (!homeTab || !schema.home) {
    return schema;
  }

  // Sync section1
  if (homeTab.sections[0] && schema.home.section1) {
    homeTab.sections[0].enabled = schema.home.section1.enabled;
    homeTab.sections[0].title = schema.home.section1.title;
  }

  // Sync section2
  if (homeTab.sections[1] && schema.home.section2) {
    homeTab.sections[1].enabled = schema.home.section2.enabled;
    homeTab.sections[1].title = schema.home.section2.title;
  }

  return schema;
}

// Call before export
const schemaToExport = syncHomeConfigToTabs(currentSchema);
```

### Step 3: Update HMI-UI (Already Done!)

The HMI-UI already filters by `section.enabled`:

```typescript
// HomeLayout.tsx
const enabledSections = sections.filter((section) => section.enabled !== false);
```

This will work correctly once sync is implemented.

## Testing

### Test Cases

1. **Enable Section 1 Only**
   - Toggle `home.section1.enabled = true`
   - Toggle `home.section2.enabled = false`
   - Verify: HMI shows section 1 full-width
2. **Enable Section 2 Only**
   - Toggle `home.section1.enabled = false`
   - Toggle `home.section2.enabled = true`
   - Verify: HMI shows section 2 full-width
3. **Enable Both Sections**
   - Both enabled
   - Verify: HMI shows side-by-side layout
4. **Disable Both Sections**
   - Both disabled
   - Verify: HMI shows empty state
5. **Change Section Titles**
   - Change `home.section1.title = "My Controls"`
   - Verify: Title syncs to `tabs[home].sections[0].title`
   - Verify: HMI shows new title

## Migration

For existing schemas without sync:

```typescript
// Run once on schema load
function ensureHomeSectionSync(schema: UISchema): UISchema {
  const homeTab = schema.tabs.find((t) => t.preset === 'home' || t.id === 'tab-home');

  if (!homeTab || !schema.home) {
    return schema;
  }

  // If tab sections don't have enabled property, add it from home config
  if (homeTab.sections[0] && schema.home.section1) {
    homeTab.sections[0].enabled = homeTab.sections[0].enabled ?? schema.home.section1.enabled;
    homeTab.sections[0].title = homeTab.sections[0].title ?? schema.home.section1.title;
  }

  if (homeTab.sections[1] && schema.home.section2) {
    homeTab.sections[1].enabled = homeTab.sections[1].enabled ?? schema.home.section2.enabled;
    homeTab.sections[1].title = homeTab.sections[1].title ?? schema.home.section2.title;
  }

  return schema;
}
```

## Files to Modify

1. **Web Configurator**:
   - `/packages/web-configurator/src/pages/HomeConfigPage.tsx`
   - `/packages/web-configurator/src/pages/ExportPage.tsx`
   - Add sync utility in `/packages/web-configurator/src/utils/schemaSync.ts`

2. **Schema Package** (Already done ✅):
   - `/packages/schema/src/schema.ts` - Added `enabled` to SectionSchema

3. **HMI-UI** (Already done ✅):
   - `/packages/hmi-ui/src/components/HomeLayout.tsx` - Filters by enabled
   - `/packages/hmi-ui/src/App.tsx` - Filters by enabled

## Current Status

- ✅ Schema has `enabled` on sections
- ✅ HMI-UI filters by `section.enabled`
- ⏸️ Web Configurator sync not implemented
- ⏸️ Export sync not implemented

## Next Steps

1. Implement sync in HomeConfigPage.tsx handlers
2. Add export sync as safety net
3. Test all 5 test cases
4. Document in user guide

---

**Priority**: Implement before release to avoid user confusion!
