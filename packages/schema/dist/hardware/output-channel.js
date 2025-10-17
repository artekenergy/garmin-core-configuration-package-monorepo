/**
 * Output channel configuration schema
 */
import { z } from 'zod';
import { HardwareSourceSchema, OutputControlTypeSchema } from './types';
export const OutputChannelSchema = z.object({
    id: z.string(), // e.g., "core-01", "core-lite-02", "genesis-01", "battery-voltage"
    source: HardwareSourceSchema,
    channel: z.union([z.number().int().positive(), z.string()]), // Can be number or string (e.g., "battery-voltage")
    label: z.string().max(50).optional(),
    control: OutputControlTypeSchema.default('not-used'),
    icon: z.string().optional(),
    signalId: z.number().int().positive().optional(),
    signals: z
        .object({
        toggle: z.number().int().positive().nullable().optional(),
        momentary: z.number().int().positive().nullable().optional(),
        dimmer: z.number().int().positive().nullable().optional(),
        value: z.number().int().positive().nullable().optional(), // For signal-value control type
    })
        .optional(),
    range: z
        .object({
        min: z.number(),
        max: z.number(),
        step: z.number().positive(),
    })
        .optional(),
});
//# sourceMappingURL=output-channel.js.map