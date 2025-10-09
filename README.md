# Garmin Core Graphics Configurator (GCG)

> **Schema-driven UI customization system for Garmin EmpirBus HMI devices**

[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()
[![Phase](https://img.shields.io/badge/phase-1%20foundation-blue)]()

---

## 🎯 Overview

The **Garmin Core Graphics Configurator** is a monorepo project that enables installers and integrators to customize the UI of Garmin EmpirBus HMI devices without being locked into Garmin's stock graphics pipeline.

### The Problem

**Today's workflow**:

```
System XML → Garmin Online Editor → Compressed Bundle → Upload to HMI
```

**Limitations**:

- Locked into Garmin's UI patterns
- No version control for UI changes
- Limited customization options
- Difficult to maintain across multiple installations

### Our Solution

**New workflow**:

```
System XML → GCG Web Configurator → Schema + Assets → HMI UI Renderer
```

**Benefits**:

- ✅ Full control over UI layout and components
- ✅ Version-controlled JSON schemas
- ✅ Live preview before deployment
- ✅ Reusable UI templates
- ✅ Compatible with Garmin's bundle format

---

## 🎨 Key Features

### Icon Picker System

**Visual icon selection for hardware buttons**

When configuring output channels as push-buttons or toggle-buttons, users can:

- **Select from Library**: Choose from 28 pre-loaded SVG icons
- **Upload Custom SVGs**: Add your own brand/custom icons
- **Visual Preview**: See icons directly on channel cards
- **Grid Interface**: Quick browsing without search clutter

**Implementation**:

- `IconPickerModal` component with responsive grid layout
- Supports both library icons (paths) and custom icons (base64 data URLs)
- SVG validation and file size checks
- Professional modal styling with hover effects

See [ICON_PICKER_FEATURE.md](./ICON_PICKER_FEATURE.md) for complete documentation.

### Toggle Card Pattern

**Consistent UI for feature enablement**

Replaces checkboxes with large, accessible toggle cards:

```
┌─────────────────────────────────┐
│  ⚙️  Shore Power              ○  │ ← Disabled (gray)
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ⚡ DC System                 ●  │ ← Enabled (blue)
└─────────────────────────────────┘
```

**Benefits**:

- Larger touch targets (mobile-friendly)
- Clear visual state (color + switch position)
- Accessible (keyboard navigation, ARIA)
- Consistent across all subsystems

See [TOGGLE_CARD_PATTERN.md](./TOGGLE_CARD_PATTERN.md) for implementation guide.

---

## 🏗️ Architecture

This project consists of three packages in a monorepo:

### 1. `@gcg/schema` (TypeScript Library)

**Purpose**: Single source of truth for UI schema validation

- JSON schema definition
- Zod runtime validation
- TypeScript type generation
- Comprehensive test fixtures

**Used by**: Both Web Configurator and HMI UI

### 2. `@gcg/web-configurator` (React App)

**Purpose**: Browser-based schema authoring tool

- Visual schema editor
- Drag-and-drop UI builder
- Live validation and error display
- Preview UI in browser
- Export to ZIP (schema + icons)

**Tech Stack**: React 18, Vite, TypeScript, Zod

### 3. `@gcg/hmi-ui` (Preact App)

**Purpose**: Embedded UI renderer for HMI device

- Runtime schema consumption
- Dynamic component rendering
- EmpirBus/NMEA2000 data binding
- WebView 83 compatible (ES2017)

**Tech Stack**: Preact 10, Signals, Vite, TypeScript

---

## 📦 Project Structure

```
garmin-core-graphics-configurator/
├── 📄 README.md                    # ← You are here
├── 📄 PROJECT_ROADMAP.md           # Development phases
├── 📄 DECISIONS.md                 # Architectural decisions
├── 📄 SCHEMA_SPEC.md               # Schema format specification
├── 📄 QUICKSTART.md                # Developer quick start
│
├── 📁 packages/
│   ├── 📦 schema/                  # @gcg/schema package
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── schema.ts           # Zod definitions
│   │   │   ├── types.ts            # TypeScript types
│   │   │   └── validators.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── 📦 web-configurator/        # React app
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── pages/
│   │   │   └── components/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── 📦 hmi-ui/                  # Preact app
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── components/
│       │   └── adapters/
│       ├── package.json
│       └── vite.config.ts
│
├── 📁 web/                         # Garmin bundle (existing)
│   ├── index1.html                 # ← HMI UI renders here
│   ├── manifest1.json
│   └── garmin/
│
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **TypeScript** knowledge
- **React/Preact** experience

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd garmin-core-graphics-configurator

# Install dependencies (monorepo)
pnpm install

# Build all packages
pnpm -r build

# Run tests
pnpm -r test
```

### Development

#### Web Configurator (React)

```bash
pnpm --filter web-configurator dev
# Opens at http://localhost:3000
```

#### HMI UI (Preact)

```bash
pnpm --filter @gcg/hmi-ui dev
# Opens at http://localhost:5174
```

#### Schema Package

```bash
cd packages/schema
pnpm test --watch
```

---

## 📖 Documentation

| Document                                                         | Description                           |
| ---------------------------------------------------------------- | ------------------------------------- |
| [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md)                       | Development phases and milestones     |
| [DECISIONS.md](./DECISIONS.md)                                   | Architectural decision records (ADRs) |
| [SCHEMA_SPEC.md](./SCHEMA_SPEC.md)                               | Complete schema format specification  |
| [QUICKSTART.md](./QUICKSTART.md)                                 | Developer getting started guide       |
| [UI_UX_STANDARDS.md](./UI_UX_STANDARDS.md)                       | UI patterns and component standards   |
| [SESSION_SUMMARY_OCT_2_2025.md](./SESSION_SUMMARY_OCT_2_2025.md) | Latest development session summary    |

### Feature Documentation

- [ICON_PICKER_FEATURE.md](./ICON_PICKER_FEATURE.md) - Icon picker implementation
- [TOGGLE_CARD_PATTERN.md](./TOGGLE_CARD_PATTERN.md) - Toggle card UI pattern
- [HVAC_SUBSYSTEM_COMPLETE.md](./HVAC_SUBSYSTEM_COMPLETE.md) - HVAC implementation
- [POWER_SUBSYSTEM_COMPLETE.md](./POWER_SUBSYSTEM_COMPLETE.md) - Power implementation

---

## 🎓 Schema Example

A minimal valid schema:

```json
{
  "version": "0.1.0",
  "metadata": {
    "name": "Simple Lighting Panel",
    "author": "Marine Tech",
    "createdAt": "2025-10-02T10:00:00Z",
    "updatedAt": "2025-10-02T10:00:00Z"
  },
  "theme": {
    "colors": {
      "primary": "#0066CC",
      "background": "#000000",
      "text": "#FFFFFF"
      /* ... */
    },
    "fonts": {
      /* ... */
    },
    "spacing": { "unit": 8 },
    "borderRadius": 4
  },
  "icons": {
    "light-on": {
      "id": "light-on",
      "filename": "light-on.svg",
      "path": "/assets/icons/light-on.svg"
    }
  },
  "tabs": [
    {
      "id": "tab-lights",
      "label": "Lights",
      "order": 0,
      "sections": [
        {
          "id": "section-cabin",
          "label": "Cabin",
          "layout": "grid",
          "gridColumns": 2,
          "order": 0,
          "components": [
            {
              "id": "comp-galley",
              "type": "toggle",
              "label": "Galley Light",
              "icon": "light-on",
              "order": 0,
              "bindings": {
                "state": {
                  "type": "empirbus",
                  "channel": "out-channel-1",
                  "property": "state"
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

See [SCHEMA_SPEC.md](./SCHEMA_SPEC.md) for complete documentation.

---

## 🛠️ Tech Stack

### Core

- **TypeScript** - Type safety across all packages
- **pnpm** - Fast, efficient package manager
- **Vite** - Lightning-fast build tool

### Schema Package

- **Zod** - Runtime validation + type inference
- **Jest** - Testing framework

### Web Configurator

- **React 18** - UI framework
- **React Router** - Routing
- **CSS Modules** - Component-scoped styling
- **Vite** - Build tool
- **Icon System** - 28 SVG library + custom upload support

### HMI UI

- **Preact 10** - Lightweight React alternative (3KB)
- **@preact/signals** - Fine-grained reactivity
- **Vite** - Build with ES2017 target
- **WebSocket** - Real-time data binding

---

## ⚠️ Constraints

### Target Environment

- **Hardware**: Garmin HMI 7000 series
- **OS**: Android 10
- **WebView**: Chrome 83
- **JavaScript**: ES2017 (no optional chaining, nullish coalescing, etc.)

### Build Requirements

- HMI UI must transpile to ES2017
- Bundle size should be < 50KB gzipped
- No external CDN dependencies (offline-first)

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm -r test

# Watch mode
pnpm -r test --watch

# Coverage
pnpm -r test --coverage
```

### Integration Tests

```bash
# Schema package
cd packages/schema
pnpm test

# Web Configurator
cd packages/web-configurator
pnpm test
```

### E2E Tests (Planned)

```bash
pnpm test:e2e
```

---

## 📅 Development Status

**Current Phase**: Phase 2 - Web Configurator  
**Current Step**: 2.2.5 - Hardware Configuration (Icon Picker)  
**Last Updated**: October 2, 2025

### Completed ✅

- [x] Phase 1 - Foundation (Schema Package)
  - [x] Zod schema with full validation
  - [x] TypeScript types auto-generated
  - [x] Comprehensive test suite
- [x] Phase 2.1 - Hardware Configuration Page
  - [x] Module selection (8-channel, 16-channel)
  - [x] Channel naming and description
  - [x] Output/Input mode toggle
  - [x] Control type selection
- [x] Phase 2.2 - Visual Editor
  - [x] Power Subsystem (DC/AC/Inverter/Charger/Shore Power)
  - [x] HVAC Subsystem (Units, Fans, ACs with toggle card pattern)
  - [x] Plumbing Subsystem (Tanks, Pumps, Valves)
  - [x] Accessories Subsystem (Keypads, Switches, Relays)
  - [x] Hardware Page (Icon Picker for push/toggle buttons)
- [x] Phase 2.3 - Preview Page
  - [x] Tabbed interface preview
  - [x] Live schema validation
  - [x] Error display and debugging

### In Progress 🚧

- [ ] Lighting Subsystem (RGB, ITC modules, zones)
- [ ] Icon integration in Preview Page
- [ ] Export functionality with icon bundling

### Planned 📋

- [ ] Phase 2.4 - Export Page
- [ ] Phase 3 - HMI UI Runtime
- [ ] Advanced component types
- [ ] Live data bindings
- [ ] Deployment automation
- [ ] Multi-language support

See [SESSION_SUMMARY_OCT_2_2025.md](./SESSION_SUMMARY_OCT_2_2025.md) for latest session details.

---

## 🚀 Deployment

### AWS Amplify (Recommended)

The web configurator can be deployed to AWS Amplify for easy hosting and continuous deployment.

**Quick Start**:

1. Connect your repository to AWS Amplify Console
2. Amplify auto-detects `amplify.yml` configuration
3. Deploy automatically on every push

**Build Configuration**:

- ✅ `amplify.yml` - Pre-configured for pnpm monorepo
- ✅ Builds dependencies in order (schema → web-configurator)
- ✅ Outputs to `packages/web-configurator/dist`

**Documentation**:

- [AMPLIFY_QUICK_START.md](./AMPLIFY_QUICK_START.md) - 5-minute setup guide
- [docs/AWS_AMPLIFY_DEPLOYMENT.md](./docs/AWS_AMPLIFY_DEPLOYMENT.md) - Complete deployment guide

**Cost**: ~$5-20/month (includes free tier)

### Alternative Deployment Options

**Vercel**:

```bash
cd packages/web-configurator
vercel deploy
```

**Netlify**:

```bash
cd packages/web-configurator
pnpm build
# Drag dist/ folder to Netlify dashboard
```

**Manual Build**:

```bash
pnpm install
pnpm -r build
# Deploy packages/web-configurator/dist to any static host
```

---

## 🤝 Contributing

### Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test
3. Commit with conventional format: `feat(scope): description`
4. Push and create PR

### Commit Message Format

- `feat(scope): description` - New feature
- `fix(scope): description` - Bug fix
- `docs(scope): description` - Documentation
- `test(scope): description` - Tests
- `refactor(scope): description` - Code refactor

### Pull Request Guidelines

- All tests must pass
- No TypeScript errors
- Update relevant documentation
- Add tests for new features

---

## 📝 License

**Proprietary** - All rights reserved.

This project is private and confidential. Do not distribute without authorization.

---

## 🆘 Support

### Documentation

- Read [QUICKSTART.md](./QUICKSTART.md) for setup help
- Check [SCHEMA_SPEC.md](./SCHEMA_SPEC.md) for schema questions
- Review [DECISIONS.md](./DECISIONS.md) for technical context

### Issues

Create an issue with:

- Clear description of problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details

---

## 🔗 References

### External Resources

- [Garmin EmpirBus Documentation](https://www.garmin.com/empirbus)
- [NMEA 2000 Standard](https://www.nmea.org/nmea-2000.html)
- [Zod Documentation](https://zod.dev)
- [Preact Documentation](https://preactjs.com)

### Project Files

- System Config: `core-v2_9-30-25_v1.ebp`
- Target Entry: `web/index1.html`
- App Registry: `configuration/applications.json`

---

## 📊 Project Stats

- **Packages**: 3 (schema, web-configurator, hmi-ui)
- **Languages**: TypeScript, React/Preact
- **Subsystems Completed**: 5 (Power, HVAC, Plumbing, Accessories, Hardware)
- **Lines of Code (Web Configurator)**: ~2,900+ lines
- **Test Coverage**: Schema package 100%
- **Icon Library**: 28 SVG icons + custom upload
- **Bundle Size (HMI)**: Target < 50KB gzipped

---

**Built with ❤️ for marine electronics integrators**

_Last Updated: October 2, 2025_
