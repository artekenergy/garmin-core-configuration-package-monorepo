// @ts-nocheck
import {
  validateUniqueComponentIds,
  validateIconReferences,
  validateUniqueIconIds,
  validateUniqueTabIds,
  validateUniqueSectionIds,
  runCustomValidations,
} from '../src/validators';
import { z } from 'zod';
import { UISchemaSchema } from '../src/root';

type UISchema = z.infer<typeof UISchemaSchema>;

/**
 * NOTE: This test file is a work-in-progress.
 * The Zod schemas are very strict and require fully compliant fixtures.
 * Using `as any` temporarily to test validator logic.
 *
 * TODO: Create proper JSON fixtures that match the full UISchema type
 * or use a test schema factory to generate valid test data.
 */

describe('Custom Validators', () => {
  describe('validateUniqueComponentIds', () => {
    it('should pass when all component IDs are unique', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                components: [
                  { id: 'component-1', type: 'button', label: 'Button 1' },
                  { id: 'component-2', type: 'button', label: 'Button 2' },
                ],
              },
            ],
          },
        ],
        hardware: {
          outputs: [],
        },
        theme: {
          primaryColor: '#FF0000',
        },
        metadata: {
          name: 'Test',
          version: '1.0.0',
        },
      };

      const errors = validateUniqueComponentIds(schema);
      expect(errors).toHaveLength(0);
    });

    it('should fail when component IDs are duplicated across sections', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                components: [{ id: 'duplicate-id', type: 'button', label: 'Button 1' }],
              },
              {
                id: 'section-2',
                title: 'Section 2',
                enabled: true,
                components: [{ id: 'duplicate-id', type: 'button', label: 'Button 2' }],
              },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueComponentIds(schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]?.code).toBe('duplicate_component_id');
      expect(errors[0]?.message).toContain('duplicate-id');
    });

    it('should fail when component IDs are duplicated across tabs', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                components: [{ id: 'duplicate-id', type: 'button', label: 'Button 1' }],
              },
            ],
          },
          {
            id: 'tab-2',
            title: 'Tab 2',
            sections: [
              {
                id: 'section-2',
                title: 'Section 2',
                enabled: true,
                components: [{ id: 'duplicate-id', type: 'button', label: 'Button 2' }],
              },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueComponentIds(schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]?.code).toBe('duplicate_component_id');
    });

    it('should report multiple duplicate IDs', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                components: [
                  { id: 'dup-1', type: 'button', label: 'Button 1' },
                  { id: 'dup-1', type: 'button', label: 'Button 2' },
                  { id: 'dup-2', type: 'button', label: 'Button 3' },
                  { id: 'dup-2', type: 'button', label: 'Button 4' },
                ],
              },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueComponentIds(schema);
      expect(errors).toHaveLength(2);
    });
  });

  describe('validateIconReferences', () => {
    it('should pass when all icon references are valid', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            icon: 'icon-home',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                icon: 'icon-settings',
                components: [{ id: 'comp-1', type: 'button', label: 'Button', icon: 'icon-power' }],
              },
            ],
          },
        ],
        icons: [
          { id: 'icon-home', svg: '<svg></svg>' },
          { id: 'icon-settings', svg: '<svg></svg>' },
          { id: 'icon-power', svg: '<svg></svg>' },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateIconReferences(schema);
      expect(errors).toHaveLength(0);
    });

    it('should pass for direct path references', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            icon: '/icons/home.svg',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                icon: 'https://example.com/icon.svg',
                components: [{ id: 'comp-1', type: 'button', label: 'Button', icon: '⚙️' }],
              },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateIconReferences(schema);
      expect(errors).toHaveLength(0);
    });

    it('should fail when tab icon reference is invalid', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            icon: 'non-existent-icon',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                components: [],
              },
            ],
          },
        ],
        icons: [],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateIconReferences(schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]?.code).toBe('invalid_icon_reference');
      expect(errors[0]?.message).toContain('non-existent-icon');
      expect(errors[0]?.path).toEqual(['tabs', '0', 'icon']);
    });

    it('should fail when section icon reference is invalid', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                icon: 'missing-icon',
                components: [],
              },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateIconReferences(schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]?.code).toBe('invalid_icon_reference');
    });

    it('should fail when component icon reference is invalid', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                components: [{ id: 'comp-1', type: 'button', label: 'Button', icon: 'bad-icon' }],
              },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateIconReferences(schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]?.path).toEqual(['tabs', '0', 'sections', '0', 'components', '0', 'icon']);
    });

    it('should report multiple invalid icon references', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            icon: 'bad-1',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                icon: 'bad-2',
                components: [{ id: 'comp-1', type: 'button', label: 'Button', icon: 'bad-3' }],
              },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateIconReferences(schema);
      expect(errors).toHaveLength(3);
    });
  });

  describe('validateUniqueIconIds', () => {
    it('should pass when all icon IDs are unique', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [{ id: 'section-1', title: 'Section 1', enabled: true, components: [] }],
          },
        ],
        icons: [
          { id: 'icon-1', svg: '<svg></svg>' },
          { id: 'icon-2', svg: '<svg></svg>' },
          { id: 'icon-3', svg: '<svg></svg>' },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueIconIds(schema);
      expect(errors).toHaveLength(0);
    });

    it('should fail when icon IDs are duplicated', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [{ id: 'section-1', title: 'Section 1', enabled: true, components: [] }],
          },
        ],
        icons: [
          { id: 'duplicate', svg: '<svg>1</svg>' },
          { id: 'duplicate', svg: '<svg>2</svg>' },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueIconIds(schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]?.code).toBe('duplicate_icon_id');
      expect(errors[0]?.message).toContain('duplicate');
    });

    it('should handle schemas without icons', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [{ id: 'section-1', title: 'Section 1', enabled: true, components: [] }],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueIconIds(schema);
      expect(errors).toHaveLength(0);
    });
  });

  describe('validateUniqueTabIds', () => {
    it('should pass when all tab IDs are unique', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [{ id: 'section-1', title: 'Section 1', enabled: true, components: [] }],
          },
          {
            id: 'tab-2',
            title: 'Tab 2',
            sections: [{ id: 'section-2', title: 'Section 2', enabled: true, components: [] }],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueTabIds(schema);
      expect(errors).toHaveLength(0);
    });

    it('should fail when tab IDs are duplicated', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'duplicate-tab',
            title: 'Tab 1',
            sections: [{ id: 'section-1', title: 'Section 1', enabled: true, components: [] }],
          },
          {
            id: 'duplicate-tab',
            title: 'Tab 2',
            sections: [{ id: 'section-2', title: 'Section 2', enabled: true, components: [] }],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueTabIds(schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]?.code).toBe('duplicate_tab_id');
      expect(errors[0]?.message).toContain('duplicate-tab');
    });
  });

  describe('validateUniqueSectionIds', () => {
    it('should pass when all section IDs are unique within their tab', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              { id: 'section-1', title: 'Section 1', enabled: true, components: [] },
              { id: 'section-2', title: 'Section 2', enabled: true, components: [] },
            ],
          },
          {
            id: 'tab-2',
            title: 'Tab 2',
            sections: [
              { id: 'section-1', title: 'Section 1', enabled: true, components: [] }, // OK: different tab
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueSectionIds(schema);
      expect(errors).toHaveLength(0);
    });

    it('should fail when section IDs are duplicated within the same tab', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              { id: 'duplicate-section', title: 'Section 1', enabled: true, components: [] },
              { id: 'duplicate-section', title: 'Section 2', enabled: true, components: [] },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = validateUniqueSectionIds(schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]?.code).toBe('duplicate_section_id');
      expect(errors[0]?.message).toContain('duplicate-section');
      expect(errors[0]?.message).toContain('tab-1');
    });
  });

  describe('runCustomValidations', () => {
    it('should run all validators and combine errors', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'duplicate-tab',
            title: 'Tab 1',
            icon: 'missing-icon',
            sections: [
              {
                id: 'duplicate-section',
                title: 'Section 1',
                enabled: true,
                components: [
                  { id: 'duplicate-comp', type: 'button', label: 'Button 1' },
                  { id: 'duplicate-comp', type: 'button', label: 'Button 2' },
                ],
              },
              {
                id: 'duplicate-section',
                title: 'Section 2',
                enabled: true,
                components: [],
              },
            ],
          },
          {
            id: 'duplicate-tab',
            title: 'Tab 2',
            sections: [{ id: 'section-3', title: 'Section 3', enabled: true, components: [] }],
          },
        ],
        icons: [
          { id: 'icon-1', svg: '<svg></svg>' },
          { id: 'icon-1', svg: '<svg></svg>' },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = runCustomValidations(schema);

      // Should have errors from multiple validators
      expect(errors.length).toBeGreaterThan(0);

      // Check we have errors from different validators
      const errorCodes = errors.map((e) => e.code);
      expect(errorCodes).toContain('duplicate_component_id');
      expect(errorCodes).toContain('duplicate_tab_id');
      expect(errorCodes).toContain('duplicate_section_id');
      expect(errorCodes).toContain('duplicate_icon_id');
      expect(errorCodes).toContain('invalid_icon_reference');
    });

    it('should return empty array for valid schema', () => {
      const schema: UISchema = {
        schemaVersion: '0.1.0',
        tabs: [
          {
            id: 'tab-1',
            title: 'Tab 1',
            sections: [
              {
                id: 'section-1',
                title: 'Section 1',
                enabled: true,
                components: [{ id: 'component-1', type: 'button', label: 'Button' }],
              },
            ],
          },
        ],
        hardware: { outputs: [] },
        theme: { primaryColor: '#FF0000' },
        metadata: { name: 'Test', version: '1.0.0' },
      };

      const errors = runCustomValidations(schema);
      expect(errors).toHaveLength(0);
    });
  });
});
