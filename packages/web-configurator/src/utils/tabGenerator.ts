import type { UISchema, Tab, Section, Component } from '@gcg/schema';
import { generateTabComponents, generateDefaultComponents } from './hardwareComponentGenerator';

/**
 * Generates sections and components for tabs based on system configuration
 */

// Helper to generate component IDs
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// HOME TAB
// ============================================================================

function generateHomeTab(schema: UISchema): Section[] {
  // Home tab has two configurable sections with stable IDs
  const homeTab = schema.tabs.find((t) => t.preset === 'home' || t.id === 'tab-home');

  // If home tab exists and has sections, use those
  if (homeTab && homeTab.sections && homeTab.sections.length > 0) {
    return homeTab.sections;
  }

  // Generate default structure with smart components
  return [
    {
      id: 'section-home-1',
      title: 'Quick Controls',
      enabled: true,
      type: 'switching',
      components: generateTabComponents(schema, 'home', 'section-home-1'),
    },
    {
      id: 'section-home-2',
      title: 'Status',
      enabled: true,
      type: 'signal-values',
      components: generateDefaultComponents('home', 'section-home-2'),
    },
  ];
}

// ============================================================================
// LIGHTING TAB
// ============================================================================

function generateLightingTab(schema: UISchema): Section[] {
  // Lighting tab has three configurable subtab sections with stable IDs
  const lightingTabConfig = schema.lightingTab || {
    interior: { enabled: true, title: 'Interior' },
    exterior: { enabled: true, title: 'Exterior' },
    rgb: { enabled: false, title: 'RGB' },
  };

  return [
    {
      id: 'section-lighting-interior',
      title: lightingTabConfig.interior?.title || 'Interior',
      components: generateTabComponents(schema, 'lighting', 'section-lighting-interior'),
      enabled: true,
    },
    {
      id: 'section-lighting-exterior',
      title: lightingTabConfig.exterior?.title || 'Exterior',
      components: generateTabComponents(schema, 'lighting', 'section-lighting-exterior'),
      enabled: true,
    },
    {
      id: 'section-lighting-rgb',
      title: lightingTabConfig.rgb?.title || 'RGB',
      components: generateTabComponents(schema, 'lighting', 'section-lighting-rgb'),
      enabled: true,
    },
  ];
}

// ============================================================================
// POWER TAB
// ============================================================================

function generatePowerTab(schema: UISchema): Section[] {
  const sections: Section[] = [];

  if (!schema.power) {
    // No power config - return empty sections to avoid errors
    return [
      {
        id: generateId('section-battery'),
        title: 'Battery',
        enabled: true,
        components: [],
      },
    ];
  }

  // Battery section - generate components from hardware
  sections.push({
    id: 'section-battery',
    title: 'Battery',
    enabled: true,
    components: generateTabComponents(schema, 'power', 'section-battery'),
  });

  // DC Charging section - generate components if hardware is present
  if (schema.power.dcCharging.secondAlternator || schema.power.dcCharging.orionXs) {
    sections.push({
      id: 'section-dc-charging',
      title: 'DC Charging',
      enabled: true,
      components: generateTabComponents(schema, 'power', 'section-dc-charging'),
    });
  }

  // Solar section - auto-generate gauges/indicator when enabled
  const solarCfg = schema.power.solar;
  if (solarCfg?.enabled) {
    const solarComponents: Component[] = [];

    // Optional: solar status indicator
    solarComponents.push(createIndicatorComponent(
      'comp-solar-indicator',
      'Solar Status',
      'signal-solar-indicator'
    ));

    // Primary array signals
    if (solarCfg.primaryArray) {
      solarComponents.push(
        createGaugeComponent(
          'comp-solar-primary-amperage',
          'PRIMARY AMPERAGE',
          'A',
          -100,
          100,
          1,
          'signal-primary-solar-amperage'
        )
      );
      solarComponents.push(
        createGaugeComponent(
          'comp-solar-primary-voltage',
          'PRIMARY VOLTAGE',
          'V',
          0,
          16,
          2,
          'signal-primary-solar-voltage'
        )
      );
    }

    // Auxiliary array signals
    if (solarCfg.auxiliaryArray) {
      solarComponents.push(
        createGaugeComponent(
          'comp-solar-aux-amperage',
          'AUXILIARY AMPERAGE',
          'A',
          -100,
          100,
          1,
          'signal-aux-solar-amperage'
        )
      );
      solarComponents.push(
        createGaugeComponent(
          'comp-solar-aux-voltage',
          'AUXILIARY VOLTAGE',
          'V',
          0,
          16,
          2,
          'signal-aux-solar-voltage'
        )
      );
    }

    // Only add section if we created at least one component
    if (solarComponents.length > 0) {
      sections.push({
        id: 'section-solar',
        title: 'Solar',
        enabled: true,
        components: solarComponents,
      });
    }
  }

  return sections;
}

// ============================================================================
// HVAC TAB
// ============================================================================

function generateHVACTab(schema: UISchema): Section[] {
  // Generate sections with hardware-driven components
  return [
    {
      id: 'section-hvac-heating',
      title: 'Heating',
      enabled: true,
      components: generateTabComponents(schema, 'hvac', 'section-hvac-heating'),
    },
    {
      id: 'section-hvac-cooling',
      title: 'Cooling',
      enabled: true,
      components: generateTabComponents(schema, 'hvac', 'section-hvac-cooling'),
    },
    {
      id: 'section-hvac-ventilation',
      title: 'Ventilation',
      enabled: true,
      components: generateTabComponents(schema, 'hvac', 'section-hvac-ventilation'),
    },
  ];
}

// ============================================================================
// SWITCHING TAB
// ============================================================================

function generateSwitchingTab(schema: UISchema): Section[] {
  // Generate sections with hardware-driven components
  return [
    {
      id: 'section-switching-switches',
      title: 'Switches',
      enabled: true,
      components: generateTabComponents(schema, 'switching', 'section-switching-switches'),
    },
    {
      id: 'section-switching-accessories',
      title: 'Accessories',
      enabled: true,
      components: generateTabComponents(schema, 'switching', 'section-switching-accessories'),
    },
  ];
}

// ============================================================================
// PLUMBING TAB
// ============================================================================

function generatePlumbingTab(schema: UISchema): Section[] {
  const sections: Section[] = [];

  if (!schema.plumbing || !schema.plumbing.enabled) {
    // No plumbing configured - return empty section to avoid errors
    return [
      {
        id: generateId('section-tank-levels'),
        title: 'Tank Levels',
        enabled: true,
        components: [],
      },
    ];
  }

  // Tank levels section - generate components from hardware
  sections.push({
    id: 'section-tank-levels',
    title: 'Tank Levels',
    enabled: true,
    components: generateTabComponents(schema, 'plumbing', 'section-tank-levels'),
  });

  return sections;
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Regenerates tab sections and components based on system configuration
 * Preserves existing tabs' enabled state and order, but replaces their sections
 */
export function regenerateTabContent(schema: UISchema): UISchema {
  const updatedTabs: Tab[] = schema.tabs.map((tab) => {
    let newSections: Section[] = [];

    // Generate sections based on preset type
    switch (tab.preset) {
      case 'home':
        newSections = generateHomeTab(schema);
        break;
      case 'lighting':
        newSections = generateLightingTab(schema);
        break;
      case 'power':
        newSections = generatePowerTab(schema);
        break;
      case 'hvac':
        newSections = generateHVACTab(schema);
        break;
      case 'switching':
        newSections = generateSwitchingTab(schema);
        break;
      case 'plumbing':
        newSections = generatePlumbingTab(schema);
        break;
      default:
        // Keep existing sections for non-preset tabs
        newSections = tab.sections;
    }

    // If no sections generated, create a minimal placeholder section
    // This prevents schema validation errors (tabs require min 1 section)
    if (newSections.length === 0) {
      newSections = [
        {
          id: generateId('section-placeholder'),
          title: 'No Content',
          enabled: true,
          components: [
            {
              id: generateId('placeholder-text'),
              type: 'toggle',
              label: 'Configure this subsystem to see controls here',
              bindings: {
                state: {
                  type: 'static' as const,
                  value: false,
                },
              },
            },
          ],
        },
      ];
    }

    return {
      ...tab,
      sections: newSections,
    };
  });

  return {
    ...schema,
    tabs: updatedTabs,
  };
}

/**
 * Checks if tab content should be auto-enabled based on configuration
 */
export function autoEnableTabs(schema: UISchema): UISchema {
  const updatedTabs: Tab[] = schema.tabs.map((tab) => {
    let shouldEnable = tab.enabled ?? true; // Default to enabled

    // Auto-enable/disable based on configuration
    switch (tab.preset) {
      case 'home':
        shouldEnable = true; // Always enabled
        break;
      case 'lighting':
        shouldEnable = Boolean(schema.lighting?.enabled && (schema.lighting.modules || 0) > 0);
        break;
      case 'power':
        shouldEnable = true; // Always show power
        break;
      case 'hvac':
        shouldEnable = Boolean(
          schema.hvac?.heating?.enabled ||
            schema.hvac?.cooling?.enabled ||
            schema.hvac?.ventilation?.enabled
        );
        break;
      case 'switching':
        shouldEnable = Boolean((schema.hardware?.outputs?.length || 0) > 0);
        break;
      case 'plumbing':
        shouldEnable = Boolean(schema.plumbing?.enabled);
        break;
    }

    return {
      ...tab,
      enabled: shouldEnable,
    };
  });

  return {
    ...schema,
    tabs: updatedTabs,
  };
}

// ============================================================================
// Helpers: Component creators for power tab
// ============================================================================

function createGaugeComponent(
  id: string,
  label: string,
  unit: string,
  min: number | undefined,
  max: number | undefined,
  decimals: number | undefined,
  channel: string
): Component {
  return {
    id,
    type: 'gauge',
    label,
    variant: 'numeric',
    unit,
    min,
    max,
    decimals,
    bindings: {
      value: {
        type: 'empirbus',
        channel,
        property: 'value',
      },
    },
  } as Component;
}

function createIndicatorComponent(id: string, label: string, channel: string): Component {
  return {
    id,
    type: 'indicator',
    label,
    variant: 'badge',
    color: 'green',
    bindings: {
      state: {
        type: 'empirbus',
        channel,
        property: 'state',
      },
    },
  } as Component;
}
