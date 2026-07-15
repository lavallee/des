import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("operator continuity and context are explicit design contracts", () => {
  const principles = read("PRINCIPLES.md");
  const patterns = read("PATTERNS-ADMIN.md");
  const rubric = read("RUBRIC.md");
  const practice = read("PRACTICE.md");

  assert.match(principles, /Interface copy earns space/);
  assert.match(patterns, /Action inboxes, not compulsory card decks/);
  assert.match(patterns, /timed\s+full-page reload or refresh meta tag is forbidden/);
  assert.match(patterns, /human work reference \(`FAB-63`\)/);
  assert.match(rubric, /Decorative restatement/);
  assert.match(rubric, /stopped for\s+human input[\s\S]*external blocker/);
  assert.match(practice, /preserve scroll,[\s\S]*focus,[\s\S]*draft input/);
});

test("time guidance rejects context-free database formatting", () => {
  const principles = read("PRINCIPLES.md");
  const patterns = read("PATTERNS-ADMIN.md");

  assert.match(principles, /Time is decision context, not database decoration/);
  assert.match(principles, /`0d`[\s\S]*raw ISO slices/);
  assert.match(patterns, /same-day events show a clock time/);
  assert.match(patterns, /exact `<time datetime>` value/);
});
