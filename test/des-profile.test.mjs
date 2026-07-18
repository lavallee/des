import assert from "node:assert/strict";
import test from "node:test";

import {
  parseProfileArgs,
  profileMarkdown,
  resolveDesignProfile,
} from "../scripts/des-profile.mjs";

test("profiles keep surface mode and model tier independent", () => {
  const profile = resolveDesignProfile({
    capabilities: ["visual-input", "browser"],
    harness: "codex",
    mode: "public-data",
    modelTier: "frontier",
    requestedModel: "gpt-test",
    servedModel: "gpt-test-served",
  });

  assert.equal(profile.modeContract.dials.density, "balanced");
  assert.equal(profile.modelContract.variationStrategy.includes("named dial"), true);
  assert.match(profile.harnessContract.contextStrategy, /repository instructions/);
  assert.equal(profile.proofContract.maximumAutonomousVerdict, "candidate");
  assert.match(profile.profileId, /^des-public-data-frontier-[a-f0-9]{12}$/);
});

test("profile ids are deterministic across capability order", () => {
  const first = resolveDesignProfile({ mode: "marketing", capabilities: ["browser", "visual-input"] });
  const second = resolveDesignProfile({ mode: "marketing", capabilities: ["visual-input", "browser"] });
  assert.equal(first.profileId, second.profileId);
});

test("profiles without seeing capability cannot make a visual verdict", () => {
  const profile = resolveDesignProfile({ mode: "editorial", capabilities: ["browser"] });
  assert.equal(profile.proofContract.maximumAutonomousVerdict, "implementation-only");
  assert.match(profile.proofContract.independentSeeing, /mandatory/);
});

test("profile parser accepts repeated capabilities and markdown output", () => {
  const options = parseProfileArgs([
    "--mode", "operator",
    "--harness", "claude-code",
    "--capability", "browser",
    "--capability", "visual-input",
    "--format", "markdown",
  ]);
  const profile = resolveDesignProfile(options);
  assert.deepEqual(profile.capabilities, ["browser", "visual-input"]);
  assert.match(profileMarkdown(profile), /modes\/operator\.md/);
});

test("profiles reject unknown modes, tiers, and capabilities", () => {
  assert.throws(() => resolveDesignProfile({ mode: "website" }), /--mode must be one of/);
  assert.throws(() => resolveDesignProfile({ mode: "operator", modelTier: "magic" }), /--model-tier/);
  assert.throws(() => resolveDesignProfile({ mode: "operator", capabilities: ["telepathy"] }), /unknown capability/);
});

test("an unregistered harness gets an explicit conservative adapter", () => {
  const profile = resolveDesignProfile({ mode: "operator", harness: "future-harness" });
  assert.match(profile.harnessContract.contextStrategy, /No DES-specific adapter is registered/);
  assert.match(profile.harnessContract.toolStrategy, /declared capabilities/);
});
