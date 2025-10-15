# Developer Setup Guide

Get this repo running on a fresh PC in minutes. Choose your path: Dev Container (recommended), bare‑metal on Windows, or Docker for a production-like image.

---

## Prerequisites

- Git
- Option A (Dev Container): Docker Desktop, VS Code, Dev Containers extension
- Option B (Bare‑metal Windows): Node.js 18.x LTS, PowerShell (or Git Bash/WSL2 for bash scripts)
- Option C (Docker): Docker Desktop

The repo pins the toolchain to keep things consistent:

- Node: 18.x
- pnpm: 8.10.0 (managed via Corepack)

---

## Option A — VS Code Dev Container (recommended)

This is the easiest and most consistent path across Windows/macOS/Linux.

1) Open the repo in VS Code.
1) When prompted, “Reopen in Container” (or run “Dev Containers: Reopen in Container”).
1) The container auto-installs workspace dependencies and matches the pinned Node/pnpm.

Common tasks inside the container:

```bash
# Install (usually runs automatically on first open)
pnpm install -w

# Run both apps in parallel (HMI UI + Web Configurator)
pnpm dev

# Type-check everything
pnpm type-check

# Build everything
pnpm build

# Full deploy workflow (builds HMI UI, stages bundle, builds configurator)
pnpm run deploy:full
```

Exposed ports (forwarded by the container):

- 5173/5174 → Vite dev servers (HMI UI / Web Configurator)
- 4173 → Vite preview
- 3000 → Web Configurator (when built/served by server)

Tips:

- Edit `.devcontainer/Dockerfile` to add extra OS packages, then “Rebuild Container”.
- Keep Node and pnpm pinned in sync with `package.json#packageManager` and `.devcontainer/Dockerfile`.

---

## Option B — Bare‑metal on Windows

Use this if you prefer running directly on your Windows host.

1) Install Node 18.x and enable Corepack/pnpm:

```powershell
corepack enable
corepack prepare pnpm@8.10.0 --activate
pnpm -v
```

1) Install workspace dependencies:

```powershell
pnpm install -w
```

1) Start dev servers:

```powershell
# All dev servers in parallel
pnpm dev

# Or individually (run in separate terminals as needed)
pnpm --filter @gcg/hmi-ui dev
pnpm --filter @gcg/web-configurator dev
```

1) Build pipeline (manual sequence):

```powershell
pnpm --filter @gcg/schema build
pnpm --filter @gcg/hmi-ui build
# Stages HMI bundle for configurator export (bash script)
# Use Git Bash or WSL for the following line
pnpm --filter @gcg/hmi-ui deploy:web
pnpm --filter @gcg/web-configurator prebuild
pnpm --filter @gcg/web-configurator build
```

1) Quick checks:

```powershell
pnpm type-check
node scripts/check-no-static-bindings.js
```

Windows notes:

- Any script ending in `.sh` (e.g., `deploy-to-web.sh`, `deploy-full.sh`) requires Git Bash or WSL2.
- Vite dev servers select available ports (commonly 5173/5174). Check your terminal for exact URLs.

---

## Option C — Docker (production-like image)

Build a container image that serves the built configurator via a tiny Node server.

```bash
# From repo root
docker build -t garmin-configurator:latest .
docker run --rm -p 3000:3000 garmin-configurator:latest
# Open http://localhost:3000
```

---

## What you get running locally

- HMI UI dev server (fast Preact/Vite hot reload)
- Web Configurator dev server (React/Vite)
- Exported deployment packages with empirbus-only gauge value bindings
- Export-time hardware augmentation for referenced `signal-…` channels
- Correct scaling for power gauges (voltage/current/SoC) in HMI UI

---

## Validation and CI parity

Run the same checks CI uses:

```bash
# Type-check across all packages
pnpm type-check

# Validate no static value bindings in exported artifacts
node scripts/check-no-static-bindings.js
```

Optional (if you want to mimic the CI build order locally):

```bash
pnpm --filter @gcg/schema build
pnpm --filter @gcg/hmi-ui build
pnpm --filter @gcg/hmi-ui deploy:web
pnpm --filter @gcg/web-configurator prebuild
pnpm --filter @gcg/web-configurator build:skip-prebuild
```

---

## Troubleshooting

- “bash: command not found” on Windows
  - Use Git Bash or WSL2 for bash scripts (`*.sh`).
  - Dev Container avoids this entirely.

- Ports already in use
  - Vite will auto-pick a new port; check the terminal output for the actual URL.

- pnpm/corepack mismatch
  - Re-run:

    ```powershell
    corepack enable
    corepack prepare pnpm@8.10.0 --activate
    ```

- Slow installs on Windows/macOS
  - Dev Container uses cached pnpm stores. On bare‑metal, consider enabling pnpm’s store dir on a fast disk.

---

## Quick reference

```bash
# Start both apps
pnpm dev

# Individually
pnpm --filter @gcg/hmi-ui dev
pnpm --filter @gcg/web-configurator dev

# Build all
pnpm build

# Checks
pnpm type-check
node scripts/check-no-static-bindings.js
```

See also: `.devcontainer/README.md` for container details.
