/**
 * Slider Component - Adjustable value input
 */
import { z } from 'zod';
export declare const SliderComponentBaseSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"slider">;
    orientation: z.ZodDefault<z.ZodOptional<z.ZodEnum<["horizontal", "vertical"]>>>;
    min: z.ZodNumber;
    max: z.ZodNumber;
    step: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    unit: z.ZodOptional<z.ZodString>;
    showValue: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
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
    type: "slider";
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
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
    orientation: "horizontal" | "vertical";
    showValue: boolean;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    unit?: string | undefined;
}, {
    type: "slider";
    id: string;
    label: string;
    min: number;
    max: number;
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
    step?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    unit?: string | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    showValue?: boolean | undefined;
}>;
export declare const SliderComponentSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"slider">;
    orientation: z.ZodDefault<z.ZodOptional<z.ZodEnum<["horizontal", "vertical"]>>>;
    min: z.ZodNumber;
    max: z.ZodNumber;
    step: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    unit: z.ZodOptional<z.ZodString>;
    showValue: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
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
    type: "slider";
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
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
    orientation: "horizontal" | "vertical";
    showValue: boolean;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    unit?: string | undefined;
}, {
    type: "slider";
    id: string;
    label: string;
    min: number;
    max: number;
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
    step?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    unit?: string | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    showValue?: boolean | undefined;
}>, {
    type: "slider";
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
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
    orientation: "horizontal" | "vertical";
    showValue: boolean;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    unit?: string | undefined;
}, {
    type: "slider";
    id: string;
    label: string;
    min: number;
    max: number;
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
    step?: number | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    unit?: string | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    showValue?: boolean | undefined;
}>;
export type SliderComponent = z.infer<typeof SliderComponentSchema>;
//# sourceMappingURL=slider.d.ts.map