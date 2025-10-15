/**
 * Switching tab configuration with subtab support
 */
import { z } from 'zod';
export declare const SwitchingTabConfigSchema: z.ZodDefault<z.ZodObject<{
    switches: z.ZodDefault<z.ZodObject<{
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
    accessories: z.ZodDefault<z.ZodObject<{
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
    customSection: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        title: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        title: string;
    }, {
        enabled?: boolean | undefined;
        title?: string | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    switches: {
        enabled: boolean;
        title: string;
        icon?: string | undefined;
    };
    accessories: {
        enabled: boolean;
        title: string;
        icon?: string | undefined;
    };
    customSection?: {
        enabled: boolean;
        title: string;
    } | undefined;
}, {
    switches?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
        icon?: string | undefined;
    } | undefined;
    accessories?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
        icon?: string | undefined;
    } | undefined;
    customSection?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
    } | undefined;
}>>;
export type SwitchingTabConfig = z.infer<typeof SwitchingTabConfigSchema>;
//# sourceMappingURL=switching-tab.d.ts.map