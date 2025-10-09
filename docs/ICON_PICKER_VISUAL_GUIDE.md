# Icon Picker - Visual Guide

## Overview
Visual reference for the icon picker feature implementation.

---

## 1. Channel Card with Icon Picker

```
┌─────────────────────────────────────────────────────────────┐
│ CORE #1                            [Toggle Button ▼]        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Water Pump                                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Icon:  ┌─────────┐  ❌                                  │ │
│ │        │  💧     │                                       │ │
│ │        │ Pump    │                                       │ │
│ │        └─────────┘                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Signal: 101  →  ToggleSwitch                                │
└─────────────────────────────────────────────────────────────┘
```

### States

**No Icon Selected:**
```
┌─────────────────────────────────────────┐
│ Icon:  ┌──────────────┐                │
│        │              │                │
│        │ + Select     │                │
│        │   Icon       │                │
│        └──────────────┘                │
└─────────────────────────────────────────┘
       (Dashed border)
```

**Icon Selected:**
```
┌─────────────────────────────────────────┐
│ Icon:  ┌──────────┐  ❌               │
│        │   💧     │                    │
│        │  Pump    │                    │
│        └──────────┘                    │
└─────────────────────────────────────────┘
    (Solid border)    (Clear button)
```

**Hover State:**
```
┌─────────────────────────────────────────┐
│ Icon:  ┌──────────┐  ❌               │
│        │   💧     │  (scale 1.1)       │
│        │  Pump    │                    │
│        └──────────┘                    │
└─────────────────────────────────────────┘
  (Lifts up, blue border, shadow)
```

---

## 2. Icon Picker Modal

```
┌───────────────────────────────────────────────────────────────┐
│  Select Icon                                           ✕     │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                ┌──────────────────────┐                      │
│                │ 📤 Upload Custom SVG │                      │
│                └──────────────────────┘                      │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │  🔥    │ │  🌊    │ │  ⚡    │ │  🌡️   │ │  💨    │   │
│  │  Fire  │ │  Pump  │ │ Heater │ │Hot Air │ │  Fan   │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │  💡    │ │  🏠    │ │  ⚙️    │ │  🔌    │ │  ☀️    │   │
│  │ Lights │ │  Home  │ │ Plumb  │ │ Power  │ │ Solar  │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                               │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │  📡    │ │  🚗    │ │  ⏰    │ │  🌊    │ │  ❄️    │   │
│  │  WiFi  │ │ Engine │ │  Time  │ │ Water  │ │   AC   │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                               │
│                      ... more icons ...                       │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Icon Card States

**Normal:**
```
┌──────────┐
│    💧    │
│   Pump   │
└──────────┘
Gray border
```

**Hover:**
```
┌──────────┐
│    💧    │ (lifts up)
│   Pump   │
└──────────┘
Blue border, shadow
```

**Selected:**
```
┌──────────┐
│    💧    │
│   Pump   │ (bold)
└──────────┘
Blue border, light blue background
```

---

## 3. Search Functionality

**Before Search:**
```
┌────────────────────────────┐
│ Search icons...             │
└────────────────────────────┘

Showing: 28 icons (All)
```

**During Search ("water"):**
```
┌────────────────────────────┐
│ water                       │
└────────────────────────────┘

┌────────┐ ┌────────┐ ┌────────┐
│  💧    │ │  🌊    │ │  🚿    │
│  Pump  │ │ Dump   │ │Hot Wtr │
└────────┘ └────────┘ └────────┘

Showing: 3 icons (Filtered)
```

**No Results:**
```
┌────────────────────────────┐
│ xyz123                      │
└────────────────────────────┘

┌──────────────────────────────┐
│                               │
│  No icons found matching      │
│         "xyz123"              │
│                               │
└──────────────────────────────┘
```

---

## 4. Custom SVG Upload Flow

**Step 1: Click Upload Button**
```
┌──────────────────────┐
│ 📤 Upload Custom SVG │ ← Click
└──────────────────────┘
```

**Step 2: File Picker Opens**
```
┌─────────────────────────────────────┐
│  Choose file to upload              │
├─────────────────────────────────────┤
│  📄 my-custom-icon.svg              │
│  📄 another-icon.svg                │
│  📁 Documents/                      │
│  📁 Downloads/                      │
├─────────────────────────────────────┤
│        [Cancel]  [Open]             │
└─────────────────────────────────────┘
```

**Step 3: Validation**
```
If valid SVG:
  ✅ Convert to data URL
  ✅ Select icon
  ✅ Close modal
  ✅ Show in preview

If invalid:
  ❌ Alert: "Please upload a valid SVG file"
  ⏸️ Stay on modal
```

**Step 4: Preview Shows Custom Icon**
```
┌─────────────────────────────────────┐
│ Icon:  ┌──────────┐  ❌            │
│        │  🎨      │                 │
│        │ Custom   │                 │
│        └──────────┘                 │
└─────────────────────────────────────┘
  (Shows user's uploaded SVG)
```

---

## 5. Responsive Layout

### Desktop (1920px)
```
Grid: 6 columns
Icon card: 120px × 120px
Modal: 800px wide
```

### Tablet (768px)
```
Grid: 4 columns
Icon card: 120px × 120px
Modal: 90% width
Controls: Horizontal layout
```

### Mobile (375px)
```
Grid: 3 columns
Icon card: 100px × 100px
Modal: 95% width
Controls: Vertical stack
Upload button: Full width
```

---

## 6. Animation Timeline

### Modal Open (300ms)
```
0ms:    opacity: 0, translateY(20px)
300ms:  opacity: 1, translateY(0)
```

### Modal Close (200ms)
```
0ms:    opacity: 1
200ms:  opacity: 0
```

### Icon Card Hover (200ms)
```
0ms:    translateY(0), border: gray
200ms:  translateY(-2px), border: blue, shadow
```

### Clear Button Hover (200ms)
```
0ms:    scale(1), bg: #ef4444
200ms:  scale(1.1), bg: #dc2626
```

---

## 7. Color Palette

```css
/* Primary Color */
--color-primary: #2563eb (Blue)

/* Backgrounds */
--color-bg-primary: #ffffff (White)
--color-bg-secondary: #f9fafb (Light gray)
--color-bg-hover: #f3f4f6 (Hover gray)

/* Borders */
--color-border: #e5e7eb (Gray border)

/* Text */
--color-text-primary: #111827 (Dark gray)
--color-text-secondary: #6b7280 (Medium gray)

/* Danger */
--color-danger: #ef4444 (Red)
```

---

## 8. Spacing System

```css
--spacing-sm: 0.5rem (8px)
--spacing-md: 1rem (16px)
--spacing-lg: 1.5rem (24px)
--spacing-xl: 2rem (32px)

/* Applied to: */
Icon card gap: 16px (md)
Modal padding: 24px (lg)
Icon preview: 64px × 64px
Clear button: 28px × 28px
```

---

## 9. Control Types and Icon Visibility

```
┌─────────────────────┬──────────────┐
│ Control Type        │ Show Icon?   │
├─────────────────────┼──────────────┤
│ Not Used            │ ❌ No        │
│ Push Button         │ ✅ Yes       │
│ Toggle Button       │ ✅ Yes       │
│ Slider              │ ❌ No        │
│ Half-Bridge (Pri)   │ ❌ No        │
│ Half-Bridge (Sec)   │ ❌ Disabled  │
└─────────────────────┴──────────────┘
```

---

## 10. Data Structure

### Library Icon (Path)
```json
{
  "id": "core-01",
  "label": "Water Pump",
  "control": "toggle-button",
  "icon": "/icons/Water Pump.svg"
}
```
**Size:** ~30 bytes (just the path)

### Custom Icon (Data URL)
```json
{
  "id": "core-02",
  "label": "Custom",
  "control": "push-button",
  "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQi..."
}
```
**Size:** ~2-10 KB (depends on SVG complexity)

**Recommendation:** Use library icons when possible for smaller schema size.

---

## 11. Error States

### Invalid File Type
```
User selects: icon.png
Alert: "Please upload a valid SVG file"
Modal: Stays open
```

### Network Error (Manifest)
```
Console: "Failed to load icon manifest: [error]"
Modal: Shows empty grid
User: Can still upload custom SVG
```

### Corrupted SVG
```
Browser displays: Broken image icon
Preview: Shows placeholder or broken image
Fix: Re-upload valid SVG
```

---

## 12. Interaction Patterns

### Click Flow
```
1. User clicks preview button
   → Modal opens
   → Icons load from manifest
   
2. User types in search
   → Grid filters in real-time
   
3. User clicks icon
   → Icon selected
   → Modal closes
   → Preview updates

4. User clicks clear X
   → Icon removed
   → Preview shows placeholder
```

### Upload Flow
```
1. User clicks upload button
   → File picker opens
   
2. User selects file
   → Validation check
   
3. If valid:
   → Read file
   → Convert to data URL
   → Auto-select
   → Close modal
   → Update preview
```

---

**Visual Guide Complete**  
For implementation details, see `ICON_PICKER_FEATURE.md`
