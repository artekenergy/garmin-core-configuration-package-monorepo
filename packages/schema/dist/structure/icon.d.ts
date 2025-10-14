/**
 * Icon schema - Embedded or referenced icon definition
 */
import { z } from 'zod';
export declare const IconSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["svg", "png", "jpg"]>;
    data: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "svg" | "png" | "jpg";
    id: string;
    data?: string | undefined;
    url?: string | undefined;
}, {
    type: "svg" | "png" | "jpg";
    id: string;
    data?: string | undefined;
    url?: string | undefined;
}>, {
    type: "svg" | "png" | "jpg";
    id: string;
    data?: string | undefined;
    url?: string | undefined;
}, {
    type: "svg" | "png" | "jpg";
    id: string;
    data?: string | undefined;
    url?: string | undefined;
}>;
export type Icon = z.infer<typeof IconSchema>;
//# sourceMappingURL=icon.d.ts.map