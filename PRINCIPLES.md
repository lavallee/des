# Design System Principles

Working guidelines for tools in this project family: barnowl, keel, tern, steve, weaver, malo, and tools built after them.

These are principles, not a style guide. They explain *why* decisions were made so future tools can make good contextual choices instead of blindly copying patterns that don't fit.

Organized by concern: [Foundations](#foundations) → [Visual Design](#visual-design) → [Components](#components) → [Interaction](#interaction) → [Visualization](#visualization) → [Architecture](#architecture) → [Process](#process).

---

## Foundations

### What this system is for

This is a design system for **internal research and analysis tools** — tools used by practitioners who are deeply familiar with their domain and need to move quickly through large amounts of structured and semi-structured information.

These tools are not consumer products. They are instruments. The appropriate mental model is closer to a well-designed code editor or financial terminal than to a consumer app. Density, speed, and power-user ergonomics matter more than visual novelty or first-run experience.

### Two design intents

Distinguish the intent of a tool before applying patterns:

**Instrument:** Used repeatedly by someone who becomes expert with it. Optimize for density, keyboard shortcuts, and efficiency over time. Barnowl, keel, tern are instruments.

**Artifact:** Produced once, read by someone without training. Optimize for cold-reader comprehension, progressive disclosure, and self-documentation. Weaver visualization outputs, published barnowl summaries are artifacts.

Some tools contain both (a weaver project has an exploratory instrument stage and a publishable artifact stage). Name which mode you're in — the applicable patterns differ.

### Generate variants, select after

At key decision points (layout, color scheme, component form, headline), produce 2–4 variants rather than one. Selection goes through concrete criteria, not gut preference. This is explicit Weaver process and applies equally here.

The practical implication: design system components must make variant generation cheap. Shared tokens, composable components, and swappable themes are engineering requirements for this goal, not nice-to-haves.

---

## Visual Design

### Color

#### Two canonical themes

**Dark (default):** Zinc surface scale, indigo accent. Used for instruments. Reduces eye strain in extended use. Established in keel; carried through barnowl, tern.

**Cream (light):** Warm off-white surface, navy accent. Used for readable artifacts and public-facing output. Established in steve.

Do not mix themes within a tool. Pick one. Mixing dark surfaces with light panels creates visual noise that erodes both legibility and perceived quality.

#### Token hierarchy

Three tiers. Never skip a tier.

**Primitives** (in `tokens.css` as `--p-*`): Raw values. Not used in components directly. These are the palette — all possible hues at all possible lightness values. Change primitives when you want a completely different palette.

**Semantic tokens** (`--bg`, `--surface`, `--text`, `--accent`, etc.): Intent-named. Reference primitives. This is what components use. "Background" has meaning; "zinc-950" does not. Change semantic tokens when you want a different theme (dark → light).

**Component tokens** (optional, `--table-row-hover`, `--badge-success-bg`, etc.): Specific to one component family. Reference semantic tokens. Use only when a component has many related states that would otherwise need inline logic everywhere.

#### Status colors

Four semantic statuses, each with a foreground and subtle-background variant:

| Intent | Use |
|--------|-----|
| `--success` | Verified, confirmed, active, positive |
| `--warning` | Pending, partial, caution, needs review |
| `--error` | Failed, dropped, blocked, destructive |
| `--info` | Neutral informational, in-progress |

Status colors carry meaning. Never use them decoratively. A green badge means something is confirmed — if it doesn't, use a neutral gray badge instead.

#### Score / continuous range colors

When displaying a continuous score (0–1 or 0–100), use three bands with semantic meaning — not a continuous gradient. Gradients are harder to compare across rows; three named states (high/mid/low, or good/warn/bad) are faster to scan.

Default thresholds (from steve, established in several tools): ≥ 0.7 = high (green), 0.4–0.7 = mid (amber), < 0.4 = low (red). Document the thresholds explicitly in the tool — they are domain decisions, not visual ones.

#### Categorical / chart colors

Maintain a fixed palette of 6–8 chart colors at consistent perceptual weight. Never mix red/green as the only differentiator (colorblindness). Prefer the indigo/cyan/purple/amber/emerald/gray sequence from `tokens.css`. Named by meaning in each tool (e.g., "segment A is civic-actives = indigo") so the legend can use the name, not just the color.

#### Accent restraint

One primary accent per tool. Use it for: interactive elements (links, buttons, active states, focus rings), primary data encoding in charts. Using accent color for decorative purposes dilutes its signal value — if everything is blue, nothing is navigational.

#### Avoid RGBA opacity hacks for surfaces

`rgba(255,255,255,0.05)` as a background is fragile: it looks wrong on non-black backgrounds, varies across displays, and can't be referenced as a token. Use discrete surface elevation tokens (`--surface`, `--surface-raised`) instead.

---

#### No colored side-border accents

A colored `border-left`/`border-right` rule on a card, panel, quote, callout,
or list item — as a category marker, emphasis, or decoration — is forbidden.
It is the most recognizable template-kit tic, it doubles a signal that should
live in content (a tag, a dot, a badge, a word), and it breaks down the moment
two accents sit adjacent.

Convey **category** with a tag chip or kind-dot, **status** with a badge,
**emphasis** with type weight or surface tint. Neutral hairline separators
(`var(--border)` / `--border-strong`) are structure, not accent — they're fine.
The one tolerated colored side border is an active-state indicator inside a
nav list; prefer background/weight there too. Existing violations are cleaned
up whenever the component is next touched. (Decided 2026-06-10, prompted by
atlas's kind-colored identity-card rule — removed same day across collagen.)

### Typography

#### Three-role type system

Every tool uses exactly three typeface roles:

| Role | Use | Canonical choice |
|------|-----|-----------------|
| Sans | All UI labels, body, navigation, tables | Geist, falling back to Inter, then system-ui |
| Serif | Branding, section headers in artifacts, display | Instrument Serif, falling back to Georgia |
| Mono | Numbers in tables, IDs, code, technical values, axis labels | Geist Mono, falling back to JetBrains Mono |

Sans is the workhorse. Serif appears sparingly — primarily for the tool's name/brand in the header, and in artifact-mode prose headings. Mono is for data that benefits from alignment.

Never use more than these three roles in a single tool.

#### Font loading

Load Geist and Instrument Serif from Google Fonts or Fontsource. Load Geist Mono for monospace needs. Use the system-ui fallback stack so the page is usable before fonts load. Never block render on font loading.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif:ital@1&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

#### Type scale

Six steps is enough for data tools. Establish the scale in tokens and use only those sizes:

| Token | Typical use | Approx size |
|-------|-------------|-------------|
| `--text-xs` | Axis labels, badge text, captions | 10–11px |
| `--text-sm` | Table body, metadata, nav items | 12–13px |
| `--text-base` | Default body, filter controls | 14px |
| `--text-md` | Section intros, detail text | 15–16px |
| `--text-lg` | Page headings, panel titles | 18–22px |
| `--text-xl` | Tool brand name | 24–28px |

For artifact-mode prose (barnowl summary, weaver published output), use 16px base with 1.65 line height and 65–75 character line length. For instrument-mode dense data tables, 13–14px with 1.4 line height.

#### Numbers in tables

Always use `font-variant-numeric: tabular-nums` on number cells. This prevents column widths from shifting as values change and makes scanning easier. Combine with `text-align: right` for right-side alignment in columns.

#### Uppercase labels

Uppercase + letter-spacing is used for one thing: column headers, section category labels, and other low-hierarchy metadata that should not compete visually with content. Limit to 11–12px, 0.5–0.8px letter-spacing, `--text-muted` color. Do not use uppercase for navigation items or interactive elements.

#### Interface copy earns space

Every visible label must add information the adjacent type, position, or content
does not already carry. A kicker such as “Project briefing · authored intent +
derived state” above an unmistakable project briefing spends attention to
restate the component. Keep “Project briefing” only when it orients the user;
move claim authority to the exact authored or derived fact that needs it.

This is an information-furniture budget, not a ban on guidance. Keep copy that
explains eligibility, uncertainty, consequence, an unfamiliar control, or what
fills an empty state. Delete copy that merely names the layout, repeats the
heading, narrates an obvious button, or adds a fashionable-sounding fragment.
When in doubt, remove it and test whether the task loses meaning.

---

### Spacing and density

#### 4px base grid

All spacing values are multiples of 4. Common stops: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Gap between most components: 16px. Gap within a component: 8px. Internal padding of cells/chips: 4–6px.

#### Density defaults

Instrument-mode tools should default to "compact" density. This means:
- Table row height: 32–34px
- List item padding: 6px vertical
- Sidebar nav item height: 28–30px

Artifact-mode tools can use "comfortable" density:
- Paragraph blocks: 16px margin-bottom
- Card padding: 16–20px
- Content max-width: 680px for reading (65–75 chars)

#### Content width

Data tables and sidebars: no max-width, fill available space. Article/prose content: max-width 680–720px. Overall page container: max-width 1200–1400px with `margin: 0 auto`.

---

## Components

### Layout

#### Shell

The standard shell for instrument-mode tools is a **three-column grid**:

```
[sidebar 220px] [main content 1fr] [inspector 360px, conditional]
```

With a fixed header bar (48px) spanning the top. This matches keel and is the right shape for a research tool with navigation, a list/feed view, and a detail panel.

For simpler tools (barnowl, steve), a **two-column layout** works: `[filter sidebar 240–280px] [results 1fr]`.

Weaver single-page artifacts: no sidebar, single centered column with max-width, full-bleed chart areas.

#### Sidebar

Use a 220–280px left sidebar for:
- Primary navigation between major sections
- Filter controls for a list view

Never use the sidebar for both navigation and filters simultaneously — they compete. When a tool has both, navigation belongs in a fixed left sidebar; filters belong in a toolbar above the results, or in a collapsible filter panel.

#### Inspector / detail panel

A 320–400px right panel (conditionally visible) for entity details. Opening an entity should never navigate away from the list — it should open in the inspector, preserving list position and scroll state. This is the most common design failure in data tools: detail views that destroy the user's list context.

Exception: for article/document reading (barnowl article view), full-width is appropriate. Use a split view pattern: list on left, reader on right.

---

### Navigation

#### Header

- Dark background matching `--bg` or slightly raised (`--surface`)
- Tool name left-aligned, using `--font-serif` italic or semibold sans
- Navigation links in the header or just below it, not in a sidebar (for simple tools)
- Height: 48px
- Bottom border: 1px solid `--border`

#### Nav link states

- Default: `--text-muted`
- Hover: `--text`
- Active: `--accent` with 2px bottom border or left border in sidebar nav

#### Breadcrumbs

Use breadcrumbs for detail pages that are 2+ levels deep. Format: `Section › Entity Name`. Muted text, separators in `--text-dim`. Never use `>` as separator — use a proper separator like `›` (U+203A) or `/`.

---

### Data tables

Tables are the most important component in this tool family. They appear in barnowl, keel, tern, steve, jay. Apply these rules consistently:

```css
table { width: 100%; border-collapse: collapse; }
th { 
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--text-muted); padding: 8px 12px; 
  border-bottom: 1px solid var(--border); font-weight: 500;
  text-align: left;
}
td { 
  padding: 8px 12px; border-bottom: 1px solid var(--border-subtle);
  font-size: 13px;
}
tbody tr:hover { background: var(--surface-raised); }
```

- Right-align numeric columns, left-align text columns
- Truncate long text with `text-overflow: ellipsis` and a tooltip on hover
- Use monospace for IDs, scores, percentages
- Put status indicators (badges, pills) in their own right-side columns
- For tables that may exceed 200 rows, use virtual scrolling

---

### Stat cards

Used throughout (barnowl overview, keel dashboard, tern geography panel). Consistent pattern:

```html
<div class="stat-card">
  <div class="stat-value">9,592</div>
  <div class="stat-label">total claims</div>
</div>
```

- Background: `--surface-raised`
- Border: 1px `--border-subtle`
- Border radius: 6px
- Padding: 12–16px
- Value: 20–24px, semibold, monospace, `--text`
- Label: 11px, uppercase, `--text-muted`
- Grid layout: `repeat(auto-fill, minmax(140px, 1fr))`, 8px gap

The only exception to monospace for the value: if the number is presentational/approximate (e.g., "12 beats"), use sans-serif.

---

### Status badges / pills

For status, lifecycle, category, and boolean states. Two visual forms:

**Filled pill** (strong signal — use for primary status like verified/draft/active):
```css
.badge {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 9999px;
  font-size: 11px; font-weight: 500;
  border: 1px solid currentColor;
}
.badge.success { color: var(--success); background: var(--success-subtle); }
.badge.warning { color: var(--warning); background: var(--warning-subtle); }
.badge.error   { color: var(--error);   background: var(--error-subtle);   }
```

**Outline chip** (weak signal — use for secondary metadata like media type, beat, tag):
Same structure but with `background: transparent` and lighter border.

Never use filled colored badges for more than 5–6 distinct values. Beyond that, use outline chips with text — the color stops being meaningful.

---

### Score badges

For continuous range values displayed as bucketed states (established in steve, widely useful):

```css
.score { display: inline-block; min-width: 42px; padding: 2px 6px; border-radius: 3px; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; text-align: center; }
.score.hi  { background: var(--success-subtle); color: var(--success); }
.score.mid { background: var(--warning-subtle); color: var(--warning); }
.score.lo  { background: var(--error-subtle);   color: var(--error);   }
.score.na  { background: var(--surface-raised); color: var(--text-muted); }
```

Document the threshold values explicitly in the tool. A score badge has no meaning without knowing what 0.70 means in context.

---

### Filter bar

For list views with multiple filter dimensions. Two layouts:

**Sidebar filter** (keel, steve): 240–280px left panel with labeled inputs. Best when there are 5+ filter dimensions or when filter state is complex. Pairs well with HTMX (server-side) or TanStack Query (client-side).

**Toolbar filter** (barnowl, tern): Horizontal row above results with inline inputs. Best when there are 2–4 filters and screen width is at a premium. Use `display: flex; gap: 8px; flex-wrap: wrap`.

In both cases: debounce text inputs (300–400ms). Represent active filters as dismissible chips. Provide a "clear all" link. Preserve filter state in URL query params.

### Decision workspaces

Bounded queues and review rails need a composed task-level pattern, not merely a
shell populated with generic cards. Use the shared `decision-*` family:

1. `decision-header` names the task and carries the view switch;
2. `decision-layout` separates contract/refinement from the result set;
3. `decision-brief` explains eligibility and operator authority;
4. `decision-list-header` exposes readiness, count, and ranking policy;
5. `decision-card` separates rank, evidence, rationale, and the primary action;
6. `decision-rationale` makes the system's reason and confidence scannable.

This is hierarchy for task speed, not decoration. Use flat semantic surfaces,
neutral rules, instrument typography, and existing score/status components. Do
not add gradients, card shadows, decorative status colors, or prose serif to make
the composition feel designed. Product CSS owns domain details; the shared
family owns the reusable task anatomy.

When the operator must choose among records instead of processing all of them in
order, use the familiar **action inbox** form: a persistent filter column and a
main list whose records expand independently in place. The collapsed row carries
the actual decision or work text plus project, recency, and queue reason; the
expanded foreground carries evidence and verbs. A sequential card deck is only
appropriate when order itself is contractual.

### Typed record lists

A project overview or operational history often mixes decisions, PRs, todos,
blockers, observations, and outcomes. These objects may share alignment and
density, but they do not share a sufficient representation. Use the shared
`record-*` family for the visual frame, then render the facts and verbs required
by the object's type:

- decisions show the question, why human authority is needed, options or gated
  work, and the path to decide;
- PRs show repository/number, draft or readiness state, checks, mergeability,
  scope, and the review destination;
- todos show work state, owner/assignee, age, linked blockers or PR, and the path
  to inspect or steer the work;
- blockers show what is blocked, why, age, and the unblock/escalation path;
- observations show evidence, source, and time; they do not receive a fake
  primary action merely to make the row symmetrical;
- outcomes show the intended change, criteria/progress, and linked work.

Do not reduce these differences to a badge on one generic title/excerpt card.
The item kind determines content hierarchy and action authority. Shared CSS owns
alignment, measure, disclosure, and action-rail placement; the product owns the
domain facts.

### Journey briefings

A project, mission, initiative, or portfolio slice is not necessarily an
inventory page. When the user's task is to understand whether intent is becoming
an outcome, use the shared `journey-*` composition:

1. durable intent and the current strategic assessment;
2. sequenced authored outcomes or chapters;
3. the current chapter's question and graduation evidence;
4. only the bounded residue that requires human authority;
5. machine settlement, reconciliation, and linkage work;
6. recent evidence that changed confidence or consequence; and
7. a collapsed route to complete inventory.

The sequence is the meaning. A row of status counts above decisions, PRs, todos,
and observations is still a database projection. Typed records can support a
journey briefing one level down, but they do not define its top-level anatomy.

Separate claim authority explicitly:

- **authored** intent comes from the canonical vision, roadmap, or outcome;
- **derived** state comes from current source facts and must carry freshness;
- **proposed** associations are suggestions until accepted or encoded at the
  source; and
- **missing proof** stays missing. Do not turn absence of evidence into a fake
  completion percentage.

Movement should describe a meaningful scope, uncertainty, or proof obligation,
not raw task throughput. A journey can be “moving” because a hard uncertainty
was resolved while still failing graduation. It can be “off contract” because
the system is producing human debt even while many tasks close.

---

### Command palette

Required for instrument-mode tools with more than 8 navigable sections or 10+ actions. Trigger: `Cmd/Ctrl + K`.

Use `cmdk` (React) or implement a lightweight equivalent. Key requirements:
- Fuzzy search across all commands and entities
- Keyboard navigation (arrows, Enter, Escape)
- Groups with headers (Navigate, Create, Recent)
- Inline keyboard hint for frequently-used commands (teaches direct shortcuts)

The command palette becomes the tool's memory — users who start slow learn through it; expert users bypass it via shortcuts. Design it to serve both.

---

### Timeline

For chronological data (barnowl scouting view, weaver historical data). The vertical timeline pattern:

```html
<div class="timeline-year">
  <div class="timeline-year-label">2026</div>
  <ul class="timeline-items"><!-- items --></ul>
</div>
```

```css
.timeline-year { border-left: 2px solid var(--accent); padding-left: 16px; margin-bottom: 24px; }
.timeline-year-label { font-size: 20px; font-weight: 400; color: var(--text-muted); margin-bottom: 8px; }
```

Left-border spine with accent color. Year labels at large size (20–24px), muted weight — they are navigation anchors, not headings. Items below each year: standard list rendering.

---

## Interaction

### Keyboard-first

Every action reachable from the keyboard before it's reachable from the mouse. Priority order:
1. Global keyboard shortcuts for the 5–8 most common actions
2. Arrow-key navigation within lists, tables, results
3. Command palette for everything else
4. Mouse/click as the fallback, not the primary path

Document keyboard shortcuts in a `?` overlay (standard convention) and inline in the command palette.

### URL as state

Filter state, selected entity, current section, and panel visibility belong in the URL. This enables:
- Browser back/forward to work correctly
- Sharing a specific view with a colleague
- Bookmarking a working state
- HTMX partial reloads that don't lose context

Use query params for filter state (`?q=climate&status=verified`), path segments for entity IDs (`/claims/abc123`), hash for section within a page (`#sources`).

Exception: panel sizes (resizable) belong in `localStorage`, not the URL.

### Progressive disclosure

Show the minimal viable information by default. Reveal details progressively:

1. **Hover to reveal**: Secondary actions, brief metadata (tooltip)
2. **Inline expand**: Slightly more detail without losing context (expand row, expand card)
3. **Detail panel**: Full entity view (inspector panel, right sidebar)
4. **Full page**: Only for content that genuinely needs it (article reading view, edit forms)

Never open a modal for information the user will want to read while also seeing the list behind it. Use a panel instead.

### Live updates

For tools with background processing (barnowl's ingestion pipeline, keel's thread creation):
- Use `data-live="key"` attributes on elements that should update when the key changes
- Poll a lightweight pulse endpoint every 30–60 seconds only when the visible
  region genuinely needs it; update that keyed region, never the whole document
- Flash updated values with a brief color transition (200ms, accent color, then fade back)
- Show a subtle activity indicator in the header (dot pulse, not a full loading spinner)
- Never schedule `location.reload()` or a refresh meta tag on an operator page.
  Whole-page polling steals scroll, focus, disclosure state, and typed input.

### Human time and work references

Time is decision context, not database decoration. Use one shared timezone-aware
formatter. Near events get useful precision (`just now`, `18 min ago`, `today
3:42 PM`); older events get a readable date and time. A relative value carries
its absolute timestamp in a native `<time>` element or adjacent disclosure. `0d`,
raw ISO slices, unexplained UTC, and date-only source activity are failures when
time affects freshness or action.

Machine identifiers remain canonical under the hood, but operational work gets a
human reference such as `FAB-63`. One project shares one sequence across ideas,
decisions, todos, and their lifecycle; descendants may use a beads-style suffix
(`FAB-63.1`). Use a concise collision-aware project prefix, with an editorial
override when the generated acronym is unclear. Do not present a chopped ULID as
a user-facing identifier.

### Optimistic updates

When a user takes an action (change status, create entity, archive), update the UI immediately. Sync to server in background. If the server rejects, revert with a toast notification. Do not wait for server confirmation before updating the UI — this is the most important interaction quality difference between good and mediocre data tools.

---

## Visualization

### Form selection

Before choosing a chart type, state explicitly:
- What comparison does this enable?
- Could a table serve this better?

A table is always valid. A chart is justified when it enables a comparison a table can't (distribution shape, flow, proportion). An absent chart is valid — "this data doesn't have a chart form" is an acceptable conclusion.

Quick guides:
- **Flow across categories** → Sankey diagram
- **Part of whole** → Stacked bar or horizontal bar (not pie)
- **Distribution** → Histogram, not scatter unless two-dimensional
- **Over time** → Line chart (connected) or bar chart (discrete periods)
- **Two continuous variables** → Scatterplot (with jitter for overlapping points)
- **Comparison across many entities** → Sorted horizontal bar

### Reading guides

Every novel chart type (first time used in a tool, non-standard form) gets a reading guide directly above it. A reading guide names the reading strategy: what axis means what, what color means what, how to interpret a specific encoding. Do not assume readers know how to read a sankey or a heatmap.

The reading guide is distinct from a caption. A caption says what happened. A reading guide says how to read the chart.

### Tooltips

- Fixed position (`position: fixed`, z-index 100)
- Appear on `mousemove`, disappear on `mouseleave`
- Max-width 380px, constrained to viewport: `Math.min(window.innerWidth - 400, event.clientX + 14)`
- Opacity transition 120ms
- Never block interaction with the chart while visible

Tooltips are decoration. They add detail but the chart must be readable without them. Never put primary data exclusively in tooltips.

### Click-to-isolate (Sankey and networks)

A click on a node should highlight its upstream and downstream connections, dimming everything else to 4–20% opacity. Click the same node again (or click the SVG background) to reset. This pattern (from weaver's sankey.js) is reusable for any flow diagram.

Update percentage labels when isolation is active — show the share of isolated flow, not total flow.

### Contrast on colored backgrounds

Use the WCAG relative luminance formula to pick text color on colored backgrounds automatically. The threshold is luminance > 0.55 → dark text; < 0.55 → light text. This is implemented in `weaver/lib/contrast.js` and should be the canonical implementation referenced across all tools.

### Jitter for overlapping points

When showing points that may overlap (scatterplot with binned data), use deterministic hash-based jitter rather than random jitter. Same input → same position on every render, so tooltips and animation are stable. Pattern from `weaver/viz/horizons/main.js`.

### Color accessibility

- Never use red/green as the only differentiator
- Prefer the indigo/cyan/purple/amber/emerald/gray palette (distinguishable in common colorblindness modes)
- Test charts in grayscale as part of the pre-ship checklist
- Limit unique colors in a single chart to 6–8 maximum

---

## Architecture

### Three valid architecture patterns

There is no single right answer. Choose based on team, deployment, and use case.

#### 1. React + TypeScript + Vite + Tailwind (reference: keel)

**Use when:** The tool has complex interactive state (command palette, multi-panel layout, inline editing, real-time updates), the team knows React, or the tool needs to be maintained and extended over time.

**Stack:** React 19 + TypeScript + Vite + Tailwind v4 + TanStack (Table, Router, Query, Virtual) + Radix Primitives + cmdk.

**State:** React Query for server state, useState/useReducer for local UI state. No Redux or Zustand needed for most tools at this scale.

**CSS:** Tailwind for utilities, CVA for component variants, CSS custom properties for the token layer. Define tokens in `@theme {}` for Tailwind v4.

**When to avoid:** When you need to embed the tool in a server-rendered page, when JavaScript bundle size matters, or when the tool is primarily a data display rather than an interactive application.

#### 2. Vanilla JS + CSS Custom Properties (reference: barnowl, tern)

**Use when:** The tool is primarily a read-only dashboard, the team doesn't need a React build pipeline, deployment is a static file server, or the tool needs to be fast and simple.

**Stack:** Plain HTML, CSS custom properties (tokens.css), vanilla fetch for data, vanilla DOM for updates. No build step required.

**Data fetching:** fetch + async/await, debounced inputs, optional HTMX for form-driven partial updates.

**When to avoid:** When the tool has complex interactive state (multi-step forms, drag-and-drop, command palette), when you need component reuse across many views, or when type safety on the data model matters.

#### 3. Server-rendered + HTMX (reference: steve)

**Use when:** The tool is a Python or other backend-primary project, the team is more comfortable in server-side code, or you want zero JavaScript build tooling.

**Stack:** Python (FastAPI or Flask) + Jinja2 templates + HTMX for progressive enhancement + D3 for visualization only.

**State:** URL params, server-side session. HTMX handles partial page swaps for filters and updates.

**When to avoid:** When real-time updates are critical, when the team is primarily frontend, or when the tool needs to work offline.

---

### File organization (all patterns)

Regardless of architecture, follow this shape:

```
/ui (or /src)
  tokens.css          — design system tokens (copy from des/tokens.css)
  components.css      — shared component styles (copy from des/components.css)
  index.css           — tool-specific overrides only
  index.html          — entry point
  /sections (vanilla) or /components (React) or /templates (Jinja2)
```

Never duplicate token definitions across files. There is one source of truth for colors: `tokens.css`. Import it first.

---

### When to use D3 vs other chart approaches

D3 is the right choice for custom, interactive visualizations (sankey, scatterplot with jitter, heatmap, geographic map). It is not the right choice for standard charts (bar, line, pie) where a lighter library or even CSS suffices.

For standard charts in barnowl/tern style tools: use CSS + SVG for bars (simpler, faster), or a lightweight wrapper like `recharts` in React contexts. Reserve D3 for charts where the data-to-visual mapping is genuinely non-standard.

---

## Process

### Adopting the design system in a new tool

1. Copy `tokens.css` to your project's static/css directory. Do not modify it — only override in your local `index.css`.
2. Copy `components.css` for the shared component primitives (stat cards, badges, tables, nav).
3. Add the font imports (Google Fonts: Geist, Instrument Serif, Geist Mono).
4. Verify the token names render correctly by opening `showcase.html` with your local token overrides.
5. Pick your architecture pattern (React / Vanilla / HTMX) based on the guidelines above.

### Reskinning an existing tool

1. Replace the existing `:root` variables with the canonical token values from `tokens.css`.
2. Audit which local variable names don't match (e.g., steve uses `--fg` instead of `--text` — map these in a compatibility shim at the top of the tool's CSS).
3. Replace font stacks with the canonical trio.
4. Update component patterns one at a time: start with the most visible (header/nav), then tables, then badges.
5. Do not try to do a full reskin in one pass — component by component is more reliable.

### Compatibility shim for steve's token names

Steve uses a different naming convention from keel/barnowl. Until steve is fully migrated, use this compatibility map:

```css
/* steve ↔ design system compatibility */
:root {
  --fg:           var(--text);        /* steve → system */
  --fg-soft:      var(--text-muted);
  --muted:        var(--text-dim);
  --panel:        var(--surface);
  --border-strong: var(--border);
}
```

### Using Codex for design variants

When exploring visual directions for a new tool or redesign:

1. Follow `PRACTICE.md` and capture the current task before generating alternatives.
2. Start with `showcase.html` and the nearest product kit as references.
3. Define one named axis per variant: composition, density, type register, or interaction model. A token-only variant is appropriate only when the underlying flow is already sound.
4. Give the agent the just-in-time design plan, including the existing system to preserve, the mechanism borrowed, and the proof required.
5. Evaluate side-swapped renders against `RUBRIC.md`, task completion, readability at density, and keyboard interaction.
6. Record the winner, requested and served model when known, and the criteria used in the design receipt.

The lowest unresolved layer determines repair order, not the finish line. After
a model or flow repair, rerun the seeing and perceptual-hierarchy gates on the
new surface. Token compliance is necessary but not sufficient: a page can use
every correct primitive and still fail to express task entry, grouping, evidence,
and action.

Do not ask for a generically "premium" or "modern" result. Visual references and
falsifiable constraints carry more signal. A capable model is useful only when it
also inspects and refines the rendered result.

### Pre-ship checklist (visual quality)

Before shipping any tool's UI:
- [ ] Token file is the sole source of color values (no hardcoded hex outside tokens.css)
- [ ] Theme toggle works (dark ↔ light) without visible flicker
- [ ] Table row hover state is visible but not jarring
- [ ] Status colors pass WCAG AA contrast (4.5:1 for small text)
- [ ] Charts pass grayscale check (no information lost when desaturated)
- [ ] All interactive elements have keyboard focus states (`outline: 2px solid var(--accent)`)
- [ ] Mobile layout tested at 375px width — sidebar collapses, tables scroll horizontally
- [ ] Filter state is preserved in URL query params
- [ ] Loading states exist for all async data fetches
- [ ] At thumbnail size, task entry, the decision set, evidence, and primary action remain locatable
- [ ] The screen uses a named composed pattern or records a component gap; it is not only generic primitives
- [ ] An independent seeing pass or explicit human acceptance owns visual promotion; otherwise the verdict is `candidate`
- [ ] New product-local CSS is classified `specific`, `candidate-system`, or `system`; reusable task composition is promoted upstream

---

## Token quick-reference

See `tokens.css` for the complete list. The most frequently used:

| Token | Dark value | Light value | Use |
|-------|-----------|-------------|-----|
| `--bg` | `#09090b` | `#fafaf7` | Page background |
| `--surface` | `#111113` | `#ffffff` | Card, panel background |
| `--surface-raised` | `#18181b` | `#f4f4f1` | Hover, elevated state |
| `--border` | `#1e1e24` | `#e4e4e0` | Main borders |
| `--border-subtle` | `#161619` | `#edede9` | Subtle separators |
| `--text` | `#e4e4e8` | `#1a1a1a` | Primary text |
| `--text-muted` | `#a1a1aa` | `#6d6d6d` | Secondary text (AA vs all surfaces) |
| `--text-dim` | `#85858e` | `#444444` | Tertiary / metadata (AA vs all surfaces) |
| `--accent` | `#6366f1` | `#1a4480` | Links, actions, data |
| `--success` | `#22c55e` | `#2b6a3c` | Verified, positive |
| `--warning` | `#eab308` | `#a04a00` | Pending, caution |
| `--error` | `#ef4444` | `#8a1f2a` | Failed, destructive |

---

*These principles are a living document. When you build something that doesn't fit — and you can articulate why the principle is wrong for your context — update the document. The goal is a record of real decisions, not an unchanging spec.*
