# The judge rubric — scoring a selected surface mode

For the independent evaluator pass (seeing gate, step 0). The judge scores
rendered screenshots + the live page, never source alone, and returns
**region-anchored findings**: each finding names the element ("the facts
row on the second card", "the submit button in the pitch form"), the
criterion it fails, and what the fix would look like. Free-text overall
impressions are not findings.

Before scoring, read the receipt's explicit `surface_mode` and the matching file
under `modes/`. Gates 0 and the relevant parts of gate 1 apply everywhere.
Sections 2–4 below are the detailed `operator` rubric. A public-data, editorial,
or marketing surface is not penalized merely for using expression that operator
mode intentionally forbids; score it against its mode section instead.

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

When the four questions reveal an orientation failure, diagnose whether scope,
operator task, current state/proof, or next move/consequence is missing. This is
not a universal header checklist: a familiar expert workflow does not fail for
omitting a restatement when its task and consequence are otherwise clear.

Translate the four questions by mode rather than importing queue language:

- **Operator:** object and scope; why it needs attention; available verb and
  authority; resulting state, continuity, and recovery.
- **Public data:** question, population, and filter scope; why this evidence is
  relevant; how to compare or reach exact values; what the selected scope changes
  and how to share or reset it.
- **Editorial:** subject and claim; why it matters and who attributes it; how to
  follow evidence, figures, notes, and corrections; where the argument or record
  continues.
- **Marketing:** audience tension and product distinction; why the proof is
  credible; what action is available; where that action leads and what it commits.

## Gate 1.5 — flow and authority (pass/fail per task)

- The representative task has a named entry, action, success state, and recovery
  path; loading, empty, and error states are present where reachable.
- A named DES family is credited only to its demonstrated readiness level:
  documented, visually demonstrated, behaviorally complete, or
  production-proven. Static classes/specimens do not prove working actions.
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

## Operator section 2 — composition & density (0–2 each)

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

## Operator section 3 — decision surfaces (0–2 each; only if the page asks for choices)

- Card body is decision context (what happened / why it matters / what
  each verb does) — not a raw artifact dump, not a truncated tease.
- ≤1 solid primary per card; ≤2 accent colors; every assertion carries an
  action path.
- Disposition is instant-with-undo for reversible verbs; confirmation
  appears only for the irreversible.

## Operator section 4 — durability (0–2 each)

- Both themes hold: no unthemed control (the white-textarea-in-dark-mode
  class of bug); text tiers ≥4.5:1 computed.
- 390px: read/review/steer works; nothing overflows; an honest "open on
  desktop" is acceptable for dense workbenches.
- Typed input survives a reload (draft layer present on multi-field
  forms).
- Idle pages preserve scroll, focus, opened records, and drafts: no timed
  whole-page refresh. Relative time avoids `0d`, exposes an exact timestamp,
  and uses the configured operator timezone.

## Public-data mode (0–2 each)

- **Question and scope:** the opening establishes the question, population, time
  basis, units, and current filter scope without requiring domain fluency.
- **Overview to exact value:** the reader can move from the main pattern to a
  comparison, underlying value, and relevant record without losing context.
- **Encoding integrity:** legends, axes, denominators, missingness, uncertainty,
  and scale choices prevent the visual from implying a stronger claim than the
  data supports. Color is not the only carrier of meaning.
- **Provenance at interpretation:** source, update cadence, methodology, and
  qualifications appear where they affect the claim, not only in a remote
  footer.
- **Filter and share durability:** filters announce their effect, empty results
  explain absence, and the meaningful view can be linked or reconstructed.
- **Responsive explanation:** narrow layouts recompose comparisons and retain an
  exact-value route; they do not merely shrink a desktop chart.

## Editorial mode (0–2 each)

- **Reading sequence:** headline, deck, byline, body, sections, figures, notes,
  and citations create a legible path without panelizing every paragraph.
- **Measure and rhythm:** body measure, line height, section spacing, and figure
  placement support sustained reading at narrow and wide widths.
- **Claim custody:** observed fact, attributed claim, analysis, and recommendation
  remain distinguishable; citations and corrections resolve to exact material.
- **Figure purpose:** each image, chart, pull quote, or side note advances the
  narrative or evidence and carries the required caption, source, and alt text.
- **Navigation and return:** long documents provide position and linkable
  sections without interrupting the reading flow.
- **Editorial identity:** expressive type, color, texture, and layout form one
  coherent voice rather than a collection of unrelated effects.

## Marketing mode (0–2 each)

- **Product argument:** the first sequence makes the audience tension, product
  distinction, and next action concrete without relying on generic superlatives.
- **Honest proof:** interface demonstrations, outputs, customers, metrics,
  testimonials, and urgency are real, sourced, or explicitly marked as
  placeholders. Decorative chrome does not pass as product evidence.
- **Structural fingerprint:** the page uses a named macrostructure suited to its
  argument instead of defaulting without reason to hero, logo strip, three-card
  grid, testimonial wall, and CTA.
- **Coherent identity:** typography, imagery, geometry, color, and motion share a
  small design DNA. Greater variance does not become multiple visual systems.
- **Purposeful expression:** each gradient, shadow, asymmetry, image, or motion
  choice improves hierarchy, identity, comprehension, or emotional register.
- **Action and mobile:** calls to action state destination or consequence, and
  mobile recomposes the argument rather than clipping or stacking every block.

## Output format

```
GATE 0: pass|fail (+findings)
GATE 1: per-screen pass|fail, each failure = {region, question, evidence}
MODE SECTION: score + findings [{region, criterion, evidence, suggested fix}]
VERDICT: ship | candidate | fix-then-reshoot | fails-gate
RECEIPT: baseline revision/routes/screenshots, variant revision/screenshots,
surface mode and style dials, structural fingerprint, relevant page-entry
diagnosis, pattern readiness and missing behavior, functional/a11y/console/
overflow checks, profile id, harness, requested/served model, tier, capabilities,
independent judge, promotion authority, material delta, post-implementation
feedback, and deferred findings
```

`ship` for a visual change requires an independent seeing pass or explicit human
acceptance. When every gate passes but neither exists, return `candidate`.
