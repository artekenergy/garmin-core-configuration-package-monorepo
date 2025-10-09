# Component Bindings Complete + Production Deployment

**Date**: October 3, 2025  
**Status**: ✅ WebSocket bindings implemented and deployed

---

## ✅ What Was Completed

### 1. Binding Resolver (`src/utils/binding-resolver.ts`)

**Functions Created**:

```typescript
resolveBindingToChannelId(binding); // Resolve binding → channel ID
encodeChannelId(channelId); // Encode as lo/hi byte pair
createToggleMessage(id, state); // Create toggle command (17/1)
createDimmerMessage(id, pct, idx); // Create dimmer command (17/3)
```

**Message Format**:

```typescript
// Toggle/Button: messagetype 17, messagecmd 1
{
  messagetype: 17,
  messagecmd: 1,
  size: 3,
  data: [lo, hi, state] // state: 0=off, 1=on
}

// Dimmer: messagetype 17, messagecmd 3
{
  messagetype: 17,
  messagecmd: 3,
  size: 5,
  data: [lo, hi, dimmerIdx, valueLo, valueHi]
}
```

---

### 2. Toggle Component Updated

**Added WebSocket Integration**:

```typescript
// On click:
1. Update local state (instant UI feedback)
2. Check if binding exists
3. Get WebSocket adapter
4. Create toggle message with channel ID
5. Send message if connected
```

**Code Flow**:

```typescript
handleClick() {
  const newValue = !isOn;
  setIsOn(newValue); // Local state

  if (component.bindings?.state) {
    const binding = component.bindings.state;
    if (binding.type === 'empirbus' && typeof binding.channel === 'number') {
      const wsAdapter = getWebSocketAdapter();
      if (wsAdapter?.isConnected()) {
        const message = createToggleMessage(binding.channel, newValue);
        wsAdapter.send(message); // Send to EmpirBus
      }
    }
  }
}
```

---

### 3. Button Component Updated

**Added Momentary Control**:

```typescript
// On pointer down: send press (state = 1)
// On pointer up/cancel/leave: send release (state = 0)
```

**Code Flow**:

```typescript
handlePointerDown() {
  setIsPressed(true);
  sendWebSocketMessage(true); // data: [lo, hi, 1]
}

handlePointerUp() {
  setIsPressed(false);
  sendWebSocketMessage(false); // data: [lo, hi, 0]
}

// Also handles: pointercancel, pointerleave
// Ensures button doesn't get "stuck" pressed
```

---

### 4. Test Schema Updated

**Changed to Numeric Channel IDs**:

```json
{
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": 1 // Was: "core-01"
    }
  }
}
```

**Test Channels**:

- Toggle 1: channel 1
- Toggle 2: channel 2
- Button: channel 3
- Indicator: channel 1 (mirrors Toggle 1)

---

## 📦 Production Build

**Build Output**:

```
dist/index.html                   1.08 kB │ gzip:  0.56 kB
dist/assets/index-B5XhJmhx.css    6.00 kB │ gzip:  1.69 kB
dist/assets/signals-CIKrY_cu.js   9.41 kB │ gzip:  3.43 kB
dist/assets/vendor-azMIOUfB.js   10.35 kB │ gzip:  4.40 kB
dist/assets/index-D0qw2ifZ.js    78.94 kB │ gzip: 19.59 kB
```

**Total Size**:

- Uncompressed: ~105 kB
- Gzipped: ~25 kB ✅ Very lightweight!

**Bundle Increase**:

- Previous: 73.33 kB
- Current: 78.94 kB
- Increase: +5.6 kB (WebSocket adapter + binding resolver)

---

## 🚀 Deployment Status

**Files Deployed to `/web/`**:

```
/web/
├── index1.html              ← Your HMI UI (UPDATED)
├── hmi-assets/              ← Built assets (UPDATED)
│   ├── index-D0qw2ifZ.js    ← Main bundle with WebSocket
│   ├── vendor-azMIOUfB.js   ← Preact
│   ├── signals-CIKrY_cu.js  ← Signals
│   └── index-B5XhJmhx.css   ← Styles
└── schema.json              ← Test schema with numeric channels
```

**Asset References in index1.html**:

```html
<script type="module" crossorigin src="/hmi-assets/index-D0qw2ifZ.js"></script>
<link rel="modulepreload" crossorigin href="/hmi-assets/vendor-azMIOUfB.js" />
<link rel="modulepreload" crossorigin href="/hmi-assets/signals-CIKrY_cu.js" />
<link rel="stylesheet" crossorigin href="/hmi-assets/index-B5XhJmhx.css" />
```

---

## 🧪 Testing Guide

### Local Testing (localhost:3001)

**Expected Behavior**:

1. App loads with connection status badge (top-right)
2. Shows "Connecting..." → "Disconnected" (no WebSocket server)
3. Components render correctly
4. Click Toggle/Button → Local state updates
5. **No WebSocket messages sent** (not connected)

**Console Logs** (F12):

```
[WebSocketAdapter] Connecting to ws://localhost:3001/ws
[WebSocketAdapter] WebSocket error...
[WebSocketAdapter] WebSocket closed
[WebSocketAdapter] Scheduling reconnect in 1s
```

---

### Device Testing (Garmin Display)

**Deployment Process**:

1. Create EmpirBus package (.ebp) containing `/web/` directory
2. Upload to Garmin display
3. Navigate to HMI menu
4. Load index1.html

**Expected Behavior**:

1. App loads
2. Connection status: "Connecting..." → "Connected" ✅
3. WebSocket URL: `ws://<device-ip>/ws`
4. Click Toggle:
   - UI updates instantly
   - **WebSocket message sent**: `{ messagetype: 17, messagecmd: 1, data: [1, 0, 1] }`
   - Physical output toggles (if EmpirBus controller connected)
5. Click Button (hold):
   - Press: `{ messagetype: 17, messagecmd: 1, data: [3, 0, 1] }`
   - Release: `{ messagetype: 17, messagecmd: 1, data: [3, 0, 0] }`
6. Heartbeat ACK automatic (keeps connection alive)

---

## 📊 Message Examples

### Toggle Channel 1 ON

```json
{
  "messagetype": 17,
  "messagecmd": 1,
  "size": 3,
  "data": [1, 0, 1]
}
```

- `data[0]`: 1 (channel ID low byte)
- `data[1]`: 0 (channel ID high byte)
- `data[2]`: 1 (state = ON)

### Toggle Channel 1 OFF

```json
{
  "messagetype": 17,
  "messagecmd": 1,
  "size": 3,
  "data": [1, 0, 0]
}
```

- `data[2]`: 0 (state = OFF)

### Button Channel 3 Press

```json
{
  "messagetype": 17,
  "messagecmd": 1,
  "size": 3,
  "data": [3, 0, 1]
}
```

### Button Channel 3 Release

```json
{
  "messagetype": 17,
  "messagecmd": 1,
  "size": 3,
  "data": [3, 0, 0]
}
```

---

## 🔍 Debug Mode

**Enabled on localhost**:

```typescript
const isDebug = window.location.hostname === 'localhost';
initializeWebSocket(isDebug);
```

**Console Output**:

```
[WebSocketAdapter] Connecting to ws://localhost:3001/ws
[WebSocketAdapter] WebSocket connected
[WebSocketAdapter] Sent message: { messagetype: 49, messagecmd: 1, ... }
[WebSocketAdapter] Received message: { messagetype: 48, messagecmd: 5, ... }
[WebSocketAdapter] Sent message: { messagetype: 128, messagecmd: 0, ... }
[WebSocketAdapter] Sent message: { messagetype: 17, messagecmd: 1, data: [1, 0, 1] }
```

**Disabled on production**:

- No console logs on device
- Reduces noise in production
- Errors still logged

---

## ⚠️ Known Limitations

### String Channel References (Not Yet Implemented)

```json
{
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "core-01" // ❌ String not supported yet
    }
  }
}
```

**Workaround**: Use numeric channels for now

```json
{
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": 1 // ✅ Works
    }
  }
}
```

**Future**: Implement hardware config lookup to resolve `"core-01"` → channel number

---

### NMEA2000 Bindings (Not Yet Implemented)

```json
{
  "bindings": {
    "state": {
      "type": "nmea2000", // ❌ Not supported yet
      "pgn": 127501,
      "field": "state"
    }
  }
}
```

**Future**: Implement NMEA signal ID calculation

---

### Incoming Messages (Not Yet Implemented)

- Components don't receive status updates from EmpirBus yet
- No state synchronization from hardware → UI
- Indicator component doesn't update from incoming messages

**Future**: Implement message dispatcher in Step 7

---

## 🎯 What Works Now

✅ **WebSocket Connection**:

- Auto-connect on load
- Auto-reconnect with backoff
- Heartbeat ACK (keep-alive)
- Connection state visible

✅ **Toggle Component**:

- Sends ON message on click (state = 1)
- Sends OFF message on click (state = 0)
- Local state for instant UI feedback

✅ **Button Component**:

- Sends PRESS message on pointer down (state = 1)
- Sends RELEASE message on pointer up/cancel/leave (state = 0)
- Proper pointer event handling (no stuck buttons)

✅ **Production Build**:

- ES2017 compliant
- Minified and optimized
- Deployed to `/web/index1.html`
- Ready for .ebp packaging

---

## 🔜 Next Steps

### Step 7: Incoming Message Handling

- Implement message dispatcher
- Subscribe to signals on connect
- Update component state from incoming messages
- Synchronize UI with hardware state

### Step 8: Hardware Config Lookup

- Resolve string channel references (`"core-01"` → 1)
- Support configurator-generated schemas
- Map hardware config → channel IDs

### Step 9: Remaining Components

- Dimmer with slider control
- Gauge with numeric display
- More component types

### Step 10: Layout System

- Tab navigation
- Section layout
- Responsive grid

---

## 📚 Related Documentation

- [WebSocket Integration Complete](./WEBSOCKET_INTEGRATION_COMPLETE.md)
- [HMI Deployment Guide](./HMI_DEPLOYMENT_GUIDE.md)
- [Device Testing Quickstart](./DEVICE_TESTING_QUICKSTART.md)
- [reference-script.js](./reference-script.js)

---

**Session End**: October 3, 2025  
**Status**: ✅ Ready for device testing with WebSocket communication!
