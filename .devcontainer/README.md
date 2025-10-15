# Dev Container

This repo includes a VS Code Dev Container for a consistent environment across macOS and Windows.

What you get:
- Node.js 18 (via devcontainers/javascript-node)
- pnpm 8 (via Corepack)
- Cached pnpm store for faster installs
- Recommended VS Code extensions

How to use:
1. Install Docker Desktop and VS Code with the Dev Containers extension.
2. Open this repo in VS Code.
3. When prompted, "Reopen in Container". Or run: "Dev Containers: Reopen in Container" from the command palette.
4. The container will install workspace deps automatically (`pnpm install -w`).

Common tasks:
- Run all builds: `pnpm run build`
- Dev web-configurator: `pnpm --filter @gcg/web-configurator dev`
- Dev hmi-ui (vite): `pnpm --filter @gcg/hmi-ui dev`
- Full deploy workflow: `pnpm run deploy:full`

Ports exposed:
- 3000 → web-configurator
- 5173/5174 → Vite dev servers
- 4173 → Vite preview

Tips:
- If you need additional OS packages, edit `.devcontainer/Dockerfile` and rebuild the container.
- Keep Node and pnpm in sync by updating `package.json#packageManager` and `.devcontainer/Dockerfile`.