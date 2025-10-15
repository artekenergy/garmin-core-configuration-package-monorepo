/**
 * Switching tab configuration with subtab support
 */

import { z } from 'zod';
import { SubtabConfigSchema } from './subtab';

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

export type SwitchingTabConfig = z.infer<typeof SwitchingTabConfigSchema>;
