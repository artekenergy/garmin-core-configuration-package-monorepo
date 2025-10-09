# Architectural Decision Log

## Purpose
This document records all major technical decisions made during the Garmin Core Graphics Configurator project. Each decision includes context, options considered, and rationale.

---

## ADR-001: Monorepo Structure
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need to manage three interdependent packages: schema, web configurator, and HMI UI.

### Decision
Use a **pnpm workspace monorepo** with three packages:
- `@gcg/schema`
- `@gcg/web-configurator` 
- `@gcg/hmi-ui`

### Alternatives Considered
1. Separate repositories - Too much overhead for maintaining versions
2. npm workspaces - pnpm has better performance and disk usage
3. Lerna/Nx - Overkill for 3 packages

### Rationale
- Shared TypeScript types without publishing
- Single version for all packages
- Atomic commits across packages
- pnpm is fast and efficient

---

## ADR-002: Schema Validation Library
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need runtime validation for schemas with excellent TypeScript integration.

### Decision
Use **Zod** for schema validation.

### Alternatives Considered
1. JSON Schema + Ajv - More standard, but weaker TS integration
2. io-ts - Good TS integration but more verbose
3. Yup - Less type-safe than Zod

### Rationale
- Best-in-class TypeScript inference
- Runtime validation with compile-time types
- Great error messages
- Active development

---

## ADR-003: Web Configurator Framework
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need a modern UI framework for the browser-based schema editor.

### Decision
Use **React 18 + Vite + TypeScript**.

### Alternatives Considered
1. Vue 3 - Less ecosystem for drag-drop builders
2. Svelte - Smaller but less mature tooling
3. Vanilla TS - Too much reinventing

### Rationale
- Mature ecosystem for form builders
- Excellent TypeScript support
- Vite provides fast dev experience
- Large talent pool for future maintenance

---

## ADR-004: HMI UI Framework
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need a lightweight UI framework that can run on WebView 83 (Android 10).

### Decision
Use **Preact 10 + @preact/signals + Vite**.

### Alternatives Considered
1. React - Too heavy (40KB+ gzipped)
2. Vue 3 - Still larger than Preact
3. Vanilla JS - No reactivity primitives
4. Lit - Good but less familiar

### Rationale
- Only 3KB gzipped
- React-compatible API (easy to learn)
- Signals for efficient reactivity
- Vite can transpile to ES2017
- Battle-tested in embedded contexts

---

## ADR-005: State Management (HMI UI)
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need efficient state management for HMI UI with minimal overhead.

### Decision
Use **@preact/signals** for global state.

### Alternatives Considered
1. Zustand - Extra dependency, less integrated
2. Redux - Way too heavy
3. Context API - Performance issues with many updates
4. MobX - Larger bundle

### Rationale
- Native Preact integration
- Fine-grained reactivity (no unnecessary re-renders)
- Tiny bundle size
- Simple mental model

---

## ADR-006: Build Target for HMI UI
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
HMI runs on Android 10 with Chrome 83, which supports ES2017 but not ES2020+.

### Decision
Configure Vite to transpile to **ES2017** with the following disabled:
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Dynamic imports (use single bundle)
- Top-level await

### Alternatives Considered
1. ES2015 - Too conservative, larger bundle
2. ES2020 - Would break in WebView 83
3. No transpiling - Would fail

### Rationale
- ES2017 includes async/await (essential)
- Removes modern syntax that would crash
- Minimal bundle size increase
- Wide compatibility

---

## ADR-007: Schema Format
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need a structured format for defining UI layouts.

### Decision
Use **JSON format** with the following structure:

```json
{
  "version": "0.1.0",
  "metadata": { ... },
  "theme": { ... },
  "icons": { ... },
  "tabs": [
    {
      "id": "...",
      "label": "...",
      "sections": [
        {
          "id": "...",
          "components": [
            { "type": "toggle", "id": "...", "bindings": {...} }
          ]
        }
      ]
    }
  ]
}
```

### Alternatives Considered
1. YAML - Less compatible with web APIs
2. TOML - Not widely supported in JS
3. Custom DSL - Too much maintenance

### Rationale
- Native browser support
- Easy to validate
- Human-readable
- Industry standard

---

## ADR-008: Component Bindings Model
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Components need to map to EmpirBus channels and NMEA2000 PGNs.

### Decision
Each component has a `bindings` object:

```json
{
  "bindings": {
    "state": {
      "type": "empirbus",
      "channel": "out-channel-1",
      "property": "state"
    },
    "value": {
      "type": "nmea2000",
      "pgn": 127488,
      "field": "engineSpeed"
    }
  }
}
```

### Alternatives Considered
1. String paths - Less structured
2. Separate bindings file - Extra complexity
3. Auto-discovery - Unreliable

### Rationale
- Explicit and type-safe
- Supports multiple protocols
- Easy to validate
- Future-proof for new protocols

---

## ADR-009: Icon Asset Management
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need to manage custom icons efficiently.

### Decision
- Icons defined in schema with unique IDs
- Web Configurator uploads to asset library
- Export includes only referenced icons
- HMI UI loads from `/assets/icons/`

### Alternatives Considered
1. Inline base64 - Bloats schema
2. External CDN - Requires network
3. Icon fonts - Less flexible

### Rationale
- Minimal schema size
- Optimized bundle
- Offline-first
- Easy to update

---

## ADR-010: Testing Strategy
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need reliable testing across all packages.

### Decision
- **Schema**: Jest + Zod validation tests
- **Web Configurator**: Vitest + React Testing Library
- **HMI UI**: Vitest + @testing-library/preact
- **E2E**: Playwright (later phase)

### Alternatives Considered
1. All Jest - Vitest faster for Vite projects
2. Cypress for E2E - Playwright better for mobile emulation
3. No E2E - Too risky for embedded device

### Rationale
- Fast feedback loops
- Component isolation
- Real browser testing for critical path
- Industry best practices

---

## ADR-011: Package Manager
**Date**: October 2, 2025  
**Status**: ✅ Accepted

### Context
Need efficient dependency management for monorepo.

### Decision
Use **pnpm**.

### Alternatives Considered
1. npm - Slower, more disk usage
2. yarn - Slower than pnpm
3. yarn berry (v2+) - Too experimental

### Rationale
- Fastest install times
- Disk-efficient (content-addressable storage)
- Excellent workspace support
- Strict dependency resolution

---

## ADR-012: Deployment Strategy
**Date**: October 2, 2025  
**Status**: 🟡 Proposed (Not Yet Implemented)

### Context
Need to deploy HMI UI to Garmin HMI device.

### Proposed Decision
1. Build HMI UI with Vite
2. Output to `web/dist/`
3. Update `index1.html` to load bundle
4. Package entire `web/` folder
5. Upload to HMI via Garmin tooling

### Open Questions
- Do we need to sign the bundle?
- What's the update mechanism?
- How to handle version rollback?

---

## 📝 Decision Template

Use this template for new decisions:

```markdown
## ADR-XXX: [Title]
**Date**: [Date]
**Status**: 🟡 Proposed | ✅ Accepted | ⛔ Rejected | 📦 Superseded

### Context
[What is the issue that we're seeing that is motivating this decision or change?]

### Decision
[What is the change that we're proposing and/or doing?]

### Alternatives Considered
1. [Alternative 1] - [Why not]
2. [Alternative 2] - [Why not]

### Rationale
- [Key reason 1]
- [Key reason 2]
- [Key reason 3]

### Consequences
- [Positive consequence 1]
- [Negative consequence 1]
```

---

**Last Updated**: October 2, 2025
