/**
 * MultiplusControl Component
 *
 * Composite control for Victron Multiplus inverter/charger.
 * Displays AC voltage/current readings and mode control buttons (Off/On/Charger Only).
 *
 * Layout:
 * ┌─────────────────────────────┐
 * │  AC IN: 120V  │  AC OUT: 118V│
 * │  CURRENT: 15A │  OUTPUT: 12A │
 * ├─────────────────────────────┤
 * │  [Off] [On] [Charger Only]  │
 * └─────────────────────────────┘
 *
 * ES2017 compliant.
 */

import { useSignal } from '@preact/signals';
import type { MultiplusControlComponent } from '@gcg/schema';
import { getWebSocketAdapter } from '../state/websocket-state';
import { createToggleMessage, resolveBindingToChannelId } from '../utils/binding-resolver';
import './MultiplusControl.css';

interface MultiplusControlProps {
  component: MultiplusControlComponent;
}

type MultiplusMode = 'off' | 'on' | 'charger-only';

export function MultiplusControl(props: MultiplusControlProps) {
  const { component } = props;

  // State for readings
  const acInVoltage = useSignal<number | null>(null);
  const acOutVoltage = useSignal<number | null>(null);
  const acOutCurrent = useSignal<number | null>(null);
  const currentMode = useSignal<MultiplusMode>('off');

  // Handle mode button clicks
  const handleModeClick = function (mode: MultiplusMode) {
    const ws = getWebSocketAdapter();
    if (!ws || !ws.isConnected() || !component.bindings) {
      console.warn('[MultiplusControl] WebSocket not available');
      return;
    }

    let binding;

    if (mode === 'off' && component.bindings.modeOff) {
      binding = component.bindings.modeOff;
    } else if (mode === 'on' && component.bindings.modeOn) {
      binding = component.bindings.modeOn;
    } else if (mode === 'charger-only' && component.bindings.modeChargerOnly) {
      binding = component.bindings.modeChargerOnly;
    }

    if (!binding) {
      console.warn('[MultiplusControl] No binding for mode:', mode);
      return;
    }

    // Resolve binding to channel ID
    const channelId = resolveBindingToChannelId(binding, 'momentary');
    if (channelId === null) {
      console.warn('[MultiplusControl] Could not resolve binding to channel ID');
      return;
    }

    // Send momentary press (value=true for pressed)
    const pressMessage = createToggleMessage(channelId, true);
    ws.send(pressMessage);
    console.log('[MultiplusControl] Mode:', mode, 'Press (1) ChannelID:', channelId);

    // Send release after 100ms (value=false for released)
    setTimeout(function () {
      const releaseMessage = createToggleMessage(channelId, false);
      ws.send(releaseMessage);
      console.log('[MultiplusControl] Mode:', mode, 'Release (0) ChannelID:', channelId);
    }, 100);

    // Update local state
    currentMode.value = mode;
  };

  const leg = component.leg || 1;

  return (
    <div className="gcg-component-wrapper">
      <div className="gcg-multiplus-control">
        {/* Header */}
        <div className="gcg-multiplus-control__header">
          <span className="gcg-multiplus-control__label">
            {component.label || 'Multiplus L' + leg}
          </span>
        </div>

        {/* Readings Grid */}
        <div className="gcg-multiplus-control__readings">
          <div className="gcg-multiplus-control__reading">
            <span className="gcg-multiplus-control__reading-label">AC IN</span>
            <span className="gcg-multiplus-control__reading-value">
              {acInVoltage.value !== null ? acInVoltage.value.toFixed(0) + 'V' : '--'}
            </span>
          </div>

          <div className="gcg-multiplus-control__reading">
            <span className="gcg-multiplus-control__reading-label">AC OUT</span>
            <span className="gcg-multiplus-control__reading-value">
              {acOutVoltage.value !== null ? acOutVoltage.value.toFixed(0) + 'V' : '--'}
            </span>
          </div>

          <div className="gcg-multiplus-control__reading gcg-multiplus-control__reading--wide">
            <span className="gcg-multiplus-control__reading-label">CURRENT</span>
            <span className="gcg-multiplus-control__reading-value">
              {acOutCurrent.value !== null ? acOutCurrent.value.toFixed(1) + 'A' : '--'}
            </span>
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="gcg-multiplus-control__modes">
          <button
            type="button"
            className={
              'gcg-multiplus-control__mode-button' +
              (currentMode.value === 'off' ? ' gcg-multiplus-control__mode-button--active' : '')
            }
            onClick={function () {
              handleModeClick('off');
            }}
            aria-label="Turn Multiplus Off"
          >
            OFF
          </button>

          <button
            type="button"
            className={
              'gcg-multiplus-control__mode-button' +
              (currentMode.value === 'on' ? ' gcg-multiplus-control__mode-button--active' : '')
            }
            onClick={function () {
              handleModeClick('on');
            }}
            aria-label="Turn Multiplus On"
          >
            ON
          </button>

          <button
            type="button"
            className={
              'gcg-multiplus-control__mode-button' +
              (currentMode.value === 'charger-only'
                ? ' gcg-multiplus-control__mode-button--active'
                : '')
            }
            onClick={function () {
              handleModeClick('charger-only');
            }}
            aria-label="Charger Only Mode"
          >
            CHARGER
          </button>
        </div>
      </div>
    </div>
  );
}
