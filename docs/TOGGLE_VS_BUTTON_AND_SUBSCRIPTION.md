# Toggle vs Button Behavior & Signal Subscription Implementation

**Date:** October 3, 2025  
**Status:** Analysis Complete - Implementation Required  
**Priority:** High

---

## Issue 1: Toggle Button vs Push Button Behavior

### The Problem

**Current State:**

- Both `toggle` and `button` components send **identical WebSocket messages**
- Both use message type `17/1` with `data: [lo, hi, 1]` for press and `[lo, hi, 0]` for release
- The difference is in the **programming logic**, not the signal itself

**The Issue:**

```typescript
// Button component (momentary)
handlePointerDown() {
  sendWebSocketMessage(true);  // Send press (17/1 with value 1)
}
handlePointerUp() {
  sendWebSocketMessage(false); // Send release (17/1 with value 0)
}

// Toggle component (currently)
handleClick() {
  const newState = !isOn;
  sendWebSocketMessage(newState); // Sends 1 or 0, same as button!
}
```

**What Should Happen:**

- **Button (momentary)**: Press = ON, Release = OFF (physical button behavior)
- **Toggle**: Click = flip state permanently until clicked again (latch behavior)

### The Root Cause

From the hardware configuration perspective:

```json
{
  "id": "core-03",
  "control": "toggle-button", // This is a CHANNEL TYPE, not component behavior
  "signals": {
    "toggle": 116, // Signal for latched state
    "momentary": 117 // Signal for momentary press
  }
}
```

**Key Insight:**

- **`toggle-button` channel** means the hardware output latches ON/OFF with each press
- **`push-button` channel** means the hardware output is ON only while pressed
- **But the signal protocol is identical** - we send press/release events
- **The hardware controller interprets the signals differently** based on channel configuration

### The Solution

We need to differentiate **component behavior** from **channel type**:

| Component Type             | User Interaction    | WebSocket Messages | Channel Type Used       |
| -------------------------- | ------------------- | ------------------ | ----------------------- |
| **Button (momentary)**     | Hold to activate    | Press=1, Release=0 | Uses `momentary` signal |
| **Button (toggle action)** | Click to latch      | Press=1, Release=0 | Uses `toggle` signal    |
| **Toggle (UI)**            | Click to flip state | Press=1, Release=0 | Uses `toggle` signal    |

**All send the same messages, but:**

- Button with `action: "momentary"` → uses `momentary` signal (117)
- Button with `action: "toggle"` → uses `toggle` signal (116)
- Toggle component → uses `toggle` signal (116)

**The current implementation is actually CORRECT** for the protocol, but we need to:

1. ✅ Ensure Toggle uses `toggle` signal (state binding)
2. ✅ Ensure Button uses appropriate signal based on `action` property
3. ❌ **Missing: Subscribe to signal status updates to reflect hardware state**

---

## Issue 2: Signal Subscription Not Implemented

### The Critical Missing Feature

**From reference-script.js (lines 296-310):**

```javascript
// Subscribe to all signal IDs for MFD STATUS (16)
async function sendSubscribeAllSignals() {
  if (!signalIds || signalIds.length === 0) {
    await loadSignalInfo();
  }
  const data = [];
  for (const id of signalIds) {
    const lo = id & 0xff;
    const hi = (id >> 8) & 0xff;
    data.push(lo, hi);
  }
  const msg = { messagetype: 96, messagecmd: 0, size: data.length, data };
  wsSend(msg);
}
```

**What This Does:**

- Sends a **subscription message** (type 96, cmd 0) to the server
- Contains a list of all signal IDs we want to receive updates for
- Server then pushes **MFD STATUS messages** (type 16) when signal values change

### Why We Need This

**Without subscription:**

- ❌ UI only sends commands but never receives state updates
- ❌ Toggle buttons don't update when changed from another control (physical switch, other UI)
- ❌ Dimmer sliders don't reflect actual intensity values
- ❌ Sensor values (temperature, voltage, etc.) never display

**With subscription:**

- ✅ UI receives real-time updates for all signal changes
- ✅ Multiple UIs stay in sync
- ✅ UI reflects actual hardware state
- ✅ Sensor data displays live

### Protocol Details

#### Subscription Message (Type 96, Cmd 0)

```typescript
interface SubscriptionMessage {
  messagetype: 96; // Subscription request
  messagecmd: 0; // Subscribe action
  size: number; // Length of data array (signalCount * 2)
  data: number[]; // [lo1, hi1, lo2, hi2, ...] for each signal
}
```

#### Example: Subscribe to signals 15, 72, 116

```typescript
{
  messagetype: 96,
  messagecmd: 0,
  size: 6,
  data: [
    15, 0,   // Signal 15 (0x000F) → toggle-channel-1
    72, 0,   // Signal 72 (0x0048) → toggle-channel-2
    116, 0   // Signal 116 (0x0074) → toggle-channel-3
  ]
}
```

#### Status Update Messages (Type 16)

After subscribing, server sends updates:

**Toggle/Button State (Type 16, Cmd 1):**

```typescript
{
  messagetype: 16,  // MFD Status
  messagecmd: 1,    // Toggle/button state
  size: 3,
  data: [lo, hi, state]  // state: 0=OFF, 1=ON
}
```

**Dimmer Value (Type 16, Cmd 3):**

```typescript
{
  messagetype: 16,  // MFD Status
  messagecmd: 3,    // Dimmer value
  size: 5,
  data: [lo, hi, index, valueLo, valueHi]
  // value is in 0.1% units: 1000 = 100.0%
}
```

**Numeric Value (Type 16, Cmd 5):**

```typescript
{
  messagetype: 16,  // MFD Status
  messagecmd: 5,    // Numeric sensor value
  size: 4 or 8,     // Short or extended format
  data: [lo, hi, valLo, valHi, ...]
  // Extended: [lo, hi, r0, r1, valLo, valHi, meta0, meta1]
}
```

---

## Implementation Plan

### Phase 1: Add Subscription Support to WebSocketAdapter

**File:** `packages/hmi-ui/src/adapters/websocket-adapter.ts`

Add subscription methods:

```typescript
/**
 * Subscribe to signal updates
 * @param signalIds Array of signal IDs to subscribe to
 */
public subscribeToSignals(signalIds: number[]): void {
  if (!signalIds || signalIds.length === 0) {
    this.log('No signals to subscribe');
    return;
  }

  const data: number[] = [];
  for (const id of signalIds) {
    const lo = id & 0xff;
    const hi = (id >> 8) & 0xff;
    data.push(lo, hi);
  }

  const message = {
    messagetype: 96,
    messagecmd: 0,
    size: data.length,
    data
  };

  this.log(`Subscribing to ${signalIds.length} signals`);
  this.send(message);
}
```

### Phase 2: Create Signal State Management

**New File:** `packages/hmi-ui/src/state/signal-state.ts`

```typescript
import { signal } from '@preact/signals';

// Global signal state registry
// signalId → current value
export const signalStates = new Map<number, any>();

// Preact signals for reactivity
export const signalStateSignals = new Map<number, any>();

/**
 * Get or create a reactive signal for a given signal ID
 */
export function getSignalState(signalId: number) {
  if (!signalStateSignals.has(signalId)) {
    signalStateSignals.set(signalId, signal(null));
  }
  return signalStateSignals.get(signalId);
}

/**
 * Update signal state from WebSocket message
 */
export function updateSignalState(signalId: number, value: any) {
  signalStates.set(signalId, value);

  const sig = getSignalState(signalId);
  if (sig) {
    sig.value = value;
  }
}

/**
 * Parse MFD STATUS message and update state
 */
export function handleMfdStatusMessage(msg: EmpirBusMessage) {
  if (msg.messagetype !== 16) return;

  const signalId = msg.data[0] | (msg.data[1] << 8);

  switch (msg.messagecmd) {
    case 1: {
      // Toggle/button state
      const state = msg.data[2] === 1;
      updateSignalState(signalId, state);
      break;
    }
    case 3: {
      // Dimmer value
      const index = msg.data[2] || 0;
      const rawValue = msg.data[3] | (msg.data[4] << 8);
      // Normalize: values > 100 are in 0.1% units
      const percent = rawValue > 100 ? rawValue / 10 : rawValue;
      updateSignalState(signalId, { index, value: percent });
      break;
    }
    case 5: {
      // Numeric value
      const hasExtended = msg.data.length >= 8;
      const raw = hasExtended ? msg.data[4] | (msg.data[5] << 8) : msg.data[2] | (msg.data[3] << 8);
      updateSignalState(signalId, raw);
      break;
    }
  }
}
```

### Phase 3: Auto-Subscribe on Schema Load

**File:** `packages/hmi-ui/src/utils/schema-loader.ts`

```typescript
import { getWebSocketAdapter } from '../state/websocket-state';

/**
 * Extract all signal IDs from schema
 */
function extractSignalIds(schema: UISchema): number[] {
  const signals = new Set<number>();

  // Extract from hardware config
  if (schema.hardware?.outputs) {
    for (const output of schema.hardware.outputs) {
      if (output.signals) {
        if (output.signals.toggle) signals.add(output.signals.toggle);
        if (output.signals.momentary) signals.add(output.signals.momentary);
        if (output.signals.dimmer) signals.add(output.signals.dimmer);
      }
      if (output.signalId) {
        signals.add(output.signalId);
      }
    }
  }

  return Array.from(signals).sort((a, b) => a - b);
}

/**
 * Subscribe to all signals defined in schema
 */
export function subscribeToSchemaSignals(schema: UISchema): void {
  const wsAdapter = getWebSocketAdapter();
  if (!wsAdapter || !wsAdapter.isConnected()) {
    console.warn('Cannot subscribe: WebSocket not connected');
    return;
  }

  const signalIds = extractSignalIds(schema);
  if (signalIds.length === 0) {
    console.warn('No signals found in schema');
    return;
  }

  console.log(`Subscribing to ${signalIds.length} signals from schema`);
  wsAdapter.subscribeToSignals(signalIds);
}
```

### Phase 4: Update Components to Use Signal State

**File:** `packages/hmi-ui/src/components/Toggle.tsx`

```typescript
import { useComputed } from '@preact/signals';
import { getSignalState } from '../state/signal-state';
import { resolveBindingToChannelId } from '../utils/binding-resolver';

export function Toggle(props: ToggleProps) {
  const { component } = props;

  // Get signal ID for this toggle
  const signalId = resolveBindingToChannelId(
    component.bindings.state,
    'toggle'
  );

  // Subscribe to signal state
  const signalState = signalId ? getSignalState(signalId) : null;
  const isOn = useComputed(() => signalState?.value === true);

  const handleClick = () => {
    // Toggle state and send to hardware
    const newState = !isOn.value;

    // Send WebSocket message
    if (signalId) {
      const wsAdapter = getWebSocketAdapter();
      if (wsAdapter?.isConnected()) {
        const message = createToggleMessage(signalId, newState);
        wsAdapter.send(message);
      }
    }

    // Optimistic update (will be confirmed by subscription)
    if (signalState) {
      signalState.value = newState;
    }
  };

  // Render with actual state
  return (
    <button
      className={`gcg-toggle ${isOn.value ? 'on' : 'off'}`}
      onClick={handleClick}
      aria-pressed={isOn.value}
    >
      {component.label}
    </button>
  );
}
```

---

## Summary of Changes Needed

### 1. WebSocketAdapter Enhancement

- ✅ Already has message handlers
- ➕ Add `subscribeToSignals(signalIds: number[])` method
- ➕ Add convenience method for parsing signal IDs from messages

### 2. Signal State Management (New)

- ➕ Create signal state registry using Preact signals
- ➕ Add MFD STATUS message parser
- ➕ Wire up WebSocket adapter to update signal states

### 3. Schema Signal Extraction (New)

- ➕ Extract all signal IDs from schema hardware config
- ➕ Auto-subscribe on schema load and WebSocket connect

### 4. Component Updates

- ✅ Toggle: Already sends correct messages
- ✅ Button: Already sends correct messages
- ➕ Toggle: Use signal state for display
- ➕ Button: Optionally show pressed state from signal
- ➕ Dimmer: Use signal state for value display
- ➕ Gauge/Indicator: Use signal state for sensor values

### 5. Documentation

- ➕ Document subscription protocol
- ➕ Document signal state management
- ➕ Update component binding docs

---

## Testing Checklist

- [ ] Subscribe message sent on connect
- [ ] Toggle state updates from hardware
- [ ] Multiple UIs stay in sync
- [ ] Dimmer values reflect actual intensity
- [ ] Button press state shows correctly
- [ ] Sensor values display (temp, voltage, etc.)
- [ ] Reconnect re-subscribes automatically

---

## References

- `ref/reference-script.js` lines 296-310 (subscription implementation)
- `ref/reference-script.js` lines 185-228 (MFD STATUS parsing)
- `docs/EMPIRBUS_CHANNEL_MAPPING.md` (channel types and signal IDs)
- `docs/SIGNAL_NAMING_STANDARDIZATION_COMPLETE.md` (signal naming convention)
