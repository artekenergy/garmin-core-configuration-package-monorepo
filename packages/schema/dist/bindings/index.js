/**
 * Binding schemas - define how components connect to data sources
 */
import { z } from 'zod';
export * from './empirbus';
export * from './nmea2000';
export * from './static';
import { EmpirBusBindingSchema } from './empirbus';
import { NMEA2000BindingSchema } from './nmea2000';
import { StaticBindingSchema } from './static';
// Union of all binding types
export const BindingSchema = z.discriminatedUnion('type', [
    EmpirBusBindingSchema,
    NMEA2000BindingSchema,
    StaticBindingSchema,
]);
//# sourceMappingURL=index.js.map