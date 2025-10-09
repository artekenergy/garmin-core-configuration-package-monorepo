# @gcg/hmi-ui

> **Embedded UI renderer for Garmin HMI devices**

## Overview

Lightweight Preact application that renders GCG schemas on Garmin HMI hardware.

## Features (Planned)

- ✅ Runtime schema loading
- ✅ Dynamic component rendering
- ✅ EmpirBus data bindings
- ✅ NMEA2000 data bindings
- ✅ WebView 83 compatible (ES2017)

## Build Target

**Critical**: This package MUST be transpiled to ES2017 for WebView 83 compatibility.

No modern syntax:
- ❌ Optional chaining (`?.`)
- ❌ Nullish coalescing (`??`)
- ❌ Dynamic imports
- ✅ async/await (supported in ES2017)

## Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## Deployment

Build output goes to `dist/` and should be deployed to:
```
web/index1.html  (entry point)
web/assets/      (bundled JS/CSS)
```

## Tech Stack

- Preact 10
- @preact/signals
- TypeScript
- Vite (with ES2017 target)
- @gcg/schema

---

**Status**: 🚧 Not yet implemented (Phase 3)
