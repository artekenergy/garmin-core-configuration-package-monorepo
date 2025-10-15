/**
 * Icon Registry Builder
 *
 * Scans schema for icon references and builds the icons[] array
 * with proper icon definitions for deployment.
 */

import type { UISchema, Icon } from '@gcg/schema';

/**
 * Extract all unique icon references from schema
 */
function collectIconReferences(schema: UISchema): Set<string> {
  const refs = new Set<string>();

  // Collect from hardware outputs
  if (schema.hardware?.outputs) {
    schema.hardware.outputs.forEach((output) => {
      if (output.icon) {
        refs.add(output.icon);
      }
    });
  }

  // Collect from tabs
  schema.tabs.forEach((tab) => {
    if (tab.icon) {
      refs.add(tab.icon);
    }

    // Collect from sections
    tab.sections.forEach((section) => {
      if (section.icon) {
        refs.add(section.icon);
      }

      // Collect from components
      section.components.forEach((component) => {
        if (component.icon) {
          refs.add(component.icon);
        }
      });
    });
  });

  return refs;
}

/**
 * Convert icon reference to Icon definition
 */
function createIconDefinition(iconRef: string): Icon | null {
  // Skip emoji (already inline, no need for registry)
  if (iconRef.length <= 3) {
    return null;
  }

  // Library icon: /icons/Plumbing.svg
  if (iconRef.startsWith('/icons/')) {
    const filename = iconRef.replace('/icons/', '');
    const id = filename
      .replace(/\.(svg|png|jpg)$/i, '')
      .toLowerCase()
      .replace(/\s+/g, '-');

    // Determine type from extension
    const extMatch = filename.match(/\.(svg|png|jpg)$/i);
    if (!extMatch || !extMatch[1]) return null;

    const ext = extMatch[1].toLowerCase();
    const type = (ext === 'svg' ? 'svg' : ext === 'png' ? 'png' : 'jpg') as 'svg' | 'png' | 'jpg';

    // Use relative path as URL - will be resolved from deployment package root
    return {
      id,
      type,
      url: iconRef, // Keep as relative path like "/icons/Hot Air.svg"
    };
  }

  // Data URL (custom uploaded icon): data:image/svg+xml;base64,...
  if (iconRef.startsWith('data:image/')) {
    const match = iconRef.match(/^data:image\/(svg\+xml|png|jpeg|jpg);base64,(.+)$/);
    if (!match || !match[2]) return null;

    const mimeType = match[1];
    const base64Data = match[2];
    const type = mimeType === 'svg+xml' ? 'svg' : mimeType === 'png' ? 'png' : 'jpg';

    // Generate unique ID from hash of data
    const id = 'custom-' + base64Data.substring(0, 8);

    return {
      id,
      type,
      data: base64Data,
    };
  }

  return null;
}

/**
 * Build icons array from schema references
 *
 * This scans all icon references in the schema and creates
 * proper Icon definitions for the icons[] array.
 */
export function buildIconsArray(schema: UISchema): Icon[] {
  const iconRefs = collectIconReferences(schema);
  const icons: Icon[] = [];
  const seenIds = new Set<string>();

  iconRefs.forEach((ref) => {
    const icon = createIconDefinition(ref);
    if (icon && !seenIds.has(icon.id)) {
      icons.push(icon);
      seenIds.add(icon.id);
    }
  });

  return icons;
}

/**
 * Update schema with generated icons array and normalize component icon references
 */
export function updateSchemaIcons(schema: UISchema): UISchema {
  const icons = buildIconsArray(schema);

  // Normalize icon references in all components to use icon IDs
  const updatedTabs = schema.tabs.map((tab) => ({
    ...tab,
    sections: tab.sections.map((section) => ({
      ...section,
      components: section.components.map((component) => ({
        ...component,
        // Convert icon path (e.g., "/icons/Hot Air.svg") to icon ID (e.g., "hot-air")
        icon: component.icon ? iconRefToId(component.icon) : undefined,
      })),
    })),
  }));

  return {
    ...schema,
    tabs: updatedTabs,
    icons: icons.length > 0 ? icons : undefined,
  };
}

/**
 * Convert icon path/data URL to icon ID for component references
 */
export function iconRefToId(iconRef: string | undefined): string | undefined {
  if (!iconRef) return undefined;

  // Keep emoji as-is
  if (iconRef.length <= 3) return iconRef;

  const icon = createIconDefinition(iconRef);
  return icon?.id || iconRef;
}
