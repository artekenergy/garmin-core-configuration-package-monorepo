/**
 * HVAC subsystem configuration schema
 */

import { z } from 'zod';

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

export type HVACConfig = z.infer<typeof HVACConfigSchema>;
