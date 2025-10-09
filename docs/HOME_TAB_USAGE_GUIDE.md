# How to Configure Home Tab Sections in the Editor

## Quick Start

The **Home tab** in the Editor has a special configuration interface that lets you set up the two sections that appear on your home screen.

## Steps to Configure

### 1. Navigate to Editor

Go to the **Editor** page in the web configurator.

### 2. Select Home Tab

In the **left sidebar** under "Navigation Tabs", click on the **Home** tab.

You'll notice it looks different from other tabs - it should show:

- **🏠 Home Tab Sections** as the header
- Two section configuration blocks (Section 1 and Section 2)

### 3. Configure Section 1

**Edit Title:**

- Click in the title input field (default: "Quick Controls")
- Type your desired section title (max 30 characters)
- Examples: "Favorites", "Main Controls", "Quick Access"

**Select Type:**

- Click on one of the three type cards:
  - **🔘 Switching** - Toggle switches and buttons for quick control
  - **📊 Signal Values** - Real-time values like voltage, levels, temps
  - **🖼️ Image** - Custom image like floor plan or diagram

The selected card will highlight with a blue border.

### 4. Configure Section 2

Same process as Section 1:

- Edit the title (default: "Status")
- Select the section type
- Examples: "System Status", "Monitoring", "Overview"

### 5. Add Components (Optional)

Components can be added from the **Component Palette** on the right sidebar:

1. Make sure a section is selected (click on it)
2. In the right sidebar, click any available component
3. The component will be added to the selected section
4. Component count updates below the type cards

### 6. Use Regenerate Content (Recommended)

Instead of manually adding components, use the **⚡ Regenerate Content** button:

1. Click the button in the top-right header
2. Content will be automatically populated based on:
   - Your hardware configuration
   - The section types you selected
   - System configuration (power, plumbing, etc.)

**What gets generated:**

- **Switching sections** → Toggles/buttons from hardware channels
- **Signal Values sections** → Gauges/indicators for monitoring data
- **Image sections** → Image component placeholder

## Default Configuration

When you first open the Editor, the Home tab starts with:

```
Section 1: "Quick Controls" (Switching)
Section 2: "Status" (Signal Values)
```

## Tips

✅ **Choose complementary types:** Mix switching with signal values for a balanced home screen

✅ **Keep titles short:** Section titles appear in the HMI header

✅ **Use Regenerate Content:** Saves time and ensures proper component bindings

✅ **Preview your changes:** Go to the Preview page to see how it looks

## Common Configurations

### Configuration 1: Control + Monitor

```
Section 1: "Controls" (Switching)
Section 2: "System Status" (Signal Values)
```

Best for: Users who want quick control access and system monitoring

### Configuration 2: Dual Control

```
Section 1: "Lighting" (Switching)
Section 2: "Climate" (Switching)
```

Best for: Users who want dedicated control sections

### Configuration 3: Visual Reference

```
Section 1: "Floor Plan" (Image)
Section 2: "Quick Controls" (Switching)
```

Best for: Users who want a visual system overview

### Configuration 4: Full Monitoring

```
Section 1: "Power Status" (Signal Values)
Section 2: "Tank Levels" (Signal Values)
```

Best for: Users who primarily want monitoring data

## Differences from Other Tabs

The Home tab is special:

| Feature            | Home Tab          | Other Tabs             |
| ------------------ | ----------------- | ---------------------- |
| Number of sections | Fixed at 2        | Variable (add/delete)  |
| Section types      | 3 types available | No type selection      |
| Add section button | Not shown         | Available              |
| Delete section     | Not available     | Available              |
| Reorder sections   | Not available     | Available (↑↓ buttons) |

## Troubleshooting

### "⚠️ Home tab must have exactly 2 sections" error

**Problem:** The Home tab doesn't have exactly 2 sections.

**Solution:**

1. If you manually deleted sections, reset your schema
2. Or manually add sections back until there are exactly 2

### Section types don't appear

**Problem:** The Home tab is not recognized.

**Solution:**

- Make sure the tab ID is exactly `tab-home`
- Check that the tab `preset` field is set to `'home'`

### Changes don't persist

**Problem:** Configuration resets when page reloads.

**Solution:**

- Changes save to browser localStorage automatically
- Use the Export page to download your configuration
- Import your saved configuration to restore it

### Components not showing after regenerate

**Problem:** "Regenerate Content" doesn't add components.

**Solution:**

- Make sure you have hardware channels configured (Hardware page)
- Ensure the section type matches available components
- Switching sections require hardware outputs
- Signal Values sections require monitoring data sources

## Schema Structure

For reference, here's how the Home configuration is stored:

```typescript
{
  home: {
    section1: {
      type: 'switching',        // or 'signal-values' or 'image'
      title: 'Quick Controls'
    },
    section2: {
      type: 'signal-values',
      title: 'Status'
    }
  },
  tabs: [
    {
      id: 'tab-home',
      title: 'Home',
      preset: 'home',
      enabled: true,
      sections: [
        {
          id: 'section-home-1',
          title: 'Quick Controls',    // Syncs with home.section1.title
          components: [...]
        },
        {
          id: 'section-home-2',
          title: 'Status',             // Syncs with home.section2.title
          components: [...]
        }
      ]
    }
  ]
}
```

## Next Steps

After configuring your Home tab sections:

1. **Add Components** - Use Component Palette or Regenerate Content
2. **Preview** - Go to Preview page to see the layout
3. **Fine-tune** - Adjust section titles and types as needed
4. **Export** - Download your complete configuration
5. **Deploy** - Use the exported package on your Garmin device

---

**Need help?** The Home tab sections are now ready to use! Visit http://localhost:3000/editor and click "Home" to get started. 🏠
