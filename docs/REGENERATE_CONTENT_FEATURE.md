# Regenerate Content Feature

## Overview

The "Regenerate Content" feature allows users to automatically update tab sections and components based on the current system configuration. This ensures that the UI stays synchronized with hardware changes without manually recreating components.

## Location

The **⚡ Regenerate Content** button is located in the EditorPage header, next to the tab navigation.

## How It Works

### 1. **Preserves User Preferences**

- **Enabled/Disabled State**: Tabs that the user has manually disabled will remain disabled
- **Existing Content**: If a subsystem is not configured, the tab retains its existing sections rather than being cleared
- **Custom Edits**: User modifications to labels, bindings, and positions are preserved unless the content is regenerated

### 2. **Smart Content Generation**

Each tab generates content based on the system configuration:

#### Home Tab

- **Favorites Section**: Currently returns empty (placeholder for future favorite shortcuts)
- **Placeholder**: Shows "Configure this subsystem to see controls here" when no content

#### Lighting Tab

- **Requirements**: `lighting.enabled = true` and `lighting.zones > 0`
- **Generated Content**:
  - One section per zone
  - Dimmer component for each zone
  - Bindings: `light-zone-{N}`
- **Empty State**: Shows placeholder section when lighting not configured

#### Power Tab

- **Requirements**: `power.batteries > 0` or charging sources configured
- **Generated Content**:
  - Battery voltage gauges (one per battery)
  - Battery current gauges (one per battery)
  - Optional: Alternator charging indicator
  - Optional: Shore power charging indicator
  - Optional: Solar charging indicator
- **Bindings**:
  - `battery-voltage-{N}`
  - `battery-current-{N}`
  - `alternator-voltage`, `alternator-current`
  - `shore-power-voltage`, `shore-power-current`
  - `solar-voltage`, `solar-current`
- **Empty State**: Shows placeholder when no power systems configured

#### HVAC Tab

- **Requirements**: Any of `hvac.heating`, `hvac.cooling`, or `hvac.ventilation` enabled
- **Generated Content**:
  - **Heating Section**: Thermostat + heating toggle (if enabled)
  - **Cooling Section**: Thermostat + cooling toggle (if enabled)
  - **Ventilation Section**: Fan speed controls (if enabled)
- **Bindings**:
  - `heating-temperature`, `heating-state`
  - `cooling-temperature`, `cooling-state`
  - `ventilation-fan-speed`, `ventilation-state`
- **Empty State**: Shows placeholder when no HVAC systems configured

#### Switching Tab

- **Requirements**: Hardware outputs configured in `hardware-config.json`
- **Generated Content**:
  - One section: "Controls"
  - Toggle or button for each output
  - Type determined by output configuration
- **Bindings**: Channel name from hardware config (e.g., `deck-lights`, `nav-lights`)
- **Empty State**: Shows placeholder when no outputs configured

#### Plumbing Tab

- **Requirements**: `plumbing.enabled = true` and tanks configured
- **Generated Content**:
  - **Tank Gauges Section**: One gauge per tank
  - **Water System Section**: Fresh water pump toggle
- **Bindings**:
  - `tank-{type}-{N}-level` (e.g., `tank-freshwater-1-level`)
  - `fresh-water-pump`
- **Empty State**: Shows placeholder when plumbing not configured

### 3. **Validation Protection**

- All generated content meets schema requirements:
  - Sections must have at least 1 component
  - Tabs must have at least 1 section
- Placeholder sections are added when no content is generated to prevent validation errors
- Placeholder components use static bindings and are disabled by default

## Usage

1. **Configure Your System**
   - Edit `configuration/applications.json` to define subsystems
   - Edit `configuration/hardware-config.json` to define outputs and channels

2. **Click Regenerate**
   - Press the **⚡ Regenerate Content** button
   - Content will be automatically updated for all enabled tabs

3. **Review Changes**
   - Check each tab to see the newly generated sections and components
   - Customize labels, icons, and positions as needed
   - Use the Schema Viewer to verify bindings are correct

## Important Notes

### What Gets Overwritten

- **Sections and Components**: All sections on regenerated tabs are replaced
- **Labels**: Default labels are applied (e.g., "Zone 1", "Battery 1 Voltage")
- **Bindings**: Channel bindings are reset to match configuration

### What Gets Preserved

- **Tab Enable/Disable State**: User's choices are respected
- **Tab Order**: Preset tabs remain in fixed order
- **Empty Tabs**: Tabs without configured subsystems show placeholder content
- **Configuration Files**: System configuration is not modified

### When to Regenerate

- ✅ After adding/removing lighting zones
- ✅ After changing battery count or charging sources
- ✅ After enabling/disabling HVAC subsystems
- ✅ After adding/removing hardware outputs
- ✅ After configuring tanks or water systems
- ❌ For minor label/styling changes (edit manually instead)
- ❌ When troubleshooting validation errors (check schema first)

## Troubleshooting

### Validation Errors After Regeneration

- **Check Configuration**: Ensure `applications.json` and `hardware-config.json` are valid JSON
- **Check Channel Mappings**: Verify channels exist in `channel-mapping.json`
- **Check Schema**: Use the Schema Viewer to identify missing or invalid fields

### Content Not Updating

- **Verify Subsystem Enabled**: Check that the relevant subsystem is enabled in configuration
- **Check Tab Enabled**: Disabled tabs won't show updated content until re-enabled
- **Clear and Regenerate**: Try disabling/enabling the tab, then regenerating

### Placeholder Content Showing

- This is expected when a subsystem is not configured
- Enable the subsystem in `applications.json` and regenerate
- Or manually create custom content for that tab

## Related Documentation

- [AUTO_GENERATED_CONTENT.md](./AUTO_GENERATED_CONTENT.md) - Technical details of generation logic
- [PRESET_TABS_SYSTEM.md](./PRESET_TABS_SYSTEM.md) - Tab system architecture
- [CHANNEL_MAPPING_QUICKSTART.md](./CHANNEL_MAPPING_QUICKSTART.md) - Channel binding guide
- [HARDWARE_CONFIG_QUICKSTART.md](./HARDWARE_CONFIG_QUICKSTART.md) - Hardware configuration guide
