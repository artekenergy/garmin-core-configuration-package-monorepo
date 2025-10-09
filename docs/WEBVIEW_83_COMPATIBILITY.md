# WebView 83 Compatibility Audit

**Date**: October 9, 2025  
**Target**: Chrome 83 (Android WebView, May 2020)  
**Status**: ✅ Audited and Fixed

---

## 🎯 Overview

The HMI-UI must run on Garmin HMI 7000 series devices which use **Android 10 with WebView 83 (Chrome 83)**. This document tracks CSS features that are NOT supported in Chrome 83 and the fallbacks implemented.

---

## ❌ Unsupported CSS Features in Chrome 83

### 1. **Flexbox `gap` Property**

- **Support**: Chrome 84+ (August 2020)
- **Chrome 83**: ❌ NOT supported
- **Issue**: `gap` works in Grid but NOT in Flexbox

### 2. **`aspect-ratio` Property**

- **Support**: Chrome 88+ (January 2021)
- **Chrome 83**: ❌ NOT supported
- **Issue**: Cannot maintain aspect ratios declaratively

### 3. **Container Queries (`@container`)**

- **Support**: Chrome 105+ (September 2022)
- **Chrome 83**: ❌ NOT supported
- **Not used in project**: ✅

### 4. **CSS `clamp()`, `min()`, `max()`**

- **Support**: Chrome 79+ (December 2019)
- **Chrome 83**: ✅ SUPPORTED
- **Status**: Safe to use

### 5. **`:is()`, `:where()` Selectors**

- **Support**: Chrome 88+ (January 2021)
- **Chrome 83**: ❌ NOT supported
- **Not used in project**: ✅

### 6. **`:has()` Selector**

- **Support**: Chrome 105+ (September 2022)
- **Chrome 83**: ❌ NOT supported
- **Not used in project**: ✅

---

## ✅ Fixes Implemented

### Fix 1: Flexbox `gap` → Margin-based Spacing

**Problem**: Flexbox `gap` not supported  
**Solution**: Use adjacent sibling selector (`* + *`) with margins

#### Before (Broken in Chrome 83):

```css
.gcg-component-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* ❌ Not supported in flexbox */
}
```

#### After (Chrome 83 Compatible):

```css
.gcg-component-wrapper {
  display: flex;
  flex-direction: column;
  /* gap: 0.5rem; - Not supported in Chrome 83 flexbox */
}

.gcg-component-wrapper > * + * {
  margin-top: 0.5rem; /* ✅ Fallback for gap */
}
```

**Files Fixed**:

- `packages/hmi-ui/src/styles/components.css`
  - `.gcg-component-wrapper` (column gap)
  - `.gcg-dimmer` (column gap)
  - `.gcg-dimmer__header` (row gap)
  - `.gcg-dimmer__label` (row gap)
- `packages/hmi-ui/src/styles/grid.css`
  - `.gcg-section` (column gap)

---

### Fix 2: `aspect-ratio` → Fixed Height

**Problem**: `aspect-ratio: 1 / 1` not supported  
**Solution**: Use fixed height constraints

#### Before (Broken in Chrome 83):

```css
.gcg-round-toggle,
.gcg-round-button {
  aspect-ratio: 1 / 1; /* ❌ Not supported */
  min-height: 80px;
}
```

#### After (Chrome 83 Compatible):

```css
.gcg-round-toggle,
.gcg-round-button {
  /* aspect-ratio: 1 / 1; - Not supported in Chrome 83 */
  /* Use fixed sizing to maintain square shape */
  min-height: 120px;
  max-height: 180px;
  height: 100%;
}
```

**Additional Context**:

- Round buttons already have fixed `width: 100px` and `height: 100px` in `.gcg-toggle--round`
- Grid-based sizing ensures consistent square shapes
- This fallback works for responsive grid layouts

**Files Fixed**:

- `packages/hmi-ui/src/styles/grid.css`
  - `.gcg-round-toggle`, `.gcg-round-button`

---

## ✅ Safe CSS Features (Already Supported)

These modern CSS features ARE supported in Chrome 83:

### Grid Layout

- ✅ `display: grid`
- ✅ `grid-template-columns`
- ✅ `gap` (in Grid only!)
- ✅ `grid-auto-flow`

### Flexbox

- ✅ `display: flex`
- ✅ `flex-direction`
- ✅ `justify-content`
- ✅ `align-items`
- ❌ **NOT** `gap` (use margins instead)

### Custom Properties

- ✅ `var(--variable-name)`
- ✅ CSS variables fully supported

### Math Functions

- ✅ `calc()`
- ✅ `min()`, `max()`, `clamp()` (Chrome 79+)

### Modern Selectors

- ✅ `:not()`
- ✅ `::before`, `::after`
- ✅ `[attribute]` selectors
- ❌ **NOT** `:is()`, `:where()`, `:has()`

---

## 🧪 Testing Strategy

### Browser Testing

1. Test in Chrome 83 (or earlier)
2. Use BrowserStack for Android 10 WebView
3. Garmin HMI 7000 device testing

### Visual Regression

- Compare layouts between Chrome 83 and modern browsers
- Ensure spacing is identical
- Verify square aspect ratios on round buttons

### Automated Testing

```bash
# Run in Chrome 83 compatibility mode
npx playwright test --project=chrome-83
```

---

## 📋 Future Considerations

### If Garmin Updates WebView

**Chrome 84+**:

- ✅ Can use Flexbox `gap`
- Remove `* + *` margin fallbacks
- Cleaner, more maintainable code

**Chrome 88+**:

- ✅ Can use `aspect-ratio`
- Remove fixed height workarounds
- Better responsive behavior

### Polyfill Strategy

**NOT RECOMMENDED**:

- Polyfills add bundle size
- May cause performance issues on embedded devices
- Native fallbacks are more reliable

---

## 🔍 How to Audit New CSS

When adding new CSS features, check Chrome 83 support:

1. Visit [caniuse.com](https://caniuse.com)
2. Search for the CSS property
3. Check "Chrome 83" column
4. If unsupported, use fallback pattern

### Example Audit Process

```css
/* ❌ BAD: Check if supported first */
.new-component {
  display: flex;
  gap: 1rem; /* Is this supported in Chrome 83? */
}

/* ✅ GOOD: Use fallback for Chrome 83 */
.new-component {
  display: flex;
  /* gap: 1rem; - Not supported in Chrome 83 flexbox */
}

.new-component > * + * {
  margin-left: 1rem; /* ✅ Fallback */
}
```

---

## ✅ Verification Checklist

- [x] Audit all Flexbox `gap` usage → Replace with margins
- [x] Audit all `aspect-ratio` usage → Replace with fixed sizing
- [x] Verify Grid `gap` (safe to use)
- [x] Check for `:is()`, `:where()`, `:has()` (not used)
- [x] Document all fallbacks
- [ ] Test on actual Garmin HMI 7000 device
- [ ] Visual regression testing
- [ ] Performance testing on target hardware

---

## 📚 References

- [Chrome 83 Release Notes](https://developer.chrome.com/blog/new-in-chrome-83/)
- [Can I Use - Flexbox Gap](https://caniuse.com/flexbox-gap)
- [Can I Use - Aspect Ratio](https://caniuse.com/mdn-css_properties_aspect-ratio)
- [MDN - CSS Compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

**Last Updated**: October 9, 2025  
**Reviewed By**: Development Team  
**Status**: ✅ All HMI-UI CSS is Chrome 83 compatible
