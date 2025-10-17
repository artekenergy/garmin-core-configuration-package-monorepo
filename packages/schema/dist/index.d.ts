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
import { ValidationResult } from './types';
export declare const SCHEMA_VERSION = "0.1.0";
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
export declare function validateSchema(data: unknown): ValidationResult;
export * from './bindings';
export * from './components';
export * from './structure';
export * from './hardware';
export * from './subsystems';
export * from './theme';
export * from './tabs';
export * from './metadata';
export * from './root';
export * from './types';
export * from './validators';
export * from './defaults';
//# sourceMappingURL=index.d.ts.map