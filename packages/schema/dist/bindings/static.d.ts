/**
 * Static binding schema (for testing/mocking)
 */
import { z } from 'zod';
export declare const StaticBindingSchema: z.ZodObject<{
    type: z.ZodLiteral<"static">;
    value: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    type: "static";
    value?: unknown;
}, {
    type: "static";
    value?: unknown;
}>;
export type StaticBinding = z.infer<typeof StaticBindingSchema>;
//# sourceMappingURL=static.d.ts.map