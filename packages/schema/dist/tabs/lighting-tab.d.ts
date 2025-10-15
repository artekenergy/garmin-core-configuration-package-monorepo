/**
 * Lighting tab configuration with subtab support
 */
import { z } from 'zod';
export declare const LightingTabConfigSchema: z.ZodDefault<z.ZodObject<{
    interior: z.ZodDefault<z.ZodObject<{
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
    }>>;
    exterior: z.ZodDefault<z.ZodObject<{
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
    }>>;
    rgb: z.ZodDefault<z.ZodObject<{
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
    }>>;
}, "strip", z.ZodTypeAny, {
    interior: {
        enabled: boolean;
        title: string;
        icon?: string | undefined;
    };
    exterior: {
        enabled: boolean;
        title: string;
        icon?: string | undefined;
    };
    rgb: {
        enabled: boolean;
        title: string;
        icon?: string | undefined;
    };
}, {
    interior?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
        icon?: string | undefined;
    } | undefined;
    exterior?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
        icon?: string | undefined;
    } | undefined;
    rgb?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
        icon?: string | undefined;
    } | undefined;
}>>;
export type LightingTabConfig = z.infer<typeof LightingTabConfigSchema>;
//# sourceMappingURL=lighting-tab.d.ts.map