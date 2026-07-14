# Handoff: Lyra Forge Design System

## Overview

This bundle contains the **Lyra Forge design system** — a unified design vocabulary for a family of Media + AI tools. It is not a single-feature design; it is a complete system with tokens, components, themes, and reference product implementations ready to be vendored into a real codebase.

The system serves two audiences in one vocabulary:

1. **Instruments** — professional-facing internal tools for journalists, editors, analysts. Dense, keyboard-driven, data-heavy. Mental model: a code editor or financial terminal.
2. **Artifacts** — consumer-facing surfaces. Articles, public claim records, data visualizations, editorial layouts.

Same tokens power both; density, type register, and layout differ.

The tool family that originally motivated the system: **barnowl** (claims research), **keel** (dashboard / reference impl), **tern** (geographic live-feed), **steve** (public claim records), **weaver** (data-viz publishing).

## About the files in this bundle

The files here are a mix of **production-ready system code** and **design references**.

| File / folder | Kind | What to do with it |
|---|---|---|
| `tokens.css` | Production | Drop in as-is. Single source of truth for all design values. |
| `components.css` | Production | Drop in as-is. Vanilla CSS — framework-agnostic. |
| `themes/` | Production | Drop in as-is. Applied via `[data-theme="…"]` on any ancestor. |
| `react/` | Production reference | Radix + CVA React implementations. Port to your stack (React, Vue, SwiftUI) using the same token names and behavior. |
| `fonts.html` snippet | Production | Copy the `<link>` tag into your `<head>`. |
| `assets/` | Production | SVG icons, Lyra Forge wordmark. Drop in. |
| `ui_kits/` | **Design reference** | HTML prototypes of each product. Not production code — study for layout, density, interaction patterns. |
| `showcase.html` | **Design reference** | Canonical render of every component. Open in a browser and compare against your implementation. |
| `PRACTICE.md` | Guidance | Diagnosis-to-proof workflow for reviews and implemented improvements. |
| `PRINCIPLES.md` | Guidance | Design philosophy. Read before making non-obvious decisions. |
| `PATTERNS-ADMIN.md` | Guidance | Queue, triage, review-rail, and decision-surface rules. |
| `RUBRIC.md` | Evaluation | Rendered admin-surface gates and region-anchored scoring. |
| `docs/design-engineering-toolchain.md` | Guidance | Current browser, reference, image-generation, and evaluation tool roles. |
| `scripts/des-audit.mjs` | Tooling | Reproducible 1440/768/390 screenshots, accessibility snapshots, browser checks, and JSON receipts. |
| `evaluations/` | Evidence | Production calibrations that changed the system or practice. |
| `MIGRATING.md` | Guidance | Per-tool adoption guide. |
| `SKILL.md` | Guidance | Condensed system brief — cross-compatible with Agent Skills, drop into Claude Code. |

**The HTML UI kits are design references** — prototypes showing the intended look and feel of each product. When implementing a specific product (say, barnowl) in your codebase, the job is to **recreate the HTML design in your target environment** (React with your component library, Vue, SwiftUI, etc.) — not to ship the HTML.

## Fidelity

**High-fidelity.** Every color, spacing, typography, and interaction value is finalized and lives in `tokens.css`. Recreate pixel-perfectly in your framework using the tokens.

## How to vendor this into a codebase

### Minimum viable integration (any web stack)

1. Copy `tokens.css` and `components.css` into your stylesheet pipeline.
2. Add the Google Fonts `<link>` to your document `<head>` (see `fonts.html`).
3. Wrap your app root in `<html data-theme="dark">` (or `light`, `carbon`, `slate`, `parchment`).
4. If you want a named theme beyond dark/light, also import the theme file: `themes/carbon.css`, `themes/slate.css`, or `themes/parchment.css`.
5. Use the component classes directly, or re-export them as your framework's components (see React reference).

### React / TypeScript integration

Files in `react/` are the reference:

- `react/components.tsx` — top-level components (Shell, Header, Sidebar, StatCard, ScoreBadge, Table, FilterBar, Timeline, etc.)
- `react/table.tsx` — Tanstack-table integration + sort/filter state
- `react/radix.tsx` — Radix primitives (Dialog, DropdownMenu, Tooltip, Popover) styled to the system
- `react/radix.css` — styles for the Radix primitives

These are CVA-based. Port the class mappings to your own component library if you already have one; do not run two component libraries in parallel.

### Non-React stacks

The `.css` files are framework-agnostic — classes are BEM-ish and scoped. Vue, Svelte, Angular, plain HTML all work. Mirror the React component API as needed.

### SwiftUI / native

Take the tokens from `tokens.css` and port them to your native color / spacing / typography system. `PRINCIPLES.md` is the authoritative reference for *behavior* — motion timing, density rules, interaction states.

## Themes

- **dark** (default) — zinc neutrals, indigo accent. Instrument default.
- **light** — warm off-white ("cream"), navy accent. Artifact default.
- **carbon** — pure black, electric blue accent. Developer / analysis.
- **slate** — blue-shifted dark, cyan accent. Geographic / live-feed.
- **parchment** — warm dark, amber accent. Long-form reading.

Apply via `<html data-theme="…">`. **Do not mix themes inside a single tool.**

## Hard rules (enforce in code review)

- **No emoji.** Anywhere. Iconography is typographic (`→ › · ▲ ▼ ⇅`) or stroke SVG (Lucide). Use the set in `assets/icons/`.
- **No hardcoded hex values** outside `tokens.css`. Every color comes from a semantic token.
- **No gradients** on backgrounds, buttons, or cards. Flat surfaces only.
- **No shadows on cards or buttons.** Shadows exist (`--shadow-sm/md/lg/overlay`) but are reserved for tooltips, modals, and the command palette.
- **Status colors are sacred** — `--success` / `--warning` / `--error` / `--info` carry meaning. Never decorative.
- **Sentence case** for headings, buttons, nav. Uppercase + letter-spacing only for low-hierarchy metadata labels.
- **Tabular numerals** on every numeric column: `font-variant-numeric: tabular-nums`.
- **The brand mark is always Instrument Serif italic** at ~20px. There is no bug, logo, or monogram.

## Typography

Load from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&display=swap" rel="stylesheet">
```

| Role | Family | Use |
|---|---|---|
| Sans | Geist | All UI labels, body, nav, tables |
| Display serif (italic) | Instrument Serif | Tool brand/name in header |
| Prose serif | Newsreader | Article body, long-form reading |
| Mono | Geist Mono | Numbers, IDs, timestamps, code |

Type scale (in `tokens.css`): `--text-xs` 10px · `--text-sm` 12px · `--text-base` 13px · `--text-md` 15px · `--text-lg` 18px · `--text-xl` 22px · `--text-2xl` 28px. Prose headings use `clamp(28px, 4vw, 48px)`.

## Spacing

4px base grid. Stops: `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24 · `--space-8` 32 · `--space-10` 40 · `--space-12` 48 · `--space-16` 64.

Layout tokens: `--sidebar-width` 220px · `--sidebar-width-lg` 280px · `--inspector-width` 360px · `--header-height` 48px · `--content-max` 1400px · `--prose-max` 680px · `--prose-wide` 940px.

## Motion

Fast, functional. Durations:
- `--duration-fast` 80ms (button press)
- `--duration-default` 150ms (hover, toggle)
- `--duration-slow` 300ms (panel open, modal)
- `--duration-live` 200ms (value flash on live update)

Easing: `--ease-out` `cubic-bezier(.16,1,.3,1)` for entrances. `prefers-reduced-motion` zeroes all durations (already handled in `tokens.css`).

No bouncy easings. Tools do not bounce.

## Component catalog

Defined in `components.css`. Full render in `showcase.html`. Key classes:

- `.shell`, `.header`, `.sidebar`, `.inspector` — layout primitives
- `.stat-card` — uppercase label + mono numeral, no icon, no sparkline by default
- `.table` — tabular-nums, row hover `--surface-raised`, uppercase 11px header
- `.score-badge.is-hi|is-mid|is-lo` — three named bands; thresholds `≥0.70 / ≥0.40 / <0.40`
- `.filter-bar` with `.chip` — active chip uses `--accent-surface` + `--accent-text`
- `.decision-header`, `.segmented-nav`, `.decision-layout`, `.decision-brief`, `.decision-list`, `.decision-card`, `.decision-rationale` — bounded queue/review composition
- `.record-section`, `.record-list`, `.record-item` — typed heterogeneous operational records with full-text disclosure and optional action rails
- `.timeline` — vertical dotted rail with mono timestamps
- `.palette` — 640px modal on `--surface-overlay`, mono input, grouped results
- `.prose` — Newsreader 19px, serif h2, mono figure captions

## Icons

No icon font. Use **Lucide** (`https://unpkg.com/lucide@latest`) or equivalent stroke SVG set at 1.5–2px weight, `currentColor`, sizes 14/16/20px. A small Lucide subset ships in `assets/icons/`.

## Product reference implementations

Study these before building or migrating the corresponding tool:

| UI kit | Product | Theme | Pattern |
|---|---|---|---|
| `ui_kits/barnowl.html` | barnowl | dark | Split view · article + inspector · timeline · score badges |
| `ui_kits/keel.html` | keel | dark | Shell · stat cards · filter bar · table · command palette |
| `ui_kits/tern.html` | tern | slate | Geographic live feed · stylized map · event stream |
| `ui_kits/steve.html` | steve | parchment | Public claim record · scoring · bibliography |
| `ui_kits/weaver.html` | weaver | light | Long-form data publishing · sankey + horizon charts · prose |

Open each in a browser (or serve the handoff folder as static files) while implementing.

## Files in this bundle

```
design_handoff/
├── README.md                  # this file
├── PRACTICE.md                # diagnosis-to-proof workflow
├── PRINCIPLES.md              # design philosophy and component guidance
├── PATTERNS-ADMIN.md          # admin decision-surface patterns
├── RUBRIC.md                  # rendered evaluator gates
├── evaluations/               # production calibration cases
├── MIGRATING.md               # per-tool adoption guide
├── SKILL.md                   # condensed brief for Agent Skills / Claude Code
├── tokens.css                 # primitive + semantic tokens (source of truth)
├── components.css             # component styles
├── colors_and_type.css        # light re-export of the token vars
├── showcase.html              # canonical component reference — open in a browser
├── playground.html            # token override sandbox
├── themes/
│   ├── carbon.css
│   ├── slate.css
│   └── parchment.css
├── react/
│   ├── components.tsx
│   ├── table.tsx
│   ├── radix.tsx
│   └── radix.css
├── assets/
│   ├── (SVG icons + wordmark)
├── ui_kits/                   # per-product design references (HTML prototypes)
│   ├── barnowl.html
│   ├── keel.html
│   ├── tern.html
│   ├── steve.html
│   └── weaver.html
└── preview/                   # design-system specimen cards (type, color, spacing, etc.)
```

## Recommended workflow with a coding agent

1. Drop the handoff folder into your repo (e.g. `packages/design-system/`).
2. Make the agent read `SKILL.md` and `PRACTICE.md` before it proposes changes.
3. Point it at a specific product and representative task: "improve barnowl's article review flow using this design system; reference `ui_kits/barnowl.html`".
4. Require the baseline, rendered task walk, after screenshots, and receipt described in `PRACTICE.md`.

For a consistent mechanical capture, serve the target app and run `des-audit`:

```bash
des-audit \
  --url http://127.0.0.1:3000/dashboard/resources \
  --task "Decide whether this resource belongs in the collection" \
  --surface "Resource review queue" \
  --arm baseline
```

See `docs/design-engineering-toolchain.md` for the boundary between deterministic
receipts, exploratory browser control, performance diagnosis, references, and
image-generated candidates.

## Questions it's reasonable to ask back

- Which framework / component library are you targeting?
- Are you migrating an existing tool, or building new?
- Will you need offline font bundles (Google Fonts is CDN-only here)?
- Do you want the React reference ported to a different stack?
