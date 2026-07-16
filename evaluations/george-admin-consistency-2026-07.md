# George admin consistency audit

Status: `candidate`
Date: `2026-07-16`
Owner: shared DES
Product audited: George production service at `http://dash-main:7879`
DES branch: `fab/mobbin-admin-consistency-audit`

## Commission result

George already has one shell and several strong task-specific compositions. The
family does not need a wholesale restyle or a universal page layout. It needs a
shared first-viewport contract: scope, operator task, current state/proof, and
next move/consequence. That gap repeats on seven of the ten audited routes and
applies beyond George, so this PR promotes **page-entry grammar** as a DES rule.
It deliberately does not add an operations or settings component family.

The most urgent George problem is upstream of presentation. `/triage` renders 76
records and repeats the branch-protection decision across many entries; the
production HTML contains 32 `branch-protection` mentions. `/projects` renders
203,000 visible text characters and produces a 100,448 px mobile capture.
`/admin/clusters` renders 145 independent registration/assignment forms and a
39,686 px mobile capture. Pagination would hide these defects, not repair them.

No George files were edited.

## Evidence contract and coordinates

The service health coordinate returned
`{"ok":true,"version":"0.0.1","host":"dash-main"}`. The deployed commit is not
exposed, so the baseline revision is recorded as `dash-main:7879@0.0.1`, not
inferred from a local George checkout.

George's canonical `scripts/ui_contact_sheet.sh` was run first against the real
Central vault. On this host the first attempt bound to the Lisbon tailnet address
while the harness probed `127.0.0.1`; a second run with the supported
`GEORGE_BIND_HOST=127.0.0.1` override reached the server and then failed closed on
all six `/projects` captures. The harness log is
`/tmp/george-contact-sheet-admin-consistency-20260716/serve.log`. This failure is
recorded rather than treated as rendered proof.

The authoritative route evidence was then captured directly from
`dash-main:7879` with `scripts/des-audit.mjs` at 1440x1000, 768x1024, and
390x844. Every capture used production data, `?theme=dark`, and `main` as the
ready selector. The receipt root is
`artifacts/design-receipts/george-admin-consistency-2026-07/`.

First-task-region contact sheets, assembled from those live captures:

- `evaluations/george-admin-consistency-2026-07/wide-contact-sheet.png`
- `evaluations/george-admin-consistency-2026-07/tablet-contact-sheet.png`
- `evaluations/george-admin-consistency-2026-07/mobile-contact-sheet.png`

| Route | Receipt / screenshots | Production coordinate | Full-page height wide / tablet / mobile |
|---|---|---|---|
| `/` | `home/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | 82 registered projects; 30 decisions/gates; 76 triage items | 2,119 / 2,470 / 3,193 px |
| `/projects` | `projects/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | 22,963 entries scanned; 1,308 todos in window; 65 open work | 63,644 / 97,894 / 100,448 px |
| `/p/george` | `project-george/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | authored roadmap; current focus; 9 unique decisions | 2,756 / 3,641 / 5,645 px |
| `/decisions` | `decisions/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | 30 independently openable decisions | 2,567 / 3,290 / 3,913 px |
| `/triage` | `triage/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | 76 action records; 93 POST forms; repeated gate filings | 6,725 / 9,611 / 10,979 px |
| `/board` | `board/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | 79 work cards across lifecycle lanes | 11,332 / 9,557 / 10,123 px |
| `/prs` | `prs/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | 1 PR wants attention; 6 open PRs in cache | 1,000 / 1,024 / 1,108 px |
| `/runs` | `runs/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | 5 active plus settled history; 45 run articles | 4,659 / 7,783 / 11,515 px |
| `/admin/clusters` | `clusters/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | 145 shown; 63 register and 82 save actions | 6,633 / 9,013 / 39,686 px |
| `/policy` | `policy/baseline.receipt.json`; `baseline/{wide,tablet,mobile}.png` | packaged defaults; 14 labeled outcomes; no proposal state | 1,000 / 1,024 / 875 px |

All paths in the table are relative to the receipt root. Raw accessibility
snapshots and full route PNGs were generated during the audit; the committed
receipt JSON records their coordinates plus the structural accessibility,
console, performance, and overflow results. The three committed contact sheets
preserve the rendered first-task-region evidence without adding 45 MB of raw
full-page PNGs to the review branch.

## Baseline inventory and route matrix

Severity describes operator harm and frequency, not implementation effort.

| Route | Operator task | Archetype | Current DES pattern | Repeated anatomy | Region-anchored finding | Severity | Shared fix or deliberate exception |
|---|---|---|---|---|---|---|---|
| `/` | Orient to portfolio state and choose the next operator task | orientation + attention digest | shared shell; local state band and attention lanes | entry state, bounded attention, destination links | **Needs you / Triage lane:** 76 items are represented as a normal work count even though the queue contains repeated filings of the same branch-protection decision. The digest faithfully reflects a broken eligibility contract. | high | Apply shared page-entry grammar; keep the multi-lane home composition local. Change the triage count only after upstream settlement is fixed. |
| `/projects` | Find a project, understand portfolio state, open the right workspace | orientation / inventory | shared shell, stats, filters, dense table; no composed journey or inbox | state summary, filter set, inventory rows | **Open work table:** 203,231 visible characters and a 100,448 px mobile document expose the 1,308-item work set as one reading surface. Search and status filters do not substitute for grouping, top-N disclosure, or settlement. | critical | Keep the portfolio inventory distinct from `/p/{project}`. Add entry grammar and grouped project-first results; expose raw work behind explicit disclosure. Do not paginate the defect. |
| `/p/george` | Understand progress, proof, uncertainty, and the next bounded action | orientation / strategic overview | `journey-*` plus typed evidence and bounded attention | intent, authored outcomes, current focus, proof, attention, system work | **Project briefing and State of the journey:** task entry, authored outcome spine, missing proof, movement, and bounded decisions remain visually distinct at all widths. | low | Preserve as the reference journey composition. Deliberate exception: typed records remain drill-down evidence, not top-level navigation. |
| `/decisions` | Select a human-authority decision and resolve or defer it safely | attention / bounded decisions | `action-inbox`-like filter rail and independently openable records | filter, count, collapsed question, detail/actions | **First task region:** “30 things need you” states count but not the eligibility contract or settlement consequence. **Collapsed rows:** the question is legible, but why this requires human authority is deferred until open. | medium | Use existing `decision-*` contract/result-policy anatomy inside the action inbox. Preserve independent selection; do not add batch resolution to unlike consequential decisions. |
| `/triage` | Filter fresh signals, settle independent items, recover from a mistake | attention / high-volume triage | `action-inbox` shell without queue mechanics | filter rail, count, independent details | **Results list:** 76 records include repeated branch-protection formulations (32 HTML mentions), while the live surface exposes no checkbox selection, bulk settlement, or snooze. **Entry:** the count does not disclose the 93-source-to-76 eligibility/settlement defect as a defect. | critical | First fix dedupe, eligibility, and settlement receipts. Then add bounded verbs, independent multi-select, bulk settlement, snooze, and instant undo using the existing action-inbox composition. |
| `/board` | Monitor queued, moving, blocked, and finished work | operations / lifecycle monitor | local lane board; shared state language | state counts, lanes, record cards, action/detail paths | **Wide lane grid:** eight narrow columns make titles and evidence read as miniature cards; 79 work cards create 11,332 px of vertical document despite a wide viewport. State taxonomy is strong, but evidence and recovery compete with lane scanning. | high | Keep lifecycle lanes as a deliberate local exception. Add shared entry grammar, cap each lane with ranked exceptions, and route complete inventory to `/projects` or a filtered view. Do not convert the board to generic records. |
| `/prs` | Review readiness, evidence, and the next safe PR action | attention + operations | `action-inbox` plus compact open-PR table | filter, one attention record, cache freshness, inventory | **Action record:** “draft — author hasn't marked it ready” clearly explains why no merge action exists. **Page entry:** count, task, state, and cache freshness are present; the record disclosure carries consequence. | low | Preserve. Migrate record body to the typed PR renderer when touched; keep the compact all-PR table as inventory. |
| `/runs` | Inspect run status, evidence, history, errors, and recovery | operations / activity monitor | live-activity rules with local run articles; record-like facts | active/settled grouping, durable status, next step, evidence links | **Active run cards:** computed state and `NEXT` copy are strong; failed/blocked work links evidence. **Mobile history:** 45 articles produce an 11,515 px document with no bounded history disclosure. | medium | Keep active/settled composition local. Use `record-*` anatomy for typed run evidence, add a top error/recovery summary, and collapse settled history by day/status. |
| `/admin/clusters` | Inspect scope and safely assign or register project configuration | configuration | shared controls and table; local inline forms | current scope, filter, current value, per-row apply | **Potential projects table:** 145 independent forms render at once; mobile grows to 39,686 px. **Per-row action:** save/register is adjacent to fields, but consequence, validation state, pending change, and revert are absent. | critical | Apply configuration entry grammar and a selected-row inspector or bounded change tray. Keep project kind/owner/cluster typed controls local; no DES settings component is justified by this audit alone. |
| `/policy` | Understand the effective auto-merge policy and safely propose or reverse a change | configuration / policy summary | shared stats/table/empty state; no composed settings pattern | current values, provenance, outcome evidence | **Current policy:** values and “guardrails are fixed in code” make scope clear. **Empty proposal state:** there is no path to the policy decision, apply/reset endpoints, consequence, or recovery evidence, so “what do I do?” is unanswered in the baseline state. | high | Preserve code-owned guardrails as a deliberate no-inline-edit exception. Link to the owning decision/change path and show apply/reset receipts when proposals exist; do not fabricate editable controls. |

## Task-based rubric

### Gate 0 — smoke

Pass for all 30 live captures. Each route rendered with the George shared shell
and loaded styles. DES found zero body overflow, console errors, page errors,
failed images, unnamed interactive controls, duplicate IDs, heading skips, or
focus-indicator suspects at 1440/768/390. Loads were 328–982 ms with seven
resources and roughly 120 KB transferred.

The mechanical pass is not a visual or task pass. In particular, a 100,448 px
mobile document can have no horizontal overflow and still fail cardinality,
authority, and usability.

### Gate 1 — task reasoning

- Pass: `/p/george`, `/prs`, `/runs` (for the active run set), and the home
  orientation region answer the four questions.
- Partial: `/decisions` identifies records and actions but defers eligibility and
  settlement consequence; `/board` identifies state but makes recovery hard to
  locate amid lane density.
- Fail: `/triage` projects upstream duplicates as human work; `/projects` makes
  the raw work set the task; `/admin/clusters` omits pending-change consequence
  and recovery; `/policy` has no action path in the captured empty state.

### Gate 1.5 — flow and authority

- `/triage` fails authority and eligibility. Multiple formulations of one
  branch-protection choice remain separately actionable, and machine-settleable
  observations are mixed with real blockers.
- `/projects` fails flow because inventory, attention, and project orientation
  are conflated in one full table.
- `/admin/clusters` fails recovery: a change can be submitted per row but the
  surface does not establish validation, post-action state, or revert.
- `/policy` cannot prove entry/action/success/recovery from the production empty
  state. It is appropriately code-owned, but the owning change path is absent.

### Gate 1.75 — hierarchy and system expression

- `/p/george` is the strongest system expression: authored journey, current
  focus, proof, bounded attention, and system work are distinct.
- `/decisions`, `/triage`, and `/prs` correctly use inbox selection rather than a
  compulsory card deck, but only `/prs` completes the first-viewport contract.
- `/board` deliberately remains a lifecycle board; its problem is cardinality
  inside lanes, not failure to look like another route.
- `/runs` should reuse typed record anatomy without becoming a queue or board.
- Configuration remains a component gap, not permission to invent a family from
  two routes.

### Sections 2–4

- Composition and density: `/projects`, `/board`, and `/admin/clusters` fail
  cardinality at production size. `/triage` fails because its large count
  exposes settlement defects. Other routes are composed and responsive.
- Decision surfaces: `/prs` passes; `/decisions` needs an explicit contract;
  `/triage` needs bounded verbs, multi-select, snooze, settlement, and undo after
  eligibility repair.
- Durability: all audited routes pass the automated 390 px overflow and focus
  checks. Full editing on `/admin/clusters` should become a read/review/steer
  mobile mode rather than a 145-form stack.

## Mobbin evidence

All searches were fresh, sequential MCP calls. Each returned image was examined;
metadata alone was not used. The search was split by task mechanism so project
orientation, triage, operations, configuration, bulk undo, and snooze were not
collapsed into one visual-style query.

| Mechanism searched | Selected canonical flow | Mechanism borrowed | Anti-reference |
|---|---|---|---|
| Project / initiative overview | [Linear — Initiative details](https://mobbin.com/flows/0f095230-c97d-497c-b15e-773b1372670b) | latest update sits with status/owner/target; progress, related projects, and activity are adjacent but distinct | progress curves and issue counts are not authored outcomes or proof; do not import fake completion certainty |
| High-volume moderation filters | [Reddit — Filtering mods log](https://mobbin.com/flows/9a1a0954-3e9c-4c7b-8cc4-fa16864a87d6) | filters remain visible as applied chips; post-filter counts and an explicit reset/empty state make query state legible | an audit log is not an action queue; filtering history does not provide eligibility, settlement, or human authority |
| Independent item decision + post-action state | [Klaviyo — Publishing a review](https://mobbin.com/flows/de7b4d0a-02c7-4269-af37-146d334fba69) | the item carries evidence and opposing verbs; the result changes status in place and announces what happened | public publishing has no visible undo; a single-item detail does not solve large-queue scanning or bulk settlement |
| Bulk settlement + undo | [Proton — Archiving conversations](https://mobbin.com/flows/8cc89f71-1c57-480d-944a-8e15122cd206) | independently selected rows receive one bulk action; the queue updates and a toast states the count with Undo | email archive is low-risk and homogeneous; do not bulk-apply consequential decisions merely because selection is efficient |
| Snooze + post-action recovery | [Front — Snoozing a conversation](https://mobbin.com/flows/a57ab619-b7ba-4cc4-af34-fff518dc8b35) | snooze chooses a durable return time, removes the item from the active inbox, and exposes Undo | time-only snooze is insufficient when new evidence should wake the item earlier; George should support time **or new activity** |
| Operational run monitoring | [Databricks — View run event logs](https://mobbin.com/flows/91b98c2b-3797-4315-a837-74c3267c8207) | summary status, duration, lineage, event history, and rerun are attached to the same run | the DAG is domain evidence, not the default narrative; George should lead with typed chronological events and keep raw traces secondary |
| Configuration apply/revert | [Height — Saving attribute changes](https://mobbin.com/flows/4c695a4e-624f-4d8c-9680-946af2e3db97) | scope hierarchy stays visible while a persistent rail groups Undo, Edit, and Save | tiny low-contrast controls and implicit consequences are not acceptable; safe apply still needs validation and an explicit effect |

### Seed reassessment

- [Klaviyo — Publishing a review](https://mobbin.com/flows/de7b4d0a-02c7-4269-af37-146d334fba69): borrow item-level evidence, opposing verbs, and explicit post-action status. Anti-reference: no visible undo and no queue-scale mechanism.
- [Canny — Moderation](https://mobbin.com/flows/8117e25f-c623-4c6a-ad30-7938b76ce816): borrow the persistent filter rail and a clear empty state. Anti-reference: the blank central canvas, confidence filter without an eligibility explanation, and absent settlement controls make it a weak high-volume model.
- [X — Moderation log](https://mobbin.com/flows/d2397b0a-da12-496c-aee6-82c4bc6ed18b): borrow typed post/member/banned history and object-local follow-up (`Unhide post`, `Search posts`). Anti-reference: a sparse consumer three-column layout, no batch selection, no recovery receipt, and no evidence-first operational density.

Prevalence was not treated as correctness. None of the references authorizes
copying product branding, pale consumer styling, card shells, or navigation.

## Existing DES pattern reconciliation

| Existing family | Routes tested | Finding | Decision |
|---|---|---|---|
| `journey-*` | `/p/george`, compared with `/` and `/projects` | correctly distinguishes authored outcomes, proof, attention residue, system work, and inventory | keep; use `/p/george` as the George orientation reference |
| `decision-*` | `/decisions`, `/triage`, `/prs` | contract, result policy, rationale, and consequence anatomy are reusable; the live routes vary in how much they instantiate | migrate missing anatomy into existing inbox compositions; no second queue family |
| `action-inbox` | `/decisions`, `/triage`, `/prs` | independent selection, persistent filters, and list-position continuity fit all three | keep; extend George behavior locally for selection/bulk/snooze/undo after eligibility repair |
| `record-*` | `/p/george`, `/prs`, `/runs`, `/board` | typed evidence and verbs fit PR/run/detail records without flattening them | reuse for run/PR evidence; do not replace lifecycle lanes or journey outcomes with generic records |

No new component clears the evidence bar. Operations repeat across `/board`,
`/prs`, and `/runs`, but their actual tasks remain lifecycle scanning, review
attention, and event diagnosis. Configuration appears only on `/admin/clusters`
and `/policy`, with different mutability. The repeated, cross-archetype gap is
the page-entry proof contract, so DES changes guidance, rubric, practice,
showcase, and tests rather than manufacturing another family.

## Prioritized George migration map

This is the exact follow-up plan. It is not implemented in this DES PR.

### Slice 0 — fix triage eligibility and settlement before UI expansion

- Routes: `/triage`, reflected on `/`.
- George files: `george_service/triage.py`, ingestion/settlement code reached by
  the triage POST routes in `george_service/app.py`, `tests/test_triage.py`, and
  `tests/test_home.py`.
- DES pattern: `action-inbox` plus queue mechanics guidance.
- Behavior/state change: deduplicate by durable decision/work coordinate;
  separate signals, blockers, and human-authority decisions; expose captured →
  auto-settled → human residue counts and settlement reasons.
- Acceptance evidence: the branch-protection case renders as one decision with
  linked source evidence; no already-settled record reaches the human queue;
  home and triage counts agree; contact-sheet and DES audit at all widths.
- Intentional exception: raw signals remain reachable in an audit disclosure,
  not in the active queue.

### Slice 1 — add the shared page-entry contract per archetype

- Routes: `/`, `/projects`, `/decisions`, `/triage`, `/board`, `/prs`, `/runs`,
  `/admin/clusters`, `/policy`; preserve `/p/george` as the reference.
- George files: the route renderers `home.py`, `dashboard.py`,
  `project_journey.py`, `decisions.py`, `triage.py`, `board.py`, `prs.py`,
  `runs.py`, `clusters.py`, and `policy.py`; add route assertions to their
  matching tests rather than a generic shell helper that dictates layout.
- DES pattern: **Shared page-entry grammar**.
- Behavior/state change: each first task region makes scope, operator task,
  state/proof, and next move/consequence explicit. Keep journey, inbox, board,
  activity, and configuration compositions distinct.
- Acceptance evidence: route-specific tests assert the four facts; first
  viewport contact sheet makes them locatable at thumbnail size; no decorative
  kicker restates the route.
- Intentional exception: shared shell/breadcrumb remain infrastructure, not the
  page-entry composition.

### Slice 2 — bound project inventory without hiding work

- Routes: `/projects`; link through to `/p/{project}` and filtered `/board`.
- George files: `george_service/dashboard.py`, `tests/test_dashboard.py`.
- DES pattern: page-entry grammar + table/cardinality guidance; `journey-*` stays
  on individual project pages.
- Behavior/state change: lead with project rows and portfolio state; group or
  top-N the work evidence per project; expose full raw work through an explicit,
  searchable disclosure; keep upstream eligibility defects visible.
- Acceptance evidence: production fixture still contains 1,308 todos, but the
  initial document does not render hundreds of full work descriptions; exact
  counts and a full-inventory route remain available; mobile read/review/steer
  is bounded.
- Intentional exception: this remains an inventory, not a journey briefing or a
  generic card grid.

### Slice 3 — complete attention mechanics after settlement is sound

- Routes: `/decisions`, `/triage`, `/prs`.
- George files: `decisions.py`, `triage.py`, `prs.py`, their route tests, and
  state-changing endpoints in `app.py`.
- DES pattern: `decision-*` contract/result policy inside `action-inbox`; typed
  decision/PR records.
- Behavior/state change: decisions expose human-authority reason and consequence
  in the collapsed/first-open state; triage gains independent checkboxes,
  bounded bulk dispositions, snooze until time or new activity, post-action
  count/state, and instant undo; PRs reuse typed readiness evidence.
- Acceptance evidence: keyboard and pointer walkthroughs cover entry, action,
  success, undo, snooze wake-up, empty, and error states; list position and
  filters survive action and refresh; irreversible actions still confirm.
- Intentional exception: unlike consequential decisions never receive a bulk
  resolve control.

### Slice 4 — bound operations by exception and evidence

- Routes: `/board`, `/runs`, with `/prs` as a review handoff.
- George files: `board.py`, `runs.py`, `prs.py`, `tests/test_board.py`,
  `tests/test_board_audit.py`, `tests/test_runs.py`, `tests/test_prs.py`.
- DES pattern: page-entry grammar, `record-*`, and live-activity rules.
- Behavior/state change: board lanes show ranked exceptions/top-N with full lane
  disclosure; runs lead with active errors/recovery and collapse settled history
  by time/status; typed event evidence and raw trace stay distinct.
- Acceptance evidence: stale/unknown/error fixtures show exact freshness and a
  recovery path; active versus settled counts remain truthful; no infinite
  spinner; full inventory remains one click away.
- Intentional exception: the board keeps lifecycle lanes, while runs keep a
  chronology. Neither becomes the other's layout.

### Slice 5 — make configuration transactions safe and bounded

- Routes: `/admin/clusters`, `/policy`.
- George files: `clusters.py`, `policy.py`, relevant routes in `app.py`,
  `tests/test_clusters.py`, and policy coverage in `tests/test_pages.py`.
- DES pattern: configuration branch of page-entry grammar plus existing fields,
  buttons, callouts, and typed records; no new settings family yet.
- Behavior/state change: clusters move from 145 live forms to a selected-row
  inspector/change tray with current value, validation, consequence, pending
  state, apply, success receipt, and revert. Policy stays code-owned but links
  the owning decision/PR; proposal states show apply/dismiss/reset consequence
  and receipts.
- Acceptance evidence: fixtures cover invalid cluster, changed value, saved,
  failed, and reverted states; policy covers no-proposal, proposed, applied,
  dismissed, and reset states; mobile offers read/review/steer and directs dense
  editing to desktop.
- Intentional exception: policy guardrails are not turned into casual inline
  settings, and project ownership/kind/cluster retain distinct typed controls.

### Slice 6 — family proof and independent seeing

- Routes: all ten named routes.
- George files: `scripts/ui_contact_sheet.sh`,
  `tests/test_ui_contact_sheet_script.py`, and route receipts.
- DES pattern: `PRACTICE.md` receipt and `RUBRIC.md` seeing contract.
- Behavior/state change: make the contact-sheet harness health probe use the
  actual resolved bind host or explicitly force localhost; preserve fail-closed
  capture semantics.
- Acceptance evidence: both themes and all three widths complete; DES audits
  report console/a11y/overflow data; an independent reviewer sees the contact
  sheet and owns promotion.
- Intentional exception: automated checks may establish `candidate`, never
  `ship` without independent seeing or explicit human acceptance.

## DES material delta and receipt

The DES change adds no component and no product CSS. It:

- documents page-entry grammar in `PATTERNS-ADMIN.md` with archetype-specific
  composition guidance and the seven-route evidence bar;
- adds page-entry capture and proof steps to `PRACTICE.md`;
- adds a falsifiable first-task-region criterion and receipt fields to
  `RUBRIC.md`;
- demonstrates all four archetypes in `showcase.html` using existing table and
  overflow primitives; and
- adds `test/admin-page-entry.test.mjs`, including a guard against manufacturing
  `AdminPageHeader` or `PageEntry` React components.

Validation:

- `npm test`: 18/18 tests passed, including both page-entry regression tests and
  the existing journey, action-inbox, typed-record, continuity, and audit suites.
- `npm run audit:showcase`: pass at 1440x1000, 768x1024, and 390x844. The receipt
  is `artifacts/design-receipts/showcase/variant.receipt.json`.
- Showcase audit: zero body overflow, console errors, page errors, duplicate
  IDs, focus-indicator suspects, heading skips, failed images, or missing image
  alternatives. Four resources transferred roughly 114 KB; loads were
  528–1,912 ms.
- Pixel inspection: the new wide specimen keeps all four archetypes comparable
  in one table; at 390 px the existing `table-scroll` region preserves the full
  contract without body overflow. The table is intentionally an inspectable
  rule matrix, not a new composed admin surface.

Requested model: `opus` (commission launch request).
Served model: `unknown` (the bridge and DES audit receipt do not expose it).
Independent judge: `false`.
Promotion authority: `none`.
Material delta: guidance/showcase/test contract only; no George change and no
new DES component family.

Verdict: `candidate` pending an independent seeing pass or explicit human
acceptance.
