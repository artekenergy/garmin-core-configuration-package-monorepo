# Hardware Config Auto-Loading

**Date:** October 7, 2025  
**Status:** ✅ Implemented

---

## 📋 Overview

The system now automatically loads the appropriate hardware configuration (CORE or CORE-LITE) based on the selected system type. This provides:

- Instant channel validation
- Pre-configured hardware layouts
- Easy customization for special cases

---

## 🎯 How It Works

### 1. Built-in Hardware Configs

Two hardware configuration files are included in the project:

**CORE System** (`/public/hardware-config-core.json`)

- 20 output channels (core-01 through core-20)
- 3 dimmer channels (core-01, core-02, core-05)
- 17 toggle-button channels
- Full signal mappings for supported channels

**CORE-LITE System** (`/public/hardware-config-core-lite.json`)

- 6 output channels (lite-01 through lite-06)
- All toggle-button channels
- Optimized for smaller systems

### 2. Automatic Loading

Hardware configs are automatically loaded:

- **On page load:** Loads config matching current system type
- **On system type change:** Loads new config when switching between CORE and CORE-LITE
- **Silent operation:** Runs in background, no user action needed

### 3. Channel Validation

Once loaded, the hardware config enables:

- Real-time validation of component bindings
- Detection of invalid channel references
- Control type compatibility checking
- Error display in header and modal

---

## 🔧 Usage

### For Standard Systems

**Most users won't need to do anything!**

1. Select your system type (CORE or CORE-LITE)
2. Hardware config auto-loads in background
3. Create components in Editor
4. Channel validation runs automatically

### For Custom Systems

If you have a custom hardware configuration:

1. Click "📥 Load Custom .epb" button
2. Select your `.json` or `.epb` file
3. Custom config replaces built-in config
4. Validation uses your custom channels

---

## 📂 File Structure

```
configuration/
├── hardware-config-core.json          # Source: CORE system
├── hardware-config-core-lite.json     # Source: CORE-LITE system
└── hardware-config.json               # Legacy/reference

packages/web-configurator/public/
├── hardware-config-core.json          # Runtime: CORE system
└── hardware-config-core-lite.json     # Runtime: CORE-LITE system
```

---

## 🔍 Technical Details

### Auto-Load Trigger

```typescript
useEffect(() => {
  const autoLoadHardwareConfig = async () => {
    const systemType = schema.hardware.systemType;
    const configPath =
      systemType === 'core' ? '/hardware-config-core.json' : '/hardware-config-core-lite.json';

    const response = await fetch(configPath);
    if (response.ok) {
      const hardwareConfig = await response.json();
      loadHardwareConfig(hardwareConfig);
    }
  };

  autoLoadHardwareConfig();
}, [schema?.hardware?.systemType]);
```

### Config Storage

Hardware configs are stored in two places:

1. **SchemaContext** - For validation (via `loadHardwareConfig()`)
2. **Schema** - For export/deployment (via `schema.hardware`)

### Validation Flow

```
System Type Selected
       ↓
Auto-load hardware-config-{type}.json
       ↓
Parse and store in SchemaContext.hardwareChannels
       ↓
Validate all component bindings
       ↓
Display errors if any invalid channels
```

---

## 🎨 User Experience

### Before (Manual Configuration)

1. User creates components
2. Manually types channel names
3. No validation - errors discovered later
4. Typos cause runtime failures

### After (Auto-Loading)

1. User selects system type
2. ✅ Hardware config auto-loads
3. User creates components
4. ✅ Invalid channels caught immediately
5. ✅ Clear error messages with fix suggestions

---

## 🚀 Benefits

### For Users

- ✅ No manual hardware config upload needed
- ✅ Instant channel validation
- ✅ Fewer errors during development
- ✅ Clear feedback on invalid bindings

### For Development

- ✅ Consistent hardware configs across projects
- ✅ Version-controlled hardware definitions
- ✅ Easy to update hardware specs
- ✅ Testing with known configurations

### For Support

- ✅ Users can't use wrong hardware config
- ✅ Standardized configurations
- ✅ Easier troubleshooting
- ✅ Custom configs only when needed

---

## 🔄 Custom Hardware Config Workflow

### When You Need Custom Config

Use custom hardware config upload when:

- Using modified Genesis boards
- Custom signal mappings
- Specialized hardware setup
- Testing/development scenarios

### How to Create Custom Config

1. Start with built-in config as template
2. Modify outputs array:
   ```json
   {
     "systemType": "core",
     "outputs": [
       {
         "id": "core-01",
         "source": "core",
         "channel": 1,
         "control": "dimmer",
         "label": "Custom Label",
         "icon": "/icons/Custom.svg",
         "signals": {
           "toggle": 15,
           "momentary": 14,
           "dimmer": 16
         }
       }
     ]
   }
   ```
3. Save as `.json` file
4. Upload via "📥 Load Custom .epb" button

---

## 🐛 Troubleshooting

### Config Not Loading

**Symptom:** No channel validation errors despite invalid bindings

**Solution:**

1. Check browser console for errors
2. Verify system type is selected
3. Check network tab for 404 errors on config file
4. Ensure config files are in `/public/` folder

### Wrong Config Loaded

**Symptom:** Validation shows wrong channels

**Solution:**

1. Check selected system type (CORE vs CORE-LITE)
2. Reload page to re-trigger auto-load
3. Verify config files haven't been modified

### Custom Config Not Working

**Symptom:** Custom config upload fails

**Solution:**

1. Validate JSON format
2. Ensure `outputs` array exists
3. Check file type (.json or .epb)
4. Review error message in red banner

---

## 📊 Success Metrics

### Definition of Success:

- [x] Auto-loads correct config on page load
- [x] Auto-loads correct config on system type change
- [x] Silent operation (no popups/prompts)
- [x] Validation works immediately after load
- [x] Custom configs can override built-in configs
- [x] Error messages guide users to fixes

---

## 🎉 Summary

**Hardware config auto-loading is now complete!**

Users get:

- ✅ Automatic hardware configuration
- ✅ Instant channel validation
- ✅ Better error prevention
- ✅ Option for custom configs

No more manual hardware config uploads for standard systems! 🎊
