# HMI-UI Layout Planning

**Date**: October 8, 2025  
**Status**: Planning Phase

---

## Current Schema Structure

### Hierarchy:

```
UISchema
├── metadata (name, version, description)
├── icons[] (embedded SVG/image data)
├── hardware (outputs, channels, signals)
├── home (legacy home sections - may be deprecated)
├── power, hvac, lighting, plumbing, etc. (system configs)
└── tabs[]
    ├── Tab
    │   ├── id, title, icon, preset, enabled
    │   └── sections[]
    │       ├── Section
    │       │   ├── id, title, icon, collapsible, imageUrl
    │       │   └── components[]
    │       │       └── Component (toggle, button, dimmer, etc.)
```

### Current Schema Example (from new-hmi-configuration-schema-2.json):

```json
{
  "tabs": [
    {
      "id": "tab-home",
      "title": "Home",
      "preset": "home",
      "enabled": true,
      "sections": [
        {
          "id": "section-home-1",
          "title": "Quick Controls",
          "components": [
            { "type": "toggle", "variant": "round", ... },
            { "type": "button", "variant": "round", ... },
            { "type": "dimmer", ... }
          ]
        },
        {
          "id": "section-home-2",
          "title": "Status",
          "components": [
            { "type": "indicator", "variant": "led", ... }
          ]
        }
      ]
    },
    {
      "id": "tab-lighting",
      "title": "Lighting",
      "preset": "lighting",
      "enabled": true,
      "sections": [ ... ]
    }
  ]
}
```

---

## Current Implementation (App.tsx)

**What it does now:**

- Shows a hardcoded welcome screen
- Renders **only the first section** of the first enabled tab
- No tab navigation
- No multi-section support
- Development/demo mode only

**Current rendering logic:**

```typescript
// Find first enabled tab
const firstTab = schema.tabs.filter(tab => tab.enabled !== false)[0];

// Render ONLY first section
const firstSection = firstTab.sections[0];

return (
  <div>
    <h3>{firstSection.title}</h3>
    {firstSection.components.map(component =>
      <ComponentRenderer component={component} />
    )}
  </div>
);
```

---

## Design Goals for HMI-UI Layout

### 1. **Full-Screen App Layout**

Unlike the web configurator (which is a desktop app with sidebars), the HMI-UI runs on a **touchscreen display** and should use the entire viewport.

### 2. **Tab Navigation**

- Horizontal tabs at top (like reference image)
- Show tab title and optional icon
- Active tab highlighted
- Touch-friendly tap targets (minimum 44px height)
- Only show enabled tabs

### 3. **Section Layout**

- Each tab can have multiple sections
- Sections displayed vertically (scrollable)
- Section title with optional divider
- Optional collapsible sections
- Optional section icons

### 4. **Component Grid**

- Components arranged in responsive grid
- Grid columns based on component size/variant
- Round buttons: 4 columns on desktop, 3 on tablet, 2 on mobile
- Full-width components (dimmers, sliders): 1 column
- Indicators: 2 columns

### 5. **Responsive Design**

- **Desktop** (1024px+): 4-column grid for buttons
- **Tablet** (768-1023px): 3-column grid
- **Mobile** (< 768px): 2-column grid
- Full-width components always span all columns

---

## Layout Reference (from image)

Looking at the reference image provided:

```
┌────────────────────────────────────────────────────────────────┐
│  INTERIOR: 72°F    EXTERIOR: 65°F            TIME TO GO: 3:42  │  ← Status bar
├────────────────────────────────────────────────────────────────┤
│  INTERIOR  │  EXTERIOR  │  RGB  │                              │  ← Tabs
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ACCENT LIGHTS      MOVIE          PARTY        ACCENT LIGHTS  │  ← Section (mixed components)
│  ══○══════          (O)            (^)          ══○══════      │
│                                                                 │
│                                                                 │
│  ❄ artek  (house) (power) (fan) (light) (chain) (infinity)   │  ← Icons/Navigation
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Key observations:**

- Clean horizontal tab bar
- Status info at very top
- Mixed component types in same section (sliders + buttons)
- Icons at bottom for navigation/branding
- Lots of whitespace
- Minimal dividers

---

## Proposed Layout Structure

### Option 1: Simple Scrolling Layout (Recommended for Phase 1)

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Home]  [Lighting]  [Power]  [HVAC]  [Switch] │   │  ← Tab bar (sticky)
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Quick Controls                                  │   │  ← Section 1
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │   │
│  │  │ (🔥) │  │ (⚡) │  │ Fan  │  │ Pump │        │   │  ← Components (grid)
│  │  └──────┘  └──────┘  └──────┘  └──────┘        │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ Dimmer: Accent Lights     ○───────  50% │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Status                                          │   │  ← Section 2
│  │  ● Engine Off      ● Generator On               │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Gauges                                          │   │  ← Section 3
│  │  [Circular gauge]  [Linear gauge]               │   │
│  └─────────────────────────────────────────────────┘   │
│                        ↓ Scroll                         │
└─────────────────────────────────────────────────────────┘
```

**Pros:**

- Simple to implement
- All sections visible (just scroll)
- No complex state management
- Works well on tablets/phones

**Cons:**

- May require scrolling for many sections
- No collapsible sections (yet)

### Option 2: Collapsible Sections (Phase 2)

Same as Option 1 but sections can collapse to show only title:

```
┌─────────────────────────────────────────────────────────┐
│  Quick Controls                                    [−]  │  ← Expanded
│  ┌──────┐  ┌──────┐                                    │
│  │ (🔥) │  │ (⚡) │  ...                               │
│  └──────┘  └──────┘                                    │
├─────────────────────────────────────────────────────────┤
│  Status                                            [+]  │  ← Collapsed
├─────────────────────────────────────────────────────────┤
│  Gauges                                            [+]  │  ← Collapsed
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Steps (Proposed)

### Step 1: Tab Navigation Component ✓ (Next)

- Create `TabBar.tsx` component
- Render tabs from schema
- Handle active tab state
- Minimal styling (like reference image)

### Step 2: Tab Content Renderer

- Modify `App.tsx` to show selected tab
- Render all sections in active tab
- Vertical layout with spacing

### Step 3: Section Component

- Create `Section.tsx` component
- Title with optional icon
- Border/divider styling
- Components grid inside

### Step 4: Responsive Grid Layout

- CSS Grid for component arrangement
- Breakpoints for different screen sizes
- Component-aware spanning (full-width vs grid)

### Step 5: Collapsible Sections (Optional - Phase 2)

- Add collapse/expand state
- Animation transitions
- Persist collapsed state

### Step 6: Status Bar (Optional)

- Top bar with system info
- Connection status
- Time/date
- Optional values from schema

---

## Questions to Answer

Before we start implementing:

1. **Tab Navigation Style**
   - Horizontal tabs at top? (like reference)
   - Vertical sidebar tabs? (like some HMIs)
   - Bottom navigation bar? (like mobile apps)
2. **Section Spacing**
   - Large gaps between sections?
   - Subtle dividers?
   - Cards with borders?

3. **Component Grid**
   - Fixed column count (always 4)?
   - Responsive (4 → 3 → 2)?
   - Component-specific (round buttons = grid, dimmers = full-width)?

4. **Tab Content Transition**
   - Instant switch?
   - Fade transition?
   - Slide animation?

5. **Default Tab**
   - Always show first enabled tab?
   - Remember last viewed tab?
   - Schema-specified default?

---

## Recommendation: Start Small

**Phase 1: Basic Tab Layout**

1. Horizontal tab bar at top (fixed/sticky)
2. Simple tab switching (instant, no animation)
3. Render all sections vertically
4. Simple component grid (4 columns for round, full-width for others)
5. Minimal styling matching the clean reference design

**This gets us:**

- ✅ Full schema tab/section support
- ✅ Clean, usable interface
- ✅ Foundation for future enhancements
- ✅ Working layout to iterate on

**Then iterate:**

- Add responsive breakpoints
- Add collapsible sections
- Add animations
- Add status bar
- Refine grid system

---

## Next Action

**Let's decide:**

1. Tab navigation style (I recommend horizontal at top)
2. Section layout approach (I recommend vertical scroll, all expanded)
3. Component grid strategy (I recommend responsive with smart spanning)

Then we'll build the `TabBar` component first and wire it into `App.tsx`.

**Ready to proceed?** What are your thoughts on the tab navigation style and layout approach?
