# Subtab Configuration Fix - October 16, 2025

## Issue Summary

The HMI UI was not displaying subtabs correctly for Lighting, HVAC, and Switching tabs. Instead of showing a SubtabBar with tabs, all sections were being rendered vertically stacked.

## Root Cause

The default schema template in the web-configurator's `SchemaContext.tsx` was missing the required subtab configuration objects:

- `lightingTab`
- `hvacTab`
- `switchingTab`

When users created or exported configurations through the web-configurator, these configuration objects were not included in the schema, causing the HMI UI's `tabGenerator.ts` to skip subtab generation.

## Files Modified

### 1. `/packages/web-configurator/src/context/SchemaContext.tsx`

**Added default subtab configurations:**

```typescript
lightingTab: {
  interior: {
    enabled: true,
    title: 'Interior',
    icon: '💡',
  },
  exterior: {
    enabled: true,
    title: 'Exterior',
    icon: '🌟',
  },
  rgb: {
    enabled: false,
    title: 'RGB',
    icon: '🌈',
  },
},
hvacTab: {
  heating: {
    enabled: true,
    title: 'Heating',
    icon: '🔥',
  },
  cooling: {
    enabled: true,
    title: 'Cooling',
    icon: '❄️',
  },
  ventilation: {
    enabled: true,
    title: 'Ventilation',
    icon: '💨',
  },
},
switchingTab: {
  switches: {
    enabled: true,
    title: 'Switches',
    icon: '🔌',
  },
  accessories: {
    enabled: true,
    title: 'Accessories',
    icon: '⚡',
  },
},
```

### 2. `/packages/hmi-ui/src/components/SubtabBar.tsx`

**Changed visibility logic:**

```typescript
// OLD: Don't render if no subtabs or only one subtab
if (enabledSubtabs.length <= 1) {
  return null;
}

// NEW: Don't render if no subtabs (now shows even with 1 subtab)
if (enabledSubtabs.length === 0) {
  return null;
}
```

### 3. Debug Logging Removed

Cleaned up temporary debug logging from:

- `packages/hmi-ui/src/utils/tabGenerator.ts`
- `packages/hmi-ui/src/utils/schema-loader.ts`
- `packages/hmi-ui/src/App.tsx`

## How Subtabs Work

### Schema Configuration

The subtab system uses three top-level configuration objects in the schema:

```json
{
  "lightingTab": {
    "interior": { "enabled": true, "title": "Interior", "icon": "💡" },
    "exterior": { "enabled": true, "title": "Exterior", "icon": "🌟" },
    "rgb": { "enabled": false, "title": "RGB", "icon": "🌈" }
  },
  "hvacTab": {
    "heating": { "enabled": true, "title": "Heating", "icon": "🔥" },
    "cooling": { "enabled": true, "title": "Cooling", "icon": "❄️" },
    "ventilation": { "enabled": true, "title": "Ventilation", "icon": "💨" }
  },
  "switchingTab": {
    "switches": { "enabled": true, "title": "Switches", "icon": "🔌" },
    "accessories": { "enabled": true, "title": "Accessories", "icon": "⚡" }
  }
}
```

### HMI UI Processing

1. **Schema Loading** (`schema-loader.ts`):
   - Loads schema.json
   - Validates with Zod schemas
   - Calls `regenerateTabContent()`

2. **Tab Generation** (`tabGenerator.ts`):
   - Detects tabs with `preset: "lighting"`, `"hvac"`, or `"switching"`
   - Reads corresponding subtab configuration objects
   - Creates `uiSubtabs` array on the tab object
   - Maps each subtab to a section ID

3. **Rendering** (`App.tsx`):
   - Checks if `activeTab.uiSubtabs` exists and has items
   - If yes: Renders SubtabBar and only the active subtab's section
   - If no: Renders all enabled sections without SubtabBar

4. **SubtabBar Display** (`SubtabBar.tsx`):
   - Shows if at least 1 enabled subtab exists
   - Displays horizontally below StatusBar
   - Allows switching between subtabs

## Migration for Existing Schemas

If you have an existing schema file deployed to a device that's missing these configurations:

### Option 1: Re-export from Web Configurator

1. Open web-configurator at `http://localhost:3000`
2. Go to Hardware Configuration → Upload Schema JSON
3. Upload your existing schema
4. Go to Export page
5. Generate and download new deployment package
6. Upload to device

### Option 2: Manual Addition

Add the following to your schema.json file (after the `accessories` object):

```json
"lightingTab": {
  "interior": { "enabled": true, "title": "Interior", "icon": "💡" },
  "exterior": { "enabled": true, "title": "Exterior", "icon": "🌟" },
  "rgb": { "enabled": false, "title": "RGB", "icon": "🌈" }
},
"hvacTab": {
  "heating": { "enabled": true, "title": "Heating", "icon": "🔥" },
  "cooling": { "enabled": true, "title": "Cooling", "icon": "❄️" },
  "ventilation": { "enabled": true, "title": "Ventilation", "icon": "💨" }
},
"switchingTab": {
  "switches": { "enabled": true, "title": "Switches", "icon": "🔌" },
  "accessories": { "enabled": true, "title": "Accessories", "icon": "⚡" }
}
```

### Option 3: Use the Script

Run the automated script:

```bash
node scripts/add-subtab-configs.js
```

This will add default subtab configurations to:

- `packages/hmi-ui/public/schema.json`
- `garmin-bundle/web/schema.json`
- `packages/web-configurator/public/deployment-package/web/schema.json`

## Testing

### Verify Subtabs Display

1. Deploy the new package to your device
2. Navigate to the Lighting tab
3. You should see:
   - StatusBar at top
   - SubtabBar below StatusBar with "Interior" and "Exterior" tabs
   - Only the active subtab's content displayed
   - No section titles (hidden when using subtabs)

4. Click between subtabs to verify switching works

### Verify HVAC Subtabs

1. Navigate to HVAC tab
2. Should show "Heating", "Cooling", "Ventilation" subtabs
3. Each subtab shows its corresponding section

### Verify Switching Subtabs

1. Navigate to Switching tab
2. Should show "Switches" and "Accessories" subtabs
3. Each subtab shows its corresponding section

## Future Considerations

### Configuration Pages Need Updates

The web-configurator configuration pages (Lighting, HVAC, Switching) should allow users to:

- Enable/disable individual subtabs
- Customize subtab titles
- Change subtab icons
- Reorder subtabs (potential future feature)

These pages already partially support this (see `LightingSectionManager.tsx`, `HVACConfigPage.tsx`), but may need UI enhancements.

### Additional Subtab Support

Currently only Lighting, HVAC, and Switching tabs support subtabs. To add subtabs to other tabs:

1. Add configuration object to schema (e.g., `plumbingTab`)
2. Create Zod schema in `@gcg/schema`
3. Add `applyXXXConfig()` function to `tabGenerator.ts`
4. Add case in `regenerateTabContent()` switch statement
5. Update configuration page to manage subtab settings

## Deployment

All schemas generated or exported after this fix will automatically include the subtab configurations. Users with existing deployments need to:

1. Upload the latest deployment package (generated with `pnpm run deploy:full`)
2. Or manually add the configurations to their device's `schema.json`
3. Hard refresh the browser cache (Ctrl+F5 or Cmd+Shift+R)

## Related Documentation

- [Lighting Subtab System](./LIGHTING_SUBTAB_SYSTEM.md)
- [Lighting Tab Sections](./LIGHTING_TAB_SECTIONS.md)
- [HMI UI Component Design System](./HMI_COMPONENT_DESIGN_SYSTEM.md)
- [System Architecture](./SYSTEM_ARCHITECTURE_AND_DEPLOYMENT_FLOW.md)
