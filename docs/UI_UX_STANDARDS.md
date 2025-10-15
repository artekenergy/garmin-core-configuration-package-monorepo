# UI/UX Design Standards

## Garmin Core Graphics Configurator - Consistency Guidelines

**Version**: 1.0.0  
**Last Updated**: October 2, 2025

---

## Overview

This document defines the consistent UI/UX patterns used throughout the Garmin Core Graphics Configurator. All subsystem configuration pages (Hardware, Power, HVAC, Plumbing, Accessories, Lighting) follow these standardized patterns to ensure a cohesive user experience.

---

## 1. Selection Patterns

### 1.1 Radio Cards (Exclusive Selection)

**Use Case**: When user must choose exactly one option from multiple choices.

**Visual States**:

- **Default**: Light gray background (#f8fafc), subtle border, 70% opacity content
- **Hover**: Light blue tint, primary color border, subtle lift transform, drop shadow
- **Selected**: Primary color border, primary-light background, 100% opacity content

**CSS Implementation**:

```css
.radioCard:has(input[type='radio']:checked) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.radioCard:has(input[type='radio']:checked) .radioContent {
  opacity: 1;
}
```

**Examples**:

- Power: AC legs (1 or 2)
- HVAC: Heating source (diesel, propane, electric)
- Plumbing: Monitoring source (Cerbo GX, SeeLeveL)
- Accessories: Control type (RV-C, analog)

### 1.2 Checkbox Cards (Multi-Select)

**DEPRECATED**: Use Toggle Cards (1.4) for better consistency

**Use Case**: When user can select zero or more options independently.

**Visual States**:

- **Default**: Light gray background (#f8fafc), subtle border, 70% opacity content
- **Hover**: Light blue tint, primary color border, subtle lift transform, drop shadow
- **Selected**: Primary color border, primary-light background, 100% opacity content

**CSS Implementation**:

```css
.checkboxCard:has(input[type='checkbox']:checked) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.checkboxCard:has(input[type='checkbox']:checked) .checkboxContent {
  opacity: 1;
}
```

**Examples**:

- Power: DC charging sources (second alternator, Orion XS)
- ~~HVAC: Heating features (aquahot, hot water, aux zone)~~ - Use Toggle Cards instead

### 1.4 Toggle Cards (Feature Switches)

**Use Case**: Individual on/off switches for features within an enabled subsystem. Preferred over checkbox cards for consistency.

**Visual States**:

- **Default**: Light gray background, subtle border, standard toggle switch on right
- **Hover**: Light blue tint, primary border, subtle lift, shadow
- **Toggle On**: Toggle switch shows primary color, card remains neutral (no background change)
- **Toggle Off**: Toggle switch shows gray

**Structure**:

```

┌─────────────────────────────────────────┐
│  [Icon]  Feature Name          [Toggle] │
│          Description text               │
└─────────────────────────────────────────┘
```

**CSS Implementation**:

```css
.toggleCardGrid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.toggleCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  transition: all 0.2s;
}

.toggleCardContent {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}
```

**Component Pattern**:

```tsx
<div className={styles.toggleCardGrid}>
  <div className={styles.toggleCard}>
    <div className={styles.toggleCardContent}>
      <div className={styles.toggleCardIcon}>🔥</div>
      <div className={styles.toggleCardLabel}>
        <strong>Feature Name</strong>
        <span>Feature description</span>
      </div>
    </div>
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={feature.enabled}
        onChange={(e) => updateFeature(e.target.checked)}
      />
      <span className={styles.slider}></span>
    </label>
  </div>
</div>
```

**Examples**:

- **HVAC**: Diesel heater, Electric heater, Engine heat (heat sources)
- **HVAC**: Floor heating, Forced air fans (distribution methods)
- **HVAC**: Hot water, Auxiliary zone (additional features)
- **Accessories**: LED awning light (when awning enabled)
- **Accessories**: Keypad security lock (when slides enabled)

**Key Difference from Section Toggles**: Toggle cards are for individual features _within_ an enabled section, while section header toggles enable/disable entire feature groups.

### 1.3 Toggle Switches

**Use Case**: Enable/disable entire subsystems or major features.

**Visual States**:

- **Off**: Gray background (#cbd5e1)
- **On**: Primary color background (#2563eb)
- **Transition**: Smooth 0.4s animation

**Placement**: Always in section headers, aligned to the right using `.titleRow` flex layout

**Standard Pattern**: ALL major features must have an enable/disable toggle

**Examples**:

- **Plumbing**: Tank Monitoring System toggle
- **HVAC**: Heating System, Air Conditioning, Ventilation (3 separate toggles)
- **Accessories**: Control Keypad, Awning Control, Slide-Out Rooms (3 separate toggles)
- **Power**: Would benefit from DC Charging toggle, Multiplus toggle

**Implementation**:

```tsx
<div className={styles.sectionHeader}>
  <div className={styles.titleRow}>
    <h3>🔥 Feature Name</h3>
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={feature.enabled}
        onChange={(e) => updateFeature({ enabled: e.target.checked })}
      />
      <span className={styles.slider}></span>
    </label>
  </div>
  <p className={styles.sectionDescription}>Feature description</p>
</div>;

{
  feature.enabled && <div className={styles.subsection}>{/* Feature configuration options */}</div>;
}
```

---

## 2. Progressive Disclosure

### 2.1 Hiding vs. Disabling

**Standard Approach**: **HIDE** content when parent feature is disabled.

**Rationale**:

- Cleaner interface
- Reduces cognitive load
- Prevents user confusion
- Focuses attention on enabled features

**Implementation**:

```tsx
{
  featureEnabled && <div className={styles.subsection}>{/* Feature configuration options */}</div>;
}
```

**DO NOT USE** grayed-out/disabled states for entire sections. Only individual inputs within an enabled section should use disabled states when contextually appropriate.

### 2.2 Section Hierarchy

**Level 1: Main Sections**

- Controlled by toggle switch in header
- Content fully hidden when disabled
- Example: Power → DC Charging, AC Power, Multiplus

**Level 2: Subsections**

- Nested within main sections
- May have additional conditional logic
- Example: HVAC → Heating Sources → Hot Water (only shown if heating enabled)

**Level 3: Inline Options**

- Individual checkboxes or radio buttons
- Example: HVAC → Heating → Aquahot checkbox

---

## 3. Visual Hierarchy

### 3.1 Page Structure

```
┌─ Container ──────────────────────────────────────┐
│  ┌─ Header ────────────────────────────────────┐ │
│  │  <h2>Page Title</h2>                        │ │
│  │  <p>Subtitle/description</p>                │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─ Section ────────────────────────────────┐    │
│  │  ┌─ Section Header ──────────────────┐   │    │
│  │  │  <h3>Section Title</h3>    [Toggle]│   │    │
│  │  │  <p>Description</p>                │   │    │
│  │  └────────────────────────────────────┘   │    │
│  │                                            │    │
│  │  ┌─ Subsection ─────────────────────┐     │    │
│  │  │  Form controls / Options         │     │    │
│  │  └──────────────────────────────────┘     │    │
│  └────────────────────────────────────────────┘    │
│                                                   │
│  ┌─ Summary Section ──────────────────────────┐  │
│  │  Glassmorphism gradient background         │  │
│  │  Configuration summary                     │  │
│  └────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

### 3.2 Typography Scale

- **Page Title (h2)**: 1.5rem, bold
- **Section Title (h3)**: 1.25rem, semi-bold
- **Subsection Title (h4)**: 1rem, semi-bold
- **Body Text**: 1rem, normal
- **Help Text**: 0.875rem, secondary color
- **Labels**: 0.875rem, semi-bold

### 3.3 Spacing System

- **`--spacing-xs`**: 0.25rem (4px)
- **`--spacing-sm`**: 0.5rem (8px)
- **`--spacing-md`**: 1rem (16px)
- **`--spacing-lg`**: 1.5rem (24px)
- **`--spacing-xl`**: 2rem (32px)

---

## 4. Color Palette

### 4.1 Core Colors

```css
--color-primary: #2563eb; /* Primary blue */
--color-primary-light: #dbeafe; /* Light blue background */
--color-bg-secondary: #f8fafc; /* Card backgrounds */
--color-bg-hover: #f1f5f9; /* Hover state */
--color-border: #e2e8f0; /* Default borders */
--color-text-primary: #1e293b; /* Main text */
--color-text-secondary: #64748b; /* Secondary text */
```

### 4.2 State Colors

- **Selected/Active**: Primary color border + primary-light background
- **Hover**: Border changes to primary, subtle background tint
- **Disabled**: 50% opacity, no interaction
- **Error**: Red border (#ef4444) when validation fails

### 4.3 Summary Sections

All pages use identical glassmorphism gradient:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
```

---

## 5. Interactive Elements

### 5.1 Buttons & Cards

**Hover Effects**:

- `transform: translateY(-2px)` - Subtle lift
- `box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1)` - Drop shadow
- Border color changes to primary
- Smooth 0.2s transition

**Active/Selected States**:

- Primary color border (2px)
- Primary-light background
- Content opacity 100%
- Maintained across all interaction types

### 5.2 Form Controls

**Text Inputs**:

- Border focus: Primary color + 3px shadow
- Max-width constraints for readability
- Placeholder text in secondary color

**Range Sliders**:

- Custom thumb styling (20px circle, primary color)
- Track: 8px height, rounded
- Value display on the right
- Tick labels below for key values

**Toggle Switches**:

- 60px × 34px dimensions
- Circular slider thumb (26px)
- Smooth 0.4s transition
- Maintains aspect ratio on all screens

---

## 6. Responsive Behavior

### 6.1 Grid Layouts

**Radio/Checkbox Groups**:

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: var(--spacing-md);
```

This ensures:

- Automatic wrapping on smaller screens
- Consistent spacing
- Minimum readable width (200px)

### 6.2 Breakpoints

- **Mobile**: < 640px - Single column
- **Tablet**: 640px - 1024px - 2 columns where applicable
- **Desktop**: > 1024px - 3-4 columns for option grids

---

## 7. Iconography

### 7.1 Emoji Icons

**Consistent Usage**:

- Each subsystem has a primary emoji in navigation
- Each section within a page has contextual emoji
- Icons are 1.5rem - 2rem in card headers
- Semantic meaning (⚡ = power, 🌡️ = temperature, 💧 = water)

**Icon Sizes**:

- Navigation: 1.25rem
- Section headers: 1.5rem (inline with h3)
- Radio/checkbox card icons: 1.5rem (inside 48px square)
- Summary items: Included in section titles

### 7.2 Standard Icons by Subsystem

- **Hardware**: 🔌
- **Power**: ⚡
- **HVAC**: 🌡️
- **Plumbing**: 💧
- **Accessories**: 🎛️
- **Lighting**: 💡
- **Editor**: ✏️
- **Preview**: 👁️
- **Export**: 📦

---

## 8. Accessibility

### 8.1 Required Patterns

1. **Keyboard Navigation**: All cards and inputs must be keyboard accessible
2. **Focus Indicators**: Visible focus states on all interactive elements
3. **Labels**: All inputs have associated labels (visible or aria-label)
4. **Color Contrast**: Minimum 4.5:1 ratio for all text
5. **Touch Targets**: Minimum 44px × 44px for mobile

### 8.2 ARIA Attributes

- Cards with hidden inputs use proper labeling
- Radio groups have `role="radiogroup"`
- Sections have `aria-labelledby` pointing to headers
- Dynamic content changes announce via `aria-live` regions

---

## 9. Animation & Transitions

### 9.1 Timing Functions

- **Default**: `transition: all 0.2s ease`
- **Toggle switches**: `transition: 0.4s`
- **Hover effects**: `0.2s`
- **Content expand/collapse**: `0.3s ease-in-out`

### 9.2 Motion Guidelines

- Keep animations subtle and purposeful
- No gratuitous animations
- Respect `prefers-reduced-motion` media query
- Max animation duration: 0.4s

---

## 10. Error Handling & Validation

### 10.1 Inline Validation

- Real-time validation as user types/selects
- Error messages appear below inputs
- Red border on invalid inputs
- Success checkmark on valid completion

### 10.2 Form-Level Validation

- Summary section at bottom shows overall status
- Navigation shows error badge if page has issues
- Prevents navigation to Export until all valid

---

## 11. Summary Sections

### 11.1 Purpose

Every subsystem page ends with a glassmorphism summary that shows:

- Current configuration at a glance
- Key metrics and counts
- Active features highlighted

### 11.2 Layout

```css
.summaryGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.summaryItem {
  background: rgba(255, 255, 255, 0.15);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  backdrop-filter: blur(10px);
}
```

### 11.3 Content Structure

Each summary item:

- **Label**: Uppercase, 0.875rem, 90% opacity
- **Value**: 1rem, bold, 100% opacity
- Semantic icons where appropriate

---

## 12. Code Conventions

### 12.1 CSS Modules

All pages use CSS Modules (`.module.css`) with consistent naming:

- `container` - Page wrapper
- `header` - Page header
- `content` - Main content area
- `section` - Major sections
- `sectionHeader` - Section title area
- `subsection` - Nested content areas
- `radioCard`, `checkboxCard` - Selection cards
- `summarySector` - Bottom summary

### 12.2 Component Structure

```tsx
export default function SubsystemConfigPage() {
  const { schema, updateSchema } = useSchema();

  // Local state derived from schema
  const config = schema.subsystem || defaultConfig;

  // Update handlers
  const updateConfig = (updates) => {
    /* ... */
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>{/* Page title */}</header>

      <div className={styles.content}>
        {/* Sections */}
        {/* Summary */}
      </div>
    </div>
  );
}
```

---

## 13. Testing Checklist

For each new subsystem page, verify:

- [ ] All radio cards use `:has(input:checked)` for active states
- [ ] All checkbox cards use `:has(input:checked)` for active states
- [ ] Progressive disclosure hides (not disables) content
- [ ] Toggle switches work and show correct visual state
- [ ] Hover effects work on all interactive elements
- [ ] Summary section displays accurate information
- [ ] Keyboard navigation works throughout
- [ ] Mobile responsive layout doesn't break
- [ ] Icons are consistent with other pages
- [ ] Colors match the standard palette
- [ ] Spacing uses CSS variables consistently

---

## 14. Migration Guide

### Updating Existing Pages to New Standards

1. **Update CSS selectors**:
   - Replace `input:checked ~ .content` with `:has(input:checked)`
   - Replace `input:checked + .card` with `:has(input:checked)`

2. **Add missing active states**:

   ```css
   .card:has(input:checked) {
     border-color: var(--color-primary);
     background: var(--color-primary-light);
   }

   .card:has(input:checked) .content {
     opacity: 1;
   }
   ```

3. **Standardize progressive disclosure**:
   - Use conditional rendering with `&&`
   - Remove disabled states on large sections
   - Keep individual input disabled states where needed

4. **Verify visual consistency**:
   - Compare with Accessories page (reference implementation)
   - Check hover effects match
   - Ensure spacing is consistent

---

## 15. Future Considerations

### 15.1 Dark Mode

When implementing dark mode:

- Invert background lightness
- Maintain color contrast ratios
- Adjust glassmorphism opacity
- Update summary gradient

### 15.2 Theming

Consider extracting all colors to CSS variables in `:root` for easier customization.

### 15.3 Component Library

Future refactor could extract common patterns into shared components:

- `<RadioCardGroup>`
- `<CheckboxCardGroup>`
- `<SectionHeader>`
- `<SummarySection>`

---

## 16. Reference Implementation

**Best Example**: `AccessoriesConfigPage.tsx` + `AccessoriesConfigPage.module.css`

This page demonstrates all standards correctly:

- ✅ Modern `:has()` selectors
- ✅ Consistent active states
- ✅ Progressive disclosure via hiding
- ✅ Range slider with live value display
- ✅ Info boxes for calculations
- ✅ Complete summary section
- ✅ Proper emoji usage
- ✅ Responsive grid layouts

**Updated Pages**:

- ✅ PowerConfigPage (CSS updated to `:has()` selectors)
- ✅ HVACConfigPage (CSS updated to `:has()` selectors)
- ✅ PlumbingConfigPage (CSS updated to `:has()` selectors)
- ✅ AccessoriesConfigPage (Already using modern patterns)

---

**Document Maintained By**: GCG Development Team  
**Questions**: Refer to this document first, then consult team lead  
**Updates**: Document version should increment with any standard changes
