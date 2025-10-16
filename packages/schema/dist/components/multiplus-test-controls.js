/**
 * Multiplus Test Controls Component Schema
 *
 * Simple test buttons for multiplus mode switching.
 * No bindings required - uses hardcoded signal channels.
 */
import { z } from 'zod';
import { BaseComponentSchema } from './base';
/**
 * Schema for multiplus test controls component
 */
export const MultiplusTestControlsComponentSchema = BaseComponentSchema.extend({
    type: z.literal('multiplus-test-controls'),
    leg: z.number().min(1).max(2).optional(),
});
//# sourceMappingURL=multiplus-test-controls.js.map