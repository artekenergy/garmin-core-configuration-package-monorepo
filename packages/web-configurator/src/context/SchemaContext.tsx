import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { validateSchema, type UISchema, type ValidationResult } from '@gcg/schema';
import { regenerateTabContent } from '../utils/tabGenerator';
import {
  validateAllChannelBindings,
  type ChannelValidationError,
} from '../utils/channelValidation';

/**
 * Hardware channel info extracted from hardware-config.json
 */
export interface HardwareChannel {
  id: string; // e.g., "core-01"
  label: string; // e.g., "Galley Lights"
  control: string; // Control type (allow any string from hardware config)
  icon?: string; // Icon path if specified
  source: 'core' | 'genesis' | 'lite'; // Which board
  channel: number; // Channel number on that board
  signals?: {
    toggle: number | null;
    momentary: number | null;
    dimmer: number | null;
  };
}

interface SchemaContextType {
  schema: UISchema | null;
  validationResult: ValidationResult | null;
  hardwareChannels: HardwareChannel[]; // Available channels from hardware config
  channelErrors: ChannelValidationError[]; // Channel binding validation errors
  updateSchema: (newSchema: UISchema) => void;
  loadSchema: (schemaData: unknown) => void;
  resetSchema: () => void;
  loadHardwareConfig: (hardwareConfigData: unknown) => void; // New method
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

const defaultSchema: UISchema = {
  schemaVersion: '0.1.0',
  metadata: {
    name: 'New HMI Configuration',
    version: '1.0.0',
    description: 'Created with Garmin Core Graphics Configurator',
    author: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  home: {
    section1: { enabled: true, type: 'switching', title: 'Quick Controls' },
    section2: { enabled: true, type: 'signal-values', title: 'Status' },
  },
  hardware: {
    systemType: 'core',
    outputs: [],
    halfBridgePairs: [],
    signalMap: {},
    genesisBoards: 0,
  },
  power: {
    dcCharging: {
      secondAlternator: false,
      orionXs: false,
    },
    solar: {
      enabled: false,
      primaryArray: true,
      auxiliaryArray: false,
    },
    batteryManagement: 'victron',
    acLegs: 2,
    multiplus: {
      l1: false,
      l2: false,
    },
  },
  hvac: {
    heating: {
      enabled: false,
      sources: { diesel: false, electric: false, engine: false },
      distribution: { floor: false, fans: false },
      hotWater: false,
      auxZone: false,
    },
    cooling: {
      enabled: false,
      brand: '',
    },
    ventilation: {
      enabled: false,
      fans: 1,
    },
  },
  plumbing: {
    enabled: true,
    monitoringSource: 'cerbo-gx',
    count: 3,
    tanks: [
      { type: 'fresh', name: '' },
      { type: 'waste', name: '' },
      { type: 'black', name: '' },
    ],
  },
  accessories: {
    keypad: {
      enabled: false,
      count: 1,
      buttonsPerKeypad: 8,
    },
    awning: {
      enabled: false,
      light: false,
      controlType: 'rvc',
    },
    slides: {
      enabled: false,
      controlType: 'rvc',
      keypadSecured: false,
    },
    itcLighting: {
      enabled: false,
      modules: 0,
      zonesPerModule: 2,
    },
  },
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
      enabled: false,
      title: 'Heating',
      icon: '🔥',
    },
    cooling: {
      enabled: false,
      title: 'Cooling',
      icon: '❄️',
    },
    ventilation: {
      enabled: false,
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
  tabs: [
    {
      id: 'tab-home',
      title: 'Home',
      preset: 'home',
      enabled: true,
      sections: [
        {
          id: 'section-home-1',
          title: 'Quick Controls',
          components: [],
        },
        {
          id: 'section-home-2',
          title: 'Status',
          components: [],
        },
      ],
    },
    {
      id: 'tab-lighting',
      title: 'Lighting',
      preset: 'lighting',
      enabled: true,
      sections: [
        {
          id: 'section-lighting-interior',
          title: 'Interior Lights',
          components: [],
        },
        {
          id: 'section-lighting-exterior',
          title: 'Exterior Lights',
          components: [],
        },
      ],
    },
    {
      id: 'tab-power',
      title: 'Power',
      preset: 'power',
      enabled: true,
      sections: [
        {
          id: 'section-power',
          title: 'Power Status',
          components: [],
        },
      ],
    },
    {
      id: 'tab-hvac',
      title: 'HVAC',
      preset: 'hvac',
      enabled: false, // Disabled by default
      sections: [
        {
          id: 'section-climate',
          title: 'Climate Control',
          components: [],
        },
      ],
    },
    {
      id: 'tab-switching',
      title: 'Switching',
      preset: 'switching',
      enabled: true,
      sections: [
        {
          id: 'section-switches',
          title: 'Switches',
          components: [],
        },
      ],
    },
    {
      id: 'tab-plumbing',
      title: 'Plumbing',
      preset: 'plumbing',
      enabled: false, // Disabled by default
      sections: [
        {
          id: 'section-tanks',
          title: 'Tank Levels',
          components: [],
        },
      ],
    },
  ],
};

export function SchemaProvider({ children }: { children: ReactNode }) {
  const [schema, setSchema] = useState<UISchema | null>(() => {
    // Fix section IDs when loading the default schema
    return regenerateTabContent(defaultSchema);
  });
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [hardwareChannels, setHardwareChannels] = useState<HardwareChannel[]>([]);
  const [channelErrors, setChannelErrors] = useState<ChannelValidationError[]>([]);

  // Validate schema whenever it changes
  useEffect(() => {
    if (schema) {
      const result = validateSchema(schema);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [schema]);

  // Validate channel bindings whenever schema or hardware channels change
  useEffect(() => {
    if (schema && hardwareChannels.length > 0) {
      const errors = validateAllChannelBindings(schema, hardwareChannels);
      setChannelErrors(errors);

      if (errors.length > 0) {
        console.warn(`⚠️ Found ${errors.length} channel binding errors:`, errors);
      } else {
        console.log('✅ All channel bindings are valid');
      }
    } else {
      setChannelErrors([]);
    }
  }, [schema, hardwareChannels]);

  const updateSchema = (newSchema: UISchema) => {
    setSchema({
      ...newSchema,
      metadata: {
        ...newSchema.metadata,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  const loadSchema = (schemaData: unknown) => {
    const result = validateSchema(schemaData);
    if (result.success) {
      // Fix section IDs when loading a schema
      const fixedSchema = regenerateTabContent(result.data);
      setSchema(fixedSchema);
    } else {
      // Even if invalid, fix section IDs and store it so user can see/fix errors
      const fixedSchema = regenerateTabContent(schemaData as UISchema);
      setSchema(fixedSchema);
    }
  };

  const resetSchema = () => {
    // Fix section IDs when resetting
    const fixedSchema = regenerateTabContent(defaultSchema);
    setSchema(fixedSchema);
  };

  /**
   * Load and parse hardware config to extract available channels
   */
  const loadHardwareConfig = (hardwareConfigData: unknown) => {
    try {
      // Basic validation
      if (
        !hardwareConfigData ||
        typeof hardwareConfigData !== 'object' ||
        !('outputs' in hardwareConfigData)
      ) {
        console.error('Invalid hardware config format');
        return;
      }

      const config = hardwareConfigData as {
        systemType?: string;
        outputs: Array<{
          id: string;
          label: string;
          control: string;
          icon?: string;
          source: string;
          channel: number;
          signals?: {
            toggle: number | null;
            momentary: number | null;
            dimmer: number | null;
          };
        }>;
      };

      // Extract channels from hardware config
      const channels: HardwareChannel[] = config.outputs.map((output) => ({
        id: output.id,
        label: output.label,
        control: output.control, // Keep as string
        icon: output.icon,
        source: output.source as 'core' | 'genesis' | 'lite',
        channel: output.channel,
        signals: output.signals,
      }));

      setHardwareChannels(channels);

      console.log(`✅ Loaded ${channels.length} hardware channels from config`);
    } catch (error) {
      console.error('Failed to parse hardware config:', error);
    }
  };

  return (
    <SchemaContext.Provider
      value={{
        schema,
        validationResult,
        hardwareChannels,
        channelErrors,
        updateSchema,
        loadSchema,
        resetSchema,
        loadHardwareConfig,
      }}
    >
      {children}
    </SchemaContext.Provider>
  );
}

export function useSchema() {
  const context = useContext(SchemaContext);
  if (!context) {
    throw new Error('useSchema must be used within a SchemaProvider');
  }
  return context;
}
