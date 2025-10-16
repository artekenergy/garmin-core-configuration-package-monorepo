/**
 * Multiplus Test Controls
 *
 * Quick test controls for Multiplus mode switching.
 * Displays three buttons: OFF, ON, CHARGER ONLY
 *
 * ES2017 compliant.
 */

import { getWebSocketAdapter } from '../state/websocket-state';
import { createToggleMessage, resolveBindingToChannelId } from '../utils/binding-resolver';
import './MultiplusTestControls.css';

interface MultiplusTestControlsProps {
  leg?: number;
}

export function MultiplusTestControls(props: MultiplusTestControlsProps) {
  const leg = props.leg || 1;

  const handleModeClick = function (mode: 'off' | 'on' | 'charger-only') {
    const ws = getWebSocketAdapter();
    if (!ws || !ws.isConnected()) {
      console.warn('[MultiplusTestControls] WebSocket not connected');
      return;
    }

    // Map modes to signal channel names
    const channelMap: Record<string, string> = {
      off: 'press-multiplus-off',
      on: 'press-multi-on',
      'charger-only': 'press-multiplus-charger-only',
    };

    const channelName = channelMap[mode];
    if (!channelName) {
      console.warn('[MultiplusTestControls] Invalid mode:', mode);
      return;
    }

    // Create binding object
    const binding = {
      type: 'empirbus' as const,
      channel: channelName,
      property: 'state' as const,
    };

    // Resolve to channel ID
    const channelId = resolveBindingToChannelId(binding, 'momentary');
    if (channelId === null) {
      console.warn('[MultiplusTestControls] Could not resolve channel:', channelName);
      return;
    }

    // Send press
    const pressMessage = createToggleMessage(channelId, true);
    ws.send(pressMessage);
    console.log('[MultiplusTestControls] Mode:', mode, 'Press (1) ChannelID:', channelId);

    // Send release after 100ms
    setTimeout(function () {
      const releaseMessage = createToggleMessage(channelId, false);
      ws.send(releaseMessage);
      console.log('[MultiplusTestControls] Mode:', mode, 'Release (0) ChannelID:', channelId);
    }, 100);
  };

  return (
    <div className="gcg-component-wrapper">
      <div className="gcg-multiplus-test-controls">
        <div className="gcg-multiplus-test-controls__header">
          <span className="gcg-multiplus-test-controls__title">Multiplus L{leg} Test Controls</span>
        </div>

        <div className="gcg-multiplus-test-controls__buttons">
          <button
            type="button"
            className="gcg-multiplus-test-controls__button gcg-multiplus-test-controls__button--off"
            onClick={function () {
              handleModeClick('off');
            }}
            aria-label="Turn Multiplus Off"
          >
            OFF
          </button>

          <button
            type="button"
            className="gcg-multiplus-test-controls__button gcg-multiplus-test-controls__button--on"
            onClick={function () {
              handleModeClick('on');
            }}
            aria-label="Turn Multiplus On"
          >
            ON
          </button>

          <button
            type="button"
            className="gcg-multiplus-test-controls__button gcg-multiplus-test-controls__button--charger"
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
