/**
 * Reusable subtab configuration schema
 */
import { z } from 'zod';
export const SubtabConfigSchema = z.object({
    enabled: z.boolean().default(true),
    title: z.string().min(1).max(30).default('Subtab'),
    icon: z.string().optional(),
});
//# sourceMappingURL=subtab.js.map