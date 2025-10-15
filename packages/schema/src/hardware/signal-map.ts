/**
 * Signal ID mapping schemas
 */

import { z } from 'zod';

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

export type SignalMapEntry = z.infer<typeof SignalMapEntrySchema>;
