/**
 * Power subsystem configuration schema
 */
import { z } from 'zod';
export declare const PowerConfigSchema: z.ZodObject<{
    dcCharging: z.ZodDefault<z.ZodObject<{
        secondAlternator: z.ZodDefault<z.ZodBoolean>;
        orionXs: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        secondAlternator: boolean;
        orionXs: boolean;
    }, {
        secondAlternator?: boolean | undefined;
        orionXs?: boolean | undefined;
    }>>;
    solar: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        primaryArray: z.ZodDefault<z.ZodBoolean>;
        auxiliaryArray: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        primaryArray: boolean;
        auxiliaryArray: boolean;
    }, {
        enabled?: boolean | undefined;
        primaryArray?: boolean | undefined;
        auxiliaryArray?: boolean | undefined;
    }>>;
    batteryManagement: z.ZodDefault<z.ZodEnum<["victron", "expion", "battleborn", "discover"]>>;
    acLegs: z.ZodDefault<z.ZodNumber>;
    multiplus: z.ZodDefault<z.ZodObject<{
        l1: z.ZodDefault<z.ZodBoolean>;
        l2: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        l1: boolean;
        l2: boolean;
    }, {
        l1?: boolean | undefined;
        l2?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    dcCharging: {
        secondAlternator: boolean;
        orionXs: boolean;
    };
    solar: {
        enabled: boolean;
        primaryArray: boolean;
        auxiliaryArray: boolean;
    };
    batteryManagement: "victron" | "expion" | "battleborn" | "discover";
    acLegs: number;
    multiplus: {
        l1: boolean;
        l2: boolean;
    };
}, {
    dcCharging?: {
        secondAlternator?: boolean | undefined;
        orionXs?: boolean | undefined;
    } | undefined;
    solar?: {
        enabled?: boolean | undefined;
        primaryArray?: boolean | undefined;
        auxiliaryArray?: boolean | undefined;
    } | undefined;
    batteryManagement?: "victron" | "expion" | "battleborn" | "discover" | undefined;
    acLegs?: number | undefined;
    multiplus?: {
        l1?: boolean | undefined;
        l2?: boolean | undefined;
    } | undefined;
}>;
export type PowerConfig = z.infer<typeof PowerConfigSchema>;
//# sourceMappingURL=power.d.ts.map