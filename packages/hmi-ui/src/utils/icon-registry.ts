/**
 * Icon Registry
 *
 * Centralized icon storage and retrieval.
 * Loads icons from schema on app initialization.
 *
 * ES2017 compliant.
 */

import type { Icon } from '@gcg/schema';
import type { IconSpec } from '../types/icon';

const registry = new Map<string, IconSpec>();
const warned = new Set<string>();

/**
 * Register icons from schema
 */
export function registerIcons(icons: Icon[]): void {
  if (!icons || !Array.isArray(icons)) {
    return;
  }

  icons.forEach(function (icon) {
    if (!icon.id) {
      return;
    }

    const spec: IconSpec = { id: icon.id };

    // SVG inline mode
    if (icon.type === 'svg' && icon.data) {
      spec.svg = icon.data;
    }
    // URL mode (PNG/JPG or external SVG)
    else if (icon.url) {
      spec.url = icon.url;
    }
    // Base64 PNG/JPG
    else if (icon.data && (icon.type === 'png' || icon.type === 'jpg')) {
      spec.url = 'data:image/' + icon.type + ';base64,' + icon.data;
    }

    registry.set(icon.id, spec);
  });
}

/**
 * Get icon by ID
 * Warns once per missing icon
 */
export function getIcon(id?: string): IconSpec | undefined {
  if (!id) {
    return undefined;
  }

  const spec = registry.get(id);

  if (!spec && !warned.has(id)) {
    console.warn('[Icon] Missing icon with id "' + id + '"');
    warned.add(id);
  }

  return spec;
}

/**
 * Clear registry (for testing)
 */
export function clearRegistry(): void {
  registry.clear();
  warned.clear();
}

/**
 * Get all registered icon IDs
 */
export function getRegisteredIconIds(): string[] {
  return Array.from(registry.keys());
}
