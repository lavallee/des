#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";

import { parseArgs, run } from "./des-audit.mjs";

const port = 4300 + (process.pid % 500);
const server = spawn(process.execPath, ["scripts/static-server.mjs", String(port)], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "inherit"],
});

function waitForServer() {
  return new Promise((resolveReady, reject) => {
    const timeout = setTimeout(() => reject(new Error("static showcase server did not become ready")), 5000);
    server.once("error", reject);
    server.once("exit", (code) => {
      if (code !== null && code !== 0) reject(new Error(`static showcase server exited with ${code}`));
    });
    server.stdout.on("data", (chunk) => {
      if (!String(chunk).includes("ready ")) return;
      clearTimeout(timeout);
      resolveReady();
    });
  });
}

let failed = false;

function browserCall(session, args) {
  const result = spawnSync("agent-browser", ["--session", session, "--json", ...args], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error(`showcase behavior audit failed at ${args[0]}: ${result.stderr || result.stdout}`);
  const payload = JSON.parse(result.stdout.trim());
  if (!payload.success) throw new Error(`showcase behavior audit failed at ${args[0]}: ${payload.error}`);
  return payload.data;
}

function requireEval(session, expression, label) {
  const result = browserCall(session, ["eval", `JSON.stringify((() => { ${expression} })())`]);
  const value = JSON.parse(result.result);
  if (!value.pass) throw new Error(`${label}: ${value.detail}`);
}

function exerciseShowcase() {
  const session = `des-decision-behavior-${process.pid}`;
  try {
    browserCall(session, ["set", "viewport", "768", "1024"]);
    browserCall(session, ["open", `http://127.0.0.1:${port}/decision-workspace-showcase.html?theme=dark&audit=1`]);
    browserCall(session, ["wait", "[data-workspace-ready='true']"]);
    browserCall(session, ["eval", `
      const note = document.querySelector('[data-note="retention-window"]');
      note.value = 'Preserve this note through completion and refresh.';
      note.dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#resolve-retention-window').click();
      'started';
    `]);
    browserCall(session, ["wait", "350"]);
    browserCall(session, ["eval", "document.querySelector('#refresh-workspace').click(); 'refreshed'"]);
    requireEval(session, `
      return {
        pass: Boolean(document.querySelector('#workspace-undo')) && !document.querySelector('[data-record="retention-window"]'),
        detail: 'reversible success did not expose undo after refresh',
      };
    `, "success/refresh");
    browserCall(session, ["eval", "document.querySelector('#workspace-undo').click(); 'undoing'"]);
    browserCall(session, ["wait", "250"]);
    requireEval(session, `
      const restored = document.querySelector('[data-record="retention-window"]');
      const note = document.querySelector('[data-note="retention-window"]');
      return {
        pass: Boolean(restored?.open) && note?.value === 'Preserve this note through completion and refresh.',
        detail: 'undo did not restore the open item and its in-progress note',
      };
    `, "undo/continuity");

    browserCall(session, ["eval", `
      document.querySelector('#reset-workspace').click();
      document.querySelector('[data-record="external-publication"] > summary').click();
      document.querySelector('#resolve-external-publication').click();
      'started';
    `]);
    browserCall(session, ["wait", "300"]);
    requireEval(session, `
      return {
        pass: Boolean(document.querySelector('#workspace-retry')) && document.activeElement?.id === 'workspace-error',
        detail: 'failed action did not expose retry and focus the alert',
      };
    `, "failure/retry");
    browserCall(session, ["eval", "document.querySelector('#workspace-retry').click(); 'retrying'"]);
    browserCall(session, ["wait", "300"]);
    requireEval(session, `
      const status = document.querySelector('.action-inbox__status')?.innerText || '';
      return {
        pass: !document.querySelector('#workspace-undo') && status.includes('immutable after publication'),
        detail: 'non-reversible success did not explain why undo is unavailable',
      };
    `, "non-reversible consequence");
  } finally {
    spawnSync("agent-browser", ["--session", session, "close"], { encoding: "utf8" });
  }
  process.stdout.write("behavior walkthrough: pass\n");
}

try {
  await waitForServer();
  exerciseShowcase();
  for (const theme of ["dark", "light"]) {
    const options = parseArgs([
      "--url", `http://127.0.0.1:${port}/decision-workspace-showcase.html?theme=${theme}&audit=1`,
      "--task", "Inspect a human-authority decision, act, and understand recovery",
      "--surface", `DES functional decision workspace (${theme})`,
      "--out", `artifacts/design-receipts/decision-workspace/${theme}`,
      "--wait-for", "[data-workspace-ready='true']",
    ]);
    const { receipt, receiptPath } = run(options);
    for (const capture of receipt.captures) {
      const detail = capture.failures.length ? ` (${capture.failures.join(", ")})` : "";
      process.stdout.write(`${theme}/${capture.label}: ${capture.verdict}${detail}\n`);
    }
    process.stdout.write(`${theme}: ${receipt.verdict} ${receiptPath}\n`);
    if (receipt.verdict !== "pass") failed = true;
  }
} finally {
  server.kill("SIGTERM");
}

if (failed) process.exitCode = 1;
