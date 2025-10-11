# Multi-stage build for Garmin Core Graphics Configurator
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@9.15.9

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/schema/package.json ./packages/schema/
COPY packages/hmi-ui/package.json ./packages/hmi-ui/
COPY packages/web-configurator/package.json ./packages/web-configurator/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Build packages in the correct order
RUN cd packages/schema && pnpm build
RUN cd packages/hmi-ui && pnpm build  
# Skip prebuild script and run build directly for web-configurator
RUN cd packages/web-configurator && pnpm run build:skip-prebuild

# Production stage
FROM nginx:alpine AS production

# Copy built files from builder stage
COPY --from=builder /app/packages/web-configurator/dist /usr/share/nginx/html

# Copy nginx configuration for SPA
RUN echo 'server { \
    listen 3000; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        return 404; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Update nginx to listen on port 3000
RUN sed -i 's/listen 80;/listen 3000;/' /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]