/**
 * Indicator Component - Status light
 */

import { z } from 'zod';
import { BaseComponentSchema } from './base';
import { BindingSchema } from '../bindings';

export const IndicatorComponentSchema = BaseComponentSchema.extend({
  type: z.literal('indicator'),
  variant: z.enum(['led', 'badge', 'icon']).optional(),
  color: z.enum(['green', 'yellow', 'red', 'blue', 'white']).optional(),
  bindings: z.object({
    state: BindingSchema,
  }),
});

export type IndicatorComponent = z.infer<typeof IndicatorComponentSchema>;
