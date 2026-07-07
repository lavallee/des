# The crimes gallery

Annotated screenshots of shipped UX violations, each tagged with the rule it
broke (or the rule it *revealed* — several entries below forced corrections
to `PATTERNS-ADMIN.md`). This is the taste ledger: the operator's reactions
are the eval set, and this gallery is its durable form.

Agents building admin surfaces: look at these BEFORE building. Every entry
shipped through a checklist that passed. The lesson of this gallery is that
rules applied without *seeing* produce compliant crimes.

## 2026-07-07 — homepage pill wall
`2026-07-07-homepage-pill-wall.png`

60+ project/concept pills rendered as a flat wrap filling half the viewport,
mixing projects with concepts, most with counts of 1–2, no grouping, no
search, no hierarchy. Also visible: gates in "Needs you" truncating
mid-ULID; stat cards and panels stretched edge-to-edge at 1680px with no
composition.

**Rules broken/revealed:** cardinality (any set >12 needs grouping, search,
or disclosure — never a flat wall); composition at wide viewports (content
max-width; a page is designed, not poured); decision text truncated on the
one panel that asks for decisions.

**Root cause:** built and "verified" against a scratch vault where the pill
list had 3 entries. Production has 67 projects. Verification data must be
production-shaped or it is theater.

## 2026-07-07 — hand review card dumps a machine prompt
`2026-07-07-hand-prompt-dump.png`

A review card's body is the entire groundskeeper *machine prompt* — hundreds
of lines of curl commands and RULES — because the card renders "the full
deciding text" and the todo's content IS the prompt. Half the viewport is
dead space beside it.

**Rule revealed (and since corrected):** "never truncate deciding text" was
the wrong rule stated too broadly. The right rule: a decision card shows
**decision context** — what happened, why it matters, what each action does —
written for a human. Raw machine artifacts (prompts, logs, diffs, JSON) are
*evidence*, linked one click away, never poured into the card body.

**Root cause:** the rule's author never looked at a rendered card whose todo
content was machine-generated. Rules written blind ship blind.
