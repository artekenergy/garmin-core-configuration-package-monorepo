/**
 * Slider Component - Adjustable value input
 */

import { z } from 'zod';
import { BaseComponentSchema } from './base';
import { BindingSchema } from '../bindings';

export const SliderComponentBaseSchema = BaseComponentSchema.extend({
  type: z.literal('slider'),
  orientation: z.enum(['horizontal', 'vertical']).optional().default('horizontal'),
  min: z.number(),
  max: z.number(),
  step: z.number().positive().optional().default(1),
  unit: z.string().max(20).optional(),
  showValue: z.boolean().optional().default(true),
  bindings: z.object({
    value: BindingSchema,
  }),
});

export const SliderComponentSchema = SliderComponentBaseSchema.refine(
  (data) => data.min < data.max,
  'min must be less than max'
);

export type SliderComponent = z.infer<typeof SliderComponentSchema>;
