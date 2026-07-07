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
   link states its destination and state ("PR #35 — merged").
2. **Why am I seeing it?** The item says why it reached this queue/page;
   nothing the system already settled is shown as needing a human.
3. **What do I do?** The page carries its object's verbs; one action is
   visually primary; no blank textarea stands where a machine draft
   belongs.
4. **What happens next?** Each action states or implies its consequence;
   empty/idle states name what fills them or what's scheduled.

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

## Output format

```
GATE 0: pass|fail (+findings)
GATE 1: per-screen pass|fail, each failure = {region, question, evidence}
SECTIONS 2–4: score + findings [{region, criterion, evidence, suggested fix}]
VERDICT: ship | fix-then-reshoot | fails-gate
```
