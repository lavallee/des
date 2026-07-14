# DES showcase accessibility calibration

Status: `candidate`
Date: `2026-07-14`
Task: find and inspect a system pattern in the canonical component showcase
Surface: `/showcase.html`

## Design plan

- User and task: a product engineer uses the showcase to find and inspect a
  system pattern before implementing it.
- Instrument or artifact: instrument reference.
- Lowest unresolved layer: rendered controls did not expose the system's own
  accessibility contract.
- Existing system to preserve: layout, tokens, component catalog, themes, and
  current visual hierarchy.
- Named system pattern: filter bar and command palette.
- Reference and mechanism borrowed: the DES diagnosis-to-proof receipt loop;
  no outside visual mechanism was needed.
- Anti-reference: a visual restyle that hides the semantic defect.
- Coherent slice: accessible names and focus indicators for the showcase's
  theme, filter, and command controls.
- Proof required: the same route at 1440, 768, and 390 px; no overflow,
  unnamed interactive controls, focus-indicator suspects, console/page errors,
  or performance-budget failures.
- Promotion authority: none; this remains a candidate until human acceptance.

## Baseline

Revision `e30f034` failed the deterministic gate at every width. Accessibility
snapshots exposed three unnamed comboboxes: the theme selector plus the status
and beat filters. The runner also identified six controls with no detectable
focus indicator because later component rules set `outline: none` after the
global `:focus-visible` rule. The browser also requested a missing favicon; the
variant gives the showcase an existing system icon rather than tolerating the
404.

The baseline otherwise had no body overflow, console errors, page errors,
duplicate IDs, heading skips, or missing image alternatives. Every local
navigation load completed under 700 ms with four resources and 92 KB
transferred.

Evidence:

- `baseline.receipt.json`
- `baseline/wide.png`, `baseline/tablet.png`, `baseline/mobile.png`
- `baseline/*.accessibility.txt`

## Variant

The variant:

- names the theme selector;
- gives the filter search, status, and beat controls durable labels;
- removes component-level outline suppression that defeated the global focus
  rule;
- uses the shared command-palette input component and gives it a name;
- serves a real system icon for the favicon request.

All three widths pass. Each has one main landmark, no horizontal body overflow,
no unnamed interactive controls, no focus-indicator suspects, no console/page
errors, and no performance-budget failure. Every local load completed under 700
ms with four resources and 92 KB transferred.

Evidence:

- `variant.receipt.json`
- `variant/wide.png`, `variant/tablet.png`, `variant/mobile.png`
- `variant/*.accessibility.txt`

## Seeing pass

The before and after pixels are intentionally almost identical: the repair is
semantic and focus-only, not a restyle. The wide, tablet, and mobile captures
retain the existing hierarchy and content. At 390 px the long specimen page is
necessarily tall, but content reflows to one column and the document body does
not overflow horizontally.

Verdict: `candidate`. The implemented defect is fixed and the mechanical proof
passes, but no independent seeing judge or explicit human acceptance promoted
this calibration to `ship`.
