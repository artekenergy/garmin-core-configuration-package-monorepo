/**
 * Plumbing subsystem configuration schema
 */
import { z } from 'zod';
export declare const PlumbingTankSchema: z.ZodObject<{
    type: z.ZodEnum<["fresh", "waste", "black"]>;
    name: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "fresh" | "waste" | "black";
}, {
    type: "fresh" | "waste" | "black";
    name?: string | undefined;
}>;
export declare const PlumbingConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    monitoringSource: z.ZodDefault<z.ZodEnum<["cerbo-gx", "seelevel"]>>;
    count: z.ZodDefault<z.ZodNumber>;
    tanks: z.ZodDefault<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["fresh", "waste", "black"]>;
        name: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "fresh" | "waste" | "black";
    }, {
        type: "fresh" | "waste" | "black";
        name?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    monitoringSource: "cerbo-gx" | "seelevel";
    count: number;
    tanks: {
        name: string;
        type: "fresh" | "waste" | "black";
    }[];
}, {
    enabled?: boolean | undefined;
    monitoringSource?: "cerbo-gx" | "seelevel" | undefined;
    count?: number | undefined;
    tanks?: {
        type: "fresh" | "waste" | "black";
        name?: string | undefined;
    }[] | undefined;
}>;
export type PlumbingTank = z.infer<typeof PlumbingTankSchema>;
export type PlumbingConfig = z.infer<typeof PlumbingConfigSchema>;
//# sourceMappingURL=plumbing.d.ts.map