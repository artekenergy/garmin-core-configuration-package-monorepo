# Preset Tabs System

## Overview

The HMI configurator now uses a **preset tabs system** instead of a flexible tab creation system. This makes the interface more structured and purpose-built for marine/RV applications.

## Features

### 6 Predefined Tabs

Instead of allowing users to create custom tabs with any name, the system now provides 6 preset tabs:

1. **Home** - Quick access to favorites and frequently used controls
2. **Lighting** - Interior and exterior lights
3. **Power** - Battery, inverter, and charging status
4. **HVAC** - Heating, cooling, and ventilation
5. **Switching** - Manual switches and controls
6. **Plumbing** - Tank levels and water systems

### Enable/Disable Toggle

- Each tab can be **enabled** or **disabled** using a toggle switch
- Disabled tabs:
  - Don't appear in the runtime HMI
  - Are grayed out in the configurator
  - Still retain their sections and components
  - Can be re-enabled without losing configuration

### Tab Ordering

- Users can still **reorder tabs** using left/right arrow buttons
- Tab order is preserved in the schema
- Only enabled tabs appear in the runtime HMI

## Schema Changes

### New Fields

The `Tab` schema now includes:

```typescript
{
  id: string;           // Still required (e.g., "tab-home")
  title: string;        // Display name (e.g., "Home")
  preset?: PresetTabId; // Optional: 'home' | 'lighting' | 'power' | 'hvac' | 'switching' | 'plumbing'
  enabled?: boolean;    // Optional: defaults to true
  icon?: string;        // Optional icon reference (must exist in schema.icons array)
  sections: Section[];  // Array of sections (unchanged)
}
```

**Note**: If you specify an `icon`, it must be defined in the `schema.icons` array. Otherwise, validation will fail with "Icon reference not found" errors. The configurator UI currently uses emoji placeholders instead of icon references.

### PresetTabId Enum

```typescript
type PresetTabId = 'home' | 'lighting' | 'power' | 'hvac' | 'switching' | 'plumbing';
```

### Max Tabs Changed

- **Old**: Max 10 tabs (flexible)
- **New**: Max 6 tabs (preset only)

## Default Configuration

The default schema now includes all 6 preset tabs:

```typescript
tabs: [
  { id: 'tab-home', title: 'Home', preset: 'home', enabled: true, ... },
  { id: 'tab-lighting', title: 'Lighting', preset: 'lighting', enabled: true, ... },
  { id: 'tab-power', title: 'Power', preset: 'power', enabled: true, ... },
  { id: 'tab-hvac', title: 'HVAC', preset: 'hvac', enabled: false, ... },
  { id: 'tab-switching', title: 'Switching', preset: 'switching', enabled: true, ... },
  { id: 'tab-plumbing', title: 'Plumbing', preset: 'plumbing', enabled: false, ... },
]
```

Note: HVAC and Plumbing are disabled by default, as they're optional systems.

## UI Updates

### TabManager Component

The `TabManager.tsx` component now:

- Shows all 6 preset tabs with descriptions
- Displays a toggle switch for enabling/disabling each tab
- Shows tab icons (currently using emoji placeholders)
- Removed the "Add Tab" button
- Removed the "Delete Tab" button
- Still supports reordering tabs

### Styling Changes

New CSS classes:

- `.disabled` - Applied to disabled tab items
- `.toggleLabel`, `.toggleInput`, `.toggleSlider` - Toggle switch styles
- `.tabInfo`, `.tabIcon`, `.tabDescription` - Preset tab information display
- `.subtitle` - Subtitle text for the TabManager header

## Runtime Behavior

### HMI UI Filtering

The `App.tsx` component now:

- Filters out tabs with `enabled: false`
- Only displays components from enabled tabs
- Component count shows only components from enabled tabs

```typescript
// Filter to enabled tabs
const enabledTabs = schema.tabs.filter((tab) => tab.enabled !== false);

// Use enabledTabs for rendering
```

## Migration from Old System

### For Existing Schemas

Old schemas with flexible tabs will still work, but:

1. **Legacy tab behavior**: Tabs without `preset` field are considered custom tabs
2. **Max tabs warning**: If you have more than 6 tabs, validation may fail
3. **Recommended approach**: Convert to preset tabs by:
   - Assigning appropriate `preset` values
   - Consolidating tabs if you have more than 6
   - Setting `enabled: false` for tabs you don't need

### Conversion Example

**Old Tab:**

```typescript
{
  id: 'tab-my-lights',
  title: 'My Lights',
  sections: [...]
}
```

**New Preset Tab:**

```typescript
{
  id: 'tab-lighting',
  title: 'Lighting',
  preset: 'lighting',
  enabled: true,
  icon: 'lightbulb',
  sections: [...]
}
```

## Benefits

1. **Consistency** - All configurations use the same tab structure
2. **User-friendly** - Clear purpose for each tab
3. **Simpler UI** - No need to name/create tabs from scratch
4. **Flexible** - Still supports full customization within each tab
5. **Optional features** - Disable tabs for features you don't have (HVAC, plumbing, etc.)

## Future Enhancements

- **Tab icons**: Replace emoji placeholders with proper icon components
- **Smart defaults**: Auto-populate tabs based on hardware configuration
- **Tab templates**: Preset section/component layouts for each tab type
- **Conditional visibility**: Show/hide tabs based on hardware config

## Files Modified

- `packages/schema/src/schema.ts` - Added `PresetTabIdSchema` and `preset`/`enabled` fields
- `packages/web-configurator/src/context/SchemaContext.tsx` - Default schema with 6 preset tabs
- `packages/web-configurator/src/components/TabManager.tsx` - Complete rewrite for preset system
- `packages/web-configurator/src/components/TabManager.module.css` - Toggle switch styles
- `packages/hmi-ui/src/App.tsx` - Filter disabled tabs at runtime
- `packages/web-configurator/tsconfig.json` - Exclude old HVAC config file

## Related Documentation

- [Schema Specification](./SCHEMA_SPEC.md) - Complete schema documentation
- [Configurator Overview](./CONFIGURATOR_CHANNEL_SYSTEM_OVERVIEW.md) - System architecture
- [Quick Start Guide](./QUICKSTART.md) - Getting started with the configurator
