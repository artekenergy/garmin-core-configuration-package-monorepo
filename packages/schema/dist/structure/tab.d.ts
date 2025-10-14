/**
 * Tab schema - Top-level navigation item containing sections
 * Supports both custom tabs and preset system tabs
 */
import { z } from 'zod';
export declare const PresetTabIdSchema: z.ZodEnum<["home", "lighting", "power", "hvac", "switching", "plumbing"]>;
export declare const TabSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    preset: z.ZodOptional<z.ZodEnum<["home", "lighting", "power", "hvac", "switching", "plumbing"]>>;
    enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sections: z.ZodArray<z.ZodObject<{
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
            type: "button";
            id: string;
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
            variant?: "primary" | "secondary" | "round" | "danger" | undefined;
        }, {
            type: "button";
            id: string;
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
            variant?: "primary" | "secondary" | "round" | "danger" | undefined;
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
            type: "dimmer";
            id: string;
            label: string;
            min: number;
            max: number;
            step: number;
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
        }, {
            type: "dimmer";
            id: string;
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
            min?: number | undefined;
            max?: number | undefined;
            step?: number | undefined;
            tooltip?: string | undefined;
            disabled?: boolean | undefined;
            visible?: boolean | undefined;
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
            type: "indicator";
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
            variant?: "icon" | "led" | "badge" | undefined;
            color?: "blue" | "green" | "red" | "yellow" | "white" | undefined;
        }, {
            type: "indicator";
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
            variant?: "icon" | "led" | "badge" | undefined;
            color?: "blue" | "green" | "red" | "yellow" | "white" | undefined;
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
        }>]>, "many">;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        title: string;
        id: string;
        components: ({
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
        } | {
            type: "button";
            id: string;
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
            variant?: "primary" | "secondary" | "round" | "danger" | undefined;
        } | {
            type: "dimmer";
            id: string;
            label: string;
            min: number;
            max: number;
            step: number;
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
        } | {
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
        } | {
            type: "indicator";
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
            variant?: "icon" | "led" | "badge" | undefined;
            color?: "blue" | "green" | "red" | "yellow" | "white" | undefined;
        } | {
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
        })[];
        type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
        icon?: string | undefined;
        collapsible?: boolean | undefined;
        collapsed?: boolean | undefined;
        imageUrl?: string | undefined;
    }, {
        title: string;
        id: string;
        components: ({
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
        } | {
            type: "button";
            id: string;
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
            variant?: "primary" | "secondary" | "round" | "danger" | undefined;
        } | {
            type: "dimmer";
            id: string;
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
            min?: number | undefined;
            max?: number | undefined;
            step?: number | undefined;
            tooltip?: string | undefined;
            disabled?: boolean | undefined;
            visible?: boolean | undefined;
        } | {
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
        } | {
            type: "indicator";
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
            variant?: "icon" | "led" | "badge" | undefined;
            color?: "blue" | "green" | "red" | "yellow" | "white" | undefined;
        } | {
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
        })[];
        type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
        enabled?: boolean | undefined;
        icon?: string | undefined;
        collapsible?: boolean | undefined;
        collapsed?: boolean | undefined;
        imageUrl?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    title: string;
    id: string;
    sections: {
        enabled: boolean;
        title: string;
        id: string;
        components: ({
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
        } | {
            type: "button";
            id: string;
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
            variant?: "primary" | "secondary" | "round" | "danger" | undefined;
        } | {
            type: "dimmer";
            id: string;
            label: string;
            min: number;
            max: number;
            step: number;
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
        } | {
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
        } | {
            type: "indicator";
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
            variant?: "icon" | "led" | "badge" | undefined;
            color?: "blue" | "green" | "red" | "yellow" | "white" | undefined;
        } | {
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
        })[];
        type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
        icon?: string | undefined;
        collapsible?: boolean | undefined;
        collapsed?: boolean | undefined;
        imageUrl?: string | undefined;
    }[];
    preset?: "switching" | "home" | "lighting" | "power" | "hvac" | "plumbing" | undefined;
    icon?: string | undefined;
}, {
    title: string;
    id: string;
    sections: {
        title: string;
        id: string;
        components: ({
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
        } | {
            type: "button";
            id: string;
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
            variant?: "primary" | "secondary" | "round" | "danger" | undefined;
        } | {
            type: "dimmer";
            id: string;
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
            min?: number | undefined;
            max?: number | undefined;
            step?: number | undefined;
            tooltip?: string | undefined;
            disabled?: boolean | undefined;
            visible?: boolean | undefined;
        } | {
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
        } | {
            type: "indicator";
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
            variant?: "icon" | "led" | "badge" | undefined;
            color?: "blue" | "green" | "red" | "yellow" | "white" | undefined;
        } | {
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
        })[];
        type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
        enabled?: boolean | undefined;
        icon?: string | undefined;
        collapsible?: boolean | undefined;
        collapsed?: boolean | undefined;
        imageUrl?: string | undefined;
    }[];
    preset?: "switching" | "home" | "lighting" | "power" | "hvac" | "plumbing" | undefined;
    enabled?: boolean | undefined;
    icon?: string | undefined;
}>;
export type Tab = z.infer<typeof TabSchema>;
export type PresetTabId = z.infer<typeof PresetTabIdSchema>;
//# sourceMappingURL=tab.d.ts.map