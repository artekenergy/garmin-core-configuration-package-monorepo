/**
 * HVAC tab configuration with subtab support
 */
import { z } from 'zod';
export declare const HVACTabConfigSchema: z.ZodDefault<z.ZodObject<{
    heating: z.ZodDefault<z.ZodObject<{
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
    cooling: z.ZodDefault<z.ZodObject<{
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
    ventilation: z.ZodDefault<z.ZodObject<{
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
    heating: {
        enabled: boolean;
        title: string;
        icon?: string | undefined;
    };
    cooling: {
        enabled: boolean;
        title: string;
        icon?: string | undefined;
    };
    ventilation: {
        enabled: boolean;
        title: string;
        icon?: string | undefined;
    };
}, {
    heating?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
        icon?: string | undefined;
    } | undefined;
    cooling?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
        icon?: string | undefined;
    } | undefined;
    ventilation?: {
        enabled?: boolean | undefined;
        title?: string | undefined;
        icon?: string | undefined;
    } | undefined;
}>>;
export type HVACTabConfig = z.infer<typeof HVACTabConfigSchema>;
//# sourceMappingURL=hvac-tab.d.ts.map