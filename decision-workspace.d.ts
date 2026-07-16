export interface DecisionActionContract {
  label: string;
  consequence: string;
  reversible?: boolean;
  nonReversibleReason?: string;
}

export interface DecisionEvidence {
  id?: string;
  label: string;
  detail?: string;
  href?: string;
}

export interface DecisionHistoryEntry {
  at?: string;
  label?: string;
  detail?: string;
  [key: string]: unknown;
}

export interface DecisionItem {
  id: string;
  title: string;
  authorityReason: string;
  decidingText: string;
  status?: string;
  evidence: DecisionEvidence[];
  history?: DecisionHistoryEntry[];
  actions: { resolve: DecisionActionContract; defer: DecisionActionContract };
  [key: string]: unknown;
}

export interface DecisionContinuity {
  filters?: Record<string, unknown>;
  openItemId?: string | null;
  selectedIds?: string[];
  drafts?: Record<string, string>;
  listPosition?: { anchorId?: string | null; scrollTop?: number };
}

export interface DecisionOperationContext {
  action: "resolve" | "defer";
  item: DecisionItem;
  itemId: string;
  options: Record<string, unknown>;
}

export interface DecisionOperationResult {
  message?: string;
  consequence?: string;
  reversible?: boolean;
  nonReversibleReason?: string;
  undoToken?: unknown;
  item?: DecisionItem;
  remove?: boolean;
}

export interface DecisionUndoContext {
  action: "resolve" | "defer";
  item: DecisionItem;
  itemId: string;
  result: DecisionOperationResult;
  undoToken: unknown;
}

export interface DecisionWorkspaceEvent {
  at: string;
  type: string;
  detail: Record<string, unknown>;
}

export interface DecisionWorkspaceState extends Required<DecisionContinuity> {
  items: DecisionItem[];
  transition: Record<string, unknown> & { phase: "idle" | "loading" | "success" | "error" | "undoing" };
  viewState: "ready" | "loading" | "success" | "empty" | "error";
}

export interface DecisionWorkspaceOptions {
  items?: DecisionItem[];
  continuity?: DecisionContinuity;
  operations?: {
    resolve?: (context: DecisionOperationContext) => Promise<DecisionOperationResult> | DecisionOperationResult;
    defer?: (context: DecisionOperationContext) => Promise<DecisionOperationResult> | DecisionOperationResult;
    undo?: (context: DecisionUndoContext) => Promise<DecisionOperationResult> | DecisionOperationResult;
  };
  onEvent?: (event: DecisionWorkspaceEvent) => void;
  now?: () => string;
}

export class DecisionWorkspaceController {
  constructor(options?: DecisionWorkspaceOptions);
  getState(): DecisionWorkspaceState;
  getContinuity(): Required<DecisionContinuity>;
  subscribe(listener: (state: DecisionWorkspaceState, event: DecisionWorkspaceEvent) => void): () => void;
  openItem(itemId: string | null): void;
  toggleSelection(itemId: string, selected?: boolean): void;
  setFilters(filters: Record<string, unknown>, options?: { replace?: boolean }): void;
  setDraft(itemId: string, draft: string): void;
  setListPosition(position: { anchorId?: string | null; scrollTop?: number }): void;
  clearTransition(): void;
  resolve(itemId: string, options?: Record<string, unknown>): Promise<Record<string, unknown>>;
  defer(itemId: string, options?: Record<string, unknown>): Promise<Record<string, unknown>>;
  retry(): Promise<Record<string, unknown>>;
  undo(): Promise<Record<string, unknown>>;
  reconcile(items: DecisionItem[], options?: { source?: string }): void;
}

export function createDecisionWorkspace(options?: DecisionWorkspaceOptions): DecisionWorkspaceController;
