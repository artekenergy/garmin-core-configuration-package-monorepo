/**
 * Hardware configuration schema - Complete hardware system definition
 */
import { z } from 'zod';
export declare const HardwareConfigSchema: z.ZodObject<{
    systemType: z.ZodDefault<z.ZodEnum<["core", "core-lite"]>>;
    outputs: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodEnum<["core", "core-lite", "genesis"]>;
        channel: z.ZodNumber;
        label: z.ZodOptional<z.ZodString>;
        control: z.ZodDefault<z.ZodEnum<["not-used", "push-button", "toggle-button", "slider", "half-bridge", "dimmer", "special-function"]>>;
        icon: z.ZodOptional<z.ZodString>;
        signalId: z.ZodOptional<z.ZodNumber>;
        signals: z.ZodOptional<z.ZodObject<{
            toggle: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            momentary: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            dimmer: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            dimmer?: number | null | undefined;
            toggle?: number | null | undefined;
            momentary?: number | null | undefined;
        }, {
            dimmer?: number | null | undefined;
            toggle?: number | null | undefined;
            momentary?: number | null | undefined;
        }>>;
        range: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            step: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            min: number;
            max: number;
            step: number;
        }, {
            min: number;
            max: number;
            step: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        source: "core" | "core-lite" | "genesis";
        channel: number;
        control: "not-used" | "push-button" | "toggle-button" | "slider" | "half-bridge" | "dimmer" | "special-function";
        icon?: string | undefined;
        label?: string | undefined;
        signalId?: number | undefined;
        signals?: {
            dimmer?: number | null | undefined;
            toggle?: number | null | undefined;
            momentary?: number | null | undefined;
        } | undefined;
        range?: {
            min: number;
            max: number;
            step: number;
        } | undefined;
    }, {
        id: string;
        source: "core" | "core-lite" | "genesis";
        channel: number;
        icon?: string | undefined;
        label?: string | undefined;
        control?: "not-used" | "push-button" | "toggle-button" | "slider" | "half-bridge" | "dimmer" | "special-function" | undefined;
        signalId?: number | undefined;
        signals?: {
            dimmer?: number | null | undefined;
            toggle?: number | null | undefined;
            momentary?: number | null | undefined;
        } | undefined;
        range?: {
            min: number;
            max: number;
            step: number;
        } | undefined;
    }>, "many">;
    halfBridgePairs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        source: z.ZodEnum<["core", "core-lite", "genesis"]>;
        channelA: z.ZodNumber;
        channelB: z.ZodNumber;
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        source: "core" | "core-lite" | "genesis";
        channelA: number;
        channelB: number;
    }, {
        source: "core" | "core-lite" | "genesis";
        channelA: number;
        channelB: number;
        enabled?: boolean | undefined;
    }>, "many">>;
    signalMap: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodNumber, z.ZodObject<{
        'push-button': z.ZodOptional<z.ZodNumber>;
        'toggle-button': z.ZodOptional<z.ZodNumber>;
        slider: z.ZodOptional<z.ZodNumber>;
        default: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        'push-button'?: number | undefined;
        'toggle-button'?: number | undefined;
        slider?: number | undefined;
        default?: number | undefined;
    }, {
        'push-button'?: number | undefined;
        'toggle-button'?: number | undefined;
        slider?: number | undefined;
        default?: number | undefined;
    }>]>>>;
    genesisBoards: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    systemType: "core" | "core-lite";
    outputs: {
        id: string;
        source: "core" | "core-lite" | "genesis";
        channel: number;
        control: "not-used" | "push-button" | "toggle-button" | "slider" | "half-bridge" | "dimmer" | "special-function";
        icon?: string | undefined;
        label?: string | undefined;
        signalId?: number | undefined;
        signals?: {
            dimmer?: number | null | undefined;
            toggle?: number | null | undefined;
            momentary?: number | null | undefined;
        } | undefined;
        range?: {
            min: number;
            max: number;
            step: number;
        } | undefined;
    }[];
    genesisBoards: number;
    halfBridgePairs?: {
        enabled: boolean;
        source: "core" | "core-lite" | "genesis";
        channelA: number;
        channelB: number;
    }[] | undefined;
    signalMap?: Record<string, number | {
        'push-button'?: number | undefined;
        'toggle-button'?: number | undefined;
        slider?: number | undefined;
        default?: number | undefined;
    }> | undefined;
}, {
    outputs: {
        id: string;
        source: "core" | "core-lite" | "genesis";
        channel: number;
        icon?: string | undefined;
        label?: string | undefined;
        control?: "not-used" | "push-button" | "toggle-button" | "slider" | "half-bridge" | "dimmer" | "special-function" | undefined;
        signalId?: number | undefined;
        signals?: {
            dimmer?: number | null | undefined;
            toggle?: number | null | undefined;
            momentary?: number | null | undefined;
        } | undefined;
        range?: {
            min: number;
            max: number;
            step: number;
        } | undefined;
    }[];
    systemType?: "core" | "core-lite" | undefined;
    halfBridgePairs?: {
        source: "core" | "core-lite" | "genesis";
        channelA: number;
        channelB: number;
        enabled?: boolean | undefined;
    }[] | undefined;
    signalMap?: Record<string, number | {
        'push-button'?: number | undefined;
        'toggle-button'?: number | undefined;
        slider?: number | undefined;
        default?: number | undefined;
    }> | undefined;
    genesisBoards?: number | undefined;
}>;
export type HardwareConfig = z.infer<typeof HardwareConfigSchema>;
//# sourceMappingURL=config.d.ts.map