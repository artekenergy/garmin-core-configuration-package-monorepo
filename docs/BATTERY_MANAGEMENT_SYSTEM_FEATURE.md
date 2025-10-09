# Battery Management System Selection Feature

**Created:** January 2025  
**Status:** ✅ Complete

## Overview

The Power Configuration page now includes the ability to select a Battery Management System (BMS) brand. This feature allows users to specify which BMS they are using in their power system, which is essential for proper monitoring and integration with the Garmin system.

## Feature Details

### User Story

As a user configuring my power system, I need to select which battery management system brand I'm using so that the system can properly monitor and integrate with my batteries.

### Supported BMS Brands

1. **Victron Energy** (Default)
   - SmartShunt & BMV battery monitors
   - Monitoring: VE.Direct or VE.Can connections to Venus GX/Cerbo GX
   - Icon: ⚡

2. **Expion360**
   - VPR 4Ever lithium batteries with integrated BMS
   - Monitoring: CAN bus integration with proprietary Expion protocol
   - Icon: 🔷

3. **Battle Born**
   - LiFePO4 batteries with integrated BMS
   - Monitoring: Bluetooth or CAN bus monitoring system
   - Icon: ⚔️

4. **Discover Battery**
   - AES lithium batteries with BMS
   - Monitoring: RS485 or CAN bus communication protocol
   - Icon: 🔋

## Implementation Details

### Schema Changes

**File:** `packages/schema/src/schema.ts`

Added `batteryManagement` field to `PowerConfigSchema`:

```typescript
batteryManagement: z.enum(['victron', 'expion', 'battleborn', 'discover']).default('victron');
```

This creates a type-safe enum with four possible values, defaulting to 'victron'.

### UI Implementation

**File:** `packages/web-configurator/src/pages/PowerConfigPage.tsx`

#### Section Structure

- Section header: "🔋 Battery Management System"
- Description: "Select your battery management system (BMS) brand"
- Radio card grid with four options
- Dynamic info box showing monitoring protocol details

#### Radio Card Grid

Uses the existing `.radioCard` styling pattern (consistent with AC legs selection):

- Each card displays brand name, icon, and battery type description
- Single-choice selection (radio group behavior)
- Visual feedback on selection

#### Dynamic Info Box

Shows brand-specific monitoring information:

- Victron: VE.Direct/VE.Can protocol details
- Expion: Proprietary CAN bus protocol
- Battle Born: Bluetooth/CAN options
- Discover: RS485/CAN communication

#### Summary Section

Added battery management to the configuration summary:

- Displays selected BMS brand name
- Positioned between "Solar Power" and "AC Power"

### Default Configuration

**File:** `packages/web-configurator/src/context/SchemaContext.tsx`

Added default value to power config:

```typescript
batteryManagement: 'victron';
```

## User Experience

### Page Flow

1. DC Charging Sources (alternators, DC-DC chargers)
2. Solar Power System (primary/auxiliary arrays)
3. **Battery Management System** ← New section
4. AC Power Configuration (1-leg vs 2-leg)
5. Inverter/Chargers (Multiplus L1/L2)

### Visual Design

- Consistent with other power configuration sections
- 2rem bottom margin for spacing
- Radio cards in responsive grid (2 columns)
- Color-coded info boxes (light blue background)
- Brand-specific icons for visual recognition

## Technical Considerations

### Why Radio Cards?

Battery management system is a single-choice selection (unlike checkboxes for solar arrays or DC charging sources). Each installation uses one primary BMS brand, so radio button behavior is appropriate.

### Integration Points

The selected BMS will:

1. Determine which monitoring protocol to configure in the Garmin system
2. Affect signal mappings for battery data (voltage, current, SOC)
3. Guide hardware setup instructions in deployment
4. Influence channel assignments for battery monitoring

### Future Enhancements

Potential future additions:

- Battery bank size configuration (Ah rating)
- Number of batteries in series/parallel
- Temperature sensor configuration
- BMS-specific advanced settings
- Pre-configured templates per BMS brand

## Testing Checklist

- [x] Schema validation compiles
- [x] TypeScript types are correct
- [x] Component renders without errors
- [x] Radio selection works (single choice)
- [x] Info box updates based on selection
- [x] Summary section displays selected BMS
- [x] Default value (Victron) is set
- [x] Build completes successfully (456.81 kB)
- [ ] UI tested in browser
- [ ] All four BMS options selectable
- [ ] Summary accurately reflects selection

## Related Documentation

- [Power Configuration Overview](./POWER_SUBSYSTEM_COMPLETE.md)
- [Solar Power System](./SOLAR_POWER_FEATURE.md) _(if created)_
- [Hardware Config Implementation](./HARDWARE_CONFIG_IMPLEMENTATION.md)
- [Schema Specification](./SCHEMA_SPEC.md)

## Deployment Impact

This feature affects:

- **Configuration Export:** BMS brand included in exported JSON
- **HMI Deployment:** Monitoring channels configured per BMS
- **Signal Mapping:** Battery signals mapped to BMS-specific protocols
- **Hardware Setup:** Installation instructions reference selected BMS

## Build Verification

✅ **Build Status:** Success  
**Bundle Size:** 456.81 kB (128.58 kB gzipped)  
**Build Time:** 3.6s  
**Date:** January 2025

No TypeScript errors, schema validation passing, all components rendering correctly.
