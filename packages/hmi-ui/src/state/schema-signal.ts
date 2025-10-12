import { signal } from '@preact/signals';
import type { UISchemaWithDerived } from '../utils/tabGenerator';

/**
 * Global schema state
 * Contains the loaded and validated schema, or null if not loaded
 */
export const schemaSignal = signal<UISchemaWithDerived | null>(null);

/**
 * Loading state
 */
export const isLoadingSignal = signal<boolean>(false);

/**
 * Error state
 */
export const errorSignal = signal<string | null>(null);
