# Toggle Card Pattern Implementation - October 2, 2025

## Summary

Replaced checkbox cards with toggle switch cards on the HVAC configuration page for better visual consistency across the entire application. This establishes toggle cards as the standard pattern for individual feature switches.

---

## What Changed

### HVAC Configuration Page

**Before**: Used checkbox cards with checkmarks for heating sources, distribution methods, and features
**After**: Uses toggle switch cards with consistent toggle switches on the right side

### Affected Sections

1. **Heat Sources** (3 options)
   - Diesel Heater
   - Electric Heater  
   - Engine Heat

2. **Heat Distribution** (2 options)
   - Floor Heating
   - Forced Air Fans

3. **Additional Features** (2 options)
   - Hot Water
   - Auxiliary Zone

---

## Visual Comparison

### Old Pattern (Checkbox Cards)
```
┌─────────────────────────────────────┐
│ [Icon] Feature Name            [✓]  │
│        Description                  │
└─────────────────────────────────────┘
```
- Checkmark appears/disappears
- Card background changes to primary-light when selected
- Less intuitive for on/off actions

### New Pattern (Toggle Cards)
```
┌─────────────────────────────────────┐
│ [Icon] Feature Name        [Toggle] │
│        Description                  │
└─────────────────────────────────────┘
```
- Toggle switch shows clear on/off state
- Card background stays neutral
- Consistent with section header toggles
- More intuitive for enable/disable actions

---

## Code Changes

### HVACConfigPage.tsx

**Replaced**:
```tsx
<label className={styles.checkboxCard}>
  <input
    type="checkbox"
    checked={hvac.heating.sources.diesel}
    onChange={(e) => updateHeatingSource('diesel', e.target.checked)}
  />
  <div className={styles.checkboxContent}>
    <div className={styles.checkboxIcon}>⛽</div>
    <div className={styles.checkboxLabel}>
      <strong>Diesel Heater</strong>
      <span>Webasto/Espar hydronic heating</span>
    </div>
  </div>
  <div className={`${styles.checkmark} ${...}`}>✓</div>
</label>
```

**With**:
```tsx
<div className={styles.toggleCard}>
  <div className={styles.toggleCardContent}>
    <div className={styles.toggleCardIcon}>⛽</div>
    <div className={styles.toggleCardLabel}>
      <strong>Diesel Heater</strong>
      <span>Webasto/Espar hydronic heating</span>
    </div>
  </div>
  <label className={styles.switch}>
    <input
      type="checkbox"
      checked={hvac.heating.sources.diesel}
      onChange={(e) => updateHeatingSource('diesel', e.target.checked)}
    />
    <span className={styles.slider}></span>
  </label>
</div>
```

### HVACConfigPage.module.css

**Added**:
- `.switch` - Toggle switch component (60px × 34px)
- `.slider` - Toggle slider background and animation
- `.toggleCardGrid` - Vertical flex layout for toggle cards
- `.toggleCard` - Card with toggle switch on right
- `.toggleCardContent` - Left side content (icon + label)
- `.toggleCardIcon` - 48px icon circle
- `.toggleCardLabel` - Title and description text

**Total New CSS**: ~130 lines

---

## Pattern Hierarchy

### Level 1: Section Enable/Disable
**Component**: Section header toggle (right-aligned)
**Purpose**: Enable/disable entire feature group
**Examples**: 
- Heating System
- Air Conditioning
- Ventilation
- Tank Monitoring
- Control Keypad

**Pattern**:
```tsx
<div className={styles.titleRow}>
  <h3>🔥 Heating System</h3>
  <label className={styles.switch}>
    <input type="checkbox" ... />
    <span className={styles.slider}></span>
  </label>
</div>
```

### Level 2: Individual Features (NEW STANDARD)
**Component**: Toggle card
**Purpose**: Enable/disable individual features within a section
**Examples**:
- Heat sources (diesel, electric, engine)
- Distribution methods (floor, fans)
- Features (hot water, aux zone)
- Awning LED light
- Keypad security lock

**Pattern**:
```tsx
<div className={styles.toggleCardGrid}>
  <div className={styles.toggleCard}>
    <div className={styles.toggleCardContent}>
      <div className={styles.toggleCardIcon}>🔥</div>
      <div className={styles.toggleCardLabel}>
        <strong>Feature</strong>
        <span>Description</span>
      </div>
    </div>
    <label className={styles.switch}>
      <input type="checkbox" ... />
      <span className={styles.slider}></span>
    </label>
  </div>
</div>
```

### Level 3: Configuration Options
**Component**: Radio cards
**Purpose**: Select ONE option from multiple choices
**Examples**:
- AC brand selection (RecPro, Truma, Cruise-n-Comfort)
- Tank count (1, 2, 3, 4)
- Fan count (1, 2)
- Control type (RV-C, Analog)

**Pattern**: Use radio cards with `:has()` selectors (existing pattern)

---

## Benefits

### 1. Visual Consistency
- **Before**: Mixed patterns - section toggles + checkbox cards
- **After**: Consistent toggles throughout - section toggles + feature toggles

### 2. User Understanding
- Toggles clearly indicate on/off states
- Users familiar with toggle switches from mobile/web apps
- No confusion between selection (checkboxes) and activation (toggles)

### 3. Cleaner Design
- No checkmarks that appear/disappear
- Cards don't change background color based on state
- Toggle state is always visible on the right
- Easier to scan the page and see what's enabled

### 4. Scalability
- Easy to add more features following same pattern
- Consistent spacing with vertical layout (toggleCardGrid)
- Works well on mobile (stacks naturally)

---

## Standard Pattern Now Established

### Use Toggle Cards When:
- ✅ Individual features within an enabled section
- ✅ Independent on/off options (not mutually exclusive)
- ✅ Features that enable/disable functionality
- ✅ Sub-features of a main system

### Use Radio Cards When:
- ✅ Mutually exclusive choices (only one selection)
- ✅ Brand/model selection
- ✅ Count selection (1, 2, 3, 4)
- ✅ Type selection (RV-C, Analog)

### Use Checkbox Cards When:
- ⚠️ Legacy only - migrate to toggle cards when possible
- ❌ New development - use toggle cards instead

---

## Files Modified

1. `packages/web-configurator/src/pages/HVACConfigPage.tsx` (488 lines)
   - Replaced 3 sections of checkbox cards with toggle cards
   - Changed grid layout (`.optionGrid`) to vertical layout (`.toggleCardGrid`)

2. `packages/web-configurator/src/pages/HVACConfigPage.module.css` (460 lines)
   - Added toggle switch styles (`.switch`, `.slider`)
   - Added toggle card styles (`.toggleCard`, `.toggleCardContent`, etc.)

3. `UI_UX_STANDARDS.md`
   - Added section 1.4: Toggle Cards (Feature Switches)
   - Deprecated checkbox cards for new development
   - Documented pattern hierarchy
   - Added code examples

---

## Testing Checklist

- [x] All heat sources toggle on/off correctly
- [x] Heat distribution options toggle on/off correctly
- [x] Additional features toggle on/off correctly
- [x] Toggle switches show correct visual state (on/off)
- [x] Hover effects work on toggle cards
- [x] Cards maintain neutral background (don't change on toggle)
- [x] Responsive layout works on smaller screens
- [x] Summary section reflects correct enabled features
- [x] Progressive disclosure still works (only show when heating enabled)
- [x] CSS follows established spacing and color variables

---

## Migration Guide for Other Pages

### Power Configuration Page
**Recommendation**: Migrate DC charging checkboxes to toggle cards
- Second Alternator → Toggle card
- Orion XS DC-DC Charger → Toggle card

### Future Pages
All new subsystem pages should use toggle cards for individual features.

---

## Browser Compatibility

Toggle switches use standard CSS (no :has() needed for the switch itself), fully compatible with all modern browsers.

---

**Update Completed**: October 2, 2025  
**Pattern Status**: ✅ Standardized across HVAC, Accessories, Plumbing  
**Next Steps**: Consider migrating Power page checkboxes to match
