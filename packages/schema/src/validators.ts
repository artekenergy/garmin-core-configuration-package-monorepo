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
 * Validation error builder
 */
function createError(path: string[], message: string, code: string): ValidationError['errors'][0] {
  return { path, message, code };
}

/**
 * Check that all component IDs are unique across the entire schema
 */
export function validateUniqueComponentIds(schema: UISchema): ValidationError['errors'] {
  const errors: ValidationError['errors'] = [];
  const seenIds = new Set<string>();

  schema.tabs.forEach((tab, tabIndex) => {
    tab.sections.forEach((section, sectionIndex) => {
      section.components.forEach((component, componentIndex) => {
        if (seenIds.has(component.id)) {
          errors.push(
            createError(
              [
                'tabs',
                String(tabIndex),
                'sections',
                String(sectionIndex),
                'components',
                String(componentIndex),
                'id',
              ],
              `Duplicate component ID: "${component.id}". All component IDs must be unique across the entire schema.`,
              'duplicate_component_id'
            )
          );
        }
        seenIds.add(component.id);
      });
    });
  });

  return errors;
}

/**
 * Check if an icon string is a direct reference (path, URL, or emoji)
 * rather than an ID that needs to be looked up in schema.icons
 */
function isDirectIconReference(icon: string): boolean {
  // Direct file paths
  if (icon.startsWith('/')) return true;

  // URLs
  if (icon.startsWith('http://') || icon.startsWith('https://')) return true;

  // Emoji or other Unicode characters (single character or short strings)
  // This is a simple heuristic - if it's 1-3 characters, likely emoji/text
  if (icon.length <= 3) return true;

  return false;
}

/**
 * Check that all icon references point to defined icons
 * Note: Direct paths (/, http://, https://) and emoji don't need to be in schema.icons
 */
export function validateIconReferences(schema: UISchema): ValidationError['errors'] {
  const errors: ValidationError['errors'] = [];
  const definedIcons = new Set(schema.icons?.map((icon) => icon.id) || []);

  // Check tab icons
  schema.tabs.forEach((tab, tabIndex) => {
    if (tab.icon && !isDirectIconReference(tab.icon) && !definedIcons.has(tab.icon)) {
      errors.push(
        createError(
          ['tabs', String(tabIndex), 'icon'],
          `Icon reference "${tab.icon}" not found in schema.icons`,
          'invalid_icon_reference'
        )
      );
    }

    // Check section icons
    tab.sections.forEach((section, sectionIndex) => {
      if (section.icon && !isDirectIconReference(section.icon) && !definedIcons.has(section.icon)) {
        errors.push(
          createError(
            ['tabs', String(tabIndex), 'sections', String(sectionIndex), 'icon'],
            `Icon reference "${section.icon}" not found in schema.icons`,
            'invalid_icon_reference'
          )
        );
      }

      // Check component icons
      section.components.forEach((component, componentIndex) => {
        if (
          component.icon &&
          !isDirectIconReference(component.icon) &&
          !definedIcons.has(component.icon)
        ) {
          errors.push(
            createError(
              [
                'tabs',
                String(tabIndex),
                'sections',
                String(sectionIndex),
                'components',
                String(componentIndex),
                'icon',
              ],
              `Icon reference "${component.icon}" not found in schema.icons`,
              'invalid_icon_reference'
            )
          );
        }
      });
    });
  });

  return errors;
}

/**
 * Check that all icon IDs are unique
 */
export function validateUniqueIconIds(schema: UISchema): ValidationError['errors'] {
  const errors: ValidationError['errors'] = [];
  const seenIds = new Set<string>();

  schema.icons?.forEach((icon, index) => {
    if (seenIds.has(icon.id)) {
      errors.push(
        createError(
          ['icons', String(index), 'id'],
          `Duplicate icon ID: "${icon.id}". All icon IDs must be unique.`,
          'duplicate_icon_id'
        )
      );
    }
    seenIds.add(icon.id);
  });

  return errors;
}

/**
 * Check that all tab IDs are unique
 */
export function validateUniqueTabIds(schema: UISchema): ValidationError['errors'] {
  const errors: ValidationError['errors'] = [];
  const seenIds = new Set<string>();

  schema.tabs.forEach((tab, index) => {
    if (seenIds.has(tab.id)) {
      errors.push(
        createError(
          ['tabs', String(index), 'id'],
          `Duplicate tab ID: "${tab.id}". All tab IDs must be unique.`,
          'duplicate_tab_id'
        )
      );
    }
    seenIds.add(tab.id);
  });

  return errors;
}

/**
 * Check that all section IDs are unique within their tab
 */
export function validateUniqueSectionIds(schema: UISchema): ValidationError['errors'] {
  const errors: ValidationError['errors'] = [];

  schema.tabs.forEach((tab, tabIndex) => {
    const seenIds = new Set<string>();

    tab.sections.forEach((section, sectionIndex) => {
      if (seenIds.has(section.id)) {
        errors.push(
          createError(
            ['tabs', String(tabIndex), 'sections', String(sectionIndex), 'id'],
            `Duplicate section ID: "${section.id}" in tab "${tab.id}". Section IDs must be unique within their tab.`,
            'duplicate_section_id'
          )
        );
      }
      seenIds.add(section.id);
    });
  });

  return errors;
}

/**
 * Run all custom validations on a schema
 */
export function runCustomValidations(schema: UISchema): ValidationError['errors'] {
  const errors: ValidationError['errors'] = [];

  errors.push(...validateUniqueComponentIds(schema));
  errors.push(...validateIconReferences(schema));
  errors.push(...validateUniqueIconIds(schema));
  errors.push(...validateUniqueTabIds(schema));
  errors.push(...validateUniqueSectionIds(schema));

  return errors;
}
