/**
 * Root UISchema - The complete UI definition
 */
import { z } from 'zod';
import { MetadataSchema } from '../metadata';
import { ThemeConfigSchema } from '../theme';
import { LightingTabConfigSchema } from '../tabs/lighting-tab';
import { HVACTabConfigSchema } from '../tabs/hvac-tab';
import { SwitchingTabConfigSchema } from '../tabs/switching-tab';
import { PlumbingTabConfigSchema } from '../tabs/plumbing-tab';
import { HardwareConfigSchema } from '../hardware';
import { PowerConfigSchema } from '../subsystems/power';
import { HVACConfigSchema } from '../subsystems/hvac';
import { PlumbingConfigSchema } from '../subsystems/plumbing';
import { AccessoriesConfigSchema } from '../subsystems/accessories';
import { LightingConfigSchema } from '../subsystems/lighting';
import { TabSchema } from '../structure/tab';
import { IconSchema } from '../structure/icon';
export const UISchemaSchema = z.object({
    schemaVersion: z
        .string()
        .regex(/^\d+\.\d+\.\d+$/, 'Schema version must be semantic version (x.y.z)'),
    metadata: MetadataSchema,
    theme: ThemeConfigSchema.optional(),
    lightingTab: LightingTabConfigSchema.optional(),
    hvacTab: HVACTabConfigSchema.optional(),
    switchingTab: SwitchingTabConfigSchema.optional(),
    plumbingTab: PlumbingTabConfigSchema.optional(),
    hardware: HardwareConfigSchema.optional(),
    power: PowerConfigSchema.optional(),
    hvac: HVACConfigSchema.optional(),
    plumbing: PlumbingConfigSchema.optional(),
    accessories: AccessoriesConfigSchema.optional(),
    lighting: LightingConfigSchema.optional(),
    tabs: z.array(TabSchema).min(1).max(6), // Changed to max 6 for preset tabs
    icons: z.array(IconSchema).optional(),
});
//# sourceMappingURL=index.js.map