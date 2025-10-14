/**
 * NMEA2000 PGN binding schema
 */

import { z } from 'zod';

export const NMEA2000BindingSchema = z.object({
  type: z.literal('nmea2000'),
  pgn: z.number().int().positive(),
  field: z.string().min(1),
  instance: z.number().int().nonnegative().optional(),
});

export type NMEA2000Binding = z.infer<typeof NMEA2000BindingSchema>;
