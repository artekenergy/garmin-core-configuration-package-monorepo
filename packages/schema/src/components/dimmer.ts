/**
 * Dimmer Component - Variable intensity control (0-100%)
 */

import { z } from 'zod';
import { BaseComponentSchema } from './base';
import { BindingSchema } from '../bindings';

export const DimmerComponentBaseSchema = BaseComponentSchema.extend({
  type: z.literal('dimmer'),
  min: z.number().min(0).max(100).optional().default(0),
  max: z.number().min(0).max(100).optional().default(100),
  step: z.number().min(1).max(100).optional().default(1),
  bindings: z.object({
    intensity: BindingSchema,
  }),
});

export const DimmerComponentSchema = DimmerComponentBaseSchema.refine(
  (data) => (data.min || 0) < (data.max || 100),
  'min must be less than max'
);

export type DimmerComponent = z.infer<typeof DimmerComponentSchema>;
