/**
 * Component schemas - UI component definitions
 *
 * Note: We use z.union instead of discriminatedUnion because some
 * schemas have .refine() applied, which is incompatible with discriminatedUnion.
 * The type field still acts as a discriminator at runtime.
 */
import { z } from 'zod';
export * from './base';
export * from './toggle';
export * from './button';
export * from './dimmer';
export * from './gauge';
export * from './indicator';
export * from './slider';
export * from './multiplus-control';
export * from './multiplus-test-controls';
/**
 * Union of all component types
 */
export declare const ComponentSchema: z.ZodUnion<[z.ZodObject<{
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
    id: string;
    type: "toggle";
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
    id: string;
    type: "toggle";
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
}>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"button">;
    action: z.ZodEnum<["momentary", "toggle"]>;
    variant: z.ZodOptional<z.ZodEnum<["primary", "secondary", "danger", "round"]>>;
    bindings: z.ZodEffects<z.ZodObject<{
        state: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
        action: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
    }, "strip", z.ZodTypeAny, {
        state?: {
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
        } | undefined;
        action?: {
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
        } | undefined;
    }, {
        state?: {
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
        } | undefined;
        action?: {
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
        } | undefined;
    }>, {
        state?: {
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
        } | undefined;
        action?: {
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
        } | undefined;
    }, {
        state?: {
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
        } | undefined;
        action?: {
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
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "button";
    label: string;
    bindings: {
        state?: {
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
        } | undefined;
        action?: {
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
        } | undefined;
    };
    action: "toggle" | "momentary";
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "round" | "primary" | "secondary" | "danger" | undefined;
}, {
    id: string;
    type: "button";
    label: string;
    bindings: {
        state?: {
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
        } | undefined;
        action?: {
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
        } | undefined;
    };
    action: "toggle" | "momentary";
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "round" | "primary" | "secondary" | "danger" | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"dimmer">;
    min: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    max: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    step: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    bindings: z.ZodObject<{
        intensity: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        intensity: {
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
        intensity: {
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
    id: string;
    type: "dimmer";
    label: string;
    bindings: {
        intensity: {
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
    min: number;
    max: number;
    step: number;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
}, {
    id: string;
    type: "dimmer";
    label: string;
    bindings: {
        intensity: {
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
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
}>, z.ZodObject<{
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
    id: string;
    type: "gauge";
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
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "circular" | "linear" | "numeric" | undefined;
    min?: number | undefined;
    max?: number | undefined;
    unit?: string | undefined;
}, {
    id: string;
    type: "gauge";
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
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    variant?: "circular" | "linear" | "numeric" | undefined;
    min?: number | undefined;
    max?: number | undefined;
    unit?: string | undefined;
    decimals?: number | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"indicator">;
    variant: z.ZodOptional<z.ZodEnum<["led", "badge", "icon"]>>;
    color: z.ZodOptional<z.ZodEnum<["green", "yellow", "red", "blue", "white"]>>;
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
    id: string;
    type: "indicator";
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
    variant?: "icon" | "led" | "badge" | undefined;
    color?: "green" | "yellow" | "red" | "blue" | "white" | undefined;
}, {
    id: string;
    type: "indicator";
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
    variant?: "icon" | "led" | "badge" | undefined;
    color?: "green" | "yellow" | "red" | "blue" | "white" | undefined;
}>, z.ZodObject<{
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
    id: string;
    type: "slider";
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
    min: number;
    max: number;
    step: number;
    orientation: "horizontal" | "vertical";
    showValue: boolean;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    unit?: string | undefined;
}, {
    id: string;
    type: "slider";
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
    min: number;
    max: number;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    step?: number | undefined;
    unit?: string | undefined;
    orientation?: "horizontal" | "vertical" | undefined;
    showValue?: boolean | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"multiplus-control">;
    leg: z.ZodOptional<z.ZodNumber>;
    bindings: z.ZodOptional<z.ZodObject<{
        acInVoltage: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
        acOutVoltage: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
        acOutCurrent: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
        modeOff: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
        modeOn: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
        modeChargerOnly: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
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
        }>]>>;
    }, "strip", z.ZodTypeAny, {
        acInVoltage?: {
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
        } | undefined;
        acOutVoltage?: {
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
        } | undefined;
        acOutCurrent?: {
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
        } | undefined;
        modeOff?: {
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
        } | undefined;
        modeOn?: {
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
        } | undefined;
        modeChargerOnly?: {
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
        } | undefined;
    }, {
        acInVoltage?: {
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
        } | undefined;
        acOutVoltage?: {
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
        } | undefined;
        acOutCurrent?: {
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
        } | undefined;
        modeOff?: {
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
        } | undefined;
        modeOn?: {
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
        } | undefined;
        modeChargerOnly?: {
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
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "multiplus-control";
    label: string;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    bindings?: {
        acInVoltage?: {
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
        } | undefined;
        acOutVoltage?: {
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
        } | undefined;
        acOutCurrent?: {
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
        } | undefined;
        modeOff?: {
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
        } | undefined;
        modeOn?: {
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
        } | undefined;
        modeChargerOnly?: {
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
        } | undefined;
    } | undefined;
    leg?: number | undefined;
}, {
    id: string;
    type: "multiplus-control";
    label: string;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    bindings?: {
        acInVoltage?: {
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
        } | undefined;
        acOutVoltage?: {
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
        } | undefined;
        acOutCurrent?: {
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
        } | undefined;
        modeOff?: {
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
        } | undefined;
        modeOn?: {
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
        } | undefined;
        modeChargerOnly?: {
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
        } | undefined;
    } | undefined;
    leg?: number | undefined;
}>, z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tooltip: z.ZodOptional<z.ZodString>;
    disabled: z.ZodOptional<z.ZodBoolean>;
    visible: z.ZodOptional<z.ZodBoolean>;
} & {
    type: z.ZodLiteral<"multiplus-test-controls">;
    leg: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "multiplus-test-controls";
    label: string;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    leg?: number | undefined;
}, {
    id: string;
    type: "multiplus-test-controls";
    label: string;
    icon?: string | undefined;
    tooltip?: string | undefined;
    disabled?: boolean | undefined;
    visible?: boolean | undefined;
    leg?: number | undefined;
}>]>;
export type Component = z.infer<typeof ComponentSchema>;
//# sourceMappingURL=index.d.ts.map