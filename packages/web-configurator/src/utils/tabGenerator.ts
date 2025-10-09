import type { UISchema, Tab, Section } from '@gcg/schema';

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

  // Battery section - empty by default, user can add components via component palette
  sections.push({
    id: generateId('section-battery'),
    title: 'Battery',
    enabled: true,
    components: [],
  });

  // DC Charging section - empty by default, user can add components if needed
  if (schema.power.dcCharging.secondAlternator || schema.power.dcCharging.orionXs) {
    sections.push({
      id: generateId('section-dc-charging'),
      title: 'DC Charging',
      enabled: true,
      components: [],
    });
  }

  return sections;
}

// ============================================================================
// HVAC TAB
// ============================================================================

function generateHVACTab(_schema: UISchema): Section[] {
  // Always return all three sections with stable IDs and empty components
  // User can add components via component palette
  
  return [
    {
      id: generateId('section-hvac-heating'),
      title: 'Heating',
      enabled: true,
      components: [],
    },
    {
      id: generateId('section-hvac-cooling'),
      title: 'Cooling',
      enabled: true,
      components: [],
    },
    {
      id: generateId('section-hvac-ventilation'),
      title: 'Ventilation',
      enabled: true,
      components: [],
    },
  ];
}

// ============================================================================
// SWITCHING TAB
// ============================================================================

function generateSwitchingTab(_schema: UISchema): Section[] {
  // Always return both sections with stable IDs and empty components
  // User can add components via component palette
  return [
    {
      id: 'section-switching-switches',
      title: 'Switches',
      enabled: true,
      components: [],
    },
    {
      id: 'section-switching-accessories',
      title: 'Accessories',
      enabled: true,
      components: [],
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

  // Tank levels section - empty by default, user can add components via component palette
  sections.push({
    id: generateId('section-tank-levels'),
    title: 'Tank Levels',
    enabled: true,
    components: [],
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
