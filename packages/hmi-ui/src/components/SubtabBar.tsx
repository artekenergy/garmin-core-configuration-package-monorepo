/**
 * SubtabBar Component
 *
 * Secondary navigation bar for subtabs within a main tab (e.g., Interior/Exterior/RGB in Lighting).
 * Displays horizontally below the StatusBar when active.
 *
 * ES2017 compliant.
 */

export interface SubtabConfig {
  id: string;
  title: string;
  icon?: string;
  enabled: boolean;
}

export interface SubtabBarProps {
  subtabs: SubtabConfig[];
  activeSubtabId: string;
  onSubtabChange: (subtabId: string) => void;
}

export function SubtabBar(props: SubtabBarProps) {
  const { subtabs, activeSubtabId, onSubtabChange } = props;

  // Filter to only enabled subtabs
  const enabledSubtabs = subtabs.filter(function (subtab) {
    return subtab.enabled !== false;
  });

  // Don't render if no subtabs or only one subtab
  if (enabledSubtabs.length <= 1) {
    return null;
  }

  return (
    <nav className="gcg-subtab-bar">
      {enabledSubtabs.map(function (subtab) {
        const isActive = subtab.id === activeSubtabId;
        const className = isActive
          ? 'gcg-subtab-bar__item gcg-subtab-bar__item--active'
          : 'gcg-subtab-bar__item';

        return (
          <button
            key={subtab.id}
            type="button"
            className={className}
            onClick={function () {
              onSubtabChange(subtab.id);
            }}
            aria-label={subtab.title}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Icon (emoji or SVG) */}
            {subtab.icon && (
              <span className="gcg-subtab-bar__icon" aria-hidden="true">
                {subtab.icon}
              </span>
            )}

            {/* Title */}
            <span className="gcg-subtab-bar__title">{subtab.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
