# Magpie resource review queue — design-system calibration

Status: `calibrated-after-human-feedback`
Date: `2026-07-13`
Surface: `/dashboard/resources`

## Coordinates

| State | Revision | Result |
|---|---|---|
| Baseline | `d16ad3e` | 50 of 55,613 inventory records presented as triage |
| Structural variant | `9824283` | bounded two-item review queue; task and authority gates passed |
| Human seeing gate | user feedback after the live deploy | “this new page looks pretty unstyled to me” |
| Surface variant | `4d9da50` | stronger task entry, panel hierarchy, ranked cards, confidence, and action rail |

The structural variant materially improved the product but received a false
`ship` verdict as a visual change. Its stylesheet loaded and the screen passed
the task gates, yet the composition still read as a generic stack of panels and
controls. The operator saw that immediately.

## Why the process missed it

1. **Lowest-layer diagnosis became a stopping rule.** Fixing the queue model was
   correctly first, but the workflow did not force a second pass over the now-
   exposed surface. Lowest unresolved layer determines order, not completeness.
2. **The seeing gate was binary.** “CSS loaded” distinguished styled HTML from a
   broken page, not weak system expression from a composed instrument.
3. **Self-review was allowed to promote.** The receipt disclosed that no
   independent judge participated and still said `ship`. Disclosure without a
   promotion consequence did not protect the decision.
4. **The shared component vocabulary stopped below the task level.** Des had
   shells, inputs, badges, and cards but no composed decision-workspace family.
   The surface repair therefore added roughly 300 lines of product-local CSS.
5. **The repair drifted outside the system.** The stronger variant used
   gradients, card/button shadows, and prose serif inside an instrument. Those
   mechanisms were not isolated from the useful changes and should not be
   promoted as system defaults.

## Delta attribution

Promote these mechanisms:

- a contained task-entry header with one clear title, lede, and view switch;
- a stable rail/result composition at wide widths and deliberate collapse below
  the breakpoint;
- a queue contract visually distinct from filters;
- a result header that exposes readiness, count, and ranking policy;
- ranked decision cards with one rationale region and one separated action rail;
- confidence rendered as a semantic score, not buried in prose;
- stronger idle-state affordance for filters and the primary action.

Do not promote these from this case:

- gradients, decorative rings, or colored rules;
- shadows on cards and buttons;
- Newsreader for instrument headings or item excerpts;
- any claim that a single model, skill, or reference caused the improvement.

Those details changed in the same batch and were not independently evaluated.
The reusable mechanism is composition and role clarity, not decoration.

## System response

- Add a flat, token-only `decision-*` component family to `components.css` and
  its canonical showcase.
- Add a perceptual-hierarchy gate to `RUBRIC.md` between task correctness and
  scored refinement.
- Make `candidate` the maximum visual verdict without an independent seeing pass
  or explicit human acceptance.
- Reopen a receipt when post-implementation feedback contradicts its verdict;
  preserve both the original verdict and the correction.
- Require product-local component extensions to be classified as `specific`,
  `candidate-system`, or `system`; generic task composition should move upstream
  once it survives a production-shaped pilot.
- Treat nested review references as part of the rendered skill artifact and its
  cache identity, so a successful bind cannot silently preserve stale judgment
  guidance.

## Regression question

The system improvement succeeds when a new queue can assemble a strong task
entry, contract, result summary, rationale, and action rail from shared classes
without gradients, card shadows, prose typography, or a large local CSS fork.
Magpie is the first fixture for that claim, not proof that every decision surface
should look identical.
