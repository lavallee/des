import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("typed record primitives ship as one documented system family", () => {
  const css = read("components.css");
  const showcase = read("showcase.html");
  const react = read("react/components.tsx");

  for (const selector of [
    ".record-section",
    ".record-list",
    ".record-item",
    ".record-item__details",
    ".record-item__actions",
  ]) {
    assert.match(css, new RegExp(selector.replaceAll(".", "\\.")));
    assert.match(showcase, new RegExp(selector.slice(1)));
  }
  assert.match(react, /export function RecordSection/);
  assert.match(react, /export function RecordItem/);
});

test("review guidance rejects inert truncation and generic object cards", () => {
  const patterns = read("PATTERNS-ADMIN.md");
  const rubric = read("RUBRIC.md");

  assert.match(patterns, /Shortening must be a disclosure, not punctuation/);
  assert.match(patterns, /Decision\/gate[\s\S]*PR[\s\S]*Todo[\s\S]*Observation/);
  assert.match(rubric, /A kind badge on one generic truncated card does not pass/);
  assert.match(rubric, /strong fragment[\s\S]*inert ellipsis/);
});
