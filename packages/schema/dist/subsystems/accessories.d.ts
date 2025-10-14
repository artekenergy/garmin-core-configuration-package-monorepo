/**
 * Accessories subsystem configuration schema
 */
import { z } from 'zod';
export declare const AccessoriesConfigSchema: z.ZodObject<{
    keypad: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        count: z.ZodDefault<z.ZodNumber>;
        buttonsPerKeypad: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        count: number;
        buttonsPerKeypad: number;
    }, {
        enabled?: boolean | undefined;
        count?: number | undefined;
        buttonsPerKeypad?: number | undefined;
    }>>;
    awning: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        light: z.ZodDefault<z.ZodBoolean>;
        controlType: z.ZodDefault<z.ZodEnum<["rvc", "analog"]>>;
    }, "strip", z.ZodTypeAny, {
        light: boolean;
        enabled: boolean;
        controlType: "rvc" | "analog";
    }, {
        light?: boolean | undefined;
        enabled?: boolean | undefined;
        controlType?: "rvc" | "analog" | undefined;
    }>>;
    slides: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        controlType: z.ZodDefault<z.ZodEnum<["rvc", "analog"]>>;
        keypadSecured: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        controlType: "rvc" | "analog";
        keypadSecured: boolean;
    }, {
        enabled?: boolean | undefined;
        controlType?: "rvc" | "analog" | undefined;
        keypadSecured?: boolean | undefined;
    }>>;
    itcLighting: z.ZodDefault<z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    keypad: {
        enabled: boolean;
        count: number;
        buttonsPerKeypad: number;
    };
    awning: {
        light: boolean;
        enabled: boolean;
        controlType: "rvc" | "analog";
    };
    slides: {
        enabled: boolean;
        controlType: "rvc" | "analog";
        keypadSecured: boolean;
    };
    itcLighting: {
        enabled: boolean;
        modules: number;
        zonesPerModule: 2 | 4;
    };
}, {
    keypad?: {
        enabled?: boolean | undefined;
        count?: number | undefined;
        buttonsPerKeypad?: number | undefined;
    } | undefined;
    awning?: {
        light?: boolean | undefined;
        enabled?: boolean | undefined;
        controlType?: "rvc" | "analog" | undefined;
    } | undefined;
    slides?: {
        enabled?: boolean | undefined;
        controlType?: "rvc" | "analog" | undefined;
        keypadSecured?: boolean | undefined;
    } | undefined;
    itcLighting?: {
        enabled?: boolean | undefined;
        modules?: number | undefined;
        zonesPerModule?: 2 | 4 | undefined;
    } | undefined;
}>;
export type AccessoriesConfig = z.infer<typeof AccessoriesConfigSchema>;
//# sourceMappingURL=accessories.d.ts.map