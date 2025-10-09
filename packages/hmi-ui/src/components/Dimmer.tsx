/**
 * Dimmer Component
 *
 * Combined intensity control with:
 * - Toggle button for on/off control
 * - Slider for 0-100% intensity adjustment
 *
 * Displays actual hardware state from subscription feedback.
 *
 * ES2017 compliant - no optional chaining or nullish coalescing.
 */

import { useComputed, useSignal } from '@preact/signals';
import { useRef, useEffect } from 'preact/hooks';
import type { DimmerComponent } from '@gcg/schema';
import { getWebSocketAdapter } from '../state/websocket-state';
import {
  createDimmerMessage,
  createToggleMessage,
  resolveBindingToChannelId,
} from '../utils/binding-resolver';
import { getSignalState, type DimmerState, type ToggleState } from '../state/signal-state';

interface DimmerProps {
  component: DimmerComponent;
  value?: number;
  onChange?: (value: number) => void;
}

export function Dimmer(props: DimmerProps) {
  const { component, value, onChange } = props;

  // Resolve signal IDs for dimmer and toggle
  let dimmerSignalId: number | null = null;
  let toggleSignalId: number | null = null;

  if (component.bindings && component.bindings.intensity) {
    dimmerSignalId = resolveBindingToChannelId(component.bindings.intensity, 'dimmer');
    toggleSignalId = resolveBindingToChannelId(component.bindings.intensity, 'toggle');
  }

  // Subscribe to signal states for reactive updates
  const dimmerSignalState = dimmerSignalId !== null ? getSignalState(dimmerSignalId) : null;
  const toggleSignalState = toggleSignalId !== null ? getSignalState(toggleSignalId) : null;

  // Local signal for tracking slider position during drag
  const isDragging = useSignal(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const displayIntensity = useSignal(value || component.min || 0);

  // Compute toggle state from subscription
  const isOn = useComputed(function () {
    if (toggleSignalState && toggleSignalState.value) {
      const state = toggleSignalState.value.value as ToggleState;
      if (state && typeof state.state === 'boolean') {
        return state.state;
      }
    }
    return false; // Default to off if no signal state
  });

  // Use effect to update slider from signal state, but ONLY when not dragging or focused
  // This matches the reference implementation's approach
  useEffect(() => {
    if (!sliderRef.current || isDragging.value) return;
    if (document.activeElement === sliderRef.current) return;

    // Update from signal state
    if (dimmerSignalState && dimmerSignalState.value) {
      const state = dimmerSignalState.value.value as DimmerState;
      if (state && typeof state.value === 'number') {
        sliderRef.current.value = String(state.value);
        displayIntensity.value = state.value; // Update display intensity for fill bar
      }
    }
  });

  // Get current display value for non-slider elements (label)
  const currentIntensity = useComputed(function () {
    if (dimmerSignalState && dimmerSignalState.value) {
      const state = dimmerSignalState.value.value as DimmerState;
      if (state && typeof state.value === 'number') {
        return state.value;
      }
    }
    return value !== undefined ? value : component.min || 0;
  });

  // Handle toggle button click
  const handleToggle = function () {
    console.log('[Dimmer] Toggle click - Current:', isOn.value, 'ToggleSignalID:', toggleSignalId);

    if (toggleSignalId !== null) {
      const wsAdapter = getWebSocketAdapter();
      if (wsAdapter && wsAdapter.isConnected()) {
        // Send button press (1)
        const pressMessage = createToggleMessage(toggleSignalId, true);
        console.log('[Dimmer] Sending toggle press (1):', JSON.stringify(pressMessage));
        wsAdapter.send(pressMessage);

        // Send button release (0) after delay to simulate physical button
        setTimeout(function () {
          const releaseMessage = createToggleMessage(toggleSignalId, false);
          console.log('[Dimmer] Sending toggle release (0):', JSON.stringify(releaseMessage));
          wsAdapter.send(releaseMessage);
        }, 75);
      } else {
        console.warn('[Dimmer] WebSocket not connected');
      }
    } else {
      console.warn('[Dimmer] No toggle signal ID');
    }
  };

  // Handle slider value change
  const handleChange = function (newValue: number) {
    // Clamp value to min/max
    const min = component.min || 0;
    const max = component.max || 100;
    const step = component.step || 1;

    // Round to nearest step
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    // Send WebSocket message if binding exists
    if (dimmerSignalId !== null) {
      const wsAdapter = getWebSocketAdapter();
      if (wsAdapter && wsAdapter.isConnected()) {
        const message = createDimmerMessage(dimmerSignalId, clampedValue, 0);
        console.log(
          '[Dimmer] Sending intensity:',
          clampedValue + '%',
          'DimmerSignalID:',
          dimmerSignalId,
          JSON.stringify(message)
        );
        wsAdapter.send(message);
      } else {
        console.warn('[Dimmer] WebSocket not connected');
      }
    } else {
      console.warn('[Dimmer] No dimmer signal ID');
    }

    if (onChange) {
      onChange(clampedValue);
    }
  };

  const handleInput = function (e: Event) {
    const target = e.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    if (!isNaN(newValue)) {
      // Set dragging flag to prevent WebSocket updates during drag
      isDragging.value = true;
      // Update display intensity immediately for smooth fill bar
      displayIntensity.value = newValue;
    }
  };

  const handleChangeEnd = function (e: Event) {
    const target = e.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    if (!isNaN(newValue)) {
      handleChange(newValue);
    }
    // Release dragging flag immediately on pointer up
    isDragging.value = false;
  };

  // Build class names
  const baseClass = 'gcg-dimmer';
  const className = baseClass;
  const toggleStateClass = isOn.value ? 'gcg-dimmer__toggle--on' : 'gcg-dimmer__toggle--off';

  const min = component.min || 0;
  const max = component.max || 100;
  const step = component.step || 1;

  return (
    <div className="gcg-component-wrapper">
      <div className={className}>
        <div className="gcg-dimmer__header">
          <label className="gcg-dimmer__label">
            <span className="gcg-dimmer__label-text">{component.label}</span>
          </label>

          <button
            type="button"
            className={'gcg-dimmer__toggle ' + toggleStateClass}
            onClick={handleToggle}
            disabled={component.disabled}
            aria-pressed={isOn.value}
            aria-label={'Toggle ' + component.label}
          >
            <div className="gcg-dimmer__toggle-indicator" />
          </button>
        </div>

        <div className="gcg-dimmer__slider-container">
          <input
            ref={sliderRef}
            type="range"
            className="gcg-dimmer__slider"
            min={min}
            max={max}
            step={step}
            defaultValue={currentIntensity.value}
            onInput={handleInput}
            onChange={handleChangeEnd}
            disabled={component.disabled}
            aria-label={component.label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={displayIntensity.value}
          />

          <div className="gcg-dimmer__track">
            <div
              className="gcg-dimmer__fill"
              style={{
                width: ((displayIntensity.value - min) / (max - min)) * 100 + '%',
              }}
            />
          </div>
        </div>
      </div>

      {component.tooltip && <div className="gcg-component-tooltip">{component.tooltip}</div>}
    </div>
  );
}
