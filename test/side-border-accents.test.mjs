import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "components.css",
  "showcase.html",
  "playground.html",
  "website/site/site.css",
  "website/site/lib/artoo-kit/base.css",
  ...readdirSync(resolve(root, "preview"))
    .filter((name) => name.endsWith(".html"))
    .map((name) => `preview/${name}`),
  ...readdirSync(resolve(root, "ui-kits"))
    .filter((name) => name.endsWith(".html"))
    .map((name) => `ui-kits/${name}`),
];

const sideBorderPattern =
  /(border-(?:left|right|inline-start|inline-end)(?:-color|-width)?)\s*:\s*([^;]+)/g;

function isNavigationSelector(selector) {
  return /(nav|menu|sidebar|sb__)/i.test(selector);
}

function isAllowed(selector, property, value) {
  const normalized = value.trim();
  if (/^(?:0|none)$/.test(normalized)) return true;
  if (
    /^1px\s+solid\b/.test(normalized)
    && !/--(?:accent|info|warning|error|success|coral|blue|indigo|cyan|purple|amber|emerald)/.test(
      normalized,
    )
  ) return true;
  if (isNavigationSelector(selector) && /transparent/.test(normalized)) return true;
  if (
    isNavigationSelector(selector)
    && /(active|aria-current|:hover|:focus)/i.test(selector)
    && (property.endsWith("-color") || /var\(--accent\)/.test(normalized))
  ) return true;
  return false;
}

test("shipped DES surfaces contain no decorative side-border accents", () => {
  const violations = [];

  for (const file of files) {
    let source = readFileSync(resolve(root, file), "utf8");
    if (file.endsWith(".html")) {
      source = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
        .map((match) => match[1])
        .join("\n");
    }
    source = source.replace(/\/\*[\s\S]*?\*\//g, "");
    for (const block of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = block[1].trim();
      for (const declaration of block[2].matchAll(sideBorderPattern)) {
        const [, property, value] = declaration;
        if (!isAllowed(selector, property, value)) {
          violations.push(`${file}: ${selector} { ${property}: ${value.trim()} }`);
        }
      }
    }
  }

  assert.deepEqual(violations, []);
});
