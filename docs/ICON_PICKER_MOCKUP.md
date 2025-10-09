# Icon Picker - Complete UI Mockup

## Hardware Configuration Page with Icon Picker

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  Hardware Configuration                                                   ║
║  Configure output channels and hardware settings                          ║
╚═══════════════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────────────┐
│ System Type                                                               │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ◉ CORE                              ○ CORE LITE                         │
│    20 output channels,                 10 output channels                │
│    half-bridge pairing support         (6 CORE-LITE + 4 Genesis)         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│ Output Channels                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐    │
│  │ CORE #1                      │  │ CORE #2                      │    │
│  │              [Toggle Button ▼]│  │              [Push Button  ▼]│    │
│  ├──────────────────────────────┤  ├──────────────────────────────┤    │
│  │                               │  │                               │    │
│  │ ┌─────────────────────────┐  │  │ ┌─────────────────────────┐  │    │
│  │ │ Water Pump              │  │  │ │ Light Switch            │  │    │
│  │ └─────────────────────────┘  │  │ └─────────────────────────┘  │    │
│  │                               │  │                               │    │
│  │ ┌─────────────────────────┐  │  │ ┌─────────────────────────┐  │    │
│  │ │ Icon: ┌──────┐   ❌    │  │  │ │ Icon: ┌──────┐   ❌    │  │    │
│  │ │       │ 💧   │          │  │  │ │       │ 💡   │          │  │    │
│  │ │       │ Pump │          │  │  │ │       │Light │          │  │    │
│  │ │       └──────┘          │  │  │ │       └──────┘          │  │    │
│  │ └─────────────────────────┘  │  │ └─────────────────────────┘  │    │
│  │                               │  │                               │    │
│  │ Signal: 101 → ToggleSwitch   │  │ Signal: 102 → PushButton     │    │
│  └──────────────────────────────┘  └──────────────────────────────┘    │
│                                                                           │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐    │
│  │ CORE #3                      │  │ CORE #4                      │    │
│  │              [Slider        ▼]│  │              [Not Used     ▼]│    │
│  ├──────────────────────────────┤  ├──────────────────────────────┤    │
│  │                               │  │                               │    │
│  │ ┌─────────────────────────┐  │  │ (No configuration needed)    │    │
│  │ │ Fan Speed               │  │  │                               │    │
│  │ └─────────────────────────┘  │  │                               │    │
│  │                               │  │                               │    │
│  │ (No icon picker - slider)    │  │                               │    │
│  │                               │  │                               │    │
│  │ Signal: 103 → Slider         │  │                               │    │
│  └──────────────────────────────┘  └──────────────────────────────┘    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────┐
│ Summary                                                                   │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Active       │  │ Push         │  │ Toggle       │  │ Sliders      ││
│  │ Channels:    │  │ Buttons:     │  │ Buttons:     │  │              ││
│  │              │  │              │  │              │  │              ││
│  │     3 / 20   │  │     1        │  │     1        │  │     1        ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Icon Picker Modal (Opened)

```
                    ┌───────────────────────────────────────────────────────┐
                    │  Select Icon                                    ✕    │
                    ├───────────────────────────────────────────────────────┤
                    │                                                       │
                    │                ┌──────────────────────┐              │
                    │                │ 📤 Upload Custom SVG │              │
                    │                └──────────────────────┘              │
                    │                                                       │
                    ├───────────────────────────────────────────────────────┤
                    │                                                       │
                    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
                    │  │  🔥    │ │  👥    │ │  ⚡    │ │  ❄️    │       │
                    │  │  Fire  │ │  Group │ │   AC   │ │ Air    │       │
                    │  │  SVG   │ │        │ │        │ │ Comp   │       │
                    │  └────────┘ └────────┘ └────────┘ └────────┘       │
                    │                                                       │
                    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
                    │  │  💡    │ │  🔋    │ │  ⚙️    │ │  🌡️    │       │
                    │  │  All   │ │  Alt   │ │  DC    │ │ Drive  │       │
                    │  │ Lights │ │ernator │ │ Power  │ │        │       │
                    │  └────────┘ └────────┘ └────────┘ └────────┘       │
                    │                                                       │
                    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
                    │  │  🏭    │ │  💨    │ │  🔥    │ │  🏠    │       │
                    │  │ Engine │ │  Fan   │ │ Heater │ │  Home  │       │
                    │  │        │ │        │ │        │ │        │       │
                    │  └────────┘ └────────┘ └────────┘ └────────┘       │
                    │                                                       │
                    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
                    │  │  🌡️    │ │  💧    │ │  🔌    │ │  🔵    │       │
                    │  │  Hot   │ │  Hot   │ │Inverter│ │ Kind12 │       │
                    │  │  Air   │ │ Water  │ │        │ │        │       │
                    │  └────────┘ └────────┘ └────────┘ └────────┘       │
                    │                                                       │
                    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
                    │  │  🔵    │ │  💡    │ │  🚿    │ │  ⚡    │       │
                    │  │ Kind12 │ │Lightin │ │Plumbing│ │ Power  │       │
                    │  │   -1   │ │        │ │        │ │        │       │
                    │  └────────┘ └────────┘ └────────┘ └────────┘       │
                    │                                                       │
                    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
                    │  │  ☀️    │ │  ⏰    │ │  🚰    │ │  💧    │       │
                    │  │ Solar  │ │  Time  │ │ Water  │ │ Water  │       │
                    │  │        │ │        │ │ Dump   │ │ Pump   │       │
                    │  └────────┘ └────────┘ └────────┘ └────────┘       │
                    │                                                       │
                    │  ┌────────┐                                          │
                    │  │  📡    │                                          │
                    │  │  WiFi  │                                          │
                    │  │        │                                          │
                    │  └────────┘                                          │
                    │                                                       │
                    └───────────────────────────────────────────────────────┘
```

### Modal with Search Active

```
                    ┌───────────────────────────────────────────────────────┐
                    │  Select Icon                                    ✕    │
                    ├───────────────────────────────────────────────────────┤
                    │                                                       │
                    │  ┌──────────────────────┐  ┌──────────────────────┐ │
                    │  │ water                 │  │ 📤 Upload Custom SVG │ │
                    │  └──────────────────────┘  └──────────────────────┘ │
                    │                                                       │
                    ├───────────────────────────────────────────────────────┤
                    │                                                       │
                    │  ┌────────┐ ┌────────┐ ┌────────┐                   │
                    │  │  💧    │ │  🚰    │ │  💧    │                   │
                    │  │  Hot   │ │ Water  │ │ Water  │                   │
                    │  │ Water  │ │ Dump   │ │ Pump   │                   │
                    │  └────────┘ └────────┘ └────────┘                   │
                    │                                                       │
                    │  Showing 3 of 28 icons                               │
                    │                                                       │
                    └───────────────────────────────────────────────────────┘
```

---

## Icon States in Channel Card

### No Icon Selected (Initial State)
```
┌─────────────────────────────────────────┐
│ Icon:  ┌──────────────┐                │
│        │              │                │
│        │              │                │
│        │ + Select     │                │
│        │   Icon       │                │
│        │              │                │
│        └──────────────┘                │
└─────────────────────────────────────────┘
        Dashed border, gray
       Click to open modal
```

### Icon Selected
```
┌─────────────────────────────────────────┐
│ Icon:  ┌──────────┐  ❌               │
│        │          │                    │
│        │    💧    │                    │
│        │   Pump   │                    │
│        │          │                    │
│        └──────────┘                    │
└─────────────────────────────────────────┘
       Solid border          Clear button
      Click to change      Click to remove
```

### Icon Selected (Hover)
```
┌─────────────────────────────────────────┐
│ Icon:  ┌──────────┐  ❌  ← Scale 1.1  │
│        │          │ ↑                  │
│        │    💧    │ Lift -2px          │
│        │   Pump   │                    │
│        │          │                    │
│        └──────────┘                    │
└─────────────────────────────────────────┘
    Blue border, shadow     Red hover
```

---

## Upload Custom SVG Flow

### Step 1: Click Upload
```
┌──────────────────────┐
│ 📤 Upload Custom SVG │ ← Click this button
└──────────────────────┘
```

### Step 2: File Picker (Windows)
```
┌─────────────────────────────────────────────────┐
│  Open                                     ? ✕   │
├─────────────────────────────────────────────────┤
│  📂 This PC > Documents > Icons                 │
├─────────────────────────────────────────────────┤
│  Name                  Date Modified     Type   │
│  ─────────────────────────────────────────────  │
│  📄 custom-icon.svg    10/2/2025        SVG     │
│  📄 my-logo.svg        10/1/2025        SVG     │
│  📄 special.svg        9/30/2025        SVG     │
│  📁 Archive                                     │
│  📁 Templates                                   │
├─────────────────────────────────────────────────┤
│  File name: custom-icon.svg                     │
│                                                  │
│  Files of type: SVG Files (*.svg)         ▼     │
│                                                  │
│                        [Cancel]  [Open]         │
└─────────────────────────────────────────────────┘
```

### Step 3: Validation & Conversion
```
┌────────────────────────────────┐
│  ✅ File valid                 │
│  📖 Reading file...            │
│  🔄 Converting to data URL...  │
│  ✅ Icon selected              │
│  ✔️ Modal closed               │
└────────────────────────────────┘
```

### Step 4: Result
```
┌─────────────────────────────────────────┐
│ Icon:  ┌──────────┐  ❌               │
│        │          │                    │
│        │   🎨     │  (Your custom SVG) │
│        │  Custom  │                    │
│        │          │                    │
│        └──────────┘                    │
└─────────────────────────────────────────┘
```

---

## Responsive Layouts

### Desktop (1920px)
```
Channel Grid: 4 columns
Icon Modal Grid: 6 columns
Icon Card: 120px × 120px
Modal Width: 800px
```

### Tablet (768px)
```
Channel Grid: 2 columns
Icon Modal Grid: 4 columns
Icon Card: 120px × 120px
Modal Width: 90%
```

### Mobile (375px)
```
Channel Grid: 1 column
Icon Modal Grid: 3 columns
Icon Card: 100px × 100px
Modal Width: 95%

Search & Upload stack vertically
Upload button: Full width
```

---

## Interaction Annotations

### Preview Button
```
┌──────────────┐
│ + Select     │
│   Icon       │
└──────────────┘
      ↓ CLICK
┌──────────────────────┐
│ Icon Picker Modal    │
│ Opens with slide-up  │
│ animation (300ms)    │
└──────────────────────┘
```

### Icon Selection
```
┌────────┐
│  💧    │
│  Pump  │ ← CLICK
└────────┘
    ↓
┌────────┐
│  💧    │ ✓ Selected (blue border)
│  Pump  │
└────────┘
    ↓
Modal closes (200ms fade)
    ↓
Preview updates with selected icon
```

### Clear Button
```
┌──────────┐  ❌
│    💧    │  ↑ CLICK
│   Pump   │
└──────────┘
      ↓
Icon removed from schema
      ↓
┌──────────────┐
│ + Select     │
│   Icon       │
└──────────────┘
```

---

## Color Legend

```
🔵 Primary Blue (#2563eb)
   - Selected icons
   - Hover borders
   - Primary actions

⚫ Gray (#e5e7eb)
   - Default borders
   - Disabled states
   - Placeholders

🔴 Red (#ef4444)
   - Clear button
   - Delete actions
   - Warnings

⚪ White (#ffffff)
   - Modal background
   - Card backgrounds
   - Button text

🌫️ Light Gray (#f9fafb)
   - Secondary backgrounds
   - Hover states
   - Input backgrounds
```

---

## Animation Timeline

```
Modal Open:
0ms    │ Opacity: 0, Y: +20px
       │
100ms  │ Opacity: 0.5, Y: +10px
       │
200ms  │ Opacity: 0.8, Y: +5px
       │
300ms  │ Opacity: 1, Y: 0px ✓
       └─ Ease-out curve

Icon Card Hover:
0ms    │ Y: 0, Border: Gray
       │
200ms  │ Y: -2px, Border: Blue ✓
       └─ Ease transition

Clear Button Hover:
0ms    │ Scale: 1.0, BG: #ef4444
       │
200ms  │ Scale: 1.1, BG: #dc2626 ✓
       └─ Ease transition
```

---

**Complete UI Mockup**  
**Implementation Status**: ✅ Complete  
**Ready for Testing**: ✅ Yes
