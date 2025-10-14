/**
 * Binding schemas - define how components connect to data sources
 */
import { z } from 'zod';
export * from './empirbus';
export * from './nmea2000';
export * from './static';
export declare const BindingSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"empirbus">;
    channel: z.ZodString;
    property: z.ZodOptional<z.ZodEnum<["state", "intensity", "value"]>>;
}, "strip", z.ZodTypeAny, {
    type: "empirbus";
    channel: string;
    property?: "value" | "state" | "intensity" | undefined;
}, {
    type: "empirbus";
    channel: string;
    property?: "value" | "state" | "intensity" | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"nmea2000">;
    pgn: z.ZodNumber;
    field: z.ZodString;
    instance: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "nmea2000";
    pgn: number;
    field: string;
    instance?: number | undefined;
}, {
    type: "nmea2000";
    pgn: number;
    field: string;
    instance?: number | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"static">;
    value: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    type: "static";
    value?: unknown;
}, {
    type: "static";
    value?: unknown;
}>]>;
export type Binding = z.infer<typeof BindingSchema>;
//# sourceMappingURL=index.d.ts.map