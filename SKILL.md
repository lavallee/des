---
name: lyra-forge-design-system
description: Audience-aware design practice and system for operator tools, public data websites, editorial artifacts, and marketing surfaces. Use to diagnose, build, redesign, or evaluate a product UI with explicit surface mode, style dials, model/harness profile, rendered proof, and promotion authority. Source of truth is the selected mode plus tokens.css and components.css where those system assets apply.
---

# Lyra Forge Design System

DES is a design practice and reusable system, not one house aesthetic. Select the
audience and task first, then choose a coherent visual expression and prove it in
the rendered product.

## Route the task before loading references

1. Read `PRACTICE.md` for the diagnosis-to-proof workflow.
2. Read `modes/README.md` for the shared floor and independent style dials.
3. Select exactly one primary surface mode for the bounded task:
   - `modes/operator.md` — admin tools, queues, workbenches, configuration.
   - `modes/public-data.md` — public dashboards, explainers, maps, explorers.
   - `modes/editorial.md` — articles, reports, records, sustained narrative.
   - `modes/marketing.md` — product sites, launches, campaigns, conversion.
4. Generate or record a DES profile with the exact harness, requested model,
   served model when known, model tier, and available capabilities.
5. Load only references needed for the selected task:
   - `PATTERNS-ADMIN.md` for consequential operator decisions.
   - `PRINCIPLES.md` for system philosophy and component behavior.
   - `tokens.css` and `components.css` when adopting the shipped vocabulary.
   - the closest `ui-kits/` implementation as a mechanism reference, not a
     mandatory visual template.
   - `docs/design-engineering-toolchain.md` before choosing tools.

For an operator asking where a project is in its journey, keep authored intent, outcome movement and proof,
bounded human attention, machine settlement, recent evidence, and grouped inventory
in that order. Typed records are drill-down
evidence; they do not replace the journey model.

Do not load every mode and every reference into one prompt. A compact model gets
the shared floor, one mode, and one composed pattern. A frontier model may use a
broader reference set when an unresolved design decision justifies it.

## Shared floor

These constraints survive every mode:

- Make task, state, authority, consequence, and recovery legible.
- Do not invent metrics, testimonials, customers, citations, capabilities, or
  other proof. Mark unknown and placeholder content explicitly.
- Use semantic tokens for reusable visual decisions. Status colors communicate
  status and are not decoration.
- Preserve semantic structure, contrast, keyboard focus, reduced motion, and
  usable supported widths.
- Anything styled as interactive is focusable and functional, or explicitly
  labeled as a static specimen. No dead links, decorative buttons, or pointer
  cursors on inert elements.
- Keep observation, claim, synthesis, recommendation, action, and outcome
  distinct where the product handles evidence or decisions.
- Use production-shaped content and reachable loading, empty, error, success,
  and recovery states.
- A successful skill bind, clean code review, or polished screenshot does not
  prove efficacy. Compare the same task and leave a tuple-bound receipt.

DES does not universally ban gradients, shadows, expressive typography,
imagery, motion, or novel composition. The selected mode supplies the relevant
permissions and constraints. Operator mode remains deliberately flat and
stable; marketing and editorial modes can be expressive when each choice has a
job.

## Design range without randomness

Declare these independent dials in the just-in-time plan:

- variance: `low | medium | high`
- density: `compact | balanced | relaxed`
- motion: `none | functional | explanatory | expressive`
- type register: `interface | editorial-data | editorial | branded`
- imagery role: `none | evidence-only | evidence-and-explanation |
  narrative-and-evidence | art-directed`

Change one named dial at a time when exploring candidates. Before styling, name
the surface's structural fingerprint: its task anatomy, major regions, and
interaction sequence. Preserve a small design-DNA record within one product;
check recent fingerprints across unrelated expressive projects so the harness
does not repeat the same hero, card grid, and CTA.

## Model and harness profile

Use `des-profile` rather than inferring a model from prose or environment names:

```bash
des-profile \
  --mode operator \
  --harness codex \
  --requested-model gpt-5 \
  --served-model gpt-5 \
  --model-tier frontier \
  --capability browser \
  --capability visual-input \
  --format markdown
```

The profile changes instruction density, reference loading, variation strategy,
and proof requirements. It never forces a style. If visual input is unavailable,
the harness cannot issue a perceptual verdict. If browser control is unavailable,
it cannot claim rendered correctness. Independent seeing or explicit human
acceptance remains required to promote a visual candidate to `ship`.

## Working sequence

1. Name the representative user task and classify the selected mode.
2. Inspect the decision stack and fix the lowest weak layer that blocks the task.
3. Capture the live baseline at supported widths with production-shaped state.
4. Write the short design plan required by `PRACTICE.md`, including the mode,
   dials, structural fingerprint, borrowed mechanism, and anti-reference.
5. Implement the smallest coherent slice, including state and recovery.
6. Walk the task with keyboard and pointer, inspect at thumbnail and full size,
   and run the selected mode's rubric gates.
7. Use `des-audit --mode ...` to produce viewport and full-page evidence tied to
   the DES profile.
8. Record the independent judge or human promotion authority. Without one, the
   maximum visual result is `candidate`.

## Existing system assets

The current tokens, components, themes, React references, and UI kits began with
the Lyra Forge operator and editorial-data family. They are production assets
where their behavior fits the selected surface. They are not a requirement that
every public or marketing surface use Geist, Instrument Serif, flat cards, the
same five themes, or one navigation anatomy.

When extending the shared vocabulary, add semantic tokens and demonstrated
behavior rather than copying local constants. Classify a new pattern as
`specific`, `candidate-system`, or `system`, and state its readiness as
documented, visually demonstrated, behaviorally complete, or production-proven.
