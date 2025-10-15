/**
 * Base component schema - common properties shared by all components
 */
import { z } from 'zod';
export declare const BaseComponentSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    label: string;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
}, {
    type: string;
    id: string;
    label: string;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
}>;
export type BaseComponent = z.infer<typeof BaseComponentSchema>;
//# sourceMappingURL=base.d.ts.map