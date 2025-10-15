# Icon System - Simplified Registry Approach

**Date**: October 12, 2025  
**Status**: ✅ Implemented

---

## Overview

The icon system has been simplified to use **Approach A**: a centralized registry-based system where icons are defined once in `schema.icons[]` and referenced by ID throughout the schema.

---

## Architecture

### **1. Icon Definitions (`schema.icons[]`)**

Icons are defined in the schema with three possible modes:

```typescript
interface Icon {
  id: string; // Unique identifier (e.g., "plumbing", "all-lights")
  type: 'svg' | 'png' | 'jpg';
  url?: string; // External URL or path (e.g., "/icons/Plumbing.svg")
  data?: string; // Base64-encoded data for embedded icons
}
```

**Example:**

```json
{
  "icons": [
    {
      "id": "plumbing",
      "type": "svg",
      "url": "/icons/Plumbing.svg"
    },
    {
      "id": "custom-xyz",
      "type": "svg",
      "data": "PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQi..."
    }
  ]
}
```

### **2. Icon References**

Components, hardware outputs, tabs, and sections reference icons by ID:

```json
{
  "hardware": {
    "outputs": [
      {
        "id": "core-09",
        "label": "Slide Motor",
        "icon": "plumbing" // ← Reference by ID
      }
    ]
  }
}
```

### **3. Special Cases: Emoji**

Short strings (≤3 characters) are treated as emoji and rendered directly without registry lookup:

```json
{
  "id": "core-01",
  "label": "Water Tank",
  "icon": "💧" // ← Rendered as emoji, no registry needed
}
```

---

## Web Configurator Flow

### **Icon Picker**

1. User selects icon from library or uploads custom SVG
2. Icon path is stored in `hardware.outputs[].icon` (e.g., `"/icons/Plumbing.svg"`)
3. EditorPage copies icon to component when added to section

### **Export Process**

1. `buildIconsArray()` scans schema for all icon references
2. Converts paths to icon definitions:
   - Library icons: `"/icons/Plumbing.svg"` → `{id: "plumbing", type: "svg", url: "/icons/Plumbing.svg"}`
   - Custom icons: `"data:image/svg+xml;base64,..."` → `{id: "custom-xyz", type: "svg", data: "..."}`
3. `iconRefToId()` converts all references from paths to IDs
4. Schema exported with `icons[]` array and ID-based references

**Files:**

- `src/utils/iconRegistry.ts` - Icon registry builder
- `src/pages/ExportPage.tsx` - Calls `updateSchemaIcons()` before export

---

## HMI UI Flow

### **Schema Loading**

1. Schema loads with `icons[]` array
2. `registerIcons(schema.icons)` populates icon registry (Map)
3. All icons now available for lookup

### **Icon Rendering**

1. Component passes `iconId` prop to `Icon` component
2. Icon component handles three cases:
   - **Emoji** (≤3 chars): Renders directly as inline SVG text
   - **Registry ID**: Calls `getIcon(iconId)` to fetch IconSpec
   - **Missing**: Falls back to preset glyph or default placeholder

**Files:**

- `src/utils/icon-registry.ts` - Registry storage and lookup
- `src/components/Icon.tsx` - Icon rendering component
- `src/App.tsx` - Calls `registerIcons()` on schema load

---

## Icon ID Generation Rules

Library icons follow a simple naming convention:

| Icon Path               | Icon ID      |
| ----------------------- | ------------ |
| `/icons/Plumbing.svg`   | `plumbing`   |
| `/icons/All Lights.svg` | `all-lights` |
| `/icons/Water Dump.svg` | `water-dump` |
| `/icons/WiFi.svg`       | `wifi`       |

**Algorithm:**

1. Remove `/icons/` prefix and file extension
2. Convert to lowercase
3. Replace spaces with hyphens

Custom icons use a hash-based ID:

- `data:image/svg+xml;base64,PHN2ZyB3...` → `custom-PHN2ZyB3` (first 8 chars of base64)

---

## Migration from Path-Based Icons

Use the conversion script to migrate existing schemas:

```bash
node packages/web-configurator/scripts/convert-icons-to-ids.cjs \
  input-schema.json \
  output-schema.json
```

This will:

1. Scan for all icon references (paths and data URLs)
2. Generate `icons[]` array with proper definitions
3. Convert all references to IDs
4. Output updated schema

---

## Benefits of Registry Approach

### ✅ **Separation of Concerns**

- Icon definitions in one place (`icons[]`)
- Components reference by ID (cleaner)

### ✅ **Better Deployment**

- Icons can be inlined (SVG data) or external (URL)
- Deployment package includes icon definitions
- No broken references

### ✅ **Smaller Schema**

- Icon ID: `"plumbing"` (10 bytes)
- Icon path: `"/icons/Plumbing.svg"` (22 bytes)
- Savings: ~50% for repeated icons

### ✅ **Better Validation**

- Schema validates all icon IDs exist
- Catches broken references before deployment
- Better error messages

### ✅ **Emoji Support**

- Short strings (≤3 chars) automatically treated as emoji
- No registry needed for `"💧"`, `"🔥"`, `"🎯"`

---

## File Structure

```
packages/
├── schema/
│   └── src/
│       └── validators.ts          # Icon reference validation
├── web-configurator/
│   ├── src/
│   │   ├── utils/
│   │   │   └── iconRegistry.ts    # Build icons[] array
│   │   ├── pages/
│   │   │   └── ExportPage.tsx     # Export with icons
│   │   └── components/
│   │       └── IconPickerModal.tsx # Icon selection
│   └── scripts/
│       └── convert-icons-to-ids.cjs # Migration tool
└── hmi-ui/
    └── src/
        ├── utils/
        │   └── icon-registry.ts   # Registry storage/lookup
        └── components/
            └── Icon.tsx           # Icon rendering
```

---

## Removed Complexity

The following code/features were **removed**:

- ❌ Direct path support in Icon component (no more `iconId.startsWith('/')` checks)
- ❌ Dynamic IconSpec creation for paths
- ❌ `isDirectIconReference()` logic in Icon component
- ❌ Redundant icon prop (only `iconId` needed now)
- ❌ Console warnings spam (icons now properly registered)

**Result**: ~100 lines of code removed, cleaner architecture.

---

## Testing

### Test Icon Registry

```typescript
import { registerIcons, getIcon } from './utils/icon-registry';

const icons = [{ id: 'plumbing', type: 'svg', url: '/icons/Plumbing.svg' }];

registerIcons(icons);
const icon = getIcon('plumbing');
// → { id: 'plumbing', svg: undefined, url: '/icons/Plumbing.svg' }
```

### Test Icon Component

```tsx
<Icon iconId="plumbing" size="md" />  // ✅ Renders from registry
<Icon iconId="💧" size="md" />        // ✅ Renders emoji directly
<Icon iconId="missing" size="md" />   // ✅ Shows fallback placeholder
```

---

## Next Steps

Future enhancements:

- [ ] SVG color theming (replace hardcoded colors with `currentColor`)
- [ ] Icon preloading/caching
- [ ] Icon sprite sheet optimization
- [ ] Dynamic icon loading for large icon libraries

---

## Summary

✅ **Simplified to registry-based approach (Approach A)**  
✅ **Icons defined once in `schema.icons[]`**  
✅ **Components reference by ID (`"plumbing"` instead of `"/icons/Plumbing.svg"`)**  
✅ **Automatic conversion utility for migration**  
✅ **Emoji support for short strings (≤3 chars)**  
✅ **Better validation and deployment**  
✅ **~100 lines of code removed**
