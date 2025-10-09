# Build and Deploy Workflow

## Overview

This project has two main deployment paths:

1. **Direct deployment** - Build and deploy HMI UI directly to `/web/` and create a ZIP
2. **Web-configurator export** - User exports a custom configuration package via the web UI

Both paths now stay automatically synchronized.

## Automatic Sync

When you run:

```bash
cd packages/hmi-ui
pnpm run deploy:web
```

The script automatically:

1. ✅ Builds the HMI UI (`tsc && vite build`)
2. ✅ Copies to `/web/` directory
3. ✅ Creates deployment ZIP package
4. ✅ **Syncs with web-configurator** (runs `pnpm run prebuild`)

This ensures that any HMI UI changes are immediately available in the web-configurator's export feature.

## Development Workflow

### Working on HMI UI Components

1. **Make changes** to HMI UI components (e.g., `packages/hmi-ui/src/components/Dimmer.tsx`)

2. **Test locally** at [http://localhost:3001/](http://localhost:3001/)

   ```bash
   cd packages/hmi-ui
   pnpm dev
   ```

3. **Deploy when ready**

   ```bash
   cd packages/hmi-ui
   pnpm run deploy:web
   ```

   This automatically syncs with web-configurator! ✨

4. **Export via web-configurator**
   - Open [http://localhost:3000/export](http://localhost:3000/export)
   - Click "Generate Deployment Package"
   - Download will include your latest HMI UI changes

### Working on Web-Configurator

1. **Make changes** to configurator UI (e.g., `packages/web-configurator/src/pages/EditorPage.tsx`)

2. **Test locally** at [http://localhost:3000/](http://localhost:3000/)

   ```bash
   cd packages/web-configurator
   pnpm dev
   ```

3. **Build when ready**

   ```bash
   cd packages/web-configurator
   pnpm build
   ```

The prebuild step (`copy-hmi-assets.js`) automatically runs before building.

## Deployment Packages

### Direct ZIP (Quick Testing)

```bash
cd packages/hmi-ui
pnpm run deploy:web
```

Creates: `garmin-hmi-deployment-YYYYMMDD_HHMMSS.zip`

Contains:

- `/web/` - Complete HMI UI application
- `/services/` - Backend service files
- `/configuration/` - Hardware config and channel mappings

### Web-Configurator Export (Production)

1. User configures their system at <http://localhost:3000/>
2. Goes to <http://localhost:3000/export>
3. Clicks "Generate Deployment Package"
4. Downloads `[schema-name]-config.zip`

Contains:

- `/web/` - Complete HMI UI with user's custom `schema.json`
- `/services/` - Backend service files
- `/configuration/` - Hardware config
- README with deployment instructions

## Manual Sync (If Needed)

If for some reason you need to manually sync:

```bash
cd packages/web-configurator
pnpm run prebuild
```

This copies everything from `/web/`, `/services/`, and `/configuration/` into `public/deployment-package/`.

## File Locations

### Source

- HMI UI: `packages/hmi-ui/src/`
- Web Configurator: `packages/web-configurator/src/`

### Build Output

- HMI UI dist: `packages/hmi-ui/dist/`
- Web Configurator dist: `packages/web-configurator/dist/`

### Deployment Staging

- Direct deployment: `/web/`, `/services/`, `/configuration/`
- Web-configurator export: `packages/web-configurator/public/deployment-package/`

### Final Packages

- Direct: `garmin-hmi-deployment-YYYYMMDD_HHMMSS.zip` (project root)
- Web-configurator: Downloaded from browser as `[schema-name]-config.zip`

## Garmin Device Deployment

1. Extract ZIP file
2. Upload to Garmin device via:
   - USB transfer
   - Network/FTP
   - SD card
3. Access at device's web interface
4. Navigate to `index1.html`

## CI/CD Integration

For automated builds, run:

```bash
# Build everything
pnpm -r build

# Deploy HMI UI (includes auto-sync)
cd packages/hmi-ui && pnpm run deploy:web
```

The web-configurator deployment package will always contain the latest HMI UI build.
