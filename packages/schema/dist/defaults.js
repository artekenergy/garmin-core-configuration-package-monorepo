export function createDefaultUISchema() {
    const now = new Date().toISOString();
    return {
        schemaVersion: '0.1.0',
        metadata: {
            name: 'New HMI Configuration',
            version: '1.0.0',
            description: 'Created with Garmin Core Graphics Configurator',
            author: '',
            createdAt: now,
            updatedAt: now,
        },
        hardware: {
            systemType: 'core',
            outputs: [],
            halfBridgePairs: [],
            signalMap: {},
            genesisBoards: 0,
        },
        tabs: [
            {
                id: 'tab-home',
                title: 'Home',
                preset: 'home',
                enabled: true,
                sections: [
                    { id: 'section-home-1', title: 'Quick Controls', enabled: false, components: [] },
                    { id: 'section-home-2', title: 'Status', enabled: false, components: [] },
                ],
            },
            {
                id: 'tab-power',
                title: 'Power',
                preset: 'power',
                enabled: false,
                sections: [
                    { id: 'section-power', title: 'Power Status', enabled: false, components: [] },
                ],
            },
        ],
    };
}
//# sourceMappingURL=defaults.js.map