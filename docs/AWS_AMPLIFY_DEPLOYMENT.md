# AWS Amplify Deployment Guide

## Overview

This guide explains how to deploy the Garmin CORE Graphics Configurator web application to AWS Amplify.

## Prerequisites

1. **AWS Account** with Amplify access
2. **GitHub Repository** connected to AWS Amplify (or GitLab/Bitbucket)
3. **Node.js 18+** and **pnpm 8+** (configured in build)

## Repository Configuration

### 1. Amplify Build Configuration

The `amplify.yml` file at the root of the repository configures the build process:

- **Package Manager**: Uses pnpm (specified version 8.10.0)
- **Monorepo Support**: Builds dependencies in order (schema → web-configurator)
- **Build Output**: `packages/web-configurator/dist`
- **Caching**: Caches node_modules for faster builds

### 2. Build Process

The build happens in stages:

1. Install pnpm globally
2. Install all workspace dependencies
3. Build `@gcg/schema` package (required dependency)
4. Build `@gcg/web-configurator` (the main app)
5. Output static files to `dist/`

## AWS Amplify Setup

### Step 1: Create New Amplify App

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Choose your Git provider (GitHub recommended)
4. Authorize AWS Amplify to access your repository

### Step 2: Repository Configuration

1. **Select Repository**: Choose `new-config-main`
2. **Select Branch**: Choose `main` (or `styling` for development)
3. **App Name**: `garmin-core-graphics-configurator`

### Step 3: Build Settings

AWS Amplify should automatically detect the `amplify.yml` file. Verify it shows:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Installing pnpm..."
        - npm install -g pnpm@8.10.0
        ...
```

**Important**: Make sure the build settings match the `amplify.yml` file.

### Step 4: Advanced Settings

#### Environment Variables (if needed)

You can add environment variables in the Amplify Console:

- Go to **App settings** → **Environment variables**
- Add any required variables (none currently needed)

#### Build Image

- Use the default build image (Amazon Linux 2)
- Node.js 18 is supported

#### Service Role

- Create or select an IAM role with Amplify permissions
- Amplify will create one automatically if needed

### Step 5: Deploy

1. Click **"Save and deploy"**
2. Amplify will:
   - Clone your repository
   - Install dependencies
   - Build the application
   - Deploy to CloudFront CDN
3. First build takes ~5-10 minutes

## Post-Deployment

### Custom Domain (Optional)

1. Go to **Domain management**
2. Click **"Add domain"**
3. Enter your domain (e.g., `configurator.yourdomain.com`)
4. Follow DNS configuration steps
5. Amplify handles SSL certificates automatically

### Environment Configuration

For different environments (dev, staging, prod):

1. Go to **App settings** → **Environment variables**
2. Add environment-specific variables:
   ```
   VITE_API_URL=https://api.example.com
   VITE_ENV=production
   ```

### Branch Deployments

Deploy multiple branches for different environments:

1. Go to **App settings** → **Branch settings**
2. Connect additional branches:
   - `main` → Production
   - `staging` → Staging environment
   - `dev` → Development environment

Each branch gets its own URL:

- `main`: `https://main.xxxxx.amplifyapp.com`
- `staging`: `https://staging.xxxxx.amplifyapp.com`

## Continuous Deployment

Amplify automatically deploys when you push to connected branches:

1. Push code to GitHub
2. Amplify detects changes
3. Automatic build and deployment
4. ~3-5 minutes for subsequent builds (cached)

## Monitoring & Logs

### Build Logs

- View in **Amplify Console** → **Build history**
- See detailed logs for each phase (preBuild, build)

### Access Logs

- Enable access logs in **App settings**
- Stored in CloudWatch

### Performance

- Monitor via **App settings** → **Monitoring**
- CloudWatch metrics included

## Troubleshooting

### Build Failures

**Issue**: `pnpm: command not found`

- **Solution**: Verify `amplify.yml` installs pnpm in preBuild

**Issue**: `Cannot find module '@gcg/schema'`

- **Solution**: Ensure schema package builds before web-configurator
- Check workspace dependencies in root `package.json`

**Issue**: Build timeout

- **Solution**: Increase timeout in **Build settings** → **Build timeout**
- Default is 30 minutes

### Routing Issues

**Issue**: Page refresh returns 404

- **Solution**: Already configured in `vite.config.ts` with proper history mode
- Amplify handles SPA routing automatically

### Asset Loading Issues

**Issue**: Images/icons not loading

- **Solution**: Verify all assets are in `public/` directory
- Check `vite.config.ts` publicDir setting

## Cost Estimation

### AWS Amplify Pricing (as of 2025)

- **Build minutes**: $0.01 per build minute
  - ~5 min/build = $0.05 per deployment
- **Hosting**: $0.15 per GB served
  - Typical app: ~5MB = minimal cost
- **Free Tier**: 1000 build minutes/month, 15GB served/month

**Estimated Monthly Cost**: $5-20 depending on traffic

## Security Best Practices

1. **Enable HTTPS only** (default)
2. **Set up WAF** if handling sensitive data
3. **Use environment variables** for secrets (none currently needed)
4. **Enable branch protection** on GitHub
5. **Review IAM permissions** for the Amplify service role

## Performance Optimization

### Already Configured

- ✅ Vite build optimization
- ✅ React code splitting
- ✅ Source maps for debugging
- ✅ CloudFront CDN distribution

### Additional Optimizations

1. **Enable compression**: Gzip/Brotli (Amplify default)
2. **Cache headers**: Set in `amplify.yml` custom headers if needed
3. **Image optimization**: Consider using WebP formats

## Alternative Deployment Options

If AWS Amplify doesn't fit your needs:

### Vercel

```bash
cd packages/web-configurator
npm install -g vercel
vercel
```

### Netlify

```bash
cd packages/web-configurator
pnpm build
# Drag dist/ folder to Netlify dashboard
```

### AWS S3 + CloudFront (Manual)

```bash
cd packages/web-configurator
pnpm build
aws s3 sync dist/ s3://your-bucket-name
# Configure CloudFront distribution manually
```

## Maintenance

### Updating Dependencies

```bash
pnpm update
git commit -am "Update dependencies"
git push
# Amplify automatically rebuilds
```

### Rollback

1. Go to **Build history**
2. Click **"Redeploy"** on previous successful build
3. Instant rollback

## Support Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Amplify Discord](https://discord.gg/amplify)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

## Summary Checklist

- [ ] Create AWS account with Amplify access
- [ ] Connect GitHub repository to Amplify
- [ ] Verify `amplify.yml` is in repository root
- [ ] Configure branch deployment (main/staging/dev)
- [ ] Set custom domain (optional)
- [ ] Enable monitoring and logging
- [ ] Test deployment with a push to main branch
- [ ] Document production URL for team

## Quick Start Commands

```bash
# Test build locally before deploying
cd packages/web-configurator
pnpm build
pnpm preview

# Check build output
ls -la dist/

# Verify all assets included
# Should see: index.html, assets/, logo.svg, etc.
```

Your web configurator will be live at:
`https://[app-id].amplifyapp.com`

🚀 Ready to deploy!
