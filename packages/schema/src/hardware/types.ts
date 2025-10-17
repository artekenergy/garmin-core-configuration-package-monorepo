/**
 * Hardware system types and control types
 */

import { z } from 'zod';

// Hardware system types
export const HardwareSystemTypeSchema = z.enum(['core', 'core-lite']);

// Output control types
export const OutputControlTypeSchema = z.enum([
  'not-used',
  'push-button',
  'toggle-button',
  'slider',
  'half-bridge',
  'dimmer',
  'special-function',
  'signal-value', // Read-only sensor values
]);

// Hardware sources (expanded to include all device types)
export const HardwareSourceSchema = z.enum([
  'core',
  'core-lite',
  'genesis',
  'bms', // Battery Management System
  'sensors', // Temperature, voltage sensors
  'solar', // Solar panels/controllers
  'power', // Power systems (MultiPlus, AC, etc.)
  'hvac', // Heating, Ventilation, Air Conditioning
  'plumbing', // Tanks, pumps
  'accessories', // Awnings, slides, etc.
  'alternator', // Alternator charging
  'orion', // Orion DC-DC converter
]);

export type HardwareSystemType = z.infer<typeof HardwareSystemTypeSchema>;
export type OutputControlType = z.infer<typeof OutputControlTypeSchema>;
export type HardwareSource = z.infer<typeof HardwareSourceSchema>;
