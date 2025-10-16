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
export * from './multiplus-control';
export * from './multiplus-test-controls';
import { ToggleComponentSchema } from './toggle';
import { ButtonComponentSchema } from './button';
import { DimmerComponentBaseSchema } from './dimmer';
import { GaugeComponentBaseSchema } from './gauge';
import { IndicatorComponentSchema } from './indicator';
import { SliderComponentBaseSchema } from './slider';
import { MultiplusControlComponentSchema } from './multiplus-control';
import { MultiplusTestControlsComponentSchema } from './multiplus-test-controls';
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
    MultiplusControlComponentSchema,
    MultiplusTestControlsComponentSchema,
]);
//# sourceMappingURL=index.js.map