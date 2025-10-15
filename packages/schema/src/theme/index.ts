/**
 * Theme configuration schema
 */

import { z } from 'zod';

export const ThemeConfigSchema = z
  .object({
    preset: z.enum(['blue', 'purple', 'green', 'orange', 'red', 'dark', 'light']).default('blue'),
    // Optional: Allow custom overrides
    customColors: z
      .object({
        primary: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        secondary: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        accent: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        background: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        text: z
          .string()
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
      })
      .optional(),
  })
  .default({ preset: 'blue' });

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
