# Bundle Size Audit Guide

This guide explains how to analyze bundle sizes, identify bloat, and optimize the packages in this monorepo.

## 🎯 Why Bundle Size Matters

- **Faster downloads** - Smaller bundles load faster over the network
- **Better performance** - Less JavaScript to parse and execute
- **Improved UX** - Faster time-to-interactive for users
- **Reduced hosting costs** - Less bandwidth usage

---

## 📊 Current Bundle Sizes (Baseline)

### HMI UI (`@gcg/hmi-ui`)

**Technology:** Preact + Vite  
**Target:** Embedded devices (Garmin HMI displays)

```bash
pnpm --filter @gcg/hmi-ui build
ls -lh packages/hmi-ui/dist/hmi-assets/
```

**Expected Output:**

- `vendor-*.js` - ~60-80KB (gzipped: ~20-25KB) - Preact runtime + dependencies
- `index-*.js` - ~40-60KB (gzipped: ~15-20KB) - Application code
- `index-*.css` - ~5-10KB (gzipped: ~2-3KB) - Styles
- **Total:** ~110-150KB (gzipped: ~40-50KB)

**Target:** Stay under 200KB total (uncompressed)

### Web Configurator (`@gcg/web-configurator`)

**Technology:** React + Vite  
**Target:** Desktop browsers (development tool)

```bash
pnpm --filter @gcg/web-configurator build
ls -lh packages/web-configurator/dist/assets/
```

**Expected Output:**

- `vendor-*.js` - ~150-200KB (gzipped: ~50-60KB) - React + React Router + dependencies
- `index-*.js` - ~100-150KB (gzipped: ~35-45KB) - Application code
- `index-*.css` - ~10-15KB (gzipped: ~3-5KB) - Styles
- **Total:** ~260-365KB (gzipped: ~90-110KB)

**Target:** Stay under 500KB total (uncompressed)

---

## 🔍 Bundle Analysis Tools

### 1. Vite Build Stats (Built-in)

**Run:**

```bash
pnpm --filter @gcg/web-configurator build
```

**Output:**

```
dist/assets/index-abc123.js    120.45 kB │ gzip:  35.23 kB
dist/assets/vendor-def456.js   180.22 kB │ gzip:  55.67 kB
dist/assets/index-ghi789.css    12.34 kB │ gzip:   3.45 kB
```

**What to look for:**

- Large individual chunks (>200KB)
- Unexpectedly large CSS files
- Many small chunks (code splitting gone wrong)

### 2. Vite Bundle Visualizer (Interactive)

**Install:**

```bash
pnpm add -D vite-bundle-visualizer
```

**Run:**

```bash
# For web-configurator
cd packages/web-configurator
npx vite-bundle-visualizer

# For hmi-ui
cd packages/hmi-ui
npx vite-bundle-visualizer
```

**What it does:**

- Opens interactive treemap in browser
- Shows exact size of each dependency
- Identifies duplicate dependencies
- Highlights optimization opportunities

**Screenshot:** Opens `http://localhost:8888` with visual bundle breakdown

### 3. Source Map Explorer

**Install:**

```bash
pnpm add -D source-map-explorer
```

**Run:**

```bash
# Build with sourcemaps
pnpm --filter @gcg/web-configurator build

# Analyze
npx source-map-explorer 'packages/web-configurator/dist/assets/*.js'
```

**What it does:**

- Shows which source files contribute to bundle size
- Identifies large libraries
- Helps find unused code

### 4. Webpack Bundle Analyzer (Alternative)

If you switch to Webpack, use:

```bash
pnpm add -D webpack-bundle-analyzer
```

---

## 🚨 Red Flags to Look For

### Large Dependencies

**Problem:** Single dependency takes up >50KB of bundle

**How to find:**

- Use bundle visualizer
- Look for large rectangles in treemap
- Check `node_modules` imports

**Common culprits:**

- `moment.js` (300KB) - Use `date-fns` (20KB) instead
- `lodash` (full import 70KB) - Use individual imports or tree-shaking
- `@mui/material` (full import 200KB+) - Import specific components
- Chart libraries (100KB+) - Consider lighter alternatives

**Solution:**

```javascript
// ❌ Bad - imports entire library
import _ from 'lodash';

// ✅ Good - tree-shakeable or specific import
import debounce from 'lodash/debounce';
// or
import { debounce } from 'lodash-es';
```

### Duplicate Dependencies

**Problem:** Same library included multiple times

**How to find:**

- Bundle visualizer shows duplicates
- Search for library name in treemap

**Common causes:**

- Different versions in `package.json`
- Peer dependency mismatches
- Monorepo workspace resolution issues

**Solution:**

```bash
# Check for duplicates
pnpm list <package-name>

# Deduplicate
pnpm dedupe
```

### Unused Code

**Problem:** Dead code included in bundle

**How to find:**

- Source map explorer
- Search for imported but unused modules
- Check for `/* @__PURE__ */` comments

**Solution:**

- Remove unused imports
- Use tree-shaking compatible libraries
- Enable Vite's `build.rollupOptions.treeshake`

### Large Vendor Chunk

**Problem:** `vendor-*.js` > 300KB

**Solution:**

- Split large libraries into separate chunks
- Use code splitting with dynamic imports
- Lazy load non-critical dependencies

```javascript
// ❌ Bad - always loaded
import HeavyComponent from './HeavyComponent';

// ✅ Good - lazy loaded
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## 📈 Optimization Strategies

### 1. Code Splitting

**Current status:** Basic route-based splitting

**Improvements:**

```javascript
// Lazy load routes
const EditorPage = lazy(() => import('./pages/EditorPage'));
const ExportPage = lazy(() => import('./pages/ExportPage'));
const HardwareConfigPage = lazy(() => import('./pages/HardwareConfigPage'));

// Wrap in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Route path="/editor" element={<EditorPage />} />
</Suspense>;
```

**Expected savings:** 30-40% reduction in initial bundle

### 2. Tree Shaking

**Enable in `vite.config.ts`:**

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          schema: ['@gcg/schema', 'zod'],
        },
      },
    },
  },
});
```

**Expected savings:** 10-15% reduction

### 3. Dependency Replacement

**Current dependencies to review:**

| Dependency | Current Size | Alternative     | Alt Size | Savings |
| ---------- | ------------ | --------------- | -------- | ------- |
| `react`    | ~130KB       | `preact/compat` | ~8KB     | 94%     |
| `zod`      | ~55KB        | `yup` or custom | ~20KB    | 64%     |
| `jszip`    | ~100KB       | `fflate`        | ~20KB    | 80%     |

**Note:** Some alternatives may not be drop-in replacements

### 4. CSS Optimization

**Enable CSS minification:**

```typescript
export default defineConfig({
  build: {
    cssMinify: 'lightningcss',
  },
});
```

**Remove unused CSS:** Use PurgeCSS or built-in CSS tree-shaking

**Expected savings:** 20-30% CSS reduction

### 5. Asset Optimization

**Images:**

- Use WebP instead of PNG/JPG
- Compress SVGs with SVGO
- Lazy load images

**Fonts:**

- Use variable fonts
- Subset fonts to required glyphs
- Use `font-display: swap`

---

## 🛠️ Running a Full Audit

### Step 1: Build Everything

```bash
# Clean old builds
pnpm clean

# Build all packages
pnpm build
```

### Step 2: Analyze Each Package

```bash
# HMI UI
cd packages/hmi-ui
npx vite-bundle-visualizer

# Web Configurator
cd packages/web-configurator
npx vite-bundle-visualizer
```

### Step 3: Document Findings

Create a file: `BUNDLE_AUDIT_YYYY-MM-DD.md`

```markdown
# Bundle Audit - October 12, 2025

## HMI UI

**Total:** 145KB (gzipped: 48KB)

### Breakdown:

- vendor.js: 75KB (preact, signals)
- index.js: 55KB (app code)
- index.css: 8KB (styles)
- icons: 7KB (SVG assets)

### Issues:

1. None - within target

### Recommendations:

- Monitor as features are added
- Consider lazy loading tab content

## Web Configurator

**Total:** 320KB (gzipped: 95KB)

### Breakdown:

- vendor.js: 185KB (react, react-router, zod)
- index.js: 110KB (app code)
- index.css: 12KB (styles)
- icons: 13KB (SVG assets)

### Issues:

1. `zod` is 55KB - consider optimization
2. No code splitting for routes

### Recommendations:

1. Implement route-based code splitting
2. Consider replacing `zod` with lighter validation
3. Lazy load non-critical components
```

### Step 4: Set Budget Alerts

Add to `package.json`:

```json
{
  "bundlesize": [
    {
      "path": "dist/assets/vendor-*.js",
      "maxSize": "200 kB"
    },
    {
      "path": "dist/assets/index-*.js",
      "maxSize": "150 kB"
    }
  ]
}
```

### Step 5: Monitor Over Time

```bash
# Create baseline
npx bundlesize

# Compare against baseline in CI
npx bundlesize --compare
```

---

## 📋 Bundle Size Checklist

Before adding a new dependency, ask:

- [ ] Is this dependency necessary, or can we write it ourselves?
- [ ] What's the gzipped size? (`npm info <package> dist.tarball`)
- [ ] Does it support tree-shaking? (Check package.json `"sideEffects"`)
- [ ] Are there lighter alternatives?
- [ ] Can we lazy load it?
- [ ] Does it have peer dependency conflicts?

**Rule of thumb:** Only add dependencies >10KB if absolutely necessary.

---

## 🎯 Target Metrics

### HMI UI (Performance Critical)

- **Total bundle:** <200KB uncompressed, <60KB gzipped
- **Initial load (FCP):** <1 second on embedded device
- **Time to Interactive:** <2 seconds
- **Lighthouse Score:** >90

### Web Configurator (Development Tool)

- **Total bundle:** <500KB uncompressed, <150KB gzipped
- **Initial load (FCP):** <2 seconds
- **Time to Interactive:** <3 seconds
- **Lighthouse Score:** >80

---

## 🔄 Monthly Audit Process

1. **Run bundle analysis** (1st of each month)
2. **Document findings** in `docs/audits/`
3. **Compare to previous month** - identify growth
4. **Create optimization tickets** if targets exceeded
5. **Review dependencies** - check for updates/replacements

---

## 📚 Resources

- [Vite Build Optimizations](https://vitejs.dev/guide/build.html)
- [Web.dev Bundle Size Guide](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Bundlephobia](https://bundlephobia.com/) - Check package sizes before installing
- [Import Cost VS Code Extension](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) - See sizes inline

---

**Last updated:** October 12, 2025  
**Next audit:** November 1, 2025  
**Related:** `BLOAT_REMOVAL_CHECKLIST.md`, `docs/BUILD_ARTIFACTS.md`
