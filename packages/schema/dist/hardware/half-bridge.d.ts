/**
 * Half-bridge pair configuration schema
 */
import { z } from 'zod';
export declare const HalfBridgePairSchema: z.ZodObject<{
    source: z.ZodEnum<["core", "core-lite", "genesis", "bms", "sensors", "solar", "power", "hvac", "plumbing", "accessories", "alternator", "orion"]>;
    channelA: z.ZodNumber;
    channelB: z.ZodNumber;
    enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    source: "core" | "core-lite" | "genesis" | "bms" | "sensors" | "solar" | "power" | "hvac" | "plumbing" | "accessories" | "alternator" | "orion";
    channelA: number;
    channelB: number;
    enabled: boolean;
}, {
    source: "core" | "core-lite" | "genesis" | "bms" | "sensors" | "solar" | "power" | "hvac" | "plumbing" | "accessories" | "alternator" | "orion";
    channelA: number;
    channelB: number;
    enabled?: boolean | undefined;
}>;
export type HalfBridgePair = z.infer<typeof HalfBridgePairSchema>;
//# sourceMappingURL=half-bridge.d.ts.map