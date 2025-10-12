import { validateSchema } from '@gcg/schema';
import type { UISchema } from '@gcg/schema';
import { schemaSignal, isLoadingSignal, errorSignal } from '../state/schema-signal';
import { setupAutoSubscription } from './schema-signals';
import { regenerateTabContent } from './tabGenerator';

/**
 * Schema loader configuration
 */
interface SchemaLoaderConfig {
  // Path to schema.json file (relative to public/)
  schemaPath?: string;
  // Optional: Provide schema directly (for testing)
  schema?: unknown;
  // Auto-subscribe to signals when schema loads
  autoSubscribe?: boolean;
}

/**
 * Load and validate schema from file or object
 *
 * @param config - Configuration options
 * @returns Promise that resolves when schema is loaded and validated
 */
export async function loadSchema(config: SchemaLoaderConfig = {}): Promise<void> {
  const { schemaPath = '/schema.json', schema: providedSchema, autoSubscribe = true } = config;

  // Set loading state
  isLoadingSignal.value = true;
  errorSignal.value = null;
  schemaSignal.value = null;

  try {
    let schemaData: unknown;

    if (providedSchema) {
      // Use provided schema (for testing)
      schemaData = providedSchema;
    } else {
      // Fetch schema from file
      const response = await fetch(schemaPath);

      if (!response.ok) {
        throw new Error('Failed to load schema: ' + response.statusText);
      }

      schemaData = await response.json();
    }

    // Validate schema
    const result = validateSchema(schemaData);

    if (!result.success) {
      // Validation failed
      const errorMessages = result.errors
        .map(function (err) {
          return err.path.join('.') + ': ' + err.message;
        })
        .join('; ');

      throw new Error('Schema validation failed: ' + errorMessages);
    }

    // Success! Store the validated schema with derived tab metadata
    const validatedSchema = result.data as UISchema;
    const derivedSchema = regenerateTabContent(validatedSchema);
    schemaSignal.value = derivedSchema;

    // Setup auto-subscription to signals
    if (autoSubscribe && derivedSchema.hardware) {
      setupAutoSubscription(derivedSchema);
    }
  } catch (err) {
    // Handle any errors
    const errorMessage = err instanceof Error ? err.message : 'Unknown error loading schema';
    errorSignal.value = errorMessage;
    console.error('Schema loading error:', err);
  } finally {
    // Always clear loading state
    isLoadingSignal.value = false;
  }
}

/**
 * Reset schema state (for testing or reload)
 */
export function resetSchema(): void {
  schemaSignal.value = null;
  isLoadingSignal.value = false;
  errorSignal.value = null;
}
