/**
 * Plumbing subsystem configuration schema
 */
import { z } from 'zod';
export const PlumbingTankSchema = z.object({
    type: z.enum(['fresh', 'waste', 'black']),
    name: z.string().max(50).default(''),
});
export const PlumbingConfigSchema = z.object({
    enabled: z.boolean().default(true),
    monitoringSource: z.enum(['cerbo-gx', 'seelevel']).default('cerbo-gx'),
    count: z.number().int().min(1).max(4).default(3),
    tanks: z
        .array(PlumbingTankSchema)
        .min(1)
        .max(4)
        .default([
        { type: 'fresh', name: '' },
        { type: 'waste', name: '' },
        { type: 'black', name: '' },
    ]),
});
//# sourceMappingURL=plumbing.js.map