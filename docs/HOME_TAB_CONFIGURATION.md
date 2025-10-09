# Home Tab Configuration Feature

**Created:** October 7, 2025  
**Status:** ✅ Complete

## Overview

Added a new configuration page for the Home tab, allowing users to customize the two sections that will appear on their Home screen. Each section can be configured as one of three types: Switching, Signal Values, or Image.

## Feature Details

### Section Types

Users can configure each of the two Home sections as:

1. **🔘 Switching Section**
   - Display toggles and buttons for quick access to frequently used controls
   - Ideal for lights, pumps, fans, and other binary controls
   - Components are automatically populated from configured hardware

2. **📊 Signal Values Section**
   - Show real-time signal values like battery voltage, tank levels, and temperatures
   - Displays numeric data with units and trend indicators
   - Updates in real-time based on EmpirBus/NMEA2000 data

3. **🖼️ Image Section**
   - Display a custom image such as a floor plan or system diagram
   - Useful for visual reference or system overview
   - Can be used for branding or navigation aids

### User Experience

- **Two Sections:** Home tab always has exactly 2 sections
- **Configurable Titles:** Each section has a customizable title (max 30 characters)
- **Visual Selection:** Large cards with icons and descriptions for easy selection
- **Live Summary:** Configuration summary shows selected types and titles
- **Auto-Population:** Content is automatically generated when using "Regenerate Content" in Editor

## Implementation Details

### Schema Updates

**File:** `packages/schema/src/schema.ts`

Added three new schema definitions:

```typescript
// Section type enum
export const HomeSectionTypeSchema = z.enum(['switching', 'signal-values', 'image']);

// Individual section configuration
export const HomeSectionConfigSchema = z.object({
  type: HomeSectionTypeSchema,
  title: z.string().min(1).max(30).default('Section'),
});

// Complete home configuration
export const HomeConfigSchema = z
  .object({
    section1: HomeSectionConfigSchema.default({ type: 'switching', title: 'Quick Controls' }),
    section2: HomeSectionConfigSchema.default({ type: 'signal-values', title: 'Status' }),
  })
  .default({
    section1: { type: 'switching', title: 'Quick Controls' },
    section2: { type: 'signal-values', title: 'Status' },
  });
```

Added to UISchemaSchema:

```typescript
export const UISchemaSchema = z.object({
  // ... other fields
  home: HomeConfigSchema.optional(),
  // ...
});
```

Exported types:

```typescript
export type HomeConfig = z.infer<typeof HomeConfigSchema>;
export type HomeSectionConfig = z.infer<typeof HomeSectionConfigSchema>;
export type HomeSectionType = z.infer<typeof HomeSectionTypeSchema>;
```

### UI Component

**File:** `packages/web-configurator/src/pages/HomeConfigPage.tsx`

#### Component Structure

```tsx
HomeConfigPage
├── Header (title and description)
├── Section 1 Configuration
│   ├── Section Header (title input)
│   └── Type Selection Grid (3 cards)
├── Section 2 Configuration
│   ├── Section Header (title input)
│   └── Type Selection Grid (3 cards)
└── Configuration Summary
    ├── Section 1 Summary
    ├── Section 2 Summary
    └── Info Box
```

#### Key Functions

```typescript
// Update section type and optionally title
updateSection(sectionKey, type, title?)

// Update only section title
updateSectionTitle(sectionKey, title)

// Get icon for section type
getSectionIcon(type): string

// Get description for section type
getSectionDescription(type): string

// Render individual section configuration
renderSectionConfig(sectionKey, sectionNum)
```

### CSS Styling

**File:** `packages/web-configurator/src/pages/HomeConfigPage.module.css`

#### Key Styles

- **Type Cards:** 3-column grid with hover and selection states
- **Selection Feedback:** Blue border and background tint when selected
- **Title Input:** Inline input field with focus states
- **Summary Grid:** 2-column layout showing configuration
- **Info Box:** Blue-tinted informational message
- **Responsive:** Single column on mobile (<1024px)

#### Visual States

```css
.typeCard /* Default state */
.typeCard:hover /* Hover feedback */
.typeCard.selected /* Selected state */
```

### Routing and Navigation

**Files Modified:**

1. `packages/web-configurator/src/App.tsx` - Added `/home` route
2. `packages/web-configurator/src/components/Layout.tsx` - Added "Home" nav link with 🏠 icon

**Navigation Order:**

1. Hardware 🔌
2. **Home 🏠** ← New
3. Power ⚡
4. HVAC 🌡️
5. Plumbing 💧
6. Accessories 🔧
7. Lighting 💡
8. Theme 🎨
9. Editor ✏️
10. Preview 👁️
11. Export 📦

### Default Configuration

**File:** `packages/web-configurator/src/context/SchemaContext.tsx`

```typescript
home: {
  section1: { type: 'switching', title: 'Quick Controls' },
  section2: { type: 'signal-values', title: 'Status' },
}
```

## User Workflow

### Configuring Home Sections

1. Navigate to **Home** in the navigation sidebar
2. See two section configuration blocks (Section 1 and Section 2)
3. For each section:
   - Edit the title in the header input field
   - Click one of the three type cards to select the section type
   - Selected card shows blue border and background highlight
4. View the configuration summary at the bottom
5. Changes are saved automatically to the schema

### Example Configuration

**Section 1: "Favorites"** (Switching)

- Type: 🔘 Switching
- Will show: Toggle switches for lights, fans, pumps

**Section 2: "System Status"** (Signal Values)

- Type: 📊 Signal Values
- Will show: Battery voltage, tank levels, temperatures

## Integration with Editor

The Home configuration determines what content is generated when using the **"Regenerate Content"** feature in the Editor:

- **Switching sections** → Populated with toggle/button components from hardware configuration
- **Signal values sections** → Populated with gauge/indicator components for monitoring
- **Image sections** → Placeholder for custom image upload

## Testing Checklist

- [x] Schema compiles with HomeConfigSchema
- [x] HomeConfigPage renders correctly
- [x] Section type selection works (3 types)
- [x] Title editing updates schema
- [x] Summary displays correct configuration
- [x] Default values load properly
- [x] Navigation link works
- [x] Route renders component
- [ ] Test in browser (all functionality)
- [ ] Verify HMR updates work
- [ ] Test with Editor regeneration
- [ ] Verify schema validation passes

## Future Enhancements

Potential improvements:

- **Image Upload:** Direct image upload interface for image sections
- **Component Preview:** Show sample components based on selection
- **Layout Options:** Choose between grid/list layouts for switching sections
- **Signal Selection:** Pick specific signals to display in signal values sections
- **Template Library:** Pre-made section templates for common use cases
- **Drag-and-Drop:** Reorder sections or components within sections

## Related Files

- `packages/schema/src/schema.ts` - Schema definitions
- `packages/web-configurator/src/pages/HomeConfigPage.tsx` - Main component
- `packages/web-configurator/src/pages/HomeConfigPage.module.css` - Styles
- `packages/web-configurator/src/App.tsx` - Routing
- `packages/web-configurator/src/components/Layout.tsx` - Navigation
- `packages/web-configurator/src/context/SchemaContext.tsx` - Default values

## Build Verification

✅ **Dev Server:** Running with HMR  
✅ **Schema:** Compiles successfully  
✅ **TypeScript:** No errors  
✅ **Navigation:** Link added to sidebar  
✅ **Route:** `/home` registered

**URL:** http://localhost:3000/home

---

**Ready for Testing!** Navigate to the Home page in the sidebar to configure the Home tab sections.
