/**
 * Toggle Component
 *
 * Binary on/off switch for controlling outputs (lights, pumps, fans).
 * Supports multiple visual variants: default switch, round button, checkbox.
 *
 * WebSocket Behavior:
 * - User clicks: Sends press (1) + release (0) with 75ms delay
 * - Display state: Shows actual hardware state from Type 16 Cmd 1 subscription
 * - No optimistic UI: Only updates when hardware confirms state change
 *
 * ES2017 compliant - no optional chaining or nullish coalescing.
 */

import { useComputed } from '@preact/signals';
import type { ToggleComponent } from '@gcg/schema';
import { getWebSocketAdapter } from '../state/websocket-state';
import { createToggleMessage, resolveBindingToChannelId } from '../utils/binding-resolver';
import { getSignalState, type ToggleState } from '../state/signal-state';
import { schemaSignal } from '../state/schema-signal';

interface ToggleProps {
  component: ToggleComponent;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Toggle(props: ToggleProps) {
  const { component, value, onChange } = props;

  // 1. RESOLVE SIGNAL ID
  // Convert channel reference (e.g., "core-12") to numeric signal ID
  let signalId: number | null = null;
  let staticValue: boolean | null = null;

  if (component.bindings && component.bindings.state) {
    const binding = component.bindings.state;

    // Handle static binding (for testing)
    if (binding.type === 'static') {
      staticValue = binding.value as boolean;
    } else {
      // Handle empirbus/nmea2000 bindings
      signalId = resolveBindingToChannelId(binding, 'toggle');
    }
  }

  // 2. RESOLVE ICON DATA
  let iconSvg: string | null = null;
  if (component.icon && schemaSignal.value && schemaSignal.value.icons) {
    const iconDef = schemaSignal.value.icons.find(function (icon) {
      return icon.id === component.icon;
    });
    if (iconDef && iconDef.data) {
      iconSvg = iconDef.data;
    }
  }

  // 3. SUBSCRIBE TO SIGNAL STATE
  // Get reactive signal that updates when WebSocket receives Type 16 Cmd 1 messages
  const signalState = signalId !== null ? getSignalState(signalId) : null;

  // 3. COMPUTE CURRENT STATE
  // Prefer hardware state from subscription, then static value, then props, default to false
  const isOn = useComputed(function () {
    // First priority: Hardware state from WebSocket
    if (signalState && signalState.value) {
      const state = signalState.value.value as ToggleState;
      if (state && typeof state.state === 'boolean') {
        return state.state;
      }
    }
    // Second priority: Static binding value
    if (staticValue !== null) {
      return staticValue;
    }
    // Third priority: Props for testing without WebSocket
    if (typeof value === 'boolean') {
      return value;
    }
    // Default
    return false;
  });

  // 4. HANDLE USER INTERACTION
  const handleClick = function () {
    const currentValue = isOn.value;

    console.log(
      '[Toggle]',
      component.label,
      '- Click - Current state:',
      currentValue,
      'SignalID:',
      signalId
    );

    // Send WebSocket command if binding exists
    if (signalId !== null) {
      const wsAdapter = getWebSocketAdapter();
      if (wsAdapter && wsAdapter.isConnected()) {
        // Send button press (1)
        const pressMessage = createToggleMessage(signalId, true);
        console.log('[Toggle]', component.label, '- Sending press (1)');
        wsAdapter.send(pressMessage);

        // Send button release (0) after 75ms to simulate physical button press
        // The actual toggle state will come from subscription feedback
        setTimeout(function () {
          const releaseMessage = createToggleMessage(signalId, false);
          console.log('[Toggle]', component.label, '- Sending release (0)');
          wsAdapter.send(releaseMessage);
        }, 75);
      } else {
        console.warn('[Toggle]', component.label, '- WebSocket not connected');
      }
    } else {
      console.warn('[Toggle]', component.label, '- No signal ID configured');
    }

    // Call optional onChange callback (for testing/external handlers)
    if (onChange) {
      onChange(!currentValue);
    }
  };

  // 5. BUILD CSS CLASSES
  const variant = component.variant || 'default';
  const baseClass = 'gcg-toggle';
  const variantClass = baseClass + '--' + variant;
  const stateClass = isOn.value ? baseClass + '--on' : baseClass + '--off';
  const disabledClass = component.disabled ? baseClass + '--disabled' : '';

  const className = [baseClass, variantClass, stateClass, disabledClass]
    .filter(function (cls) {
      return cls;
    })
    .join(' ');

  // 6. RENDER COMPONENT
  return (
    <div className="gcg-component-wrapper">
      <button
        type="button"
        className={className}
        onClick={handleClick}
        disabled={component.disabled}
        aria-pressed={isOn.value}
        aria-label={component.label}
        title={component.tooltip}
      >
        {/* Switch variants (default, switch) */}
        {(variant === 'default' || variant === 'switch') && (
          <>
            <div className="gcg-toggle__track">
              <div className="gcg-toggle__thumb" />
            </div>
            <span className="gcg-toggle__label">{component.label}</span>
          </>
        )}

        {/* Round variant - icon OR "ON/OFF" text inside button */}
        {variant === 'round' && (
          <>
            {iconSvg ? (
              <div className="gcg-toggle__icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />
            ) : (
              <span className="gcg-toggle__text">ON/OFF</span>
            )}
          </>
        )}

        {/* Checkbox variant */}
        {variant === 'checkbox' && (
          <>
            <div className="gcg-toggle__checkbox">
              <svg
                className="gcg-toggle__checkmark"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline
                  points="20 6 9 17 4 12"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="gcg-toggle__label">{component.label}</span>
          </>
        )}
      </button>

      {/* Label below button for round variant */}
      {variant === 'round' && component.label && (
        <div className="gcg-component-label">{component.label}</div>
      )}

      {/* Tooltip text below component */}
      {component.tooltip && <div className="gcg-component-tooltip">{component.tooltip}</div>}
    </div>
  );
}
