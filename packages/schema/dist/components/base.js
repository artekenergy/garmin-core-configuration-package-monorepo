/**
 * Base component schema - common properties shared by all components
 */
import { z } from 'zod';
export const BaseComponentSchema = z.object({
    id: z
        .string()
        .regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, 'ID must start with letter and contain only alphanumeric, hyphens, underscores'),
    type: z.string(), // Will be refined in specific component schemas
    label: z.string().min(1).max(50),
    icon: z.string().optional(),
    tooltip: z.string().max(200).optional(),
    disabled: z.boolean().optional(),
    visible: z.boolean().optional(),
});
//# sourceMappingURL=base.js.map