/**
 * HVAC subsystem configuration schema
 */
import { z } from 'zod';
export declare const HVACConfigSchema: z.ZodObject<{
    heating: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        sources: z.ZodDefault<z.ZodObject<{
            diesel: z.ZodDefault<z.ZodBoolean>;
            electric: z.ZodDefault<z.ZodBoolean>;
            engine: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            diesel: boolean;
            electric: boolean;
            engine: boolean;
        }, {
            diesel?: boolean | undefined;
            electric?: boolean | undefined;
            engine?: boolean | undefined;
        }>>;
        distribution: z.ZodDefault<z.ZodObject<{
            floor: z.ZodDefault<z.ZodBoolean>;
            fans: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            floor: boolean;
            fans: boolean;
        }, {
            floor?: boolean | undefined;
            fans?: boolean | undefined;
        }>>;
        hotWater: z.ZodDefault<z.ZodBoolean>;
        auxZone: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        sources: {
            diesel: boolean;
            electric: boolean;
            engine: boolean;
        };
        distribution: {
            floor: boolean;
            fans: boolean;
        };
        hotWater: boolean;
        auxZone: boolean;
    }, {
        enabled?: boolean | undefined;
        sources?: {
            diesel?: boolean | undefined;
            electric?: boolean | undefined;
            engine?: boolean | undefined;
        } | undefined;
        distribution?: {
            floor?: boolean | undefined;
            fans?: boolean | undefined;
        } | undefined;
        hotWater?: boolean | undefined;
        auxZone?: boolean | undefined;
    }>>;
    cooling: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        brand: z.ZodDefault<z.ZodEnum<["", "recpro", "truma", "cruisencomfort"]>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        brand: "" | "recpro" | "truma" | "cruisencomfort";
    }, {
        enabled?: boolean | undefined;
        brand?: "" | "recpro" | "truma" | "cruisencomfort" | undefined;
    }>>;
    ventilation: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        fans: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        fans: number;
    }, {
        enabled?: boolean | undefined;
        fans?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    heating: {
        enabled: boolean;
        sources: {
            diesel: boolean;
            electric: boolean;
            engine: boolean;
        };
        distribution: {
            floor: boolean;
            fans: boolean;
        };
        hotWater: boolean;
        auxZone: boolean;
    };
    cooling: {
        enabled: boolean;
        brand: "" | "recpro" | "truma" | "cruisencomfort";
    };
    ventilation: {
        enabled: boolean;
        fans: number;
    };
}, {
    heating?: {
        enabled?: boolean | undefined;
        sources?: {
            diesel?: boolean | undefined;
            electric?: boolean | undefined;
            engine?: boolean | undefined;
        } | undefined;
        distribution?: {
            floor?: boolean | undefined;
            fans?: boolean | undefined;
        } | undefined;
        hotWater?: boolean | undefined;
        auxZone?: boolean | undefined;
    } | undefined;
    cooling?: {
        enabled?: boolean | undefined;
        brand?: "" | "recpro" | "truma" | "cruisencomfort" | undefined;
    } | undefined;
    ventilation?: {
        enabled?: boolean | undefined;
        fans?: number | undefined;
    } | undefined;
}>;
export type HVACConfig = z.infer<typeof HVACConfigSchema>;
//# sourceMappingURL=hvac.d.ts.map