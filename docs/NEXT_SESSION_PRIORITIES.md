# Next Session Priorities

> **Quick reference for continuing development**  
> **Last Updated**: October 2, 2025

---

## 🎯 Immediate Goals

### 1. Lighting Subsystem Implementation (HIGH PRIORITY)

**Objective**: Complete the 6th and final subsystem page

**Requirements**:
- RGB module configuration (quantity: 0-4)
- ITC module configuration (quantity: 0-4)
- Zone configuration per module
- Enable/disable toggle cards
- Quantity selection with radio cards

**Estimated Effort**: 2-3 hours  
**Lines of Code**: ~400 lines

**Files to Create**:
```
packages/web-configurator/src/pages/LightingConfigPage.tsx
packages/web-configurator/src/pages/LightingConfigPage.module.css
```

**Pattern to Follow**: See `HVACConfigPage.tsx` (488 lines)
- Use toggle cards for enable/disable
- Use radio cards for quantity selection
- Follow established UI/UX standards
- Maintain consistent spacing and layout

---

## 🔧 Secondary Tasks

### 2. Icon Integration in Preview Page (MEDIUM PRIORITY)

**Objective**: Display selected icons next to channel names in preview

**Current State**: Preview shows channel names and control types, but not icons

**Changes Needed**:
- Update `PreviewPage.tsx` to read `icon` field from channels
- Display icon images next to channel labels
- Handle both library icons (paths) and custom icons (data URLs)

**Estimated Effort**: 30-60 minutes  
**Lines of Code**: ~30 lines

**Files to Modify**:
```
packages/web-configurator/src/pages/PreviewPage.tsx
packages/web-configurator/src/pages/PreviewPage.module.css
```

---

### 3. Export Page Implementation (MEDIUM PRIORITY)

**Objective**: Create export page that bundles schema + icons into downloadable ZIP

**Requirements**:
- Bundle schema JSON file
- Include used library icons (copy SVG files)
- Embed custom icons (already base64 in schema)
- Tree-shake unused icons
- Generate proper manifest
- Download as `config.zip`

**Estimated Effort**: 2-3 hours  
**Lines of Code**: ~200 lines

**Files to Create**:
```
packages/web-configurator/src/pages/ExportPage.tsx
packages/web-configurator/src/pages/ExportPage.module.css
packages/web-configurator/src/utils/export.ts
```

**Dependencies**:
- JSZip library (already available via npm)
- Icon path parsing logic
- Schema validation before export

---

### 4. Power Page Consistency (LOW PRIORITY)

**Objective**: Convert DC charging checkboxes to toggle cards

**Rationale**: Maintain consistency with HVAC/Lighting patterns

**Current State**: DC charging uses checkboxes instead of toggle cards

**Changes Needed**:
- Replace checkbox inputs with `ToggleCard` components
- Update state management
- Adjust layout/spacing

**Estimated Effort**: 30 minutes  
**Lines of Code**: ~50 lines

**Files to Modify**:
```
packages/web-configurator/src/pages/PowerConfigPage.tsx
packages/web-configurator/src/pages/PowerConfigPage.module.css
```

---

## 🐛 Known Issues

### ✅ All issues resolved!

- ✅ Icon loading fixed (copied to public folder)
- ✅ Modal styling improved (complete overhaul)
- ✅ Accessories slider fixed (class name conflict resolved)
- ✅ Search feature removed (per user request)

No outstanding bugs as of this session.

---

## 📚 Technical Debt

### 1. Icon Folder Sync Automation

**Issue**: Icons must be manually copied from `web/icons/` to `packages/web-configurator/public/icons/`

**Solution**: Create build script to auto-sync on changes

**Implementation**:
```json
// package.json
{
  "scripts": {
    "sync-icons": "node scripts/sync-icons.js"
  }
}
```

```javascript
// scripts/sync-icons.js
const fs = require('fs-extra');
const path = require('path');

const source = path.join(__dirname, '../web/icons');
const dest = path.join(__dirname, '../packages/web-configurator/public/icons');

fs.copySync(source, dest, { overwrite: true });
console.log('✅ Icons synced to public folder');
```

**Estimated Effort**: 15 minutes

---

### 2. CSS Variable Migration

**Issue**: Icon picker uses hardcoded colors for consistency

**Current Approach**:
```css
.modal {
  background: white; /* Hardcoded */
  color: #374151; /* Hardcoded */
}
```

**Future Approach**:
```css
.modal {
  background: var(--color-surface);
  color: var(--color-text);
}
```

**Benefits**:
- Theme consistency across all components
- Easier dark mode support (future)
- Centralized color management

**Estimated Effort**: 1 hour (define variables, update all components)

---

### 3. Icon Categories

**Issue**: Single flat grid works for 28 icons, but may not scale

**Future Enhancement**: Tabbed interface for icon categories
```
[ Lighting | Navigation | Systems | Custom ]
```

**Benefits**:
- Better organization for 100+ icons
- Faster finding specific icon types
- User can see what categories exist

**Estimated Effort**: 2 hours  
**Priority**: Low (only needed if library grows beyond ~50 icons)

---

### 4. Icon Search (Maybe Later)

**Current State**: Removed per user request

**Future Consideration**: May want search when library grows to 100+ icons

**Implementation Notes**:
- Simple fuzzy search on icon labels
- Filter grid in real-time
- Show "No results" state

**Priority**: Revisit when icon library > 50 items

---

## 🧪 Testing Checklist

### Before Next Session

- [ ] **Test icon persistence**: Create channel, add icon, refresh page → icon should remain
- [ ] **Test custom upload**: Upload SVG → should appear in preview button
- [ ] **Test icon clear**: Click ✕ button → icon should be removed
- [ ] **Test different browsers**: Chrome ✅, Firefox ?, Safari ?
- [ ] **Test mobile responsive**: Touch targets adequate on 1024x600?
- [ ] **Test accessories slider**: All ranges work (buttons per keypad, etc.)

### Lighting Subsystem (Post-Implementation)

- [ ] **Toggle cards**: Enable/disable RGB and ITC modules
- [ ] **Radio cards**: Select quantity (0-4)
- [ ] **Zone configuration**: Shows/hides based on quantity
- [ ] **Schema validation**: Invalid configs show errors
- [ ] **Preview integration**: Lighting subsystem appears in preview

---

## 📁 File Inventory

### Created This Session

| File | Lines | Purpose |
|------|-------|---------|
| `IconPickerModal.tsx` | 130 | Icon selection modal component |
| `IconPickerModal.module.css` | 195 | Modal styling |
| `ICON_PICKER_FEATURE.md` | 400+ | Icon picker documentation |
| `ICON_PICKER_VISUAL_GUIDE.md` | 150+ | Visual mockup |
| `ICON_PICKER_SUMMARY.md` | 200+ | Implementation summary |
| `TOGGLE_CARD_PATTERN.md` | 250+ | UI pattern documentation |
| `UI_UX_STANDARDS.md` | 350+ | Component standards |
| `SESSION_SUMMARY_OCT_2_2025.md` | 400+ | Session summary |

### Modified This Session

| File | Changes | Lines Modified |
|------|---------|----------------|
| `HardwareConfigPage.tsx` | Icon picker integration | ~80 added |
| `HardwareConfigPage.module.css` | Icon preview/button styles | ~80 added |
| `AccessoriesConfigPage.tsx` | Slider class name fix | 1 changed |
| `AccessoriesConfigPage.module.css` | Range slider selectors | ~10 modified |
| `README.md` | Updated status, features, docs | ~50 modified |

### Total Code Added

- **Component Code**: ~210 lines (IconPickerModal)
- **CSS Styling**: ~275 lines (Modal + Hardware page)
- **Documentation**: ~2,200+ lines (7 docs)
- **Bug Fixes**: ~10 lines modified
- **Total**: ~2,700 lines this session

---

## 🚀 Development Server

### Start Dev Server

```powershell
# From project root
pnpm --filter web-configurator dev
```

**Runs at**: http://localhost:3000

### Quick Navigation

- Hardware Config: http://localhost:3000/hardware
- Power Config: http://localhost:3000/power
- HVAC Config: http://localhost:3000/hvac
- Plumbing Config: http://localhost:3000/plumbing
- Accessories Config: http://localhost:3000/accessories
- Preview: http://localhost:3000/preview

---

## 💡 Development Tips

### Icon Picker Integration Pattern

When adding icon picker to new components:

```tsx
// 1. Import
import IconPickerModal from '../components/IconPickerModal/IconPickerModal';

// 2. Add state
const [iconPickerOpen, setIconPickerOpen] = useState(false);
const [iconPickerId, setIconPickerId] = useState<string | null>(null);

// 3. Add handlers
const handleOpenIconPicker = (id: string) => {
  setIconPickerId(id);
  setIconPickerOpen(true);
};

const handleIconSelect = (iconPath: string) => {
  if (iconPickerId) {
    // Update your data structure
    updateItem(iconPickerId, { icon: iconPath });
  }
  setIconPickerOpen(false);
};

// 4. Add UI (for push/toggle buttons only)
{item.type === 'button' && (
  <div className={styles.iconPickerSection}>
    <button onClick={() => handleOpenIconPicker(item.id)}>
      {item.icon ? <img src={item.icon} /> : '+ Select Icon'}
    </button>
  </div>
)}

// 5. Add modal at bottom
<IconPickerModal
  isOpen={iconPickerOpen}
  onClose={() => setIconPickerOpen(false)}
  onSelect={handleIconSelect}
  selectedIcon={getCurrentIcon()}
/>
```

### Toggle Card Pattern

```tsx
<ToggleCard
  label="Feature Name"
  description="Short description"
  checked={config.enabled}
  onChange={(checked) => handleChange({ enabled: checked })}
/>
```

### Radio Card Pattern

```tsx
<RadioCardGroup
  name="quantity"
  options={[
    { value: '0', label: 'None', description: 'Disabled' },
    { value: '1', label: '1 Module' },
    { value: '2', label: '2 Modules' },
  ]}
  value={config.quantity}
  onChange={(value) => handleChange({ quantity: value })}
/>
```

---

## 🎯 Success Criteria

### Lighting Subsystem Complete When:

- [ ] Component renders without errors
- [ ] Toggle cards work for enable/disable
- [ ] Radio cards select quantity (0-4)
- [ ] Zone configuration shows/hides correctly
- [ ] Schema updates on all changes
- [ ] Preview page shows lighting config
- [ ] CSS matches HVAC pattern
- [ ] No console errors/warnings
- [ ] Responsive on mobile (1024x600+)
- [ ] Accessible (keyboard nav works)

---

## 📞 Questions for User

### Before Starting Lighting Subsystem

1. **RGB Module Zones**: How many zones per RGB module?
2. **ITC Module Zones**: How many zones per ITC module?
3. **Zone Configuration**: What fields per zone? (name, channel, color?)
4. **Module Names**: Custom names for modules? Or auto-numbered?

### Export Functionality

5. **Export Format**: Flat ZIP or folder structure?
6. **Icon Handling**: Copy all library icons or just used ones?
7. **Filename**: `config.zip` or include timestamp/name?

---

## 🔗 Reference Links

### This Session's Docs
- [SESSION_SUMMARY_OCT_2_2025.md](./SESSION_SUMMARY_OCT_2_2025.md) - Complete session summary
- [ICON_PICKER_FEATURE.md](./ICON_PICKER_FEATURE.md) - Icon picker implementation
- [UI_UX_STANDARDS.md](./UI_UX_STANDARDS.md) - Component patterns

### Implementation References
- **HVAC Pattern**: `packages/web-configurator/src/pages/HVACConfigPage.tsx` (488 lines)
- **Icon Picker**: `packages/web-configurator/src/components/IconPickerModal/` (325 lines total)
- **Schema Types**: `packages/schema/src/schema.ts`

### External Resources
- [React Docs](https://react.dev) - Framework reference
- [Zod Docs](https://zod.dev) - Schema validation
- [CSS Modules](https://github.com/css-modules/css-modules) - Styling approach

---

**Ready to continue! 🚀**

*Focus: Lighting Subsystem → Icon Preview Integration → Export Page*
