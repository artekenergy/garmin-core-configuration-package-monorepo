# Fly.io Deployment Guide

This guide walks you through deploying the Garmin Core Graphics Configurator to Fly.io.

## Prerequisites

1. **Install Fly.io CLI**: [Download and install flyctl](https://fly.io/docs/hands-on/install-flyctl/)
2. **Create Fly.io account**: Sign up at [fly.io](https://fly.io/)
3. **Login**: Run `flyctl auth login`

## Quick Deployment

### 1. Initial Setup

```bash
# Login to Fly.io
flyctl auth login

# Create a new app (optional - you can use the existing fly.toml)
flyctl apps create garmin-core-configurator
```

### 2. Deploy

```bash
# Deploy from the repository root
flyctl deploy

# Or deploy with a specific app name
flyctl deploy --app garmin-core-configurator
```

### 3. Access Your App

Once deployed, your app will be available at:
`https://garmin-core-configurator.fly.dev`

## Configuration

The deployment is configured via `fly.toml`:

- **App Name**: `garmin-core-configurator`
- **Region**: `ord` (Chicago - can be changed)
- **Port**: `3000`
- **Auto-scaling**: Enabled (scales to 0 when idle)
- **Memory**: 512MB
- **CPU**: 1 shared core

## Custom Domain (Optional)

To use a custom domain:

```bash
# Add a certificate for your domain
flyctl certs create your-domain.com

# Add DNS records as instructed by Fly.io
```

## Environment Variables

Set environment variables if needed:

```bash
flyctl secrets set NODE_ENV=production
flyctl secrets set CUSTOM_VAR=value
```

## Monitoring

- **Logs**: `flyctl logs`
- **Status**: `flyctl status`
- **Metrics**: Available in the Fly.io dashboard

## Scaling

```bash
# Scale up/down
flyctl scale count 2

# Change machine size
flyctl scale vm shared-cpu-2x --memory 1024
```

## Troubleshooting

### Build Issues
- Ensure all dependencies are properly installed
- Check that the build process completes successfully locally
- Verify Docker build works: `docker build -t test .`

### Runtime Issues
- Check logs: `flyctl logs`
- Verify nginx configuration in Dockerfile
- Ensure static files are properly copied

### Performance
- Monitor CPU/memory usage in dashboard
- Scale up if needed
- Consider using a larger VM size for better performance

## Continuous Deployment

Set up GitHub Actions for automatic deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Fly.io
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Add your Fly.io API token to GitHub secrets as `FLY_API_TOKEN`.