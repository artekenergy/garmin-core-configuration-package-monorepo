/**
 * Hardware-Driven Component Generator
 * 
 * Automatically generates UI components based on hardware configuration.
 * This bridges the gap between hardware outputs and UI components.
 */

import type { UISchema, Component, OutputChannel } from '@gcg/schema';

/**
 * Component generation rules based on hardware output control types
 */
const CONTROL_TO_COMPONENT_MAP = {
  'toggle-button': 'toggle',
  'push-button': 'button', 
  'dimmer': 'dimmer',
  'slider': 'slider',
  'not-used': null, // Don't generate components for unused outputs
  'half-bridge': 'toggle', // Half-bridge pairs become toggle controls
  'special-function': 'button', // Special functions become buttons
} as const;

/**
 * Get a unique component ID for a specific section to avoid duplicates
 */
function generateUniqueComponentId(channelId: string, sectionId: string): string {
  // Create unique ID by combining channel and section
  const sectionSuffix = sectionId.replace('section-', '').replace('-', '_');
  return `comp-${channelId}-${sectionSuffix}`;
}

/**
 * Generate a UI component from a hardware output configuration
 */
function generateComponentFromOutput(output: OutputChannel, sectionId: string): Component | null {
  // Skip unused outputs
  if (output.control === 'not-used' || !output.label) {
    return null;
  }

  // Determine component type
  const componentType = CONTROL_TO_COMPONENT_MAP[output.control];
  if (!componentType) {
    return null;
  }

  // Validate component type matches control type
  if (componentType === 'dimmer' && output.control !== 'dimmer') {
    // Don't create dimmer components for non-dimmer channels
    // Use toggle instead for toggle-button channels
    if (output.control === 'toggle-button') {
      return generateToggleComponent(output, sectionId);
    }
    return null;
  }

  // Generate component based on type and validate channel compatibility
  switch (componentType) {
    case 'toggle':
      return generateToggleComponent(output, sectionId);

    case 'button':
      return generateButtonComponent(output, sectionId);

    case 'dimmer':
      // Only create dimmer for actual dimmer channels
      if (output.control === 'dimmer') {
        return generateDimmerComponent(output, sectionId);
      }
      return null;

    case 'slider':
      return generateSliderComponent(output, sectionId);

    default:
      return null;
  }
}

/**
 * Generate a toggle component for toggle-button channels
 */
function generateToggleComponent(output: OutputChannel, sectionId: string): Component {
  return {
    id: generateUniqueComponentId(output.id.replace('/', '-'), sectionId),
    type: 'toggle' as const,
    label: output.label || 'Toggle',
    icon: getIconForOutput(output),
    variant: 'default' as const,
    bindings: {
      state: {
        type: 'empirbus' as const,
        channel: output.id,
        property: 'state' as const,
      },
    },
  };
}

/**
 * Generate a button component
 */
function generateButtonComponent(output: OutputChannel, sectionId: string): Component {
  return {
    id: generateUniqueComponentId(output.id.replace('/', '-'), sectionId),
    type: 'button' as const,
    label: output.label || 'Button',
    icon: getIconForOutput(output),
    action: output.control === 'push-button' ? 'momentary' as const : 'toggle' as const,
    variant: 'primary' as const,
    bindings: {
      action: {
        type: 'empirbus' as const,
        channel: output.id,
        property: 'state' as const,
      },
    },
  };
}

/**
 * Generate a dimmer component for dimmer channels
 */
function generateDimmerComponent(output: OutputChannel, sectionId: string): Component {
  return {
    id: generateUniqueComponentId(output.id.replace('/', '-'), sectionId),
    type: 'dimmer' as const,
    label: output.label || 'Dimmer',
    icon: getIconForOutput(output),
    min: output.range?.min ?? 0,
    max: output.range?.max ?? 100,
    step: output.range?.step ?? 1,
    bindings: {
      intensity: {
        type: 'empirbus' as const,
        channel: output.id,
        property: 'intensity' as const,
      },
    },
  };
}

/**
 * Generate a slider component
 */
function generateSliderComponent(output: OutputChannel, sectionId: string): Component {
  return {
    id: generateUniqueComponentId(output.id.replace('/', '-'), sectionId),
    type: 'slider' as const,
    label: output.label || 'Slider',
    icon: getIconForOutput(output),
    orientation: 'horizontal' as const,
    min: output.range?.min ?? 0,
    max: output.range?.max ?? 100,
    step: output.range?.step ?? 1,
    unit: output.range ? '%' : undefined,
    showValue: true,
    bindings: {
      value: {
        type: 'empirbus' as const,
        channel: output.id,
        property: 'value' as const,
      },
    },
  };
}

/**
 * Get appropriate icon for an output
 */
function getIconForOutput(output: OutputChannel): string | undefined {
  // Only return icons that are explicitly set by users
  // Don't automatically assign icons - users should choose them via the icon picker
  return output.icon;
}

/**
 * Categorize outputs into appropriate sections
 */
function categorizeOutputs(outputs: OutputChannel[]): {
  switching: OutputChannel[];
  lighting: OutputChannel[];
  hvac: OutputChannel[];
  power: OutputChannel[];
  plumbing: OutputChannel[];
  accessories: OutputChannel[];
} {
  const categories = {
    switching: [] as OutputChannel[],
    lighting: [] as OutputChannel[],
    hvac: [] as OutputChannel[],
    power: [] as OutputChannel[],
    plumbing: [] as OutputChannel[],
    accessories: [] as OutputChannel[],
  };

  outputs.forEach(output => {
    if (output.control === 'not-used' || !output.label) {
      return;
    }

    const label = output.label.toLowerCase();
    
    // Categorize based on label keywords
    if (label.includes('light') || label.includes('lighting') || label.includes('lamp')) {
      categories.lighting.push(output);
    } else if (label.includes('fan') || label.includes('heat') || label.includes('air') || label.includes('hvac')) {
      categories.hvac.push(output);
    } else if (label.includes('inverter') || label.includes('power') || label.includes('battery') || label.includes('solar')) {
      categories.power.push(output);
    } else if (label.includes('water') || label.includes('pump') || label.includes('tank') || label.includes('plumbing')) {
      categories.plumbing.push(output);
    } else if (label.includes('awning') || label.includes('slide') || label.includes('keypad')) {
      categories.accessories.push(output);
    } else {
      // Default to switching
      categories.switching.push(output);
    }
  });

  return categories;
}

/**
 * Generate components for a specific tab based on hardware outputs
 */
export function generateTabComponents(
  schema: UISchema, 
  tabPreset: string,
  sectionId: string
): Component[] {
  if (!schema.hardware?.outputs) {
    return [];
  }

  // Get only outputs that are specifically relevant to this section
  const relevantOutputs = getRelevantOutputsForSection(schema.hardware.outputs, tabPreset, sectionId);
  
  // Limit to maximum 3 components per section to avoid UI clutter
  const limitedOutputs = relevantOutputs.slice(0, 3);

  // Generate components from relevant outputs
  return limitedOutputs
    .map(output => generateComponentFromOutput(output, sectionId))
    .filter((component): component is Component => component !== null);
}

/**
 * Get outputs that are specifically relevant to a section (disabled to prevent automatic component generation)
 */
function getRelevantOutputsForSection(
  _outputs: OutputChannel[], 
  _tabPreset: string, 
  _sectionId: string
): OutputChannel[] {
  // Disable automatic hardware-driven component generation to prevent validation errors
  // Users should manually add components via the Component Palette instead
  return [];
}

/**
 * Generate smart default components for sections that don't have hardware mapping (disabled)
 */
export function generateDefaultComponents(
  _tabPreset: string,
  _sectionId: string
): Component[] {
  // Disable automatic component generation to prevent validation errors
  // Users should manually add components via the Component Palette instead
  return [];
}

export default {
  generateTabComponents,
  generateDefaultComponents,
  generateComponentFromOutput,
  categorizeOutputs,
};