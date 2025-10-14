/**
 * Toggle Component - Binary on/off switch
 */

import { z } from 'zod';
import { BaseComponentSchema } from './base';
import { BindingSchema } from '../bindings';

export const ToggleComponentSchema = BaseComponentSchema.extend({
  type: z.literal('toggle'),
  variant: z.enum(['default', 'switch', 'checkbox', 'round']).optional(),
  bindings: z.object({
    state: BindingSchema,
  }),
});

export type ToggleComponent = z.infer<typeof ToggleComponentSchema>;
