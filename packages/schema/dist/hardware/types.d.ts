/**
 * Hardware system types and control types
 */
import { z } from 'zod';
export declare const HardwareSystemTypeSchema: z.ZodEnum<["core", "core-lite"]>;
export declare const OutputControlTypeSchema: z.ZodEnum<["not-used", "push-button", "toggle-button", "slider", "half-bridge", "dimmer", "special-function"]>;
export declare const HardwareSourceSchema: z.ZodEnum<["core", "core-lite", "genesis"]>;
export type HardwareSystemType = z.infer<typeof HardwareSystemTypeSchema>;
export type OutputControlType = z.infer<typeof OutputControlTypeSchema>;
export type HardwareSource = z.infer<typeof HardwareSourceSchema>;
//# sourceMappingURL=types.d.ts.map