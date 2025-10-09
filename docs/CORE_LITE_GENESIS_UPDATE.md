# CORE LITE Genesis Board Update

## Date: October 7, 2025

## Change Summary

Updated Genesis board management to reflect that **CORE LITE systems include 1 Genesis board by default** and can add up to 3 more for a total of 4 boards.

---

## Updated Genesis Board Limits

### CORE System

- **Included**: 0 Genesis boards (optional add-on)
- **Range**: 0 to 4 boards
- **Total Channels**: 20 CORE + 0-16 Genesis = 20-36 total

### CORE LITE System (UPDATED)

- **Included**: 1 Genesis board (always included)
- **Additional**: Up to 3 more boards
- **Range**: 1 to 4 boards (minimum 1)
- **Total Channels**: 6 CORE-LITE + 4-16 Genesis = 10-22 total

---

## User Interface Changes

### Button Display

**CORE System:**

```
Number of Genesis Boards:
[0] [1] [2] [3] [4]
```

**CORE LITE System:**

```
Total Genesis Boards (1 included + up to 3 additional):
[1] [2] [3] [4]
```

_Note: 0 button is not shown for CORE LITE_

---

## Behavior

### Initial State

- **New CORE configuration**: Starts with 0 Genesis boards
- **New CORE LITE configuration**: Starts with 0 boards, but will be set to 1 when user first views Hardware Config

### Switching System Types

**CORE → CORE LITE:**

- If Genesis boards = 0: Automatically set to 1
- If Genesis boards = 1-4: Maintained (within valid range)
- Genesis channels preserved

**CORE LITE → CORE:**

- Genesis board count maintained (1-4 is valid for both)
- Genesis channels preserved
- Can now reduce to 0 if desired

### User Actions

**CORE LITE User clicks "1":**

- 1 Genesis board (the included board)
- 4 Genesis channels (GENESIS #1-4)

**CORE LITE User clicks "4":**

- 4 Genesis boards (1 included + 3 additional)
- 16 Genesis channels (GENESIS #1-16)

---

## Technical Implementation

### Minimum Board Logic

```typescript
// CORE LITE always has at least 1 Genesis board
const minBoards = hardwareConfig.systemType === 'core-lite' ? 1 : 0;
const maxBoards = 4;
const newCount = Math.max(minBoards, Math.min(count, maxBoards));
```

### UI Rendering

```typescript
{Array.from({ length: 5 }, (_, i) => {
  const minBoards = hardwareConfig.systemType === 'core-lite' ? 1 : 0;
  if (i < minBoards) return null; // Hide 0 button for CORE LITE
  return <button>{i}</button>;
})}
```

---

## Migration Notes

### Existing CORE LITE Configurations

If a CORE LITE configuration has `genesisBoards: 0`:

- Will be automatically updated to 1 when Hardware Config page is opened
- User will see 4 Genesis channels (GENESIS #1-4) appear
- No data loss

### Schema Compatibility

The schema allows 0-4 for both systems, but the UI enforces:

- CORE: 0-4
- CORE LITE: 1-4

---

## Examples

### Example 1: New CORE LITE Configuration

```
User creates new configuration
System Type: CORE LITE (default)
Genesis Boards: 0 (schema default)

User opens Hardware Configuration page
→ Genesis boards automatically set to 1
→ 4 Genesis channels appear (GENESIS #1-4)
→ Total: 6 CORE-LITE + 4 Genesis = 10 channels
```

### Example 2: CORE LITE with Additional Boards

```
Initial: CORE LITE with 1 Genesis board (included)
Channels: 6 CORE-LITE + 4 Genesis = 10 total

User clicks "3" button
→ 3 total Genesis boards (1 included + 2 additional)
→ 12 Genesis channels (GENESIS #1-12)
→ Total: 6 CORE-LITE + 12 Genesis = 18 channels
```

### Example 3: Maximum Genesis Boards

```
User configures CORE LITE system
Clicks "4" button
→ 4 total Genesis boards (1 included + 3 additional)
→ 16 Genesis channels (GENESIS #1-16)
→ Total: 6 CORE-LITE + 16 Genesis = 22 channels
```

---

## Files Modified

1. **Schema** (`packages/schema/src/schema.ts`)
   - Updated comment: `// CORE: 0-4 boards, CORE LITE: 1-4 boards (1 included + up to 3 additional)`

2. **Hardware Config Page** (`packages/web-configurator/src/pages/HardwareConfigPage.tsx`)
   - Updated `handleSystemTypeChange()`: Set minimum to 1 for CORE LITE
   - Updated `handleGenesisBoardsChange()`: Enforce minimum of 1 for CORE LITE
   - Updated UI: Different label for CORE LITE, hide 0 button

3. **Documentation** (`docs/GENESIS_BOARD_MANAGEMENT.md`)
   - Updated limits section
   - Updated examples
   - Clarified CORE LITE includes 1 board

---

## Summary

✅ **CORE System**: 0-4 Genesis boards (optional)  
✅ **CORE LITE System**: 1-4 Genesis boards (1 included, up to 3 additional)  
✅ **UI**: Shows only valid options for each system type  
✅ **Automatic**: CORE LITE enforces minimum of 1 board  
✅ **Preserved**: Configurations maintained during system type switches

---

**Status**: ✅ Complete  
**Build**: ✅ Passing  
**Backward Compatible**: ✅ Yes (auto-adjusts to minimum)
