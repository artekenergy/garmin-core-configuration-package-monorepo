/**
 * Metadata schema - Information about the schema
 */
import { z } from 'zod';
export const MetadataSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic version (x.y.z)'),
    author: z.string().max(100).optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
//# sourceMappingURL=index.js.map