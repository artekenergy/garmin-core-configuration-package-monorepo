# Component Palette: Reusable Components & Signal Values

**Date:** January 2025  
**Status:** ✅ Complete

## Overview

The Component Palette has been completely refactored to support:

1. **Reusable Components** - Components can be added multiple times throughout the editor
2. **Signal Values** - New category for monitoring data (gauges, indicators)
3. **Category Tabs** - Organized view switching between Switching and Signal Values

## Key Changes

### 1. Removed Component Filtering

**Before:**

```typescript
// Components were filtered out after use
const usedComponentIds = new Set<string>();
schema.tabs.forEach((tab) => {
  tab.sections.forEach((section) => {
    section.components.forEach((component) => {
      usedComponentIds.add(component.id);
    });
  });
});
return configuredChannels.filter((channel) => {
  const componentId = `comp-${channel.id}`;
  return !usedComponentIds.has(componentId); // Removed this filtering
});
```

**After:**

```typescript
// All configured components are always available
const switchingComponents = schema.hardware.outputs.filter(
  (output) => output.control !== 'not-used'
);
```

### 2. Added Category Tabs

The palette now has two categories:

#### **🔘 Switching Components**

- Hardware output channels (toggles, buttons, dimmers)
- Source: `schema.hardware.outputs`
- Maps via `CONTROL_COMPONENT_MAP`
- Can be added unlimited times

#### **📊 Signal Values**

- Read-only monitoring components (gauges, indicators)
- Sources:
  - Power system (voltage, current, SOC, solar power)
  - Plumbing (tank levels)
  - HVAC (interior temperature)
- Auto-configured based on enabled subsystems

### 3. Signal Value Component Generation

Signal values are dynamically generated based on system configuration:

```typescript
// Power signals
if (schema.power) {
  signals.push(
    { id: 'battery-voltage', label: 'Battery Voltage', type: 'gauge', source: 'power' },
    { id: 'battery-current', label: 'Battery Current', type: 'gauge', source: 'power' },
    { id: 'battery-soc', label: 'State of Charge', type: 'gauge', source: 'power' }
  );

  if (schema.power.solar?.enabled) {
    signals.push(
      { id: 'solar-power', label: 'Solar Power', type: 'gauge', source: 'solar' },
      { id: 'solar-voltage', label: 'Solar Voltage', type: 'gauge', source: 'solar' }
    );
  }
}

// Plumbing signals
if (schema.plumbing?.enabled) {
  schema.plumbing.tanks.forEach((tank, idx) => {
    signals.push({
      id: `tank-${idx}-level`,
      label: `${tank.name || tank.type} Tank Level`,
      type: 'gauge',
      source: 'plumbing',
    });
  });
}

// HVAC signals
if (schema.hvac?.heating?.enabled || schema.hvac?.cooling?.enabled) {
  signals.push({
    id: 'interior-temp',
    label: 'Interior Temperature',
    type: 'gauge',
    source: 'hvac',
  });
}
```

## Component Creation

### Switching Components

Created via `CONTROL_COMPONENT_MAP`:

```typescript
const channel = schema.hardware?.outputs.find((o) => o.id === channelId);
const mapping = CONTROL_COMPONENT_MAP[channel.control];

// Creates toggle, button, or dimmer based on control type
```

### Signal Value Components

Created with gauge component schema:

```typescript
newComponent = {
  id: `comp-signal-${channelId}`,
  type: 'gauge',
  label: 'Battery Voltage',
  min: 0,
  max: 16,
  unit: 'V',
  decimals: 1,
  bindings: {
    value: {
      type: 'static',
      value: 0, // Default, will be replaced at runtime
    },
  },
};
```

#### Auto-Configuration by Signal Type

| Signal ID         | Label                | Unit | Min  | Max  | Decimals |
| ----------------- | -------------------- | ---- | ---- | ---- | -------- |
| `battery-voltage` | Battery Voltage      | V    | 0    | 16   | 1        |
| `solar-voltage`   | Solar Voltage        | V    | 0    | 16   | 1        |
| `battery-current` | Battery Current      | A    | -100 | 100  | 1        |
| `battery-soc`     | State of Charge      | %    | 0    | 100  | 0        |
| `solar-power`     | Solar Power          | W    | 0    | 1000 | 0        |
| `tank-N-level`    | Tank N Level         | %    | 0    | 100  | 0        |
| `interior-temp`   | Interior Temperature | °F   | 40   | 120  | 0        |

## UI Changes

### Category Tabs

```tsx
<div className={styles.categoryTabs}>
  <button
    className={`${styles.categoryTab} ${selectedCategory === 'switching' ? styles.active : ''}`}
    onClick={() => setSelectedCategory('switching')}
  >
    🔘 Switching
  </button>
  <button
    className={`${styles.categoryTab} ${selectedCategory === 'signal-values' ? styles.active : ''}`}
    onClick={() => setSelectedCategory('signal-values')}
  >
    📊 Signal Values
  </button>
</div>
```

### Component Display

Each component shows:

- **Icon** - Emoji representing component type
- **Label** - Human-readable name
- **Type** - Component type (toggle, button, dimmer, gauge)
- **Channel/Source** - Hardware channel or data source

```tsx
<button className={styles.paletteItem} onClick={() => onAddComponent(id, type)}>
  <div className={styles.itemIcon}>📊</div>
  <div className={styles.itemInfo}>
    <div className={styles.itemLabel}>Battery Voltage</div>
    <div className={styles.itemType}>gauge</div>
    <div className={styles.itemChannel}>POWER</div>
  </div>
</button>
```

## Empty States

### No Hardware Configured

```tsx
<div className={styles.empty}>
  <p>Configure hardware channels first</p>
  <small>Go to Hardware tab to set up output channels</small>
</div>
```

### Empty Category

```tsx
<div className={styles.emptyCategory}>
  <p>No signal value components</p>
  <small>Enable power, plumbing, or HVAC systems</small>
</div>
```

## CSS Updates

### Category Tabs

```css
.categoryTabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--color-surface);
  border-radius: 6px;
}

.categoryTab {
  flex: 1;
  padding: 0.5rem 1rem;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.categoryTab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}
```

## Usage Flow

### Adding Switching Components

1. User selects a tab and section in the Editor
2. User clicks 🔘 Switching tab in Component Palette
3. All hardware output channels are shown (regardless of use)
4. User clicks a component to add it to the selected section
5. Component can be added again to other sections

### Adding Signal Values

1. User configures Power, Plumbing, or HVAC systems
2. Signal value components automatically appear in palette
3. User clicks 📊 Signal Values tab
4. Available monitoring signals are shown
5. User clicks a signal to add gauge/indicator to section
6. Same signal can be added multiple times (e.g., voltage gauge on multiple tabs)

## Benefits

### For Users

1. **Flexibility** - Add the same component to multiple tabs/sections
2. **Monitoring** - Easily add data displays without hardware channels
3. **Organization** - Clear categorization of component types
4. **Discoverability** - See all available components at once

### For Developers

1. **Maintainability** - Simpler logic without filtering
2. **Extensibility** - Easy to add new signal sources
3. **Type Safety** - Proper TypeScript types throughout
4. **Testability** - Components are pure functions

## Implementation Notes

### Component ID Generation

- **Switching:** `comp-${channelId}` (e.g., `comp-empirbus-core-0-0`)
- **Signal Values:** `comp-signal-${signalId}` (e.g., `comp-signal-battery-voltage`)

Each instance gets a unique ID even if it's the same component type.

### Binding Types

- **Switching Components:** Use `empirbus` bindings to hardware channels
- **Signal Values:** Use `static` bindings (placeholder for runtime data)

### Future Enhancements

1. **Search/Filter** - Add search within categories for large lists
2. **Favorites** - Star frequently used components
3. **Custom Signals** - User-defined signal value sources
4. **Component Preview** - Show visual preview on hover
5. **Drag-and-Drop** - Drag components directly to sections

## Testing

### Manual Tests

✅ Switch between category tabs  
✅ Add switching component multiple times  
✅ Add signal value to section  
✅ Configure power system → signal values appear  
✅ Add tank → tank level appears  
✅ Empty states for unconfigured systems

### Edge Cases

✅ No hardware configured  
✅ All subsystems disabled  
✅ Signal values with no data source  
✅ Multiple instances of same component

## Related Documentation

- [HOME_TAB_EDITOR_CONFIGURATION.md](./HOME_TAB_EDITOR_CONFIGURATION.md) - Home tab configuration
- [HARDWARE_CONFIG_QUICKSTART.md](./HARDWARE_CONFIG_QUICKSTART.md) - Hardware setup
- [POWER_SUBSYSTEM_COMPLETE.md](./POWER_SUBSYSTEM_COMPLETE.md) - Power system config
- [SCHEMA_SPEC.md](./SCHEMA_SPEC.md) - Component schema reference

## Files Modified

- `packages/web-configurator/src/components/ComponentPalette.tsx` - Complete refactor
- `packages/web-configurator/src/components/ComponentPalette.module.css` - Added category styles
- `packages/web-configurator/src/pages/EditorPage.tsx` - Updated handleAddComponent
- `packages/schema/src/schema.ts` - Schema validated
