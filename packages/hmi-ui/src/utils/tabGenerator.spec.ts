import { describe, expect, it } from 'vitest';
import type { UISchema } from '@gcg/schema';
import { regenerateTabContent, type UITabWithDerived } from './tabGenerator';

describe('tabGenerator', () => {
  it('mirrors subtab enabled state onto derived subtabs and sections', () => {
    const schema: UISchema = {
      schemaVersion: '1.0.0',
      metadata: {
        name: 'Test Schema',
        version: '1.0.0',
      },
      tabs: [
        {
          id: 'tab-lighting',
          title: 'Lighting',
          preset: 'lighting',
          enabled: true,
          sections: [
            {
              id: 'section-lighting-interior',
              title: 'Interior',
              enabled: true,
              components: [],
            },
            {
              id: 'section-lighting-exterior',
              title: 'Exterior',
              enabled: true,
              components: [],
            },
            {
              id: 'section-lighting-rgb',
              title: 'RGB',
              enabled: true,
              components: [],
            },
          ],
        },
      ],
      lightingTab: {
        interior: { enabled: true, title: 'Interior', icon: 'icon-interior' },
        exterior: { enabled: false, title: 'Exterior', icon: 'icon-exterior' },
        rgb: { enabled: true, title: 'RGB', icon: 'icon-rgb' },
      },
    };

    const derived = regenerateTabContent(schema);
    const lightingTab = derived.tabs.find(function (tab) {
      return tab.id === 'tab-lighting';
    }) as UITabWithDerived | undefined;

    expect(lightingTab).toBeDefined();
    expect(lightingTab?.uiSubtabs).toBeDefined();

    const exteriorSubtab = lightingTab?.uiSubtabs?.find(function (subtab) {
      return subtab.id === 'exterior';
    });
    expect(exteriorSubtab?.enabled).toBe(false);

    const exteriorSection = lightingTab?.sections.find(function (section) {
      return section.id === 'section-lighting-exterior';
    });
    expect(exteriorSection?.enabled).toBe(false);
  });
});
