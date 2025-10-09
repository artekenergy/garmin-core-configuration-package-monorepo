/**
 * Button Component
 *
 * Momentary action trigger (press and hold).
 * Used for one-time actions like horn, door unlock, pump prime.
 * Supports multiple visual variants: default, primary, danger, round.
 *
 * WebSocket Behavior:
 * - User presses: Sends value=1 immediately
 * - User holds: Keeps sending value=1 (no repeat)
 * - User releases: Sends value=0
 * - Safety: Ensures release sent even if pointer leaves button area
 *
 * ES2017 compliant - no optional chaining or nullish coalescing.
 */

import { useState } from 'preact/hooks';
import type { ButtonComponent } from '@gcg/schema';
import { getWebSocketAdapter } from '../state/websocket-state';
import { createToggleMessage, resolveBindingToChannelId } from '../utils/binding-resolver';
import { schemaSignal } from '../state/schema-signal';

interface ButtonProps {
  component: ButtonComponent;
  onAction?: (pressed: boolean) => void;
}

export function Button(props: ButtonProps) {
  const { component, onAction } = props;

  // 1. LOCAL STATE FOR VISUAL FEEDBACK
  // Track if button is currently pressed for immediate visual feedback
  const [isPressed, setIsPressed] = useState(false);

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

  // 3. RESOLVE SIGNAL ID
  let signalId: number | null = null;
  if (component.bindings && component.bindings.action) {
    signalId = resolveBindingToChannelId(component.bindings.action, 'momentary');
  }

  // 3. WEBSOCKET MESSAGE SENDER
  const sendWebSocketMessage = function (pressed: boolean) {
    if (signalId !== null) {
      const wsAdapter = getWebSocketAdapter();
      if (wsAdapter && wsAdapter.isConnected()) {
        const message = createToggleMessage(signalId, pressed);
        console.log(
          '[Button]',
          component.label,
          '-',
          pressed ? 'Press (1)' : 'Release (0)',
          'SignalID:',
          signalId
        );
        wsAdapter.send(message);
      } else {
        console.warn('[Button]', component.label, '- WebSocket not connected');
      }
    } else {
      console.warn('[Button]', component.label, '- No signal ID configured');
    }
  };

  // 4. POINTER EVENT HANDLERS
  // Use pointer events for better touch support and unified mouse/touch handling

  const handlePointerDown = function (e: PointerEvent) {
    e.preventDefault();

    // Prevent multiple presses or pressing disabled button
    if (isPressed || component.disabled) {
      return;
    }

    console.log('[Button]', component.label, '- Pointer Down');
    setIsPressed(true);
    sendWebSocketMessage(true);

    // Call optional callback
    if (onAction) {
      onAction(true);
    }
  };

  const handlePointerUp = function (e: PointerEvent) {
    e.preventDefault();

    if (isPressed) {
      console.log('[Button]', component.label, '- Pointer Up');
      setIsPressed(false);
      sendWebSocketMessage(false);

      if (onAction) {
        onAction(false);
      }
    }
  };

  const handlePointerCancel = function () {
    // Pointer was cancelled (e.g., system gesture, alert)
    if (isPressed) {
      console.log('[Button]', component.label, '- Pointer Cancel');
      setIsPressed(false);
      sendWebSocketMessage(false);

      if (onAction) {
        onAction(false);
      }
    }
  };

  const handlePointerLeave = function () {
    // Pointer left the button area while pressed
    if (isPressed) {
      console.log('[Button]', component.label, '- Pointer Leave');
      setIsPressed(false);
      sendWebSocketMessage(false);

      if (onAction) {
        onAction(false);
      }
    }
  };

  // 5. BUILD CSS CLASSES
  const variant = component.variant || 'secondary'; // Default to secondary if not specified
  const baseClass = 'gcg-button';
  const variantClass = baseClass + '--' + variant;
  const stateClass = isPressed ? baseClass + '--pressed' : '';
  const disabledClass = component.disabled ? baseClass + '--disabled' : '';

  const className = [baseClass, variantClass, stateClass, disabledClass]
    .filter(function (cls) {
      return cls;
    })
    .join(' ');

  // 6. RENDER COMPONENT
  return (
    <div className="gcg-component-wrapper">
      <div className="gcg-button-container">
        {/* Label displayed above the button */}
        <label className="gcg-button-label">{component.label}</label>

        <button
          type="button"
          className={className}
          disabled={component.disabled}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerLeave}
          aria-label={component.label}
          aria-pressed={isPressed}
          title={component.tooltip}
        >
          {/* Round variant - icon OR ON/OFF text inside circle */}
          {variant === 'round' && (
            <>
              {iconSvg ? (
                <div className="gcg-button__icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />
              ) : (
                <span className="gcg-button__label">ON/OFF</span>
              )}
            </>
          )}

          {/* Default/rectangular variants - can optionally show icon inside button */}
          {variant !== 'round' && iconSvg && (
            <div className="gcg-button__icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />
          )}
        </button>
      </div>

      {/* Tooltip text below component */}
      {component.tooltip && <div className="gcg-component-tooltip">{component.tooltip}</div>}
    </div>
  );
}
