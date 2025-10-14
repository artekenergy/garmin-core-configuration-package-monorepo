/**
 * EmpirBus channel binding schema
 */

import { z } from 'zod';

export const EmpirBusBindingSchema = z.object({
  type: z.literal('empirbus'),
  channel: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, 'Channel must be lowercase alphanumeric with hyphens'),
  property: z.enum(['state', 'intensity', 'value']).optional(),
});

export type EmpirBusBinding = z.infer<typeof EmpirBusBindingSchema>;
