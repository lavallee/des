import { createDecisionWorkspace } from "./decision-workspace.js";

const params = new URLSearchParams(location.search);
const auditMode = params.get("audit") === "1";
const storageKey = "des:decision-workspace-showcase:continuity";
const root = document.querySelector("#decision-workspace-demo");
const eventCount = document.querySelector("#event-count");
const themeSelect = document.querySelector("#scenario-theme");

const fixtureItems = [
  {
    id: "retention-window",
    title: "Choose the retention window for completed operational records",
    status: "pending",
    authorityReason: "Automation cannot choose the acceptable tradeoff between auditability, storage cost, and deletion obligations.",
    decidingText: "Set the default retention window for completed records. The choice applies only to future completion events; existing legal holds and product-owned deletion rules remain unchanged. Choose 90 days when routine audit access outweighs storage cost, or defer until the compliance owner supplies the missing jurisdiction note.",
    evidence: [
      { id: "retention-usage", label: "Observed access pattern", detail: "Ninety-four percent of completed records are reopened within 45 days; two percent are reopened after 90 days." },
      { id: "retention-cost", label: "Projected consequence", detail: "A 90-day default adds an estimated 8 percent to storage while retaining the full routine audit window." },
    ],
    history: [
      { at: "10:42", label: "Eligibility checked", detail: "Fresh evidence and an accountable owner are present." },
      { at: "10:47", label: "Automation stopped", detail: "The policy tradeoff requires human authority." },
    ],
    actions: {
      resolve: { label: "Resolve at 90 days", consequence: "Records the decision, removes this item from the active inbox, and allows configuration work to continue.", reversible: true },
      defer: { label: "Defer for evidence", consequence: "Removes the item until new compliance evidence arrives; the current configuration does not change.", reversible: true },
    },
  },
  {
    id: "external-publication",
    title: "Authorize publication of the signed interoperability decision",
    status: "ready",
    authorityReason: "Publication creates an external commitment under the accountable owner's name and cannot be made by the system.",
    decidingText: "Publish the complete signed interoperability decision and its evidence digest to the external registry. Publication confirms the stated compatibility boundary and creates a permanent public record. Verify the evidence and note before using the primary action; the registry does not support deletion or replacement.",
    evidence: [
      { id: "signature", label: "Signature check", detail: "The accountable owner signature and digest match the current decision revision." },
      { id: "compatibility", label: "Compatibility evidence", detail: "All required deterministic checks passed against the bounded interface contract." },
    ],
    history: [
      { at: "Yesterday", label: "Draft completed", detail: "The full deciding text was signed and locked." },
      { at: "09:15", label: "Registry check", detail: "The destination is reachable and reports append-only behavior." },
    ],
    actions: {
      resolve: { label: "Publish final decision", consequence: "Publishes the signed decision to the append-only external registry.", reversible: false, nonReversibleReason: "The external registry is immutable after publication." },
      defer: { label: "Defer publication", consequence: "Keeps the signed record private and returns it after new evidence or the selected review window.", reversible: true },
    },
  },
];

let controller;
let unsubscribe = () => {};
let serverItems;
let eventTotal = 0;
let externalResolveAttempts = 0;

const clone = (value) => structuredClone(value);
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function restoredContinuity() {
  const urlContinuity = {
    filters: {
      query: params.get("q") || "",
      status: params.get("status") || "all",
    },
  };
  if (auditMode) return { ...urlContinuity, openItemId: "retention-window" };
  try {
    return JSON.parse(sessionStorage.getItem(storageKey)) || urlContinuity;
  } catch {
    return urlContinuity;
  }
}

function persistContinuity() {
  if (!auditMode) sessionStorage.setItem(storageKey, JSON.stringify(controller.getContinuity()));
  const continuity = controller.getContinuity();
  params.set("q", String(continuity.filters.query || ""));
  params.set("status", String(continuity.filters.status || "all"));
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
}

function productOperations() {
  return {
    async resolve({ item, options }) {
      await wait(220);
      if (item.id === "external-publication") externalResolveAttempts += 1;
      if (item.id === "external-publication" && externalResolveAttempts === 1) {
        throw new Error("The registry rejected the first write. Verify connectivity, then retry the same bounded action.");
      }
      serverItems.delete(item.id);
      return {
        remove: true,
        message: item.actions.resolve.label === "Publish final decision" ? "Final decision published" : "Decision resolved",
        consequence: item.actions.resolve.consequence,
        nonReversibleReason: item.actions.resolve.nonReversibleReason,
        reversible: item.actions.resolve.reversible,
        undoToken: item.actions.resolve.reversible ? { id: item.id, note: options.note || "" } : undefined,
      };
    },
    async defer({ item, options }) {
      await wait(220);
      serverItems.delete(item.id);
      return {
        remove: true,
        message: "Decision deferred",
        consequence: options.note
          ? `${item.actions.defer.consequence} The in-progress note was retained in continuity.`
          : item.actions.defer.consequence,
        reversible: true,
        undoToken: { id: item.id },
      };
    },
    async undo({ item }) {
      await wait(160);
      serverItems.set(item.id, clone(item));
      return { item: clone(item), message: "Previous queue state restored" };
    },
  };
}

function resetScenario({ clearContinuity = true } = {}) {
  unsubscribe();
  serverItems = new Map(fixtureItems.map((item) => [item.id, clone(item)]));
  eventTotal = 0;
  externalResolveAttempts = 0;
  if (clearContinuity && !auditMode) sessionStorage.removeItem(storageKey);
  controller = createDecisionWorkspace({
    items: [...serverItems.values()],
    continuity: restoredContinuity(),
    operations: productOperations(),
    onEvent(event) {
      eventTotal += 1;
      eventCount.textContent = `${eventTotal} stable event${eventTotal === 1 ? "" : "s"}`;
      if (["filter:change", "draft:change", "decision:open", "selection:change", "list-position:change"].includes(event.type)) {
        persistContinuity();
      }
    },
  });
  unsubscribe = controller.subscribe((_state, event) => {
    if (event.type !== "list-position:change") render();
  });
  eventCount.textContent = "0 stable events";
  render();
}

function visibleItems(state) {
  const query = String(state.filters.query || "").trim().toLowerCase();
  const status = String(state.filters.status || "all");
  return state.items.filter((item) => {
    const matchesQuery = !query || [item.title, item.authorityReason, item.decidingText]
      .some((value) => value.toLowerCase().includes(query));
    return matchesQuery && (status === "all" || item.status === status);
  });
}

function transitionMarkup(state) {
  const transition = state.transition;
  if (transition.phase === "loading" || transition.phase === "undoing") {
    const verb = transition.phase === "undoing" ? "Restoring the previous queue state" : `${transition.action === "defer" ? "Deferring" : "Resolving"} the decision`;
    return `<div class="action-inbox__status is-loading" role="status" aria-live="polite"><strong>${verb}…</strong><br>Controls remain visible and duplicate submissions are disabled.</div>`;
  }
  if (transition.phase === "error") {
    return `<div class="action-inbox__status is-error" id="workspace-error" role="alert" tabindex="-1"><strong>Action failed.</strong> ${escapeHtml(transition.error)}<div class="action-inbox__status-actions"><button class="btn btn--primary btn--sm" id="workspace-retry" type="button">Retry action</button><button class="btn btn--ghost btn--sm" id="workspace-dismiss" type="button">Dismiss</button></div></div>`;
  }
  if (transition.phase === "success") {
    const receipt = transition.receipt;
    const undo = receipt.undo?.available
      ? `<button class="btn btn--secondary btn--sm" id="workspace-undo" type="button">Undo</button>`
      : `<div class="action-inbox__undo-policy"><strong>Undo unavailable:</strong> ${escapeHtml(receipt.undo?.reason || "This result is not reversible.")}</div>`;
    return `<div class="action-inbox__status is-success" role="status" aria-live="polite"><strong>${escapeHtml(receipt.message)}.</strong> ${escapeHtml(receipt.consequence)}<div class="action-inbox__status-actions">${undo}<button class="btn btn--ghost btn--sm" id="workspace-dismiss" type="button">Dismiss receipt</button></div></div>`;
  }
  return "";
}

function evidenceMarkup(item) {
  return item.evidence.map((evidence) => `<li><strong>${escapeHtml(evidence.label)}.</strong> ${escapeHtml(evidence.detail || "Open the product evidence destination.")}</li>`).join("");
}

function historyMarkup(item) {
  if (!item.history.length) return "<li>No prior history.</li>";
  return item.history.map((entry) => `<li><strong>${escapeHtml(entry.at)} · ${escapeHtml(entry.label)}.</strong> ${escapeHtml(entry.detail || "")}</li>`).join("");
}

function itemMarkup(item, state, busy) {
  const open = state.openItemId === item.id;
  const selected = state.selectedIds.includes(item.id);
  const note = state.drafts[item.id] || "";
  const resolveAction = item.actions.resolve;
  const deferAction = item.actions.defer;
  const statusIntent = item.status === "ready" ? "success" : "warning";
  return `<div class="action-record-row" data-record-row="${escapeHtml(item.id)}">
    <div class="action-record__selection"><input type="checkbox" data-select="${escapeHtml(item.id)}" aria-label="Select ${escapeHtml(item.title)} for a separate bounded bulk operation" ${selected ? "checked" : ""}></div>
    <details class="action-record" data-record="${escapeHtml(item.id)}" ${open ? "open" : ""}>
      <summary id="summary-${escapeHtml(item.id)}">
        <span class="action-record__summary-copy">
          <span class="action-record__title">${escapeHtml(item.title)}</span>
          <span class="action-record__summary-meta">${escapeHtml(item.status)} · complete record available in place</span>
          <span class="action-record__authority"><strong>Why human authority is required:</strong> ${escapeHtml(item.authorityReason)}</span>
        </span>
        <span class="badge badge--${statusIntent}">${escapeHtml(item.status)}</span>
      </summary>
      <div class="action-record__body">
        <div class="action-record__body-grid">
          <div>
            <section class="action-record__section" aria-labelledby="deciding-${escapeHtml(item.id)}">
              <span class="action-record__section-label" id="deciding-${escapeHtml(item.id)}">Full deciding text</span>
              <p class="action-record__deciding-text">${escapeHtml(item.decidingText)}</p>
            </section>
            <section class="action-record__section" aria-labelledby="evidence-${escapeHtml(item.id)}">
              <span class="action-record__section-label" id="evidence-${escapeHtml(item.id)}">Deciding evidence</span>
              <ul class="action-record__evidence">${evidenceMarkup(item)}</ul>
            </section>
          </div>
          <div>
            <section class="action-record__section" aria-labelledby="history-${escapeHtml(item.id)}">
              <span class="action-record__section-label" id="history-${escapeHtml(item.id)}">History</span>
              <ul class="action-record__history">${historyMarkup(item)}</ul>
            </section>
            <section class="action-record__section">
              <label class="action-record__section-label" for="note-${escapeHtml(item.id)}">In-progress note</label>
              <textarea class="action-record__note" id="note-${escapeHtml(item.id)}" data-note="${escapeHtml(item.id)}" placeholder="Add reasoning before acting">${escapeHtml(note)}</textarea>
            </section>
          </div>
        </div>
        <div class="action-record__actions">
          <div class="action-record__action">
            <span class="action-record__section-label">Primary action</span>
            <button class="btn btn--primary" id="resolve-${escapeHtml(item.id)}" data-action="resolve" data-item-id="${escapeHtml(item.id)}" type="button" ${busy ? "disabled" : ""}>${escapeHtml(resolveAction.label)}</button>
            <span class="action-record__consequence">${escapeHtml(resolveAction.consequence)}</span>
            ${resolveAction.reversible ? "" : `<span class="action-record__consequence"><strong>Not reversible:</strong> ${escapeHtml(resolveAction.nonReversibleReason)}</span>`}
          </div>
          <div class="action-record__action">
            <span class="action-record__section-label">Secondary consequence</span>
            <button class="btn btn--secondary" id="defer-${escapeHtml(item.id)}" data-action="defer" data-item-id="${escapeHtml(item.id)}" type="button" ${busy ? "disabled" : ""}>${escapeHtml(deferAction.label)}</button>
            <span class="action-record__consequence">${escapeHtml(deferAction.consequence)}</span>
          </div>
        </div>
      </div>
    </details>
  </div>`;
}

function render() {
  const state = controller.getState();
  const items = visibleItems(state);
  const busy = state.transition.phase === "loading" || state.transition.phase === "undoing";
  const active = document.activeElement;
  const focusId = active?.id || null;
  const focusSelection = active && "selectionStart" in active
    ? { end: active.selectionEnd, start: active.selectionStart }
    : null;

  root.innerHTML = `<div class="action-inbox" data-workspace-ready="true">
    <aside class="action-inbox__filters" aria-label="Filter decisions">
      <div class="action-inbox__filter-heading">Queue contract</div>
      <p class="action-inbox__hint">Every row is fresh, unsettled, evidence-backed, and stopped on a choice reserved for human authority.</p>
      <label for="workspace-query">Search<input id="workspace-query" type="search" value="${escapeHtml(state.filters.query || "")}" placeholder="Decision or authority reason"></label>
      <label for="workspace-status">Status<select id="workspace-status"><option value="all" ${state.filters.status === "all" ? "selected" : ""}>All statuses</option><option value="pending" ${state.filters.status === "pending" ? "selected" : ""}>Pending</option><option value="ready" ${state.filters.status === "ready" ? "selected" : ""}>Ready</option></select></label>
      <button class="btn btn--ghost btn--sm" id="workspace-clear" type="button">Clear filters</button>
      <p class="action-inbox__hint"><kbd class="kbd">/</kbd> focuses search. Filters are reflected in the URL; continuity is persisted by this showcase adapter.</p>
    </aside>
    <section class="action-inbox__results" aria-label="Decision records" aria-busy="${busy}">
      <div class="action-inbox__results-heading"><span><b>${items.length}</b> shown</span><span>${state.selectedIds.length} selected independently</span></div>
      ${transitionMarkup(state)}
      ${items.length === 0 ? `<div class="action-inbox__empty"><strong>No active decisions match.</strong><br>${state.items.length === 0 ? "Product refresh confirms that the bounded inbox is clear." : "Clear or change the filters to return decisions to view."}</div>` : ""}
      <div class="action-inbox__records" id="workspace-records">${items.map((item) => itemMarkup(item, state, busy)).join("")}</div>
    </section>
  </div>`;

  const records = root.querySelector("#workspace-records");
  if (records) {
    records.scrollTop = state.listPosition.scrollTop;
    records.addEventListener("scroll", () => {
      const firstVisible = [...records.querySelectorAll("[data-record-row]")]
        .find((row) => row.offsetTop + row.offsetHeight >= records.scrollTop);
      controller.setListPosition({
        anchorId: firstVisible?.dataset.recordRow || null,
        scrollTop: records.scrollTop,
      });
    }, { passive: true });
  }

  if (focusId) {
    const nextFocus = document.getElementById(focusId);
    nextFocus?.focus({ preventScroll: true });
    if (nextFocus && focusSelection && "setSelectionRange" in nextFocus) {
      nextFocus.setSelectionRange(focusSelection.start, focusSelection.end);
    }
  }
  if (state.transition.phase === "error" && !focusId?.startsWith("workspace-error")) {
    root.querySelector("#workspace-error")?.focus({ preventScroll: true });
  }
}

root.addEventListener("toggle", (event) => {
  if (!(event.target instanceof HTMLDetailsElement) || !event.target.dataset.record) return;
  const itemId = event.target.dataset.record;
  if ((event.target.open && controller.getState().openItemId !== itemId)
    || (!event.target.open && controller.getState().openItemId === itemId)) {
    controller.openItem(event.target.open ? itemId : null);
  }
}, true);

root.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches("[data-select]")) controller.toggleSelection(target.dataset.select, target.checked);
  if (target.id === "workspace-status") controller.setFilters({ status: target.value });
});

root.addEventListener("input", (event) => {
  const target = event.target;
  if (target.id === "workspace-query") controller.setFilters({ query: target.value });
  if (target.matches("[data-note]")) controller.setDraft(target.dataset.note, target.value);
});

root.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.id === "workspace-clear") controller.setFilters({ query: "", status: "all" }, { replace: true });
  else if (button.id === "workspace-retry") controller.retry();
  else if (button.id === "workspace-undo") controller.undo();
  else if (button.id === "workspace-dismiss") controller.clearTransition();
  else if (button.dataset.action) {
    const note = controller.getState().drafts[button.dataset.itemId] || "";
    controller[button.dataset.action](button.dataset.itemId, { note });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey
    && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
    event.preventDefault();
    document.querySelector("#workspace-query")?.focus();
  }
});

document.querySelector("#refresh-workspace").addEventListener("click", () => {
  controller.reconcile([...serverItems.values()].map(clone), { source: "showcase-product-refresh" });
});
document.querySelector("#reset-workspace").addEventListener("click", () => resetScenario());

themeSelect.value = document.documentElement.dataset.theme === "light" ? "light" : "dark";
themeSelect.addEventListener("change", () => {
  if (themeSelect.value === "light") document.documentElement.dataset.theme = "light";
  else document.documentElement.removeAttribute("data-theme");
  params.set("theme", themeSelect.value);
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
});

resetScenario({ clearContinuity: false });
