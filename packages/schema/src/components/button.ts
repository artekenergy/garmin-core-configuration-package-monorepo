/**
 * Button Component - Momentary or toggle action
 */

import { z } from 'zod';
import { BaseComponentSchema } from './base';
import { BindingSchema } from '../bindings';

const ButtonBindingsSchema = z
  .object({
    state: BindingSchema.optional(),
    action: BindingSchema.optional(),
  })
  .refine(
    (data) => data.state !== undefined || data.action !== undefined,
    'Button must have at least one binding (state or action)'
  );

export const ButtonComponentSchema = BaseComponentSchema.extend({
  type: z.literal('button'),
  action: z.enum(['momentary', 'toggle']),
  variant: z.enum(['primary', 'secondary', 'danger', 'round']).optional(),
  bindings: ButtonBindingsSchema,
});

export type ButtonComponent = z.infer<typeof ButtonComponentSchema>;
