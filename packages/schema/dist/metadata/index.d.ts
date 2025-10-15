/**
 * Metadata schema - Information about the schema
 */
import { z } from 'zod';
export declare const MetadataSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    description?: string | undefined;
    author?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    name: string;
    version: string;
    description?: string | undefined;
    author?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}>;
export type Metadata = z.infer<typeof MetadataSchema>;
//# sourceMappingURL=index.d.ts.map