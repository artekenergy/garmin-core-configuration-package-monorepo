# Enhanced Error Modal - Specific Array Details & Fix Suggestions

**Date:** October 7, 2025
**Enhancement:** Added detailed array context and actionable fix suggestions

## What's New

### 1. Smarter Path Formatting

**Before:**

```
Path: hardware → outputs → 0 → label
```

**After:**

```
Location: Hardware → Outputs → Channel #1 → Label
```

### Key Improvements:

- ✅ **Array indices now show context**: Instead of `0`, shows `Channel #1`, `Tank #2`, etc.
- ✅ **Capitalized field names**: `label` becomes `Label`, `control` becomes `Control`
- ✅ **CamelCase split**: `genesisBoards` becomes `Genesis Boards`
- ✅ **Human-readable labels**: Changed "Path:" to "Location:" for clarity

## 2. Context-Aware Array Descriptions

The modal now recognizes common arrays and provides meaningful context:

| Array Path                          | Old Format                                 | New Format                                                          |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| `hardware.outputs[0]`               | `outputs → 0`                              | `Outputs → Channel #1`                                              |
| `plumbing.tanks[2]`                 | `tanks → 2`                                | `Tanks → Tank #3`                                                   |
| `tabs[1].sections[0]`               | `tabs → 1 → sections → 0`                  | `Tabs → Tab #2 → Sections → Section #1`                             |
| `hardware.halfBridgePairs[0]`       | `halfBridgePairs → 0`                      | `Half Bridge Pairs → Pair #1`                                       |
| `tabs[0].sections[0].components[3]` | `tabs → 0 → sections → 0 → components → 3` | `Tabs → Tab #1 → Sections → Section #1 → Components → Component #4` |

### Recognized Arrays:

- **`outputs`** → Channel #N
- **`tanks`** → Tank #N
- **`sections`** → Section #N
- **`components`** → Component #N
- **`tabs`** → Tab #N
- **`genesisBoards`** → Board #N
- **`halfBridgePairs`** → Pair #N

## 3. Actionable Fix Suggestions

Each error now includes a 💡 **Fix Suggestion** box with specific guidance:

### Hardware Errors

**Error**: Missing label for output channel

```
Location: Hardware → Outputs → Channel #3 → Label
💡 Go to Hardware Configuration page and provide a descriptive
   label for this output channel.
```

**Error**: Invalid control type

```
Location: Hardware → Outputs → Channel #1 → Control
💡 Go to Hardware Configuration page and select a valid control
   type (toggle, momentary, dimmer, etc.).
```

**Error**: Genesis board count invalid

```
Location: Hardware → Genesis Boards
💡 Go to Hardware Configuration page and set the correct number
   of Genesis boards (0-4).
```

**Error**: Half-bridge pair misconfigured

```
Location: Hardware → Half Bridge Pairs → Pair #1
💡 Go to Hardware Configuration page and ensure half-bridge pairs
   are properly configured with valid output IDs.
```

### Power Errors

**Error**: Battery management not configured

```
Location: Power → Battery Management
💡 Go to Power Configuration page and configure your battery
   management system settings.
```

**Error**: Solar array settings invalid

```
Location: Power → Solar → Primary Array
💡 Go to Power Configuration page and configure your solar array
   settings if enabled.
```

**Error**: MultiPlus settings required

```
Location: Power → Multiplus → L1
💡 Go to Power Configuration page and configure your MultiPlus
   inverter/charger settings.
```

### HVAC Errors

**Error**: Heating source not specified

```
Location: HVAC → Heating → Sources → Diesel
💡 Go to HVAC Configuration page and configure your heating
   system sources and distribution.
```

**Error**: Cooling brand required

```
Location: HVAC → Cooling → Brand
💡 Go to HVAC Configuration page and select your air conditioning
   brand and model.
```

**Error**: Ventilation fan count invalid

```
Location: HVAC → Ventilation → Fans
💡 Go to HVAC Configuration page and set the number of
   ventilation fans (1-4).
```

### Plumbing Errors

**Error**: Tank type not selected

```
Location: Plumbing → Tanks → Tank #2 → Type
💡 Go to Plumbing Configuration page and select a valid tank
   type (fresh, waste, black, gray, fuel).
```

**Error**: Monitoring source missing

```
Location: Plumbing → Monitoring Source
💡 Go to Plumbing Configuration page and select your tank
   monitoring source (Cerbo GX or ITC).
```

**Error**: Tank count mismatch

```
Location: Plumbing → Count
💡 Go to Plumbing Configuration page and ensure the tank count
   matches the number of tanks configured.
```

### Accessories Errors

**Error**: Keypad configuration incomplete

```
Location: Accessories → Keypad → Count
💡 Go to Accessories Configuration page and configure your
   keypad settings (count and buttons per keypad).
```

**Error**: ITC lighting modules invalid

```
Location: Accessories → ITC Lighting → Modules
💡 Go to Accessories Configuration page and configure your ITC
   lighting modules and zones.
```

**Error**: Awning control type not set

```
Location: Accessories → Awning → Control Type
💡 Go to Accessories Configuration page and configure your
   awning control type (RVC or Relay).
```

**Error**: Slide control settings missing

```
Location: Accessories → Slides → Control Type
💡 Go to Accessories Configuration page and configure your
   slide-out control settings.
```

### Tab/Section Errors

**Error**: Section type invalid

```
Location: Tabs → Tab #1 → Sections → Section #2 → Type
💡 Go to Editor page and set a valid section type (switching,
   signal-values, or image).
```

**Error**: Section title missing

```
Location: Home → Section 1 → Title
💡 Go to Editor page and provide a title for this tab or section.
```

**Error**: Components required

```
Location: Tabs → Tab #3 → Sections → Section #1 → Components
💡 Go to Editor page and add at least one component to this
   section, or disable the section.
```

### Metadata Errors

**Error**: Project name missing

```
Location: Metadata → Name
💡 Provide a descriptive name for your HMI configuration in
   the project settings.
```

**Error**: Version format invalid

```
Location: Metadata → Version
💡 Provide a valid version number (e.g., "1.0.0") in the
   project settings.
```

## 4. Generic Fix Suggestions

For common error codes without specific context:

### `invalid_type`

```
💡 The value type is incorrect. Check that numbers are entered
   as numbers, text as text, etc.
```

### `too_small` / `too_big`

```
💡 The value is outside the allowed range. Check the valid
   range for this field.
```

### `invalid_enum_value`

```
💡 The value must be one of the predefined options. Select
   from the dropdown or valid choices.
```

## Visual Example

### Complete Error Display

```
┌─────────────────────────────────────────────────────────────┐
│ 🔌 Hardware Configuration (3 errors)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ 1. Expected string, received number                          │
│    Location: Hardware → Outputs → Channel #2 → Label         │
│    ┌───────────────────────────────────────────────────────┐│
│    │ 💡 Go to Hardware Configuration page and provide a    ││
│    │    descriptive label for this output channel.         ││
│    └───────────────────────────────────────────────────────┘│
│    Error Code: invalid_type                                  │
│                                                               │
│ 2. Invalid control type                                      │
│    Location: Hardware → Outputs → Channel #3 → Control       │
│    ┌───────────────────────────────────────────────────────┐│
│    │ 💡 Go to Hardware Configuration page and select a     ││
│    │    valid control type (toggle, momentary, dimmer,     ││
│    │    etc.).                                              ││
│    └───────────────────────────────────────────────────────┘│
│    Error Code: invalid_enum_value                            │
│                                                               │
│ 3. Genesis board count must be between 0 and 4               │
│    Location: Hardware → Genesis Boards                       │
│    ┌───────────────────────────────────────────────────────┐│
│    │ 💡 Go to Hardware Configuration page and set the      ││
│    │    correct number of Genesis boards (0-4).            ││
│    └───────────────────────────────────────────────────────┘│
│    Error Code: too_big                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### Path Formatting Logic

```typescript
const formattedParts = path.map((part, index) => {
  // Detect array indices (numbers)
  if (!isNaN(Number(part))) {
    const prevPart = path[index - 1];

    // Map to human-readable labels
    if (prevPart === 'outputs') return `Channel #${Number(part) + 1}`;
    if (prevPart === 'tanks') return `Tank #${Number(part) + 1}`;
    if (prevPart === 'sections') return `Section #${Number(part) + 1}`;
    // ... etc

    return `[${part}]`; // Generic array index fallback
  }

  // Format field names (camelCase → Title Case)
  return part
    .split(/(?=[A-Z])/) // Split on capital letters
    .join(' ') // Join with spaces
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
});
```

### Fix Suggestion Logic

```typescript
const getFixSuggestion = (error): string | null => {
  const path = error.path;
  const message = error.message.toLowerCase();
  const code = error.code;

  // Check path hierarchy for context
  if (path[0] === 'hardware') {
    if (path.includes('outputs') && message.includes('label')) {
      return 'Go to Hardware Configuration page and provide a descriptive label...';
    }
    // ... more specific checks
  }

  // Fall back to generic suggestions based on error code
  if (code === 'invalid_type') {
    return 'The value type is incorrect. Check that numbers are...';
  }

  return null; // No suggestion available
};
```

## Benefits

### Before Enhancement

❌ **Error Display:**

```
Expected string, received number
Path: hardware → outputs → 0 → label
Code: invalid_type
```

**User Confusion:**

- "Which output is 0?"
- "Is that the first one or zero-indexed?"
- "What do I need to do to fix this?"
- "Where do I go in the UI?"

### After Enhancement

✅ **Error Display:**

```
Expected string, received number
Location: Hardware → Outputs → Channel #1 → Label
💡 Go to Hardware Configuration page and provide a descriptive
   label for this output channel.
Error Code: invalid_type
```

**User Clarity:**

- ✅ Knows exactly which channel (Channel #1)
- ✅ Understands it's the first output
- ✅ Has clear instructions on what to do
- ✅ Knows which page to navigate to

## Real-World Examples

### Example 1: Multiple Tank Errors

```
💧 Plumbing System (3 errors)

1. Tank type is required
   Location: Plumbing → Tanks → Tank #1 → Type
   💡 Go to Plumbing Configuration page and select a valid tank type
      (fresh, waste, black, gray, fuel).

2. Tank name exceeds maximum length
   Location: Plumbing → Tanks → Tank #2 → Name
   💡 The value is outside the allowed range. Check the valid range
      for this field.

3. Expected number, received string
   Location: Plumbing → Tanks → Tank #3 → Capacity
   💡 The value type is incorrect. Check that numbers are entered as
      numbers, text as text, etc.
```

**User Action:**

1. Goes to Plumbing Configuration page
2. Sees Tank #1, sets type to "Fresh"
3. Sees Tank #2, shortens the name
4. Sees Tank #3, enters capacity as a number

### Example 2: Hardware Channel Configuration

```
🔌 Hardware Configuration (4 errors)

1. Output label is required
   Location: Hardware → Outputs → Channel #5 → Label
   💡 Go to Hardware Configuration page and provide a descriptive
      label for this output channel.

2. Control type is invalid
   Location: Hardware → Outputs → Channel #7 → Control
   💡 Go to Hardware Configuration page and select a valid control
      type (toggle, momentary, dimmer, etc.).

3. Source board ID is required
   Location: Hardware → Outputs → Channel #8 → Source
   💡 Go to Hardware Configuration page and configure your output
      source settings.

4. Half-bridge pair output IDs must match
   Location: Hardware → Half Bridge Pairs → Pair #2
   💡 Go to Hardware Configuration page and ensure half-bridge pairs
      are properly configured with valid output IDs.
```

**User Action:**

1. Goes to Hardware Configuration page
2. Finds Channel #5, adds label "Main Cabin Lights"
3. Finds Channel #7, selects "Dimmer" from dropdown
4. Finds Channel #8, sets source board
5. Reviews Pair #2 in half-bridge section, fixes output IDs

## Testing Scenarios

### Test 1: Array Index Context

1. Create error in `outputs[2]`
2. Open error modal
3. **Expected**: Shows "Channel #3" (not "2")
4. **Result**: ✅ Displays correctly with 1-based indexing

### Test 2: Fix Suggestions

1. Create error with missing hardware label
2. Open error modal
3. **Expected**: Shows fix suggestion pointing to Hardware page
4. **Result**: ✅ Displays actionable suggestion

### Test 3: Nested Arrays

1. Create error in `tabs[0].sections[1].components[0]`
2. Open error modal
3. **Expected**: Shows "Tab #1 → Section #2 → Component #1"
4. **Result**: ✅ All array indices formatted with context

### Test 4: Field Name Formatting

1. Create error in `itcLighting` field
2. Open error modal
3. **Expected**: Shows "ITC Lighting" (not "itcLighting")
4. **Result**: ✅ CamelCase split and capitalized

## Conclusion

The enhanced error modal now provides:

- ✅ **Specific array identification** with human-readable labels
- ✅ **1-based indexing** (Channel #1, not Channel #0)
- ✅ **Actionable fix suggestions** for every error category
- ✅ **Clear navigation instructions** to the relevant config page
- ✅ **Better field name formatting** (camelCase → Title Case)
- ✅ **Contextual guidance** based on error type and location

Users can now quickly identify **which specific item** has an error and know **exactly how to fix it**! 🎉
