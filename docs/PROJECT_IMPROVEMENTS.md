# Project Improvement Recommendations

**Date:** October 12, 2025  
**Status:** Comprehensive Analysis  
**Priority Levels:** 🔴 Critical | 🟡 High | 🟢 Medium | 🔵 Low

---

## 📊 Executive Summary

Your project is **well-structured** with solid foundations (modular schema, clean architecture, good documentation). This document outlines improvements across 8 key areas to enhance **code quality**, **developer experience**, and **production readiness**.

**Quick Wins** (can do today):

1. Fix ESLint configuration (5 minutes)
2. Add pre-commit hooks (10 minutes)
3. Set up Dependabot (5 minutes)
4. Configure VS Code settings (5 minutes)

**High-Impact** (this week):

1. Improve test coverage (schema package only has 1 test file)
2. Add E2E testing with Playwright
3. Implement bundle size monitoring
4. Add component documentation

---

## 🔴 1. Code Quality & Linting (Critical)

### Current Issues

**ESLint Configuration Problems:**

- `jest.config.js` uses ES module syntax but `.eslintrc.cjs` expects CommonJS
- No ESLint rule overrides for test files
- `@ts-nocheck` triggers ESLint warning

**Missing Tools:**

- No Stylelint for CSS validation
- No Markdownlint integration (many MD warnings)
- No import sorting/organization

### Recommended Fixes

#### A. Fix Jest Config

**File:** `packages/schema/jest.config.js`

```javascript
// Change from ES module to CommonJS
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // ... rest of config
};
```

**OR** Update `package.json` to use ES modules:

```json
{
  "type": "module"
}
```

#### B. Update ESLint Config

**File:** `.eslintrc.cjs`

```javascript
module.exports = {
  // ... existing config
  overrides: [
    {
      // Relax rules for test files
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      // Allow ES modules in config files
      files: ['*.config.js', 'jest.config.js'],
      parserOptions: {
        sourceType: 'module',
      },
    },
  ],
};
```

#### C. Add Stylelint

```bash
pnpm add -D -w stylelint stylelint-config-standard
```

**File:** `.stylelintrc.json`

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "color-function-notation": "legacy"
  }
}
```

**Add to package.json:**

```json
{
  "scripts": {
    "lint:css": "stylelint \"packages/**/*.css\"",
    "lint:css:fix": "stylelint \"packages/**/*.css\" --fix"
  }
}
```

#### D. Add Markdownlint

```bash
pnpm add -D -w markdownlint-cli2
```

**File:** `.markdownlint.json`

```json
{
  "MD013": false,
  "MD033": false,
  "MD041": false
}
```

**Add to package.json:**

```json
{
  "scripts": {
    "lint:md": "markdownlint-cli2 \"**/*.md\" \"!node_modules\"",
    "lint:md:fix": "markdownlint-cli2 --fix \"**/*.md\" \"!node_modules\""
  }
}
```

#### E. Add Import Sorting

```bash
pnpm add -D -w @trivago/prettier-plugin-sort-imports
```

**Update `.prettierrc`:**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": ["^react", "^preact", "^@gcg/(.*)$", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

**Priority:** 🔴 Critical - Fix Jest config today, rest this week

**Impact:** Prevents bugs, improves consistency, better DX

---

## 🟡 2. Git Hooks & Pre-Commit Checks (High Priority)

### Current State

- No pre-commit hooks
- Developers can commit broken code
- No automatic formatting on save
- Manual lint checking

### Recommended Implementation

#### A. Install Husky + lint-staged

```bash
pnpm add -D -w husky lint-staged
pnpm exec husky init
```

#### B. Configure Pre-Commit Hook

**File:** `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
```

#### C. Configure lint-staged

**File:** `.lintstagedrc.json`

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.css": ["stylelint --fix", "prettier --write"],
  "*.md": ["markdownlint-cli2 --fix", "prettier --write"],
  "*.{json,yml,yaml}": ["prettier --write"]
}
```

#### D. Add Commit Message Validation

```bash
pnpm add -D -w @commitlint/cli @commitlint/config-conventional
```

**File:** `.commitlintrc.json`

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "scope-enum": [2, "always", ["schema", "web-configurator", "hmi-ui", "docs", "config", "deps"]]
  }
}
```

**File:** `.husky/commit-msg`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec commitlint --edit $1
```

**Priority:** 🟡 High - Implement this week

**Impact:** Prevents broken commits, ensures code quality, standardizes workflow

---

## 🟡 3. Testing Improvements (High Priority)

### Current State

**Schema Package:**

- ✅ Has comprehensive validator tests (600+ lines)
- ⚠️ Mock data has type errors (acceptable, but could be better)
- ❌ No integration tests

**Web Configurator:**

- ❌ No tests at all
- ❌ No component tests
- ❌ No E2E tests

**HMI UI:**

- ❌ No tests at all

### Test Coverage Goals

| Package          | Unit | Integration | E2E | Target Coverage |
| ---------------- | ---- | ----------- | --- | --------------- |
| Schema           | 80%  | 60%         | N/A | 80%             |
| Web Configurator | 60%  | 40%         | 80% | 70%             |
| HMI UI           | 50%  | 30%         | 60% | 60%             |

### Recommended Implementation

#### A. Schema Package - Create Test Fixtures

**File:** `packages/schema/tests/fixtures/valid-schemas.ts`

```typescript
import { UISchema } from '../../src/root';

export const minimalValidSchema: UISchema = {
  schemaVersion: '0.1.0',
  tabs: [
    {
      id: 'tab-1',
      title: 'Test Tab',
      enabled: true,
      sections: [
        {
          id: 'section-1',
          title: 'Test Section',
          enabled: true,
          components: [
            {
              type: 'button',
              id: 'button-1',
              label: 'Test Button',
              bindings: {
                action: { type: 'static', value: 'test' },
              },
              action: 'momentary',
            },
          ],
        },
      ],
    },
  ],
  hardware: {
    systemType: 'core',
    outputs: [],
    genesisBoards: 0,
    halfBridgePairing: [],
  },
  theme: {
    preset: 'blue',
  },
  metadata: {
    name: 'Test Schema',
    version: '1.0.0',
  },
};

export const coreSystemSchema: UISchema = {
  // Full example with all features
  // ... (expand this)
};
```

**Then update validators.test.ts:**

```typescript
import { minimalValidSchema, coreSystemSchema } from './fixtures/valid-schemas';

describe('validateUniqueComponentIds', () => {
  it('should pass with valid schema', () => {
    const result = validateUniqueComponentIds(minimalValidSchema);
    expect(result.success).toBe(true);
  });
});
```

#### B. Web Configurator - Add Vitest + Testing Library

```bash
cd packages/web-configurator
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**File:** `packages/web-configurator/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/tests/', '**/*.d.ts', '**/*.config.*', '**/mockData/*'],
    },
  },
});
```

**File:** `packages/web-configurator/src/tests/setup.ts`

```typescript
import '@testing-library/jest-dom';
```

**Example Test:** `packages/web-configurator/src/components/Layout.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Layout>Test Content</Layout>
      </BrowserRouter>
    );

    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });
});
```

#### C. Add E2E Testing with Playwright

```bash
pnpm add -D -w @playwright/test
pnpm exec playwright install
```

**File:** `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'pnpm --filter @gcg/web-configurator dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**File:** `e2e/schema-workflow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('complete schema editing workflow', async ({ page }) => {
  await page.goto('/');

  // Navigate to Hardware Config
  await page.click('text=Hardware Config');

  // Select Core system
  await page.click('text=Core');

  // Navigate to Tabs
  await page.click('text=Configure Tabs');

  // Add a new tab
  await page.click('text=Add Tab');
  await page.fill('input[name="title"]', 'My Custom Tab');
  await page.click('text=Save');

  // Export schema
  await page.click('text=Export');
  await page.click('text=Compile Configuration');

  // Verify success message
  await expect(page.locator('text=Compilation successful')).toBeVisible();
});
```

**Add to package.json:**

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

**Priority:** 🟡 High - Start with unit tests this week, E2E next week

**Impact:** Catches bugs early, enables confident refactoring, validates user workflows

---

## 🟢 4. CI/CD Enhancements (Medium Priority)

### Current State

- ✅ Has GitHub Actions CI workflow
- ✅ Runs type checking, formatting, builds
- ⚠️ No test coverage reporting
- ❌ No bundle size tracking
- ❌ No automated dependency updates

### Recommended Improvements

#### A. Add Test Coverage Reporting

**Update `.github/workflows/ci.yml`:**

```yaml
- name: Run tests with coverage
  run: pnpm test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./packages/*/coverage/coverage-final.json
    fail_ci_if_error: false
```

#### B. Add Bundle Size Tracking

```bash
pnpm add -D -w @bundlejs/cli
```

**File:** `.github/workflows/bundle-size.yml`

```yaml
name: Bundle Size Check

on:
  pull_request:
    branches: [main]

jobs:
  check-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm -r build

      - name: Check bundle sizes
        run: |
          echo "## Bundle Sizes 📦" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY

          # Web Configurator
          SIZE=$(stat -f%z packages/web-configurator/dist/assets/*.js | awk '{s+=$1} END {print s/1024}')
          echo "**Web Configurator:** ${SIZE}KB" >> $GITHUB_STEP_SUMMARY

          # HMI UI
          SIZE=$(stat -f%z packages/hmi-ui/dist/assets/*.js | awk '{s+=$1} END {print s/1024}')
          echo "**HMI UI:** ${SIZE}KB (Target: <50KB)" >> $GITHUB_STEP_SUMMARY
```

#### C. Add Dependabot Configuration

**File:** `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 5
    groups:
      dev-dependencies:
        patterns:
          - '@types/*'
          - '@typescript-eslint/*'
          - 'eslint*'
          - 'prettier'
      build-dependencies:
        patterns:
          - 'vite'
          - '@vitejs/*'
          - 'typescript'
      react-ecosystem:
        patterns:
          - 'react'
          - 'react-*'
          - '@testing-library/*'

  - package-ecosystem: 'github-actions'
    directory: '/'
    schedule:
      interval: 'monthly'
```

#### D. Add Code Quality Badges to README

**Update `README.md`:**

```markdown
[![CI](https://github.com/artekenergy/garmin-core-configuration-package-monorepo/actions/workflows/ci.yml/badge.svg)](https://github.com/artekenergy/garmin-core-configuration-package-monorepo/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/artekenergy/garmin-core-configuration-package-monorepo/branch/main/graph/badge.svg)](https://codecov.io/gh/artekenergy/garmin-core-configuration-package-monorepo)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)]()
[![pnpm](https://img.shields.io/badge/pnpm-8.10-orange)]()
```

**Priority:** 🟢 Medium - Add Dependabot this week, rest over next 2 weeks

**Impact:** Better visibility, automated maintenance, prevents regressions

---

## 🟢 5. Developer Experience (Medium Priority)

### Recommended Improvements

#### A. VS Code Workspace Settings

**File:** `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true,
    "**/.git": true,
    "**/pnpm-lock.yaml": true
  },
  "files.associations": {
    "*.css": "css"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "css.validate": false,
  "stylelint.validate": ["css"],
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

#### B. Recommended VS Code Extensions

**File:** `.vscode/extensions.json`

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "DavidAnson.vscode-markdownlint",
    "ms-playwright.playwright",
    "vitest.explorer",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens"
  ]
}
```

#### C. Add .editorconfig Enhancements

**Update `.editorconfig`:**

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.{js,ts,jsx,tsx}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.yml]
indent_size = 2

[Makefile]
indent_style = tab
```

#### D. Add npm Scripts for Common Tasks

**Update root `package.json`:**

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:web": "pnpm --filter @gcg/web-configurator dev",
    "dev:hmi": "pnpm --filter @gcg/hmi-ui dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "test:watch": "pnpm -r test --watch",
    "test:coverage": "pnpm -r test --coverage",
    "test:e2e": "playwright test",
    "lint": "pnpm lint:ts && pnpm lint:css && pnpm lint:md",
    "lint:ts": "eslint . --ext .ts,.tsx",
    "lint:css": "stylelint \"packages/**/*.css\"",
    "lint:md": "markdownlint-cli2 \"**/*.md\" \"!node_modules\"",
    "lint:fix": "pnpm lint:ts --fix && pnpm lint:css --fix && pnpm lint:md --fix",
    "type-check": "pnpm -r type-check",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "clean": "pnpm -r clean && rm -rf node_modules",
    "clean:artifacts": "rm -rf packages/*/dist packages/*/coverage deployment-package",
    "prebuild": "node scripts/copy-hardware-configs.js",
    "postinstall": "husky install"
  }
}
```

**Priority:** 🟢 Medium - Set up VS Code config today, rest this week

**Impact:** Faster development, consistent experience across team, fewer errors

---

## 🟢 6. Documentation Improvements (Medium Priority)

### Current State

- ✅ Excellent project-specific documentation (50+ MD files!)
- ⚠️ Some docs have markdown linting issues
- ❌ No API documentation for schema package
- ❌ No component documentation (Storybook)
- ❌ No architecture diagrams

### Recommended Improvements

#### A. Add TypeDoc for API Documentation

```bash
cd packages/schema
pnpm add -D typedoc
```

**File:** `packages/schema/typedoc.json`

```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "readme": "none",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeInternal": true
}
```

**Add script:**

```json
{
  "scripts": {
    "docs": "typedoc"
  }
}
```

#### B. Add Storybook for Component Documentation

```bash
cd packages/web-configurator
pnpm dlx storybook@latest init
```

**Example Story:** `src/components/Layout.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import Layout from './Layout';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof Layout> = {
  title: 'Layout/MainLayout',
  component: Layout,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  args: {
    children: 'Page content goes here',
  },
};
```

#### C. Add Architecture Diagrams

**File:** `docs/ARCHITECTURE.md`

````markdown
# System Architecture

## Overview

```mermaid
graph TB
    A[Web Configurator] -->|Generates| B[Schema JSON]
    B -->|Validates against| C[@gcg/schema]
    A -->|Creates| D[Deployment Package]
    D -->|Contains| B
    D -->|Contains| E[HMI UI Build]
    E -->|Renders based on| B
    F[Garmin HMI Device] -->|Loads| E
    E -->|Reads| B
```
````

## Package Dependencies

```mermaid
graph LR
    A[@gcg/schema] -->|Used by| B[@gcg/web-configurator]
    A -->|Used by| C[@gcg/hmi-ui]
    B -->|Generates bundle for| C
```

## Data Flow

1. User configures system in Web Configurator
2. Schema validated using Zod (@gcg/schema)
3. User exports deployment package
4. Package contains schema.json + HMI UI build
5. Package uploaded to Garmin device
6. HMI UI reads schema.json and renders interface

````

#### D. Create CONTRIBUTING.md

**File:** `CONTRIBUTING.md`

```markdown
# Contributing Guide

## Development Setup

1. **Prerequisites**
   - Node.js 18+
   - pnpm 8+

2. **Clone and Install**
   ```bash
   git clone <repo>
   cd garmin-core-configuration-package-monorepo
   pnpm install
````

3. **Run Development Server**

   ```bash
   pnpm dev:web  # Web configurator (port 3000)
   pnpm dev:hmi  # HMI UI (port 3001)
   ```

## Workflow

1. Create feature branch: `git checkout -b feat/my-feature`
2. Make changes
3. Write tests
4. Run tests: `pnpm test`
5. Type check: `pnpm type-check`
6. Lint: `pnpm lint:fix`
7. Commit: `git commit -m "feat(scope): description"`
8. Push and create PR

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(scope): add new feature`
- `fix(scope): fix bug`
- `docs(scope): update documentation`
- `test(scope): add tests`
- `refactor(scope): refactor code`
- `chore(scope): update dependencies`

**Scopes:** schema, web-configurator, hmi-ui, docs, config

## Pull Request Guidelines

- All tests must pass
- No TypeScript errors
- Code coverage should not decrease
- Update documentation if needed
- Add tests for new features

````

**Priority:** 🟢 Medium - Add CONTRIBUTING.md this week, Storybook next month

**Impact:** Better onboarding, easier collaboration, clearer APIs

---

## 🔵 7. Performance Monitoring (Low Priority)

### Recommended Implementation

#### A. Add Bundle Analyzer

```bash
pnpm add -D -w rollup-plugin-visualizer
````

**Update `packages/hmi-ui/vite.config.ts`:**

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    preact(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
    }),
  ],
});
```

**Add script:**

```json
{
  "scripts": {
    "build:analyze": "pnpm build && open dist/stats.html"
  }
}
```

#### B. Add Lighthouse CI

```bash
pnpm add -D -w @lhci/cli
```

**File:** `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "pnpm --filter @gcg/web-configurator preview",
      "url": ["http://localhost:4173"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}
```

#### C. Add Performance Budget

**File:** `packages/hmi-ui/performance-budget.json`

```json
{
  "budget": [
    {
      "resourceType": "script",
      "maxSize": "50kb"
    },
    {
      "resourceType": "total",
      "maxSize": "100kb"
    }
  ]
}
```

**Priority:** 🔵 Low - Implement when builds are stable

**Impact:** Ensures fast loading, catches performance regressions

---

## 🔵 8. Additional Nice-to-Haves (Low Priority)

### A. Add Changesets for Version Management

```bash
pnpm add -D -w @changesets/cli
pnpm exec changeset init
```

### B. Add Release Automation

```bash
pnpm add -D -w semantic-release
```

### C. Add Error Tracking (Sentry)

```typescript
// For production builds
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_DSN',
  environment: import.meta.env.MODE,
});
```

### D. Add Analytics (Privacy-First)

Consider [Plausible](https://plausible.io/) or [Fathom](https://usefathom.com/) for lightweight analytics.

---

## 📅 Implementation Timeline

### Week 1 (This Week)

- ✅ Fix Jest config issue (5 min)
- ✅ Add ESLint overrides (10 min)
- ✅ Set up Husky + lint-staged (15 min)
- ✅ Configure VS Code settings (5 min)
- ✅ Add Dependabot config (5 min)
- ✅ Create CONTRIBUTING.md (30 min)
- ✅ Add proper test fixtures to schema package (1 hour)

**Total time:** ~2 hours

### Week 2

- Add Stylelint (30 min)
- Add Markdownlint (15 min)
- Set up Vitest for web-configurator (1 hour)
- Write first component tests (2 hours)
- Add coverage reporting to CI (30 min)
- Create architecture diagrams (1 hour)

**Total time:** ~5 hours

### Week 3

- Set up Playwright E2E tests (2 hours)
- Write critical path E2E tests (3 hours)
- Add TypeDoc API documentation (1 hour)
- Add bundle size tracking (1 hour)

**Total time:** ~7 hours

### Week 4

- Set up Storybook (2 hours)
- Document key components (3 hours)
- Add performance monitoring (2 hours)
- Final polish and documentation review (2 hours)

**Total time:** ~9 hours

---

## ✅ Quick Wins Checklist

Tasks you can do **right now** (< 30 minutes total):

- [ ] Fix `jest.config.js` to use CommonJS
- [ ] Add ESLint overrides for test files
- [ ] Create `.github/dependabot.yml`
- [ ] Copy recommended `.vscode/settings.json`
- [ ] Add npm scripts for common tasks
- [ ] Run `pnpm lint:md:fix` (after installing markdownlint)

---

## 📊 Expected Impact

| Improvement            | Developer Experience | Code Quality | Production Readiness |
| ---------------------- | -------------------- | ------------ | -------------------- |
| Linting & Formatting   | ⭐⭐⭐⭐⭐           | ⭐⭐⭐⭐⭐   | ⭐⭐⭐               |
| Pre-commit Hooks       | ⭐⭐⭐⭐             | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐             |
| Testing (Unit + E2E)   | ⭐⭐⭐⭐             | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐           |
| CI/CD Enhancements     | ⭐⭐⭐               | ⭐⭐⭐⭐     | ⭐⭐⭐⭐⭐           |
| VS Code Setup          | ⭐⭐⭐⭐⭐           | ⭐⭐⭐       | ⭐⭐                 |
| Documentation          | ⭐⭐⭐⭐             | ⭐⭐⭐       | ⭐⭐⭐               |
| Performance Monitoring | ⭐⭐                 | ⭐⭐⭐       | ⭐⭐⭐⭐             |

---

## 🎯 Priorities Summary

**Do Today** (5-30 minutes):

1. Fix Jest config
2. Add Dependabot
3. Set up VS Code settings
4. Install Husky

**Do This Week** (2-5 hours):

1. Add pre-commit hooks
2. Create test fixtures
3. Write CONTRIBUTING.md
4. Add Stylelint/Markdownlint

**Do This Month** (20+ hours):

1. Comprehensive unit tests
2. E2E tests with Playwright
3. Storybook component docs
4. Bundle size monitoring

---

## 📝 Notes

- Your project already has **excellent foundations** - these improvements build on that
- Focus on **testing first** - it has the highest ROI
- The **CI/CD improvements** will pay dividends over time
- Don't implement everything at once - prioritize based on team needs
- Consider your **deployment timeline** when scheduling work

---

**Last Updated:** October 12, 2025  
**Next Review:** After implementing Week 1 tasks
