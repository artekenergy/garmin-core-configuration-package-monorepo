/**
 * Section schema - Group of related components
 */
import { z } from 'zod';
export declare const SectionSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodEnum<["switching", "signal-values", "image", "mixed"]>>;
    icon: z.ZodOptional<z.ZodString>;
    collapsible: z.ZodOptional<z.ZodBoolean>;
    collapsed: z.ZodOptional<z.ZodBoolean>;
    imageUrl: z.ZodOptional<z.ZodString>;
    components: z.ZodArray<z.ZodUnion<[z.ZodObject<{
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
        min: number;
        max: number;
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
        demoValue: z.ZodOptional<z.ZodNumber>;
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
        decimals: number;
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
        demoValue?: number | undefined;
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
        demoValue?: number | undefined;
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
        tooltip?: string | undefined;
        disabled?: boolean | undefined;
        visible?: boolean | undefined;
        unit?: string | undefined;
        step?: number | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
        showValue?: boolean | undefined;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    enabled: boolean;
    components: ({
        id: string;
        type: "gauge";
        label: string;
        decimals: number;
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
        demoValue?: number | undefined;
    } | {
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
    } | {
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
    } | {
        id: string;
        type: "dimmer";
        label: string;
        min: number;
        max: number;
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
        step: number;
        icon?: string | undefined;
        tooltip?: string | undefined;
        disabled?: boolean | undefined;
        visible?: boolean | undefined;
    } | {
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
    } | {
        id: string;
        type: "slider";
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
        step: number;
        orientation: "horizontal" | "vertical";
        showValue: boolean;
        icon?: string | undefined;
        tooltip?: string | undefined;
        disabled?: boolean | undefined;
        visible?: boolean | undefined;
        unit?: string | undefined;
    })[];
    type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
    icon?: string | undefined;
    collapsible?: boolean | undefined;
    collapsed?: boolean | undefined;
    imageUrl?: string | undefined;
}, {
    id: string;
    title: string;
    components: ({
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
        demoValue?: number | undefined;
    } | {
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
    } | {
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
    } | {
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
    } | {
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
    } | {
        id: string;
        type: "slider";
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
        tooltip?: string | undefined;
        disabled?: boolean | undefined;
        visible?: boolean | undefined;
        unit?: string | undefined;
        step?: number | undefined;
        orientation?: "horizontal" | "vertical" | undefined;
        showValue?: boolean | undefined;
    })[];
    type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
    icon?: string | undefined;
    enabled?: boolean | undefined;
    collapsible?: boolean | undefined;
    collapsed?: boolean | undefined;
    imageUrl?: string | undefined;
}>;
export type Section = z.infer<typeof SectionSchema>;
//# sourceMappingURL=section.d.ts.map