/**
 * Lighting tab configuration with subtab support
 */
import { z } from 'zod';
import { SubtabConfigSchema } from './subtab';
export const LightingTabConfigSchema = z
    .object({
    interior: SubtabConfigSchema.default({
        enabled: true,
        title: 'Interior',
        icon: '💡',
    }),
    exterior: SubtabConfigSchema.default({
        enabled: true,
        title: 'Exterior',
        icon: '🌟',
    }),
    rgb: SubtabConfigSchema.default({
        enabled: false, // Disabled by default, enabled when RGB modules are configured
        title: 'RGB',
        icon: '🌈',
    }),
})
    .default({
    interior: { enabled: true, title: 'Interior', icon: '💡' },
    exterior: { enabled: true, title: 'Exterior', icon: '🌟' },
    rgb: { enabled: false, title: 'RGB', icon: '🌈' },
});
//# sourceMappingURL=lighting-tab.js.map