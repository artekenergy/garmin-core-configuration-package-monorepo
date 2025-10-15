/**
 * Tab schema - Top-level navigation item containing sections
 * Supports both custom tabs and preset system tabs
 */
import { z } from 'zod';
import { SectionSchema } from './section';
export const PresetTabIdSchema = z.enum([
    'home',
    'lighting',
    'power',
    'hvac',
    'switching',
    'plumbing',
]);
export const TabSchema = z.object({
    id: z
        .string()
        .regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, 'ID must start with letter and contain only alphanumeric, hyphens, underscores'),
    title: z.string().min(1).max(30),
    icon: z.string().optional(),
    preset: PresetTabIdSchema.optional(), // If set, this is a preset tab
    enabled: z.boolean().optional().default(true), // Allow disabling preset tabs
    sections: z.array(SectionSchema).min(1),
});
//# sourceMappingURL=tab.js.map