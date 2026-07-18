# Handoff: Lyra Forge Design System

## Overview

This bundle contains **DES**, an audience-aware design practice plus the Lyra
Forge production vocabulary. It is not one visual personality for every site.
The shared floor covers task clarity, accessibility, evidence honesty, semantic
tokens, responsive behavior, and rendered proof; the selected surface mode owns
density, structure, typography, imagery, motion, and expressive range.

DES has four primary modes:

1. **Operator** — repeated professional work in admin tools, queues, and
   workbenches. Stable, compact, keyboard-safe, and state-rich.
2. **Public data** — public exploration, comparison, and explanation. Provenance,
   uncertainty, exact values, and overview-to-detail movement are first-class.
3. **Editorial** — sustained reading, argument, and documented records. Reading
   rhythm, figures, claims, citations, and source custody lead.
4. **Marketing** — product distinction, credibility, and action. Greater
   structural and visual range is allowed when it supports an honest argument.

Read `modes/README.md` and the selected mode before choosing a visual direction.
Mode defaults and the independent variance, density, motion, type, and imagery
dials prevent both accidental sameness and random style changes.

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
| `ui-kits/` | **Design reference** | HTML prototypes of each product and mode. Not production code — study for layout, density, interaction patterns. |
| `showcase.html` | **Design reference** | Canonical render of every component. Open in a browser and compare against your implementation. |
| `PRACTICE.md` | Guidance | Diagnosis-to-proof workflow for reviews and implemented improvements. |
| `modes/` | Guidance | Shared floor, surface router, style dials, and mode-specific contracts. |
| `PRINCIPLES.md` | Guidance | Design philosophy. Read before making non-obvious decisions. |
| `PATTERNS-ADMIN.md` | Guidance | Queue, triage, review-rail, and decision-surface rules. |
| `RUBRIC.md` | Evaluation | Rendered admin-surface gates and region-anchored scoring. |
| `docs/design-engineering-toolchain.md` | Guidance | Current browser, reference, image-generation, and evaluation tool roles. |
| `scripts/des-audit.mjs` | Tooling | Reproducible 1440/768/390 screenshots, accessibility snapshots, browser checks, and JSON receipts. |
| `scripts/des-profile.mjs` | Tooling | Deterministic surface/model/harness/capability profile for prompts and receipts. |
| `evaluations/` | Evidence | Production calibrations that changed the system or practice. |
| `MIGRATING.md` | Guidance | Per-tool adoption guide. |
| `SKILL.md` | Guidance | Condensed system brief — cross-compatible with Agent Skills, drop into Claude Code. |

**The HTML UI kits are design references** — prototypes showing the intended look and feel of each product. When implementing a specific product (say, barnowl) in your codebase, the job is to **recreate the HTML design in your target environment** (React with your component library, Vue, SwiftUI, etc.) — not to ship the HTML.

## Fidelity

**High-fidelity within the shipped Lyra Forge vocabulary.** Its colors, spacing,
typography, and interaction values live in `tokens.css`. Recreate those assets
faithfully when the selected surface uses this vocabulary. Marketing, editorial,
or public-data work may establish a different tokenized identity rather than
being forced through the operator system.

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

## Shipped Lyra Forge themes

- **dark** (default) — zinc neutrals, indigo accent. Instrument default.
- **light** — warm off-white ("cream"), navy accent. Artifact default.
- **carbon** — pure black, electric blue accent. Developer / analysis.
- **slate** — blue-shifted dark, cyan accent. Geographic / live-feed.
- **parchment** — warm dark, amber accent. Long-form reading.

Apply via `<html data-theme="…">`. These are available identities, not the only
allowed directions. Within one route or product, keep a coherent design DNA and
make theme transitions deliberate rather than mixing arbitrary treatments.

## Shared rules (enforce in code review)

- **No fabricated proof.** Do not invent metrics, customers, testimonials,
  citations, capabilities, or urgency.
- **No scattered visual constants.** Reusable component colors and dimensions
  come from semantic tokens. A new identity may define a new token set.
- **Status colors are semantic** — success, warning, error, and info carry
  meaning and are not decoration.
- **Keyboard focus, contrast, semantic structure, reduced motion, and responsive
  behavior hold in every selected mode.**
- **Tabular numerals** on numeric comparison columns.
- **Expression is mode-specific.** Operator work prefers flat surfaces,
  functional motion, restrained imagery, and stable structure. Public-data,
  editorial, and marketing work may use gradients, elevation, expressive type,
  imagery, and greater variance when each choice has a stated job.

## Shipped Lyra Forge typography

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

## Motion in the shipped operator vocabulary

Fast and functional. Durations:
- `--duration-fast` 80ms (button press)
- `--duration-default` 150ms (hover, toggle)
- `--duration-slow` 300ms (panel open, modal)
- `--duration-live` 200ms (value flash on live update)

Easing: `--ease-out` `cubic-bezier(.16,1,.3,1)` for entrances. `prefers-reduced-motion` zeroes all durations (already handled in `tokens.css`).

Operator tools do not bounce. Other modes may use explanatory or expressive
motion under their mode contract and still provide a reduced-motion equivalent.

## Component catalog

Defined in `components.css`. Full render in `showcase.html`. Key classes:

- `.shell`, `.header`, `.sidebar`, `.inspector` — layout primitives
- `.stat-card` — uppercase label + mono numeral, no icon, no sparkline by default
- `.table` — tabular-nums, row hover `--surface-raised`, uppercase 11px header
- `.score-badge.is-hi|is-mid|is-lo` — three named bands; thresholds `≥0.70 / ≥0.40 / <0.40`
- `.filter-bar` with `.chip` — active chip uses `--accent-surface` + `--accent-text`
- `.decision-header`, `.segmented-nav`, `.decision-layout`, `.decision-brief`, `.decision-list`, `.decision-card`, `.decision-rationale` — bounded queue/review composition
- `.journey-header`, `.journey-map`, `.journey-focus`, `.journey-proof`, `.journey-attention`, `.journey-system-work`, `.journey-inventory` — intent-to-outcome briefing with bounded attention and machine settlement
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
| `ui-kits/barnowl.html` | barnowl | dark | Split view · article + inspector · timeline · score badges |
| `ui-kits/keel.html` | keel | dark | Operator shell · metrics · service table · pipeline |
| `ui-kits/tern.html` | tern | slate | Geographic live feed · stylized map · event stream |
| `ui-kits/steve.html` | steve | light | Editorial claim record · scoring · bibliography |
| `ui-kits/weaver.html` | weaver | light | Editorial-data narrative · figures · reading sequence |
| `ui-kits/public-data.html` | Qualifier Observatory | custom | Public-data explorer · filters · shareable scope · exact values |
| `ui-kits/des-marketing.html` | DES | custom | Marketing argument · expressive identity · tuple-bound proof |

Open each in a browser (or serve the handoff folder as static files) while implementing.

## Files in this bundle

```
design_handoff/
├── README.md                  # this file
├── PRACTICE.md                # diagnosis-to-proof workflow
├── PRINCIPLES.md              # design philosophy and component guidance
├── PATTERNS-ADMIN.md          # admin decision-surface patterns
├── RUBRIC.md                  # rendered evaluator gates
├── modes/                     # surface router + four audience/task contracts
├── evaluations/               # production calibration cases
├── MIGRATING.md               # per-tool adoption guide
├── SKILL.md                   # condensed brief for Agent Skills / Claude Code
├── tokens.css                 # primitive + semantic tokens (source of truth)
├── components.css             # component styles
├── colors_and_type.css        # light re-export of the token vars
├── showcase.html              # canonical component reference — open in a browser
├── playground.html            # token override sandbox
├── scripts/
│   ├── des-profile.mjs        # deterministic design execution profile
│   └── des-audit.mjs          # tuple-bound browser evidence receipt
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
├── ui-kits/                   # per-product and per-mode design references
│   ├── barnowl.html
│   ├── keel.html
│   ├── tern.html
│   ├── steve.html
│   └── weaver.html
└── preview/                   # design-system specimen cards (type, color, spacing, etc.)
```

## Recommended workflow with a coding agent

1. Drop the handoff folder into your repo (e.g. `packages/design-system/`).
2. Make the agent read `SKILL.md`, `PRACTICE.md`, `modes/README.md`, and the
   selected surface mode before it proposes changes.
3. Generate a DES profile for the actual model, harness, and available seeing or
   browser capabilities.
4. Point it at a specific product and representative task: "improve barnowl's article review flow using operator mode; reference `ui-kits/barnowl.html`".
5. Require the baseline, rendered task walk, after screenshots, and receipt described in `PRACTICE.md`.

For a consistent mechanical capture, serve the target app and run `des-audit`:

```bash
des-audit \
  --url http://127.0.0.1:3000/dashboard/resources \
  --task "Decide whether this resource belongs in the collection" \
  --surface "Resource review queue" \
  --mode operator \
  --harness codex \
  --model-tier frontier \
  --requested-model gpt-5 \
  --served-model gpt-5 \
  --capability browser \
  --capability visual-input \
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
