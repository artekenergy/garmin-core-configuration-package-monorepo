/**
 * Custom validation logic for UI schemas
 *
 * Zod handles structure validation, but these validators check
 * semantic rules that require looking at the entire schema.
 */
import { z } from 'zod';
import { UISchemaSchema } from './root';
import { ValidationError } from './types';
type UISchema = z.infer<typeof UISchemaSchema>;
/**
 * Check that all component IDs are unique across the entire schema
 */
export declare function validateUniqueComponentIds(schema: UISchema): ValidationError['errors'];
/**
 * Check that all icon references point to defined icons
 * Note: Direct paths (/, http://, https://) and emoji don't need to be in schema.icons
 */
export declare function validateIconReferences(schema: UISchema): ValidationError['errors'];
/**
 * Check that all icon IDs are unique
 */
export declare function validateUniqueIconIds(schema: UISchema): ValidationError['errors'];
/**
 * Check that all tab IDs are unique
 */
export declare function validateUniqueTabIds(schema: UISchema): ValidationError['errors'];
/**
 * Check that all section IDs are unique within their tab
 */
export declare function validateUniqueSectionIds(schema: UISchema): ValidationError['errors'];
/**
 * Run all custom validations on a schema
 */
export declare function runCustomValidations(schema: UISchema): ValidationError['errors'];
export {};
//# sourceMappingURL=validators.d.ts.map