# Codebase Bloat Analysis

**Date**: October 12, 2025  
**Analyzed**: Garmin Core Configuration Package Monorepo

## Executive Summary

**Total TypeScript Files**: 150  
**Total CSS Files**: 34  
**Test Coverage**: Only 2 test files (1.3% of codebase)  
**Identified Bloat**: ~5.7MB + deprecated files

---

## 🔴 Critical Bloat (Remove Immediately)

### 1. **Deprecated OLD File**

**File**: `packages/web-configurator/src/pages/HVACConfigPage_OLD.tsx`  
**Size**: 454 lines  
**Impact**: High  
**Action**: DELETE

```bash
rm packages/web-configurator/src/pages/HVACConfigPage_OLD.tsx
```

**Why**:

- Completely superseded by `HVACConfigPage.tsx`
- Excluded from TypeScript compilation (see `tsconfig.json`)
- No references in codebase
- Confuses developers

**Savings**: 454 lines of code

---

### 2. **Old Monolithic Schema**

**File**: `packages/schema/src/schema.ts`  
**Size**: 669 lines  
**Status**: Deprecated (kept for backward compatibility)  
**Impact**: Medium (will be high if not removed)

**Action**: Mark for removal in next major version

**Current State**:

- ✅ New modular structure implemented (37 files)
- ✅ All exports working through new structure
- ⚠️ Old file still present

**Migration Plan**:

1. **Phase 1** (Current): Both available, add deprecation warnings
2. **Phase 2** (v0.2.0): Add console warnings when importing from old file
3. **Phase 3** (v1.0.0): Remove entirely

**Savings**: 669 lines once fully migrated

---

## 🟡 Moderate Bloat (Address Soon)

### 3. **Bundled HMI Distribution**

**Location**: `packages/web-configurator/public/hmi-dist/`  
**Size**: 352KB  
**Files**: Pre-built HMI UI bundle

**Issue**:

- Contains minified vendor code (vendor-azMIOUfB.js, etc.)
- Duplicates code from `@gcg/hmi-ui` package
- Potentially stale

**Questions to Answer**:

1. Is this auto-generated or manually copied?
2. Should this be built on-demand?
3. Can we reference the HMI package directly?

**Recommendation**:

```bash
# Option 1: Generate on build
"prebuild": "pnpm --filter @gcg/hmi-ui build && node scripts/copy-hmi-assets.js"

# Option 2: Link directly
# Use symlinks or import from @gcg/hmi-ui/dist
```

**Potential Savings**: 352KB, improved maintainability

---

### 4. **Large Deployment Package**

**Location**: `packages/web-configurator/public/deployment-package/`  
**Size**: 5.3MB  
**Purpose**: Template for export

**Issue**:

- Very large for version control
- Should be generated, not committed

**Recommendation**:

```bash
# Add to .gitignore
packages/web-configurator/public/deployment-package/

# Generate on build or download on demand
```

**Consider**:

- CDN hosting for deployment template
- On-demand download
- Git LFS if must be in repo

**Potential Savings**: 5.3MB from repo

---

### 5. **Debug Console Statements**

**Found**: 21+ instances across codebase  
**Impact**: Performance & bundle size

**Examples**:

```typescript
// packages/web-configurator/src/pages/ExportPage.tsx
console.log('✓ Added signal mappings to schema for export');
console.log(`Loading complete deployment package: ${manifest.totalFiles} files`);

// packages/web-configurator/src/pages/EditorPage.tsx
console.log('[DEBUG] Home tab section matching:', {...});
console.log('[DEBUG] Section selected, returning type:', type);

// packages/web-configurator/src/components/ComponentPalette.tsx
console.log('[DEBUG ComponentPalette] filterType changed to:', filterType);
```

**Recommendation**:
Create a debug utility:

```typescript
// src/utils/debug.ts
const IS_DEV = import.meta.env.DEV;

export const debug = {
  log: (...args: any[]) => IS_DEV && console.log(...args),
  warn: (...args: any[]) => console.warn(...args), // Keep warnings
  error: (...args: any[]) => console.error(...args), // Keep errors
};

// Usage
import { debug } from '@/utils/debug';
debug.log('[DEBUG] Component rendered');
```

**Benefit**:

- Auto-removed in production builds
- Centralized logging control
- Better performance

**Savings**: ~2KB minified, faster production runtime

---

### 6. **Duplicate Hardware Configs**

**Files**:

- `packages/web-configurator/public/hardware-config-core.json`
- `packages/hmi-ui/public/hardware-config.json`
- Similar files in `deployment-package/`

**Issue**: Same data in multiple places

**Recommendation**:

- Single source of truth in `/configuration/`
- Copy on build process
- Or fetch from API/CDN

---

## 🟢 Low Priority Bloat

### 7. **Minimal Test Coverage**

**Current**: Only 2 test files (tabGenerator.spec.ts in hmi-ui)  
**Target**: At least 50% coverage for schema validation

**Missing Tests**:

- ❌ Schema validation tests
- ❌ Component tests
- ❌ Integration tests
- ❌ E2E tests

**Not Bloat**: But technical debt that should be addressed

**Recommendation**:
Start with critical paths:

1. `packages/schema/src/validators.test.ts`
2. `packages/web-configurator/src/utils/tabGenerator.test.ts`
3. `packages/hmi-ui/src/utils/binding-resolver.test.ts`

---

### 8. **TODO/FIXME Comments**

**Found**: Minimal (good!)

**Example**:

```typescript
// packages/hmi-ui/src/utils/binding-resolver.ts:86
// TODO: Implement NMEA signal ID resolution
```

**Action**: Track in issues, implement or remove

---

### 9. **CSS Module Redundancy**

**Count**: 34 CSS module files  
**Pattern**: Each component/page has its own CSS file

**Example Structure**:

```
ExportPage.tsx       → ExportPage.module.css
HardwareConfigPage.tsx → HardwareConfigPage.module.css
PlumbingConfigPage.tsx → PlumbingConfigPage.module.css
```

**Not Really Bloat**: This is intentional CSS Modules pattern

**Potential Optimization**:

- Shared design tokens/variables
- Utility class system (Tailwind-like)
- Theme-based styling

**Current State**: Acceptable, but could be streamlined

---

## 📊 Bloat Summary Table

| Item                   | Type   | Size      | Priority    | Savings          |
| ---------------------- | ------ | --------- | ----------- | ---------------- |
| HVACConfigPage_OLD.tsx | Code   | 454 lines | 🔴 Critical | 454 lines        |
| schema.ts (deprecated) | Code   | 669 lines | 🔴 Critical | 669 lines (v1.0) |
| hmi-dist/              | Build  | 352KB     | 🟡 Moderate | 352KB            |
| deployment-package/    | Assets | 5.3MB     | 🟡 Moderate | 5.3MB repo       |
| Console logs           | Code   | ~21+      | 🟡 Moderate | 2KB + perf       |
| Duplicate configs      | Data   | Unknown   | 🟡 Moderate | TBD              |
| Missing tests          | Debt   | N/A       | 🟢 Low      | N/A              |
| CSS modules            | Style  | 34 files  | 🟢 Low      | N/A              |

**Total Identifiable Bloat**: ~6MB + 1,123 lines of code

---

## ✅ Immediate Action Plan

### Week 1: Quick Wins

```bash
# 1. Remove OLD file
git rm packages/web-configurator/src/pages/HVACConfigPage_OLD.tsx

# 2. Add deprecation notice to old schema
# packages/schema/src/schema.ts (top of file)
/**
 * @deprecated This file is deprecated. Import from '@gcg/schema' directly.
 * Will be removed in v1.0.0
 */

# 3. Create debug utility
# (See example above)

# 4. Replace all console.log with debug.log
# Can use find/replace or codemod
```

### Week 2-3: Build Optimization

```bash
# 5. Move deployment-package to .gitignore
echo "packages/web-configurator/public/deployment-package/" >> .gitignore

# 6. Update build scripts to generate on-demand
# Update package.json scripts

# 7. Review hmi-dist generation
# Ensure it's auto-generated, not manual
```

### Month 1: Technical Debt

```bash
# 8. Add schema validation tests
# Target: 80% coverage

# 9. Document build/deployment process
# Ensure team knows how assets are generated

# 10. Create migration guide for old schema
# Help consumers migrate to modular structure
```

---

## 🎯 Expected Results

**After Immediate Actions**:

- ✅ 454 lines removed (HVACConfigPage_OLD.tsx)
- ✅ Cleaner console in production
- ✅ Better developer experience

**After Build Optimization**:

- ✅ 5.3MB removed from git repo
- ✅ Faster clone times
- ✅ Cleaner deployment process

**After Schema Migration (v1.0.0)**:

- ✅ 669 lines removed
- ✅ Faster builds
- ✅ Better tree-shaking

**Total Savings**: ~6MB + 1,123 lines of code

---

## 🚀 Long-Term Optimizations

### Consider for Future

1. **Monorepo Optimization**
   - Use Turborepo or Nx for better caching
   - Parallel builds
   - Incremental compilation

2. **Bundle Size Optimization**
   - Tree-shaking audit
   - Dynamic imports for routes
   - Code splitting

3. **Asset Management**
   - CDN for static assets
   - Image optimization
   - Icon sprite sheets

4. **Developer Experience**
   - Hot module replacement
   - Faster build times
   - Better error messages

---

## 📝 Maintenance Guidelines

### Prevent Future Bloat

1. **File Naming Convention**
   - Never use `_OLD`, `_BACKUP`, `_temp` in committed files
   - Use feature branches for experiments
   - Delete merged branches

2. **Build Artifacts**
   - Never commit `dist/`, `build/`, or generated files
   - Use `.gitignore` properly
   - Document build process

3. **Dependencies**
   - Regular `pnpm outdated` checks
   - Remove unused dependencies
   - Use `bundle-analyzer` periodically

4. **Code Review Checklist**
   - [ ] No debug console.logs
   - [ ] No commented-out code blocks
   - [ ] No duplicate files
   - [ ] Tests included for new features
   - [ ] Build passes

---

## 📌 Notes

- **Good News**: Codebase is relatively clean! Only ~6MB bloat found
- **Schema Modularization**: Already a huge win (completed today)
- **Test Coverage**: Biggest gap, but not "bloat" per se
- **Build Process**: Well-documented in package.json scripts

---

## 🔍 Commands for Ongoing Monitoring

```bash
# Find large files
find . -type f -size +1M -not -path "*/node_modules/*" -not -path "*/.git/*"

# Find duplicate files
fdupes -r packages/

# Find unused exports (requires ts-prune)
npx ts-prune

# Analyze bundle size
npx vite-bundle-visualizer

# Check for circular dependencies
npx madge --circular packages/*/src

# Find TODO/FIXME comments
grep -r "TODO\|FIXME\|HACK\|XXX" packages/ --include="*.ts" --include="*.tsx"
```

---

**Created by**: AI Code Audit  
**Review Status**: Pending team review  
**Next Steps**: Implement Week 1 quick wins
