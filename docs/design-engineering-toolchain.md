# Design-engineering toolchain

Updated 2026-07-14. This is a capability boundary, not a shopping list. DES owns
the design practice and proof contract; external tools supply evidence or expand
the search space. A tool does not get to promote its own output.

## The default loop

1. **Select the surface and execution profile.** Choose the DES mode and record
   the exact harness, requested/served model, tier, and capabilities with
   `des-profile`. This changes context and proof—not the visual style.
2. **Research the task, not a style.** Use local product evidence first. Query
   Mobbin for a specific screen or flow only when an outside interaction pattern
   could answer a named question.
3. **Capture the current route.** Run `des-audit` at 1440, 768, and 390 px before
   changing it. Keep the receipt as the baseline arm.
4. **Choose whether divergence is useful.** For a genuinely new direction, make
   candidates that differ on one named axis. Image generation is optional and
   stays upstream of implementation.
5. **Implement in the owning application.** Reconstruct the chosen mechanism
   with real HTML, CSS, components, states, and data. Never cut a generated image
   into interface slices.
6. **Exercise the representative task.** Use stable role/name selectors for known
   flows. Use exploratory agent control only to discover an unfamiliar path, then
   turn the learned path into deterministic steps.
7. **Reshoot and diagnose.** Run `des-audit` again. If it finds a performance or
   network problem, move to Chrome DevTools tracing. If it finds a visual issue,
   inspect the pixels and fix the implementation rather than relaxing the gate.
8. **Promote with authority.** An independent seeing pass or explicit human
   acceptance promotes a candidate. A green automation receipt alone does not.

## Tool roles

| Need | Default | Why it belongs | Boundary |
|---|---|---|---|
| Reproducible screenshots, accessibility snapshots, console/page errors, URL and screenshot diffs | [`agent-browser`](https://github.com/vercel-labs/agent-browser/tree/dcbe3522f931d24f85a786ba6ba7f343d86f7294) CLI | Compact agent-facing commands, stable sessions, DOM and pixel evidence, traces and profiles | It supplies observations; `RUBRIC.md` and the task receipt supply judgment |
| Deep performance and network diagnosis | [`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp/tree/5012b077997618edeb2291d39d17553280f5b2a6) | Trace-derived performance insights, network inspection, console debugging, source-mapped errors | Invoke after a deterministic symptom; do not add a second general browser loop |
| Cross-browser regression tests and fixed application flows | [Playwright](https://github.com/microsoft/playwright) or [`playwright-mcp`](https://github.com/microsoft/playwright-mcp/tree/5f8fc00210b27b4407c375b59cda4838045d429c) | Mature browser assertions and Chromium/Firefox/WebKit coverage | Prefer CLI/test code for repeated checks; MCP is for stateful exploration, not the visual oracle |
| Unfamiliar or changing flows | [`Stagehand`](https://github.com/browserbase/stagehand/tree/0f1f9794aafe946cd10017d90784a7c7abca27fd) | It deliberately mixes natural-language exploration with deterministic code and can cache learned actions | Graduate a learned flow into a fixed receipt or app test; do not grade with the same agent that explored |
| Real-product interaction references | Mobbin MCP | Search results include actual screens and multi-step flows rather than prose moodboards | Query one task mechanism at a time; cite the canonical Mobbin flow; never treat prevalence as correctness |
| Broad visual divergence | [GPT Image 2](https://developers.openai.com/api/docs/models/gpt-image-2) | High-fidelity image input plus generation/editing makes it useful for composition and visual-direction candidates | Generated pixels are a hypothesis. Rebuild with the system, real content, reachable states, semantics, and responsive behavior |
| Multiplexed candidate selection | [`gstack` design shotgun](https://github.com/garrytan/gstack/tree/7c9df1c568a9ea745508f679a329332b2c338063) | The useful mechanism is a comparison board with iterative human selection across several candidates | Borrow the tournament, not its taste. Vary a named axis, blind ordering when judging, and validate the winner in code |

No tool is “better than Playwright” in every role. The useful split is:

- agent-browser for a compact agent-facing observation and receipt surface;
- Playwright tests for durable cross-browser behavior;
- Chrome DevTools for causal performance diagnosis;
- Stagehand for exploration that has not yet earned determinism.

## Running the receipt gate

Install `agent-browser` 0.22.1 or newer and its Chrome runtime, then serve the
target application:

```console
$ des-audit \
    --url http://127.0.0.1:3000/dashboard/resources \
    --task "Decide whether this resource belongs in the collection" \
    --surface "Resource review queue" \
    --mode operator \
    --harness codex \
    --model-tier frontier \
    --requested-model gpt-5 \
    --served-model gpt-5 \
    --capability browser \
    --capability visual-input \
    --arm baseline \
    --out artifacts/design-receipts/resource-review
wide: pass
tablet: pass
mobile: pass
pass: .../baseline.receipt.json
```

The runner writes viewport and full-page PNGs plus a compact accessibility
snapshot for each width and a JSON receipt bound to the DES profile. It fails on
blank renders, failed images, body
overflow, missing document semantics, duplicate IDs, heading skips, unnamed
interactive controls, keyboard-focus states without a visible indicator, HTTP
resource failures, browser/console errors, and explicit load/resource/transfer
budgets. The runner first establishes keyboard modality, then asks Chromium to
force keyboard-modality focus so `:focus-visible` rules are evaluated rather
than inherited from a shared browser process's pointer modality.
The task walk still verifies focus order, reachability, and activation behavior.

The runner is deliberately not a replacement for the full task walk in
`PRACTICE.md`. It makes the mechanical evidence consistent so the designer can
spend judgment on concept model, authority, flow, hierarchy, and visual quality.

## Reference observation: bounded moderation

A Mobbin query on 2026-07-14 for an operator reviewing evidence and making one
bounded approval decision returned three useful comparisons:

- [Klaviyo, publishing a review](https://mobbin.com/flows/de7b4d0a-02c7-4269-af37-146d334fba69): detail plus supporting product context, one publish action, and an immediate changed status.
- [Canny, moderation](https://mobbin.com/flows/8117e25f-c623-4c6a-ad30-7938b76ce816): a selected item with activity evidence and a consequence state that becomes an explicit empty queue.
- [X, moderation log](https://mobbin.com/flows/d2397b0a-da12-496c-aee6-82c4bc6ed18b): separates review-needed entry from an audit log; rules stay adjacent to the reviewed record.

The transferable mechanisms are bounded entry, adjacent evidence, visible
rules, immediate disposition, and explicit post-action state. Their visual
styling is not a Lyra Forge reference.
