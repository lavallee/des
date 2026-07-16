import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("admin page-entry grammar is shared without manufacturing one header component", () => {
  const patterns = read("PATTERNS-ADMIN.md");
  const practice = read("PRACTICE.md");
  const rubric = read("RUBRIC.md");
  const react = read("react/components.tsx");

  assert.match(patterns, /Shared page-entry grammar, not one generic header/);
  assert.match(patterns, /Scope:[\s\S]*Operator task:[\s\S]*Current state and proof:[\s\S]*Next move and consequence:/);
  assert.match(patterns, /Orientation \/ strategic overview[\s\S]*Attention \/ bounded decisions[\s\S]*Operations \/ run monitoring[\s\S]*Configuration \/ policy/);
  assert.match(practice, /Page-entry proof \(scope, task, state\/proof, next move\/consequence\)/);
  assert.match(rubric, /first task region[\s\S]*scope, operator task, current state\/proof, and[\s\S]*next move\/consequence/);
  assert.doesNotMatch(react, /export function (AdminPageHeader|PageEntry)/);
});

test("showcase demonstrates all four entry archetypes and points to existing composed families", () => {
  const showcase = read("showcase.html");
  const start = showcase.indexOf('<section class="section" id="admin-page-entry"');
  const end = showcase.indexOf('<!-- ── DECISION WORKSPACE', start);
  const section = showcase.slice(start, end);

  assert.ok(start >= 0 && end > start);
  assert.match(section, /data-des-rule="page-entry-grammar"/);
  for (const archetype of ["orientation", "attention", "operations", "configuration"]) {
    assert.match(section, new RegExp(`data-page-entry-archetype="${archetype}"`));
  }
  assert.match(section, /journey-\*/);
  assert.match(section, /decision-\*/);
  assert.match(section, /action-inbox/);
  assert.match(section, /record-\*/);
  assert.match(section, /does not ship a universal page-header component/);
});
