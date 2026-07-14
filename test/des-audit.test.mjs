import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_VIEWPORTS,
  FOCUSABLE_SELECTOR,
  assessCapture,
  hiddenByClosedDetails,
  parseArgs,
  parseViewport,
} from "../scripts/des-audit.mjs";

test("parseViewport accepts explicit dimensions", () => {
  assert.deepEqual(parseViewport("390x844"), { label: "390x844", width: 390, height: 844 });
  assert.throws(() => parseViewport("mobile"), /expected WxH/);
});

test("parseArgs supplies the three design-practice viewports", () => {
  const options = parseArgs(["--url", "http://example.test", "--task", "Review a claim", "--surface", "Claim review"]);
  assert.deepEqual(options.viewports, DEFAULT_VIEWPORTS);
  assert.equal(options.arm, "variant");
});

test("focus audit includes native disclosure summaries", () => {
  assert.match(FOCUSABLE_SELECTOR, /(^|,)summary(,|$)/);
});

test("closed disclosures hide descendants but not their direct summary", () => {
  const summaryChild = {};
  const hiddenChild = {};
  const summary = { contains: (element) => element === summaryChild };
  const closedDetails = { querySelector: () => summary };

  assert.equal(hiddenByClosedDetails(null, hiddenChild), false);
  assert.equal(hiddenByClosedDetails(closedDetails, summaryChild), false);
  assert.equal(hiddenByClosedDetails(closedDetails, hiddenChild), true);
});

test("assessCapture fails named deterministic gates", () => {
  const assessment = assessCapture({
    audit: {
      accessibility: { duplicateIds: [], focusWithoutIndicator: [], headingSkips: [], imagesWithoutAlt: [] },
      document: { lang: "en", mainLandmarks: 1, title: "Queue" },
      layout: { bodyOverflow: true },
      performance: { loadMs: 250, resourceCount: 2, transferKb: 4 },
      render: { visibleGraphicCount: 0, visibleTextCharacters: 120 },
    },
    budgets: { maxLoadMs: 3000, maxResources: 100, maxTransferKb: 2048 },
    consoleEntries: [],
    pageErrors: [],
    snapshotRefs: { e1: { name: "", role: "button" } },
  });
  assert.equal(assessment.verdict, "fail");
  assert.deepEqual(assessment.failures, ["body-overflow", "unnamed-interactive-controls"]);
});

test("assessCapture passes a clean capture", () => {
  const assessment = assessCapture({
    audit: {
      accessibility: { duplicateIds: [], focusWithoutIndicator: [], headingSkips: [], imagesWithoutAlt: [] },
      document: { lang: "en", mainLandmarks: 1, title: "Queue" },
      layout: { bodyOverflow: false },
      performance: { loadMs: 250, resourceCount: 2, transferKb: 4 },
      render: { visibleGraphicCount: 0, visibleTextCharacters: 120 },
    },
    budgets: { maxLoadMs: 3000, maxResources: 100, maxTransferKb: 2048 },
    consoleEntries: [],
    pageErrors: [],
    snapshotRefs: { e1: { name: "Publish", role: "button" } },
  });
  assert.equal(assessment.verdict, "pass");
  assert.deepEqual(assessment.failures, []);
});

test("assessCapture rejects a blank viewport", () => {
  const assessment = assessCapture({
    audit: {
      accessibility: { duplicateIds: [], focusWithoutIndicator: [], headingSkips: [], imagesWithoutAlt: [] },
      document: { lang: "en", mainLandmarks: 1, title: "Loading" },
      layout: { bodyOverflow: false },
      performance: { loadMs: 250, resourceCount: 0, transferKb: 0 },
      render: { visibleGraphicCount: 0, visibleTextCharacters: 0 },
    },
    budgets: { maxLoadMs: 3000, maxResources: 100, maxTransferKb: 2048 },
    consoleEntries: [],
    pageErrors: [],
    snapshotRefs: {},
  });
  assert.deepEqual(assessment.failures, ["blank-render"]);
});

test("assessCapture fails keyboard focus with no visible indicator", () => {
  const assessment = assessCapture({
    audit: {
      accessibility: {
        duplicateIds: [],
        focusWithoutIndicator: ["button (Save)"],
        headingSkips: [],
        imagesWithoutAlt: [],
      },
      document: { lang: "en", mainLandmarks: 1, title: "Editor" },
      layout: { bodyOverflow: false },
      performance: { loadMs: 250, resourceCount: 2, transferKb: 4 },
      render: { visibleGraphicCount: 0, visibleTextCharacters: 120 },
    },
    budgets: { maxLoadMs: 3000, maxResources: 100, maxTransferKb: 2048 },
    consoleEntries: [],
    pageErrors: [],
    snapshotRefs: { e1: { name: "Save", role: "button" } },
  });

  assert.deepEqual(assessment.failures, ["missing-focus-indicators"]);
});
