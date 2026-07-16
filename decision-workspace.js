/**
 * Framework-neutral behavior for the existing DES decision-* and action-inbox
 * families. Products provide persistence; this controller owns interaction
 * state, transition semantics, continuity, and stable events.
 */

const ACTION_NAMES = new Set(["resolve", "defer"]);

function copyRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...value } : {};
}

function copyContinuity(continuity = {}) {
  return {
    drafts: copyRecord(continuity.drafts),
    filters: copyRecord(continuity.filters),
    listPosition: {
      anchorId: continuity.listPosition?.anchorId ?? null,
      scrollTop: Number.isFinite(continuity.listPosition?.scrollTop)
        ? Math.max(0, continuity.listPosition.scrollTop)
        : 0,
    },
    openItemId: continuity.openItemId ?? null,
    selectedIds: [...new Set(continuity.selectedIds || [])],
  };
}

function requireText(value, field, itemId) {
  if (typeof value !== "string" || !value.trim()) {
    throw new TypeError(`decision item '${itemId}' requires ${field}`);
  }
  return value;
}

function normalizeAction(action, name, itemId) {
  const normalized = {
    consequence: requireText(action?.consequence, `actions.${name}.consequence`, itemId),
    label: requireText(action?.label, `actions.${name}.label`, itemId),
    reversible: action?.reversible !== false,
  };
  if (!normalized.reversible) {
    normalized.nonReversibleReason = requireText(
      action?.nonReversibleReason,
      `actions.${name}.nonReversibleReason`,
      itemId,
    );
  }
  return normalized;
}

function normalizeItem(item) {
  const id = requireText(item?.id, "id", "unknown");
  if (!Array.isArray(item.evidence) || item.evidence.length === 0) {
    throw new TypeError(`decision item '${id}' requires at least one evidence record`);
  }
  return {
    ...item,
    actions: {
      resolve: normalizeAction(item.actions?.resolve, "resolve", id),
      defer: normalizeAction(item.actions?.defer, "defer", id),
    },
    authorityReason: requireText(item.authorityReason, "authorityReason", id),
    decidingText: requireText(item.decidingText, "decidingText", id),
    evidence: item.evidence.map((evidence, index) => ({
      ...evidence,
      id: evidence.id || `${id}-evidence-${index + 1}`,
      label: requireText(evidence.label, `evidence[${index}].label`, id),
    })),
    history: Array.isArray(item.history) ? item.history.map((entry) => ({ ...entry })) : [],
    id,
    status: item.status || "pending",
    title: requireText(item.title, "title", id),
  };
}

function normalizeItems(items) {
  if (!Array.isArray(items)) throw new TypeError("decision workspace items must be an array");
  const normalized = items.map(normalizeItem);
  const ids = normalized.map((item) => item.id);
  if (new Set(ids).size !== ids.length) throw new TypeError("decision workspace item ids must be unique");
  return normalized;
}

function errorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return typeof error === "string" && error ? error : "The action could not be completed.";
}

export class DecisionWorkspaceController {
  constructor({ items = [], continuity, operations = {}, onEvent, now = () => new Date().toISOString() } = {}) {
    this.operations = operations;
    this.onEvent = onEvent;
    this.now = now;
    this.listeners = new Set();
    this.inFlight = false;
    this.state = this.#withViewState({
      ...copyContinuity(continuity),
      items: normalizeItems(items),
      transition: { phase: "idle" },
    });

    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  getState() {
    return this.state;
  }

  getContinuity() {
    const { drafts, filters, listPosition, openItemId, selectedIds } = this.state;
    return copyContinuity({ drafts, filters, listPosition, openItemId, selectedIds });
  }

  subscribe(listener) {
    if (typeof listener !== "function") throw new TypeError("decision workspace listener must be a function");
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  openItem(itemId) {
    const nextId = itemId === null ? null : this.#requireItem(itemId).id;
    if (nextId === this.state.openItemId) return;
    this.#update({ openItemId: nextId }, "decision:open", { itemId: nextId });
  }

  toggleSelection(itemId, selected) {
    this.#requireItem(itemId);
    const ids = new Set(this.state.selectedIds);
    const shouldSelect = selected ?? !ids.has(itemId);
    if (shouldSelect) ids.add(itemId);
    else ids.delete(itemId);
    this.#update(
      { selectedIds: [...ids] },
      "selection:change",
      { itemId, selected: shouldSelect, selectedCount: ids.size },
    );
  }

  setFilters(filters, { replace = false } = {}) {
    const next = replace ? copyRecord(filters) : { ...this.state.filters, ...copyRecord(filters) };
    this.#update({ filters: next }, "filter:change", { keys: Object.keys(filters || {}), replace });
  }

  setDraft(itemId, draft) {
    this.#requireKnownId(itemId);
    const drafts = { ...this.state.drafts, [itemId]: String(draft ?? "") };
    this.#update(
      { drafts },
      "draft:change",
      { itemId, hasDraft: Boolean(drafts[itemId]), length: drafts[itemId].length },
    );
  }

  setListPosition({ anchorId = null, scrollTop = 0 } = {}) {
    const listPosition = {
      anchorId,
      scrollTop: Number.isFinite(scrollTop) ? Math.max(0, scrollTop) : 0,
    };
    this.#update({ listPosition }, "list-position:change", listPosition);
  }

  clearTransition() {
    this.#update({ transition: { phase: "idle" } }, "transition:clear", {});
  }

  resolve(itemId, options = {}) {
    return this.#perform("resolve", itemId, options, false);
  }

  defer(itemId, options = {}) {
    return this.#perform("defer", itemId, options, false);
  }

  retry() {
    const retry = this.state.transition.phase === "error" ? this.state.transition.retry : null;
    if (!retry) return Promise.resolve(this.state.transition);
    if (retry.kind === "undo") {
      this.state = this.#withViewState({
        ...this.state,
        transition: { phase: "success", receipt: retry.undoReceipt },
      });
      this.#emit("undo:retry", { action: retry.undoReceipt.action, itemId: retry.undoReceipt.itemId });
      return this.undo();
    }
    this.#emit("action:retry", { action: retry.action, itemId: retry.itemId });
    return this.#perform(retry.action, retry.itemId, retry.options, true);
  }

  async undo() {
    const receipt = this.state.transition.phase === "success" ? this.state.transition.receipt : null;
    if (!receipt?.undo?.available) {
      this.#emit("undo:unavailable", {
        itemId: receipt?.itemId ?? null,
        reason: receipt?.undo?.reason || "There is no reversible action to undo.",
      });
      return this.state.transition;
    }
    if (this.inFlight) return this.state.transition;

    this.inFlight = true;
    this.#update(
      { transition: { phase: "undoing", receipt } },
      "undo:start",
      { action: receipt.action, itemId: receipt.itemId },
    );
    try {
      const result = await this.operations.undo({
        action: receipt.action,
        item: receipt.previousItem,
        itemId: receipt.itemId,
        result: receipt.operationResult,
        undoToken: receipt.undoToken,
      });
      const restored = result?.item ? normalizeItem(result.item) : receipt.previousItem;
      const items = [...this.state.items];
      const currentIndex = items.findIndex((item) => item.id === receipt.itemId);
      if (currentIndex >= 0) items[currentIndex] = restored;
      else items.splice(Math.min(receipt.previousIndex, items.length), 0, restored);
      const undoReceipt = {
        action: "undo",
        consequence: result?.consequence || "The previous queue state was restored.",
        itemId: receipt.itemId,
        kind: "undo",
        message: result?.message || "Action undone",
        undo: { available: false, reason: "An undo operation cannot itself be undone here." },
      };
      this.#update(
        { items, transition: { phase: "success", receipt: undoReceipt } },
        "undo:success",
        { action: receipt.action, itemId: receipt.itemId },
      );
    } catch (error) {
      this.#update(
        {
          transition: {
            error: errorMessage(error),
            phase: "error",
            retry: { kind: "undo", undoReceipt: receipt },
          },
        },
        "undo:error",
        { action: receipt.action, itemId: receipt.itemId, message: errorMessage(error) },
      );
    } finally {
      this.inFlight = false;
    }
    return this.state.transition;
  }

  reconcile(items, { source = "refresh" } = {}) {
    const nextItems = normalizeItems(items);
    this.#update(
      { items: nextItems },
      "refresh:reconciled",
      {
        incomingCount: nextItems.length,
        openItemPresent: nextItems.some((item) => item.id === this.state.openItemId),
        source,
      },
    );
  }

  async #perform(action, itemId, options, retrying) {
    if (!ACTION_NAMES.has(action)) throw new TypeError(`unsupported decision action '${action}'`);
    if (this.inFlight) return this.state.transition;
    const item = this.#requireItem(itemId);
    const operation = this.operations[action];
    const actionContract = item.actions[action];
    const safeOptions = copyRecord(options);
    const previousIndex = this.state.items.findIndex((entry) => entry.id === itemId);

    this.inFlight = true;
    this.#update(
      { transition: { action, itemId, phase: "loading", retrying } },
      "action:start",
      { action, itemId, retrying },
    );
    try {
      if (typeof operation !== "function") {
        throw new Error(`No product persistence handler is bound for '${action}'.`);
      }
      const result = (await operation({ action, item, itemId, options: safeOptions })) || {};
      let items = [...this.state.items];
      if (result.remove) items = items.filter((entry) => entry.id !== itemId);
      else if (result.item) {
        const currentIndex = items.findIndex((entry) => entry.id === itemId);
        const nextItem = normalizeItem(result.item);
        if (currentIndex >= 0) items[currentIndex] = nextItem;
        else items.splice(Math.min(previousIndex, items.length), 0, nextItem);
      }

      const reversible = result.reversible ?? actionContract.reversible;
      const undoBound = typeof this.operations.undo === "function";
      const undo = reversible
        ? {
            available: undoBound,
            reason: undoBound ? null : "Undo is unavailable because the product did not bind an undo handler.",
          }
        : {
            available: false,
            reason: result.nonReversibleReason
              || actionContract.nonReversibleReason
              || "Product persistence reported that the completed operation cannot be reversed.",
          };
      const receipt = {
        action,
        consequence: result.consequence || actionContract.consequence,
        itemId,
        kind: "action",
        message: result.message || `${actionContract.label} complete`,
        operationResult: result,
        previousIndex,
        previousItem: item,
        undo,
        undoToken: result.undoToken,
      };
      this.#update(
        { items, transition: { phase: "success", receipt } },
        "action:success",
        { action, itemId, reversible, removed: Boolean(result.remove) },
      );
    } catch (error) {
      this.#update(
        {
          transition: {
            action,
            error: errorMessage(error),
            itemId,
            phase: "error",
            retry: { action, itemId, options: safeOptions },
          },
        },
        "action:error",
        { action, itemId, message: errorMessage(error) },
      );
    } finally {
      this.inFlight = false;
    }
    return this.state.transition;
  }

  #requireItem(itemId) {
    const item = this.state.items.find((entry) => entry.id === itemId);
    if (!item) throw new RangeError(`unknown decision item '${itemId}'`);
    return item;
  }

  #requireKnownId(itemId) {
    if (this.state.items.some((item) => item.id === itemId)) return;
    if (this.state.openItemId === itemId || Object.hasOwn(this.state.drafts, itemId)) return;
    throw new RangeError(`unknown decision item '${itemId}'`);
  }

  #withViewState(state) {
    let viewState = "ready";
    if (state.transition.phase === "loading" || state.transition.phase === "undoing") viewState = "loading";
    else if (state.transition.phase === "error") viewState = "error";
    else if (state.transition.phase === "success") viewState = "success";
    else if (state.items.length === 0) viewState = "empty";
    return { ...state, viewState };
  }

  #update(patch, type, detail) {
    this.state = this.#withViewState({ ...this.state, ...patch });
    this.#emit(type, detail);
  }

  #emit(type, detail) {
    const event = { at: this.now(), detail, type };
    for (const listener of this.listeners) listener(this.state, event);
    this.onEvent?.(event);
  }
}

export function createDecisionWorkspace(options) {
  return new DecisionWorkspaceController(options);
}
