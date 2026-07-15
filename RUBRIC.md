# The judge rubric — scoring an admin surface

For the independent evaluator pass (seeing gate, step 0). The judge scores
rendered screenshots + the live page, never source alone, and returns
**region-anchored findings**: each finding names the element ("the facts
row on the second card", "the submit button in the pitch form"), the
criterion it fails, and what the fix would look like. Free-text overall
impressions are not findings.

Protocol: gates run in order — a failed gate stops scoring (a page that
doesn't render has no typography). Before/after comparisons are
side-swapped and blind: the judge is never told which screenshot is the
candidate. The judge's verdict on *whether* an issue exists is trusted;
*severity* is triaged by the operator, not the model.

Wording note: criteria below are deliberately falsifiable and free of
taste adjectives. Do not add aspirational language ("stunning",
"museum-quality") — vague quality words measurably homogenize what models
produce.

## Gate 0 — smoke (pass/fail)

- The page renders: no raw exception, no unstyled HTML, no missing CSS.
- Every image/screenshot in the set loaded (a blank viewport is a fail,
  not a minimal design).
- No horizontal scroll of the page body at 1440, 768, or 390.

## Gate 1 — task reasoning (pass/fail per screen; the four questions)

At each screen, answerable without clicking away:
1. **What is this?** Every referent is resolved (no bare ULIDs/IDs); every
   work item has a human reference rather than a chopped machine ID; every link
   states its destination and state ("PR #35 — merged").
2. **Why am I seeing it?** The item says why it reached this queue/page;
   nothing the system already settled is shown as needing a human.
3. **What do I do?** The page carries its object's verbs; one action is
   visually primary; no blank textarea stands where a machine draft
   belongs.
4. **What happens next?** Each action states or implies its consequence;
   empty/idle states name what fills them or what's scheduled.

## Gate 1.5 — flow and authority (pass/fail per task)

- The representative task has a named entry, action, success state, and recovery
  path; loading, empty, and error states are present where reachable.
- The human is deciding something that requires human authority. The surface does
  not expose an unbounded machine backlog as a mandatory review queue.
- Queue eligibility is legible: freshness, confidence, ownership, and the reason
  each item needs attention are visible or one disclosure away.
- Work the system intends to move is visibly distinct from work stopped for
  human input and work stalled on an external blocker.
- Surface changes do not conceal a weak concept model or broken flow. If the
  lowest unresolved layer is below the surface, the verdict is `fails-gate`.

## Gate 1.75 — perceptual hierarchy and system expression (pass/fail per screen)

- At thumbnail size or a quick squint, task entry, the decision set, evidence,
  and the primary action remain locatable without reading every label.
- At least three hierarchy tiers are perceptible through position, type scale,
  weight, surface, or rule—not color alone and not a card around everything.
- Controls read as interactive in their idle state; the primary action is not
  distinguishable only by copy or hover.
- Heterogeneous records keep typed representations: decisions, PRs, todos,
  blockers, observations, and outcomes expose different evidence and verbs.
  A kind badge on one generic truncated card does not pass.
- Any shortened deciding text has an obvious full-text path. A strong fragment
  followed by an inert ellipsis is an immediate failure.
- The screen instantiates a named composed system pattern, or the receipt records
  a component gap and a deliberate local exception. A shell filled with generic
  cards and inputs is not system expression merely because it uses tokens.
- A strategic overview is organized by intent and authored outcomes, not record
  kinds. Current focus, movement/proof, bounded attention, machine settlement,
  and complete-inventory disclosure are perceptibly distinct. A typed record
  stream does not pass as a journey briefing.
- Authored, derived, and proposed claims are not visually or verbally
  conflated. Missing proof is explicit; uncertainty is not expressed as a fake
  completion percentage.
- New visual emphasis obeys the system's typography, color, elevation, and
  decoration rules. A stronger screenshot that requires an unreviewed system
  exception is `fix-then-reshoot`.
- Every kicker, label, and guidance fragment adds distinct task information.
  Decorative restatement of the page type, heading, or adjacent content is a
  hierarchy failure, not harmless polish.

## Section 2 — composition & density (0–2 each)

- **Composed at width**: at 1440 content has a max-width and deliberate
  column structure; no panel poured edge-to-edge; no card floating in
  dead space.
- **Density in the right place**: data is tight (tabular numerals,
  compact rows) while chrome is generous; hierarchy comes from type
  scale/weight, not whitespace alone.
- **Cardinality designed**: no flat wall of >12 like items; grouping,
  top-N, search, or disclosure is present and the production count fits it.
- **Measure held**: prose 45–75ch; textareas ≤ prose max; full-value
  tokens wrap rather than ellipsize.
- **Controls hold**: text inputs, textareas, selects, buttons, and disclosure
  summaries are visibly interactive, theme-safe, focusable, and sized to their
  writing or selection task.

## Section 3 — decision surfaces (0–2 each; only if the page asks for choices)

- Card body is decision context (what happened / why it matters / what
  each verb does) — not a raw artifact dump, not a truncated tease.
- ≤1 solid primary per card; ≤2 accent colors; every assertion carries an
  action path.
- Disposition is instant-with-undo for reversible verbs; confirmation
  appears only for the irreversible.

## Section 4 — durability (0–2 each)

- Both themes hold: no unthemed control (the white-textarea-in-dark-mode
  class of bug); text tiers ≥4.5:1 computed.
- 390px: read/review/steer works; nothing overflows; an honest "open on
  desktop" is acceptable for dense workbenches.
- Typed input survives a reload (draft layer present on multi-field
  forms).
- Idle pages preserve scroll, focus, opened records, and drafts: no timed
  whole-page refresh. Relative time avoids `0d`, exposes an exact timestamp,
  and uses the configured operator timezone.

## Output format

```
GATE 0: pass|fail (+findings)
GATE 1: per-screen pass|fail, each failure = {region, question, evidence}
SECTIONS 2–4: score + findings [{region, criterion, evidence, suggested fix}]
VERDICT: ship | candidate | fix-then-reshoot | fails-gate
RECEIPT: baseline revision/routes/screenshots, variant revision/screenshots,
functional/a11y/console/overflow checks, requested/served model, independent judge,
promotion authority, material delta, post-implementation feedback, and deferred
findings
```

`ship` for a visual change requires an independent seeing pass or explicit human
acceptance. When every gate passes but neither exists, return `candidate`.
