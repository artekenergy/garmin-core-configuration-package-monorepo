# Theme Customization System

**Status**: ✅ Fully Implemented  
**Last Updated**: October 9, 2025

---

## 🎨 Overview

The GCG system includes a **complete theme customization** feature that allows users to customize the look and feel of their HMI interface through the web configurator. Theme colors flow from the web configurator → schema JSON → HMI-UI runtime.

---

## 🏗️ Architecture

### Flow Diagram

```
┌─────────────────────────────┐
│   Web Configurator          │
│   - Theme Config Page       │
│   - Color Pickers           │
│   - Live Preview            │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Schema (JSON)             │
│   {                         │
│     "theme": {              │
│       "preset": "blue",     │
│       "customColors": {...} │
│     }                       │
│   }                         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   HMI-UI (Preact App)       │
│   - Reads theme from schema │
│   - Sets CSS variables      │
│   - Applies to components   │
└─────────────────────────────┘
```

---

## 🎨 Theme Configuration

### Schema Structure

```typescript
{
  "theme": {
    "preset": "blue" | "purple" | "green" | "orange" | "red" | "dark" | "light",
    "customColors": {
      "primary": "#dbeafe",    // Light color (inactive state)
      "secondary": "#1e40af",  // Dark color (active state)
      "accent": "#3b82f6",     // Highlight color
      "background": "#f8fafc", // Page background
      "text": "#1e293b"        // Text color
    }
  }
}
```

### Available Theme Colors

| Color          | Purpose              | Examples                            |
| -------------- | -------------------- | ----------------------------------- |
| **Primary**    | Light/inactive state | Inactive button background, borders |
| **Secondary**  | Dark/active state    | Active button fill, active icons    |
| **Accent**     | Highlights and focus | Hover states, selected items        |
| **Background** | Page background      | Main canvas color                   |
| **Text**       | Text color           | Labels, titles, body text           |

---

## 🛠️ Web Configurator

### Theme Configuration Page

**Location**: `/theme` in web configurator

**Features**:

1. **Preset Selection** - 7 professionally designed color schemes
2. **Custom Color Overrides** - Override any color from the preset
3. **Live Preview** - See changes in real-time
4. **Color Pickers** - Visual + hex input for each color

### Preset Themes

```typescript
const THEME_PRESETS = {
  blue: {
    name: 'Ocean Blue',
    colors: {
      primary: '#dbeafe',
      secondary: '#1e40af',
      accent: '#3b82f6',
      background: '#f8fafc',
      text: '#1e293b',
    },
  },
  purple: {
    name: 'Royal Purple',
    colors: {
      primary: '#f3e8ff',
      secondary: '#6d28d9',
      accent: '#8b5cf6',
      background: '#faf5ff',
      text: '#1e293b',
    },
  },
  // ... 5 more presets
};
```

### Custom Color Overrides

Users can override specific colors without changing the entire preset:

```json
{
  "theme": {
    "preset": "blue",
    "customColors": {
      "primary": "#00ff00", // Override just primary
      "secondary": "#ff0000" // Override just secondary
      // Other colors use preset defaults
    }
  }
}
```

---

## 💻 HMI-UI Implementation

### CSS Variables

The HMI-UI uses CSS custom properties (variables) for theming:

```css
:root {
  /* Theme colors (set dynamically from schema) */
  --theme-primary: #e8ecf0;
  --theme-secondary: #1d3a52;
  --theme-accent: #3b82f6;
  --theme-background: #0a1929;
  --theme-text: #e2e8f0;
}
```

### Component Usage

All components reference theme variables:

```css
/* Round Toggle Button */
.gcg-toggle--round {
  border: 2px solid var(--theme-primary, #e8ecf0);
  color: var(--theme-primary, #e8ecf0);
}

.gcg-toggle--round.gcg-toggle--on {
  background: var(--theme-primary, #e8ecf0);
  color: var(--theme-secondary, #1d3a52);
}

/* Dimmer Slider */
.gcg-dimmer__slider-fill {
  background: var(--theme-primary, #e8ecf0);
  border-color: var(--theme-primary, #e8ecf0);
}

/* Button Active State */
.gcg-button--on {
  background: var(--theme-primary, #e8ecf0);
  border-color: var(--theme-primary, #e8ecf0);
}
```

### Runtime Application

Theme colors are applied when the schema loads:

```typescript
// packages/hmi-ui/src/App.tsx

useEffect(
  function () {
    if (schema && schema.theme) {
      const theme = schema.theme;
      const root = document.documentElement;

      // Apply custom colors if they exist
      if (theme.customColors) {
        if (theme.customColors.primary) {
          root.style.setProperty('--theme-primary', theme.customColors.primary);
        }
        if (theme.customColors.secondary) {
          root.style.setProperty('--theme-secondary', theme.customColors.secondary);
        }
        if (theme.customColors.accent) {
          root.style.setProperty('--theme-accent', theme.customColors.accent);
        }
        if (theme.customColors.background) {
          root.style.setProperty('--theme-background', theme.customColors.background);
        }
        if (theme.customColors.text) {
          root.style.setProperty('--theme-text', theme.customColors.text);
        }
      }
    }
  },
  [schema]
);
```

---

## 🎨 Color Fallback Strategy

### CSS Fallback Values

All CSS variables have fallback values for graceful degradation:

```css
color: var(--theme-primary, #e8ecf0);
/* ↑ Use custom color    ↑ Fallback if not set */
```

### Priority Order

1. **Custom colors from schema** (highest priority)
2. **Preset defaults** (if custom colors not set)
3. **CSS fallback values** (if schema has no theme)

### Example

```json
// Schema with partial custom colors
{
  "theme": {
    "preset": "blue",
    "customColors": {
      "primary": "#ff0000" // Only override primary
    }
  }
}
```

**Result**:

- Primary: `#ff0000` (custom)
- Secondary: `#1e40af` (from blue preset)
- Accent: `#3b82f6` (from blue preset)
- Background: `#f8fafc` (from blue preset)
- Text: `#1e293b` (from blue preset)

---

## 🧪 Testing Theme Changes

### In Web Configurator

1. Navigate to **Theme** page
2. Select a preset OR customize colors
3. See **Live Preview** update in real-time
4. Click **Download Configuration** to export

### In HMI-UI

1. Load schema with theme configuration
2. Colors apply automatically on schema load
3. Check browser DevTools to verify CSS variables:
   ```javascript
   getComputedStyle(document.documentElement).getPropertyValue('--theme-primary');
   ```

---

## 📋 Theme Color Usage Map

### Where Each Color is Used

#### Primary Color (`--theme-primary`)

- ✅ Round toggle border (inactive)
- ✅ Round toggle icon color (inactive)
- ✅ Round button border (inactive)
- ✅ Dimmer slider fill
- ✅ Active button background
- ✅ Toggle ON state background
- ✅ Section title color
- ✅ Active tab indicator

#### Secondary Color (`--theme-secondary`)

- ✅ Round toggle text color (ON state)
- ✅ Toggle track ON state
- ✅ Active text emphasis
- ✅ Icon color (active state)

#### Accent Color (`--theme-accent`)

- ✅ Hover states
- ✅ Focus indicators
- ✅ Interactive highlights

#### Background Color (`--theme-background`)

- ✅ Main app background
- ✅ Card backgrounds
- ✅ Modal backgrounds

#### Text Color (`--theme-text`)

- ✅ Primary text
- ✅ Labels
- ✅ Component text

---

## 🚀 Adding New Themed Components

### Step 1: Use CSS Variables

```css
.my-new-component {
  background: var(--theme-primary, #e8ecf0);
  color: var(--theme-text, #1e293b);
  border: 2px solid var(--theme-accent, #3b82f6);
}

.my-new-component--active {
  background: var(--theme-secondary, #1e40af);
  color: var(--theme-primary, #e8ecf0);
}
```

### Step 2: Always Include Fallbacks

```css
/* ✅ GOOD - Has fallback */
color: var(--theme-primary, #e8ecf0);

/* ❌ BAD - No fallback */
color: var(--theme-primary);
```

### Step 3: Test Without Theme

Ensure components work even if schema has no theme:

- Fallback values should provide a cohesive default look
- Current fallbacks use a blue/gray color scheme

---

## 🎯 Best Practices

### 1. **Consistent Color Roles**

- Use `primary` for inactive/light states
- Use `secondary` for active/dark states
- Use `accent` sparingly for highlights

### 2. **Accessibility**

- Ensure sufficient contrast between text and background
- Test with WCAG contrast checkers
- Minimum 4.5:1 for normal text, 3:1 for large text

### 3. **Fallback Colors**

- Always provide fallback values in CSS
- Fallbacks should match the default "Ocean Blue" theme
- Maintain visual consistency

### 4. **Performance**

- CSS variables are performant (no re-paint on change)
- Theme changes apply instantly
- No JavaScript recalculation needed

---

## 📊 Current Implementation Status

### ✅ Completed Features

- [x] Theme schema definition (5 colors)
- [x] Web configurator theme page
- [x] 7 preset themes
- [x] Custom color overrides
- [x] Live preview in configurator
- [x] HMI-UI runtime theme application
- [x] CSS variable system
- [x] All components themed
- [x] Fallback color system

### 🎨 Components Themed

- [x] Round toggle buttons
- [x] Round push buttons
- [x] Dimmer sliders
- [x] Standard toggles
- [x] Buttons
- [x] Tabs
- [x] Subtabs
- [x] Sections
- [x] Status bar
- [x] Gauges
- [x] Indicators

### 📝 Documentation

- [x] This document (THEME_CUSTOMIZATION.md)
- [x] Schema specification includes theme
- [x] Web configurator UI explains theming
- [x] Code comments in App.tsx

---

## 🔮 Future Enhancements

### Potential Additions

1. **More Colors**
   - Error/warning/success states
   - Disabled state colors
   - Shadow/overlay colors

2. **Dark Mode Support**
   - Automatic dark/light switching
   - Time-based themes
   - Ambient light sensor integration

3. **Advanced Customization**
   - Font family selection
   - Border radius adjustment
   - Spacing/sizing presets
   - Animation speed control

4. **Theme Templates**
   - Brand-specific templates
   - Industry-specific presets (marine, RV, industrial)
   - Seasonal themes

5. **Export/Import**
   - Share theme presets
   - Theme marketplace
   - JSON theme files

---

## 🔗 Related Files

### Web Configurator

- `packages/web-configurator/src/pages/ThemeConfigPage.tsx` - Theme editor UI
- `packages/web-configurator/src/pages/ThemeConfigPage.module.css` - Theme page styles

### HMI-UI

- `packages/hmi-ui/src/App.tsx` - Theme application logic
- `packages/hmi-ui/src/styles/components.css` - Component theming
- `packages/hmi-ui/src/styles/grid.css` - Layout theming
- `packages/hmi-ui/src/styles/main.css` - Global theming

### Schema

- `packages/schema/src/schema.ts` - ThemeConfigSchema definition

---

## ❓ FAQ

### Q: Can I add more than 5 colors?

**A**: Yes! Modify the `ThemeConfigSchema` in `packages/schema/src/schema.ts` to add new color properties, then update:

1. Web configurator theme page
2. HMI-UI App.tsx theme application
3. CSS variables in component styles

### Q: Do theme changes persist?

**A**: Yes, theme configuration is saved in the schema JSON. When the user exports the configuration, the theme is included.

### Q: Can I use gradients?

**A**: Currently, only solid colors are supported. Gradients would require schema changes and CSS updates.

### Q: What happens if theme is missing from schema?

**A**: CSS fallback values provide a default blue/gray theme. All components remain functional.

### Q: Can users upload custom theme files?

**A**: Not currently. Users must use the web configurator to set colors. Could be added as a future feature.

---

**Status**: ✅ Theme customization is fully functional and ready for production use!
