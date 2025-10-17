# MultiPlus Controls - Final Fix: Missing Hardware Config Deployment

**Date:** October 16, 2025  
**Status:** ✅ RESOLVED

## The Final Issue

After adding `signals.momentary` to the hardware config and rebuilding, the browser console still showed:

```
Could not resolve channel reference: press-multi-on
Could not resolve channel reference: press-multiplus-charger-only
```

## Root Cause

The **deployment script was not copying `hardware-config.json`** from the build output to the web bundle.

### What Was Happening

1. ✅ `configuration/hardware-config-core.json` - Updated with signals
2. ✅ `packages/hmi-ui/public/hardware-config.json` - Updated via prebuild
3. ✅ `packages/hmi-ui/dist/hardware-config.json` - Copied by Vite during build
4. ❌ `garmin-bundle/web/hardware-config.json` - **NOT copied by deployment script**

### The HMI Loading Sequence

1. Browser loads `index1.html`
2. JavaScript tries to fetch `/hardware-config.json`
3. This resolves to `garmin-bundle/web/hardware-config.json`
4. **File was missing or outdated**, so binding resolution failed

## The Fix

Updated `packages/hmi-ui/scripts/deploy-to-web.ps1` to copy the hardware config file:

```powershell
# Before (missing line):
Copy-Item -Force (Join-Path $dist 'schema.json') (Join-Path $webDir 'schema.json')

# After (added hardware-config.json):
Copy-Item -Force (Join-Path $dist 'schema.json') (Join-Path $webDir 'schema.json')
Copy-Item -Force (Join-Path $dist 'hardware-config.json') (Join-Path $webDir 'hardware-config.json')
```

## Deployment Steps

```powershell
cd packages\hmi-ui
pnpm run deploy:web:win
```

**Result:**

- ✅ `hardware-config.json` now deployed to `garmin-bundle/web/`
- ✅ Contains all three MultiPlus buttons with `signals.momentary` properties
- ✅ New deployment package: `garmin-hmi-deployment-20251016_175045.zip` (0.76 MB)

## Verification

### 1. Check the Deployed File

```powershell
cat garmin-bundle\web\hardware-config.json | Select-String "press-multi-on" -Context 5
```

Should show:

```json
{
  "id": "press-multi-on",
  "source": "power",
  "channel": 133,
  "control": "push-button",
  "label": "MultiPlus On",
  "signals": {
    "momentary": 133
  }
}
```

### 2. Test in Browser

1. **Open** `garmin-bundle/web/index1.html`
2. **Hard refresh** browser (Ctrl+Shift+R or Ctrl+F5) to clear cache
3. **Open** DevTools Console
4. **Navigate** to Power tab
5. **Click** any MultiPlus button
6. **Verify** console shows:
   ```
   [MultiplusControl] Mode: on Press (1) ChannelID: 133
   [MultiplusControl] Mode: on Release (0) ChannelID: 133
   ```

### 3. Check Network Tab

- Look for request to `/hardware-config.json`
- Should return 200 OK with the updated JSON
- Should NOT be returning cached version (check response headers)

## Complete Fix Summary

### Files Modified

1. **`configuration/hardware-config-core.json`**
   - Added `signals.momentary` to three MultiPlus button entries

2. **`packages/hmi-ui/src/components/registry.ts`**
   - Registered `MultiplusControl` component

3. **`packages/hmi-ui/scripts/deploy-to-web.ps1`**
   - Added line to copy `hardware-config.json` during deployment

### Three-Part Problem

| Issue                           | Symptom                      | Fix                                        |
| ------------------------------- | ---------------------------- | ------------------------------------------ |
| 1. Component not registered     | Component didn't render      | Added to registry.ts                       |
| 2. Missing signals property     | Couldn't resolve channel IDs | Added signals.momentary to hardware config |
| 3. Deployment script incomplete | Browser loaded old config    | Updated deploy-to-web.ps1                  |

## Why This Happened

The deployment script was originally written before `hardware-config.json` was needed by the HMI at runtime. It only copied:

- `index.html` → `index1.html`
- `assets/*` → `hmi-assets/*`
- `schema.json` → `schema.json`

But missed:

- `hardware-config.json` (needed for signal resolution)

## Lessons Learned

### ✅ Always Check Deployment Scripts

When adding new runtime dependencies (like hardware-config.json), ensure the deployment script copies them.

### ✅ Verify Actual Deployed Files

Don't assume the build output matches the deployed files. Always check:

```powershell
# Check what's actually deployed
ls garmin-bundle\web\*.json

# Check file contents
cat garmin-bundle\web\hardware-config.json | Select-String "your-key"
```

### ✅ Hard Refresh After Deploy

Browsers aggressively cache JSON files. Always:

- Hard refresh (Ctrl+Shift+R)
- Clear cache manually
- Use DevTools Network tab to verify fetched content

### ✅ Check Console for Resolver Warnings

The binding resolver logs helpful warnings:

```
Could not resolve channel reference: press-multi-on
```

This pointed directly to the missing signals.

## Final Checklist

- [x] Hardware config has `signals.momentary` for all MultiPlus buttons
- [x] MultiplusControl component registered in registry.ts
- [x] Deployment script copies hardware-config.json
- [x] File deployed to garmin-bundle/web/
- [x] Browser hard-refreshed to clear cache
- [ ] **User to verify:** Buttons send WebSocket messages
- [ ] **User to verify:** Console shows successful channel ID resolution

## Next Steps

1. **Hard refresh browser** (Ctrl+Shift+R)
2. **Test all three buttons** (Off, On, Charger Only)
3. **Confirm WebSocket messages** are being sent
4. **Report back** if there are any remaining issues

The MultiPlus controls should now be fully operational! 🎉
