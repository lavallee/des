# Functional decision workspace evaluation

Status: `candidate`
Date: `2026-07-16`
Owner: shared DES
Branch: `fab/functional-decision-workspace`
Baseline: `origin/main` at `a260f80`

## Commission result

The existing `decision-*` and `action-inbox` families now have a runnable,
product-agnostic behavior contract and reference implementation. No new
component family was introduced and no George file was edited.

The selected packaging boundary is the framework-neutral
`decision-workspace.js` controller plus its public types. It is smaller than a
shared React package, works with the existing CSS classes in any web framework,
and keeps product data access outside DES. The existing React reference adds a
thin `useDecisionWorkspace` subscription adapter; products inject their own
resolve, defer, and undo persistence and provide refresh results to
`reconcile()`.

## Design plan

- User and task: an expert operator must inspect a bounded human-authority
  decision and safely resolve or defer it without losing place or reasoning.
- Instrument or artifact: instrument.
- Lowest unresolved layer: interaction flow and shared state contract; the
  visual anatomy already existed.
- Existing system to preserve: `decision-*`, `action-inbox`, tokens, native
  disclosure, current React references, and the four-level readiness ladder.
- Named system pattern: decision workspace composed inside an action inbox.
- Flow and states: independently open/select; inspect full text/evidence/history;
  note; resolve/defer; loading; success; empty; error/retry; reversible undo;
  explicit irreversible result; product refresh reconciliation.
- Hierarchy: collapsed authority reason; full deciding record on open; one
  primary action; secondary consequence; evidence/history in separate regions.
- Coherent slice: controller, types, React adapter, existing-family CSS,
  runnable showcase, behavior tests, docs, and receipts.
- Proof required: deterministic callbacks/transitions plus dark/light audit at
  1440, 768, and 390 with focus, accessibility, overflow, console, and resource
  checks.
- Promotion authority: none; candidate maximum.

## Functional evidence

`npm test` passes 29/29. The nine controller behavior tests directly call and
observe the public API; they do not search generated markup or CSS. They cover:

- resolve callback with observable loading then success;
- defer failure followed by a deterministic retry of the same operation;
- reversible undo with an opaque product token;
- failed undo retry without repeating the original action;
- non-reversible resolution with an explicit immutable-ledger explanation;
- product refresh reconciliation;
- preservation of filters, list position, open item, selection, and in-progress
  note through action completion and refresh; and
- validation that authority reason, deciding text, evidence, and irreversible
  explanation cannot be omitted.

The runnable `decision-workspace-showcase.html` binds the controller to an
in-memory product adapter. A browser walkthrough verified:

1. opening the first record reveals its complete deciding text, evidence,
   history, note, resolve, and defer controls without selecting its checkbox;
2. a typed note survives resolve, product refresh, and reversible undo, and the
   restored item reopens;
3. the first attempt to publish the second decision enters an alert-focused
   error state;
4. Retry succeeds without changing the chosen action; and
5. the success receipt explains that undo is unavailable because the external
   registry is immutable.

The showcase adapter persists continuity separately and reflects filters in the
URL. The controller contains no endpoint, fetch, authentication, or product
telemetry implementation.

## Rendered receipts

`npm run audit:decision-workspace` passes in both themes:

- `artifacts/design-receipts/decision-workspace/dark/variant.receipt.json`
- `artifacts/design-receipts/decision-workspace/light/variant.receipt.json`

Each receipt covers 1440x1000, 768x1024, and 390x844. The deterministic audit
opens the first record so full deciding text, evidence, history, note, and
working controls are included in the accessibility and visual surface. Across
all six captures there is no body overflow, duplicate ID, focus-indicator
failure, heading skip, failed image/resource, unnamed control, console error, or
page error. The audit restores the initial scroll coordinate after exercising
focus so sticky chrome is not displaced in full-page screenshots.

Pixel inspection found the collapsed authority reasons and statuses scannable
at all widths, the open record bounded at 75ch on wide screens, and the action
and evidence regions stacked without horizontal overflow on mobile. Both themes
retain the same hierarchy. This is a seeing pass by the implementing agent, not
an independent seeing pass.

## Readiness and nonclaims

DES evidence now supports **behaviorally complete** for the shared
`decision-*`/`action-inbox` contract. **Production-proven is not claimed.** This
PR does not prove real queue eligibility, authorization, persistence conflicts,
durable telemetry, or a live consumer refresh. George remains unchanged and its
routes retain the readiness recorded in the admin consistency audit until a
separate consuming-product slice supplies live evidence.

Requested model: `opus` (commission launch request).
Served model: `unknown` (not exposed by the bridge or receipt).
Independent judge: `false`.
Promotion authority: `none`.
Verdict: `candidate`.
