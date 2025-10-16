/**
 * TypeScript type definitions exported from Zod schemas
 *
 * These types are automatically inferred from the Zod schemas,
 * ensuring runtime validation and compile-time types stay in sync.
 *
 * Note: Most types are now exported directly from their respective schema modules.
 * This file only contains validation result types and helper types.
 */
import { z } from 'zod';
import { UISchemaSchema } from './root';
export type ComponentType = 'toggle' | 'button' | 'dimmer' | 'gauge' | 'indicator' | 'slider' | 'multiplus-control' | 'multiplus-test-controls';
export type BindingType = 'empirbus' | 'nmea2000' | 'static';
export interface ValidationSuccess {
    success: true;
    data: z.infer<typeof UISchemaSchema>;
}
export interface ValidationError {
    success: false;
    errors: Array<{
        path: string[];
        message: string;
        code: string;
    }>;
}
export type ValidationResult = ValidationSuccess | ValidationError;
//# sourceMappingURL=types.d.ts.map