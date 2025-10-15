# syntax=docker/dockerfile:1
ARG VARIANT=18
FROM mcr.microsoft.com/devcontainers/javascript-node:${VARIANT}

# Install OS deps you might need (git already present). Minimal footprint.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       ca-certificates \
       bash \
    && rm -rf /var/lib/apt/lists/*

# Enable Corepack and pin pnpm
USER node
RUN corepack enable && corepack prepare pnpm@8.10.0 --activate

WORKDIR /workspaces/app
