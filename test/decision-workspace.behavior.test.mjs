import assert from "node:assert/strict";
import test from "node:test";

import { createDecisionWorkspace } from "../decision-workspace.js";

function item(id = "decision-1", overrides = {}) {
  return {
    id,
    title: `Decision ${id}`,
    authorityReason: "A person must choose the acceptable operational tradeoff.",
    decidingText: "Choose whether the bounded change should proceed with the attached evidence.",
    evidence: [{ id: `${id}-e1`, label: "Observed impact", detail: "The complete evidence remains disclosed." }],
    history: [{ at: "2026-07-16T12:00:00Z", label: "Created" }],
    actions: {
      resolve: {
        label: "Resolve",
        consequence: "Records the decision and removes it from the active inbox.",
        reversible: true,
      },
      defer: {
        label: "Defer",
        consequence: "Returns the decision to the inbox after the requested review window.",
        reversible: true,
      },
    },
    ...overrides,
  };
}

test("resolve exposes loading then success and emits stable persistence/telemetry hooks", async () => {
  let finish;
  const calls = [];
  const events = [];
  const controller = createDecisionWorkspace({
    items: [item()],
    now: () => "2026-07-16T12:30:00Z",
    onEvent: (event) => events.push(event),
    operations: {
      resolve: (context) => {
        calls.push(context);
        return new Promise((resolve) => { finish = resolve; });
      },
      undo: () => ({}),
    },
  });

  const pending = controller.resolve("decision-1", { note: "Proceed within the bounded scope." });
  assert.equal(controller.getState().viewState, "loading");
  assert.equal(controller.getState().transition.action, "resolve");
  assert.equal(calls[0].itemId, "decision-1");
  assert.deepEqual(calls[0].options, { note: "Proceed within the bounded scope." });

  finish({ remove: true, message: "Decision resolved", undoToken: "undo-1" });
  await pending;

  assert.equal(controller.getState().viewState, "success");
  assert.equal(controller.getState().items.length, 0);
  assert.equal(controller.getState().transition.receipt.undo.available, true);
  assert.deepEqual(events.map((event) => event.type), ["action:start", "action:success"]);
  assert.equal(events[1].at, "2026-07-16T12:30:00Z");
});

test("failure keeps the item actionable and retry repeats the same callback deterministically", async () => {
  let attempts = 0;
  const controller = createDecisionWorkspace({
    items: [item()],
    operations: {
      defer: () => {
        attempts += 1;
        if (attempts === 1) throw new Error("Persistence is temporarily unavailable");
        return { remove: true, message: "Deferred until new evidence", undoToken: "defer-1" };
      },
      undo: () => ({}),
    },
  });

  await controller.defer("decision-1", { until: "new-evidence" });
  assert.equal(controller.getState().viewState, "error");
  assert.equal(controller.getState().transition.error, "Persistence is temporarily unavailable");
  assert.equal(controller.getState().items.length, 1);

  await controller.retry();
  assert.equal(attempts, 2);
  assert.equal(controller.getState().viewState, "success");
  assert.equal(controller.getState().items.length, 0);
  assert.equal(controller.getState().transition.receipt.action, "defer");
});

test("empty is a deterministic state after the final success receipt is dismissed", async () => {
  const controller = createDecisionWorkspace({
    items: [item()],
    operations: {
      resolve: () => ({ remove: true, reversible: false, nonReversibleReason: "The fixture is final." }),
    },
  });

  await controller.resolve("decision-1");
  assert.equal(controller.getState().viewState, "success");
  controller.clearTransition();
  assert.equal(controller.getState().viewState, "empty");
});

test("reversible success can be undone through the product callback", async () => {
  const undoCalls = [];
  const original = item();
  const controller = createDecisionWorkspace({
    items: [original],
    operations: {
      resolve: () => ({ remove: true, undoToken: { revision: 7 } }),
      undo: (context) => {
        undoCalls.push(context);
        return { message: "Decision restored" };
      },
    },
  });

  await controller.resolve("decision-1");
  await controller.undo();

  assert.equal(undoCalls.length, 1);
  assert.deepEqual(undoCalls[0].undoToken, { revision: 7 });
  assert.equal(controller.getState().items[0].id, "decision-1");
  assert.equal(controller.getState().transition.receipt.message, "Decision restored");
  assert.equal(controller.getState().transition.receipt.undo.available, false);
});

test("a failed undo can retry the undo without repeating the original action", async () => {
  let resolveCalls = 0;
  let undoCalls = 0;
  const controller = createDecisionWorkspace({
    items: [item()],
    operations: {
      resolve: () => {
        resolveCalls += 1;
        return { remove: true, undoToken: "undo-on-retry" };
      },
      undo: () => {
        undoCalls += 1;
        if (undoCalls === 1) throw new Error("Undo persistence timed out");
        return { message: "Restored after retry" };
      },
    },
  });

  await controller.resolve("decision-1");
  await controller.undo();
  assert.equal(controller.getState().transition.error, "Undo persistence timed out");
  await controller.retry();

  assert.equal(resolveCalls, 1);
  assert.equal(undoCalls, 2);
  assert.equal(controller.getState().items[0].id, "decision-1");
  assert.equal(controller.getState().transition.receipt.message, "Restored after retry");
});

test("non-reversible action keeps an explicit consequence and never offers false undo", async () => {
  const irreversible = item("decision-2", {
    actions: {
      resolve: {
        label: "Publish final decision",
        consequence: "Publishes the signed decision to an external immutable ledger.",
        reversible: false,
        nonReversibleReason: "The external ledger is immutable after publication.",
      },
      defer: {
        label: "Defer",
        consequence: "Returns the decision after the review window.",
        reversible: true,
      },
    },
  });
  let undoCalls = 0;
  const controller = createDecisionWorkspace({
    items: [irreversible],
    operations: {
      resolve: () => ({ remove: true, message: "Published" }),
      undo: () => { undoCalls += 1; },
    },
  });

  await controller.resolve("decision-2");
  const { receipt } = controller.getState().transition;
  assert.equal(receipt.consequence, "Publishes the signed decision to an external immutable ledger.");
  assert.equal(receipt.undo.available, false);
  assert.equal(receipt.undo.reason, "The external ledger is immutable after publication.");
  await controller.undo();
  assert.equal(undoCalls, 0);
});

test("refresh reconciliation uses product data without overwriting interaction continuity", () => {
  const controller = createDecisionWorkspace({ items: [item(), item("decision-2")] });
  controller.setFilters({ project: "alpha", query: "release" });
  controller.openItem("decision-1");
  controller.toggleSelection("decision-2", true);
  controller.setDraft("decision-1", "A note that is not yet persisted.");
  controller.setListPosition({ anchorId: "decision-2", scrollTop: 420 });

  controller.reconcile([
    item("decision-1", { status: "updated", title: "Updated server title" }),
    item("decision-3"),
  ]);

  const state = controller.getState();
  assert.deepEqual(state.items.map(({ id }) => id), ["decision-1", "decision-3"]);
  assert.equal(state.items[0].title, "Updated server title");
  assert.deepEqual(state.filters, { project: "alpha", query: "release" });
  assert.equal(state.openItemId, "decision-1");
  assert.deepEqual(state.selectedIds, ["decision-2"]);
  assert.equal(state.drafts["decision-1"], "A note that is not yet persisted.");
  assert.deepEqual(state.listPosition, { anchorId: "decision-2", scrollTop: 420 });
});

test("open item and bulk selection remain independent through action completion and refresh", async () => {
  const controller = createDecisionWorkspace({
    items: [item(), item("decision-2")],
    operations: {
      defer: () => ({ remove: true, undoToken: "defer-1" }),
      undo: () => ({}),
    },
  });
  controller.openItem("decision-1");
  controller.openItem("decision-1");
  controller.toggleSelection("decision-2", true);
  controller.setDraft("decision-1", "Keep this draft through the transition.");
  controller.setFilters({ status: "pending" });
  controller.setListPosition({ anchorId: "decision-1", scrollTop: 180 });

  await controller.defer("decision-1");
  controller.reconcile([item("decision-2")]);

  const state = controller.getState();
  assert.equal(state.openItemId, "decision-1");
  assert.deepEqual(state.selectedIds, ["decision-2"]);
  assert.equal(state.drafts["decision-1"], "Keep this draft through the transition.");
  assert.deepEqual(state.filters, { status: "pending" });
  assert.deepEqual(state.listPosition, { anchorId: "decision-1", scrollTop: 180 });
  assert.equal(state.transition.receipt.undo.available, true);
});

test("items cannot omit collapsed authority, deciding text, evidence, or non-reversible explanation", () => {
  assert.throws(
    () => createDecisionWorkspace({ items: [item("broken", { authorityReason: "" })] }),
    /authorityReason/,
  );
  assert.throws(
    () => createDecisionWorkspace({ items: [item("broken", { decidingText: "" })] }),
    /decidingText/,
  );
  assert.throws(
    () => createDecisionWorkspace({ items: [item("broken", { evidence: [] })] }),
    /evidence record/,
  );
  const broken = item("broken");
  broken.actions.resolve = { ...broken.actions.resolve, reversible: false };
  assert.throws(() => createDecisionWorkspace({ items: [broken] }), /nonReversibleReason/);
});
