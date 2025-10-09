# Schema Refactor: Home Config Removal

**Date:** January 2025  
**Status:** ✅ Complete

## Problem Statement

The schema had redundant data storage for home tab sections:

1. **`schema.home.section1` and `schema.home.section2`** - Stored enabled, type, title, imageUrl
2. **`schema.tabs[home].sections[]`** - Stored the same enabled, title, and components

This violated the **single source of truth** principle and created sync complexity where changes in one place had to be propagated to the other.

## Solution

**Remove `schema.home` completely** and use only `schema.tabs[].sections[]` as the single source of truth.

### Schema Changes

#### Removed:

```typescript
// ❌ REMOVED - No longer needed
export const HomeSectionTypeSchema = z.enum(['switching', 'signal-values', 'image']);
export const HomeSectionConfigSchema = z.object({ ... });
export const HomeConfigSchema = z.object({ ... });
export type HomeConfig = z.infer<typeof HomeConfigSchema>;
export type HomeSectionConfig = z.infer<typeof HomeSectionConfigSchema>;
export type HomeSectionType = z.infer<typeof HomeSectionTypeSchema>;
```

#### Added to `SectionSchema`:

```typescript
export const SectionSchema = z.object({
  id: z.string()...,
  title: z.string()...,
  enabled: z.boolean().optional().default(true), // ✅ Already added
  type: z.enum(['switching', 'signal-values', 'image', 'mixed']).optional(), // ✅ NEW
  icon: z.string().optional(),
  collapsible: z.boolean().optional(),
  collapsed: z.boolean().optional(),
  imageUrl: z.string().optional(),
  components: z.array(ComponentSchema).min(1),
});
```

#### Removed from `UISchemaSchema`:

```typescript
export const UISchemaSchema = z.object({
  schemaVersion: z.string()...,
  metadata: MetadataSchema,
  theme: ThemeConfigSchema.optional(),
  home: HomeConfigSchema.optional(), // ❌ REMOVED
  lightingTab: LightingTabConfigSchema.optional(),
  // ... rest of schema
});
```

## Benefits

### 1. **Single Source of Truth**

All section configuration (enabled, type, title, imageUrl, components) lives in one place: `schema.tabs[].sections[]`

### 2. **No Sync Complexity**

No need to keep `schema.home.section1.enabled` in sync with `schema.tabs[home].sections[0].enabled`

### 3. **Cleaner Architecture**

Tabs and sections work the same way everywhere - no special case for home tab

### 4. **Type Safety**

Section type is now part of Section schema, properly typed and validated

## Migration Impact

### Web Configurator Updates Needed

#### 1. `HomeConfigPage.tsx`

**Before:**

```typescript
const section1Enabled = schema.home?.section1?.enabled;
const section1Type = schema.home?.section1?.type;
```

**After:**

```typescript
const homeTab = schema.tabs.find((t) => t.preset === 'home' || t.id === 'tab-home');
const section1 = homeTab?.sections[0];
const section1Enabled = section1?.enabled !== false;
const section1Type = section1?.type;
```

#### 2. `EditorPage.tsx` - `getCurrentSectionType` function

**Before:**

```typescript
if (activeTab.preset === 'home') {
  const sectionIndex = activeTab.sections.findIndex((s) => s.id === activeSectionId);
  if (sectionIndex === 0) return schema.home?.section1?.type;
  if (sectionIndex === 1) return schema.home?.section2?.type;
}
```

**After:**

```typescript
// Just use the section's type property directly
const section = activeTab.sections.find((s) => s.id === activeSectionId);
return section?.type;
```

#### 3. Remove `HomeSectionManager` if it exists

The separate home section manager is no longer needed - home sections work exactly like regular sections.

## Files Modified

### Schema Package

- ✅ `/packages/schema/src/schema.ts` - Removed home config, added type to Section
- ✅ Schema rebuilt successfully with `pnpm build`

### HMI-UI Package

- ✅ `/packages/hmi-ui/src/components/HomeLayout.tsx` - Already uses `sections` from tab
- ✅ `/packages/hmi-ui/src/App.tsx` - Filters disabled sections correctly
- ⏸️ Type errors will resolve after web-configurator updated

### Web Configurator (Pending)

- ⏸️ `/packages/web-configurator/src/pages/HomeConfigPage.tsx` - Update to read from tabs
- ⏸️ `/packages/web-configurator/src/pages/EditorPage.tsx` - Update section type detection
- ⏸️ Remove any `HomeSectionManager` components if they exist

## Testing

### Verify Schema Changes

```bash
cd packages/schema
pnpm build
# Should build without errors
```

### Check Section Type

```typescript
// Home tab sections can now have optional type property
const homeTab = {
  id: 'tab-home',
  preset: 'home',
  label: 'Home',
  sections: [
    {
      id: 'section-quick-controls',
      title: 'Quick Controls',
      enabled: true,
      type: 'switching', // ✅ New optional field
      components: [
        /* ... */
      ],
    },
    {
      id: 'section-status',
      title: 'Status',
      enabled: true,
      type: 'signal-values', // ✅ New optional field
      components: [
        /* ... */
      ],
    },
  ],
};
```

### Browser Testing

1. Start web-configurator: `pnpm dev`
2. Navigate to Home tab in editor
3. Enable/disable sections - should work from tabs[].sections[]
4. Check section type detection
5. Verify export includes section type in tabs[].sections[]

## Schema Version

**Previous:** 1.0.0  
**Updated:** Should be bumped to 2.0.0 (breaking change - removed schema.home field)

## Backward Compatibility

This is a **breaking change**. Existing configurations with `schema.home` will need migration:

```typescript
// Migration pseudocode
if (schema.home) {
  const homeTab = schema.tabs.find((t) => t.preset === 'home');
  if (homeTab) {
    // Migrate section1
    if (homeTab.sections[0] && schema.home.section1) {
      homeTab.sections[0].enabled = schema.home.section1.enabled;
      homeTab.sections[0].type = schema.home.section1.type;
      if (schema.home.section1.imageUrl) {
        homeTab.sections[0].imageUrl = schema.home.section1.imageUrl;
      }
    }
    // Migrate section2
    if (homeTab.sections[1] && schema.home.section2) {
      homeTab.sections[1].enabled = schema.home.section2.enabled;
      homeTab.sections[1].type = schema.home.section2.type;
      if (schema.home.section2.imageUrl) {
        homeTab.sections[1].imageUrl = schema.home.section2.imageUrl;
      }
    }
  }
  // Remove old config
  delete schema.home;
}
```

## Next Steps

1. ✅ Schema package updated and built
2. ⏸️ Update web-configurator to use tabs[].sections[] instead of schema.home
3. ⏸️ Create schema migration script or utility
4. ⏸️ Update schema version to 2.0.0
5. ⏸️ Test end-to-end with browser
6. ⏸️ Update documentation with new schema structure

## Conclusion

This refactor eliminates a major architectural flaw (data redundancy) and makes the schema cleaner and more maintainable. The home tab now works consistently with all other tabs - no special cases needed.

**Key Principle:** Single source of truth in `schema.tabs[].sections[]` 🎯
