/**
 * Slider Component
 *
 * Adjustable value input for controlling numeric values (temperatures, speeds, etc.).
 * Supports horizontal and vertical orientations with customizable ranges.
 *
 * WebSocket Behavior:
 * - User interaction: Sends new value to bound channel using dimmer messages
 * - Display state: Shows actual hardware value from subscriptions
 * - Supports live updating while dragging
 *
 * ES2017 compliant - no optional chaining or nullish coalescing.
 */

import { useComputed, useSignal } from '@preact/signals';
import { useRef, useEffect } from 'preact/hooks';
import type { SliderComponent } from '@gcg/schema';
import { getWebSocketAdapter } from '../state/websocket-state';
import { createDimmerMessage, resolveBindingToChannelId } from '../utils/binding-resolver';
import { getSignalState, type DimmerState } from '../state/signal-state';

interface SliderProps {
  component: SliderComponent;
  value?: number;
  onChange?: (value: number) => void;
}

export function Slider(props: SliderProps) {
  const { component, value, onChange } = props;

  // Local state for drag interactions
  const isDragging = useSignal(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const displayValue = useSignal(value || component.min);

  // 1. RESOLVE SIGNAL ID
  let signalId: number | null = null;
  if (component.bindings && component.bindings.value) {
    signalId = resolveBindingToChannelId(component.bindings.value, 'dimmer');
  }

  // 2. GET CURRENT STATE
  const signalState = signalId !== null ? getSignalState(signalId) : null;

  // 3. USE EFFECT TO UPDATE FROM SIGNAL STATE
  useEffect(() => {
    if (!sliderRef.current || isDragging.value) return;
    if (document.activeElement === sliderRef.current) return;

    // Update from signal state
    if (signalState && signalState.value) {
      const state = signalState.value.value as DimmerState;
      if (state && typeof state.value === 'number') {
        // Convert 0-100% to slider range
        const scaledValue = (state.value / 100) * (component.max - component.min) + component.min;
        sliderRef.current.value = String(scaledValue);
        displayValue.value = scaledValue;
      }
    }
  });

  // 4. GET CURRENT DISPLAY VALUE
  const currentValue = useComputed(() => {
    if (signalState && signalState.value) {
      const state = signalState.value.value as DimmerState;
      if (state && typeof state.value === 'number') {
        // Convert 0-100% to slider range
        return (state.value / 100) * (component.max - component.min) + component.min;
      }
    }
    return displayValue.value;
  });

  // 5. WEBSOCKET HANDLER
  const sendValue = (newValue: number) => {
    const adapter = getWebSocketAdapter();

    if (!adapter || signalId === null) {
      console.warn('No WebSocket adapter or signal ID available for slider');
      return;
    }

    // Clamp value to valid range
    const clampedValue = Math.max(component.min, Math.min(component.max, newValue));
    
    // Round to step intervals
    const steppedValue = Math.round(clampedValue / component.step) * component.step;

    // Convert to 0-100% range for dimmer message
    const percentage = ((steppedValue - component.min) / (component.max - component.min)) * 100;

    const message = createDimmerMessage(signalId, percentage);
    adapter.send(message);

    // Call onChange if provided
    if (onChange) {
      onChange(steppedValue);
    }
  };

  // 6. EVENT HANDLERS
  const handleSliderChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    
    displayValue.value = newValue;
    
    if (!isDragging.value) {
      sendValue(newValue);
    }
  };

  const handleSliderStart = () => {
    isDragging.value = true;
  };

  const handleSliderEnd = () => {
    if (isDragging.value) {
      sendValue(displayValue.value);
      isDragging.value = false;
    }
  };

  // Format value for display
  const formatValue = (val: number) => {
    const decimals = Math.max(0, Math.ceil(Math.log10(1 / component.step)));
    const formatted = val.toFixed(decimals);
    return component.unit ? `${formatted} ${component.unit}` : formatted;
  };

  // Calculate percentage for styling
  const percentage = ((currentValue.value - component.min) / (component.max - component.min)) * 100;

  // Determine if component is disabled
  const isDisabled = signalId === null;

  // Orientation styles
  const isVertical = component.orientation === 'vertical';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        background: 'var(--component-background)',
        borderRadius: '12px',
        border: '1px solid var(--component-border)',
        minWidth: isVertical ? '120px' : '200px',
        minHeight: isVertical ? '200px' : '80px',
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          textAlign: 'center',
          order: isVertical ? 2 : 1,
        }}
      >
        {component.label}
      </div>

      {/* Slider Container */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          order: isVertical ? 1 : 2,
          width: isVertical ? '60px' : '100%',
          height: isVertical ? '100%' : '40px',
        }}
      >
        {/* HTML Range Input */}
        <input
          ref={sliderRef}
          type="range"
          min={component.min}
          max={component.max}
          step={component.step}
          value={displayValue.value}
          disabled={isDisabled}
          onInput={handleSliderChange}
          onMouseDown={handleSliderStart}
          onMouseUp={handleSliderEnd}
          onTouchStart={handleSliderStart}
          onTouchEnd={handleSliderEnd}
          style={{
            appearance: 'none',
            background: 'transparent',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            width: isVertical ? '40px' : '100%',
            height: isVertical ? '100%' : '40px',
            transform: isVertical ? 'rotate(-90deg)' : 'none',
            transformOrigin: 'center',
          }}
          className="gcg-slider"
        />

        {/* Custom Track Background */}
        <div
          style={{
            position: 'absolute',
            background: 'var(--slider-track-bg, rgba(255, 255, 255, 0.2))',
            borderRadius: '20px',
            width: isVertical ? '8px' : '100%',
            height: isVertical ? '100%' : '8px',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Custom Track Fill */}
        <div
          style={{
            position: 'absolute',
            background: 'var(--theme-accent, #3b82f6)',
            borderRadius: '20px',
            width: isVertical ? '8px' : `${percentage}%`,
            height: isVertical ? `${percentage}%` : '8px',
            [isVertical ? 'bottom' : 'left']: '0',
            pointerEvents: 'none',
            zIndex: 2,
            transition: isDragging.value ? 'none' : 'all 0.2s ease',
          }}
        />
      </div>

      {/* Value Display */}
      {component.showValue && (
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            fontFamily: 'monospace',
            minWidth: '60px',
            textAlign: 'center',
            order: isVertical ? 3 : 3,
          }}
        >
          {formatValue(currentValue.value)}
        </div>
      )}

      {/* Debug Info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            textAlign: 'center',
            marginTop: '0.25rem',
            order: 4,
          }}
        >
          {signalId || 'No binding'}
        </div>
      )}
    </div>
  );
}