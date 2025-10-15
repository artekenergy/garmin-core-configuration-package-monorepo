/**
 * Signal ID mapping schemas
 */
import { z } from 'zod';
export declare const SignalMapEntrySchema: z.ZodUnion<[z.ZodNumber, z.ZodObject<{
    'push-button': z.ZodOptional<z.ZodNumber>;
    'toggle-button': z.ZodOptional<z.ZodNumber>;
    slider: z.ZodOptional<z.ZodNumber>;
    default: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    'push-button'?: number | undefined;
    'toggle-button'?: number | undefined;
    slider?: number | undefined;
    default?: number | undefined;
}, {
    'push-button'?: number | undefined;
    'toggle-button'?: number | undefined;
    slider?: number | undefined;
    default?: number | undefined;
}>]>;
export type SignalMapEntry = z.infer<typeof SignalMapEntrySchema>;
//# sourceMappingURL=signal-map.d.ts.map