# Design practice — from diagnosis to proof

The design system defines a visual language. This document defines the work that
turns a real product surface into a better one.

The unit of work is not "make the page look better." It is a bounded user task
with a baseline, an implemented change, and rendered proof. A stronger model can
help with judgment, but it does not replace the receipt.

## 1. Orient before touching the surface

Classify the work:

- **Instrument or artifact?** Instruments optimize repeated professional work;
  artifacts optimize reading and understanding.
- **Planned or implemented?** A plan can be reviewed from flows and states. An
  implementation must be reviewed in the browser.
- **Diagnose or improve?** A review stops with findings. An improvement continues
  through implementation, task checks, and a new render.
- **Surface or system problem?** If the queue should not exist, the object model
  is wrong, or the human is being asked to repeat machine work, changing type and
  spacing is not the fix.

For consequential work, inspect the decision stack from the bottom up:

1. observed user behavior and constraints;
2. domain facts and rules;
3. user need and authority;
4. product strategy and scope;
5. concept model and vocabulary;
6. interaction flow, including edge states;
7. rendered surface.

Mark each layer `strong`, `partial`, `assumed`, or `weak`. Work on the lowest weak
layer that blocks the task. Do not use surface polish to conceal an unresolved
model or flow.

## 2. Capture the baseline

Before editing:

1. Name one representative task in the user's words.
2. Record the route, state, production-shaped data, and current result count.
3. Capture 1440, 768, and 390 px renders when the surface supports them.
4. Walk the task with keyboard and pointer; record console errors, overflow,
   focus failures, and unavailable actions.
5. Score the baseline with `RUBRIC.md`. Findings must name a region and observable
   evidence.

Do not review an empty mock when the production shape is a list of 50. Do not
review source code as a substitute for the render.

## 3. Write the just-in-time design plan

Write this immediately before implementation, after inspection and reference
selection. Keep it short enough to remain the strongest instruction in context.

```markdown
## Design plan

- User and task:
- Instrument or artifact:
- Lowest unresolved layer:
- Existing system to preserve:
- Reference and mechanism borrowed:
- Anti-reference / behavior to avoid:
- Flow and states (entry, action, success, empty, error, recovery):
- Hierarchy and density:
- Coherent slice to change:
- Proof required:
```

A reference is evidence, not permission to copy a look. Name the mechanism being
borrowed: for example, a bounded review queue, an inline inspector, a breadboarded
flow, or a baseline/variant receipt. Record the source URL or local artifact and,
when possible, a revision.

For new visual directions, generate genuinely different candidates by changing
one named axis at a time—composition, density, type register, or interaction
model. Do not randomize an admin tool's personality, and do not import landing-
page decoration into an instrument.

## 4. Build the smallest coherent slice

- Preserve working behavior, project voice, and the existing token/component
  system unless the plan explicitly replaces them.
- Fix the lowest unresolved layer first. A queue may need eligibility and
  freshness rules before it needs better cards.
- Keep machine work with the machine and reserve human attention for judgment.
- Include normal, loading, empty, error, success, and recovery states that the
  changed flow can actually reach.
- Use production-shaped content. Long titles, zero states, stale records, and
  large counts are design inputs.
- Keep local styles in the stylesheet or component system, not inline in the
  rendered template.

When the request authorizes implementation, do not stop at a review document.
Make the change, exercise the task, and reshoot it.

## 5. Inspect, critique, refine

Run the changed task in the browser. Recheck the same route, state, data, widths,
and input method used for the baseline. Then:

1. Apply `RUBRIC.md` from the seeing gate forward.
2. Separate surface findings from concept-model and flow findings.
3. Rank by user harm and task frequency, not ease of CSS repair.
4. Fix the highest-impact coherent set.
5. Repeat until no gate fails and the task is materially better.

If an independent judge is available, present side-swapped before/after images
without identifying the candidate. The judge decides whether a criterion fails;
the operator owns severity and promotion. If no independent judge is available,
say so in the receipt instead of manufacturing confidence.

## 6. Leave a design receipt

Store screenshots beside a small JSON or YAML receipt. At minimum record:

```yaml
task: ""
surface: ""
baseline:
  revision: ""
  route: ""
  state: ""
  screenshots: []
  rubric_verdict: ""
variant:
  revision: ""
  screenshots: []
  rubric_verdict: ""
checks:
  functional: []
  accessibility: []
  console_errors: 0
  body_overflow: false
evaluation:
  requested_model: "unknown"
  served_model: "unknown"
  independent_judge: false
  material_delta: ""
deferred: []
```

Record requested and served model separately when known. Do not attribute an
outcome to a model family, skill, or reference without a same-task baseline. A
successful bind or a polished screenshot proves availability, not efficacy.

## Definition of done

The work is done when the representative task completes, the render passes the
gates at its supported widths, the changed states are exercised, and the receipt
makes the before/after claim auditable. A list of recommendations is done only
when the user asked for a review.
