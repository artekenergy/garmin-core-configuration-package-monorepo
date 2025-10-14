/**
 * Gauge Component - Read-only numeric display
 */
import { z } from 'zod';
export declare const GaugeComponentBaseSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"gauge">;
    variant: z.ZodOptional<z.ZodEnum<["circular", "linear", "numeric"]>>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    unit: z.ZodOptional<z.ZodString>;
    decimals: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    bindings: z.ZodObject<{
        value: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        value: {
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
        value: {
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
    type: "gauge";
    id: string;
    label: string;
    bindings: {
        value: {
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
    decimals: number;
    icon?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "circular" | "linear" | "numeric" | undefined;
    unit?: string | undefined;
}, {
    type: "gauge";
    id: string;
    label: string;
    bindings: {
        value: {
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
    min?: number | undefined;
    max?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "circular" | "linear" | "numeric" | undefined;
    unit?: string | undefined;
    decimals?: number | undefined;
}>;
export declare const GaugeComponentSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"gauge">;
    variant: z.ZodOptional<z.ZodEnum<["circular", "linear", "numeric"]>>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    unit: z.ZodOptional<z.ZodString>;
    decimals: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    bindings: z.ZodObject<{
        value: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        value: {
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
        value: {
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
    type: "gauge";
    id: string;
    label: string;
    bindings: {
        value: {
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
    decimals: number;
    icon?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "circular" | "linear" | "numeric" | undefined;
    unit?: string | undefined;
}, {
    type: "gauge";
    id: string;
    label: string;
    bindings: {
        value: {
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
    min?: number | undefined;
    max?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "circular" | "linear" | "numeric" | undefined;
    unit?: string | undefined;
    decimals?: number | undefined;
}>, {
    type: "gauge";
    id: string;
    label: string;
    bindings: {
        value: {
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
    decimals: number;
    icon?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "circular" | "linear" | "numeric" | undefined;
    unit?: string | undefined;
}, {
    type: "gauge";
    id: string;
    label: string;
    bindings: {
        value: {
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
    min?: number | undefined;
    max?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "circular" | "linear" | "numeric" | undefined;
    unit?: string | undefined;
    decimals?: number | undefined;
}>;
export type GaugeComponent = z.infer<typeof GaugeComponentSchema>;
//# sourceMappingURL=gauge.d.ts.map