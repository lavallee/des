const FALLBACK_DATA = {
  packageVersion: "0.5.0",
  testCount: 41,
  revision: "unknown",
  modes: {
    operator: {
      audience: "A practiced operator completing repeated, consequential work",
      objective: "Reduce decision time and error without hiding state, authority, or consequence",
      dials: { variance: "low", density: "compact", motion: "functional", typeRegister: "interface", imageryRole: "evidence-only" },
    },
    "public-data": {
      audience: "A public reader exploring evidence without assumed domain fluency",
      objective: "Make comparison, uncertainty, provenance, and the path from overview to detail legible",
      dials: { variance: "medium", density: "balanced", motion: "explanatory", typeRegister: "editorial-data", imageryRole: "evidence-and-explanation" },
    },
    editorial: {
      audience: "A reader following a sustained argument, narrative, or documented record",
      objective: "Protect reading rhythm, source custody, and the distinction between claim and interpretation",
      dials: { variance: "medium", density: "relaxed", motion: "quiet", typeRegister: "editorial", imageryRole: "narrative-and-evidence" },
    },
    marketing: {
      audience: "A prospective user deciding whether a product is distinct, credible, and relevant",
      objective: "Create a memorable product argument with honest proof and purposeful visual identity",
      dials: { variance: "high", density: "relaxed", motion: "expressive", typeRegister: "branded", imageryRole: "art-directed" },
    },
  },
  modelTiers: {
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
  },
  harnesses: {
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
  },
  examples: {
    operator: "showcase.html",
    "public-data": "ui-kits/public-data.html",
    editorial: "ui-kits/weaver.html",
    marketing: "ui-kits/des-marketing.html",
  },
};

const MODE_ORDER = ["operator", "public-data", "editorial", "marketing"];
const MODE_LABELS = {
  operator: "Operator",
  "public-data": "Public data",
  editorial: "Editorial",
  marketing: "Marketing",
};

const base = document.body.dataset.base || "./";
let siteData = FALLBACK_DATA;

async function loadSiteData() {
  try {
    const response = await fetch(`${base}data/des.json`);
    if (!response.ok) throw new Error(`data request returned ${response.status}`);
    siteData = await response.json();
  } catch {
    // The fallback keeps every interaction working when opened directly from file://.
    siteData = FALLBACK_DATA;
  }
  return siteData;
}

function titleCase(value) {
  return value.split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(" ");
}

function setMode(mode, { updateUrl = false } = {}) {
  if (!siteData.modes[mode]) return;
  const contract = siteData.modes[mode];
  const dials = contract.dials;
  const index = MODE_ORDER.indexOf(mode) + 1;
  document.documentElement.dataset.surfaceMode = mode;

  document.querySelectorAll("[data-mode-select]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.modeSelect === mode));
  });

  const values = {
    label: MODE_LABELS[mode],
    number: `${String(index).padStart(2, "0")} / 04`,
    audience: contract.audience,
    objective: contract.objective,
    variance: titleCase(dials.variance),
    density: titleCase(dials.density),
    motion: titleCase(dials.motion),
    type: titleCase(dials.typeRegister),
    imagery: titleCase(dials.imageryRole),
  };
  Object.entries(values).forEach(([field, value]) => {
    document.querySelectorAll(`[data-mode-field="${field}"]`).forEach((element) => {
      element.textContent = value;
    });
  });

  const example = siteData.examples[mode];
  document.querySelectorAll("[data-mode-example]").forEach((link) => {
    link.href = `${base}${example}`;
  });
  document.querySelectorAll("[data-mode-frame]").forEach((frame) => {
    if (!frame.src.endsWith(example)) frame.src = `${base}${example}`;
    frame.title = `${MODE_LABELS[mode]} DES reference`;
  });
  const chooser = document.querySelector("[data-mode-recommend]");
  if (chooser) chooser.value = mode;

  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    window.history.replaceState({}, "", url);
  }
}

function setupModes() {
  document.querySelectorAll("[data-mode-select]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.modeSelect, { updateUrl: true }));
  });
  const chooser = document.querySelector("[data-mode-recommend]");
  const chooserButton = document.querySelector("[data-choose-mode]");
  if (chooser && chooserButton) {
    chooserButton.addEventListener("click", () => setMode(chooser.value, { updateUrl: true }));
  }
  const requested = new URLSearchParams(window.location.search).get("mode");
  const initial = siteData.modes[requested] ? requested : (document.body.dataset.page === "home" ? "marketing" : "operator");
  setMode(initial);
}

function renderBuildCoordinates() {
  document.querySelectorAll("[data-test-count]").forEach((element) => {
    element.textContent = String(siteData.testCount);
  });
}

function setupNavigation() {
  const button = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".site-navigation");
  if (!button || !navigation) return;
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    navigation.dataset.open = String(open);
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    button.setAttribute("aria-expanded", "false");
    navigation.dataset.open = "false";
  }));
}

async function copyText(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("clipboard command was denied");
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(button.dataset.copyTarget);
      if (!target) return;
      const original = button.textContent;
      try {
        await copyText(target.textContent.trim());
        button.textContent = "Copied";
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = "Selected — press Ctrl+C";
      }
      window.setTimeout(() => { button.textContent = original; }, 1600);
    });
  });
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

async function shortDigest(payload) {
  if (!window.crypto?.subtle) return "run-the-cli";
  const bytes = new TextEncoder().encode(canonicalJson(payload));
  const result = await window.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(result)].map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 12);
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", `'"'"'`)}'`;
}

function profileValue(form, name) {
  return new FormData(form).get(name)?.toString().trim() || "unknown";
}

function setupProfileBuilder() {
  const form = document.querySelector("#profile-builder-form");
  if (!form) return;
  let renderSequence = 0;

  const render = async () => {
    const sequence = ++renderSequence;
    const formData = new FormData(form);
    const mode = profileValue(form, "mode");
    const harness = profileValue(form, "harness");
    const modelTier = profileValue(form, "modelTier");
    const requestedModel = profileValue(form, "requestedModel");
    const servedModel = profileValue(form, "servedModel");
    const capabilities = formData.getAll("capabilities").map(String).sort();
    const payload = { capabilities, harness, mode, modelTier, requestedModel, servedModel };
    const digest = await shortDigest(payload);
    if (sequence !== renderSequence) return;

    const profileId = `des-${mode}-${modelTier}-${digest}`;
    const modeContract = siteData.modes[mode];
    const modelContract = siteData.modelTiers[modelTier];
    const harnessContract = siteData.harnesses[harness] || siteData.harnesses.generic;
    const canRender = capabilities.includes("browser");
    const canSee = capabilities.includes("visual-input");
    const commandLines = [
      "des-profile",
      `  --mode ${mode}`,
      `  --harness ${harness}`,
      `  --requested-model ${shellQuote(requestedModel)}`,
      `  --served-model ${shellQuote(servedModel)}`,
      `  --model-tier ${modelTier}`,
      ...capabilities.map((capability) => `  --capability ${capability}`),
      "  --format markdown",
    ];
    const continuation = ` ${String.fromCharCode(92)}`;
    const command = commandLines
      .map((line, index) => `${line}${index < commandLines.length - 1 ? continuation : ""}`)
      .join("\n");

    document.querySelector("[data-profile-id]").textContent = profileId;
    document.querySelector("[data-profile-command]").textContent = command;
    document.querySelector("[data-profile-objective]").textContent = modeContract.objective;
    document.querySelector("[data-profile-context]").textContent = modelContract.contextStrategy;
    document.querySelector("[data-profile-harness]").textContent = `${harnessContract.contextStrategy} ${harnessContract.toolStrategy}`;
    document.querySelector("[data-profile-proof]").textContent = canRender
      ? (canSee ? "Browser evidence and independent seeing are required; the maximum autonomous verdict is candidate." : "Browser evidence is required, but this tuple cannot see it. Independent seeing is mandatory before promotion.")
      : "This tuple cannot claim rendered correctness. Add browser evidence or stop at implementation-only.";
    setMode(mode);
  };

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  render();
}

loadSiteData().then(() => {
  renderBuildCoordinates();
  setupNavigation();
  setupModes();
  setupCopyButtons();
  setupProfileBuilder();
});
