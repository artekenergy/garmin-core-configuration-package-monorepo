/**
 * EmpirBus channel binding schema
 */
import { z } from 'zod';
export declare const EmpirBusBindingSchema: z.ZodObject<{
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
}>;
export type EmpirBusBinding = z.infer<typeof EmpirBusBindingSchema>;
//# sourceMappingURL=empirbus.d.ts.map