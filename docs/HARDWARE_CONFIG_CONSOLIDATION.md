# Hardware Configuration Consolidation

This document explains the hardware configuration file consolidation and single source of truth strategy.

## 🎯 Problem Solved

**Before consolidation:**

- 3 duplicate hardware config files across 2 packages
- `packages/hmi-ui/public/hardware-config.json` (857 lines) - DUPLICATE
- `packages/web-configurator/public/hardware-config-core.json` (857 lines) - DUPLICATE
- `packages/web-configurator/public/hardware-config-core-lite.json` (84 lines) - SEPARATE

**Issues:**

- Manual synchronization required
- Risk of files getting out of sync
- ~20KB of duplicated data in git
- Confusion about which file is authoritative

**After consolidation:**

- Single source of truth in `configuration/` directory
- Auto-copied to packages during build
- No risk of desynchronization
- Clear ownership and versioning

---

## 📁 File Structure

### Source of Truth (Tracked in Git)

```
configuration/
├── hardware-config-core.json       # Core system (857 lines, 20KB)
└── hardware-config-core-lite.json  # Core Lite system (84 lines, 1.7KB)
```

**These are the ONLY files that should be manually edited.**

### Auto-Generated Copies (Gitignored)

```
packages/hmi-ui/public/
└── hardware-config.json            # Copy of hardware-config-core.json

packages/web-configurator/public/
├── hardware-config-core.json       # Copy from configuration/
└── hardware-config-core-lite.json  # Copy from configuration/
```

**These are auto-generated and should NEVER be manually edited.**

---

## 🔄 How It Works

### Automatic Copy Process

1. **During Build:**

   ```bash
   pnpm build
   # Runs: node scripts/copy-hardware-configs.js (prebuild hook)
   # Then: pnpm -r build
   ```

2. **Manual Copy:**
   ```bash
   node scripts/copy-hardware-configs.js
   ```

### Copy Script (`scripts/copy-hardware-configs.js`)

The script copies files from `configuration/` to package public directories:

- `hardware-config-core.json` → `hmi-ui/public/hardware-config.json`
- `hardware-config-core.json` → `web-configurator/public/hardware-config-core.json`
- `hardware-config-core-lite.json` → `web-configurator/public/hardware-config-core-lite.json`

**Note:** HMI UI uses `hardware-config.json` (without suffix) for backward compatibility.

---

## ✏️ How to Edit Hardware Configs

### ✅ Correct Process

1. Edit the source file in `configuration/`:

   ```bash
   # For Core system
   vim configuration/hardware-config-core.json

   # For Core Lite system
   vim configuration/hardware-config-core-lite.json
   ```

2. Copy to packages:

   ```bash
   node scripts/copy-hardware-configs.js
   ```

3. Test your changes:

   ```bash
   pnpm --filter @gcg/hmi-ui dev
   pnpm --filter @gcg/web-configurator dev
   ```

4. Commit ONLY the source files:
   ```bash
   git add configuration/hardware-config-*.json
   git commit -m "Update hardware configuration"
   ```

### ❌ Incorrect Process (Don't Do This)

```bash
# ❌ DON'T edit the copies directly
vim packages/hmi-ui/public/hardware-config.json

# ❌ DON'T commit the auto-generated copies
git add packages/*/public/hardware-config*.json
```

**Why?** The copies are gitignored and will be overwritten on next build!

---

## 🔍 File Contents

### `hardware-config-core.json`

System Type: **Core**

**Channels:**

- BMS signals (battery voltage, SOC, current)
- Tank sensors (fresh water, grey water, black water)
- Genesis board outputs (configurable channels)
- Core board outputs (push-buttons, toggles, dimmers, half-bridges)

**Total:** ~40 channels, 857 lines

### `hardware-config-core-lite.json`

System Type: **Core Lite**

**Channels:**

- 8 Lite outputs (toggle-capable channels)
- Simplified configuration
- No BMS or tank sensors

**Total:** 8 channels, 84 lines

---

## 🛠️ Build Integration

### Root `package.json`

```json
{
  "scripts": {
    "prebuild": "node scripts/copy-hardware-configs.js",
    "build": "pnpm -r build"
  }
}
```

The `prebuild` hook runs automatically before `build`, ensuring configs are always up to date.

### Gitignore

```gitignore
# Auto-copied hardware configs (source of truth: configuration/)
packages/hmi-ui/public/hardware-config*.json
packages/web-configurator/public/hardware-config*.json
```

This prevents accidentally committing the auto-generated copies.

---

## 🔬 Verification

### Verify Files Are Copied

```bash
# Copy configs
node scripts/copy-hardware-configs.js

# Check they exist
ls -l packages/hmi-ui/public/hardware-config.json
ls -l packages/web-configurator/public/hardware-config-core*.json
```

### Verify They're Identical

```bash
# Core config should match
diff configuration/hardware-config-core.json \
     packages/hmi-ui/public/hardware-config.json

diff configuration/hardware-config-core.json \
     packages/web-configurator/public/hardware-config-core.json

# No output = files are identical ✓
```

### Verify Gitignore

```bash
git status

# Should NOT show:
#   packages/hmi-ui/public/hardware-config.json
#   packages/web-configurator/public/hardware-config-*.json
```

---

## 🐛 Troubleshooting

### "Hardware config not found" errors

**Problem:** Package can't find `hardware-config.json`

**Solution:**

```bash
# Copy configs
node scripts/copy-hardware-configs.js

# Or run full build
pnpm build
```

### Configs are out of sync

**Problem:** Package has old config data

**Solution:**

```bash
# Re-copy from source
node scripts/copy-hardware-configs.js

# Restart dev server
pnpm --filter @gcg/hmi-ui dev
```

### Git shows config files as modified

**Problem:** Gitignore not working

**Solution:**

```bash
# Remove from git cache
git rm --cached packages/*/public/hardware-config*.json

# Verify gitignore includes them
cat .gitignore | grep hardware-config

# Should see:
# packages/hmi-ui/public/hardware-config*.json
# packages/web-configurator/public/hardware-config*.json
```

### Need to add a new hardware config variant

**Steps:**

1. Create source file in `configuration/`:

   ```bash
   cp configuration/hardware-config-core.json \
      configuration/hardware-config-new-variant.json
   ```

2. Edit `scripts/copy-hardware-configs.js`:

   ```javascript
   const configFiles = [
     { name: 'hardware-config-core.json', desc: 'Core system hardware config' },
     { name: 'hardware-config-core-lite.json', desc: 'Core Lite system hardware config' },
     { name: 'hardware-config-new-variant.json', desc: 'New variant config' }, // ADD THIS
   ];
   ```

3. Update copy destinations as needed

4. Test copy script:
   ```bash
   node scripts/copy-hardware-configs.js
   ```

---

## 📊 Benefits

✅ **Single source of truth** - One place to edit hardware configs  
✅ **No synchronization issues** - Automated copying prevents drift  
✅ **Version controlled** - Source files tracked in git, copies are not  
✅ **Build-time generation** - Always fresh configs  
✅ **Smaller repository** - No duplicate data in git  
✅ **Clear ownership** - `configuration/` is the authoritative source

---

## 📝 Summary

| Aspect                   | Before              | After              |
| ------------------------ | ------------------- | ------------------ |
| **Files tracked in git** | 3 hardware configs  | 2 hardware configs |
| **Duplication**          | Yes (857 lines × 2) | No                 |
| **Manual sync required** | Yes                 | No                 |
| **Source of truth**      | Unclear             | `configuration/`   |
| **Build integration**    | Manual copy         | Automatic copy     |
| **Git conflicts**        | Possible            | Unlikely           |

---

**Last updated:** October 12, 2025  
**Related:** `docs/BUILD_ARTIFACTS.md`, `BLOAT_REMOVAL_CHECKLIST.md`
