/**
 * MultiplusControl Component - Composite control for Victron MultiPlus inverter/charger
 *
 * Displays AC voltage/current readings and mode control buttons.
 */

import { z } from 'zod';
import { BaseComponentSchema } from './base';
import { BindingSchema } from '../bindings';

const MultiplusBindingsSchema = z.object({
  acInVoltage: BindingSchema.optional(),
  acOutVoltage: BindingSchema.optional(),
  acOutCurrent: BindingSchema.optional(),
  modeOff: BindingSchema.optional(),
  modeOn: BindingSchema.optional(),
  modeChargerOnly: BindingSchema.optional(),
});

export const MultiplusControlComponentSchema = BaseComponentSchema.extend({
  type: z.literal('multiplus-control'),
  leg: z.number().min(1).max(2).optional(), // AC leg number (1 or 2)
  bindings: MultiplusBindingsSchema.optional(),
});

export type MultiplusControlComponent = z.infer<typeof MultiplusControlComponentSchema>;
