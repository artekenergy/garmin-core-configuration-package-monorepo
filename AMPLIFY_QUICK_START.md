# AWS Amplify - Quick Setup

## What You Need in the Repo ✅

1. **`amplify.yml`** (root directory) - Already created ✅
   - Configures build process for pnpm monorepo
   - Specifies build output directory
   - Handles workspace dependencies

2. **Authentication** - Already configured ✅
   - Login page with credentials
   - Username: `GarminInstaller`
   - Password: `Powering 2025!`
   - See `docs/AUTHENTICATION.md` for details

3. **Build Configuration** - Already configured ✅
   - `vite.config.ts` - Vite build settings
   - `package.json` scripts - Build commands
   - `tsconfig.json` - TypeScript compilation

## Amplify Console Setup Steps

### 1. Connect Repository

- Go to AWS Amplify Console
- "New app" → "Host web app"
- Connect your GitHub account
- Select `new-config-main` repository
- Choose branch (e.g., `main` or `styling`)

### 2. Configure Build

- Amplify auto-detects `amplify.yml`
- Verify settings match the config file
- **Build output directory**: `packages/web-configurator/dist`

### 3. Deploy

- Click "Save and deploy"
- Wait ~5-10 minutes for first build
- Get your URL: `https://[app-id].amplifyapp.com`

## That's It! 🎉

Every push to your connected branch automatically deploys.

## Optional Enhancements

### Custom Domain

1. Go to "Domain management"
2. Add your domain
3. Configure DNS (Amplify provides instructions)
4. SSL certificate is automatic

### Multiple Environments

Connect different branches:

- `main` → Production
- `staging` → Staging
- `dev` → Development

Each gets its own URL.

## Cost

- **Free tier**: 1000 build minutes/month, 15GB served
- **After**: ~$0.01/build minute, $0.15/GB served
- **Typical cost**: $5-20/month for normal usage

## Testing Locally First

```bash
cd packages/web-configurator
pnpm build
pnpm preview
```

Then verify at `http://localhost:4173`

## Files Already in Repo

- ✅ `amplify.yml` - Build configuration
- ✅ `docs/AWS_AMPLIFY_DEPLOYMENT.md` - Full guide
- ✅ All necessary package.json scripts
- ✅ Vite build configuration

**You're ready to deploy!** 🚀
