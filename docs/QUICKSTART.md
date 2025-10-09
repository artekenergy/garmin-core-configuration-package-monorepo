# Quick Start Guide

## 🎯 What We're Building

A **schema-driven UI customization system** for Garmin EmpirBus HMI devices with two apps:
1. **Web Configurator** - Browser app to create UI schemas
2. **HMI UI** - Embedded app that renders schemas on the HMI device

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| `PROJECT_ROADMAP.md` | High-level phases and milestones |
| `DECISIONS.md` | Technical decisions and rationale |
| `SCHEMA_SPEC.md` | Complete schema format specification |
| `README.md` | (To create) Project overview and setup |

---

## 🗂️ Current Project Structure

```
core_v2_9-30-25_v1/
├── 📄 PROJECT_ROADMAP.md      # ← You are in Phase 1, Step 1.1
├── 📄 DECISIONS.md             # ← Architectural decisions
├── 📄 SCHEMA_SPEC.md           # ← Schema design spec
├── 📄 core-v2_9-30-25_v1.ebp  # System config from Garmin
├── configuration/
│   └── applications.json       # App registry
├── services/                   # Service definitions
└── web/                        # Garmin web bundle
    ├── index.html              # Working app selector
    ├── index1.html             # ⚠️ BLANK - Our target
    ├── manifest1.json          # Points to index1.html
    └── garmin/
        └── empirbus_config1.json
```

---

## ✅ What's Been Done (October 2, 2025)

### Planning Complete ✅
- [x] Project roadmap defined
- [x] Architectural decisions documented
- [x] Schema specification written
- [x] Current state analyzed

### Ready to Build
- [ ] Monorepo setup
- [ ] `@gcg/schema` package
- [ ] Web Configurator
- [ ] HMI UI

---

## 🚀 Next Steps (In Order)

### Step 1: Initialize Monorepo (TODAY)

**Goal**: Create workspace structure for three packages.

**Actions**:
```bash
# 1. Initialize pnpm workspace
pnpm init

# 2. Create workspace config
# Create: pnpm-workspace.yaml

# 3. Create package directories
mkdir -p packages/schema
mkdir -p packages/web-configurator
mkdir -p packages/hmi-ui

# 4. Initialize each package
cd packages/schema && pnpm init
cd ../web-configurator && pnpm init
cd ../hmi-ui && pnpm init
cd ../..

# 5. Create shared configs
# - tsconfig.base.json
# - .gitignore
# - .prettierrc (optional)
# - .eslintrc (optional)
```

**Success Criteria**:
- ✅ Three packages scaffolded
- ✅ Workspace can be installed: `pnpm install`
- ✅ Packages can reference each other

---

### Step 2: Build `@gcg/schema` Package (THIS WEEK)

**Goal**: Create schema validation package with Zod.

**Actions**:
1. Install dependencies:
   ```bash
   pnpm add -D typescript @types/node zod jest @types/jest ts-jest
   ```

2. Create files:
   ```
   packages/schema/
   ├── src/
   │   ├── index.ts              # Public API
   │   ├── schema.ts             # Zod schemas
   │   ├── types.ts              # Exported TypeScript types
   │   └── validators.ts         # Custom validation logic
   ├── tests/
   │   ├── schema.test.ts
   │   └── fixtures/
   │       ├── valid-minimal.json
   │       ├── valid-complex.json
   │       └── invalid-*.json
   ├── package.json
   ├── tsconfig.json
   └── jest.config.js
   ```

3. Implement schema (see `SCHEMA_SPEC.md`)

4. Write tests for:
   - Valid schemas pass
   - Invalid schemas fail with clear errors
   - Component ID uniqueness
   - Icon reference validation
   - Version validation

**Success Criteria**:
- ✅ All tests passing
- ✅ Can import types: `import { GCGSchema } from '@gcg/schema'`
- ✅ Validation works: `validateSchema(json)`

---

### Step 3: Scaffold Web Configurator (THIS WEEK)

**Goal**: Create React app shell with routing.

**Actions**:
```bash
cd packages/web-configurator
pnpm create vite . --template react-ts
pnpm install
pnpm add @gcg/schema zod react-router-dom
pnpm add -D @types/node
```

**File Structure**:
```
packages/web-configurator/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/
│   │   ├── Editor.tsx
│   │   ├── Preview.tsx
│   │   └── Export.tsx
│   └── components/
│       └── Layout.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**Success Criteria**:
- ✅ Dev server runs: `pnpm dev`
- ✅ Three routes work (Editor/Preview/Export)
- ✅ Can import `@gcg/schema` types

---

### Step 4: Scaffold HMI UI (NEXT WEEK)

**Goal**: Create Preact app with ES2017 build target.

**Actions**:
```bash
cd packages/hmi-ui
pnpm create vite . --template preact-ts
pnpm install
pnpm add @gcg/schema @preact/signals
pnpm add -D @babel/preset-env
```

**Critical**: Update `vite.config.ts`:
```typescript
export default {
  build: {
    target: 'es2017',  // ← Essential for WebView 83
    minify: 'terser',
  },
  esbuild: {
    target: 'es2017',
  },
}
```

**Success Criteria**:
- ✅ Build output is ES2017-compatible
- ✅ Can import `@gcg/schema`
- ✅ Bundle size < 50KB gzipped

---

## 🎓 Learning Resources

### Zod (Schema Validation)
- [Zod Documentation](https://zod.dev)
- [TypeScript Inference](https://zod.dev/?id=type-inference)

### Preact + Signals
- [Preact Documentation](https://preactjs.com)
- [Signals Guide](https://preactjs.com/guide/v10/signals/)

### Vite
- [Vite Documentation](https://vitejs.dev)
- [Build Options](https://vitejs.dev/config/build-options.html)

### pnpm Workspaces
- [Workspace Documentation](https://pnpm.io/workspaces)

---

## 🚨 Common Pitfalls to Avoid

### ❌ Don't Skip Planning
- **Bad**: Jump straight to coding
- **Good**: Follow the roadmap phases

### ❌ Don't Use Modern JS Syntax in HMI UI
- **Bad**: Optional chaining (`?.`), nullish coalescing (`??`)
- **Good**: Traditional syntax with proper transpilation

### ❌ Don't Create Circular Dependencies
- **Bad**: HMI UI imports Web Configurator
- **Good**: Both import `@gcg/schema` only

### ❌ Don't Ignore Schema Validation
- **Bad**: Skip validation "to move faster"
- **Good**: Validate early and fail fast

### ❌ Don't Hardcode Paths
- **Bad**: `import from '../../schema'`
- **Good**: `import from '@gcg/schema'`

---

## 🧪 Testing Strategy

### Unit Tests (Jest/Vitest)
- Schema validation
- Component logic
- Utility functions

### Integration Tests
- Schema → Component rendering
- Export ZIP generation
- Icon loading

### E2E Tests (Later)
- Full workflow in browser
- Real device testing

---

## 📝 Git Workflow (Recommended)

```bash
# Create feature branch
git checkout -b feature/schema-package

# Work on feature...
git add .
git commit -m "feat(schema): implement Zod validators"

# Push and create PR
git push origin feature/schema-package
```

**Commit Message Format**:
- `feat(scope): description` - New feature
- `fix(scope): description` - Bug fix
- `docs(scope): description` - Documentation
- `test(scope): description` - Tests
- `refactor(scope): description` - Code refactor

---

## 🎯 Current Status

**Phase**: 1 (Foundation)  
**Step**: 1.1 (Monorepo Setup)  
**Next Action**: Initialize pnpm workspace

**Ready to proceed?** Let's create the monorepo structure! 🚀

---

## 📞 Quick Reference

### Install Dependencies
```bash
pnpm install
```

### Run Web Configurator
```bash
pnpm --filter @gcg/web-configurator dev
```

### Build HMI UI
```bash
pnpm --filter @gcg/hmi-ui build
```

### Run All Tests
```bash
pnpm -r test
```

### Type Check All
```bash
pnpm -r type-check
```

---

**Last Updated**: October 2, 2025  
**Status**: Ready to begin Phase 1, Step 1.1
