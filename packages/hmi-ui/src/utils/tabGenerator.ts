import type { UISchema, Tab, Section, SubtabConfig } from '@gcg/schema';

export type SubtabSpec = {
  id: string;
  title: string;
  icon?: string;
  enabled: boolean;
  sectionId: string;
};

export type UITabWithDerived = Tab & {
  uiSubtabs?: SubtabSpec[];
};

export type UISchemaWithDerived = Omit<UISchema, 'tabs'> & {
  tabs: UITabWithDerived[];
};

function cloneSchema(schema: UISchema): UISchema {
  if (typeof structuredClone === 'function') {
    return structuredClone(schema);
  }
  return JSON.parse(JSON.stringify(schema)) as UISchema;
}

function ensureSection(tab: UITabWithDerived, id: string, title: string): Section {
  let existing = tab.sections.find(function (section) {
    return section.id === id;
  });

  if (!existing) {
    existing = {
      id,
      title,
      enabled: false,
      components: [],
    };
    tab.sections.push(existing);
    return existing;
  }

  if (!existing.title) {
    existing.title = title;
  }

  return existing;
}

function applyLightingConfig(tab: UITabWithDerived, schema: UISchema) {
  const lighting = schema.lightingTab;

  if (!lighting) {
    return;
  }

  const interior = ensureSection(
    tab,
    'section-lighting-interior',
    lighting.interior.title || 'Interior Lights'
  );
  interior.title = lighting.interior.title || interior.title;
  interior.enabled = Boolean(lighting.interior.enabled);

  const exterior = ensureSection(
    tab,
    'section-lighting-exterior',
    lighting.exterior.title || 'Exterior Lights'
  );
  exterior.title = lighting.exterior.title || exterior.title;
  exterior.enabled = Boolean(lighting.exterior.enabled);

  const rgb = ensureSection(
    tab,
    'section-lighting-rgb',
    lighting.rgb.title || 'RGB Lighting'
  );
  rgb.title = lighting.rgb.title || rgb.title;
  rgb.enabled = Boolean(lighting.rgb.enabled);

  tab.uiSubtabs = [
    createSubtab('interior', lighting.interior, 'section-lighting-interior'),
    createSubtab('exterior', lighting.exterior, 'section-lighting-exterior'),
    createSubtab('rgb', lighting.rgb, 'section-lighting-rgb'),
  ];
}

function applyHVACConfig(tab: UITabWithDerived, schema: UISchema) {
  const hvac = schema.hvacTab;

  if (!hvac) {
    return;
  }

  const heating = ensureSection(
    tab,
    'section-hvac-heating',
    hvac.heating.title || 'Heating'
  );
  heating.title = hvac.heating.title || heating.title;
  heating.enabled = Boolean(hvac.heating.enabled);

  const cooling = ensureSection(
    tab,
    'section-hvac-cooling',
    hvac.cooling.title || 'Cooling'
  );
  cooling.title = hvac.cooling.title || cooling.title;
  cooling.enabled = Boolean(hvac.cooling.enabled);

  const ventilation = ensureSection(
    tab,
    'section-hvac-ventilation',
    hvac.ventilation.title || 'Ventilation'
  );
  ventilation.title = hvac.ventilation.title || ventilation.title;
  ventilation.enabled = Boolean(hvac.ventilation.enabled);

  tab.uiSubtabs = [
    createSubtab('heating', hvac.heating, 'section-hvac-heating'),
    createSubtab('cooling', hvac.cooling, 'section-hvac-cooling'),
    createSubtab('ventilation', hvac.ventilation, 'section-hvac-ventilation'),
  ];
}

function applySwitchingConfig(tab: UITabWithDerived, schema: UISchema) {
  const switching = schema.switchingTab;

  if (!switching) {
    return;
  }

  const switches = ensureSection(
    tab,
    'section-switching-switches',
    switching.switches.title || 'Switches'
  );
  switches.title = switching.switches.title || switches.title;
  switches.enabled = Boolean(switching.switches.enabled);

  const accessories = ensureSection(
    tab,
    'section-switching-accessories',
    switching.accessories.title || 'Accessories'
  );
  accessories.title = switching.accessories.title || accessories.title;
  accessories.enabled = Boolean(switching.accessories.enabled);

  tab.uiSubtabs = [
    createSubtab('switches', switching.switches, 'section-switching-switches'),
    createSubtab('accessories', switching.accessories, 'section-switching-accessories'),
  ];
}

function createSubtab(id: string, config: SubtabConfig, sectionId: string): SubtabSpec {
  return {
    id,
    sectionId,
    title: config.title,
    icon: config.icon,
    enabled: Boolean(config.enabled),
  };
}

export function regenerateTabContent(input: UISchema): UISchemaWithDerived {
  const schema = cloneSchema(input) as UISchemaWithDerived;

  schema.tabs = schema.tabs.map(function (tab) {
    const derivedTab: UITabWithDerived = {
      ...tab,
      sections: tab.sections ? tab.sections.slice() : [],
    };

    delete derivedTab.uiSubtabs;

    const preset = tab.preset || tab.id;

    if (preset === 'lighting' || tab.id === 'tab-lighting') {
      applyLightingConfig(derivedTab, schema);
    } else if (preset === 'hvac' || tab.id === 'tab-hvac') {
      applyHVACConfig(derivedTab, schema);
    } else if (preset === 'switching' || tab.id === 'tab-switching') {
      applySwitchingConfig(derivedTab, schema);
    }

    return derivedTab;
  });

  return schema;
}
