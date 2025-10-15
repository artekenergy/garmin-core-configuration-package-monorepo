/**
 * Icon schema - Embedded or referenced icon definition
 */

import { z } from 'zod';

export const IconSchema = z
  .object({
    id: z
      .string()
      .regex(
        /^[a-zA-Z][a-zA-Z0-9-_]*$/,
        'ID must start with letter and contain only alphanumeric, hyphens, underscores'
      ),
    type: z.enum(['svg', 'png', 'jpg']),
    data: z.string().optional(), // base64 or SVG markup
    url: z.string().optional(), // Relative path or absolute URL
  })
  .refine(
    (data) => data.data !== undefined || data.url !== undefined,
    'Icon must have either data or url'
  );

export type Icon = z.infer<typeof IconSchema>;
