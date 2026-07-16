# Decision workspace behavior contract

Status: behaviorally complete reference; production proof still required

This contract completes the existing `decision-*` and `action-inbox` families.
It does not define another component family. The smallest adoption boundary is
the framework-neutral `decision-workspace.js` controller: a product can bind it
to existing DES CSS in React, another framework, or server-rendered HTML without
moving product data access into DES.

## Boundary

DES owns:

- independent open-item and bulk-selection state;
- filters, list position, open item, selection, and in-progress drafts;
- resolve/defer loading, success, empty, error, retry, and undo semantics;
- refresh reconciliation that replaces product data without resetting interaction
  continuity;
- validation that every item supplies an authority reason, full deciding text,
  evidence, both action consequences, and a reason for any irreversible action;
- stable subscription and event hooks.

The consuming product owns:

- eligibility, authority rules, domain wording, filtering, and ranking;
- fetching, authentication, authorization, persistence, conflict handling, and
  durable telemetry delivery;
- the `resolve`, `defer`, and `undo` handlers passed to the controller;
- URL or local-draft persistence using `getContinuity()` and the event stream;
- reconciliation input from its refresh mechanism.

DES never calls a product endpoint. An unbound operation becomes an explicit
error state rather than a simulated success.

## Package surface

```js
import { createDecisionWorkspace } from "@lavallee/des/decision-workspace";

const workspace = createDecisionWorkspace({
  items,
  continuity: restoredContinuity,
  operations: {
    resolve: ({ itemId, options }) => api.resolve(itemId, options),
    defer: ({ itemId, options }) => api.defer(itemId, options),
    undo: ({ undoToken }) => api.undo(undoToken),
  },
  onEvent: (event) => telemetry.record(event.type, event.detail),
});
```

`react/components.tsx` includes `useDecisionWorkspace(controller)` as a thin
`useSyncExternalStore` adapter. It intentionally does not fetch data or choose a
state-management library.

## Required item contract

Every decision item must provide:

| Field | Surface obligation |
|---|---|
| `title` | The complete human reference for the choice |
| `authorityReason` | Visible in the collapsed row; explains why automation stopped |
| `decidingText` | Full deciding text in the open record; never an inert ellipsis |
| `evidence[]` | One or more labeled evidence records, with detail or a destination |
| `history[]` | Optional typed history kept separate from deciding evidence |
| `actions.resolve` | Primary label, post-action consequence, reversibility policy |
| `actions.defer` | Secondary label, return consequence, reversibility policy |

An action with `reversible: false` must include `nonReversibleReason`. A
reversible success offers undo only when the product binds `operations.undo`.
The receipt explains either case explicitly.

## Interaction and state contract

`openItem(id)` (or `openItem(null)` to close) and `toggleSelection(id)` are
separate operations. Opening a row
does not check it, and checking a row does not open or close it. Consequential,
unlike decisions should normally omit bulk resolve controls even when a product
uses selection for a bounded homogeneous disposition elsewhere.

The public controller methods are:

- `openItem`, `toggleSelection`, `setFilters`, `setDraft`, and
  `setListPosition` for interaction state;
- `resolve`, `defer`, `retry`, `undo`, and `clearTransition` for action state;
- `reconcile(items)` for a product-provided refresh result;
- `getState`, `getContinuity`, and `subscribe` for framework and persistence
  adapters.

The state exposes `viewState` as `ready`, `loading`, `success`, `empty`, or
`error`. `undoing` is represented as the loading view with a distinct transition
phase. Resolve and defer handlers may return:

```js
{
  remove: true,
  message: "Decision resolved",
  consequence: "The gated work may now continue.",
  reversible: true,
  undoToken: "opaque-product-token"
}
```

DES retains continuity across action completion and `reconcile()`, including an
open item that has left the refreshed result set. This lets a success receipt
and reversible undo remain attached to the operator's action. The product can
clear that continuity deliberately when the operator leaves the task.

## Stable events

`subscribe(listener)` receives `(state, event)` for rendering or local
persistence. `onEvent(event)` receives the same event metadata without the full
state, which keeps drafts and deciding text out of telemetry by default.

Stable event names:

- `decision:open`, `selection:change`, `filter:change`, `draft:change`,
  `list-position:change`;
- `action:start`, `action:success`, `action:error`, `action:retry`;
- `undo:start`, `undo:success`, `undo:error`, `undo:retry`, `undo:unavailable`;
- `refresh:reconciled`, `transition:clear`.

Event detail contains identifiers, counts, phases, and error messages—not draft
contents or evidence text. Products may version their telemetry payload around
these hooks without forking the controller.

## Rendering obligations

The controller is necessary but not sufficient. A conforming composition must:

1. show `authorityReason` while the row is collapsed;
2. expose `decidingText`, evidence, and history in the open record;
3. distinguish the primary resolve action, secondary defer consequence, and
   evidence/history regions structurally and visually;
4. put transition messages in a polite live region and move focus to an error
   only when the operator initiates the failing action;
5. disable duplicate actions during loading without hiding the affected item;
6. render retry, undo, and the non-reversible explanation as working controls or
   explicit policy text;
7. render an empty explanation when the reconciled active set is empty;
8. retain keyboard focus, scroll/list position, filters, open state, and drafts
   during local rerenders and background refreshes.

`decision-workspace-showcase.html` is the runnable, product-agnostic reference.
Its persistence adapter is an in-memory fixture outside the controller. The
behavior tests cover the controller transitions; audit receipts cover both
themes at 1440, 768, and 390.

## Readiness claim

The controller, tests, React adapter, runnable showcase, and deterministic audit
are DES evidence for **behaviorally complete**. They do not show production
eligibility, durable authorization, real endpoint behavior, or use under a live
product workload. A consumer may claim **production-proven** only after its own
route completes the task against real persistence and supplies equivalent
functional, accessibility, console, overflow, continuity, and seeing evidence.
