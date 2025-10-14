# HMI UI Theme Customization

## 4-Color Theme System

The HMI UI uses a simple 4-color theme system that controls all visual styling:

### The Four Colors

1. **Primary** - Main interactive elements (buttons, links, active states)
2. **Secondary** - Supporting elements (backgrounds, cards, containers)
3. **Accent** - Highlights, focus states, and visual emphasis
4. **Text** - All text content (headings, labels, body text)

### How to Customize

#### Option 1: Use a Built-in Theme

Set the `data-theme` attribute on the `<html>` element:

```html
<html data-theme="blue">
  <!-- or -->
  <html data-theme="purple">
    <html data-theme="green">
      <html data-theme="orange">
        <html data-theme="red">
          <html data-theme="cyan">
            <html data-theme="dark">
              <html data-theme="light"></html>
            </html>
          </html>
        </html>
      </html>
    </html>
  </html>
</html>
```

#### Option 2: Create a Custom Theme

Define your own 4-color palette in CSS:

```css
[data-theme='custom'] {
  --color-primary: #your-color; /* Main interactive color */
  --color-secondary: #your-color; /* Background/supporting color */
  --color-accent: #your-color; /* Highlight color */
  --color-text: #your-color; /* Text color */
}
```

#### Option 3: Override via Schema

Set theme colors in your schema.json:

```json
{
  "theme": {
    "primary": "#3b82f6",
    "secondary": "#1e293b",
    "accent": "#06b6d4",
    "text": "#f1f5f9"
  }
}
```

### Built-in Theme Palettes

#### Blue (Default)

- Primary: `#3b82f6` (Blue)
- Secondary: `#1e293b` (Dark Slate)
- Accent: `#06b6d4` (Cyan)
- Text: `#f1f5f9` (Light)

#### Purple

- Primary: `#8b5cf6` (Purple)
- Secondary: `#1e1b4b` (Dark Indigo)
- Accent: `#a78bfa` (Light Purple)
- Text: `#f5f3ff` (Light Purple)

#### Green

- Primary: `#10b981` (Green)
- Secondary: `#064e3b` (Dark Green)
- Accent: `#34d399` (Light Green)
- Text: `#ecfdf5` (Light Green)

#### Orange

- Primary: `#f97316` (Orange)
- Secondary: `#431407` (Dark Orange)
- Accent: `#fb923c` (Light Orange)
- Text: `#fff7ed` (Light Orange)

#### Red

- Primary: `#ef4444` (Red)
- Secondary: `#450a0a` (Dark Red)
- Accent: `#f87171` (Light Red)
- Text: `#fef2f2` (Light Red)

#### Cyan

- Primary: `#06b6d4` (Cyan)
- Secondary: `#164e63` (Dark Cyan)
- Accent: `#22d3ee` (Light Cyan)
- Text: `#ecfeff` (Light Cyan)

### Color Usage Guidelines

**Primary** is used for:

- Button backgrounds
- Active toggle states
- Interactive icons
- Call-to-action elements

**Secondary** is used for:

- Page backgrounds
- Card/panel backgrounds
- Inactive button states
- Container borders

**Accent** is used for:

- Focus rings
- Hover highlights
- Selected states
- Visual emphasis points

**Text** is used for:

- All body text
- Labels and headings
- Icon colors
- Muted text (opacity reduced)

### Advanced Customization

Each color has hover and active variants that are automatically generated:

```css
--color-primary-hover: /* Slightly darker primary */ --color-primary-active:
  /* Even darker primary */
  --color-secondary-hover: /* Slightly lighter secondary */
  --color-secondary-active: /* Even lighter secondary */
  --color-accent-hover: /* Slightly darker accent */ --color-accent-active: /* Even darker accent */;
```

These are automatically calculated from your base colors, but you can override them if needed.

### Tips for Choosing Colors

1. **Contrast**: Ensure text has enough contrast against backgrounds (WCAG AA: 4.5:1 minimum)
2. **Primary vs Secondary**: Primary should be vibrant, secondary should be more subdued
3. **Accent**: Should stand out but complement the primary color
4. **Text**: Must be readable on both primary and secondary backgrounds

### Example: Creating a Marine Theme

```css
[data-theme='marine'] {
  --color-primary: #0ea5e9; /* Ocean Blue */
  --color-secondary: #082f49; /* Deep Sea */
  --color-accent: #22d3ee; /* Bright Cyan */
  --color-text: #f0f9ff; /* Foam White */
}
```

Then apply it:

```html
<html data-theme="marine"></html>
```
