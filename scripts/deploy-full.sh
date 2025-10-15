#!/bin/bash

# Orchestrate the full deployment workflow from the monorepo root.
# This runs the shared hardware-config sync, builds each package,
# stages the HMI bundle, validates schemas, and (optionally) deploys to Fly.io.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

step() {
  echo ""
  echo "[$(date '+%H:%M:%S')] ➜ $1"
  echo ""
}

step "Syncing shared hardware configuration assets"
pnpm run prebuild

step "Building shared schema package"
pnpm --filter @gcg/schema build

step "Building and deploying HMI UI bundle"
pnpm --filter @gcg/hmi-ui deploy:web

step "Building web configurator (includes deployment package refresh)"
pnpm --filter @gcg/web-configurator build

step "Validating exported schemas for static bindings"
node scripts/check-no-static-bindings.js

if [[ -n "${FLY_SKIP_DEPLOY:-}" ]]; then
  echo ""
  echo "ℹ️  FLY_SKIP_DEPLOY is set — skipping Fly.io deployment step."
  echo "    Run pnpm run deploy manually when you are ready to publish."
  echo ""
elif ! command -v flyctl >/dev/null 2>&1; then
  echo ""
  echo "⚠️  flyctl not found in PATH — skipping Fly.io deployment."
  echo "    To deploy manually once flyctl is installed, run: pnpm run deploy"
  echo ""
else
  fly_build_section="$(awk '
    /^\[build\]$/ { in_build=1; next }
    /^\[/        { in_build=0 }
    in_build     { print }
  ' "$ROOT_DIR/fly.toml" 2>/dev/null || true)"

  if [[ -f "$ROOT_DIR/Dockerfile" ]] || grep -Eq '^\s*(image|builder|dockerfile)\s*=' <<<"$fly_build_section"; then
    step "Deploying latest web configurator build to Fly.io"
    pnpm run deploy
  else
    echo ""
    echo "⚠️  No Dockerfile or Fly.io build configuration detected — skipping Fly.io deployment."
    echo "    Add a Dockerfile or set build.image/builder in fly.toml, then rerun pnpm run deploy."
    echo ""
  fi
fi

echo ""
echo "✅ Deployment workflow complete."
echo "   • HMI bundle staged in garmin-bundle/web"
echo "   • Export package refreshed under packages/web-configurator/public/deployment-package"
echo "   • Web configurator build output in packages/web-configurator/dist"
echo ""
