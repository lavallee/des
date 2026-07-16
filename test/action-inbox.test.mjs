import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("action inbox ships as a responsive non-sequential composition", () => {
  const css = read("components.css");
  const showcase = read("showcase.html");
  const react = read("react/components.tsx");

  for (const selector of [
    ".action-inbox",
    ".action-inbox__filters",
    ".action-inbox__results",
    ".action-record",
    ".action-record__body",
    ".action-record__actions",
  ]) {
    assert.match(css, new RegExp(selector.replaceAll(".", "\\.")));
    assert.match(showcase, new RegExp(selector.slice(1)));
  }
  assert.match(react, /export function ActionInbox/);
  assert.match(react, /export function ActionRecord/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.action-inbox \{ grid-template-columns: 1fr; \}/);
});

test("action inbox example carries meaningful records and durable filters", () => {
  const showcase = read("showcase.html");
  const start = showcase.indexOf('<section class="section" id="action-inbox">');
  const end = showcase.indexOf('<!-- ── CALLOUTS', start);
  const section = showcase.slice(start, end);

  assert.match(section, /Project<select/);
  assert.match(section, /Action type<select/);
  assert.match(section, /Recency<select/);
  assert.match(section, /Preserve filter state in the URL/);
  assert.match(section, /Choose whether production releases require an independent approval/);
  assert.match(section, /Release cannot proceed because the deployment checkout is not on main/);
  assert.doesNotMatch(section, /card \d+ of \d+|next card|press j\/k/i);
});

test("decision and action-inbox behavior ships through the existing family boundary", () => {
  const contract = read("docs/decision-workspace-contract.md");
  const packageJson = JSON.parse(read("package.json"));
  const react = read("react/components.tsx");
  const showcase = read("decision-workspace-showcase.html");

  assert.deepEqual(packageJson.exports["./decision-workspace"], {
    types: "./decision-workspace.d.ts",
    default: "./decision-workspace.js",
  });
  assert.match(react, /export function useDecisionWorkspace/);
  assert.match(react, /Why human authority is required/);
  assert.match(contract, /DES never calls a product endpoint/);
  assert.match(contract, /behaviorally complete[\s\S]*production proof still required/i);
  assert.match(showcase, /Existing decision-\* \+ action-inbox families/);
  assert.doesNotMatch(showcase, /George|george/);
});
