#!/usr/bin/env node

import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

export const SURFACE_MODES = Object.freeze({
  operator: {
    audience: "A practiced operator completing repeated, consequential work",
    defaultTheme: "dark",
    dials: {
      density: "compact",
      imageryRole: "evidence-only",
      motion: "functional",
      typeRegister: "interface",
      variance: "low",
    },
    objective: "Reduce decision time and error without hiding state, authority, or consequence",
    reference: "modes/operator.md",
  },
  "public-data": {
    audience: "A public reader exploring evidence without assumed domain fluency",
    defaultTheme: "light",
    dials: {
      density: "balanced",
      imageryRole: "evidence-and-explanation",
      motion: "explanatory",
      typeRegister: "editorial-data",
      variance: "medium",
    },
    objective: "Make comparison, uncertainty, provenance, and the path from overview to detail legible",
    reference: "modes/public-data.md",
  },
  editorial: {
    audience: "A reader following a sustained argument, narrative, or documented record",
    defaultTheme: "light",
    dials: {
      density: "relaxed",
      imageryRole: "narrative-and-evidence",
      motion: "quiet",
      typeRegister: "editorial",
      variance: "medium",
    },
    objective: "Protect reading rhythm, source custody, and the distinction between claim and interpretation",
    reference: "modes/editorial.md",
  },
  marketing: {
    audience: "A prospective user deciding whether a product is distinct, credible, and relevant",
    defaultTheme: "custom-or-light",
    dials: {
      density: "relaxed",
      imageryRole: "art-directed",
      motion: "expressive",
      typeRegister: "branded",
      variance: "high",
    },
    objective: "Create a memorable product argument with honest proof and purposeful visual identity",
    reference: "modes/marketing.md",
  },
});

export const MODEL_TIERS = Object.freeze({
  frontier: {
    contextStrategy: "Load the shared floor and selected mode, then use references only for unresolved decisions.",
    instructionShape: "A concise plan with explicit mechanisms, anti-references, and proof is sufficient.",
    variationStrategy: "Generate alternatives only across a named dial; explain the task consequence of each.",
  },
  standard: {
    contextStrategy: "Load the shared floor, selected mode, and one closest composed pattern.",
    instructionShape: "Use an explicit section-by-section plan and keep each requirement falsifiable.",
    variationStrategy: "Change one named dial at a time and compare against the same production-shaped state.",
  },
  compact: {
    contextStrategy: "Load only the shared floor, selected mode, and the exact component references needed for one slice.",
    instructionShape: "Use a short ordered checklist; do not ask the model to reconcile multiple visual systems.",
    variationStrategy: "Prefer one bounded implementation over open-ended exploration; require an external seeing pass.",
  },
});

export const HARNESS_CONTRACTS = Object.freeze({
  codex: {
    contextStrategy: "Follow repository instructions, inspect the owning surface, and keep the just-in-time design plan adjacent to implementation.",
    toolStrategy: "Use workspace edits and executable checks for implementation; attach browser evidence instead of describing an unseen render.",
  },
  "claude-code": {
    contextStrategy: "Use project instructions plus progressive DES references; keep the selected mode and proof contract stronger than ambient long context.",
    toolStrategy: "Separate implementation from the independent seeing lane and record the actual model returned by the harness when available.",
  },
  cursor: {
    contextStrategy: "Keep the selected mode, exact task, and affected files in the active request; do not assume unselected repository context was loaded.",
    toolStrategy: "Run browser and test commands explicitly and carry their artifact paths into the receipt.",
  },
  generic: {
    contextStrategy: "State the selected mode, relevant references, and proof boundary explicitly; do not infer ambient capabilities.",
    toolStrategy: "Use only declared capabilities and record external evidence with stable locators.",
  },
});

export const CAPABILITIES = new Set(["browser", "image-generation", "visual-input"]);

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function normalizeCapabilities(capabilities = []) {
  const values = [...new Set(capabilities)].sort();
  const invalid = values.filter((value) => !CAPABILITIES.has(value));
  if (invalid.length) throw new Error(`unknown capability '${invalid[0]}'`);
  return values;
}

export function resolveDesignProfile({
  capabilities = [],
  harness = "generic",
  mode,
  modelTier = "standard",
  requestedModel = "unknown",
  servedModel = "unknown",
} = {}) {
  if (!SURFACE_MODES[mode]) {
    throw new Error(`--mode must be one of ${Object.keys(SURFACE_MODES).join(", ")}`);
  }
  if (!MODEL_TIERS[modelTier]) {
    throw new Error(`--model-tier must be one of ${Object.keys(MODEL_TIERS).join(", ")}`);
  }
  if (!harness.trim()) throw new Error("--harness must not be empty");
  const normalizedCapabilities = normalizeCapabilities(capabilities);
  const harnessKey = harness.trim().toLowerCase();
  const canSee = normalizedCapabilities.includes("visual-input");
  const canRender = normalizedCapabilities.includes("browser");
  const payload = {
    capabilities: normalizedCapabilities,
    harness,
    mode,
    modelTier,
    requestedModel,
    servedModel,
  };
  const digest = createHash("sha256").update(canonicalJson(payload)).digest("hex").slice(0, 12);
  return {
    schemaVersion: 1,
    profileId: `des-${mode}-${modelTier}-${digest}`,
    ...payload,
    harnessContract: HARNESS_CONTRACTS[harnessKey] || {
      ...HARNESS_CONTRACTS.generic,
      contextStrategy: `${HARNESS_CONTRACTS.generic.contextStrategy} No DES-specific adapter is registered for '${harness}'.`,
    },
    modeContract: SURFACE_MODES[mode],
    modelContract: MODEL_TIERS[modelTier],
    proofContract: {
      browserEvidence: canRender ? "required" : "unavailable; do not claim rendered correctness",
      independentSeeing: canSee ? "required for ship unless a human explicitly accepts" : "mandatory; this profile cannot see the result",
      maximumAutonomousVerdict: canSee && canRender ? "candidate" : "implementation-only",
    },
  };
}

export function parseProfileArgs(argv) {
  const options = { capabilities: [], format: "json" };
  const take = (index, flag) => {
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
    return value;
  };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--help") options.help = true;
    else if (flag === "--mode") options.mode = take(index++, flag);
    else if (flag === "--harness") options.harness = take(index++, flag);
    else if (flag === "--model-tier") options.modelTier = take(index++, flag);
    else if (flag === "--requested-model") options.requestedModel = take(index++, flag);
    else if (flag === "--served-model") options.servedModel = take(index++, flag);
    else if (flag === "--capability") options.capabilities.push(take(index++, flag));
    else if (flag === "--format") options.format = take(index++, flag);
    else throw new Error(`unknown option '${flag}'`);
  }
  if (!new Set(["json", "markdown"]).has(options.format)) {
    throw new Error("--format must be json or markdown");
  }
  return options;
}

export function profileMarkdown(profile) {
  const dials = profile.modeContract.dials;
  return `# DES design profile\n\n` +
    `- Profile: \`${profile.profileId}\`\n` +
    `- Surface mode: \`${profile.mode}\` — ${profile.modeContract.objective}\n` +
    `- Audience: ${profile.modeContract.audience}\n` +
    `- Harness: \`${profile.harness}\`\n` +
    `- Requested / served model: \`${profile.requestedModel}\` / \`${profile.servedModel}\`\n` +
    `- Model tier: \`${profile.modelTier}\`\n` +
    `- Capabilities: ${profile.capabilities.length ? profile.capabilities.map((value) => `\`${value}\``).join(", ") : "none declared"}\n` +
    `- Style defaults: variance \`${dials.variance}\`, density \`${dials.density}\`, motion \`${dials.motion}\`, type \`${dials.typeRegister}\`, imagery \`${dials.imageryRole}\`\n` +
    `- Read: \`modes/README.md\`, then \`${profile.modeContract.reference}\`\n\n` +
    `## Model and evidence contract\n\n` +
    `- ${profile.modelContract.contextStrategy}\n` +
    `- ${profile.modelContract.instructionShape}\n` +
    `- ${profile.modelContract.variationStrategy}\n` +
    `- Harness context: ${profile.harnessContract.contextStrategy}\n` +
    `- Harness tools: ${profile.harnessContract.toolStrategy}\n` +
    `- Browser evidence: ${profile.proofContract.browserEvidence}.\n` +
    `- Independent seeing: ${profile.proofContract.independentSeeing}.\n` +
    `- Maximum autonomous verdict: \`${profile.proofContract.maximumAutonomousVerdict}\`.\n`;
}

function usage() {
  return `Usage: des-profile --mode <mode> [options]\n\n` +
    `Modes: ${Object.keys(SURFACE_MODES).join(", ")}\n` +
    `Options:\n` +
    `  --harness <name>          Harness name (default: generic)\n` +
    `  --model-tier <tier>       frontier, standard, or compact (default: standard)\n` +
    `  --requested-model <name>  Requested model identifier\n` +
    `  --served-model <name>     Served model identifier when known\n` +
    `  --capability <name>       Repeat: browser, visual-input, image-generation\n` +
    `  --format <format>         json or markdown (default: json)\n` +
    `  --help                    Show this message\n`;
}

function main() {
  try {
    const options = parseProfileArgs(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(usage());
      return;
    }
    const profile = resolveDesignProfile(options);
    process.stdout.write(options.format === "markdown" ? profileMarkdown(profile) : `${JSON.stringify(profile, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`des-profile: ${error.message}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) main();
