# Migration Guide

Per-tool instructions for adopting the design system. Each section is self-contained — go straight to the tool you're migrating.

---

## General approach

1. Drop in `tokens.css` (and optionally `components.css`) before your existing stylesheet
2. Add the compatibility shim to bridge old token names (see each tool below)
3. Migrate component-by-component — start with the header/nav, then tables, then badges
4. Switch fonts last (font loading changes layout)
5. Remove hardcoded hex values once the migration is complete

Never try to do a full reskin in one commit. One component at a time is more reliable and reviewable.

---

## barnowl

**Status:** Closest to the design system. barnowl's CSS already says "Keel-inspired design system." Token names differ slightly.

**Token name differences:**

| barnowl | System |
|---------|--------|
| `--bg` | `--bg` ✓ |
| `--surface` | `--surface` ✓ |
| `--surface-raised` | `--surface-raised` ✓ |
| `--border` | `--border` ✓ |
| `--border-subtle` | `--border-subtle` ✓ |
| `--text` | `--text` ✓ |
| `--text-muted` | `--text-muted` — note: barnowl uses `#a1a1aa`, system uses `#71717a` |
| `--text-dim` | `--text-dim` — barnowl uses `#71717a`, system uses `#52525b` |
| `--accent` | `--accent` ✓ |
| `--accent-surface` | `--accent-surface` ✓ |
| `--success` | `--success` ✓ |
| `--warning` | `--warning` ✓ |
| `--error` | `--error` ✓ |
| `--font-sans` | `--font-sans` — barnowl uses `"Geist"`, same ✓ |
| `--font-mono` | `--font-mono` ✓ |
| `--font-serif` | `--font-serif` — barnowl uses `Georgia`, system uses `"Instrument Serif"` |

**Step 1:** Replace the `<style>` block in `index.html` (and all other pages) with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/components.css">
<link rel="stylesheet" href="/css/barnowl.css">  <!-- tool-specific overrides -->
```

**Step 2:** In `barnowl.css` (new file), add a shim for the two text-muted differences:

```css
:root {
  /* barnowl used slightly lighter muted/dim values */
  --text-muted: #a1a1aa;  /* override if you prefer the barnowl shade */
}
```

**Step 3:** Replace nav styles. barnowl's nav pattern matches the system exactly — use `components.css` `.shell-header__nav-link` and `.shell-header__nav-link.is-active`.

**Step 4:** Replace stat cards with `.stat-card`, `.stat-card__value`, `.stat-card__label`.

**Step 5:** Replace badge styles. barnowl's inline `style=` status chips can be replaced with `.badge.badge--success` etc.

**Step 6:** Replace timeline with `.timeline`, `.timeline-year`, `.timeline-items`.

**Estimated effort:** 2–3 hours for the main views (index, claims, entities, sources). The ask/search page needs a bit more work for the Q&A layout.

---

## keel

**Status:** keel is the reference implementation. It uses Tailwind v4 with `@theme {}` — a different mechanism, but the token values are the canonical source.

**What to do:**

keel doesn't need migration — it *is* the React reference. Instead, use keel as the React adoption target:

1. Copy the `@theme {}` block from `keel/ui/src/index.css` and reconcile it with `tokens.css` whenever token values diverge
2. keel's `index.css` already has prose styles and animation tokens — keep those
3. When adding new keel features, add token-referenced CSS variables first, then Tailwind utility classes

**For extracting React components from keel into a shared package (future):**

Priority order for extraction:
1. `StatusBadge` (currently inline in multiple files)
2. `StatCard` (dashboard-panel.tsx)
3. `DataTable` wrapper (no shared component today — should exist)
4. `FilterBar` (inline in war-room.tsx)
5. `CommandPalette` (command-palette.tsx — already well-encapsulated)

See `react/` directory in this repo for starter implementations.

---

## tern

**Status:** Uses its own CSS variables with different names. Token values are close but not identical to the system.

**Token name differences:**

| tern | System |
|------|--------|
| `--bg` | `--bg` ✓ |
| `--surface` | `--surface` ✓ |
| `--border` | `--border` ✓ |
| `--text` | `--text` ✓ |
| `--muted` | `--text-muted` |
| `--accent` | `--accent` — tern uses `#6366f1` ✓ |
| `--accent-light` | `--accent-text` |
| `--green` | `--success` |
| `--yellow` | `--warning` |
| `--red` | `--error` |
| `--radius` | `--radius-md` |

**Step 1:** Add token files to `tern/tern/ui/`:

```
ui/
  css/
    tokens.css     ← copy from des
    components.css ← copy from des
  styles.css       ← keep for tern-specific overrides
  index.html
```

**Step 2:** Add to `index.html` `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/components.css">
<link rel="stylesheet" href="/styles.css">
```

**Step 3:** Replace `styles.css` `:root` block with a tern compatibility shim:

```css
/* tern compatibility shim — maps old names to system tokens */
:root {
  --muted:        var(--text-muted);
  --accent-light: var(--accent-text);
  --green:        var(--success);
  --yellow:       var(--warning);
  --red:          var(--error);
  --radius:       var(--radius-md);
  /* tern bg is slightly different (#0f1117 vs #09090b) — override if desired */
  --bg: #0f1117;
}
```

**Step 4:** Replace `.card` with `.stat-card` pattern. Tern uses `.stat-card` and `.stat-num`/`.stat-label` — nearly identical to the system.

**Step 5:** Replace `.btn` and `.btn-secondary` styles with system button classes.

**Step 6:** tern uses `MEDIA_COLORS` and `DOMAIN_COLORS` in `shared.js`. These map to `--chart-*` tokens. Reconcile by updating the JS color maps to reference the CSS variable values (or import from a shared JS constants file derived from the tokens).

**Step 7:** tern's section-based navigation (`.nav-group-label`) can be replaced with `.nav-section__label` and `.nav-item`.

**Estimated effort:** 3–4 hours for styles; another 2 hours to update the JS color maps.

---

## steve

**Status:** Most different — different theme family (cream/light), different token names, different accent. Requires the most work but the compatibility shim makes it safe to migrate incrementally.

**Theme choice:** Keep steve's cream/warm light theme. Use `[data-theme="light"]` from `tokens.css` as the base, then override the accent to navy.

**Token name differences:**

| steve | System ([data-theme="light"]) |
|-------|-------------------------------|
| `--bg: #fafaf7` | `--bg` ✓ (warm-50) |
| `--panel: #fff` | `--surface` |
| `--fg: #1a1a1a` | `--text` |
| `--fg-soft: #444` | `--text-muted` — steve uses darker muted |
| `--muted: #7a7a7a` | `--text-dim` — different shade |
| `--faint: #b5b5b5` | `--text-disabled` |
| `--border: #e4e4e0` | `--border` ✓ |
| `--border-strong: #c8c8c4` | `--border-strong` ✓ |
| `--accent: #1a4480` | `--accent` ✓ (light theme navy) |
| `--accent-soft: #e9eef6` | `--accent-surface` |
| `--good: #2b6a3c` | `--success` ✓ (light theme) |
| `--warn: #a04a00` | `--warning` ✓ (light theme) |
| `--ai: #7a2a7a` | no equivalent — add as tool-specific token |
| `--score-1: #2b6a3c` | `--score-hi` ✓ |
| `--score-m: #a07000` | `--score-mid` — slightly different shade |
| `--score-0: #8a1f2a` | `--score-lo` ✓ |
| `--chart-*` | `--chart-*` — different values, see below |

**Step 1:** Add `[data-theme="light"]` to the `<html>` tag in `base.html`:

```html
<html lang="en" data-theme="light">
```

**Step 2:** Add to `base.html` `<head>`, before the existing `<style>` block:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{{ url_for('static', path='/css/tokens.css') }}">
<link rel="stylesheet" href="{{ url_for('static', path='/css/components.css') }}">
```

**Step 3:** In the existing `<style>` block in `base.html`, replace the entire `:root {}` block with a compatibility shim:

```css
/* steve compatibility shim — bridges old token names */
:root {
  --fg:          var(--text);
  --fg-soft:     var(--text-muted);
  --muted:       var(--text-dim);
  --faint:       var(--text-disabled);
  --panel:       var(--surface);
  --border-strong: var(--border-strong);
  --accent-soft: var(--accent-surface);
  --good:        var(--success);
  --warn:        var(--warning);

  /* Steve-specific tokens with no system equivalent */
  --ai:          #7a2a7a;
  --ai-surface:  #f4e8f4;

  /* Chart palette — steve uses different values than system */
  /* Override to system values, or keep steve's if charts are tuned to them */
  --chart-1: var(--accent);
  --chart-2: #4f9eb3;
  --chart-3: #57a2a0;
  --chart-4: #a78bd6;
  --chart-5: #d89158;
  --chart-matched:    var(--success);
  --chart-nobeat:     #8a7a2a;
  --chart-unresolved: var(--error);

  /* Score adjustments — steve's mid threshold has a slightly different shade */
  --score-mid: #a07000;
  --score-mid-bg: #f6ebd7;
}
```

**Step 4:** Update font references. steve uses Inter; replace with Geist. The Instrument Serif italic for the brand header already matches.

**Step 5:** Replace hardcoded table styles with `components.css` `.data-table`. Steve's table pattern is clean and already close to the system pattern.

**Step 6:** Replace `.score` badges — steve's `score_badge` Jinja2 macro already generates the right HTML. Update the CSS class names: `score hi` → `score score--hi`.

**Step 7:** Keep steve's HTMX patterns as-is — `components.css` has no opinions about HTMX. The filter sidebar (`260px`) uses `--sidebar-width-lg` in the system.

**Score macro update** (`_list_rows.html`):

```jinja2
{% macro score_badge(s) -%}
  {% if s is none %}<span class="score score--na">—</span>
  {% elif s >= 0.7 %}<span class="score score--hi">{{ '%.2f' % s }}</span>
  {% elif s >= 0.4 %}<span class="score score--mid">{{ '%.2f' % s }}</span>
  {% else %}<span class="score score--lo">{{ '%.2f' % s }}</span>
  {% endif %}
{%- endmacro %}
```

**Estimated effort:** 4–6 hours total. The compatibility shim makes it safe to do incrementally — old `--fg`/`--panel` names continue working while you migrate view by view.

---

## weaver

**Status:** Visualization-only (no standard UI chrome). Uses no CSS custom properties — all colors are hardcoded in JavaScript. Two changes needed: adopt tokens for base styles, and move chart colors to CSS variables.

**weaver has no migration path for `tokens.css` in the traditional sense.** Its output is standalone HTML pages, not a tool with chrome. The right approach:

**Step 1:** Add `tokens.css` to `lib/base.css` as an import, or include it inline at the top:

```css
/* At top of lib/base.css */
@import url('/css/tokens.css');

/* Replace existing body styles with token references */
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
}
```

**Step 2:** Create `lib/colors.js` — a shared module exporting chart color constants that match the CSS token values:

```javascript
// lib/colors.js — single source of truth for chart colors
// Values match tokens.css --chart-* custom properties
export const CHART = {
  1: '#6366f1',  // --chart-1: indigo
  2: '#22d3ee',  // --chart-2: cyan
  3: '#a78bfa',  // --chart-3: purple
  4: '#f59e0b',  // --chart-4: amber
  5: '#34d399',  // --chart-5: emerald
  6: '#f87171',  // --chart-6: rose
  7: '#38bdf8',  // --chart-7: sky
  8: '#6b7280',  // --chart-8: gray
};

export const STATUS = {
  success:  '#22c55e',  // --success
  warning:  '#eab308',  // --warning
  error:    '#ef4444',  // --error
  muted:    '#71717a',  // --text-muted
};
```

**Step 3:** In each project's `main.js`, replace hardcoded hex color maps with imports from `lib/colors.js`. For example, `info-market-voting/main.js` line 8–25:

```javascript
// Before
const SEGMENT_COLORS = { civic_actives: '#6366f1', habitual_voters: '#22d3ee', ... }

// After
import { CHART } from '../../lib/colors.js'
const SEGMENT_COLORS = {
  civic_actives:        CHART[1],   // indigo
  habitual_voters:      CHART[2],   // cyan
  selective_engagers:   CHART[3],   // purple
  aspirational_informed: CHART[4],  // amber
  disengaged:           CHART[8],   // gray
  language_bridged:     CHART[5],   // emerald
}
```

**Step 4:** Keep `lib/contrast.js` as-is — it's already the canonical WCAG contrast implementation for the whole system.

**Step 5:** Add the reading guide component style from `components.css`. Each project's `index.html` currently has inline reading guide styles — replace with the shared class.

**Estimated effort:** 2–3 hours for base styles and the colors.js refactor across existing projects. New projects adopt it automatically.

---

## jay (reports)

**Status:** Standalone HTML reports, similar token names to tern but slightly different values.

**Quick approach** (reports are one-off documents, not maintained tools):

Add at the top of each report's `<style>` block:

```css
/* bridge to system tokens */
:root {
  --bg:      #0f1117;  /* keep jay's slightly lighter bg */
  --surface: #1a1d27;
  --border:  #2a2d3a;
  --text:    #e2e8f0;
  --dim:     var(--text-dim);
  --green:   var(--success);
  --yellow:  var(--warning);
  --blue:    var(--info);
  --red:     var(--error);
  --purple:  var(--chart-3);
  --accent:  var(--info);
}
```

Since jay reports are generated HTML, update the generator template rather than each file individually.

---

## New tools (adoption from scratch)

For any new tool in this family, use this checklist:

```
□ Pick architecture: React + Vite (complex/interactive) | Vanilla JS (dashboards) | Python + HTMX (backend-first)
□ Copy tokens.css → static/css/tokens.css (or ui/src/tokens.css)
□ Copy components.css → static/css/components.css
□ Add Google Fonts link (Geist, Geist Mono, Instrument Serif)
□ Add data-theme="dark" (or "light") to <html>
□ Create index.css for tool-specific overrides only
□ Pick a named theme variant if default dark doesn't fit (carbon / parchment / slate)
□ Verify: no hardcoded hex values in component CSS
□ Verify: filter state goes in URL query params
□ Verify: all interactive elements have :focus-visible styles (tokens.css provides defaults)
```
