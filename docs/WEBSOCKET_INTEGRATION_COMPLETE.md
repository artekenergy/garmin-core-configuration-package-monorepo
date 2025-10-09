# WebSocket Integration Complete

**Date**: October 3, 2025  
**Status**: ✅ WebSocket connection established and maintained

---

## 🎯 What Was Implemented

### Core WebSocket Adapter

**File**: `src/adapters/websocket-adapter.ts` (375 lines)

**Features**:

- ✅ Auto-connect on initialization
- ✅ Auto-reconnect with exponential backoff (1s → 30s max)
- ✅ **WDU Heartbeat ACK** (messagetype: 128) - Keeps connection alive
- ✅ Connection lifecycle handlers (open, message, error, close)
- ✅ Message sending with connection validation
- ✅ Event handler registration/unregistration
- ✅ Connection state tracking

**Key Methods**:

```typescript
connect(); // Establish WebSocket connection
disconnect(); // Close connection (disables auto-reconnect)
send(message); // Send EmpirBus message
isConnected(); // Check connection status
getState(); // Get current state: connecting|open|closing|closed
onMessage(handler); // Register message handler
onOpen(handler); // Register connection handler
onClose(handler); // Register disconnection handler
onError(handler); // Register error handler
```

**Protocol Implementation**:

```typescript
// Auto-ACK WDU heartbeat (from reference-script.js)
if (messagetype === 48 && messagecmd === 5) {
  send({
    messagetype: 128, // acknowledgement
    messagecmd: 0, // acknowledgementAck
    size: 1,
    data: [0x00],
  });
}
```

**Reconnection Logic**:

- Starts at 1 second delay
- Doubles on each attempt (exponential backoff)
- Caps at 30 seconds
- Automatically clears on successful connection

---

### WebSocket State Management

**File**: `src/state/websocket-state.ts` (60 lines)

**Features**:

- Global WebSocket adapter instance
- Reactive connection state signal
- Auto-initialization in main.tsx

**Exports**:

```typescript
connectionStateSignal; // Signal<'connecting' | 'connected' | 'disconnected'>
wsAdapter; // WebSocketAdapter instance
initializeWebSocket(); // Initialize connection
getWebSocketAdapter(); // Get adapter instance
```

**Signal Updates**:

- `onOpen` → 'connected'
- `onClose` → 'disconnected'
- `onError` → 'disconnected'

---

### UI Integration

#### Connection Status Indicator (App.tsx)

**Visual States**:

- 🟢 **Connected** - Green badge with glow
- 🟡 **Connecting...** - Yellow badge
- 🔴 **Disconnected** - Red badge

**Location**: Fixed position, top-right corner

**Styling**:

```tsx
<div style={{
  position: 'fixed',
  top: '1rem',
  right: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  ...
}}>
  <div style={{
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    background: connectionColor,
    boxShadow: '0 0 8px ' + connectionColor,
  }} />
  {connectionText}
</div>
```

---

## 🔌 WebSocket Connection Details

### Endpoint Resolution

**URL Format**:

- **HTTPS**: `wss://${host}/ws`
- **HTTP**: `ws://${host}/ws`

**Auto-detection**:

```typescript
const isHttps = window.location.protocol === 'https:';
const scheme = isHttps ? 'wss://' : 'ws://';
const host = window.location.host; // includes port
return scheme + host + '/ws';
```

**Examples**:

- Development: `ws://localhost:3001/ws`
- Garmin Device: `ws://192.168.1.100/ws` (or device IP)
- Production HTTPS: `wss://example.com/ws`

---

### Connection Handshake

**On Open**:

1. Clear reconnection timer
2. Reset reconnection attempt counter
3. **Send WDU Info Request** (messagetype: 49, messagecmd: 1)
4. Notify registered handlers
5. Update UI state to "connected"

**WDU Info Request**:

```typescript
{
  messagetype: 49,  // systemReq
  messagecmd: 1,
  size: 3,
  data: [0, 0, 0]
}
```

---

### Heartbeat ACK (Keep-Alive)

**Pattern** (from reference-script.js):

**Receive WDU Heartbeat**:

```json
{
  "messagetype": 48,
  "messagecmd": 5,
  "size": 1,
  "data": [0]
}
```

**Auto-respond with ACK**:

```json
{
  "messagetype": 128,
  "messagecmd": 0,
  "size": 1,
  "data": [0]
}
```

**Critical**: Without ACK, EmpirBus controller will timeout and close connection.

---

### Reconnection Strategy

**Exponential Backoff**:

```
Attempt 1: 1s   (1000ms)
Attempt 2: 2s   (2000ms)
Attempt 3: 4s   (4000ms)
Attempt 4: 8s   (8000ms)
Attempt 5: 16s  (16000ms)
Attempt 6: 30s  (capped at MAX_RECONNECT_DELAY)
Attempt 7+: 30s (stays at max)
```

**Trigger Conditions**:

- Connection close event
- Connection error event
- Initial connection failure

**Stop Conditions**:

- Successful connection (resets counter)
- Manual disconnect (shouldAutoReconnect = false)

---

## 🧪 Testing

### Local Development

**Dev Server**: `http://localhost:3001`

**Expected Behavior**:

1. App loads
2. Connection status badge appears (top-right)
3. Shows "Connecting..." (yellow)
4. Attempts to connect to `ws://localhost:3001/ws`
5. If server not available:
   - Shows "Disconnected" (red)
   - Retries with exponential backoff
   - Logs visible in browser console (debug mode)

**Debug Mode**:

- Enabled automatically on localhost
- Console logs all WebSocket events:
  - `[WebSocketAdapter] Connecting to ws://localhost:3001/ws`
  - `[WebSocketAdapter] WebSocket connected`
  - `[WebSocketAdapter] Sent message: { messagetype: 49, ... }`
  - `[WebSocketAdapter] Received message: { ... }`

### Device Deployment

**After deploying to `/web/index1.html`**:

1. WebSocket connects to Garmin device WebSocket server
2. URL auto-resolves to device IP: `ws://192.168.1.100/ws`
3. Connection established
4. WDU Info requested
5. Heartbeat ACK automatic
6. Badge shows "Connected" (green)

---

## 📊 Message Flow (Current Implementation)

```
[App Loads]
    ↓
[initializeWebSocket()]
    ↓
[WebSocketAdapter.connect()]
    ↓
[WebSocket CONNECTING]
    ↓ (badge: yellow "Connecting...")
    ↓
[WebSocket OPEN]
    ↓
[Send WDU Info Request (49/1)]
    ↓
[Badge: green "Connected"]
    ↓
[Receive WDU Heartbeat (48/5)]
    ↓
[Auto-send ACK (128/0)] ← Keeps connection alive
    ↓
[Receive Messages...]
    ↓
[Notify handlers]
```

---

## 🔜 Next Steps: Component Integration

### What's Working Now

- ✅ WebSocket connection established
- ✅ Auto-reconnect with backoff
- ✅ Heartbeat ACK (keep-alive)
- ✅ Connection state visible in UI
- ✅ Message sending capability

### What's Next (Component Binding)

- ⏸️ **Toggle**: Send messagetype 17, messagecmd 1 (press/release)
- ⏸️ **Button**: Send messagetype 17, messagecmd 1 (momentary)
- ⏸️ **Dimmer**: Send messagetype 17, messagecmd 3 (brightness)
- ⏸️ **Indicator**: Receive messagetype 16, messagecmd 1 (status updates)
- ⏸️ **Gauge**: Receive messagetype 16, messagecmd 5 (numeric values)

### Implementation Plan

1. **Create Binding Resolver** (next):
   - Map schema binding → channelId
   - Encode channelId → [lo, hi] bytes

2. **Update Components**:
   - Toggle: Call `wsAdapter.send()` on click
   - Button: Call `wsAdapter.send()` on pointerdown/up
   - Add message handlers for incoming state

3. **Add Message Dispatcher**:
   - Route incoming messages to components
   - Update component state from EmpirBus

---

## 📝 Code Examples

### Sending a Toggle Command

```typescript
import { getWebSocketAdapter } from './state/websocket-state';

const wsAdapter = getWebSocketAdapter();
const channelId = 5; // from schema binding

// Encode channel ID to bytes
const lo = channelId & 0xff;
const hi = (channelId >> 8) & 0xff;

// Send toggle ON
wsAdapter?.send({
  messagetype: 17,
  messagecmd: 1,
  size: 3,
  data: [lo, hi, 1], // 1 = ON
});

// Send toggle OFF
wsAdapter?.send({
  messagetype: 17,
  messagecmd: 1,
  size: 3,
  data: [lo, hi, 0], // 0 = OFF
});
```

### Receiving Status Updates

```typescript
import { getWebSocketAdapter } from './state/websocket-state';

const wsAdapter = getWebSocketAdapter();

// Register message handler
const unsubscribe = wsAdapter?.onMessage(function (message) {
  // MFD Status updates (16/1)
  if (message.messagetype === 16 && message.messagecmd === 1) {
    const signalId = message.data[0] | (message.data[1] << 8);
    const state = message.data[2]; // 0 = OFF, 1 = ON

    console.log('Status update for signal', signalId, ':', state);
    // Update component state here
  }
});

// Clean up on unmount
return unsubscribe;
```

---

## ✅ Summary

**WebSocket Foundation Complete**:

- Adapter implemented with full lifecycle management
- Connection state tracked and displayed
- Auto-reconnect with exponential backoff
- Heartbeat ACK automatic (keeps connection alive)
- Ready for component integration

**Next Session**: Implement component bindings to send/receive EmpirBus messages through the WebSocket connection.

---

**Related Documentation**:

- [HMI UI Implementation Plan](./HMI_UI_IMPLEMENTATION_PLAN.md)
- [System Architecture](./SYSTEM_ARCHITECTURE.md)
- [reference-script.js](./reference-script.js) - Reference implementation
