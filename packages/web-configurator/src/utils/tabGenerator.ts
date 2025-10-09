import type { UISchema, Tab, Section, Component } from '@gcg/schema';

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
  // The sections are managed via tabs[].sections[], not schema.home
  const homeTab = schema.tabs.find((t) => t.preset === 'home' || t.id === 'tab-home');

  // If home tab exists and has sections, use those
  if (homeTab && homeTab.sections && homeTab.sections.length > 0) {
    return homeTab.sections;
  }

  // Otherwise return default structure (shouldn't happen in normal usage)
  return [
    {
      id: 'section-home-1',
      title: 'Quick Controls',
      enabled: true,
      type: 'switching',
      components: [],
    },
    {
      id: 'section-home-2',
      title: 'Status',
      enabled: true,
      type: 'signal-values',
      components: [],
    },
  ];
}

// ============================================================================
// LIGHTING TAB
// ============================================================================

function generateLightingTab(schema: UISchema): Section[] {
  // Lighting tab has three configurable subtab sections with stable IDs
  // The content is managed by LightingSectionManager
  const lightingTabConfig = schema.lightingTab || {
    interior: { enabled: true, title: 'Interior' },
    exterior: { enabled: true, title: 'Exterior' },
    rgb: { enabled: false, title: 'RGB' },
  };

  return [
    {
      id: 'section-lighting-interior',
      title: lightingTabConfig.interior?.title || 'Interior',
      components: [],
      enabled: true,
    },
    {
      id: 'section-lighting-exterior',
      title: lightingTabConfig.exterior?.title || 'Exterior',
      components: [],
      enabled: true,
    },
    {
      id: 'section-lighting-rgb',
      title: lightingTabConfig.rgb?.title || 'RGB',
      components: [],
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
    // No power config - should always have at least battery monitoring
    return [];
  }

  // Battery section - always include for power tab
  sections.push({
    id: generateId('section-battery'),
    title: 'Battery',
    components: [
      {
        id: generateId('gauge-battery-voltage'),
        type: 'gauge',
        label: 'Battery Voltage',
        variant: 'numeric' as const,
        bindings: {
          value: {
            type: 'empirbus' as const,
            channel: 'battery-voltage',
          },
        },
        min: 0,
        max: 16,
        decimals: 1,
        unit: 'V',
      },
      {
        id: generateId('gauge-battery-soc'),
        type: 'gauge',
        label: 'State of Charge',
        variant: 'circular' as const,
        bindings: {
          value: {
            type: 'empirbus' as const,
            channel: 'battery-soc',
          },
        },
        min: 0,
        max: 100,
        decimals: 0,
        unit: '%',
      },
    ],
  });

  // DC Charging section (optional)
  if (schema.power.dcCharging.secondAlternator || schema.power.dcCharging.orionXs) {
    const chargingComponents: Component[] = [];

    if (schema.power.dcCharging.secondAlternator) {
      chargingComponents.push({
        id: generateId('gauge-alternator-current'),
        type: 'gauge',
        label: 'Alternator',
        variant: 'linear' as const,
        bindings: {
          value: {
            type: 'empirbus' as const,
            channel: 'alternator-current',
          },
        },
        min: 0,
        max: 100,
        decimals: 1,
        unit: 'A',
      });
    }

    if (schema.power.dcCharging.orionXs) {
      chargingComponents.push({
        id: generateId('gauge-orion-current'),
        type: 'gauge',
        label: 'Orion XS',
        variant: 'linear' as const,
        bindings: {
          value: {
            type: 'empirbus' as const,
            channel: 'orion-current',
          },
        },
        min: 0,
        max: 50,
        decimals: 1,
        unit: 'A',
      });
    }

    sections.push({
      id: generateId('section-dc-charging'),
      title: 'DC Charging',
      components: chargingComponents,
    });
  }

  return sections;
}

// ============================================================================
// HVAC TAB
// ============================================================================

function generateHVACTab(schema: UISchema): Section[] {
  // Always return all three sections with stable IDs
  // Components will be populated based on hvac config

  const heatingComponents: Component[] = [];
  const coolingComponents: Component[] = [];
  const ventilationComponents: Component[] = [];

  if (schema.hvac) {
    // HEATING SUBTAB
    if (schema.hvac.heating.enabled) {
      // Temperature gauge
      heatingComponents.push({
        id: generateId('gauge-interior-temp'),
        type: 'gauge',
        label: 'Interior Temp',
        variant: 'numeric' as const,
        bindings: {
          value: {
            type: 'empirbus' as const,
            channel: 'interior-temperature',
          },
        },
        min: -20,
        max: 50,
        decimals: 1,
        unit: '°C',
      });

      // Heat source controls
      if (schema.hvac.heating.sources.diesel) {
        heatingComponents.push({
          id: generateId('toggle-diesel-heat'),
          type: 'toggle',
          label: 'Diesel Heat',
          bindings: {
            state: {
              type: 'empirbus' as const,
              channel: 'diesel-heater',
            },
          },
        });
      }

      if (schema.hvac.heating.sources.electric) {
        heatingComponents.push({
          id: generateId('toggle-electric-heat'),
          type: 'toggle',
          label: 'Electric Heat',
          bindings: {
            state: {
              type: 'empirbus' as const,
              channel: 'electric-heater',
            },
          },
        });
      }

      // Heat distribution fan
      if (schema.hvac.heating.distribution.fans) {
        heatingComponents.push({
          id: generateId('dimmer-heat-fan'),
          type: 'dimmer',
          label: 'Heat Fan Speed',
          min: 0,
          max: 100,
          step: 1,
          bindings: {
            intensity: {
              type: 'empirbus' as const,
              channel: 'heat-fan',
            },
          },
        });
      }
    }

    // COOLING SUBTAB
    if (schema.hvac.cooling.enabled) {
      coolingComponents.push({
        id: generateId('toggle-ac'),
        type: 'toggle',
        label: 'Air Conditioning',
        bindings: {
          state: {
            type: 'empirbus' as const,
            channel: 'air-conditioner',
          },
        },
      });
    }

    // VENTILATION SUBTAB
    if (schema.hvac.ventilation.enabled && schema.hvac.ventilation.fans > 0) {
      for (let i = 0; i < schema.hvac.ventilation.fans; i++) {
        ventilationComponents.push({
          id: generateId(`dimmer-vent-fan-${i + 1}`),
          type: 'dimmer',
          label: `Vent Fan ${i + 1}`,
          min: 0,
          max: 100,
          step: 1,
          bindings: {
            intensity: {
              type: 'empirbus' as const,
              channel: `vent-fan-${i + 1}`,
            },
          },
        });
      }
    }
  }

  return [
    {
      id: 'section-hvac-heating',
      title: 'Heating',
      enabled: true,
      components: heatingComponents,
    },
    {
      id: 'section-hvac-cooling',
      title: 'Cooling',
      enabled: true,
      components: coolingComponents,
    },
    {
      id: 'section-hvac-ventilation',
      title: 'Ventilation',
      enabled: true,
      components: ventilationComponents,
    },
  ];
}

// ============================================================================
// SWITCHING TAB
// ============================================================================

function generateSwitchingTab(schema: UISchema): Section[] {
  const switchComponents: Component[] = [];
  const accessoryComponents: Component[] = [];

  // SWITCHES SUBTAB - Group outputs that are toggles or buttons
  if (schema.hardware && schema.hardware.outputs.length > 0) {
    const toggleOutputs = schema.hardware.outputs.filter(
      (out) => out.control === 'toggle-button' || out.control === 'push-button'
    );

    toggleOutputs.forEach((output) => {
      if (output.control === 'push-button') {
        switchComponents.push({
          id: generateId(`button-${output.id}`),
          type: 'button' as const,
          action: 'momentary' as const,
          label: output.label || output.id,
          bindings: {
            action: {
              type: 'empirbus' as const,
              channel: output.id,
            },
          },
        });
      } else {
        switchComponents.push({
          id: generateId(`toggle-${output.id}`),
          type: 'toggle' as const,
          label: output.label || output.id,
          bindings: {
            state: {
              type: 'empirbus' as const,
              channel: output.id,
            },
          },
        });
      }
    });
  }

  // ACCESSORIES SUBTAB - Accessories section
  if (schema.accessories) {
    if (schema.accessories.awning.enabled) {
      accessoryComponents.push({
        id: generateId('button-awning-extend'),
        type: 'button',
        action: 'momentary' as const,
        label: 'Awning Extend',
        bindings: {
          action: {
            type: 'empirbus' as const,
            channel: 'awning-extend',
          },
        },
      });

      accessoryComponents.push({
        id: generateId('button-awning-retract'),
        type: 'button',
        action: 'momentary' as const,
        label: 'Awning Retract',
        bindings: {
          action: {
            type: 'empirbus' as const,
            channel: 'awning-retract',
          },
        },
      });

      if (schema.accessories.awning.light) {
        accessoryComponents.push({
          id: generateId('toggle-awning-light'),
          type: 'toggle',
          label: 'Awning Light',
          bindings: {
            state: {
              type: 'empirbus' as const,
              channel: 'awning-light',
            },
          },
        });
      }
    }

    if (schema.accessories.slides.enabled) {
      accessoryComponents.push({
        id: generateId('button-slides-extend'),
        type: 'button',
        action: 'momentary' as const,
        label: 'Slides Extend',
        bindings: {
          action: {
            type: 'empirbus' as const,
            channel: 'slides-extend',
          },
        },
      });

      accessoryComponents.push({
        id: generateId('button-slides-retract'),
        type: 'button',
        action: 'momentary' as const,
        label: 'Slides Retract',
        bindings: {
          action: {
            type: 'empirbus' as const,
            channel: 'slides-retract',
          },
        },
      });
    }
  }

  // Always return both sections with stable IDs
  return [
    {
      id: 'section-switching-switches',
      title: 'Switches',
      enabled: true,
      components: switchComponents,
    },
    {
      id: 'section-switching-accessories',
      title: 'Accessories',
      enabled: true,
      components: accessoryComponents,
    },
  ];
}

// ============================================================================
// PLUMBING TAB
// ============================================================================

function generatePlumbingTab(schema: UISchema): Section[] {
  const sections: Section[] = [];

  if (!schema.plumbing || !schema.plumbing.enabled) {
    // No plumbing configured
    return [];
  }

  const tankComponents: Component[] = schema.plumbing.tanks.map((tank, index) => ({
    id: generateId(`gauge-tank-${tank.type}-${index}`),
    type: 'gauge',
    label: tank.name || `${tank.type.charAt(0).toUpperCase() + tank.type.slice(1)} Tank`,
    variant: 'linear' as const,
    bindings: {
      value: {
        type: 'empirbus' as const,
        channel: `tank-${tank.type}-${index + 1}`,
      },
    },
    min: 0,
    max: 100,
    decimals: 0,
    unit: '%',
  }));

  sections.push({
    id: generateId('section-tank-levels'),
    title: 'Tank Levels',
    components: tankComponents,
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
