/**
 * TypeScript type definitions exported from Zod schemas
 * 
 * These types are automatically inferred from the Zod schemas,
 * ensuring runtime validation and compile-time types stay in sync.
 */

import { z } from "zod";
import {
  EmpirBusBindingSchema,
  NMEA2000BindingSchema,
  StaticBindingSchema,
  BindingSchema,
  ToggleComponentSchema,
  ButtonComponentSchema,
  DimmerComponentSchema,
  GaugeComponentSchema,
  IndicatorComponentSchema,
  SliderComponentSchema,
  IconSchema,
  MetadataSchema,
  UISchemaSchema,
} from "./schema";

// Binding types
export type EmpirBusBinding = z.infer<typeof EmpirBusBindingSchema>;
export type NMEA2000Binding = z.infer<typeof NMEA2000BindingSchema>;
export type StaticBinding = z.infer<typeof StaticBindingSchema>;
export type Binding = z.infer<typeof BindingSchema>;

// Component types (use base schemas for types without refinements)
export type ToggleComponent = z.infer<typeof ToggleComponentSchema>;
export type ButtonComponent = z.infer<typeof ButtonComponentSchema>;
export type DimmerComponent = z.infer<typeof DimmerComponentSchema>;
export type GaugeComponent = z.infer<typeof GaugeComponentSchema>;
export type IndicatorComponent = z.infer<typeof IndicatorComponentSchema>;
export type SliderComponent = z.infer<typeof SliderComponentSchema>;
// Note: Component type is exported from schema.ts

// Structural types
// Note: Section, Tab, Component are now exported from schema.ts to avoid duplication
export type Icon = z.infer<typeof IconSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;

// Note: UISchema, Tab, Section, Component are exported from schema.ts
// You can import them from either "./schema" or the main index

// Helper type for component type strings
export type ComponentType = "toggle" | "button" | "dimmer" | "gauge" | "indicator" | "slider";

// Helper type for binding type strings
export type BindingType = Binding["type"];

// Validation result types
export interface ValidationSuccess {
  success: true;
  data: z.infer<typeof UISchemaSchema>;
}

export interface ValidationError {
  success: false;
  errors: Array<{
    path: string[];
    message: string;
    code: string;
  }>;
}

export type ValidationResult = ValidationSuccess | ValidationError;
