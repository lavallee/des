# Surface modes and style range

DES does not impose one visual personality on every product. It provides a
shared floor, then selects a surface mode and adjustable style dials for the
audience and task.

## Shared floor

These are system constraints across every mode:

- Make the user, task, state, authority, consequence, and recovery legible.
- Do not fabricate people, customers, metrics, testimonials, citations, or
  product capabilities. Mark placeholders and unknowns explicitly.
- Use semantic tokens rather than scattering local visual constants. Status
  colors communicate status and are not decoration.
- Preserve visible keyboard focus, sufficient contrast, semantic structure,
  reduced-motion behavior, and usable layouts at supported widths.
- No dead affordances: anything styled as a link, button, filter, menu, or other
  control must be focusable and functional, or clearly labeled as a static
  specimen.
- Keep claims, evidence, synthesis, recommendations, and actions distinct.
- Use production-shaped content and exercise loading, empty, error, success,
  and recovery states that the flow can reach.
- Record the requested model, served model, harness, selected mode, and
  capabilities in the design receipt. A bind or screenshot proves availability,
  not effectiveness.

The shared floor does **not** ban gradients, shadows, expressive typography,
imagery, or structural novelty. Each selected mode says when those choices help
or harm its task.

## Choose a mode before choosing a look

| Mode | Primary audience | Primary job | Start with |
|---|---|---|---|
| `operator` | Practiced professional | Repeated, consequential action | `modes/operator.md` |
| `public-data` | Public reader | Explore evidence and comparisons | `modes/public-data.md` |
| `editorial` | Sustained reader | Follow an argument or record | `modes/editorial.md` |
| `marketing` | Prospective user | Understand distinction and credibility | `modes/marketing.md` |

If one product contains multiple jobs, classify each route or bounded region.
Do not average the modes into one vague middle. A public data story may contain
an operator-like filter workbench; a marketing site may link to an editorial
case study. Transitions should be deliberate and the local mode should remain
obvious.

## Style dials are independent of mode

Use these dials to create range without randomizing the product:

- **Variance** — low, medium, high. How far composition may depart from familiar
  task anatomy. Low variance still requires hierarchy; high variance still
  requires comprehension.
- **Density** — compact, balanced, relaxed. Information per viewport, not a
  synonym for small type or cramped controls.
- **Motion** — none, functional, explanatory, expressive. Motion must preserve
  reduced-motion behavior and must never conceal state or block the task.
- **Type register** — interface, editorial-data, editorial, branded. A role
  assignment, not a mandatory font list.
- **Imagery role** — none, evidence-only, evidence-and-explanation,
  narrative-and-evidence, art-directed. Images need an explicit job.

The mode supplies defaults. Override one dial at a time in a candidate and
record why the change helps the representative task. Within one application,
preserve a small design-DNA record—type roles, spacing rhythm, surface geometry,
interaction treatment, and repeated structural motifs—so variation does not
become inconsistency.

## Structural fingerprints, not a theme roulette

Before surface styling, name the page's task anatomy: for example, queue plus
inspector, overview-to-detail data story, annotated narrative, or proof-led
product argument. Record the fingerprint in the design plan and receipt. Reuse
it when continuity matters; change it only when the task or audience changes.

Across unrelated marketing or editorial projects, check recent fingerprints so
the model does not repeatedly emit the same centered hero, card grid, and CTA.
Across routes in one operator application, consistency has the opposite value:
keep stable task anatomy and vary only when a different job requires it.

## Profile selection

Generate the deterministic context contract before implementation:

```bash
des-profile \
  --mode public-data \
  --harness codex \
  --requested-model gpt-5 \
  --served-model gpt-5 \
  --model-tier frontier \
  --capability browser \
  --capability visual-input \
  --format markdown
```

The model tier changes context size, explicitness, variation strategy, and proof
requirements. It does not choose a visual style. Never compensate for a model
by forcing animation, a conversion formula, a theme, or hidden overflow.

The profile tuple is a **self-declared attestation from the invoking harness**.
Its digest proves that the receipt retained those declarations unchanged; it
does not independently identify the served model or discover capabilities. An
evaluation runner or provider receipt should corroborate requested/served model
when the distinction affects promotion.
