/**
 * Gauge Component - Read-only numeric display
 */
import { z } from 'zod';
import { BaseComponentSchema } from './base';
import { BindingSchema } from '../bindings';
export const GaugeComponentBaseSchema = BaseComponentSchema.extend({
    type: z.literal('gauge'),
    variant: z.enum(['circular', 'linear', 'numeric']).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().max(20).optional(),
    decimals: z.number().int().min(0).max(4).optional().default(0),
    bindings: z.object({
        value: BindingSchema,
    }),
});
export const GaugeComponentSchema = GaugeComponentBaseSchema.refine((data) => {
    if (data.min !== undefined && data.max !== undefined) {
        return data.min < data.max;
    }
    return true;
}, 'min must be less than max');
//# sourceMappingURL=gauge.js.map