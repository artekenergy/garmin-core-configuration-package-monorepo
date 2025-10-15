# syntax=docker/dockerfile:1

# ---- Builder ----
FROM node:18-bullseye-slim AS builder

ENV CI=1
WORKDIR /app

# Enable Corepack and pin pnpm
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate \
 && apt-get update && apt-get install -y --no-install-recommends bash \
 && rm -rf /var/lib/apt/lists/*

# Copy minimal workspace manifests first for better caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY packages/schema/package.json packages/schema/package.json
COPY packages/hmi-ui/package.json packages/hmi-ui/package.json
COPY packages/web-configurator/package.json packages/web-configurator/package.json

# Install dependencies (workspace)
RUN pnpm install -w --frozen-lockfile

# Copy the rest of the repo
COPY packages ./packages
COPY configuration ./configuration
COPY garmin-bundle ./garmin-bundle
COPY scripts ./scripts
COPY README.md ./

# Build shared schema
RUN pnpm --filter @gcg/schema build

# Build + stage HMI bundle to garmin-bundle/web (used by configurator export)
RUN pnpm --filter @gcg/hmi-ui deploy:web

# Build web-configurator (includes prebuild copy of deployment-package)
RUN pnpm --filter @gcg/web-configurator build

# ---- Runtime ----
FROM node:18-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy built configurator output to /app/dist so Fly statics can serve it
COPY --from=builder /app/packages/web-configurator/dist /app/dist

# Tiny static server for health checks and flexibility
COPY server.mjs /app/server.mjs
EXPOSE 3000
CMD ["node", "server.mjs"]
