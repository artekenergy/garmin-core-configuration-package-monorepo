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
import { SubtabBar } from './components/SubtabBar';
import type { UITabWithDerived, SubtabSpec } from './utils/tabGenerator';
import './styles/tokens.css';
import './styles/responsive.css';

export const App: FunctionComponent = () => {
  console.log('[App] HMI UI App component mounting...');

  // Active tab state
  const activeTabId = useSignal<string | null>(null);
  // Active subtab state - using a map for different tabs
  const activeSubtabId = useSignal<{ [tabId: string]: string }>({});

  // Load schema on mount
  useEffect(function () {
    console.log('[App] Loading schema...');
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

  // Ensure each tab with subtabs has an active subtab selected
  useEffect(
    function () {
      if (!schema) {
        return;
      }

      const currentMap = activeSubtabId.value;
      let nextMap = currentMap;
      let changed = false;

      schema.tabs.forEach(function (tab) {
        const derivedTab = tab as UITabWithDerived;
        const subtabs = derivedTab.uiSubtabs;

        if (!subtabs || subtabs.length === 0) {
          if (Object.prototype.hasOwnProperty.call(currentMap, tab.id)) {
            if (!changed) {
              nextMap = Object.assign({}, currentMap);
              changed = true;
            }
            delete nextMap[tab.id];
          }
          return;
        }

        const current = currentMap[tab.id];
        const currentIsValid =
          current &&
          subtabs.some(function (subtab) {
            return subtab.id === current && subtab.enabled !== false;
          });

        if (!currentIsValid) {
          const fallbackId = getFirstEnabledSubtabId(subtabs);
          if (fallbackId) {
            if (!changed) {
              nextMap = Object.assign({}, currentMap);
              changed = true;
            }
            nextMap[tab.id] = fallbackId;
          }
        }
      });

      if (changed) {
        activeSubtabId.value = nextMap;
      }
    },
    [schema]
  );

  const getFirstEnabledSubtabId = function (subtabs: SubtabSpec[] | undefined): string | undefined {
    if (!subtabs || subtabs.length === 0) {
      return undefined;
    }

    const firstEnabled = subtabs.find(function (subtab) {
      return subtab.enabled !== false;
    });

    if (firstEnabled) {
      return firstEnabled.id;
    }

    return subtabs[0]?.id || subtabs[0]?.id || '';
  };

  const activeTab = schema
    ? (schema.tabs.find(function (tab) {
        return tab.id === activeTabId.value;
      }) as UITabWithDerived | undefined)
    : undefined;

  const activeTabSubtabs = activeTab && activeTab.uiSubtabs ? activeTab.uiSubtabs : [];

  const resolvedSubtabId =
    activeTab && activeTabSubtabs.length > 0
      ? activeSubtabId.value[activeTab.id] || getFirstEnabledSubtabId(activeTabSubtabs)
      : undefined;

  const renderActiveContent = function () {
    if (!activeTab) {
      return null;
    }

    const isHomeTab = activeTab.preset === 'home' || activeTab.id === 'tab-home';

    if (isHomeTab) {
      return <HomeLayout sections={activeTab.sections} />;
    }

    if (activeTabSubtabs.length > 0) {
      if (!resolvedSubtabId) {
        return null;
      }

      const currentSubtab = activeTabSubtabs.find(function (subtab) {
        return subtab.id === resolvedSubtabId;
      });

      if (!currentSubtab) {
        return null;
      }

      const activeSection = activeTab.sections.find(function (section) {
        return section.id === currentSubtab.sectionId && section.enabled !== false;
      });

      if (activeSection) {
        return <Section key={activeSection.id} section={activeSection} hideTitle={true} />;
      }

      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text)' }}>
          No content available for this section
        </div>
      );
    }

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
  };

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
          {activeTab && activeTabSubtabs.length > 0 && resolvedSubtabId && (
            <SubtabBar
              subtabs={activeTabSubtabs}
              activeSubtabId={resolvedSubtabId}
              onSubtabChange={function (subtabId) {
                const currentMap = activeSubtabId.value;
                if (currentMap[activeTab.id] === subtabId) {
                  return;
                }
                const nextMap = Object.assign({}, currentMap);
                nextMap[activeTab.id] = subtabId;
                activeSubtabId.value = nextMap;
              }}
            />
          )}

          {/* Main content area - Fixed viewport, no scrolling */}
          <div
            className="gcg-main-content"
            style={{
              flex: 1,
              overflow: 'hidden',
              padding: '1rem',
            }}
          >
            {renderActiveContent()}
          </div>

          {/* TabBar at bottom */}
          <TabBar
            tabs={schema.tabs}
            activeTabId={activeTabId.value || ''}
            onTabChange={function (tabId) {
              activeTabId.value = tabId;
              if (!schema) {
                return;
              }

              const targetTab = schema.tabs.find(function (tab) {
                return tab.id === tabId;
              }) as UITabWithDerived | undefined;

              if (!targetTab || !targetTab.uiSubtabs || targetTab.uiSubtabs.length === 0) {
                const currentMap = activeSubtabId.value;
                if (Object.prototype.hasOwnProperty.call(currentMap, tabId)) {
                  const nextMap = Object.assign({}, currentMap);
                  delete nextMap[tabId];
                  activeSubtabId.value = nextMap;
                }
                return;
              }

              const fallbackId = getFirstEnabledSubtabId(targetTab.uiSubtabs);
              if (!fallbackId) {
                return;
              }

              const currentMap = activeSubtabId.value;
              if (currentMap[tabId] === fallbackId) {
                return;
              }

              const nextMap = Object.assign({}, currentMap);
              nextMap[tabId] = fallbackId;
              activeSubtabId.value = nextMap;
            }}
          />
        </div>
      )}
    </div>
  );
};
