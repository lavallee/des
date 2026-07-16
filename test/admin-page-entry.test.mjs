import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("admin page-entry checklist is situational and does not manufacture one header", () => {
  const patterns = read("PATTERNS-ADMIN.md");
  const practice = read("PRACTICE.md");
  const rubric = read("RUBRIC.md");
  const react = read("react/components.tsx");

  assert.match(patterns, /Page-entry diagnostic, not one generic header/);
  assert.match(patterns, /Scope:[\s\S]*Operator task:[\s\S]*Current state and proof:[\s\S]*Next move and consequence:/);
  assert.match(patterns, /Orientation \/ strategic overview[\s\S]*Attention \/ bounded decisions[\s\S]*Operations \/ run monitoring[\s\S]*Configuration \/ policy/);
  assert.match(patterns, /situational checklist, not a universal acceptance contract/);
  assert.match(practice, /Page-entry diagnosis, when relevant/);
  assert.match(rubric, /not a universal header checklist/);
  assert.doesNotMatch(react, /export function (AdminPageHeader|PageEntry)/);
});

test("component readiness distinguishes visual availability from working behavior", () => {
  const patterns = read("PATTERNS-ADMIN.md");
  const practice = read("PRACTICE.md");
  const rubric = read("RUBRIC.md");

  assert.match(patterns, /Documented[\s\S]*Visually demonstrated[\s\S]*Behaviorally complete[\s\S]*Production-proven/);
  assert.match(patterns, /decision card whose buttons do not complete a decision is not a[\s\S]*functional decision component/);
  assert.match(practice, /documented, visually[\s\S]*demonstrated, behaviorally complete, or production-proven/);
  assert.match(rubric, /Static classes\/specimens do not prove working actions/);
});

test("showcase demonstrates all four entry archetypes and points to existing composed families", () => {
  const showcase = read("showcase.html");
  const start = showcase.indexOf('<section class="section" id="admin-page-entry"');
  const end = showcase.indexOf('<!-- ── DECISION WORKSPACE', start);
  const section = showcase.slice(start, end);

  assert.ok(start >= 0 && end > start);
  assert.match(section, /data-des-rule="page-entry-diagnostic"/);
  for (const archetype of ["orientation", "attention", "operations", "configuration"]) {
    assert.match(section, new RegExp(`data-page-entry-archetype="${archetype}"`));
  }
  assert.match(section, /journey-\*/);
  assert.match(section, /decision-\*/);
  assert.match(section, /action-inbox/);
  assert.match(section, /record-\*/);
  assert.match(section, /does not ship a universal page-header component/);
  assert.match(section, /Use it only when it explains an observed orientation failure/);
});
