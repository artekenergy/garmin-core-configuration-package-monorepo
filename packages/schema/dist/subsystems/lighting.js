/**
 * Lighting subsystem configuration schema
 */
import { z } from 'zod';
export const LightingConfigSchema = z
    .object({
    enabled: z.boolean().default(false),
    modules: z.number().int().min(0).max(4).default(0),
    zonesPerModule: z.union([z.literal(2), z.literal(4)]).default(2),
})
    .default({ enabled: false, modules: 0, zonesPerModule: 2 });
//# sourceMappingURL=lighting.js.map