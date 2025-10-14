/**
 * Hardware configuration schema - Complete hardware system definition
 */
import { z } from 'zod';
import { HardwareSystemTypeSchema } from './types';
import { OutputChannelSchema } from './output-channel';
import { HalfBridgePairSchema } from './half-bridge';
import { SignalMapEntrySchema } from './signal-map';
export const HardwareConfigSchema = z.object({
    systemType: HardwareSystemTypeSchema.default('core'),
    outputs: z.array(OutputChannelSchema),
    halfBridgePairs: z.array(HalfBridgePairSchema).optional(),
    signalMap: z.record(z.string(), SignalMapEntrySchema).optional(),
    genesisBoards: z.number().int().min(0).max(4).default(0), // CORE: 0-4 boards, CORE LITE: 1-4 boards (1 included + up to 3 additional)
});
//# sourceMappingURL=config.js.map