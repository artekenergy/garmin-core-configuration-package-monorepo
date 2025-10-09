/**
 * Zod schema definitions for Garmin Core Graphics Configurator
 *
 * This is the single source of truth for UI schema validation.
 * All schemas follow the specification in SCHEMA_SPEC.md v0.1.0
 */

import { z } from 'zod';

/**
 * Binding schemas - define how components connect to data sources
 */

// EmpirBus channel binding
export const EmpirBusBindingSchema = z.object({
  type: z.literal('empirbus'),
  channel: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, 'Channel must be lowercase alphanumeric with hyphens'),
  property: z.enum(['state', 'intensity', 'value']).optional(),
});

// NMEA2000 PGN binding
export const NMEA2000BindingSchema = z.object({
  type: z.literal('nmea2000'),
  pgn: z.number().int().positive(),
  field: z.string().min(1),
  instance: z.number().int().nonnegative().optional(),
});

// Static binding (for testing/mocking)
export const StaticBindingSchema = z.object({
  type: z.literal('static'),
  value: z.unknown(),
});

// Union of all binding types
export const BindingSchema = z.discriminatedUnion('type', [
  EmpirBusBindingSchema,
  NMEA2000BindingSchema,
  StaticBindingSchema,
]);

/**
 * Common properties shared by all components
 */
const BaseComponentSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-zA-Z][a-zA-Z0-9-_]*$/,
      'ID must start with letter and contain only alphanumeric, hyphens, underscores'
    ),
  type: z.string(), // Will be refined in specific component schemas
  label: z.string().min(1).max(50),
  icon: z.string().optional(),
  tooltip: z.string().max(200).optional(),
  disabled: z.boolean().optional(),
  visible: z.boolean().optional(),
});

/**
 * Toggle Component - Binary on/off switch
 */
export const ToggleComponentSchema = BaseComponentSchema.extend({
  type: z.literal('toggle'),
  variant: z.enum(['default', 'switch', 'checkbox', 'round']).optional(),
  bindings: z.object({
    state: BindingSchema,
  }),
});

/**
 * Button Component - Momentary or toggle action
 */
const ButtonBindingsSchema = z
  .object({
    state: BindingSchema.optional(),
    action: BindingSchema.optional(),
  })
  .refine(
    (data) => data.state !== undefined || data.action !== undefined,
    'Button must have at least one binding (state or action)'
  );

export const ButtonComponentSchema = BaseComponentSchema.extend({
  type: z.literal('button'),
  action: z.enum(['momentary', 'toggle']),
  variant: z.enum(['primary', 'secondary', 'danger', 'round']).optional(),
  bindings: ButtonBindingsSchema,
});

/**
 * Dimmer Component - Variable intensity control (0-100%)
 */
export const DimmerComponentBaseSchema = BaseComponentSchema.extend({
  type: z.literal('dimmer'),
  min: z.number().min(0).max(100).optional().default(0),
  max: z.number().min(0).max(100).optional().default(100),
  step: z.number().min(1).max(100).optional().default(1),
  bindings: z.object({
    intensity: BindingSchema,
  }),
});

export const DimmerComponentSchema = DimmerComponentBaseSchema.refine(
  (data) => (data.min || 0) < (data.max || 100),
  'min must be less than max'
);

/**
 * Gauge Component - Read-only numeric display
 */
export const GaugeComponentBaseSchema = BaseComponentSchema.extend({
  type: z.literal('gauge'),
  variant: z.enum(['circular', 'linear', 'numeric']).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.string().max(20).optional(),
  decimals: z.number().int().min(0).max(4).optional().default(0),
  bindings: z.object({
    value: BindingSchema,
  }),
});

export const GaugeComponentSchema = GaugeComponentBaseSchema.refine((data) => {
  if (data.min !== undefined && data.max !== undefined) {
    return data.min < data.max;
  }
  return true;
}, 'min must be less than max');

/**
 * Indicator Component - Status light
 */
export const IndicatorComponentSchema = BaseComponentSchema.extend({
  type: z.literal('indicator'),
  variant: z.enum(['led', 'badge', 'icon']).optional(),
  color: z.enum(['green', 'yellow', 'red', 'blue', 'white']).optional(),
  bindings: z.object({
    state: BindingSchema,
  }),
});

/**
 * Slider Component - Adjustable value input
 */
export const SliderComponentBaseSchema = BaseComponentSchema.extend({
  type: z.literal('slider'),
  orientation: z.enum(['horizontal', 'vertical']).optional().default('horizontal'),
  min: z.number(),
  max: z.number(),
  step: z.number().positive().optional().default(1),
  unit: z.string().max(20).optional(),
  showValue: z.boolean().optional().default(true),
  bindings: z.object({
    value: BindingSchema,
  }),
});

export const SliderComponentSchema = SliderComponentBaseSchema.refine(
  (data) => data.min < data.max,
  'min must be less than max'
);

/**
 * Union of all component types
 *
 * Note: We use z.union instead of discriminatedUnion because some
 * schemas have .refine() applied, which is incompatible with discriminatedUnion.
 * The type field still acts as a discriminator at runtime.
 */
export const ComponentSchema = z.union([
  ToggleComponentSchema,
  ButtonComponentSchema,
  DimmerComponentBaseSchema, // Use base schema for union
  GaugeComponentBaseSchema, // Use base schema for union
  IndicatorComponentSchema,
  SliderComponentBaseSchema, // Use base schema for union
]);

/**
 * Section - Group of related components
 */
export const SectionSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-zA-Z][a-zA-Z0-9-_]*$/,
      'ID must start with letter and contain only alphanumeric, hyphens, underscores'
    ),
  title: z.string().min(1).max(50),
  enabled: z.boolean().default(true), // Optional in input, required in output (defaults to true)
  type: z.enum(['switching', 'signal-values', 'image', 'mixed']).optional(), // For home tab sections
  icon: z.string().optional(),
  collapsible: z.boolean().optional(),
  collapsed: z.boolean().optional(),
  imageUrl: z.string().optional(), // For image type home sections
  components: z.array(ComponentSchema),
});

/**
 * Tab - Top-level navigation item containing sections
 * Supports both custom tabs and preset system tabs
 */
export const PresetTabIdSchema = z.enum([
  'home',
  'lighting',
  'power',
  'hvac',
  'switching',
  'plumbing',
]);

export const TabSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-zA-Z][a-zA-Z0-9-_]*$/,
      'ID must start with letter and contain only alphanumeric, hyphens, underscores'
    ),
  title: z.string().min(1).max(30),
  icon: z.string().optional(),
  preset: PresetTabIdSchema.optional(), // If set, this is a preset tab
  enabled: z.boolean().optional().default(true), // Allow disabling preset tabs
  sections: z.array(SectionSchema).min(1),
});

/**
 * Icon - Embedded or referenced icon definition
 */
export const IconSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^[a-zA-Z][a-zA-Z0-9-_]*$/,
        'ID must start with letter and contain only alphanumeric, hyphens, underscores'
      ),
    type: z.enum(['svg', 'png', 'jpg']),
    data: z.string().optional(), // base64 or SVG markup
    url: z.string().url().optional(),
  })
  .refine(
    (data) => data.data !== undefined || data.url !== undefined,
    'Icon must have either data or url'
  );

/**
 * Hardware Configuration - Output channel definitions
 */

// Hardware system types
export const HardwareSystemTypeSchema = z.enum(['core', 'core-lite']);

// Output control types
export const OutputControlTypeSchema = z.enum([
  'not-used',
  'push-button',
  'toggle-button',
  'slider',
  'half-bridge',
  'dimmer',
  'special-function',
]);

// Hardware sources
export const HardwareSourceSchema = z.enum(['core', 'core-lite', 'genesis']);

// Output channel configuration
export const OutputChannelSchema = z.object({
  id: z.string(), // e.g., "core-01", "core-lite-02", "genesis-01"
  source: HardwareSourceSchema,
  channel: z.number().int().positive(),
  label: z.string().max(50).optional(),
  control: OutputControlTypeSchema.default('not-used'),
  icon: z.string().optional(),
  signalId: z.number().int().positive().optional(),
  signals: z
    .object({
      toggle: z.number().int().positive().nullable().optional(),
      momentary: z.number().int().positive().nullable().optional(),
      dimmer: z.number().int().positive().nullable().optional(),
    })
    .optional(),
  range: z
    .object({
      min: z.number(),
      max: z.number(),
      step: z.number().positive(),
    })
    .optional(),
});

// Half-bridge pair configuration
export const HalfBridgePairSchema = z.object({
  source: HardwareSourceSchema,
  channelA: z.number().int().positive(),
  channelB: z.number().int().positive(),
  enabled: z.boolean().default(false),
});

// Signal ID mapping (channel -> signal ID override)
export const SignalMapEntrySchema = z.union([
  z.number().int().positive(), // Simple: channel -> signalId
  z.object({
    'push-button': z.number().int().positive().optional(),
    'toggle-button': z.number().int().positive().optional(),
    slider: z.number().int().positive().optional(),
    default: z.number().int().positive().optional(),
  }), // Complex: different signals per control type
]);

// Complete hardware configuration
export const HardwareConfigSchema = z.object({
  systemType: HardwareSystemTypeSchema.default('core'),
  outputs: z.array(OutputChannelSchema),
  halfBridgePairs: z.array(HalfBridgePairSchema).optional(),
  signalMap: z.record(z.string(), SignalMapEntrySchema).optional(),
  genesisBoards: z.number().int().min(0).max(4).default(0), // CORE: 0-4 boards, CORE LITE: 1-4 boards (1 included + up to 3 additional)
});

/**
 * System Options - Additional subsystems configuration
 */

// Power subsystem configuration
export const PowerConfigSchema = z.object({
  dcCharging: z
    .object({
      secondAlternator: z.boolean().default(false),
      orionXs: z.boolean().default(false),
    })
    .default({
      secondAlternator: false,
      orionXs: false,
    }),
  solar: z
    .object({
      enabled: z.boolean().default(false),
      primaryArray: z.boolean().default(true), // Always enabled when solar is enabled
      auxiliaryArray: z.boolean().default(false),
    })
    .default({
      enabled: false,
      primaryArray: true,
      auxiliaryArray: false,
    }),
  batteryManagement: z.enum(['victron', 'expion', 'battleborn', 'discover']).default('victron'),
  acLegs: z.number().int().min(1).max(2).default(2),
  multiplus: z
    .object({
      l1: z.boolean().default(false),
      l2: z.boolean().default(false),
    })
    .default({
      l1: false,
      l2: false,
    }),
});

// HVAC subsystem configuration
export const HVACConfigSchema = z.object({
  heating: z
    .object({
      enabled: z.boolean().default(false),
      sources: z
        .object({
          diesel: z.boolean().default(false),
          electric: z.boolean().default(false),
          engine: z.boolean().default(false),
        })
        .default({
          diesel: false,
          electric: false,
          engine: false,
        }),
      distribution: z
        .object({
          floor: z.boolean().default(false),
          fans: z.boolean().default(false),
        })
        .default({
          floor: false,
          fans: false,
        }),
      hotWater: z.boolean().default(false),
      auxZone: z.boolean().default(false),
    })
    .default({
      enabled: false,
      sources: { diesel: false, electric: false, engine: false },
      distribution: { floor: false, fans: false },
      hotWater: false,
      auxZone: false,
    }),
  cooling: z
    .object({
      enabled: z.boolean().default(false),
      brand: z.enum(['', 'recpro', 'truma', 'cruisencomfort']).default(''),
    })
    .default({
      enabled: false,
      brand: '',
    }),
  ventilation: z
    .object({
      enabled: z.boolean().default(false),
      fans: z.number().int().min(0).max(2).default(1),
    })
    .default({
      enabled: false,
      fans: 1,
    }),
});

// Plumbing subsystem configuration
export const PlumbingTankSchema = z.object({
  type: z.enum(['fresh', 'waste', 'black']),
  name: z.string().max(50).default(''),
});

export const PlumbingConfigSchema = z.object({
  enabled: z.boolean().default(true),
  monitoringSource: z.enum(['cerbo-gx', 'seelevel']).default('cerbo-gx'),
  count: z.number().int().min(1).max(4).default(3),
  tanks: z
    .array(PlumbingTankSchema)
    .min(1)
    .max(4)
    .default([
      { type: 'fresh', name: '' },
      { type: 'waste', name: '' },
      { type: 'black', name: '' },
    ]),
});

// Accessories subsystem configuration
export const AccessoriesConfigSchema = z.object({
  keypad: z
    .object({
      enabled: z.boolean().default(false),
      count: z.number().int().min(1).max(4).default(1),
      buttonsPerKeypad: z.number().int().min(5).max(16).default(8),
    })
    .default({ enabled: false, count: 1, buttonsPerKeypad: 8 }),
  awning: z
    .object({
      enabled: z.boolean().default(false),
      light: z.boolean().default(false),
      controlType: z.enum(['rvc', 'analog']).default('rvc'),
    })
    .default({ enabled: false, light: false, controlType: 'rvc' }),
  slides: z
    .object({
      enabled: z.boolean().default(false),
      controlType: z.enum(['rvc', 'analog']).default('rvc'),
      keypadSecured: z.boolean().default(false),
    })
    .default({ enabled: false, controlType: 'rvc', keypadSecured: false }),
  itcLighting: z
    .object({
      enabled: z.boolean().default(false),
      modules: z.number().int().min(0).max(4).default(0),
      zonesPerModule: z.union([z.literal(2), z.literal(4)]).default(2),
    })
    .default({ enabled: false, modules: 0, zonesPerModule: 2 }),
});

// Lighting subsystem configuration
export const LightingConfigSchema = z
  .object({
    enabled: z.boolean().default(false),
    modules: z.number().int().min(0).max(4).default(0),
    zonesPerModule: z.union([z.literal(2), z.literal(4)]).default(2),
  })
  .default({ enabled: false, modules: 0, zonesPerModule: 2 });

// Theme configuration
export const ThemeConfigSchema = z
  .object({
    preset: z.enum(['blue', 'purple', 'green', 'orange', 'red', 'dark', 'light']).default('blue'),
    // Optional: Allow custom overrides
    customColors: z
      .object({
        primary: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        secondary: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        accent: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        background: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        text: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
      })
      .optional(),
  })
  .default({ preset: 'blue' });

// Reusable subtab schema (can be used across multiple tabs)
export const SubtabConfigSchema = z.object({
  enabled: z.boolean().default(true),
  title: z.string().min(1).max(30).default('Subtab'),
  icon: z.string().optional(),
});

// Lighting tab configuration with subtab support
export const LightingTabConfigSchema = z
  .object({
    interior: SubtabConfigSchema.default({
      enabled: true,
      title: 'Interior',
      icon: '💡',
    }),
    exterior: SubtabConfigSchema.default({
      enabled: true,
      title: 'Exterior',
      icon: '🌟',
    }),
    rgb: SubtabConfigSchema.default({
      enabled: false, // Disabled by default, enabled when RGB modules are configured
      title: 'RGB',
      icon: '🌈',
    }),
  })
  .default({
    interior: { enabled: true, title: 'Interior', icon: '💡' },
    exterior: { enabled: true, title: 'Exterior', icon: '🌟' },
    rgb: { enabled: false, title: 'RGB', icon: '🌈' },
  });

// HVAC tab configuration with subtab support
export const HVACTabConfigSchema = z
  .object({
    heating: SubtabConfigSchema.default({
      enabled: false, // Auto-enabled when hvac.heating.enabled is true
      title: 'Heating',
      icon: '🔥',
    }),
    cooling: SubtabConfigSchema.default({
      enabled: false, // Auto-enabled when hvac.cooling.enabled is true
      title: 'Cooling',
      icon: '❄️',
    }),
    ventilation: SubtabConfigSchema.default({
      enabled: false, // Auto-enabled when hvac.ventilation.enabled is true
      title: 'Ventilation',
      icon: '💨',
    }),
  })
  .default({
    heating: { enabled: false, title: 'Heating', icon: '🔥' },
    cooling: { enabled: false, title: 'Cooling', icon: '❄️' },
    ventilation: { enabled: false, title: 'Ventilation', icon: '💨' },
  });

// Switching tab configuration with subtab support
export const SwitchingTabConfigSchema = z
  .object({
    switches: SubtabConfigSchema.default({
      enabled: true,
      title: 'Switches',
      icon: '🔌',
    }),
    accessories: SubtabConfigSchema.default({
      enabled: true,
      title: 'Accessories',
      icon: '⚡',
    }),
    customSection: z
      .object({
        enabled: z.boolean().default(true),
        title: z.string().min(1).max(30).default('Custom Controls'),
      })
      .default({
        enabled: true,
        title: 'Custom Controls',
      })
      .optional(), // Keep for backwards compatibility
  })
  .default({
    switches: { enabled: true, title: 'Switches', icon: '🔌' },
    accessories: { enabled: true, title: 'Accessories', icon: '⚡' },
  });

// Plumbing tab configuration
export const PlumbingTabConfigSchema = z
  .object({
    switchingSection: z
      .object({
        enabled: z.boolean().default(false),
        title: z.string().min(1).max(30).default('Plumbing Controls'),
      })
      .default({
        enabled: false,
        title: 'Plumbing Controls',
      }),
  })
  .default({
    switchingSection: { enabled: false, title: 'Plumbing Controls' },
  });

/**
 * Metadata - Information about the schema
 */
export const MetadataSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic version (x.y.z)'),
  author: z.string().max(100).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Root Schema - The complete UI definition
 */
export const UISchemaSchema = z.object({
  schemaVersion: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Schema version must be semantic version (x.y.z)'),
  metadata: MetadataSchema,
  theme: ThemeConfigSchema.optional(),
  lightingTab: LightingTabConfigSchema.optional(),
  hvacTab: HVACTabConfigSchema.optional(),
  switchingTab: SwitchingTabConfigSchema.optional(),
  plumbingTab: PlumbingTabConfigSchema.optional(),
  hardware: HardwareConfigSchema.optional(),
  power: PowerConfigSchema.optional(),
  hvac: HVACConfigSchema.optional(),
  plumbing: PlumbingConfigSchema.optional(),
  accessories: AccessoriesConfigSchema.optional(),
  lighting: LightingConfigSchema.optional(),
  tabs: z.array(TabSchema).min(1).max(6), // Changed to max 6 for preset tabs
  icons: z.array(IconSchema).optional(),
});

// Export the root schema type
export type UISchema = z.infer<typeof UISchemaSchema>;
export type Tab = z.infer<typeof TabSchema>;
export type PresetTabId = z.infer<typeof PresetTabIdSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Component = z.infer<typeof ComponentSchema>;
export type SubtabConfig = z.infer<typeof SubtabConfigSchema>;
export type LightingTabConfig = z.infer<typeof LightingTabConfigSchema>;
export type HVACTabConfig = z.infer<typeof HVACTabConfigSchema>;
export type SwitchingTabConfig = z.infer<typeof SwitchingTabConfigSchema>;
export type PlumbingTabConfig = z.infer<typeof PlumbingTabConfigSchema>;
export type HardwareConfig = z.infer<typeof HardwareConfigSchema>;
export type OutputChannel = z.infer<typeof OutputChannelSchema>;
export type HalfBridgePair = z.infer<typeof HalfBridgePairSchema>;
export type PowerConfig = z.infer<typeof PowerConfigSchema>;
export type HVACConfig = z.infer<typeof HVACConfigSchema>;
export type PlumbingConfig = z.infer<typeof PlumbingConfigSchema>;
export type PlumbingTank = z.infer<typeof PlumbingTankSchema>;
export type AccessoriesConfig = z.infer<typeof AccessoriesConfigSchema>;
export type LightingConfig = z.infer<typeof LightingConfigSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
