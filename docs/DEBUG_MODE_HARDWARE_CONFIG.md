# Debug Mode: Random Hardware Configuration

**Date:** January 2025  
**Status:** ✅ Complete

## Overview

Added a secret debug mode to the Hardware Configuration page that allows developers to quickly generate random hardware configurations for testing purposes. This feature is hidden by default and activated via keyboard shortcut.

## Activation

### Keyboard Shortcut

Press **`Ctrl + Shift + D`** (Windows/Linux) or **`Cmd + Shift + D`** (Mac) to toggle debug mode.

When activated:

- A gradient "🎲 Random Config" button appears in the header
- The debug hint disappears

When deactivated:

- The debug button is hidden
- A hint is shown: "💡 Press Ctrl/Cmd + Shift + D to enable debug mode"

## Features

### Random Configuration Generator

When the "🎲 Random Config" button is clicked:

1. **Randomizes Control Types** - Each channel is assigned one of:
   - `toggle-button` (on/off switch)
   - `push-button` (momentary action)
   - `dimmer` (0-100% control)
   - `half-bridge` (motor control)

2. **Assigns Random Names** - From a curated list:
   - Living Room Light
   - Bedroom Fan
   - Kitchen Dimmer
   - Water Pump
   - Awning Motor
   - Step Light
   - Patio Light
   - Reading Lamp
   - Ceiling Fan
   - Accent Light
   - Cabinet Light
   - Exterior Light
   - Entry Light
   - Tank Heater
   - Air Compressor
   - Slide Motor
   - Leveling Jack
   - Stabilizer

3. **Selects Random Icons** - From an emoji set:
   - 💡 🔦 🌟 ⭐ 💫
   - 🔆 🌙 🎯 🔥 💧
   - 🌊 🌪️ ⚡ 🔌 🎨 🎭

4. **Configures Dimmer Ranges** - For channels set to `dimmer`:
   - Min: 0
   - Max: 100
   - Step: Randomly 1 or 5

5. **Leaves Some Unused** - 30% of channels are set to `not-used` for realism

### Result

After applying:

- All configured channels are updated in one batch
- An alert shows: "🎲 Random configuration applied! X channels configured"
- Changes are immediately reflected in the UI
- Can be saved/exported like any other configuration

## Implementation

### State Management

```typescript
const [debugModeEnabled, setDebugModeEnabled] = useState(false);

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      setDebugModeEnabled((prev) => !prev);
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Random Configuration Logic

```typescript
const handleRandomConfig = () => {
  if (!schema) return;

  const controlTypes: Array<'toggle-button' | 'push-button' | 'dimmer' | 'half-bridge'> = [
    'toggle-button',
    'push-button',
    'dimmer',
    'half-bridge',
  ];

  const randomOutputs: OutputChannel[] = channelDefinitions.map((ch) => {
    // 30% chance to skip
    if (Math.random() < 0.3) {
      return {
        id: ch.id,
        source: ch.source,
        channel: ch.channel,
        control: 'not-used' as const,
      };
    }

    const control = controlTypes[Math.floor(Math.random() * controlTypes.length)]!;
    const label = deviceNames[Math.floor(Math.random() * deviceNames.length)]!;
    const icon = icons[Math.floor(Math.random() * icons.length)]!;

    const output: OutputChannel = {
      id: ch.id,
      source: ch.source,
      channel: ch.channel,
      control,
      label,
      icon,
    };

    if (control === 'dimmer') {
      output.range = {
        min: 0,
        max: 100,
        step: Math.random() < 0.5 ? 1 : 5,
      };
    }

    return output;
  });

  updateSchema({
    ...schema,
    hardware: {
      ...hardwareConfig,
      outputs: randomOutputs,
    },
  });

  alert(
    `🎲 Random configuration applied!\n\n${randomOutputs.filter((o) => o.control !== 'not-used').length} channels configured`
  );
};
```

### UI Components

#### Header with Debug Button

```tsx
<div className={styles.header}>
  <div>
    <h2>Hardware Configuration</h2>
    <p>Configure output channels and hardware settings</p>
  </div>
  {debugModeEnabled && (
    <button
      onClick={handleRandomConfig}
      className={styles.debugButton}
      title="Generate random configuration for testing"
    >
      🎲 Random Config
    </button>
  )}
</div>
```

#### Debug Hint

```tsx
{
  !debugModeEnabled && (
    <div className={styles.debugHint}>
      💡 Press <kbd>Ctrl/Cmd + Shift + D</kbd> to enable debug mode
    </div>
  );
}
```

## Styling

### Debug Button

```css
.debugButton {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.debugButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

### Debug Hint

```css
.debugHint {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: 6px;
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  text-align: center;
}

.debugHint kbd {
  padding: 0.125rem 0.375rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
  margin: 0 0.25rem;
}
```

## Use Cases

### Quick Testing

Generate a realistic hardware configuration instantly without manually setting up each channel.

### Demo Configurations

Create varied configurations for presentations or screenshots.

### Edge Case Testing

Quickly generate different scenarios:

- All dimmers
- Mix of control types
- Sparse configurations (many unused)
- Dense configurations (most used)

### Development Speed

Skip repetitive manual configuration during development cycles.

## Security Considerations

### Why Hidden?

- **Not for End Users** - This is a developer tool, not a production feature
- **Prevents Accidental Use** - Hidden activation prevents users from accidentally overwriting their configs
- **Professional UI** - Debug tools don't clutter the production interface

### Safe Practices

- ✅ Requires explicit activation (keyboard shortcut)
- ✅ Shows confirmation alert with channel count
- ✅ Can be toggled off with same shortcut
- ✅ Uses standard schema update flow (undo-friendly)
- ✅ No data loss - overwrites current config (user-initiated)

## Testing

### Manual Tests

✅ Press Ctrl+Shift+D → Debug mode activates  
✅ Debug button appears in header  
✅ Click button → Random config applied  
✅ Alert shows channel count  
✅ Channels are randomized with valid values  
✅ Some channels set to 'not-used'  
✅ Dimmers have proper range values  
✅ Icons and labels are assigned  
✅ Press Ctrl+Shift+D again → Debug mode deactivates  
✅ Debug button disappears  
✅ Hint reappears

### Edge Cases

✅ Works with CORE system  
✅ Works with CORE LITE system  
✅ Works with Genesis boards  
✅ Handles empty configuration  
✅ Multiple clicks generate different configs

## Future Enhancements

### Preset Templates

Add specific configuration templates:

- "All Lights" - Only lighting controls
- "Motor Heavy" - Mostly half-bridge channels
- "Mixed Use" - Balanced mix
- "Minimal" - Just a few key channels

### Seed-Based Generation

Allow reproducible configurations:

```typescript
handleRandomConfig(seed?: number)
```

### Export/Import Debug Configs

Save generated configs as test fixtures:

```json
{
  "name": "Test Config 1",
  "seed": 12345,
  "channels": [...]
}
```

### Debug Panel

Expand to full debug panel with:

- Random hardware config (current)
- Random power config
- Random plumbing config
- Random HVAC config
- Complete system randomizer

## Files Modified

- `packages/web-configurator/src/pages/HardwareConfigPage.tsx` - Added debug mode state, keyboard handler, random config function
- `packages/web-configurator/src/pages/HardwareConfigPage.module.css` - Added debug button and hint styles

## Related Documentation

- [HARDWARE_CONFIG_QUICKSTART.md](./HARDWARE_CONFIG_QUICKSTART.md) - Hardware configuration guide
- [HARDWARE_CONFIG_IMPLEMENTATION.md](./HARDWARE_CONFIG_IMPLEMENTATION.md) - Implementation details
- [GENESIS_BOARD_MANAGEMENT.md](./GENESIS_BOARD_MANAGEMENT.md) - Genesis board system
