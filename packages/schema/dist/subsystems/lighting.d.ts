/**
 * Lighting subsystem configuration schema
 */
import { z } from 'zod';
export declare const LightingConfigSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    modules: z.ZodDefault<z.ZodNumber>;
    zonesPerModule: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<4>]>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    modules: number;
    zonesPerModule: 2 | 4;
}, {
    enabled?: boolean | undefined;
    modules?: number | undefined;
    zonesPerModule?: 2 | 4 | undefined;
}>>;
export type LightingConfig = z.infer<typeof LightingConfigSchema>;
//# sourceMappingURL=lighting.d.ts.map