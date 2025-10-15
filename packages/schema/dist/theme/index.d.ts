/**
 * Theme configuration schema
 */
import { z } from 'zod';
export declare const ThemeConfigSchema: z.ZodDefault<z.ZodObject<{
    preset: z.ZodDefault<z.ZodEnum<["blue", "purple", "green", "orange", "red", "dark", "light"]>>;
    customColors: z.ZodOptional<z.ZodObject<{
        primary: z.ZodOptional<z.ZodString>;
        secondary: z.ZodOptional<z.ZodString>;
        accent: z.ZodOptional<z.ZodString>;
        background: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        primary?: string | undefined;
        secondary?: string | undefined;
        accent?: string | undefined;
        background?: string | undefined;
        text?: string | undefined;
    }, {
        primary?: string | undefined;
        secondary?: string | undefined;
        accent?: string | undefined;
        background?: string | undefined;
        text?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    preset: "blue" | "purple" | "green" | "orange" | "red" | "dark" | "light";
    customColors?: {
        primary?: string | undefined;
        secondary?: string | undefined;
        accent?: string | undefined;
        background?: string | undefined;
        text?: string | undefined;
    } | undefined;
}, {
    preset?: "blue" | "purple" | "green" | "orange" | "red" | "dark" | "light" | undefined;
    customColors?: {
        primary?: string | undefined;
        secondary?: string | undefined;
        accent?: string | undefined;
        background?: string | undefined;
        text?: string | undefined;
    } | undefined;
}>>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
//# sourceMappingURL=index.d.ts.map