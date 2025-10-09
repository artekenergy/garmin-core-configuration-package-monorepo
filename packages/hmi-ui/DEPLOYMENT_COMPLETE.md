# HMI UI Deployment - Complete ✅

## Deployment Script Created

A complete deployment script has been created at `scripts/deploy-to-web.sh` that:

1. ✅ Builds the HMI UI (production build, ES2017 target)
2. ✅ Disables source maps (no `.map` files generated)
3. ✅ Deploys to `/web/index1.html` with `/hmi-assets/`
4. ✅ Adds cache-busting parameters to all asset URLs
5. ✅ Creates timestamped zip file with `web/`, `services/`, and `configuration/` directories

## Usage

```bash
cd packages/hmi-ui
pnpm deploy:web
```

This will output:

- Updated files in `/web/` directory
- Deployment package: `garmin-hmi-deployment-YYYYMMDD_HHMMSS.zip`

## Latest Deployment

**Package:** `garmin-hmi-deployment-20251003_133116.zip`
**Location:** `/Users/jordanburgess/Downloads/new-config-main/`
**Size:** 748KB
**Includes:**

- `web/` - HMI UI with updated index1.html
- `services/` - Backend services
- `configuration/` - Configuration files

## Deploying to Garmin Device

1. Upload the zip file to your Garmin display
2. Extract/install on the device
3. **Restart the web server** to clear cache:
   ```bash
   # SSH into device
   systemctl restart garmin_empirbus_html1.service
   ```
4. Access the HMI UI at: `http://172.16.11.7:8888/index1.html`

## Cache-Busting

Every deployment adds a timestamp parameter to asset URLs:

```html
/hmi-assets/index-BF_2jC_A.js?v=1759523476
```

This ensures the device always loads the latest version. However, you may need to restart the web server on the device to clear any server-side caching.

## Source Map Errors

If you see 404 errors for `.map` files after deployment:

1. **Verify** the deployed files don't have sourcemap references:

   ```bash
   cd /Users/jordanburgess/Downloads/new-config-main/web/hmi-assets
   grep -l "sourceMappingURL" *.js  # Should return nothing
   ```

2. **Clear device cache** by restarting the web server:

   ```bash
   systemctl restart garmin_empirbus_html1.service
   ```

3. **Hard refresh** in browser (if testing locally):
   - Chrome/Edge: `Cmd+Shift+R`
   - Safari: `Cmd+Option+R`

## Production Build Configuration

`vite.config.ts` is configured for:

- **Target:** ES2017 (Android 10 WebView / Chrome 83)
- **Minification:** Terser with console.log removal
- **Source Maps:** Disabled (`sourcemap: false`)
- **Bundle Size:** ~105KB uncompressed, ~25KB gzipped
- **Code Splitting:** Vendor (Preact) and Signals chunks

## WebSocket Integration

The deployed UI includes:

- ✅ WebSocket adapter with auto-reconnect
- ✅ WDU heartbeat ACK (keeps connection alive)
- ✅ Toggle component (sends ON/OFF commands)
- ✅ Button component (sends press/release commands)
- ✅ Connection status indicator
- ✅ Binding resolver (string channel → numeric ID)

## Next Steps

1. Upload `garmin-hmi-deployment-20251003_133116.zip` to device
2. Restart the web server on the device
3. Test WebSocket connection and component bindings
4. Implement incoming message handling (Step 7)
5. Build remaining components (Dimmer, Gauge, Slider)

## Troubleshooting

### Issue: Source map 404 errors persist

**Solution:** The device is serving cached files. Restart the web server:

```bash
ssh root@172.16.11.7
systemctl restart garmin_empirbus_html1.service
```

### Issue: Changes not appearing on device

**Solution:**

1. Verify you uploaded the latest zip file (check timestamp)
2. Restart the web server
3. Clear browser cache if testing locally

### Issue: WebSocket not connecting

**Solution:**

1. Check device IP address (currently: 172.16.11.7)
2. Verify WebSocket port (default: 80)
3. Check browser console for connection errors

## Files Modified

- `packages/hmi-ui/scripts/deploy-to-web.sh` - Deployment script with cache-busting
- `packages/hmi-ui/vite.config.ts` - Disabled source maps
- `packages/hmi-ui/package.json` - Added `deploy:web` script
- `web/index1.html` - Updated with cache-busting parameters
- `web/hmi-assets/` - Production build assets (no .map files)

## Deployment History

| Timestamp           | Package                                   | Notes                                         |
| ------------------- | ----------------------------------------- | --------------------------------------------- |
| 2025-10-03 13:31:16 | garmin-hmi-deployment-20251003_133116.zip | Source maps disabled, cache-busting added     |
| 2025-10-03 13:26:29 | garmin-hmi-deployment-20251003_132629.zip | First version with source maps disabled       |
| 2025-10-03 13:24:25 | garmin-hmi-deployment-20251003_132425.zip | Added services/ and configuration/ to package |
| 2025-10-03 13:21:18 | garmin-hmi-deployment-20251003_132118.zip | Initial deployment package                    |
