/**
 * @gcg/schema - Schema validation library for Garmin Core Graphics Configurator
 *
 * This package provides:
 * - Zod schemas for runtime validation
 * - TypeScript types for compile-time safety
 * - Custom validation logic for semantic rules
 *
 * @version 0.1.0
 */
import { UISchemaSchema } from './root';
import { runCustomValidations } from './validators';
export const SCHEMA_VERSION = '0.1.0';
/**
 * Validate a UI schema
 *
 * Performs both structural validation (via Zod) and semantic validation
 * (via custom validators).
 *
 * @param data - The schema data to validate
 * @returns ValidationResult with success status and data or errors
 *
 * @example
 * ```typescript
 * const result = validateSchema(schemaData);
 * if (result.success) {
 *   console.log("Valid schema:", result.data);
 * } else {
 *   console.error("Validation errors:", result.errors);
 * }
 * ```
 */
export function validateSchema(data) {
    // First, validate structure with Zod
    const zodResult = UISchemaSchema.safeParse(data);
    if (!zodResult.success) {
        // Convert Zod errors to our error format
        const errors = zodResult.error.errors.map((err) => ({
            path: err.path.map(String),
            message: err.message,
            code: err.code,
        }));
        return {
            success: false,
            errors,
        };
    }
    // Then, run custom semantic validations
    const customErrors = runCustomValidations(zodResult.data);
    if (customErrors.length > 0) {
        return {
            success: false,
            errors: customErrors,
        };
    }
    // All validations passed
    return {
        success: true,
        data: zodResult.data,
    };
}
// Export all schemas from modular structure (for advanced usage)
export * from './bindings';
export * from './components';
export * from './structure';
export * from './hardware';
export * from './subsystems';
export * from './theme';
export * from './tabs';
export * from './metadata';
export * from './root';
// Export all types
export * from './types';
// Export validators (for custom validation)
export * from './validators';
export * from './defaults';
//# sourceMappingURL=index.js.map