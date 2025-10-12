/**
 * TabBar Component
 *
 * Bottom navigation bar.
 * Displays tabs from schema with icon support.
 *
 * ES2017 compliant.
 */

import type { Tab } from '@gcg/schema';
import { Icon } from './Icon';

export interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

export function TabBar(props: TabBarProps) {
  const { tabs, activeTabId, onTabChange } = props;

  // Filter to only enabled tabs
  const enabledTabs = tabs.filter(function (tab) {
    return tab.enabled !== false;
  });

  return (
    <nav className="gcg-tab-bar">
      {enabledTabs.map(function (tab) {
        const isActive = tab.id === activeTabId;
        const className = isActive
          ? 'gcg-tab-bar__item gcg-tab-bar__item--active'
          : 'gcg-tab-bar__item';

        return (
          <button
            key={tab.id}
            type="button"
            className={className}
            onClick={function () {
              onTabChange(tab.id);
            }}
            aria-label={tab.title}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Icon - resolved from registry or fallback to preset */}
            <div className="gcg-tab-bar__icon">
              <Icon iconId={tab.icon} preset={tab.preset} size="md" />
            </div>

            {/* Label - optional, can be hidden on small screens */}
            <span className="gcg-tab-bar__label">{tab.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
