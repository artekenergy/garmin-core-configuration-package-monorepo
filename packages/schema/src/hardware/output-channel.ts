/**
 * Output channel configuration schema
 */

import { z } from 'zod';
import { HardwareSourceSchema, OutputControlTypeSchema } from './types';

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

export type OutputChannel = z.infer<typeof OutputChannelSchema>;
