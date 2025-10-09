# Synchronized Half-Bridge Pairing - Behavior Summary

## Date: October 7, 2025

## Overview

Half-bridge pairing for CORE channels 3, 4, 12, and 13 now features fully synchronized behavior - both channels change together when pairing or un-pairing.

---

## Synchronized Behaviors

### 1. Pairing (Any Channel → Half-Bridge)

| Action                   | Automatic Result         |
| ------------------------ | ------------------------ |
| Channel 3 → Half-Bridge  | Channel 4 → Half-Bridge  |
| Channel 4 → Half-Bridge  | Channel 3 → Half-Bridge  |
| Channel 12 → Half-Bridge | Channel 13 → Half-Bridge |
| Channel 13 → Half-Bridge | Channel 12 → Half-Bridge |

**Example**:

```
User: Set Channel 12 = Half-Bridge
System:
  ✅ Channel 12 = Half-Bridge
  ✅ Channel 13 = Half-Bridge (automatically)
  ✅ Pair created
```

---

### 2. Un-pairing (Half-Bridge → Other Control Type)

| Action                             | Automatic Result                   |
| ---------------------------------- | ---------------------------------- |
| Channel 3: Half-Bridge → Toggle    | Channel 4: Half-Bridge → Toggle    |
| Channel 4: Half-Bridge → Momentary | Channel 3: Half-Bridge → Momentary |
| Channel 12: Half-Bridge → Not Used | Channel 13: Half-Bridge → Not Used |
| Channel 13: Half-Bridge → Toggle   | Channel 12: Half-Bridge → Toggle   |

**Example**:

```
User: Change Channel 12 from Half-Bridge → Toggle
System:
  ✅ Channel 12 = Toggle
  ✅ Channel 13 = Toggle (automatically)
  ✅ Pair removed
```

---

## Complete Workflow Examples

### Example 1: Creating a Pair

```
Initial State:
  Channel 12: Not Used
  Channel 13: Not Used

User Action: Set Channel 12 → Half-Bridge

Final State:
  Channel 12: Half-Bridge "Awning Extend" [➡️]
  Channel 13: Half-Bridge (auto-set, ready to configure)
  Pair Status: ✅ Paired
```

### Example 2: Breaking a Pair

```
Initial State:
  Channel 12: Half-Bridge "Awning Extend" [➡️]
  Channel 13: Half-Bridge "Awning Retract" [⬅️]
  Pair Status: ✅ Paired

User Action: Set Channel 12 → Toggle

Final State:
  Channel 12: Toggle "Awning Extend" [➡️]
  Channel 13: Toggle "Awning Retract" [⬅️]
  Pair Status: ❌ Independent (labels & icons preserved)
```

### Example 3: Changing Between Control Types

```
Initial State:
  Channel 3: Toggle "Cabin Lights" [💡]
  Channel 4: Momentary "Horn" [🔊]
  Pair Status: ❌ Independent

User Action: Set Channel 3 → Half-Bridge

Result:
  Channel 3: Half-Bridge "Cabin Lights" [💡]
  Channel 4: Half-Bridge "Horn" [🔊] (auto-changed)
  Pair Status: ✅ Paired
```

---

## Key Benefits

### 1. Consistency

✅ Both channels always match when paired or un-paired  
✅ No orphaned half-bridge configurations  
✅ Predictable behavior

### 2. Efficiency

✅ One action affects both channels  
✅ Less clicking and manual configuration  
✅ Faster setup workflow

### 3. Error Prevention

✅ Can't accidentally have mismatched pair states  
✅ Clear visual feedback (HALF-BRIDGE badge)  
✅ Labels and icons preserved during transitions

---

## Technical Implementation

### Code Location

`packages/web-configurator/src/pages/HardwareConfigPage.tsx`

### Pairing Logic

```typescript
// When user selects Half-Bridge:
if (updates.control === 'half-bridge') {
  // 1. Enable the pair in halfBridgePairs array
  // 2. Set BOTH channels to 'half-bridge'
  // 3. Ensure both channels exist in outputs
}
```

### Un-pairing Logic

```typescript
// When user changes away from Half-Bridge:
if (updates.control !== 'half-bridge') {
  // 1. Change pair channel to SAME control type
  // 2. Remove pair from halfBridgePairs array
  // 3. Both channels become independent
}
```

---

## User Experience Flow

### Creating a Pair

```
1. User opens Hardware Configuration
2. User selects CORE system type
3. User finds Channel 12
4. User selects "Half-Bridge" from dropdown
   ↓
5. System automatically sets Channel 13 → Half-Bridge
6. System shows HALF-BRIDGE badge on both channels
7. User configures labels and icons for each channel
```

### Breaking a Pair

```
1. Channels 12+13 are currently paired
2. User changes Channel 12 → Toggle
   ↓
3. System automatically changes Channel 13 → Toggle
4. System removes HALF-BRIDGE badges
5. System removes pair from halfBridgePairs array
6. Channels are now independent
```

---

## Schema Changes

### Before Un-pairing

```json
{
  "hardware": {
    "outputs": [
      { "id": "core-12", "control": "half-bridge", "label": "Extend" },
      { "id": "core-13", "control": "half-bridge", "label": "Retract" }
    ],
    "halfBridgePairs": [{ "source": "core", "channelA": 12, "channelB": 13, "enabled": true }]
  }
}
```

### After Un-pairing (Changed to Toggle)

```json
{
  "hardware": {
    "outputs": [
      { "id": "core-12", "control": "toggle-button", "label": "Extend" },
      { "id": "core-13", "control": "toggle-button", "label": "Retract" }
    ],
    "halfBridgePairs": []
  }
}
```

---

## Testing Scenarios

### Test 1: Synchronized Pairing

✅ Set Channel 3 → Half-Bridge  
✅ Verify Channel 4 → Half-Bridge (automatically)  
✅ Verify HALF-BRIDGE badge on both  
✅ Verify pair exists in schema

### Test 2: Synchronized Un-pairing

✅ Start with paired channels 12+13  
✅ Change Channel 12 → Toggle  
✅ Verify Channel 13 → Toggle (automatically)  
✅ Verify no HALF-BRIDGE badges  
✅ Verify pair removed from schema

### Test 3: Preserve Labels/Icons

✅ Start with paired channels with labels and icons  
✅ Change to different control type  
✅ Verify labels preserved  
✅ Verify icons preserved

### Test 4: Multiple Pairs

✅ Set Channels 3+4 → Half-Bridge (paired)  
✅ Set Channels 12+13 → Half-Bridge (paired)  
✅ Change Channels 3+4 → Toggle (un-paired)  
✅ Verify Channels 12+13 remain Half-Bridge (still paired)

---

## Edge Cases Handled

### Case 1: One Channel Doesn't Exist

- If pair channel not in outputs, it's automatically created
- New channel gets same control type
- User can then configure label and icon

### Case 2: Switching Control Types Multiple Times

- Each change synchronizes both channels
- Labels and icons always preserved
- No data loss during transitions

### Case 3: Setting Both Channels Manually

- If user changes Channel 12 → Toggle
- Then Channel 13 is already Toggle (synchronized)
- No conflict or error

---

## Summary

**Synchronized pairing ensures**:

- ✅ Both channels always match when paired/un-paired
- ✅ One action updates both channels
- ✅ Labels and icons preserved during transitions
- ✅ No orphaned configurations
- ✅ Predictable, consistent behavior

**User benefits**:

- Faster configuration workflow
- Less manual work
- Fewer errors
- Clear visual feedback

---

**Status**: ✅ Complete  
**Build**: ✅ Passing  
**Documentation**: ✅ Updated
