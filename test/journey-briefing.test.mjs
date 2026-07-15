import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("journey briefing primitives ship as one documented system family", () => {
  const css = read("components.css");
  const showcase = read("showcase.html");
  const react = read("react/components.tsx");

  for (const selector of [
    ".journey-header",
    ".journey-map",
    ".journey-step",
    ".journey-panel",
    ".journey-proof",
    ".journey-system-work",
    ".journey-inventory",
  ]) {
    assert.match(css, new RegExp(selector.replaceAll(".", "\\.")));
    assert.match(showcase, new RegExp(selector.slice(1)));
  }

  assert.match(react, /export function JourneyHeader/);
  assert.match(react, /export function JourneyStep/);
  assert.match(react, /export function JourneyProof/);
  assert.match(react, /export function JourneyInventory/);
});

test("journey guidance keeps intent above inventory and claim authority explicit", () => {
  const practice = read("PRACTICE.md");
  const principles = read("PRINCIPLES.md");
  const patterns = read("PATTERNS-ADMIN.md");
  const rubric = read("RUBRIC.md");
  const skill = read("SKILL.md");

  assert.match(practice, /organize by authored outcome or chapter/);
  assert.match(principles, /authored[\s\S]*derived[\s\S]*proposed[\s\S]*missing proof/);
  assert.match(patterns, /Journey briefings: intent before inventory/);
  assert.match(patterns, /deduplicated by their underlying decision coordinate/);
  assert.match(rubric, /typed record[\s\S]*does not pass as a journey briefing/i);
  assert.match(skill, /authored intent, outcome movement and proof/);
});
