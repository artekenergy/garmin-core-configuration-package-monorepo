/**
 * Toggle Component - Binary on/off switch
 */
import { z } from 'zod';
export declare const ToggleComponentSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"toggle">;
    variant: z.ZodOptional<z.ZodEnum<["default", "switch", "checkbox", "round"]>>;
    bindings: z.ZodObject<{
        state: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"empirbus">;
            channel: z.ZodString;
            property: z.ZodOptional<z.ZodEnum<["state", "intensity", "value"]>>;
        }, "strip", z.ZodTypeAny, {
            type: "empirbus";
            channel: string;
            property?: "value" | "state" | "intensity" | undefined;
        }, {
            type: "empirbus";
            channel: string;
            property?: "value" | "state" | "intensity" | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"nmea2000">;
            pgn: z.ZodNumber;
            field: z.ZodString;
            instance: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            type: "nmea2000";
            pgn: number;
            field: string;
            instance?: number | undefined;
        }, {
            type: "nmea2000";
            pgn: number;
            field: string;
            instance?: number | undefined;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"static">;
            value: z.ZodUnknown;
        }, "strip", z.ZodTypeAny, {
            type: "static";
            value?: unknown;
        }, {
            type: "static";
            value?: unknown;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        state: {
            type: "empirbus";
            channel: string;
            property?: "value" | "state" | "intensity" | undefined;
        } | {
            type: "nmea2000";
            pgn: number;
            field: string;
            instance?: number | undefined;
        } | {
            type: "static";
            value?: unknown;
        };
    }, {
        state: {
            type: "empirbus";
            channel: string;
            property?: "value" | "state" | "intensity" | undefined;
        } | {
            type: "nmea2000";
            pgn: number;
            field: string;
            instance?: number | undefined;
        } | {
            type: "static";
            value?: unknown;
        };
    }>;
}, "strip", z.ZodTypeAny, {
    type: "toggle";
    id: string;
    label: string;
    bindings: {
        state: {
            type: "empirbus";
            channel: string;
            property?: "value" | "state" | "intensity" | undefined;
        } | {
            type: "nmea2000";
            pgn: number;
            field: string;
            instance?: number | undefined;
        } | {
            type: "static";
            value?: unknown;
        };
    };
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "default" | "switch" | "checkbox" | "round" | undefined;
}, {
    type: "toggle";
    id: string;
    label: string;
    bindings: {
        state: {
            type: "empirbus";
            channel: string;
            property?: "value" | "state" | "intensity" | undefined;
        } | {
            type: "nmea2000";
            pgn: number;
            field: string;
            instance?: number | undefined;
        } | {
            type: "static";
            value?: unknown;
        };
    };
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "default" | "switch" | "checkbox" | "round" | undefined;
}>;
export type ToggleComponent = z.infer<typeof ToggleComponentSchema>;
//# sourceMappingURL=toggle.d.ts.map