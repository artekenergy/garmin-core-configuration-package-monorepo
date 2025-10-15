/**
 * Plumbing tab configuration
 */

import { z } from 'zod';

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

export type PlumbingTabConfig = z.infer<typeof PlumbingTabConfigSchema>;
