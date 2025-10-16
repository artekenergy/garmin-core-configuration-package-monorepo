/**
 * Root UISchema - The complete UI definition
 */
import { z } from 'zod';
export declare const UISchemaSchema: z.ZodObject<{
    schemaVersion: z.ZodString;
    metadata: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        version: z.ZodString;
        author: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
        description?: string | undefined;
        author?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }, {
        name: string;
        version: string;
        description?: string | undefined;
        author?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }>;
    theme: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        preset: z.ZodDefault<z.ZodEnum<["blue", "purple", "green", "orange", "red", "dark", "light"]>>;
        customColors: z.ZodOptional<z.ZodObject<{
            primary: z.ZodOptional<z.ZodString>;
            secondary: z.ZodOptional<z.ZodString>;
            accent: z.ZodOptional<z.ZodString>;
            background: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
            background?: string | undefined;
            text?: string | undefined;
        }, {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
            background?: string | undefined;
            text?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        preset: "green" | "red" | "blue" | "purple" | "orange" | "dark" | "light";
        customColors?: {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
            background?: string | undefined;
            text?: string | undefined;
        } | undefined;
    }, {
        preset?: "green" | "red" | "blue" | "purple" | "orange" | "dark" | "light" | undefined;
        customColors?: {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
            background?: string | undefined;
            text?: string | undefined;
        } | undefined;
    }>>>;
    lightingTab: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        interior: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        }, {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
        exterior: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        }, {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
        rgb: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        }, {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        interior: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        exterior: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        rgb: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
    }, {
        interior?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        exterior?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        rgb?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    }>>>;
    hvacTab: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        heating: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        }, {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
        cooling: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        }, {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
        ventilation: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        }, {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        heating: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        cooling: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        ventilation: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
    }, {
        heating?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        cooling?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        ventilation?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    }>>>;
    switchingTab: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        switches: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        }, {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
        accessories: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        }, {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
        customSection: z.ZodOptional<z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
        }, {
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        switches: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        accessories: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        customSection?: {
            title: string;
            enabled: boolean;
        } | undefined;
    }, {
        switches?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        accessories?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        customSection?: {
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    }>>>;
    plumbingTab: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        switchingSection: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            title: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            enabled: boolean;
        }, {
            title?: string | undefined;
            enabled?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        switchingSection: {
            title: string;
            enabled: boolean;
        };
    }, {
        switchingSection?: {
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    }>>>;
    hardware: z.ZodOptional<z.ZodObject<{
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
                toggle?: number | null | undefined;
                momentary?: number | null | undefined;
                dimmer?: number | null | undefined;
            }, {
                toggle?: number | null | undefined;
                momentary?: number | null | undefined;
                dimmer?: number | null | undefined;
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
            channel: number;
            source: "core" | "core-lite" | "genesis";
            control: "dimmer" | "slider" | "not-used" | "push-button" | "toggle-button" | "half-bridge" | "special-function";
            label?: string | undefined;
            icon?: string | undefined;
            signalId?: number | undefined;
            signals?: {
                toggle?: number | null | undefined;
                momentary?: number | null | undefined;
                dimmer?: number | null | undefined;
            } | undefined;
            range?: {
                min: number;
                max: number;
                step: number;
            } | undefined;
        }, {
            id: string;
            channel: number;
            source: "core" | "core-lite" | "genesis";
            label?: string | undefined;
            icon?: string | undefined;
            control?: "dimmer" | "slider" | "not-used" | "push-button" | "toggle-button" | "half-bridge" | "special-function" | undefined;
            signalId?: number | undefined;
            signals?: {
                toggle?: number | null | undefined;
                momentary?: number | null | undefined;
                dimmer?: number | null | undefined;
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
            default?: number | undefined;
            slider?: number | undefined;
            'push-button'?: number | undefined;
            'toggle-button'?: number | undefined;
        }, {
            default?: number | undefined;
            slider?: number | undefined;
            'push-button'?: number | undefined;
            'toggle-button'?: number | undefined;
        }>]>>>;
        genesisBoards: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        systemType: "core" | "core-lite";
        outputs: {
            id: string;
            channel: number;
            source: "core" | "core-lite" | "genesis";
            control: "dimmer" | "slider" | "not-used" | "push-button" | "toggle-button" | "half-bridge" | "special-function";
            label?: string | undefined;
            icon?: string | undefined;
            signalId?: number | undefined;
            signals?: {
                toggle?: number | null | undefined;
                momentary?: number | null | undefined;
                dimmer?: number | null | undefined;
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
            default?: number | undefined;
            slider?: number | undefined;
            'push-button'?: number | undefined;
            'toggle-button'?: number | undefined;
        }> | undefined;
    }, {
        outputs: {
            id: string;
            channel: number;
            source: "core" | "core-lite" | "genesis";
            label?: string | undefined;
            icon?: string | undefined;
            control?: "dimmer" | "slider" | "not-used" | "push-button" | "toggle-button" | "half-bridge" | "special-function" | undefined;
            signalId?: number | undefined;
            signals?: {
                toggle?: number | null | undefined;
                momentary?: number | null | undefined;
                dimmer?: number | null | undefined;
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
            default?: number | undefined;
            slider?: number | undefined;
            'push-button'?: number | undefined;
            'toggle-button'?: number | undefined;
        }> | undefined;
        genesisBoards?: number | undefined;
    }>>;
    power: z.ZodOptional<z.ZodObject<{
        dcCharging: z.ZodDefault<z.ZodObject<{
            secondAlternator: z.ZodDefault<z.ZodBoolean>;
            orionXs: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            secondAlternator: boolean;
            orionXs: boolean;
        }, {
            secondAlternator?: boolean | undefined;
            orionXs?: boolean | undefined;
        }>>;
        solar: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            primaryArray: z.ZodDefault<z.ZodBoolean>;
            auxiliaryArray: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            primaryArray: boolean;
            auxiliaryArray: boolean;
        }, {
            enabled?: boolean | undefined;
            primaryArray?: boolean | undefined;
            auxiliaryArray?: boolean | undefined;
        }>>;
        batteryManagement: z.ZodDefault<z.ZodEnum<["victron", "expion", "battleborn", "discover"]>>;
        acLegs: z.ZodDefault<z.ZodNumber>;
        multiplus: z.ZodDefault<z.ZodObject<{
            l1: z.ZodDefault<z.ZodBoolean>;
            l2: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            l1: boolean;
            l2: boolean;
        }, {
            l1?: boolean | undefined;
            l2?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        dcCharging: {
            secondAlternator: boolean;
            orionXs: boolean;
        };
        solar: {
            enabled: boolean;
            primaryArray: boolean;
            auxiliaryArray: boolean;
        };
        batteryManagement: "victron" | "expion" | "battleborn" | "discover";
        acLegs: number;
        multiplus: {
            l1: boolean;
            l2: boolean;
        };
    }, {
        dcCharging?: {
            secondAlternator?: boolean | undefined;
            orionXs?: boolean | undefined;
        } | undefined;
        solar?: {
            enabled?: boolean | undefined;
            primaryArray?: boolean | undefined;
            auxiliaryArray?: boolean | undefined;
        } | undefined;
        batteryManagement?: "victron" | "expion" | "battleborn" | "discover" | undefined;
        acLegs?: number | undefined;
        multiplus?: {
            l1?: boolean | undefined;
            l2?: boolean | undefined;
        } | undefined;
    }>>;
    hvac: z.ZodOptional<z.ZodObject<{
        heating: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            sources: z.ZodDefault<z.ZodObject<{
                diesel: z.ZodDefault<z.ZodBoolean>;
                electric: z.ZodDefault<z.ZodBoolean>;
                engine: z.ZodDefault<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                diesel: boolean;
                electric: boolean;
                engine: boolean;
            }, {
                diesel?: boolean | undefined;
                electric?: boolean | undefined;
                engine?: boolean | undefined;
            }>>;
            distribution: z.ZodDefault<z.ZodObject<{
                floor: z.ZodDefault<z.ZodBoolean>;
                fans: z.ZodDefault<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                floor: boolean;
                fans: boolean;
            }, {
                floor?: boolean | undefined;
                fans?: boolean | undefined;
            }>>;
            hotWater: z.ZodDefault<z.ZodBoolean>;
            auxZone: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            sources: {
                diesel: boolean;
                electric: boolean;
                engine: boolean;
            };
            distribution: {
                floor: boolean;
                fans: boolean;
            };
            hotWater: boolean;
            auxZone: boolean;
        }, {
            enabled?: boolean | undefined;
            sources?: {
                diesel?: boolean | undefined;
                electric?: boolean | undefined;
                engine?: boolean | undefined;
            } | undefined;
            distribution?: {
                floor?: boolean | undefined;
                fans?: boolean | undefined;
            } | undefined;
            hotWater?: boolean | undefined;
            auxZone?: boolean | undefined;
        }>>;
        cooling: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            brand: z.ZodDefault<z.ZodEnum<["", "recpro", "truma", "cruisencomfort"]>>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            brand: "" | "recpro" | "truma" | "cruisencomfort";
        }, {
            enabled?: boolean | undefined;
            brand?: "" | "recpro" | "truma" | "cruisencomfort" | undefined;
        }>>;
        ventilation: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            fans: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            fans: number;
        }, {
            enabled?: boolean | undefined;
            fans?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        heating: {
            enabled: boolean;
            sources: {
                diesel: boolean;
                electric: boolean;
                engine: boolean;
            };
            distribution: {
                floor: boolean;
                fans: boolean;
            };
            hotWater: boolean;
            auxZone: boolean;
        };
        cooling: {
            enabled: boolean;
            brand: "" | "recpro" | "truma" | "cruisencomfort";
        };
        ventilation: {
            enabled: boolean;
            fans: number;
        };
    }, {
        heating?: {
            enabled?: boolean | undefined;
            sources?: {
                diesel?: boolean | undefined;
                electric?: boolean | undefined;
                engine?: boolean | undefined;
            } | undefined;
            distribution?: {
                floor?: boolean | undefined;
                fans?: boolean | undefined;
            } | undefined;
            hotWater?: boolean | undefined;
            auxZone?: boolean | undefined;
        } | undefined;
        cooling?: {
            enabled?: boolean | undefined;
            brand?: "" | "recpro" | "truma" | "cruisencomfort" | undefined;
        } | undefined;
        ventilation?: {
            enabled?: boolean | undefined;
            fans?: number | undefined;
        } | undefined;
    }>>;
    plumbing: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        monitoringSource: z.ZodDefault<z.ZodEnum<["cerbo-gx", "seelevel"]>>;
        count: z.ZodDefault<z.ZodNumber>;
        tanks: z.ZodDefault<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["fresh", "waste", "black"]>;
            name: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "fresh" | "waste" | "black";
            name: string;
        }, {
            type: "fresh" | "waste" | "black";
            name?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        monitoringSource: "cerbo-gx" | "seelevel";
        count: number;
        tanks: {
            type: "fresh" | "waste" | "black";
            name: string;
        }[];
    }, {
        enabled?: boolean | undefined;
        monitoringSource?: "cerbo-gx" | "seelevel" | undefined;
        count?: number | undefined;
        tanks?: {
            type: "fresh" | "waste" | "black";
            name?: string | undefined;
        }[] | undefined;
    }>>;
    accessories: z.ZodOptional<z.ZodObject<{
        keypad: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            count: z.ZodDefault<z.ZodNumber>;
            buttonsPerKeypad: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            count: number;
            buttonsPerKeypad: number;
        }, {
            enabled?: boolean | undefined;
            count?: number | undefined;
            buttonsPerKeypad?: number | undefined;
        }>>;
        awning: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            light: z.ZodDefault<z.ZodBoolean>;
            controlType: z.ZodDefault<z.ZodEnum<["rvc", "analog"]>>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            light: boolean;
            controlType: "rvc" | "analog";
        }, {
            enabled?: boolean | undefined;
            light?: boolean | undefined;
            controlType?: "rvc" | "analog" | undefined;
        }>>;
        slides: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            controlType: z.ZodDefault<z.ZodEnum<["rvc", "analog"]>>;
            keypadSecured: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            controlType: "rvc" | "analog";
            keypadSecured: boolean;
        }, {
            enabled?: boolean | undefined;
            controlType?: "rvc" | "analog" | undefined;
            keypadSecured?: boolean | undefined;
        }>>;
        itcLighting: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            modules: z.ZodDefault<z.ZodNumber>;
            zonesPerModule: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<4>]>>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            modules: number;
            zonesPerModule: 2 | 4;
        }, {
            enabled?: boolean | undefined;
            modules?: number | undefined;
            zonesPerModule?: 2 | 4 | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        keypad: {
            enabled: boolean;
            count: number;
            buttonsPerKeypad: number;
        };
        awning: {
            enabled: boolean;
            light: boolean;
            controlType: "rvc" | "analog";
        };
        slides: {
            enabled: boolean;
            controlType: "rvc" | "analog";
            keypadSecured: boolean;
        };
        itcLighting: {
            enabled: boolean;
            modules: number;
            zonesPerModule: 2 | 4;
        };
    }, {
        keypad?: {
            enabled?: boolean | undefined;
            count?: number | undefined;
            buttonsPerKeypad?: number | undefined;
        } | undefined;
        awning?: {
            enabled?: boolean | undefined;
            light?: boolean | undefined;
            controlType?: "rvc" | "analog" | undefined;
        } | undefined;
        slides?: {
            enabled?: boolean | undefined;
            controlType?: "rvc" | "analog" | undefined;
            keypadSecured?: boolean | undefined;
        } | undefined;
        itcLighting?: {
            enabled?: boolean | undefined;
            modules?: number | undefined;
            zonesPerModule?: 2 | 4 | undefined;
        } | undefined;
    }>>;
    lighting: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        modules: z.ZodDefault<z.ZodNumber>;
        zonesPerModule: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<4>]>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        modules: number;
        zonesPerModule: 2 | 4;
    }, {
        enabled?: boolean | undefined;
        modules?: number | undefined;
        zonesPerModule?: 2 | 4 | undefined;
    }>>>;
    tabs: z.ZodArray<z.ZodObject<{
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
            }>]>, "many">;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            enabled: boolean;
            components: ({
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
                min: number;
                max: number;
                step: number;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
            } | {
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
            } | {
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
            } | {
                id: string;
                type: "multiplus-test-controls";
                label: string;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
                leg?: number | undefined;
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
            } | {
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
            } | {
                id: string;
                type: "multiplus-test-controls";
                label: string;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
                leg?: number | undefined;
            })[];
            type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
            icon?: string | undefined;
            enabled?: boolean | undefined;
            collapsible?: boolean | undefined;
            collapsed?: boolean | undefined;
            imageUrl?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        enabled: boolean;
        sections: {
            id: string;
            title: string;
            enabled: boolean;
            components: ({
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
                min: number;
                max: number;
                step: number;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
            } | {
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
            } | {
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
            } | {
                id: string;
                type: "multiplus-test-controls";
                label: string;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
                leg?: number | undefined;
            })[];
            type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
            icon?: string | undefined;
            collapsible?: boolean | undefined;
            collapsed?: boolean | undefined;
            imageUrl?: string | undefined;
        }[];
        icon?: string | undefined;
        preset?: "switching" | "home" | "lighting" | "power" | "hvac" | "plumbing" | undefined;
    }, {
        id: string;
        title: string;
        sections: {
            id: string;
            title: string;
            components: ({
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
            } | {
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
            } | {
                id: string;
                type: "multiplus-test-controls";
                label: string;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
                leg?: number | undefined;
            })[];
            type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
            icon?: string | undefined;
            enabled?: boolean | undefined;
            collapsible?: boolean | undefined;
            collapsed?: boolean | undefined;
            imageUrl?: string | undefined;
        }[];
        icon?: string | undefined;
        enabled?: boolean | undefined;
        preset?: "switching" | "home" | "lighting" | "power" | "hvac" | "plumbing" | undefined;
    }>, "many">;
    icons: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["svg", "png", "jpg"]>;
        data: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: "svg" | "png" | "jpg";
        data?: string | undefined;
        url?: string | undefined;
    }, {
        id: string;
        type: "svg" | "png" | "jpg";
        data?: string | undefined;
        url?: string | undefined;
    }>, {
        id: string;
        type: "svg" | "png" | "jpg";
        data?: string | undefined;
        url?: string | undefined;
    }, {
        id: string;
        type: "svg" | "png" | "jpg";
        data?: string | undefined;
        url?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: string;
    metadata: {
        name: string;
        version: string;
        description?: string | undefined;
        author?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    };
    tabs: {
        id: string;
        title: string;
        enabled: boolean;
        sections: {
            id: string;
            title: string;
            enabled: boolean;
            components: ({
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
                min: number;
                max: number;
                step: number;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
            } | {
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
            } | {
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
            } | {
                id: string;
                type: "multiplus-test-controls";
                label: string;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
                leg?: number | undefined;
            })[];
            type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
            icon?: string | undefined;
            collapsible?: boolean | undefined;
            collapsed?: boolean | undefined;
            imageUrl?: string | undefined;
        }[];
        icon?: string | undefined;
        preset?: "switching" | "home" | "lighting" | "power" | "hvac" | "plumbing" | undefined;
    }[];
    lighting?: {
        enabled: boolean;
        modules: number;
        zonesPerModule: 2 | 4;
    } | undefined;
    power?: {
        dcCharging: {
            secondAlternator: boolean;
            orionXs: boolean;
        };
        solar: {
            enabled: boolean;
            primaryArray: boolean;
            auxiliaryArray: boolean;
        };
        batteryManagement: "victron" | "expion" | "battleborn" | "discover";
        acLegs: number;
        multiplus: {
            l1: boolean;
            l2: boolean;
        };
    } | undefined;
    hvac?: {
        heating: {
            enabled: boolean;
            sources: {
                diesel: boolean;
                electric: boolean;
                engine: boolean;
            };
            distribution: {
                floor: boolean;
                fans: boolean;
            };
            hotWater: boolean;
            auxZone: boolean;
        };
        cooling: {
            enabled: boolean;
            brand: "" | "recpro" | "truma" | "cruisencomfort";
        };
        ventilation: {
            enabled: boolean;
            fans: number;
        };
    } | undefined;
    plumbing?: {
        enabled: boolean;
        monitoringSource: "cerbo-gx" | "seelevel";
        count: number;
        tanks: {
            type: "fresh" | "waste" | "black";
            name: string;
        }[];
    } | undefined;
    theme?: {
        preset: "green" | "red" | "blue" | "purple" | "orange" | "dark" | "light";
        customColors?: {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
            background?: string | undefined;
            text?: string | undefined;
        } | undefined;
    } | undefined;
    lightingTab?: {
        interior: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        exterior: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        rgb: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
    } | undefined;
    hvacTab?: {
        heating: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        cooling: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        ventilation: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
    } | undefined;
    accessories?: {
        keypad: {
            enabled: boolean;
            count: number;
            buttonsPerKeypad: number;
        };
        awning: {
            enabled: boolean;
            light: boolean;
            controlType: "rvc" | "analog";
        };
        slides: {
            enabled: boolean;
            controlType: "rvc" | "analog";
            keypadSecured: boolean;
        };
        itcLighting: {
            enabled: boolean;
            modules: number;
            zonesPerModule: 2 | 4;
        };
    } | undefined;
    switchingTab?: {
        switches: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        accessories: {
            title: string;
            enabled: boolean;
            icon?: string | undefined;
        };
        customSection?: {
            title: string;
            enabled: boolean;
        } | undefined;
    } | undefined;
    plumbingTab?: {
        switchingSection: {
            title: string;
            enabled: boolean;
        };
    } | undefined;
    hardware?: {
        systemType: "core" | "core-lite";
        outputs: {
            id: string;
            channel: number;
            source: "core" | "core-lite" | "genesis";
            control: "dimmer" | "slider" | "not-used" | "push-button" | "toggle-button" | "half-bridge" | "special-function";
            label?: string | undefined;
            icon?: string | undefined;
            signalId?: number | undefined;
            signals?: {
                toggle?: number | null | undefined;
                momentary?: number | null | undefined;
                dimmer?: number | null | undefined;
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
            default?: number | undefined;
            slider?: number | undefined;
            'push-button'?: number | undefined;
            'toggle-button'?: number | undefined;
        }> | undefined;
    } | undefined;
    icons?: {
        id: string;
        type: "svg" | "png" | "jpg";
        data?: string | undefined;
        url?: string | undefined;
    }[] | undefined;
}, {
    schemaVersion: string;
    metadata: {
        name: string;
        version: string;
        description?: string | undefined;
        author?: string | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    };
    tabs: {
        id: string;
        title: string;
        sections: {
            id: string;
            title: string;
            components: ({
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
            } | {
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
            } | {
                id: string;
                type: "multiplus-test-controls";
                label: string;
                icon?: string | undefined;
                tooltip?: string | undefined;
                disabled?: boolean | undefined;
                visible?: boolean | undefined;
                leg?: number | undefined;
            })[];
            type?: "switching" | "signal-values" | "image" | "mixed" | undefined;
            icon?: string | undefined;
            enabled?: boolean | undefined;
            collapsible?: boolean | undefined;
            collapsed?: boolean | undefined;
            imageUrl?: string | undefined;
        }[];
        icon?: string | undefined;
        enabled?: boolean | undefined;
        preset?: "switching" | "home" | "lighting" | "power" | "hvac" | "plumbing" | undefined;
    }[];
    lighting?: {
        enabled?: boolean | undefined;
        modules?: number | undefined;
        zonesPerModule?: 2 | 4 | undefined;
    } | undefined;
    power?: {
        dcCharging?: {
            secondAlternator?: boolean | undefined;
            orionXs?: boolean | undefined;
        } | undefined;
        solar?: {
            enabled?: boolean | undefined;
            primaryArray?: boolean | undefined;
            auxiliaryArray?: boolean | undefined;
        } | undefined;
        batteryManagement?: "victron" | "expion" | "battleborn" | "discover" | undefined;
        acLegs?: number | undefined;
        multiplus?: {
            l1?: boolean | undefined;
            l2?: boolean | undefined;
        } | undefined;
    } | undefined;
    hvac?: {
        heating?: {
            enabled?: boolean | undefined;
            sources?: {
                diesel?: boolean | undefined;
                electric?: boolean | undefined;
                engine?: boolean | undefined;
            } | undefined;
            distribution?: {
                floor?: boolean | undefined;
                fans?: boolean | undefined;
            } | undefined;
            hotWater?: boolean | undefined;
            auxZone?: boolean | undefined;
        } | undefined;
        cooling?: {
            enabled?: boolean | undefined;
            brand?: "" | "recpro" | "truma" | "cruisencomfort" | undefined;
        } | undefined;
        ventilation?: {
            enabled?: boolean | undefined;
            fans?: number | undefined;
        } | undefined;
    } | undefined;
    plumbing?: {
        enabled?: boolean | undefined;
        monitoringSource?: "cerbo-gx" | "seelevel" | undefined;
        count?: number | undefined;
        tanks?: {
            type: "fresh" | "waste" | "black";
            name?: string | undefined;
        }[] | undefined;
    } | undefined;
    theme?: {
        preset?: "green" | "red" | "blue" | "purple" | "orange" | "dark" | "light" | undefined;
        customColors?: {
            primary?: string | undefined;
            secondary?: string | undefined;
            accent?: string | undefined;
            background?: string | undefined;
            text?: string | undefined;
        } | undefined;
    } | undefined;
    lightingTab?: {
        interior?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        exterior?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        rgb?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    hvacTab?: {
        heating?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        cooling?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        ventilation?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    accessories?: {
        keypad?: {
            enabled?: boolean | undefined;
            count?: number | undefined;
            buttonsPerKeypad?: number | undefined;
        } | undefined;
        awning?: {
            enabled?: boolean | undefined;
            light?: boolean | undefined;
            controlType?: "rvc" | "analog" | undefined;
        } | undefined;
        slides?: {
            enabled?: boolean | undefined;
            controlType?: "rvc" | "analog" | undefined;
            keypadSecured?: boolean | undefined;
        } | undefined;
        itcLighting?: {
            enabled?: boolean | undefined;
            modules?: number | undefined;
            zonesPerModule?: 2 | 4 | undefined;
        } | undefined;
    } | undefined;
    switchingTab?: {
        switches?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        accessories?: {
            icon?: string | undefined;
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
        customSection?: {
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    plumbingTab?: {
        switchingSection?: {
            title?: string | undefined;
            enabled?: boolean | undefined;
        } | undefined;
    } | undefined;
    hardware?: {
        outputs: {
            id: string;
            channel: number;
            source: "core" | "core-lite" | "genesis";
            label?: string | undefined;
            icon?: string | undefined;
            control?: "dimmer" | "slider" | "not-used" | "push-button" | "toggle-button" | "half-bridge" | "special-function" | undefined;
            signalId?: number | undefined;
            signals?: {
                toggle?: number | null | undefined;
                momentary?: number | null | undefined;
                dimmer?: number | null | undefined;
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
            default?: number | undefined;
            slider?: number | undefined;
            'push-button'?: number | undefined;
            'toggle-button'?: number | undefined;
        }> | undefined;
        genesisBoards?: number | undefined;
    } | undefined;
    icons?: {
        id: string;
        type: "svg" | "png" | "jpg";
        data?: string | undefined;
        url?: string | undefined;
    }[] | undefined;
}>;
export type UISchema = z.infer<typeof UISchemaSchema>;
//# sourceMappingURL=index.d.ts.map