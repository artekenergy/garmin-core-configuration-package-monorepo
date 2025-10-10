# Schema Generation vs User Configuration Analysis

## 🎯 **GENERATION STRATEGY**

### **LEVEL 1: Always Generated (System)**
**Description**: Core structure that should be automatically generated based on system architecture
**User Control**: None - System handles automatically

| Field | Generation Logic | Reason |
|-------|------------------|---------|
| `schemaVersion` | ✅ **Always "0.1.0"** | API compatibility |
| `metadata.createdAt` | ✅ **Auto-timestamp** | System tracking |
| `metadata.updatedAt` | ✅ **Auto-timestamp** | System tracking |

### **LEVEL 2: Template-Generated (Smart Defaults)**
**Description**: Generated with intelligent defaults, but user can override
**User Control**: Medium - User can modify generated values

| Field | Generation Logic | User Override |
|-------|------------------|---------------|
| `metadata.name` | ✅ **"Custom Configuration"** | ✅ User can rename |
| `metadata.version` | ✅ **"1.0.0"** | ✅ User can update |
| `metadata.description` | ✅ **Auto from selections** | ✅ User can edit |
| `metadata.author` | ✅ **From user profile** | ✅ User can edit |
| `theme.preset` | ✅ **"blue" default** | ✅ User selects |
| `theme.customColors` | ❌ **User-only** | ✅ Full user control |

### **LEVEL 3: Hardware-Generated (Data-Driven)**
**Description**: Generated based on hardware configuration and user selections
**User Control**: High - User selections drive generation

| Field | Generation Logic | User Control |
|-------|------------------|--------------|
| `hardware.systemType` | ✅ **From hardware config** | ✅ User selects system |
| `hardware.outputs` | ✅ **From channel mapping** | ✅ User configures channels |
| `hardware.halfBridgePairs` | ✅ **Auto-detect pairs** | ✅ User enables/disables |
| `hardware.signalMap` | ✅ **Auto from EmpirBus** | ❌ System-generated |
| `hardware.genesisBoards` | ✅ **From user selection** | ✅ User specifies count |

### **LEVEL 4: Subsystem-Generated (Feature-Based)**
**Description**: Generated when user enables specific subsystems
**User Control**: Full - User enables/disables entire subsystems

| Subsystem | Generation Trigger | Generated Content |
|-----------|-------------------|-------------------|
| **Power** | User enables power management | Default DC/Solar/Battery configs |
| **HVAC** | User enables heating/cooling | Heating sources, cooling brand, fans |
| **Plumbing** | User enables tank monitoring | Tank types, monitoring source |
| **Accessories** | User enables keypad/awning/slides | Control types, counts, settings |
| **Lighting** | User enables RGB/ITC | Module counts, zones per module |

### **LEVEL 5: Tab-Generated (UI Structure)**
**Description**: Generated based on enabled subsystems and preset selections
**User Control**: Medium - User selects presets, system generates structure

| Tab Type | Generation Logic | User Control |
|----------|------------------|--------------|
| **Home Tab** | ✅ **Always generated** | ✅ Section types, content |
| **Lighting Tab** | ✅ **If lighting enabled** | ✅ Subtab configuration |
| **Power Tab** | ✅ **If power features enabled** | ✅ Section organization |
| **HVAC Tab** | ✅ **If HVAC enabled** | ✅ Subtab enabling |
| **Switching Tab** | ✅ **If outputs configured** | ✅ Subtab organization |
| **Plumbing Tab** | ✅ **If plumbing enabled** | ✅ Section content |

### **LEVEL 6: Component-Generated (Data-Bound)**
**Description**: Generated based on hardware outputs and user UI preferences
**User Control**: Full - User creates, configures, and arranges components

| Component Aspect | Generation Logic | User Control |
|------------------|------------------|--------------|
| **Component Types** | ❌ **User selects** | ✅ Full choice |
| **Channel Bindings** | ✅ **Auto from hardware** | ✅ User can override |
| **Component Layout** | ❌ **User arranges** | ✅ Full control |
| **Labels/Icons** | ✅ **Smart defaults** | ✅ User customizes |
| **Variants/Styling** | ✅ **Default variants** | ✅ User selects |

---

## 🔄 **GENERATION WORKFLOW**

### **Phase 1: System Foundation** (Auto-Generated)
```typescript
{
  schemaVersion: "0.1.0",
  metadata: {
    name: "Custom Configuration",
    version: "1.0.0", 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
```

### **Phase 2: Hardware Detection** (User Selection → Generation)
```typescript
// User selects: "CORE system with 2 Genesis boards"
{
  hardware: {
    systemType: "core",
    genesisBoards: 2,
    outputs: [
      // Auto-generate 40 outputs (16 CORE + 24 Genesis)
      { id: "core-01", source: "core", channel: 1, control: "not-used" },
      { id: "core-02", source: "core", channel: 2, control: "not-used" },
      // ... up to core-16
      { id: "genesis-01", source: "genesis", channel: 1, control: "not-used" },
      // ... up to genesis-24
    ]
  }
}
```

### **Phase 3: Subsystem Activation** (User Features → Generation)
```typescript
// User enables: "HVAC with diesel heating and fans"
{
  hvac: {
    heating: {
      enabled: true,
      sources: { diesel: true, electric: false, engine: false },
      distribution: { floor: false, fans: true }
    }
  },
  hvacTab: {
    heating: { enabled: true, title: "Heating", icon: "🔥" },
    cooling: { enabled: false },
    ventilation: { enabled: false }
  }
}
```

### **Phase 4: Tab Structure** (Auto-Generated from Features)
```typescript
{
  tabs: [
    { id: "tab-home", preset: "home", title: "Home", sections: [...] },
    { id: "tab-lighting", preset: "lighting", title: "Lighting", sections: [...] },
    { id: "tab-hvac", preset: "hvac", title: "HVAC", sections: [...] },
    // Only include tabs for enabled subsystems
  ]
}
```

### **Phase 5: Component Population** (Smart Defaults + User Control)
```typescript
// User configures output core-01 as "Cabin Fan" toggle
{
  // Auto-generate component with smart defaults
  component: {
    id: "comp-cabin-fan",
    type: "toggle",           // User selects
    label: "Cabin Fan",       // User provides
    icon: "/icons/Fan.svg",   // Smart default from output type
    bindings: {
      state: {
        type: "empirbus",
        channel: "core-01"     // Auto from hardware config
      }
    }
  }
}
```

---

## 🎛️ **USER CONTROL MATRIX**

| Level | User Input Required | Generated Output | User Can Override |
|-------|-------------------|------------------|-------------------|
| **System** | None | Schema version, timestamps | ❌ No |
| **Template** | Basic info | Metadata defaults, theme | ✅ Yes |
| **Hardware** | System selection | Hardware config, channels | ✅ Partial |
| **Subsystem** | Feature toggles | Subsystem configs, tabs | ✅ Yes |
| **UI Structure** | Preset choices | Tab layout, sections | ✅ Yes |
| **Components** | Full control | Smart binding defaults | ✅ Full |

This analysis shows we need a **multi-phase generation system** where each level builds upon the previous one, with increasing user control at each level.