/**
 * StatusBar Component
 *
 * Top header bar displaying system status information.
 * Clean, minimal design matching reference layout.
 *
 * ES2017 compliant.
 */

export interface StatusBarProps {
  leftInfo?: string;
  centerInfo?: string;
  rightInfo?: string;
}

export function StatusBar(props: StatusBarProps) {
  const { leftInfo, centerInfo, rightInfo } = props;

  return (
    <div className="gcg-status-bar">
      <div className="gcg-status-bar__content">
        {/* Left section */}
        <div className="gcg-status-bar__section gcg-status-bar__section--left">
          {leftInfo || 'INTERIOR: --'}
        </div>

        {/* Center section */}
        <div className="gcg-status-bar__section gcg-status-bar__section--center">
          {centerInfo || 'EXTERIOR: --'}
        </div>

        {/* Right section */}
        <div className="gcg-status-bar__section gcg-status-bar__section--right">
          {rightInfo || 'TIME TO GO: --'}
        </div>
      </div>

      {/* Horizontal divider line */}
      <div className="gcg-status-bar__divider" />
    </div>
  );
}
