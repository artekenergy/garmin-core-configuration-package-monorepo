/**
 * Static binding schema (for testing/mocking)
 */

import { z } from 'zod';

export const StaticBindingSchema = z.object({
  type: z.literal('static'),
  value: z.unknown(),
});

export type StaticBinding = z.infer<typeof StaticBindingSchema>;
