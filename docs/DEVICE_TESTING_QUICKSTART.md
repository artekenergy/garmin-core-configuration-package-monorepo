# Testing HMI UI on Garmin Display - Quick Start

**Quick reference for deploying and testing the HMI UI on the actual Garmin hardware.**

---

## 🚀 Deploy to Display (3 Steps)

### 1. Deploy HMI UI

```bash
cd packages/hmi-ui
pnpm deploy
```

**Output**: Files copied to `/web/` directory

- `/web/index1.html` ← Your HMI UI
- `/web/hmi-assets/` ← JS/CSS bundles
- `/web/schema.json` ← Test schema (or use configurator export)

---

### 2. (Optional) Update Schema

If you want to test with a real configuration instead of the test schema:

1. Open web configurator: `http://localhost:3000`
2. Configure your system
3. Go to Export page
4. Download `config.zip`
5. Extract `schema.json`
6. Copy to `/web/schema.json`
7. Re-run: `pnpm deploy`

---

### 3. Create and Upload EmpirBus Package

**Create .ebp file** (using EmpirBus tools):

- Package the entire `/web/` directory
- Output: `configuration.ebp`

**Upload to Garmin**:

- Connect to display (USB/network)
- Upload `.ebp` file
- Display installs package
- Navigate to HMI menu

---

## 🧪 What to Test

### ✅ Should Work Now

- UI loads on display
- Components render from schema
- Toggle switches animate on/off
- Buttons show pressed state
- Indicators display states

### ⏸️ Not Yet Implemented

- WebSocket connection to EmpirBus
- Physical output control
- State synchronization
- Real-time updates

**Note**: Components currently use local state only. WebSocket integration coming in Step 6.

---

## 📊 Current Build Size

```
Total: ~99KB (uncompressed)
       ~23KB (gzipped)

Breakdown:
- Main bundle:    73.33 kB
- Preact vendor:  10.35 kB
- Signals:         9.41 kB
- CSS:             6.00 kB
```

Very lightweight for embedded deployment! ✅

---

## 🔗 Full Documentation

See [HMI_DEPLOYMENT_GUIDE.md](./HMI_DEPLOYMENT_GUIDE.md) for complete details.
