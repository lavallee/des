# DES public documentation review ledger

Private authoring record. Artoo keeps this file outside `site/`; it is not
deployed.

## Promotion question

Is the DES documentation artifact ready to merge and host publicly for outside
designers, engineers, design-system maintainers, and agent-tool authors, while
keeping Lyra Forge as a concrete example rather than required context?

Promotion authority: explicit human request to build and host the site, with
merge approval already granted in the owning thread.

## Information-form guidance

Artoo invoked the local Vizier CLI on 2026-07-18. The full invocation and output
are retained in `work/vizier-guidance.md`.

Vizier proposed distribution charts for the four modes. Rejected: the modes are
categorical choices, not observed populations or numeric scores. A chart would
invent a maturity axis. Retained checks:

- state the reader decision before selecting the form;
- make the comparison basis explicit;
- block the strongest likely misreading near the comparison; and
- keep labels and fallbacks adjacent to the evidence.

Implementation: direct job chooser, categorical comparison matrix, live HTML
references, and a profile-command builder.

## Deterministic browser audit

First complete pass:

- `start`, `modes`, and `practice` passed at wide, tablet, and mobile;
- `home`, `profile`, and `examples` failed computed contrast;
- failures were muted number labels, blue-on-coral eyebrow text, muted
  white-on-cobalt workflow copy, and a blue-on-charcoal profile kicker.

Disposition: repaired the shared color roles. The second pass left only the
home mode-rail number opacity below threshold; opacity was removed.

Final pass:

- six routes × three viewports = 18 passing captures;
- no overflow, dead affordance, missing focus indicator, text contrast,
  semantics, console, resource, or budget failures;
- paths during review: `/tmp/des-docs-final/{home,start,modes,profile,practice,examples}`.

Functional browser exercises:

- home mode selection changed the contract, example URL, page mode, and
  `?mode=` state;
- the mobile menu toggled `aria-expanded` and navigation visibility;
- the modes chooser changed the mode, URL, and live iframe;
- the profile builder changed all tuple fields, generated
  `des-marketing-compact-c3306c482a5d`, and exactly matched the CLI digest;
- clipboard denial selected the visible command and instructed `Ctrl+C`;
- focused controls computed a 3px `rgb(17, 17, 15)` outline over both cobalt
  `rgb(49, 85, 255)` and coral `rgb(255, 101, 71)` bands.

## Independent review round 1

- Requested model: `fable`
- Served model: `claude-fable-5`
- Harness: Claude CLI, high effort, read-only `Read/Grep/Glob`, no web
- Session: `f9b55127-faa0-420e-ae9d-6fcd7682770c`
- Duration: `236.348s`
- Reported cost: `$3.648434`
- Permission denials: one shell test-count attempt; source remained readable
- Verdict: `fix-then-reshoot`

Blocking findings and disposition:

1. Cobalt focus ring disappeared on the cobalt workflow and was too weak on
   coral. Repaired with a local ink focus token and verified in the browser.
2. Home claimed 33 tests after the docs tests raised the suite to 40. Repaired
   by deriving the coordinate in `build.mjs`, hydrating it from generated data,
   and testing static, offline-fallback, and generated values for parity.
3. Relative 404 assets and recovery broke on nested GitHub Pages paths.
   Repaired with absolute canonical Pages URLs and a regression test.

Accepted refinements: explain Spindle at first mention, prerender a real no-JS
profile command, add Practice to the footer, lazy-load the mode iframe, and keep
all three manifesto lines plus mode-job labels visible on mobile.

## Independent review round 2

- Requested model: `fable`
- Served model: `claude-fable-5`
- Harness: Claude CLI, high effort, read-only `Read/Grep/Glob`, no web
- Session: `69063aef-1a58-4d0e-85bf-0ed9b6f2c78b`
- Duration: `177.367s`
- Reported cost: `$2.240571`
- Permission denials: two read-only shell listing/ignore attempts; all named
  source and rendered evidence remained readable
- Verdict: `ready-to-merge`

The reviewer closed all three blockers, verified the accepted refinements, and
found no new blocker introduced by repair.

## Installation and package truth

Clean-room check in a fresh temporary Git repository:

```text
npx skills add lavallee/des --list
npx skills add lavallee/des --agent codex --copy -y
```

The public repository exposed one skill, `lyra-forge-design-system`, installed
it under `.agents/skills/lyra-forge-design-system/`, and wrote
`skills-lock.json`. The site separately labels the public npm registry as not
yet available and documents GitHub package installation instead.

## Decision

`ready-to-merge`. The final authority and live Pages verification remain with
the owning GitHub workflow and human-approved publication step.
