#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  HARNESS_CONTRACTS,
  MODEL_TIERS,
  SURFACE_MODES,
} from "../scripts/des-profile.mjs";

const artifactRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(artifactRoot, "..");
const siteRoot = resolve(artifactRoot, "site");

const generatedDirectories = ["assets", "data", "themes", "ui-kits"];
const generatedFiles = ["colors_and_type.css", "components.css", "showcase.html", "tokens.css"];

mkdirSync(siteRoot, { recursive: true });
for (const relativePath of generatedDirectories) {
  rmSync(resolve(siteRoot, relativePath), { recursive: true, force: true });
}
for (const relativePath of generatedFiles) {
  rmSync(resolve(siteRoot, relativePath), { force: true });
}

for (const relativePath of ["assets", "themes", "ui-kits"]) {
  cpSync(resolve(repoRoot, relativePath), resolve(siteRoot, relativePath), { recursive: true });
}
for (const relativePath of ["colors_and_type.css", "components.css", "showcase.html", "tokens.css"]) {
  cpSync(resolve(repoRoot, relativePath), resolve(siteRoot, relativePath));
}

const packageMetadata = JSON.parse(readFileSync(resolve(repoRoot, "package.json"), "utf8"));
const testCount = readdirSync(resolve(repoRoot, "test"))
  .filter((name) => name.endsWith(".test.mjs"))
  .reduce((count, name) => {
    const source = readFileSync(resolve(repoRoot, "test", name), "utf8");
    return count + (source.match(/^\s*test\(/gm) || []).length;
  }, 0);
let revision = "unknown";
try {
  revision = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
} catch {
  // A source archive can still build; the site labels the missing coordinate honestly.
}

mkdirSync(resolve(siteRoot, "data"), { recursive: true });
writeFileSync(resolve(siteRoot, "data", "des.json"), `${JSON.stringify({
  schemaVersion: 1,
  packageVersion: packageMetadata.version,
  testCount,
  revision,
  modes: SURFACE_MODES,
  modelTiers: MODEL_TIERS,
  harnesses: HARNESS_CONTRACTS,
  examples: {
    operator: "showcase.html",
    "public-data": "ui-kits/public-data.html",
    editorial: "ui-kits/weaver.html",
    marketing: "ui-kits/des-marketing.html",
  },
}, null, 2)}\n`, "utf8");

const required = [
  "index.html",
  "404.html",
  "start/index.html",
  "modes/index.html",
  "profile/index.html",
  "practice/index.html",
  "examples/index.html",
  "site.css",
  "app.js",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "data/des.json",
  "showcase.html",
  "ui-kits/public-data.html",
  "ui-kits/weaver.html",
  "ui-kits/des-marketing.html",
];
const missing = required.filter((relativePath) => !existsSync(resolve(siteRoot, relativePath)));
if (missing.length) {
  throw new Error(`DES docs build is missing: ${missing.join(", ")}`);
}

process.stdout.write(`DES docs ${packageMetadata.version} (${revision}) built at ${siteRoot}\n`);
