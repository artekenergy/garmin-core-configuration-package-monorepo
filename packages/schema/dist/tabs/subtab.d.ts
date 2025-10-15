/**
 * Reusable subtab configuration schema
 */
import { z } from 'zod';
export declare const SubtabConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    title: z.ZodDefault<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    title: string;
    icon?: string | undefined;
}, {
    enabled?: boolean | undefined;
    title?: string | undefined;
    icon?: string | undefined;
}>;
export type SubtabConfig = z.infer<typeof SubtabConfigSchema>;
//# sourceMappingURL=subtab.d.ts.map