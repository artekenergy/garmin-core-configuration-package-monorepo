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
]);
// Hardware sources
export const HardwareSourceSchema = z.enum(['core', 'core-lite', 'genesis']);
//# sourceMappingURL=types.js.map