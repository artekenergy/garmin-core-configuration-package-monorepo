# Preact + Signals Migration Guide

This document provides instructions for migrating the vanilla JavaScript WebSocket client (`web/script.js`) to a modern Preact + Signals architecture.

## Architecture Overview

The vanilla JS monolith should be decomposed into:
- **Signals-based stores** for reactive state management
- **Preact components** for UI rendering
- **Custom hooks** for reusable logic
- **Utility modules** for pure functions

---

## 1. WebSocket Store (Signals)

### File: `src/stores/websocket.js`

**Purpose:** Manage WebSocket connection lifecycle with reactive state using Preact Signals.

**State (Signals):**
```javascript
import { signal, computed } from '@preact/signals'

export const connectionStatus = signal('disconnected') // 'connected' | 'connecting' | 'disconnected'
export const wsInstance = signal(null)
export const shouldAutoReconnect = signal(true)
export const reconnectAttempt = signal(0)
export const lastError = signal(null)
```

**Functions to implement:**
```javascript
export function connect(url)
export function disconnect()
export function send(message)
export function scheduleReconnect()
```

**Extract from vanilla JS:**
- Lines ~100-250: `connect()`, `disconnect()`, `scheduleReconnect()`
- WebSocket event handlers (open, message, error, close)
- Reconnect logic with exponential backoff (INITIAL_RECONNECT_DELAY, MAX_RECONNECT_DELAY)

**Key changes:**
- Replace `let ws = null` with `wsInstance.value = null`
- Replace `setStatus('connected')` with `connectionStatus.value = 'connected'`
- Use signals for all state updates to trigger reactive UI updates

---

## 2. Protocol Store (Signals)

### File: `src/stores/protocol.js`

**Purpose:** Protocol constants and message builders.

**Constants to extract:**
```javascript
export const PROTOCOL = {
  systemCmd: 48,
  systemReq: 49,
  mfdStatus: 16,
  acknowledgement: 128,
  serviceProviderHeartbeat: 0,
  wduInfo: 6,
  wduHeartbeat: 5,
  acknowledgementAck: 0,
}
```

**Message builders:**
```javascript
export function buildDimmerCommand(signalId, valuePercent, dimmerIndex)
export function buildMomentaryCommand(signalId, state) // press=1, release=0
export function buildSubscriptionMessage(signalIds)
export function buildAckMessage()
```

**Extract from vanilla JS:**
- Lines ~40-80: PROTOCOL constant
- Lines ~50-80: `buildDimmerCommand()`
- Add new builders for momentary (17/1), subscription (96/0), ACK (128/0)

---

## 3. Signal Data Store (Signals)

### File: `src/stores/signals.js`

**Purpose:** Manage signal metadata and live values.

**State (Signals):**
```javascript
import { signal, computed } from '@preact/signals'

export const signalMetadata = signal(new Map()) // id -> { description, ... }
export const signalValues = signal(new Map()) // id -> current value
export const controlStates = signal(new Map()) // signalId -> { isPressed, value }
export const dimmerValues = signal(new Map()) // `${signalId}:${idx}` -> percent
```

**Functions:**
```javascript
export async function loadSignalInfo()
export function updateSignalValue(signalId, value)
export function updateControlState(signalId, state)
export function getSignalName(signalId)
```

**Extract from vanilla JS:**
- Lines ~100-150: `loadSignalInfo()`, signalMeta Map, signalIds array
- Lines ~30-50: signalScaleOverrides, signalFormatOverrides
- Message handler logic that updates controlsBySignal, dimmerControls, signalValueViews

---

## 4. Message Handler (Utility)

### File: `src/utils/messageHandler.js`

**Purpose:** Parse and route incoming WebSocket messages.

**Function:**
```javascript
export function handleIncomingMessage(messageEvent, stores) {
  const parsed = JSON.parse(messageEvent.data)
  
  // Route based on messagetype:
  // - 16 (mfdStatus): Update signal values, control states, dimmer values
  // - 48 (systemCmd): Handle heartbeat, send ACK
  // - 128 (acknowledgement): Log confirmation
  
  return parsed
}
```

**Sub-handlers to create:**
```javascript
function handleMfdStatus(parsed, stores)
function handleMomentaryStatus(data, stores) // messagecmd === 1
function handleDimmerStatus(data, stores) // messagecmd === 3
function handleNumericValue(data, stores) // messagecmd === 5
function handleSystemCommand(parsed, stores)
```

**Extract from vanilla JS:**
- Lines ~300-450: ws.addEventListener("message") handler
- Logic for parsing signal IDs from data bytes
- Logic for updating UI based on message type/cmd

---

## 5. Temperature Decoder (Utility)

### File: `src/utils/temperature.js`

**Purpose:** Decode temperature values from various formats.

**Function:**
```javascript
export function decodeTemperatureC(data, raw) {
  // Try candidate A: integer + hundredths (bytes [3][4])
  // Try candidate B: Celsius millidegrees
  // Try candidate C: Kelvin millidegrees
  // Return Celsius value
}

export function celsiusToFahrenheit(celsius)
export function fahrenheitToCelsius(fahrenheit)
```

**Extract from vanilla JS:**
- Lines ~50-80: `decodeTemperatureC()` function
- Heuristic logic for detecting format

---

## 6. Preact Components

### Component: `ConnectionStatus`
**File:** `src/components/ConnectionStatus.jsx`

**Purpose:** Display WebSocket connection status badge.

**Props:** None (reads from signals)

**Implementation:**
```jsx
import { connectionStatus } from '../stores/websocket'

export function ConnectionStatus() {
  return (
    <span class={`badge status ${connectionStatus.value}`}>
      {connectionStatus.value}
    </span>
  )
}
```

**Extract UI from vanilla JS:**
- Status badge rendering logic
- CSS classes: `.status.connected`, `.status.connecting`, `.status.disconnected`

---

### Component: `MomentaryButton`
**File:** `src/components/MomentaryButton.jsx`

**Purpose:** Reusable button for press/release control.

**Props:**
```typescript
interface Props {
  signalId: number
  label: string
  pressOnly?: boolean // fire-and-forget mode
  showBadge?: boolean
  className?: string
}
```

**Implementation:**
```jsx
import { useMomentaryControl } from '../hooks/useMomentaryControl'

export function MomentaryButton({ signalId, label, pressOnly, showBadge, className }) {
  const { isPressed, press, release, status } = useMomentaryControl(signalId, pressOnly)
  
  return (
    <div>
      <button
        class={`${className} ${isPressed ? 'pressing' : ''} ${status?.isOn ? 'active' : ''}`}
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
      >
        {label}
      </button>
      {showBadge && (
        <span class={`badge ${status?.isOn ? 'on' : 'off'}`}>
          {status?.isOn ? 'pressed' : 'released'}
        </span>
      )}
    </div>
  )
}
```

**Extract from vanilla JS:**
- Lines ~450-550: `createMomentaryControl()` logic
- Pointer event handling
- Press/release message building

---

### Component: `DimmerSlider`
**File:** `src/components/DimmerSlider.jsx`

**Purpose:** Reusable slider for dimmer control.

**Props:**
```typescript
interface Props {
  signalId: number
  dimmerIndex?: number
  label?: string
  showValue?: boolean
  min?: number
  max?: number
  step?: number
}
```

**Implementation:**
```jsx
import { useDimmerControl } from '../hooks/useDimmerControl'

export function DimmerSlider({ signalId, dimmerIndex = 0, label, showValue, min = 0, max = 100, step = 1 }) {
  const { value, setValue, displayValue } = useDimmerControl(signalId, dimmerIndex)
  
  return (
    <div class="dimmer-control">
      {label && <label>{label}</label>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value.value}
        onInput={(e) => setValue(e.target.value)}
      />
      {showValue && <span class="value">{displayValue}%</span>}
    </div>
  )
}
```

**Extract from vanilla JS:**
- Lines ~550-650: `createDimmerControl()` logic
- Throttled sending (50ms delay)
- Drag state tracking

---

### Component: `SignalValue`
**File:** `src/components/SignalValue.jsx`

**Purpose:** Display live signal value with unit conversion.

**Props:**
```typescript
interface Props {
  signalId: number
  unit?: string
  valueKind?: 'temperature' | 'voltage' | 'generic'
  tempUnit?: 'C' | 'F'
  decimals?: number
  scale?: number
}
```

**Implementation:**
```jsx
import { useSignalValue } from '../hooks/useSignalValue'

export function SignalValue({ signalId, unit, valueKind, tempUnit = 'C', decimals, scale = 1 }) {
  const { displayValue, currentUnit } = useSignalValue(signalId, { unit, valueKind, tempUnit, decimals, scale })
  
  return (
    <div class="signal-value">
      <span class="value">{displayValue}</span>
      <span class="unit">{currentUnit}</span>
    </div>
  )
}
```

**Extract from vanilla JS:**
- Lines ~50-150: Signal value display logic
- Temperature conversion logic
- Scale/format override Maps

---

### Component: `Modal`
**File:** `src/components/Modal.jsx`

**Purpose:** Reusable modal dialog component.

**Props:**
```typescript
interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ComponentChildren
  actions?: Array<{ label: string, onClick?: () => void, variant?: 'primary' | 'secondary' }>
}
```

**Implementation:**
```jsx
import { useEffect, useRef } from 'preact/hooks'

export function Modal({ isOpen, onClose, title, children, actions }) {
  const lastFocusRef = useRef(null)
  
  useEffect(() => {
    if (isOpen) {
      lastFocusRef.current = document.activeElement
      const handleEscape = (e) => e.key === 'Escape' && onClose()
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
        lastFocusRef.current?.focus()
      }
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null
  
  return (
    <div class="modal-root">
      <div class="modal-backdrop" onClick={onClose} />
      <div class="modal" role="dialog">
        <header class="modal-header">
          <h2>{title}</h2>
          <button class="modal-close" onClick={onClose}>&times;</button>
        </header>
        <div class="modal-body">{children}</div>
        {actions && (
          <footer class="modal-footer">
            {actions.map((action, i) => (
              <button
                key={i}
                class={action.variant === 'secondary' ? 'secondary' : ''}
                onClick={() => { action.onClick?.(); onClose(); }}
              >
                {action.label}
              </button>
            ))}
          </footer>
        )}
      </div>
    </div>
  )
}
```

**Extract from vanilla JS:**
- Lines ~200-400: `createModalManager()` function
- Focus management, keyboard handling, body/footer rendering

---

## 7. Custom Hooks

### Hook: `useMomentaryControl`
**File:** `src/hooks/useMomentaryControl.js`

**Purpose:** Manage momentary button state and WebSocket messages.

**Implementation:**
```javascript
import { useSignal, useComputed } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { send } from '../stores/websocket'
import { controlStates } from '../stores/signals'
import { buildMomentaryCommand } from '../stores/protocol'

export function useMomentaryControl(signalId, pressOnly = false) {
  const isPressed = useSignal(false)
  const status = useComputed(() => controlStates.value.get(signalId))
  
  const press = () => {
    if (isPressed.value) return
    isPressed.value = true
    send(buildMomentaryCommand(signalId, 1))
  }
  
  const release = () => {
    if (!isPressed.value) return
    isPressed.value = false
    send(buildMomentaryCommand(signalId, 0))
  }
  
  return { isPressed, press, release, status }
}
```

---

### Hook: `useDimmerControl`
**File:** `src/hooks/useDimmerControl.js`

**Purpose:** Manage dimmer slider state with throttled sending.

**Implementation:**
```javascript
import { useSignal, useComputed } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { send } from '../stores/websocket'
import { dimmerValues } from '../stores/signals'
import { buildDimmerCommand } from '../stores/protocol'

export function useDimmerControl(signalId, dimmerIndex = 0) {
  const key = `${signalId}:${dimmerIndex}`
  const localValue = useSignal(0)
  const isDragging = useSignal(false)
  const pendingRef = useRef(null)
  
  // Sync from store when not dragging
  const serverValue = useComputed(() => dimmerValues.value.get(key) ?? 0)
  useEffect(() => {
    if (!isDragging.value) {
      localValue.value = serverValue.value
    }
  }, [serverValue.value, isDragging.value])
  
  // Throttled send (50ms)
  const setValue = (newValue) => {
    localValue.value = newValue
    if (pendingRef.current) return
    pendingRef.current = setTimeout(() => {
      send(buildDimmerCommand(signalId, localValue.value, dimmerIndex))
      pendingRef.current = null
    }, 50)
  }
  
  const displayValue = useComputed(() => Math.round(localValue.value))
  
  return { value: localValue, setValue, displayValue, isDragging }
}
```

---

### Hook: `useSignalValue`
**File:** `src/hooks/useSignalValue.js`

**Purpose:** Get formatted signal value with unit conversion.

**Implementation:**
```javascript
import { useComputed } from '@preact/signals'
import { signalValues } from '../stores/signals'
import { decodeTemperatureC, celsiusToFahrenheit } from '../utils/temperature'

export function useSignalValue(signalId, options = {}) {
  const { unit, valueKind, tempUnit = 'C', decimals, scale = 1 } = options
  
  const rawValue = useComputed(() => signalValues.value.get(signalId))
  
  const displayValue = useComputed(() => {
    const raw = rawValue.value
    if (raw == null) return '—'
    
    let value = raw
    
    if (valueKind === 'temperature') {
      const celsius = decodeTemperatureC(null, raw)
      value = tempUnit === 'F' ? celsiusToFahrenheit(celsius) : celsius
      const d = decimals ?? 2
      return value.toFixed(d)
    }
    
    value = raw * scale
    if (decimals != null) {
      return value.toFixed(decimals)
    }
    return String(value)
  })
  
  const currentUnit = useComputed(() => {
    if (valueKind === 'temperature') return `°${tempUnit}`
    return unit || ''
  })
  
  return { displayValue, currentUnit, rawValue }
}
```

---

## 8. Main App Component

### File: `src/App.jsx`

**Purpose:** Root component that manages WebSocket connection and renders UI.

**Implementation:**
```jsx
import { useEffect } from 'preact/hooks'
import { connect, connectionStatus } from './stores/websocket'
import { loadSignalInfo } from './stores/signals'
import { ConnectionStatus } from './components/ConnectionStatus'
import { MomentaryButton } from './components/MomentaryButton'
import { DimmerSlider } from './components/DimmerSlider'
import { SignalValue } from './components/SignalValue'

export function App() {
  useEffect(() => {
    loadSignalInfo()
    connect() // Auto-connect on mount
  }, [])
  
  return (
    <div class="app-shell">
      <header class="app-header">
        <h1>HMI Control Panel</h1>
        <ConnectionStatus />
      </header>
      
      <main class="app-main">
        {/* Your UI pages/components here */}
        <div class="control-section">
          <MomentaryButton signalId={100} label="Light 1" showBadge />
          <DimmerSlider signalId={200} dimmerIndex={0} label="Dimmer 1" showValue />
          <SignalValue signalId={2} valueKind="temperature" tempUnit="F" />
        </div>
      </main>
    </div>
  )
}
```

---

## 9. Entry Point

### File: `src/main.jsx`

```jsx
import { render } from 'preact'
import { App } from './App'
import './styles.css'

render(<App />, document.getElementById('app'))
```

### File: `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HMI Control Panel</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## 10. Build Configuration

### File: `package.json`

```json
{
  "name": "hmi-control-panel",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "preact": "^10.19.0",
    "@preact/signals": "^1.2.0"
  },
  "devDependencies": {
    "@preact/preset-vite": "^2.8.0",
    "vite": "^5.0.0"
  }
}
```

### File: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3000,
    proxy: {
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
})
```

---

## Migration Checklist

### Phase 1: Core Infrastructure
- [ ] Create stores/websocket.js (WebSocket lifecycle)
- [ ] Create stores/protocol.js (message builders)
- [ ] Create stores/signals.js (signal metadata and values)
- [ ] Create utils/messageHandler.js (parse incoming messages)
- [ ] Create utils/temperature.js (temperature decoder)

### Phase 2: Hooks
- [ ] Create hooks/useMomentaryControl.js
- [ ] Create hooks/useDimmerControl.js
- [ ] Create hooks/useSignalValue.js

### Phase 3: Components
- [ ] Create components/ConnectionStatus.jsx
- [ ] Create components/MomentaryButton.jsx
- [ ] Create components/DimmerSlider.jsx
- [ ] Create components/SignalValue.jsx
- [ ] Create components/Modal.jsx

### Phase 4: App Structure
- [ ] Create App.jsx (root component)
- [ ] Create main.jsx (entry point)
- [ ] Configure Vite build
- [ ] Copy/adapt CSS from web/styles.css

### Phase 5: Testing & Refinement
- [ ] Test WebSocket connection and reconnect logic
- [ ] Test momentary button press/release
- [ ] Test dimmer slider with throttling
- [ ] Test signal value display and unit conversion
- [ ] Test modal dialogs
- [ ] Verify message handling for all protocol types

---

## Key Benefits of This Architecture

1. **Reactive State**: Signals automatically update UI when WebSocket messages arrive
2. **Reusable Components**: Each control is a self-contained component
3. **Type Safety**: Easy to add TypeScript later
4. **Testability**: Pure functions and isolated components
5. **Performance**: Preact is tiny (~3KB), signals are fast
6. **Developer Experience**: Hot reload, modern tooling (Vite)
7. **Maintainability**: Clear separation of concerns

---

## Example Usage in UI

```jsx
// Simple page with controls
function LightingPage() {
  return (
    <div class="page">
      <h2>Lighting Controls</h2>
      
      {/* Momentary buttons */}
      <MomentaryButton signalId={100} label="Overhead Light" showBadge />
      <MomentaryButton signalId={101} label="Reading Light" showBadge />
      
      {/* Dimmers */}
      <DimmerSlider signalId={200} label="Main Dimmer" showValue />
      <DimmerSlider signalId={201} label="Accent Lighting" showValue />
      
      {/* Status displays */}
      <SignalValue signalId={2} valueKind="temperature" tempUnit="F" unit="Interior Temp" />
      <SignalValue signalId={4} unit="V" decimals={2} label="Battery Voltage" />
    </div>
  )
}
```

---

## Notes for Copilot

When implementing this migration:

1. **Start with stores** - they're the foundation for everything else
2. **Message handler is critical** - it routes all incoming WebSocket data to the right signals
3. **Throttle dimmer updates** - use `setTimeout` or `requestAnimationFrame` to avoid spamming
4. **Handle reconnection gracefully** - exponential backoff prevents server hammering
5. **Preserve pointer capture** - use `setPointerCapture` for reliable button tracking
6. **Don't update UI during drag** - check `isDragging` flag to avoid feedback loops
7. **Auto-ACK heartbeats** - keep connection alive by responding to wduHeartbeat (48/5)

Reference the vanilla JS file for exact byte layouts and protocol details.
