#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const DEFAULT_VIEWPORTS = [
  { label: "wide", width: 1440, height: 1000 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "mobile", width: 390, height: 844 },
];

export const FOCUSABLE_SELECTOR =
  "a[href],button,summary,input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex='-1'])";

export function hiddenByClosedDetails(closedDetails, element) {
  if (!closedDetails) return false;
  const summary = closedDetails.querySelector(":scope > summary");
  return !summary?.contains(element);
}

const INTERACTIVE_ROLES = new Set([
  "button",
  "checkbox",
  "combobox",
  "link",
  "menuitem",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "textbox",
]);

function usage() {
  return `Usage: des-audit --url <url> --task <task> --surface <surface> [options]

Required:
  --url <url>             Fully qualified route to inspect
  --task <task>           Representative user task in the user's words
  --surface <surface>     Stable name for the product surface

Options:
  --out <directory>       Receipt directory (default: artifacts/design-receipts/<surface>)
  --arm <name>            baseline or variant (default: variant)
  --revision <value>      Revision recorded in the receipt (default: current git state)
  --viewport <WxH>        Repeat to replace the 1440/768/390 defaults
  --wait-for <selector>   Element that marks the route ready (default: body)
  --max-load-ms <n>       Navigation duration budget (default: 3000)
  --max-transfer-kb <n>   Transferred-resource budget (default: 2048)
  --max-resources <n>     Resource-count budget (default: 100)
  --browser <path>        agent-browser executable (default: agent-browser)
  --help                  Show this message
`;
}

export function parseViewport(value) {
  const match = /^(\d+)x(\d+)$/.exec(value);
  if (!match) throw new Error(`invalid viewport '${value}'; expected WxH, for example 1440x1000`);
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (width < 240 || height < 240) throw new Error(`viewport '${value}' is implausibly small`);
  return { label: `${width}x${height}`, width, height };
}

export function parseArgs(argv) {
  const options = {
    arm: "variant",
    browser: "agent-browser",
    maxLoadMs: 3000,
    maxResources: 100,
    maxTransferKb: 2048,
    viewports: [],
    waitFor: "body",
  };
  const take = (index, flag) => {
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
    return value;
  };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--help") options.help = true;
    else if (flag === "--url") options.url = take(index++, flag);
    else if (flag === "--task") options.task = take(index++, flag);
    else if (flag === "--surface") options.surface = take(index++, flag);
    else if (flag === "--out") options.out = take(index++, flag);
    else if (flag === "--arm") options.arm = take(index++, flag);
    else if (flag === "--revision") options.revision = take(index++, flag);
    else if (flag === "--wait-for") options.waitFor = take(index++, flag);
    else if (flag === "--browser") options.browser = take(index++, flag);
    else if (flag === "--viewport") options.viewports.push(parseViewport(take(index++, flag)));
    else if (flag === "--max-load-ms") options.maxLoadMs = Number(take(index++, flag));
    else if (flag === "--max-transfer-kb") options.maxTransferKb = Number(take(index++, flag));
    else if (flag === "--max-resources") options.maxResources = Number(take(index++, flag));
    else throw new Error(`unknown option '${flag}'`);
  }
  if (options.help) return options;
  for (const field of ["url", "task", "surface"]) {
    if (!options[field]) throw new Error(`--${field} is required`);
  }
  if (!new Set(["baseline", "variant"]).has(options.arm)) {
    throw new Error("--arm must be baseline or variant");
  }
  for (const field of ["maxLoadMs", "maxTransferKb", "maxResources"]) {
    if (!Number.isFinite(options[field]) || options[field] <= 0) {
      throw new Error(`--${field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} must be positive`);
    }
  }
  options.viewports = options.viewports.length ? options.viewports : DEFAULT_VIEWPORTS;
  const slug = options.surface.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  options.out = resolve(options.out || `artifacts/design-receipts/${slug || "surface"}`);
  return options;
}

function gitRevision() {
  try {
    const revision = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
    const dirty = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim();
    return `${revision}${dirty ? "+dirty" : ""}`;
  } catch {
    return "unknown";
  }
}

function browserVersion(binary) {
  const result = spawnSync(binary, ["--version"], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`cannot run ${binary}; install agent-browser and its browser runtime first`);
  }
  return result.stdout.trim();
}

function browserCall(binary, session, args) {
  const result = spawnSync(binary, ["--session", session, "--json", ...args], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`${binary} ${args[0]} failed: ${(result.stderr || result.stdout).trim()}`);
  }
  let payload;
  try {
    payload = JSON.parse(result.stdout.trim());
  } catch {
    throw new Error(`${binary} ${args[0]} returned non-JSON output`);
  }
  if (!payload.success) throw new Error(`${binary} ${args[0]} failed: ${payload.error || "unknown error"}`);
  return payload.data;
}

function browserAudit(isHiddenByClosedDetails, focusableSelector) {
  const visible = (element) => {
    const style = getComputedStyle(element);
    if (element.getClientRects().length === 0 || style.visibility === "hidden" || style.display === "none") {
      return false;
    }
    // Chromium can retain client rects for descendants of a closed details
    // element even though they cannot be reached or focused. Its direct
    // summary remains visible; everything else in the closed disclosure is
    // outside the current interaction surface.
    const closedDetails = element.closest("details:not([open])");
    if (isHiddenByClosedDetails(closedDetails, element)) return false;
    return true;
  };
  const describe = (element) => {
    const id = element.id ? `#${element.id}` : "";
    const text = (element.getAttribute("aria-label") || element.textContent || "").trim().replace(/\s+/g, " ");
    return `${element.tagName.toLowerCase()}${id}${text ? ` (${text.slice(0, 48)})` : ""}`;
  };
  const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(visible);
  const headingSkips = [];
  headings.forEach((heading, index) => {
    if (!index) return;
    const previous = Number(headings[index - 1].tagName.slice(1));
    const current = Number(heading.tagName.slice(1));
    if (current > previous + 1) headingSkips.push(`${describe(headings[index - 1])} -> ${describe(heading)}`);
  });

  const ids = [...document.querySelectorAll("[id]")].map((element) => element.id).filter(Boolean);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const images = [...document.querySelectorAll("img")].filter(visible);
  const imagesWithoutAlt = images.filter((image) => !image.hasAttribute("alt")).map(describe);
  const imagesFailed = images.filter((image) => !image.complete || image.naturalWidth === 0).map(describe);
  const tabbables = [...document.querySelectorAll(focusableSelector)]
    .filter((element) => visible(element) && !element.disabled)
    .slice(0, 80);
  const focusWithoutIndicator = [];
  for (const element of tabbables) {
    const before = getComputedStyle(element);
    const baseline = {
      backgroundColor: before.backgroundColor,
      borderColor: before.borderColor,
      boxShadow: before.boxShadow,
      outlineColor: before.outlineColor,
      outlineStyle: before.outlineStyle,
      outlineWidth: before.outlineWidth,
    };
    // Chromium's focusVisible option forces keyboard-modality focus so
    // :focus-visible styles are exercised without synthesizing 80 Tab presses.
    element.focus({ focusVisible: true });
    const after = getComputedStyle(element);
    const outline = after.outlineStyle !== "none" && Number.parseFloat(after.outlineWidth) >= 1;
    const shadow = after.boxShadow !== "none";
    const changed = ["backgroundColor", "borderColor", "boxShadow", "outlineColor", "outlineStyle", "outlineWidth"]
      .some((property) => baseline[property] !== after[property]);
    if (!outline && !shadow && !changed) focusWithoutIndicator.push(describe(element));
  }
  document.activeElement?.blur?.();

  const navigation = performance.getEntriesByType("navigation")[0];
  const resources = performance.getEntriesByType("resource");
  const paints = Object.fromEntries(performance.getEntriesByType("paint").map((entry) => [entry.name, Math.round(entry.startTime)]));
  return {
    document: {
      title: document.title,
      lang: document.documentElement.lang,
      mainLandmarks: document.querySelectorAll("main,[role=main]").length,
      headings: headings.map((heading) => ({ level: Number(heading.tagName.slice(1)), text: heading.textContent.trim().slice(0, 120) })),
    },
    layout: {
      bodyOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    },
    render: {
      styleSheetCount: document.styleSheets.length,
      visibleGraphicCount: [...document.querySelectorAll("img,svg,canvas,video")].filter(visible).length,
      visibleTextCharacters: (document.body.innerText || "").replace(/\s+/g, " ").trim().length,
    },
    accessibility: { duplicateIds, focusWithoutIndicator, headingSkips, imagesFailed, imagesWithoutAlt },
    performance: {
      domContentLoadedMs: navigation ? Math.round(navigation.domContentLoadedEventEnd) : null,
      failedResources: resources
        .filter((entry) => Number(entry.responseStatus) >= 400)
        .map((entry) => ({ status: entry.responseStatus, url: entry.name })),
      loadMs: navigation ? Math.round(navigation.loadEventEnd || navigation.duration) : null,
      paints,
      resourceCount: resources.length,
      transferKb: Math.round(resources.reduce((total, entry) => total + (entry.transferSize || 0), 0) / 1024),
    },
  };
}

export function assessCapture({ audit, consoleEntries, pageErrors, snapshotRefs, budgets }) {
  const unnamedInteractive = Object.entries(snapshotRefs || {})
    .filter(([, value]) => INTERACTIVE_ROLES.has(value.role) && !(value.name || "").trim())
    .map(([ref, value]) => ({ ref, role: value.role }));
  const failures = [];
  if (audit.render.visibleTextCharacters < 10 && audit.render.visibleGraphicCount === 0) failures.push("blank-render");
  if (audit.layout.bodyOverflow) failures.push("body-overflow");
  if (!audit.document.title.trim()) failures.push("missing-title");
  if (!audit.document.lang.trim()) failures.push("missing-document-language");
  if (audit.document.mainLandmarks !== 1) failures.push("main-landmark-count");
  if (audit.accessibility.duplicateIds.length) failures.push("duplicate-ids");
  if (audit.accessibility.focusWithoutIndicator?.length) failures.push("missing-focus-indicators");
  if (audit.accessibility.headingSkips.length) failures.push("heading-level-skips");
  if (audit.accessibility.imagesFailed?.length) failures.push("images-failed-to-load");
  if (audit.accessibility.imagesWithoutAlt.length) failures.push("images-without-alt");
  if (unnamedInteractive.length) failures.push("unnamed-interactive-controls");
  if (pageErrors.length) failures.push("page-errors");
  if (consoleEntries.some((entry) => entry.type === "error" || entry.level === "error")) failures.push("console-errors");
  if (audit.performance.failedResources?.length) failures.push("resource-load-failures");
  if (audit.performance.loadMs !== null && audit.performance.loadMs > budgets.maxLoadMs) failures.push("load-budget");
  if (audit.performance.transferKb > budgets.maxTransferKb) failures.push("transfer-budget");
  if (audit.performance.resourceCount > budgets.maxResources) failures.push("resource-budget");
  return { failures, unnamedInteractive, verdict: failures.length ? "fail" : "pass" };
}

function captureViewport(options, viewport, version) {
  const directory = resolve(options.out, options.arm);
  mkdirSync(directory, { recursive: true });
  const session = `des-${process.pid}-${viewport.width}`;
  const screenshot = resolve(directory, `${viewport.label}.png`);
  const snapshotPath = resolve(directory, `${viewport.label}.accessibility.txt`);
  try {
    browserCall(options.browser, session, ["set", "viewport", String(viewport.width), String(viewport.height)]);
    browserCall(options.browser, session, ["open", options.url]);
    browserCall(options.browser, session, ["wait", options.waitFor]);
    try {
      browserCall(options.browser, session, ["wait", "--load", "networkidle"]);
    } catch {
      browserCall(options.browser, session, ["wait", "750"]);
    }
    const auditExpression =
      `JSON.stringify((${browserAudit.toString()})` +
      `((${hiddenByClosedDetails.toString()}), ${JSON.stringify(FOCUSABLE_SELECTOR)}))`;
    const auditResult = browserCall(options.browser, session, ["eval", auditExpression]);
    const audit = JSON.parse(auditResult.result);
    const snapshot = browserCall(options.browser, session, ["snapshot", "-c"]);
    const consoleEntries = browserCall(options.browser, session, ["console"]).entries || [];
    const pageErrors = browserCall(options.browser, session, ["errors"]).errors || [];
    browserCall(options.browser, session, ["screenshot", screenshot, "--full"]);
    writeFileSync(snapshotPath, `${snapshot.snapshot || ""}\n`, "utf8");
    const assessment = assessCapture({
      audit,
      budgets: options,
      consoleEntries,
      pageErrors,
      snapshotRefs: snapshot.refs,
    });
    return {
      ...viewport,
      accessibilitySnapshot: relative(options.out, snapshotPath),
      agentBrowser: version,
      audit,
      consoleEntries,
      pageErrors,
      screenshot: relative(options.out, screenshot),
      ...assessment,
    };
  } finally {
    spawnSync(options.browser, ["--session", session, "close"], { encoding: "utf8" });
  }
}

export function run(options) {
  const version = browserVersion(options.browser);
  const captures = options.viewports.map((viewport) => captureViewport(options, viewport, version));
  const receipt = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    task: options.task,
    surface: options.surface,
    url: options.url,
    arm: options.arm,
    revision: options.revision || gitRevision(),
    tool: { agentBrowser: version },
    budgets: {
      maxLoadMs: options.maxLoadMs,
      maxResources: options.maxResources,
      maxTransferKb: options.maxTransferKb,
    },
    captures,
    verdict: captures.every((capture) => capture.verdict === "pass") ? "pass" : "fail",
  };
  mkdirSync(options.out, { recursive: true });
  const receiptPath = resolve(options.out, `${options.arm}.receipt.json`);
  writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  return { receipt, receiptPath };
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(usage());
      return;
    }
    const { receipt, receiptPath } = run(options);
    for (const capture of receipt.captures) {
      const detail = capture.failures.length ? ` (${capture.failures.join(", ")})` : "";
      process.stdout.write(`${capture.label}: ${capture.verdict}${detail}\n`);
    }
    process.stdout.write(`${receipt.verdict}: ${receiptPath}\n`);
    if (receipt.verdict !== "pass") process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`des-audit: ${error.message}\n`);
    process.exitCode = 2;
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) main();
