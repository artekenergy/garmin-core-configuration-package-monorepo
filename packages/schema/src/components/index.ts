/**
 * Component schemas - UI component definitions
 *
 * Note: We use z.union instead of discriminatedUnion because some
 * schemas have .refine() applied, which is incompatible with discriminatedUnion.
 * The type field still acts as a discriminator at runtime.
 */

import { z } from 'zod';

export * from './base';
export * from './toggle';
export * from './button';
export * from './dimmer';
export * from './gauge';
export * from './indicator';
export * from './slider';

import { ToggleComponentSchema } from './toggle';
import { ButtonComponentSchema } from './button';
import { DimmerComponentBaseSchema } from './dimmer';
import { GaugeComponentBaseSchema } from './gauge';
import { IndicatorComponentSchema } from './indicator';
import { SliderComponentBaseSchema } from './slider';

/**
 * Union of all component types
 */
export const ComponentSchema = z.union([
  ToggleComponentSchema,
  ButtonComponentSchema,
  DimmerComponentBaseSchema, // Use base schema for union
  GaugeComponentBaseSchema, // Use base schema for union
  IndicatorComponentSchema,
  SliderComponentBaseSchema, // Use base schema for union
]);

export type Component = z.infer<typeof ComponentSchema>;
