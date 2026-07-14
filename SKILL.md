---
name: lyra-forge-design-system
description: Design system for Lyra Forge — a product studio building tools at the intersection of Media + AI. Use when building or styling (a) professional-facing instruments — dense, keyboard-driven research tools for journalists/editors/analysts (think code editor, financial terminal) — or (b) consumer-facing artifacts — long-form articles, public summaries, data visualizations. Covers tokens (color, type, spacing, motion), components (shell, tables, filter bars, cards, badges, timelines, command palette, prose/article), four named themes (carbon, slate, parchment + default dark/light), and React (Radix + CVA) implementations. Source of truth is tokens.css + components.css.
---

# Lyra Forge Design System

You are working with the Lyra Forge design system. It serves two audiences in one vocabulary: **instruments** (dense tools for professionals) and **artifacts** (public-facing surfaces that mix prose and data). Same tokens power both; density, type register, and layout differ.

## Start here

1. **Read `README.md`** — the full system overview and file index. Always read it first.
2. **Read `PRACTICE.md`** — the diagnosis-to-proof workflow. Use it for every review, redesign, or implemented UI change.
3. **Read `PRINCIPLES.md`** — the design philosophy and component guidance. Read before making non-obvious decisions (what to use for X, whether to add a modal, when a chart is justified).
4. **Read `PATTERNS-ADMIN.md`** when the surface asks a human to decide anything (queues, review rails, run boards, triage) — decision-surface rules, truncation policy, live-log presentation, nav governance, theme durability, and the pre-ship verification checklist.
5. **Read `tokens.css` and `components.css`** — the actual source of truth. No hardcoded colors, spacing, or font values outside of these files.
6. **Open `showcase.html` in a browser** — the canonical reference page; renders every component in both themes.
7. **Browse `ui_kits/`** — five per-product recreations that show the system applied to real products. Match the one whose density + audience match your task.

## Hard rules (never break)

- **No emoji.** Anywhere. Iconography is typographic (`→ › · ▲ ▼ ⇅`) or stroke SVG (Lucide). Emoji are aesthetically incompatible.
- **No hardcoded hex values** in component CSS. Every color comes from a semantic token (`--bg`, `--surface`, `--text`, `--accent`, …). If you need a new color, add it to `tokens.css` first.
- **No gradients** — not on backgrounds, not on buttons, not on cards. Flat surfaces only. Elevation comes from discrete surface tokens, not gradients or shadows.
- **No shadows on cards or buttons.** Shadows exist (`--shadow-sm/md/lg/overlay`) but are reserved for tooltips, modals, and the command palette.
- **Never mix themes inside a tool.** Pick one (`data-theme="dark"`, `"light"`, `"carbon"`, `"slate"`, `"parchment"`) and commit.
- **Status colors are sacred.** `--success` / `--warning` / `--error` / `--info` carry meaning. Never use them decoratively. A green badge means something is confirmed.
- **Bold/italic are reserved.** Bold for emphasis within prose only. Italic serif (Instrument Serif) is the brand/display gesture — never use italic sans for emphasis.
- **Tabular numerals always** on numeric columns (`font-variant-numeric: tabular-nums`).
- **Sentence case** for headings, buttons, nav. ALL-CAPS + letter-spacing only for low-hierarchy metadata labels.

## Typography

Four families, loaded from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&display=swap" rel="stylesheet">
```

| Role | Family | Use |
|---|---|---|
| Sans | Geist | All UI labels, body, nav, tables |
| Display serif (italic) | Instrument Serif | Tool brand/name in header, display headings — *the* recognizable gesture |
| Prose serif | Newsreader | Article body, artifact narrative, long-form reading |
| Mono | Geist Mono | Numbers in tables, IDs, timestamps, code, percentages |

**The brand mark is always Instrument Serif italic at ~20px.** Every tool header reads as a serif italic wordmark. There is no bug, logo, or monogram.

## Themes

- **Dark (default)** — zinc neutrals, indigo accent. Instrument default. Long-session legible.
- **Light** — warm off-white (cream), navy accent. Artifact default. Editorial.
- **Carbon** — pure black, electric blue accent. Dense analysis.
- **Slate** — blue-shifted dark, cyan accent. Geographic / live-feed.
- **Parchment** — warm dark, amber accent. Long-form reading.

Apply via `<html data-theme="…">`. Themes override semantic tokens only; components never know which theme is active.

## Layout defaults

Named tokens (do not reinvent):
- `--sidebar-width` 220px / `--sidebar-width-lg` 280px
- `--inspector-width` 360px
- `--header-height` 48px
- `--content-max` 1400px
- `--prose-max` 680px / `--prose-wide` 940px

Instrument pattern: fixed 48px header, sticky sidebar, main column, optional inspector on the right. Inspectors open *alongside* lists — never as modals. See `ui_kits/keel.html` for the canonical shell, `ui_kits/barnowl.html` for the split view, `ui_kits/tern.html` for slate + map.

Artifact pattern: header, centered content, `max-width: 680px` for prose and `940px` for figures. See `ui_kits/weaver.html` for the long-form pattern and `ui_kits/steve.html` for the public claim-record pattern.

## Spacing

4px base grid. Stops: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Tokens in `tokens.css` as `--space-1` … `--space-16`.

- **Instrument density:** table rows 32–34px, sidebar items 28–30px, cell padding 4–6px.
- **Artifact density:** paragraph margin-bottom 16px, card padding 16–20px, prose 65–75 chars wide.

## Components

Defined in `components.css`. Use them by class; do not fork styles inline. If you need a variation, first check whether an existing modifier fits.

Key patterns:
- **Stat card** — `.stat-card` with label (uppercase 11px `--text-dim`) and mono-numeral value (22px). No icons, no sparkline unless truly needed.
- **Table** — `.table`, tabular-nums always, row hover → `--surface-raised`, header row uppercase 11px `--text-muted`.
- **Score badge** — `.score-badge.is-hi/is-mid/is-lo` — three named bands, never a gradient. Thresholds: `≥0.70 / ≥0.40 / <0.40`.
- **Filter bar** — `.filter-bar` with chips, not a sidebar of checkboxes. Active filter chips use `--accent-surface` + `--accent-text`.
- **Decision workspace** — `.decision-header`, `.segmented-nav`, `.decision-layout`, `.decision-brief`, `.decision-list`, `.decision-card`, and `.decision-rationale`. Use for bounded queues and review rails so task entry, evidence, and action hierarchy do not require a product-local CSS system.
- **Timeline** — vertical dotted rail, mono-timestamps on left, event body on right. See `ui_kits/barnowl.html`.
- **Command palette** — 640px wide modal on `--surface-overlay`, mono input, grouped results with `⌘K` hint. See `ui_kits/keel.html`.
- **Article/prose** — `.prose` wrapper; Newsreader 19px, h2 30px, figure captions uppercase 11px mono. See `ui_kits/weaver.html`.

## Icons

No icon font is shipped. Use **Lucide** (`https://unpkg.com/lucide@latest`) or a comparable stroke-based set (1.5–2px weight, `currentColor`). Sizes: 14 / 16 / 20 px. For breadcrumbs / arrows / sort state, use Unicode glyphs (`› → ▲ ▼ ⇅`) — they are typographically correct and inherit color.

## Motion

Fast, functional. Durations: 80ms (press), 150ms (hover/toggle), 300ms (panel/modal), 200ms (live-update flash). Ease: `cubic-bezier(.16,1,.3,1)` for entrances. `prefers-reduced-motion` zeroes everything.

No bouncy easings. Tools do not bounce.

## Content voice

**Engineered humility.** Precise, peer-to-peer, willing to state what the system does *not* do. No exclamation marks. No marketing verbs. "You" for the reader; principles docs are imperative ("Use breadcrumbs for detail pages 2+ levels deep. Never use `>` as separator.")

## When you're adding to an existing tool

1. Follow `PRACTICE.md`: capture the real baseline and identify the lowest unresolved layer before changing the surface.
2. Open the relevant file in `ui_kits/`. Match its density, theme, and component vocabulary.
3. Reuse classes from `components.css`; do not fork.
4. If a token doesn't exist, add it to `tokens.css` with a clear name and a comment — never hardcode.
5. Consult `MIGRATING.md` if the tool is one of barnowl / keel / tern / steve / weaver / jay — it has tool-specific adoption notes.
6. Render, walk, rescore, and leave the design receipt required by `PRACTICE.md`.
7. Treat the lowest weak layer as repair order, not completion. Rescan the
   rendered surface after model or flow changes expose a new composition.
8. Without an independent seeing pass or explicit human acceptance, report a
   visual result as `candidate`, never `ship`.

## When you're building something new

1. Decide: instrument or artifact. This determines theme, density, and type register.
2. Decide: which of the five UI kits is closest? Start from that shape.
3. Use `playground.html` to sketch token overrides before committing.
4. Stay inside the component vocabulary. If you find yourself wanting a shadow, a gradient, or an emoji, stop and re-read `PRINCIPLES.md`.
