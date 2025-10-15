/**
 * Half-bridge pair configuration schema
 */

import { z } from 'zod';
import { HardwareSourceSchema } from './types';

export const HalfBridgePairSchema = z.object({
  source: HardwareSourceSchema,
  channelA: z.number().int().positive(),
  channelB: z.number().int().positive(),
  enabled: z.boolean().default(false),
});

export type HalfBridgePair = z.infer<typeof HalfBridgePairSchema>;
