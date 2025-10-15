/**
 * NMEA2000 PGN binding schema
 */
import { z } from 'zod';
export declare const NMEA2000BindingSchema: z.ZodObject<{
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
}>;
export type NMEA2000Binding = z.infer<typeof NMEA2000BindingSchema>;
//# sourceMappingURL=nmea2000.d.ts.map