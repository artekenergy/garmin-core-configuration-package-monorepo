/**
 * Power subsystem configuration schema
 */
import { z } from 'zod';
export const PowerConfigSchema = z.object({
    dcCharging: z
        .object({
        secondAlternator: z.boolean().default(false),
        orionXs: z.boolean().default(false),
    })
        .default({
        secondAlternator: false,
        orionXs: false,
    }),
    solar: z
        .object({
        enabled: z.boolean().default(false),
        primaryArray: z.boolean().default(true), // Always enabled when solar is enabled
        auxiliaryArray: z.boolean().default(false),
    })
        .default({
        enabled: false,
        primaryArray: true,
        auxiliaryArray: false,
    }),
    batteryManagement: z.enum(['victron', 'expion', 'battleborn', 'discover']).default('victron'),
    acLegs: z.number().int().min(1).max(2).default(2),
    multiplus: z
        .object({
        l1: z.boolean().default(false),
        l2: z.boolean().default(false),
    })
        .default({
        l1: false,
        l2: false,
    }),
});
//# sourceMappingURL=power.js.map