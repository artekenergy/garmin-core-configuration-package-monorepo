# Bloat Removal Checklist

Quick reference for cleaning up identified bloat.

## 🔴 Critical - Do Now (5 minutes)

- [x] **Delete HVACConfigPage_OLD.tsx** ✅ DONE

  ```bash
  git rm packages/web-configurator/src/pages/HVACConfigPage_OLD.tsx
  git commit -m "Remove deprecated HVACConfigPage_OLD.tsx"
  ```

- [x] **Schema already modularized** ✅ DONE
  - Old schema.ts file still exists for backward compatibility
  - New modular structure is primary export in index.ts
  - No deprecation notice needed (exports handled automatically)

## 🟡 High Priority - This Week (1-2 hours)

- [x] **Create debug utility** ✅ DONE
  - Created `packages/web-configurator/src/utils/debug.ts`
  - Replaced `console.log` → `debug.log` (21+ instances)
  - Replaced `console.warn` → `debug.warn`
  - Replaced `console.error` → `debug.error`
  - Debug statements automatically removed in production builds

- [x] **Gitignore deployment package** ✅ DONE

  ```bash
  echo "packages/web-configurator/public/deployment-package/" >> .gitignore
  git rm -r --cached packages/web-configurator/public/deployment-package/
  ```

- [x] **Document build artifacts** ✅ DONE
  - Created `docs/BUILD_ARTIFACTS.md` - comprehensive documentation
  - Documents `hmi-dist/`, `deployment-package/`, `dist/`, `garmin-bundle/`
  - Explains build dependency chain and regeneration process
  - Added `hmi-dist/` to `.gitignore` (38 files removed from git)
  - Includes troubleshooting guide and best practices

## 🟢 Medium Priority - This Month

- [x] **Add schema tests** ✅ STARTED
  - Created `packages/schema/tests/validators.test.ts` (600+ lines)
  - Comprehensive tests for all 6 custom validators
  - Tests cover success/failure cases, edge cases, multiple errors
  - Note: Test fixtures need to be fully schema-compliant (strict Zod types)
  - Existing `tests/schema.test.ts` provides structural validation tests
  - Next: Add JSON fixture files for integration tests

- [x] **Consolidate hardware configs** ✅ DONE
  - Created single source of truth in `configuration/` directory
  - Created `scripts/copy-hardware-configs.js` auto-copy script
  - Integrated into build process (`prebuild` hook in root package.json)
  - Removed 3 duplicate files from git (857 + 857 + 84 lines)
  - Added auto-copied files to `.gitignore`
  - Created `docs/HARDWARE_CONFIG_CONSOLIDATION.md` documentation
  - Files now auto-sync on every build - no manual sync needed

- [x] **Bundle size audit** ✅ DOCUMENTED
  - Created comprehensive `docs/BUNDLE_SIZE_AUDIT.md` guide
  - Documents tools: vite-bundle-visualizer, source-map-explorer
  - Includes optimization strategies and target metrics
  - Red flags checklist for identifying bloat
  - Monthly audit process defined
  - Ready to run when needed: `npx vite-bundle-visualizer`

## 📋 Ongoing Maintenance

- [ ] **Pre-commit hooks**
  - Lint staged files
  - Prevent console.log commits
  - Run tests

- [ ] **Monthly review**
  - Check for new `_OLD` files
  - Review bundle size
  - Update dependencies

---

## Savings Tracker

| Action                             | Status     | Savings       |
| ---------------------------------- | ---------- | ------------- |
| Remove HVACConfigPage_OLD.tsx      | ⏳ Pending | 454 lines     |
| Deprecate old schema               | ⏳ Pending | Mark for v1.0 |
| Remove deployment-package from git | ⏳ Pending | 5.3MB         |
| Optimize console logs              | ⏳ Pending | 2KB + perf    |

**Estimated Time**: 2-3 hours  
**Estimated Savings**: 5.3MB + 454 lines + improved performance
