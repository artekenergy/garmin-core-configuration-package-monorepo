import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { schemaSignal, isLoadingSignal, errorSignal } from './state/schema-signal';
import { loadSchema } from './utils/schema-loader';
import { registerIcons } from './utils/icon-registry';
import { Section } from './components/Section';
import { HomeLayout } from './components/HomeLayout';
import { StatusBar } from './components/StatusBar';
import { TabBar } from './components/TabBar';
import { SubtabBar, SubtabConfig } from './components/SubtabBar';
import './styles/tokens.css';
import './styles/responsive.css';

export const App: FunctionComponent = () => {
  // Active tab state
  const activeTabId = useSignal<string | null>(null);
  // Active subtab state - using a map for different tabs
  const activeSubtabId = useSignal<{ [tabId: string]: string }>({
    'tab-lighting': 'interior',
    'tab-hvac': 'heating',
    'tab-switching': 'switches',
  });

  // Load schema on mount
  useEffect(function () {
    loadSchema();
  }, []);

  const schema = schemaSignal.value;
  const isLoading = isLoadingSignal.value;
  const error = errorSignal.value;

  // Load icons from schema into registry
  useEffect(
    function () {
      if (schema && schema.icons) {
        registerIcons(schema.icons);
      }
    },
    [schema]
  );

  // Apply theme from schema to data attribute and custom colors
  useEffect(
    function () {
      if (schema && schema.theme) {
        const theme = schema.theme;
        const root = document.documentElement;

        // Apply theme preset via data attribute (if present)
        if (theme.preset) {
          root.setAttribute('data-theme', theme.preset);
        } else {
          // Default to blue if no preset
          root.setAttribute('data-theme', 'blue');
        }

        // Apply custom color overrides (if present)
        if (theme.customColors) {
          if (theme.customColors.primary) {
            root.style.setProperty('--color-primary', theme.customColors.primary);
          }
          if (theme.customColors.secondary) {
            root.style.setProperty('--color-secondary', theme.customColors.secondary);
          }
          if (theme.customColors.accent) {
            root.style.setProperty('--color-accent', theme.customColors.accent);
          }
          if (theme.customColors.background) {
            root.style.setProperty('--color-bg', theme.customColors.background);
          }
          if (theme.customColors.text) {
            root.style.setProperty('--color-text', theme.customColors.text);
          }
        }
      } else {
        // No theme in schema - use default
        document.documentElement.setAttribute('data-theme', 'blue');
      }
    },
    [schema]
  );

  // Set initial active tab when schema loads
  useEffect(
    function () {
      if (schema && schema.tabs && schema.tabs.length > 0 && !activeTabId.value) {
        const firstEnabledTab = schema.tabs.find(function (tab) {
          return tab.enabled !== false;
        });
        if (firstEnabledTab) {
          activeTabId.value = firstEnabledTab.id;
        }
      }
    },
    [schema]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      {/* Loading State */}
      {isLoading && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              marginBottom: '1rem',
            }}
          >
            ⏳
          </div>
          <h2
            style={{
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
              color: '#e2e8f0',
            }}
          >
            Loading Schema...
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Fetching and validating configuration
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              marginBottom: '1rem',
            }}
          >
            ❌
          </div>
          <h2
            style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#fca5a5',
            }}
          >
            Schema Load Error
          </h2>
          <p
            style={{
              color: '#fca5a5',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '4px',
              wordBreak: 'break-word',
            }}
          >
            {error}
          </p>
          <button
            onClick={function () {
              loadSchema();
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Success State - Schema Loaded */}
      {schema && !isLoading && !error && (
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Status Bar at top */}
          <StatusBar
            leftInfo="INTERIOR: 72°F"
            centerInfo="EXTERIOR: 65°F"
            rightInfo="TIME TO GO: 3:42"
          />

          {/* Subtab Bar (for tabs with subtab support) */}
          {(function () {
            const activeTab = schema.tabs.find(function (tab) {
              return tab.id === activeTabId.value;
            });

            if (!activeTab) {
              return null;
            }

            const tabId = activeTab.id;
            const isLightingTab =
              activeTab.preset === 'lighting' || activeTab.id === 'tab-lighting';
            const isHVACTab = activeTab.preset === 'hvac' || activeTab.id === 'tab-hvac';
            const isSwitchingTab =
              activeTab.preset === 'switching' || activeTab.id === 'tab-switching';

            let subtabs: SubtabConfig[] = [];

            // Build subtabs for Lighting tab
            if (isLightingTab && schema.lightingTab) {
              const lightingConfig = schema.lightingTab;
              subtabs = [
                {
                  id: 'interior',
                  title: lightingConfig.interior.title,
                  icon: lightingConfig.interior.icon,
                  enabled: lightingConfig.interior.enabled,
                },
                {
                  id: 'exterior',
                  title: lightingConfig.exterior.title,
                  icon: lightingConfig.exterior.icon,
                  enabled: lightingConfig.exterior.enabled,
                },
                {
                  id: 'rgb',
                  title: lightingConfig.rgb.title,
                  icon: lightingConfig.rgb.icon,
                  enabled: lightingConfig.rgb.enabled,
                },
              ];
            }

            // Build subtabs for HVAC tab
            if (isHVACTab && schema.hvacTab) {
              const hvacConfig = schema.hvacTab;
              subtabs = [
                {
                  id: 'heating',
                  title: hvacConfig.heating.title,
                  icon: hvacConfig.heating.icon,
                  enabled: hvacConfig.heating.enabled,
                },
                {
                  id: 'cooling',
                  title: hvacConfig.cooling.title,
                  icon: hvacConfig.cooling.icon,
                  enabled: hvacConfig.cooling.enabled,
                },
                {
                  id: 'ventilation',
                  title: hvacConfig.ventilation.title,
                  icon: hvacConfig.ventilation.icon,
                  enabled: hvacConfig.ventilation.enabled,
                },
              ];
            }

            // Build subtabs for Switching tab
            if (isSwitchingTab && schema.switchingTab) {
              const switchingConfig = schema.switchingTab;
              subtabs = [
                {
                  id: 'switches',
                  title: switchingConfig.switches.title,
                  icon: switchingConfig.switches.icon,
                  enabled: switchingConfig.switches.enabled,
                },
                {
                  id: 'accessories',
                  title: switchingConfig.accessories.title,
                  icon: switchingConfig.accessories.icon,
                  enabled: switchingConfig.accessories.enabled,
                },
              ];
            }

            if (subtabs.length === 0) {
              return null;
            }

            // Get current active subtab for this tab
            const currentSubtab = activeSubtabId.value[tabId] || (subtabs[0] && subtabs[0].id);

            if (!currentSubtab) {
              return null;
            }

            return (
              <SubtabBar
                subtabs={subtabs}
                activeSubtabId={currentSubtab}
                onSubtabChange={function (subtabId) {
                  const newState = Object.assign({}, activeSubtabId.value);
                  newState[tabId] = subtabId;
                  activeSubtabId.value = newState;
                }}
              />
            );
          })()}

          {/* Main content area - Fixed viewport, no scrolling */}
          <div
            className="gcg-main-content"
            style={{
              flex: 1,
              overflow: 'hidden',
              padding: '1rem',
            }}
          >
            {(function () {
              const activeTab = schema.tabs.find(function (tab) {
                return tab.id === activeTabId.value;
              });

              if (!activeTab) {
                return null;
              }

              // Check if this is the Home tab (special layout)
              const isHomeTab = activeTab.preset === 'home' || activeTab.id === 'tab-home';

              if (isHomeTab) {
                // Home tab: 1 section = full width, 2 sections = side-by-side
                return <HomeLayout sections={activeTab.sections} />;
              }

              // Check if this is the Lighting tab (subtab filtering)
              const isLightingTab =
                activeTab.preset === 'lighting' || activeTab.id === 'tab-lighting';
              const isHVACTab = activeTab.preset === 'hvac' || activeTab.id === 'tab-hvac';
              const isSwitchingTab =
                activeTab.preset === 'switching' || activeTab.id === 'tab-switching';

              const hasSubtabs = isLightingTab || isHVACTab || isSwitchingTab;

              if (hasSubtabs) {
                // Get current active subtab for this tab
                const currentSubtab = activeSubtabId.value[activeTab.id];

                // If no subtab is set, skip rendering (will be set by SubtabBar)
                if (!currentSubtab) {
                  return null;
                }

                let subtabSectionMap: { [key: string]: string } = {};

                // Map subtabs to section IDs/prefixes based on tab type
                if (isLightingTab) {
                  subtabSectionMap = {
                    interior: 'section-lighting-interior',
                    exterior: 'section-lighting-exterior',
                    rgb: 'section-lighting-rgb',
                  };
                } else if (isHVACTab) {
                  // Each subtab maps to its own section
                  subtabSectionMap = {
                    heating: 'section-hvac-heating',
                    cooling: 'section-hvac-cooling',
                    ventilation: 'section-hvac-ventilation',
                  };
                } else if (isSwitchingTab) {
                  subtabSectionMap = {
                    switches: 'section-switching-switches',
                    accessories: 'section-switching-accessories',
                  };
                }

                // All subtab tabs use exact section ID matching
                const targetSectionId = subtabSectionMap[currentSubtab];
                const activeSection = activeTab.sections.find(function (section) {
                  return section.id === targetSectionId && section.enabled !== false;
                });

                if (activeSection) {
                  return (
                    <Section key={activeSection.id} section={activeSection} hideTitle={true} />
                  );
                }

                return (
                  <div
                    style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)' }}
                  >
                    No content available for this section
                  </div>
                );
              }

              // Regular tabs: Stack sections vertically (filter enabled only)
              const enabledSections = activeTab.sections.filter(function (section) {
                return section.enabled !== false;
              });

              return (
                <div>
                  {enabledSections.map(function (section) {
                    return <Section key={section.id} section={section} />;
                  })}
                </div>
              );
            })()}
          </div>

          {/* TabBar at bottom */}
          <TabBar
            tabs={schema.tabs}
            activeTabId={activeTabId.value || ''}
            onTabChange={function (tabId) {
              activeTabId.value = tabId;
              // No need to reset subtab - it's managed per tab in the map
            }}
          />
        </div>
      )}
    </div>
  );
};
