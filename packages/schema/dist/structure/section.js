/**
 * Section schema - Group of related components
 */
import { z } from 'zod';
import { ComponentSchema } from '../components';
export const SectionSchema = z.object({
    id: z
        .string()
        .regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, 'ID must start with letter and contain only alphanumeric, hyphens, underscores'),
    title: z.string().min(1).max(50),
    enabled: z.boolean().default(true), // Optional in input, required in output (defaults to true)
    type: z.enum(['switching', 'signal-values', 'image', 'mixed']).optional(), // For home tab sections
    icon: z.string().optional(),
    collapsible: z.boolean().optional(),
    collapsed: z.boolean().optional(),
    imageUrl: z.string().optional(), // For image type home sections
    components: z.array(ComponentSchema),
});
//# sourceMappingURL=section.js.map