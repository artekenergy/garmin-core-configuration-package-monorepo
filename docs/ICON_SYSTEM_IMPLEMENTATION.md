# Icon System Implementation

**Date:** October 11, 2025  
**Status:** ✅ Complete  
**Roadmap Section:** 2.1 Icon Component + Registry

## Overview

Implemented a complete icon system for HMI UI that resolves icon IDs from schema, supports multiple rendering modes (inline SVG, URL, base64), and includes fallback glyphs for preset tabs.

---

## Files Created

### 1. Type Definitions

**File:** `packages/hmi-ui/src/types/icon.ts`

```typescript
export interface IconSpec {
  id: string;
  svg?: string;
  url?: string;
}
```

### 2. Icon Registry

**File:** `packages/hmi-ui/src/utils/icon-registry.ts`

**Features:**

- Centralized icon storage using Map
- Loads icons from `schema.icons` array
- Supports SVG inline, URL, and base64 PNG/JPG modes
- Warns once per missing icon (prevents log spam)
- Exports `registerIcons()`, `getIcon()`, `clearRegistry()`, `getRegisteredIconIds()`

**ES2017 Compliant:** No optional chaining, uses `forEach` instead of for...of

### 3. Fallback Icon Map

**File:** `packages/hmi-ui/src/utils/icon-fallbacks.ts`

**Features:**

- Preset SVG glyphs for common tabs: `home`, `power`, `lighting`, `hvac`, `switching`, `plumbing`
- Default fallback placeholder (gray square)
- Exports `getFallbackIcon()` and `DEFAULT_FALLBACK_SVG`

### 4. Icon Component

**File:** `packages/hmi-ui/src/components/Icon.tsx`

**Props:**

- `iconId?: string` - Look up icon from registry
- `icon?: IconSpec` - Direct icon spec (bypasses registry)
- `size?: 'sm' | 'md' | 'lg'` - Size variant (20px, 24px, 32px)
- `preset?: string` - Fallback to preset glyph if no icon found
- `title?: string` - Accessible title
- `className?: string` - Additional CSS classes

**Features:**

- Sanitizes SVG to remove `<script>` tags and `onXxx` event handlers (XSS protection)
- Renders inline SVG via `dangerouslySetInnerHTML`
- Renders URL/base64 via `<img>` tag
- Falls back to preset glyphs, then default placeholder
- Sets `data-icon-id` attribute for debugging
- Sets `aria-hidden` when no title provided

**Resolution Order:**

1. Direct `icon` prop (if provided)
2. Registry lookup via `iconId`
3. Preset fallback via `preset`
4. Default placeholder

---

## Files Modified

### 1. App.tsx

**Changes:**

- Import `registerIcons` from `./utils/icon-registry`
- Added `useEffect` to load `schema.icons` into registry on schema load

```typescript
useEffect(
  function () {
    if (schema && schema.icons) {
      registerIcons(schema.icons);
    }
  },
  [schema]
);
```

### 2. TabBar.tsx

**Changes:**

- Import `Icon` component
- Replace emoji placeholder with `<Icon iconId={tab.icon} preset={tab.preset} size="md" />`
- Simplified icon rendering logic

**Before:**

```tsx
{
  tab.icon && (
    <div className="gcg-tab-bar__icon" aria-hidden="true">
      <span style={{ fontSize: '1.5rem' }}>
        {tab.preset === 'home'}
        {/* ...emoji conditionals */}
      </span>
    </div>
  );
}
```

**After:**

```tsx
<div className="gcg-tab-bar__icon">
  <Icon iconId={tab.icon} preset={tab.preset} size="md" />
</div>
```

### 3. SubtabBar.tsx

**Changes:**

- Import `Icon` component
- Use `<Icon iconId={subtab.icon} size="sm" />` for subtab icons

### 4. Button.tsx

**Changes:**

- Removed manual icon resolution using `schemaSignal`
- Import `Icon` component
- Replaced `dangerouslySetInnerHTML` with `<Icon iconId={component.icon} size="sm" | "md" />`

**Before:**

```tsx
let iconSvg: string | null = null;
if (component.icon && schemaSignal.value && schemaSignal.value.icons) {
  const iconDef = schemaSignal.value.icons.find(...);
  if (iconDef && iconDef.data) {
    iconSvg = iconDef.data;
  }
}
// ...
{iconSvg && <div dangerouslySetInnerHTML={{ __html: iconSvg }} />}
```

**After:**

```tsx
{
  component.icon && (
    <div className="gcg-button__icon">
      <Icon iconId={component.icon} size="md" />
    </div>
  );
}
```

### 5. Toggle.tsx

**Changes:**

- Removed manual icon resolution
- Import `Icon` component
- Replaced `dangerouslySetInnerHTML` with `<Icon iconId={component.icon} size="md" />`

### 6. components.css

**Changes:**

- Added Icon component styles at top of file

```css
/* Icon Component */
.gcg-icon {
  display: inline-block;
  line-height: 0;
  color: inherit;
  flex-shrink: 0;
  vertical-align: middle;
}

.gcg-icon--sm {
  width: 20px;
  height: 20px;
}
.gcg-icon--md {
  width: 24px;
  height: 24px;
}
.gcg-icon--lg {
  width: 32px;
  height: 32px;
}

.gcg-icon svg,
.gcg-icon img {
  width: 100%;
  height: 100%;
  display: block;
}

.gcg-icon svg {
  fill: currentColor;
}
```

---

## ES2017 Compliance

All code follows ES2017 standards:

- ✅ No optional chaining (`?.`)
- ✅ No nullish coalescing (`??`)
- ✅ Uses `function` keyword instead of arrow functions
- ✅ Uses `Array.forEach()` instead of `for...of`
- ✅ Uses string concatenation instead of template literals in some places

---

## Security

**XSS Protection:**

- SVG sanitization removes `<script>` tags
- Event handlers (`onclick`, `onload`, etc.) are stripped
- `data-icon-id` attribute is safe (string only)

---

## Testing Checklist

- [ ] Icons load from schema on app mount
- [ ] Tab icons display correctly (registry + preset fallbacks)
- [ ] Subtab icons display correctly
- [ ] Button round variant shows icons
- [ ] Toggle round variant shows icons
- [ ] Missing icons show fallback glyphs
- [ ] Unknown icon IDs warn once in console
- [ ] SVG icons render with `currentColor` inheritance
- [ ] PNG/JPG base64 icons render correctly
- [ ] URL-based icons render correctly

---

## Next Steps (From Roadmap)

✅ **DONE - Icon System:**

- Icon.tsx with inline SVG + URL modes
- Icon registry with schema loading
- Fallback map for preset tabs
- TabBar/SubtabBar/Button/Toggle integration

⏭️ **NEXT - Theme/Config Bridge:**

- ThemeProvider component
- tokens.css with CSS variables
- Theme preset system
- Custom color overrides

---

## Acceptance Criteria Met

✅ Icon component renders SVG inline and URL modes  
✅ Registry loads from `schema.icons` on mount  
✅ Fallback glyphs for preset tabs (home, power, lighting, etc.)  
✅ TabBar uses Icon component with preset fallbacks  
✅ Button and Toggle components use Icon for round variants  
✅ SVG sanitization prevents XSS  
✅ ES2017 compliant (no optional chaining)  
✅ Tokenized sizes (sm/md/lg)  
✅ `data-icon-id` debugging attribute  
✅ Warns once per missing icon

---

## Notes

- Icon registry is populated in App.tsx `useEffect` when schema loads
- Icons are memoized in a Map for fast lookup
- Missing icons show a semi-transparent gray square as ultimate fallback
- All icon rendering now centralized in Icon component (no more manual schema lookups)
- Components can use `iconId` prop for registry lookup or `icon` prop for direct spec
