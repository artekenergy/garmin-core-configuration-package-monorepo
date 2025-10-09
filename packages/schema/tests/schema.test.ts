import { validateSchema, SCHEMA_VERSION } from '../src/index';
import * as fs from 'fs';
import * as path from 'path';

// Helper to load JSON fixture
function loadFixture(filename: string): unknown {
  const filePath = path.join(__dirname, 'fixtures', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

describe('@gcg/schema', () => {
  describe('SCHEMA_VERSION', () => {
    it('should be 0.1.0', () => {
      expect(SCHEMA_VERSION).toBe('0.1.0');
    });
  });

  describe('validateSchema', () => {
    it('should exist', () => {
      expect(validateSchema).toBeDefined();
    });

    it('should return a result object', () => {
      const result = validateSchema({});
      expect(result).toHaveProperty('success');
    });
  });

  describe('Valid schemas', () => {
    it('should validate a minimal valid schema', () => {
      const schema = loadFixture('valid-minimal.json');
      const result = validateSchema(schema);
      
      if (!result.success) {
        console.log('Validation errors:', JSON.stringify(result.errors, null, 2));
      }
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
        expect(result.data.schemaVersion).toBe('0.1.0');
        expect(result.data.tabs).toHaveLength(1);
      }
    });

    it('should validate a complex schema with all component types', () => {
      const schema = loadFixture('valid-complex.json');
      const result = validateSchema(schema);
      
      if (!result.success) {
        console.log('Validation errors:', JSON.stringify(result.errors, null, 2));
      }
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tabs).toHaveLength(3);
        expect(result.data.icons).toBeDefined();
        expect(result.data.icons).toHaveLength(5);
      }
    });

    it('should validate all binding types', () => {
      const schema = loadFixture('valid-bindings.json');
      const result = validateSchema(schema);
      
      if (!result.success) {
        console.log('Validation errors:', JSON.stringify(result.errors, null, 2));
      }
      
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid schemas', () => {
    it('should reject schema with invalid version format', () => {
      const schema = loadFixture('invalid-schema-version.json');
      const result = validateSchema(schema);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        const firstError = result.errors[0];
        if (firstError) {
          expect(firstError.message).toMatch(/version/i);
        }
      }
    });

    it('should reject schema with no tabs', () => {
      const schema = loadFixture('invalid-no-tabs.json');
      const result = validateSchema(schema);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        const tabError = result.errors.find(e => 
          e.path.includes('tabs') && e.message.includes('least')
        );
        expect(tabError).toBeDefined();
      }
    });

    it('should reject schema with duplicate component IDs', () => {
      const schema = loadFixture('invalid-duplicate-ids.json');
      const result = validateSchema(schema);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        const firstError = result.errors[0];
        if (firstError) {
          expect(firstError.message).toMatch(/duplicate/i);
          expect(firstError.code).toBe('duplicate_component_id');
        }
      }
    });

    it('should reject schema with invalid icon reference', () => {
      const schema = loadFixture('invalid-icon-reference.json');
      const result = validateSchema(schema);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        const firstError = result.errors[0];
        if (firstError) {
          expect(firstError.message).toMatch(/icon/i);
          expect(firstError.code).toBe('invalid_icon_reference');
        }
      }
    });

    it('should reject schema with invalid channel name', () => {
      const schema = loadFixture('invalid-channel-name.json');
      const result = validateSchema(schema);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        const firstError = result.errors[0];
        if (firstError) {
          expect(firstError.message).toMatch(/channel/i);
        }
      }
    });

    it('should reject button with no bindings', () => {
      const schema = loadFixture('invalid-button-no-bindings.json');
      const result = validateSchema(schema);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        const firstError = result.errors[0];
        if (firstError) {
          expect(firstError.message).toMatch(/binding/i);
        }
      }
    });
  });

  describe('Component types', () => {
    it('should validate Toggle component', () => {
      const schema = {
        schemaVersion: '0.1.0',
        metadata: { name: 'Test', version: '1.0.0' },
        tabs: [{
          id: 'tab-1',
          title: 'Tab 1',
          sections: [{
            id: 'section-1',
            title: 'Section 1',
            components: [{
              id: 'toggle-1',
              type: 'toggle',
              label: 'Test Toggle',
              variant: 'switch',
              bindings: {
                state: { type: 'empirbus', channel: 'out-channel-1' }
              }
            }]
          }]
        }]
      };
      
      const result = validateSchema(schema);
      expect(result.success).toBe(true);
    });

    it('should validate Button component with momentary action', () => {
      const schema = {
        schemaVersion: '0.1.0',
        metadata: { name: 'Test', version: '1.0.0' },
        tabs: [{
          id: 'tab-1',
          title: 'Tab 1',
          sections: [{
            id: 'section-1',
            title: 'Section 1',
            components: [{
              id: 'btn-1',
              type: 'button',
              label: 'Test Button',
              action: 'momentary',
              bindings: {
                action: { type: 'empirbus', channel: 'out-channel-1' }
              }
            }]
          }]
        }]
      };
      
      const result = validateSchema(schema);
      expect(result.success).toBe(true);
    });

    it('should validate Button component with toggle action', () => {
      const schema = {
        schemaVersion: '0.1.0',
        metadata: { name: 'Test', version: '1.0.0' },
        tabs: [{
          id: 'tab-1',
          title: 'Tab 1',
          sections: [{
            id: 'section-1',
            title: 'Section 1',
            components: [{
              id: 'btn-1',
              type: 'button',
              label: 'Test Button',
              action: 'toggle',
              bindings: {
                state: { type: 'empirbus', channel: 'out-channel-1' }
              }
            }]
          }]
        }]
      };
      
      const result = validateSchema(schema);
      expect(result.success).toBe(true);
    });

    it('should validate all 6 component types', () => {
      const schema = loadFixture('valid-complex.json');
      const result = validateSchema(schema);
      
      expect(result.success).toBe(true);
    });
  });

  describe('Binding types', () => {
    it('should validate EmpirBus binding', () => {
      const schema = {
        schemaVersion: '0.1.0',
        metadata: { name: 'Test', version: '1.0.0' },
        tabs: [{
          id: 'tab-1',
          title: 'Tab 1',
          sections: [{
            id: 'section-1',
            title: 'Section 1',
            components: [{
              id: 'toggle-1',
              type: 'toggle',
              label: 'Test',
              bindings: {
                state: { 
                  type: 'empirbus', 
                  channel: 'out-channel-1',
                  property: 'state'
                }
              }
            }]
          }]
        }]
      };
      
      const result = validateSchema(schema);
      expect(result.success).toBe(true);
    });

    it('should validate NMEA2000 binding', () => {
      const schema = {
        schemaVersion: '0.1.0',
        metadata: { name: 'Test', version: '1.0.0' },
        tabs: [{
          id: 'tab-1',
          title: 'Tab 1',
          sections: [{
            id: 'section-1',
            title: 'Section 1',
            components: [{
              id: 'gauge-1',
              type: 'gauge',
              label: 'Test',
              bindings: {
                value: { 
                  type: 'nmea2000', 
                  pgn: 127505,
                  field: 'fuelLevel',
                  instance: 0
                }
              }
            }]
          }]
        }]
      };
      
      const result = validateSchema(schema);
      expect(result.success).toBe(true);
    });

    it('should validate static binding', () => {
      const schema = {
        schemaVersion: '0.1.0',
        metadata: { name: 'Test', version: '1.0.0' },
        tabs: [{
          id: 'tab-1',
          title: 'Tab 1',
          sections: [{
            id: 'section-1',
            title: 'Section 1',
            components: [{
              id: 'toggle-1',
              type: 'toggle',
              label: 'Test',
              bindings: {
                state: { type: 'static', value: true }
              }
            }]
          }]
        }]
      };
      
      const result = validateSchema(schema);
      expect(result.success).toBe(true);
    });
  });
});
