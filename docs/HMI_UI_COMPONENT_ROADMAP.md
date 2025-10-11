HMI UI Component Roadmap — v2 (refined)

Date: 2025‑10‑11
Package: packages/hmi-ui
Target JS: ES2017 (no ?. / ??)
Screens ref: Power, HVAC (Hydronic/AC/Ventilation), Lights (interior/exterior/RGB), Tanks, Switches.

This version tightens priorities, adds concrete acceptance tests, clarifies APIs, and links tasks to the on‑screen patterns in the reference mockups.

⸻

0) Working principles
	•	Small, composable primitives with stable props + events.
	•	Theme-first: every visible color/spacing pulls from tokens.
	•	Accessible by default: keyboard parity, ARIA roles/states, focus‑visible.
	•	Offline-safe: don’t send actions when disconnected; surface a clear hint.
	•	Deterministic I/O: all components are controlled; emit onChange(next) and accept value.

⸻

1) Tokens (expand + finalize)

Define once in styles/tokens.css and import from components.css.

Color (semantic):
--bg, --bg-muted, --panel, --panel-muted, --text, --text-muted, --border, --focus,
--act-primary, --act-primary-contrast,
--state-ok, --state-warn, --state-err, --state-info.

Spacing (px): --space-2,4,8,12,16,20,24
Radii: --radius-sm (6), --radius-md (12), --radius-lg (16)
Typography: --font-sans, sizes --fs-xs/sm/md/lg/xl
Controls:
--ctl-height-sm (36), --ctl-height-md (44), --thumb-size (28–40),
--track-thickness (10)

Motion: --ease (cubic-bezier(.2,.8,.2,1)), --dur-1 (120ms), --dur-2 (200ms); always respect prefers-reduced-motion.

Definition of done (tokens): no raw hex values or hardcoded paddings in components; switching a theme map updates all screens without further edits.

⸻

2) Core API contracts (stable props)

Keep these very small; avoid optional chaining by guarding inside impl.

2.0 Schema bridge (icons + theme)

Goal: Consume your schema (v0.1.0) directly.

Contracts
	•	Theme: read schema.theme (preset today; optional custom overrides tomorrow) → ThemeInput.
	•	Icons: read schema.icons: {id,type,data|url} → register in an in‑memory registry; components reference by iconId.
	•	Components: tabs[].sections[].components[] drive which UI primitives render.

Helper types

// Minimal shapes extracted from your schema
export type Schema = {
  schemaVersion: string;
  theme?: { preset?: string; custom?: Partial<ThemeInput> };
  icons?: Array<{ id: string; type: 'svg'|'url'; data?: string; url?: string }>;
  tabs: Array<{ id: string; title: string; sections: Array<{ id: string; title?: string; components: ComponentSpec[] }> }>;
};

export type ComponentSpec =
 | { id: string; type: 'toggle'; label?: string; variant?: 'default'|'switch'|'round'|'checkbox'; tooltip?: string; iconId?: string; bindings?: any }
 | { id: string; type: 'button'; label?: string; variant?: 'primary'|'secondary'|'danger'|'round'; action?: 'momentary'|'toggle'|'action'; tooltip?: string; iconId?: string; bindings?: any }
 | { id: string; type: 'indicator'; label?: string; color?: 'green'|'yellow'|'red'|'blue'|'white'; variant?: 'led'|'badge'|'icon'; iconId?: string; bindings?: any };

2.1 Icon

export type IconSpec = { id?: string; svg?: string; url?: string };
export type IconProps = { icon?: IconSpec; size?: 'sm'|'md'; title?: string };

	•	DoD: renders inline SVG or fetched sprite (string); uses currentColor; safe fallback glyph.

2.2 Button

type ButtonKind = 'momentary'|'toggle'|'action';
export type ButtonProps = {
  kind: ButtonKind;
  pressed?: boolean; // for toggle
  label?: string;
  icon?: IconSpec; // resolved from schema iconId
  disabled?: boolean;
  offline?: boolean; // blocks events
  onPress?: () => void;       // keyDown/PointerDown
  onRelease?: () => void;     // keyUp/PointerUp/Cancel/Leave
};

	•	DoD: Space/Enter parity; aria-pressed when kind='toggle'; visual pressed state.

2.3 Slider / Dimmer (unified skin)

export type SliderProps = {
  value: number; // 0..100 or scaled by props
  min?: number; max?: number; step?: number; vertical?: boolean;
  label?: string; disabled?: boolean; offline?: boolean;
  onChange: (v:number)=>void; onCommit?: (v:number)=>void; // release
};

	•	DoD: keyboard Left/Right/Up/Down; ARIA valuetext; 40px thumb; no jank while dragging.

2.4 Indicator

type IndVariant = 'led'|'badge'|'icon';
export type IndicatorProps = {
  variant: IndVariant;
  label?: string; color?: 'ok'|'warn'|'err'|'info'|'neutral';
  active?: boolean; icon?: IconSpec; truncate?: boolean;
};

	•	DoD: badge truncates with ellipsis + title tooltip; icon inherits color.

2.5 TabBar / SubtabBar
	•	Roving tabindex, Arrow navigation, Home/End; aria-selected.
	•	Collapses label < certain width (icon‑only).

2.6 StatusBar
	•	Connection pill (dot + label) with hover/long‑press details.
	•	offline prop shared via context to disable controls.

⸻

3) Prioritized plan (Now → Next → Later)

Now (sequence + dependencies)
	1.	Icon support across UI (unblocks: TabBar/Buttons visuals)
	•	Files: components/Icon.tsx (new), patch TabBar/Toggle/Button, components.css.
	•	Accept:
	•	Tab icons from schema.tab[i].icon or fallback map.
	•	Button/Toggle can show icon+label; size tokens apply.
	•	No runtime failures when icon is missing/invalid.
	2.	Slider CSS + unification with Dimmer
	•	Files: Slider.tsx, Dimmer.tsx, components.css.
	•	Accept:
	•	.gcg-slider classes: --track, --fill, --thumb using tokens.
	•	Vertical variant parity; disabled visuals; keyboard controls.
	•	25–50ms throttled onChange + onCommit on release.
	3.	Accessibility & focus polish (global)
	•	Files: TabBar, SubtabBar, Button/Toggle, Slider/Dimmer, components.css.
	•	Accept:
	•	Roving tabindex on tabs; Space/Enter for activations.
	•	.focus-ring utility using --focus color; no outline: none without replacement.
	4.	Disconnected state UX (lightweight)
	•	Files: StatusBar, ws/context, guards in controls.
	•	Accept:
	•	StatusBar shows red/amber/green dot (info tooltip).
	•	Controls gate actions when offline; optional tooltip “No connection”.
	5.	Indicator variants (badge, icon)
	•	Files: Indicator.tsx, components.css.
	•	Accept:
	•	variant prop supports 'badge'|'icon'; semantic colors wired to tokens.

Exit criteria for NOW: HVAC screens show token‑based sliders, icon’d TabBars; Lights and Power screens use consistent buttons/toggles; offline hint visible.

Next
	1.	NMEA2000 binding (read‑only subset for gauges)
	•	Implement PGN+field→channel mapping for a documented subset.
	•	Safe no‑op + console warn for unsupported.
	2.	Theme variable coverage (full)
	•	Remove remaining inline colors; smoke test theme switching.
	3.	Responsive layout polish
	•	Grid/gaps from spacing tokens; TabBars collapse labels under threshold.
	4.	Empty/loading/error states
	•	Gauges/Indicators show skeleton/placeholder when data missing.

Later
	•	Scenes (multi‑action buttons).
	•	RGB color control (HSV + swatches) gated on schema.
	•	Gauges: ticks & range labels.
	•	Unit/Integration tests: resolver + signal parsing + smoke renders.

⸻

4) Screen‑by‑screen mapping → components

Power (screenshot: battery %, AC/DC Loads, Shore Power)
	•	Gauges: linear (AC/DC current/voltage), circular (battery %).
	•	Buttons: MultiPlus actions (On / Off / Charger Only) → Button kind='action'
	•	Indicator: status badges (shore connected, “+AC limit” availability).
	•	StatusBar: interior/exterior temp readouts (use Indicator badge).

HVAC – Hydronic / AC / Ventilation
	•	TabBar (Hydronic | AC | Ventilation) with icons.
	•	Sliders for Temperature & Fan speed (unified).
	•	Buttons (mode selections) as toggle group; ensure roving focus.

Lights
	•	SubtabBar (Interior | Exterior | RGB).
	•	Dimmers per zone; Scene placeholders (Movie/Party) for Later.
	•	RGB: brightness Slider + future color picker stub.

Tanks
	•	Gauges (vertical linear) with percentage labels; loading placeholders when unknown.

Switches & Accessories
	•	Buttons grid (momentary + toggle mix).
	•	Use Icon + label; size md; badge indicators for state.

⸻

5) CSS structure

styles/
  tokens.css      /* vars only */
  components.css  /* .gcg-* classes, focus ring, disabled, skeletons */

Key classes:
	•	.gcg-icon { display:inline-block; line-height:0; color:inherit; }
	•	.gcg-slider { --track: var(--panel-muted); --fill: var(--act-primary); } .gcg-slider__track { height: var(--track-thickness); border-radius: var(--radius-lg); } .gcg-slider__fill { } .gcg-slider__thumb { width: var(--thumb-size); height: var(--thumb-size); }
	•	.gcg-badge { background: var(--panel-muted); border:1px solid var(--border); }
	•	.gcg-focus { outline: 2px solid var(--focus); outline-offset: 2px; }
	•	.gcg-skeleton { background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent); }

Schema hooks (new):
	•	.gcg-theme-* class on the root when schema.theme.preset is provided (optional – mostly for analytics or preset-specific tweaks; tokens still drive the real colors).
	•	[data-icon-id] attribute set on elements rendering schema icons → helps debug missing IDs/resolution.

⸻

6) Accessibility checklist (apply globally)
	•	Buttons/Toggle: role=button; aria-pressed for toggles; Space/Enter triggers press/release.
	•	Sliders/Dimmers: role=slider; aria-valuemin|max|now; label via aria-labelledby.
	•	Tabs: role=tablist/tab; roving tabindex; Arrow/Home/End; aria-controls.
	•	Indicators: role=status; badge text readable; WCAG 2.1 AA contrast.
	•	Focus: use :focus-visible and .gcg-focus; never remove outlines without replacement.
	•	Motion: respect prefers-reduced-motion.

⸻

7) Disconnected/Offline UX
	•	StatusBar shows red dot + tooltip “Disconnected”; amber during reconnect backoff.
	•	Controls receive offline from context → add title="No connection" and disabled styles; no events fired.
	•	Logging: one debounced console warn per 3s when user tries to interact offline.

Schema-awareness:
	•	If a component has bindings.state.type === 'static', render normally while offline (no sends).
	•	If bindings.action.type === 'empirbus', block on offline with tooltip.

⸻

8) Testing plan (minimal to start)
	•	Unit (ts-jest or vitest):
	•	binding-resolver: known PGNs → channel id; unknown → null + warn.
	•	slider math (value↔pos), clamped boundaries.
	•	Component smoke (jest+jsdom): Button/Toggle/Slider render with tokens; keyboard triggers callbacks.
	•	Manual device checklist:
	•	Drag slider for 5s → no jitter; value commits on release.
	•	Toggle via Space; focus ring visible on all interactive components.
	•	Pull ethernet → StatusBar goes amber/red; controls block sends; tooltips appear.

⸻

9) Performance guardrails
	•	Bundle delta ≤ +30KB gz from current.
	•	No layout thrash during slider drag; use transform for thumb movement; only read/write once per frame.
	•	Avoid heavy SVG filters/shadows.

⸻

10) Concrete TODOs (trackable boxes)

Icon
[ ] Icon.tsx with inline SVG + URL string modes; fallback glyph.
[ ] Icon registry: load from schema.icons; expose getIcon(id); warn on miss; memoize.
[ ] Fallback map for legacy tab keys.
[ ] Tokenized sizes sm/md.

Theme / Config bridge
[ ] Implement buildTokensFromSchema(schema) → returns ThemeInput then tokens.
[ ] Apply at runtime via ThemeProvider; supports preset and future custom overrides.
[ ] Contrast audit (AA) for --text against --bg.

Slider/Dimmer
[ ] Extract classes; unify skins; throttle onChange.
[ ] Vertical variant polish; ARIA values.
[ ] Disabled/Offline styles.

Indicator
[ ] Add badge + icon variants; semantic color mapping.
[ ] Truncate labels with tooltip; reduced‑motion friendly blink for warn/err.

A11y
[ ] Tabs roving tabindex + keyboard nav.
[ ] Button/Toggle Space/Enter parity; aria-pressed.
[ ] Global focus ring utility.

Offline UX
[ ] StatusBar connection pill + tooltip; shared offline context.
[ ] Controls gate sends; hint tooltips.

Next wave
[ ] NMEA2000 resolver (subset).
[ ] Theme coverage audit (remove remaining hex).
[ ] Responsive polish (icon‑only tabs under width).