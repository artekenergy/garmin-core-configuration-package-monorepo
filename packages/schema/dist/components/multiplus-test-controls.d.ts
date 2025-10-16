/**
 * Multiplus Test Controls Component Schema
 *
 * Simple test buttons for multiplus mode switching.
 * No bindings required - uses hardcoded signal channels.
 */
import { z } from 'zod';
/**
 * Schema for multiplus test controls component
 */
export declare const MultiplusTestControlsComponentSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"multiplus-test-controls">;
    leg: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "multiplus-test-controls";
    label: string;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    leg?: number | undefined;
}, {
    id: string;
    type: "multiplus-test-controls";
    label: string;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    leg?: number | undefined;
}>;
/**
 * TypeScript type inferred from schema
 */
export type MultiplusTestControlsComponent = z.infer<typeof MultiplusTestControlsComponentSchema>;
//# sourceMappingURL=multiplus-test-controls.d.ts.map