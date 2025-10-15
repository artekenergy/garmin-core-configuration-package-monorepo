/**
 * Plumbing tab configuration
 */
import { z } from 'zod';
export declare const PlumbingTabConfigSchema: z.ZodDefault<z.ZodObject<{
    switchingSection: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        title: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        title: string;
    }, {
        enabled?: boolean | undefined;
        title?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    switchingSection: {
        enabled: boolean;
        title: string;
    };
}, {
    switchingSection?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
    } | undefined;
}>>;
export type PlumbingTabConfig = z.infer<typeof PlumbingTabConfigSchema>;
//# sourceMappingURL=plumbing-tab.d.ts.map