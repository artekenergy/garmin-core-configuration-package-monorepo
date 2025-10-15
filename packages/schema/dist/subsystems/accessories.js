/**
 * Accessories subsystem configuration schema
 */
import { z } from 'zod';
export const AccessoriesConfigSchema = z.object({
    keypad: z
        .object({
        enabled: z.boolean().default(false),
        count: z.number().int().min(1).max(4).default(1),
        buttonsPerKeypad: z.number().int().min(5).max(16).default(8),
    })
        .default({ enabled: false, count: 1, buttonsPerKeypad: 8 }),
    awning: z
        .object({
        enabled: z.boolean().default(false),
        light: z.boolean().default(false),
        controlType: z.enum(['rvc', 'analog']).default('rvc'),
    })
        .default({ enabled: false, light: false, controlType: 'rvc' }),
    slides: z
        .object({
        enabled: z.boolean().default(false),
        controlType: z.enum(['rvc', 'analog']).default('rvc'),
        keypadSecured: z.boolean().default(false),
    })
        .default({ enabled: false, controlType: 'rvc', keypadSecured: false }),
    itcLighting: z
        .object({
        enabled: z.boolean().default(false),
        modules: z.number().int().min(0).max(4).default(0),
        zonesPerModule: z.union([z.literal(2), z.literal(4)]).default(2),
    })
        .default({ enabled: false, modules: 0, zonesPerModule: 2 }),
});
//# sourceMappingURL=accessories.js.map