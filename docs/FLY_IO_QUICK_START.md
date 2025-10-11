# Fly.io Quick Start Guide

Get your Garmin Core Graphics Configurator deployed to Fly.io in 5 minutes.

## 1. Install Fly.io CLI

### Windows (PowerShell)
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### macOS/Linux
```bash
curl -L https://fly.io/install.sh | sh
```

## 2. Login and Deploy

```bash
# Login to your Fly.io account
flyctl auth login

# Deploy from the repository root
flyctl deploy

# Your app will be available at:
# https://garmin-core-configurator.fly.dev
```

## 3. That's it! 🚀

Your app is now live on Fly.io with:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-scaling (scales to 0 when idle)
- ✅ Built-in monitoring

## Next Steps

- **Custom Domain**: `flyctl certs create your-domain.com`
- **Monitor Logs**: `flyctl logs`
- **Scale Up**: `flyctl scale count 2`
- **View Status**: `flyctl status`

## Need Help?

- 📖 [Complete Deployment Guide](./docs/FLY_IO_DEPLOYMENT.md)
- 🔧 [Fly.io Documentation](https://fly.io/docs/)
- 💬 [Fly.io Community](https://community.fly.io/)