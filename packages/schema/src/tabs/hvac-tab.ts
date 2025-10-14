/**
 * HVAC tab configuration with subtab support
 */

import { z } from 'zod';
import { SubtabConfigSchema } from './subtab';

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

export type HVACTabConfig = z.infer<typeof HVACTabConfigSchema>;
