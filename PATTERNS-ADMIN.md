# Admin & Operator Surface Patterns

Operational patterns for instruments that ask a human to decide things —
work queues, review rails, run boards, triage lanes. `PRINCIPLES.md` covers
the visual system; this covers what a decision surface owes its operator.
Sources: the 2026-07 research set in `george/docs/research/`
(`agent-admin-ux`, `admin-craft-fundamentals`, `admin-audit`) and the
operator review of 2026-07-07.

The one-line law: **flow is a feature.** Every violation below breaks the
operator's flow at exactly the moment they are trying to act.

## The zeroth question: should this queue exist at this size?

Before designing any queue's presentation, interrogate its existence.
A queue whose count is far beyond what its audience can work is not a
presentation problem — it is a system failure upstream (capture with no
settlement, machine-minted items granted human-queue status, no dedup,
no aging policy). The tell is the settlement ratio: a healthy system
settles most items itself and hands the human a residue. "555 undecided,
3 settled by the system" means the *system* is broken, and no hand-dealt
UI, ranking, or honest count line fixes that — it decorates it. Ask
first: what should have settled these, and why didn't it? (Learned
2026-07-07: 447 of 564 "ideas" were reflect-minted write-only froth,
never referenced by anything; 18 came from a human.)

## The four questions (task reasoning — read this before any rule below)

At every screen, the operator silently asks: **what is this? why am I
seeing it? what do I do? what happens next?** A surface that leaves any of
the four unanswered is broken regardless of how many rules below it
passes. The 2026-07-07 operator walkthrough
(`george/docs/research/operator-walkthrough-2026-07-07.md`) is fifteen
examples of craft-compliant screens failing these questions. Corollaries:

- **Referents resolve.** A bare ULID/ID is machine food. Anywhere an entry
  references another, render a human work reference (`FAB-63`), the referent's
  identifying text, and a link. The full machine key can remain in storage and
  form values; a chopped ULID is not an acceptable display name. If the system
  knows, the operator shouldn't have to.
- **An object's page carries its verbs.** The page for a gate can resolve
  it; a todo's page can shape/obviate it; a run's page links its PR with
  its state. A detail page with no actions is a dead end.
- **Queue items are actionable by their audience.** If the system can act
  (or already has — merged PR, obviated todo), the item never reaches the
  human queue. "Nothing for me to do here" discovered *after* reading is a
  system lie. This is an **authority test, not a mechanics test**: the
  question is not "is this undecided?" but "does deciding it require
  human values?" — spend, irreversibility, public exposure, cross-project
  priority, a claim on the operator's time, or an explicitly reserved
  taste call. Routine engineering triage (promote/dismiss a deslop
  candidate, a perf tweak, a refactor idea) is system food: decide,
  act within the autonomy ceiling, and *narrate* it in the digest —
  reversible and visible — instead of asking. A human queue where the
  operator's honest reaction is "the system could decide all of these"
  is the 2026-07-07 lesson applied twice.
- **Machine drafts, human edits.** Never hand the operator a blank
  textarea for work an agent can draft (criteria, scope, triage
  rationale). The operator's verbs are approve / edit / redirect.
- **Lists carry judgment.** Any list longer than a screenful arrives
  ranked, with staleness and likely-obviated flags. "101 items, you
  figure it out" outsources the system's job to the human.
- **Links state their destination.** "PR #35 — merged", "packet (same
  text, rendered)", not three unlabeled links that may or may not be the
  same object.

## Page-entry diagnostic, not one generic header

When an operator cannot orient to a route's first task region, diagnose four
possible missing facts:

1. **Scope:** the object, queue, time window, environment, or policy being
   inspected.
2. **Operator task:** the judgment, monitoring question, or configuration
   responsibility this route supports.
3. **Current state and proof:** the smallest state summary that changes what the
   operator should do, with freshness or evidence where state can drift.
4. **Next move and consequence:** the primary route into work, including what a
   successful action changes and where recovery lives.

This is a situational checklist, not a universal acceptance contract and not a
`PageHeader` component. A familiar or deliberately terse expert workflow may
answer the four questions through its local composition without restating all
four facts at the top. Unlike tasks must remain visibly unlike:

| Surface archetype | Entry emphasis | Named DES pattern or rule |
|---|---|---|
| Orientation / strategic overview | authored intent, evidence-backed assessment, movement, bounded attention | `journey-*` briefing |
| Attention / bounded decisions | eligibility, result count, ranking or aging, independent selection, settlement consequence | `decision-*` workspace or `action-inbox` |
| Operations / run monitoring | live versus settled state, evidence freshness, error or blocker, recovery path | `record-*` renderers plus **Live activity & logs**; keep lifecycle boards local |
| Configuration / policy | current value, effective scope, validation, consequence, safe apply and revert | compose system controls locally until a repeated settings family is proven |

A shell breadcrumb plus `h1` and a descriptive sentence does not repair a real
orientation failure. Neither does copying the same hero, stat row, or card grid
onto every route. Products may distribute relevant facts across a journey
header, queue contract, state band, inspector, or persistent apply rail. Absence
of one checklist item is not itself a failure when the representative task and
consequence remain clear.

The July 2026 George admin-family audit found entry failures on several routes
spanning attention, operations, and configuration. That evidence supports a
shared diagnostic vocabulary. It does **not** establish that every route needs
the same entry contract, nor that the existing `journey-*`, `decision-*`,
`action-inbox`, and `record-*` families are functionally complete. Board lanes
and configuration transactions still carry product-specific state and verbs.

## Component readiness is an evidence ladder

A selector, React signature, static specimen, or screenshot proves availability,
not a working component. Record the highest level actually demonstrated:

1. **Documented** — anatomy, intended task, states, and boundaries are written.
2. **Visually demonstrated** — a representative specimen renders across themes
   and supported widths with real content shape.
3. **Behaviorally complete** — the reference can perform the named task through
   entry, action, loading, success, empty, error, and recovery states. Actions
   produce visible consequences; reversible actions expose undo; selection,
   focus, filters, open state, and drafts persist where the contract requires.
4. **Production-proven** — a consuming product completes the same task with
   production-shaped data and reachable edge states, with functional and visual
   receipts tied to a revision.

Do not say a family “covers,” “solves,” or is ready to “adopt” for a workflow
above its demonstrated level. CSS-only families are not behaviorally complete.
Product-local behavior does not automatically prove the shared reference. A
renderer such as `record-*` may intentionally stop at visual representation; in
that case call it a renderer, not a workflow component.

When an existing family has the right anatomy but is below the needed readiness
level, finish and prove it before inventing a parallel family. For decision
work, this includes real selection/open behavior, authority and consequence,
resolution, post-action state, error/recovery, undo where safe, and continuity
after refresh. A decision card whose buttons do not complete a decision is not a
functional decision component.

## Built for an expert operator (density & speed)

These are instruments for a trained daily operator, not consumer surfaces.
Most "anti-slop" aesthetic advice (whitespace as virtue, restraint,
"delight") is calibrated for marketing pages and does not apply here —
adopt anti-slop *mechanisms* (token discipline, negative constraints),
reject its *aesthetics*. What applies instead:

- **Optimize value-per-pixel.** Density lives *inside* the table — tabular
  numerals (`tnum`), tight rows, hover-reveal row actions — while page
  chrome (margins, section headers, filter bars) stays generous. Dense
  content in a composed frame reads as an instrument; dense chrome reads
  as noise.
- **Hierarchy via type scale, weight, and color — not whitespace alone.**
  When everything is airy, nothing is scannable.
- **Latency is a design property.** Interactions feel direct under
  ~100ms; over ~200ms an action endpoint is a bug, not a fact of life.
  Prefer instant + undo over spinner + confirm.
- **The success metric is operator task speed**, measured by walking real
  tasks — never "does it look designed."
- Style anchor when taste is needed: the data-dense professional family
  (ClickHouse, PostHog, Linear, Stripe dashboards) — steal that vibe, not
  a landing page's.

## Decision surfaces

A view that asks for a choice (approve/reject, bet/dismiss, pick-one) must
pass all five:

1. **The card shows decision context, never a raw dump and never a
   truncated tease.** Decision context means: what happened, why it
   matters, and what each action will do — written for a human, a
   paragraph at most. Human-authored deciding text (a pitch, a blocker
   reason) appears in full or one keypress away — never "…" with no way
   to see more before an irreversible action. Machine artifacts (prompts,
   logs, diffs, JSON payloads) are *evidence*, not deciding text: link
   them one click away; pouring them into the card body is the same crime
   as truncation, committed in the other direction (see
   `crimes/2026-07-07-hand-prompt-dump.png`).
2. **The logical default is the easy path.** One visually primary action
   per card (solid button); it is the keyboard default (Enter). Everything
   else renders ghost/outline. Decoration budget: ≤2 solid buttons, ≤2
   accent colors per card — spend the freed weight on the decision text.
3. **Everything needed to decide is on or one tap from the card**: the why
   (source/lineage), the what (full text/diff stat), the consequences
   (what happens on each action). If deciding requires opening three other
   pages, the card is not done.
4. **Offer the real trust levels, not a binary.** Run completion is
   "merge / open for review / inspect locally", not approve-or-reject.
   Classify actions: auto-apply (safe, reversible) / notify / block
   (irreversible — explicit approval). Prefer act-now + toast-undo over
   confirm modals for reversible actions; reserve confirmation for the
   genuinely irreversible.
5. **Independent decisions remain independently selectable.** Default to an
   inbox where the operator can scan and open any record; do not turn visual
   order into a compulsory workflow. When a queue has a contractual sequence,
   say so and then offer single-key actions and auto-advance. Split or filter by
   decision type (go/no-go vs informational vs conflict-resolution) instead of
   interleaving unlike decisions without a selection path.

## Decision-workspace anatomy

Correct queue semantics can still render as an undifferentiated admin page. A
bounded decision surface uses five perceptible regions:

1. **Task entry:** one title, one-sentence scope, and the switch to adjacent
   views. It should remain identifiable at thumbnail size.
2. **Contract:** why items qualify, what judgment belongs to the human, and what
   settlement removes the item.
3. **Result policy:** current count, readiness, and ranking/aging rule.
4. **Decision item:** rank, identity, deciding evidence, rationale/confidence,
   and secondary provenance.
5. **Action rail:** one visually primary verb and its consequence, separated
   from evidence by placement and a neutral rule.

Des provides these as `decision-header`, `segmented-nav`, `decision-layout`,
`decision-brief`, `decision-list-header`, `decision-card`, and
`decision-rationale`. These classes are a task skeleton, not a skin: product CSS
may add domain metadata but should not rebuild the composition or violate the
system's flat-surface, status-color, and instrument-type rules.

The Magpie queue calibration is the failure fixture: the first variant passed
the model and flow gates but looked under-styled; the repair improved hierarchy
while drifting outside system rules. Promote the anatomy and hierarchy, not the
incidental gradients, shadows, or prose typography.

## Typed objects need typed representations

An overview may legitimately place unlike records next to each other. That does
not make them interchangeable. Audit each visible kind against the operator's
actual question, not against a generic card template:

| Object | Required deciding or reading context | Required path |
|---|---|---|
| Decision/gate | question, why human authority is needed, options or gated work | decide/resolve, with consequence |
| PR | repo and number, draft/readiness, checks, mergeability, size | open the PR or owning review queue; merge only when authorized |
| Todo | full task, state, owner/assignee, age, linked blocker/PR | inspect, shape, redirect, or obviate as allowed |
| Blocker | full reason, blocked referent, age, settlement signal | unblock, escalate, or queue the needed decision |
| Observation | evidence, source, time, linked referent | inspect source/detail; no invented primary action |
| Outcome | intended change, criteria/progress, linked work | inspect or update the outcome |

Use the shared `record-*` classes to align these objects without erasing their
differences. A single strong title plus a kind badge and the same metadata row is
not a typed representation.

**Shortening must be a disclosure, not punctuation.** A bold/strong fragment
followed by `…` with no `details`, inspector, tooltip, or explicit detail link is
a failed representation. Do not emit an ellipsis merely because a helper hit a
character cap. Either show the deciding text in full, make the whole row's detail
destination obvious, or label a disclosure such as “Read full observation”. The
operator should never have to guess whether hidden text exists.

**Controls must read as controls before interaction.** Native inputs, selects,
textareas, summaries, and buttons need the system font, semantic surface,
border, radius, padding, focus indicator, disabled state, and a task-appropriate
size. Styling only the submit button does not make a form usable. An unstyled
white textarea in a dark instrument, a 20px-wide select, or a text-looking
`summary` that secretly opens a form fails the perceptual gate.

## Journey briefings: intent before inventory

Use a journey briefing when the operator's question is “where are we in the
strategy, what moved, and what needs me?” A project overview that leads with
decisions, PRs, todos, blockers, observations, or a remit list is organized
around storage, even when every object has a correct typed representation.

The composed `journey-*` family has seven perceptible regions:

1. **Intent and assessment** — canonical mission/north star plus one current,
   evidence-backed strategic condition.
2. **Journey map** — a bounded, authored sequence of outcomes or chapters. It is
   not an automatically generated list of statuses.
3. **Current focus** — the active outcome's unresolved question, graduation
   criteria, and supporting or missing proof.
4. **Attention residue** — only decisions requiring human values or authority,
   deduplicated by their underlying decision coordinate before counting.
5. **System work** — machine-owned settlement, reconciliation, duplicate
   collapse, likely obviation, and proposed linkage. This region narrates what
   the system is removing from human load.
6. **Movement and evidence** — changes since the previous update that alter
   confidence, consequence, or the next decision.
7. **Inventory disclosure** — grouped/searchable access to the complete source
   state, collapsed below the briefing.

Three authority labels are mandatory when claims could be confused: `authored`,
`derived`, and `proposed`. A proposed work-to-outcome association never renders
as a canonical edge. A completion percentage is forbidden when the underlying
question is uncertainty, proof, or outcome effect; show supported/partial/
missing criteria instead.

### Anticipatory backlog work

Large captured sets never appear as human debt by default. Before projection,
the product should apply the strongest safe operations it can support:

- remove settled external state;
- collapse records sharing a durable decision or work coordinate;
- separate narration/progress from decisions;
- group or merge likely duplicates;
- mark stale and likely-obviated work;
- propose outcome associations with visible reasoning; and
- preserve the raw set behind a grouped, searchable disclosure.

The system-work region reports this compression (“75 captured signals, 8
unsettled exceptions”), its policy, and the route to inspect exceptions. It must
not imply that recommendations were applied if they are only proposed.

### Strategic relationships at high cardinality

A remit, dependency set, or portfolio above twelve items must lead with the
relationships that matter to the current outcome. Group the rest by role,
health, consequence, or ownership and provide a graph/search route. A vertical
list of every related project is never a strategic briefing.

## Queue mechanics: bounded verbs, undo, rank

The mechanics behind rule 5, learned from the tools that do triage best
(Linear Triage, Superhuman, Gmail Priority Inbox):

- **Every queue has a closed verb set (≤5 dispositions), each on a single
  keystroke.** Accept / decline / merge-into / snooze — never a free-text
  status field where a verb belongs. A `?` overlay lists the keys. The
  queue holds only undecided items; deciding is instant and reversible.
- **Undo, not confirm.** Reversible dispositions execute immediately with
  a toast-undo window. Operators habituate through confirm modals; the
  modal tax is paid on every action to guard the rare one. Reserve
  confirmation for the genuinely irreversible.
- **Snooze is a first-class verb**: hide until a chosen time *or* new
  activity, whichever comes first. And the tail is bulk-clearable
  ("snooze everything untouched >30 days") so effort concentrates on
  what's live.
- **Ranking is the system's job.** Closed priority taxonomy (≤5 levels);
  unprioritized items sort *last*, never first; the operator's manual
  reorder persists; everything below the ranked set sits in a collapsed
  "everything else" fold. When the system suggests a priority/route, it
  shows its reasoning inline so the operator validates instead of
  re-deriving.
- **Staleness is visible on the queue itself** ("oldest undecided: 6
  days") — aging must be seen, not assumed away.
- **Queue intent is explicit.** `ready`, `claimed`, and `in progress` say
  the system intends to move the work; `needs input` is stopped for a named
  human answer; `blocked` is stopped on an external condition; `shaping` is
  not yet queued. Do not collapse these into one ambiguous “open” count.

## Action inboxes, not compulsory card decks

When records are independently actionable, the default desktop composition is
the familiar two-column inbox: persistent project/type/recency/search filters at
left, independently expandable rows at right. Selection must preserve list
position. The operator may pick the third record before the first; a visual deal
order is not a workflow contract.

The collapsed row answers “which thing is this?” with the actual task, question,
or decision text. Generic headlines such as “needs a decision — fab” fail even
when the full text appears after expansion. The expanded record carries the
queue reason, evidence, consequences, and actions. Keyboard next/previous is a
speed enhancement, never a mechanism that hides the rest of the list.

## Assertions carry actions

If a surface asserts a problem ("AT RISK: 6 blockers on a choke-point"),
it must attach the action path (open the blockers, park them, reassign).
A label with no verb is a dead end; either wire the verb or don't render
the alarm.

## The truncation policy (three display tiers)

- **Scannable list cell**: single-line ellipsis (`white-space: nowrap` +
  `overflow: hidden` + `text-overflow: ellipsis` — all three) with the full
  value reachable (peek, tooltip, or the row's detail view).
- **Full-value token** (ULID, branch, URL — anything the operator copies):
  mono, wrapped, selectable — `overflow-wrap: anywhere` (+ `min-width: 0`
  on flex/grid children or wrapping silently fails). Never ellipsize a
  value someone needs whole.
- **Prose**: wrap at 45–75ch (66 target; 80 hard cap), `--leading-normal`+.
  Never pour paragraphs into a narrow column because the grid happened to
  be there.

One shared truncation helper per codebase. Eleven independent `_short()`
implementations with eight different caps is how "unreadable" happens.

## Live activity & logs

- **Narrate by default, raw one click away.** The default run view is a
  plain-language chronological step list; raw JSON/terminal output lives in
  a secondary tab. Operators do not speak JSON.
- **Typed events, not a growing transcript**: tool-call / thought /
  question / result / error each get their own compact renderer; past
  steps collapsed to one line, current step expanded.
- **Status is computed at read time from durable facts** — never stored as
  a display string that can drift from reality.
- **Never spin forever.** Unknown state renders as "unknown — stale since
  ⟨time⟩", not an infinite spinner.
- When raw logs must show: wrap lines, pretty-print JSON collapsed-by-
  default, level colors, max-lines cap with "show all".

## Time, refresh, and continuity

- One formatter owns displayed time. It defaults to the operator's configured
  timezone and pairs relative language with an exact `<time datetime>` value.
- Near events get minute/hour precision; same-day events show a clock time;
  older source activity shows date **and** time. `0d` is never useful copy.
- Background freshness updates replace only the keyed status region. A timed
  full-page reload or refresh meta tag is forbidden: it steals scroll, focus,
  opened records, and draft state.

## Nav & view governance

- **One shell.** Header, nav, sidebar come from one shared layout module.
  A surface never defines its own nav. (Nine hand-rolled sidebars across
  twelve pages is the documented failure mode.)
- **Workbench, not chatbot**: agent output attaches to the object it
  changed (the todo, the PR, the idea) — not to a separate agent-only pane.
- **Consolidate before adding a fourth place to check.** A new view must
  name (a) the one question it answers, (b) which existing view answers it
  today and why that's insufficient. If one job's information spans 3+
  surfaces, the fix is one overview page with tabs — not view #4.
- **Parametrize, don't clone.** Per-project/per-agent needs are one view
  with a selector; "duplicate then tweak" is the #1 documented cause of
  dashboard sprawl.

## Cardinality

Any set of like items — pills, chips, rows, cards — that can exceed ~12 in
production MUST ship with its scaling behavior designed: grouping, a
search/filter input, top-N + "show all", or progressive disclosure. A flat
wrap of 60 pills is not a list, it is a wall
(`crimes/2026-07-07-homepage-pill-wall.png`). Design for the production
cardinality, not the fixture's.

## Composition at width

Instruments are designed at three widths, not poured into one. At wide
viewports (≥1440px) content gets a max-width (`--content-max`) and
deliberate column structure; a card floating in a half-empty viewport, or
panels stretched edge-to-edge, means the page was never composed. Dead
space is a finding, not a neutral.

## Theme durability

- Both bundled themes (and any named theme) hold **WCAG AA (4.5:1)** for
  every text tier on every surface it sits on — computed, not eyeballed
  (`--text-dim`/`--text-muted` were re-derived 2026-07 for exactly this).
- The theme toggle is part of the shared shell, present on **every** page:
  `prefers-color-scheme` default → persisted user override
  (localStorage) → applied by an inline `<head>` script before first paint
  (no flash). A toggle that exists on some pages is worse than none.
- New text/background pairings ship with their computed ratio in the PR.

## Mobile scope line

Instruments on a phone do **read, review, steer — never full edit**. The
shell collapses to a single column with a priority nav; tables become
cards or gain an explicit scroll affordance; decision cards remain fully
usable (they're the point). Dense multi-pane workbenches may simply say
"open on desktop" — honesty beats a broken squeeze. Test at 390px.

## Inputs sized to the task

If the operator is expected to write sentences, the input is a textarea
that starts ≥6 rows and auto-grows (`field-sizing: content` where
supported, JS fallback). `rows="2"` is for tags, not thinking. One-line
inputs are for one-line values.

**Inputs have a measure, exactly like prose.** A textarea wider than
~72ch is harder to write in, not easier — cap writing surfaces at
`--prose-max` (680px) regardless of panel width. "Full panel width" on a
wide viewport is a crime with extra steps.

## Never lose operator input

Any form with more than one field of typing persists a draft — debounced
on input and on blur, keyed to the specific record being edited, restored
on load, cleared on successful submit. A page reload, back-navigation, or
mid-form detour that eats typed text is a crime with a name (operator
walkthrough #9). This is a shared-shell facility, not a per-form fix:
forms opt in with an attribute, never reimplement.

## Microcopy

**Plain words.** Surfaces and verbs use ordinary language: review,
decisions, suggestions, notes, work, stale. Invented vocabulary (hands,
dealing, riffs, betting, shaping) makes the operator learn the tool
instead of using it — eradicated 2026-07-08 by operator order.

Helper text must earn its place: empty states (what this is, what fills
it, one action), first-run, and genuinely non-obvious consequences.
Everything else — restating the button, describing the obvious, filler
enthusiasm — dies in review. Voice per `PRINCIPLES.md`: precise,
peer-to-peer, no exclamation marks.

**Kickers and labels have a furniture budget.** A kicker earns space only when
it changes how the following content should be interpreted: scope, provenance,
uncertainty, eligibility, or consequence. “Project briefing · authored intent +
derived state” above a project briefing is decorative restatement. Put
“authored” on the authored claim and “derived” beside the derived timestamp; do
not narrate the existence of the layout.

## Pre-ship verification (every admin surface change)

-1. **THE WALKTHROUGH IS THE GATE for flows.** When a change touches what
   an operator *does* (not just how it looks), someone who is not the
   author walks the affected flow against real data narrating the four
   questions at each screen, and the PR quotes where they stalled. The
   operator's own narrated walks are the calibration set; every stall
   becomes a gallery entry.
0. **SEEING IS THE GATE — and the judge is independent.** Render the
   changed surfaces against production-shaped data (the real vault or a
   fixture with real cardinalities — 60+ projects, 100-char titles,
   machine-generated content), capture screenshots at 1440/768/390 in both
   themes, and have them REVIEWED — by the design-review skill or a human,
   never solely by the change's author (same-session self-critique is
   measurably weaker than an independent pass). Judge mechanics: smoke
   first (does it render at all — nearly a fifth of generated UIs fail
   here); findings are **region-anchored** ("this element, this issue"),
   never free-text impressions; before/after comparisons run
   **side-swapped and blind** (never tell the judge which is new); an LLM
   pass is trusted to flag that issues *exist*, a human triages how bad
   they are. Checklists passed on every entry in `crimes/`; only eyes
   catch composition, walls, and dumps.
   If no independent pass or explicit human acceptance is available, the maximum
   visual verdict is `candidate`. Disclosure alone does not authorize `ship`.
1. Both themes rendered; new color pairs computed ≥4.5:1.
2. 390px viewport walk — every action reachable, nothing overflowing.
3. Every emitted CSS class exists in the shipped stylesheet (a mis-typed
   `btn--danger` left the app's most destructive button unstyled).
4. Decision-surface checklist above, if the view asks for choices.
5. No new `<style>` block in a renderer; additions go to the shared
   stylesheet. No hex outside `tokens.css`.
6. Nav unchanged, or the view-governance questions answered in the PR.
