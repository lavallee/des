import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";

import { resolveDesignProfile } from "../scripts/des-profile.mjs";

const repoRoot = resolve(import.meta.dirname, "..");
const siteRoot = resolve(repoRoot, "website/site");
const pages = [
  "index.html",
  "start/index.html",
  "modes/index.html",
  "profile/index.html",
  "practice/index.html",
  "examples/index.html",
];

function text(relativePath) {
  return readFileSync(resolve(repoRoot, relativePath), "utf8");
}

test("docs site ships six audience-oriented routes with one main landmark each", () => {
  for (const page of pages) {
    const html = readFileSync(resolve(siteRoot, page), "utf8");
    assert.match(html, /<html lang="en"/);
    assert.equal((html.match(/<main(?:\s|>)/g) || []).length, 1, page);
    assert.match(html, /class="site-navigation"/);
    assert.match(html, /href="[^\"]*start\//);
    assert.match(html, /href="[^\"]*modes\//);
    assert.match(html, /href="[^\"]*profile\//);
    assert.match(html, /href="[^\"]*practice\//);
    assert.match(html, /href="[^\"]*examples\//);
  }
});

test("every authored local link and frame resolves under a GitHub project path", () => {
  for (const page of pages) {
    const absolutePage = resolve(siteRoot, page);
    const html = readFileSync(absolutePage, "utf8");
    const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const reference of references) {
      if (/^(?:https?:|data:|#)/.test(reference)) continue;
      assert.ok(!reference.startsWith("/"), `${page}: ${reference} would escape /des/`);
      const withoutQuery = reference.split(/[?#]/, 1)[0];
      if (!withoutQuery) continue;
      const target = resolve(dirname(absolutePage), withoutQuery);
      const resolvedTarget = withoutQuery.endsWith("/") ? resolve(target, "index.html") : target;
      assert.ok(existsSync(resolvedTarget), `${page}: ${reference} does not resolve`);
    }
  }
});

test("profile builder starts from the exact CLI profile contract", () => {
  const expected = resolveDesignProfile({
    mode: "public-data",
    harness: "codex",
    modelTier: "frontier",
    requestedModel: "gpt-5",
    servedModel: "gpt-5",
    capabilities: ["browser", "visual-input"],
  });
  const html = text("website/site/profile/index.html");
  const script = text("website/site/app.js");
  assert.match(html, new RegExp(expected.profileId));
  assert.match(script, /canonicalJson/);
  assert.match(script, /crypto\.subtle\.digest\("SHA-256"/);
  assert.match(script, /maximum autonomous verdict is candidate/);
  assert.doesNotMatch(html, /Loading profile/);
});

test("Lyra examples remain live fixtures, while adoption language stays portable", () => {
  const home = text("website/site/index.html");
  const examples = text("website/site/examples/index.html");
  assert.match(home, /Lyra Forge is the proving ground, not the prerequisite/);
  assert.match(examples, /Adopters should replace them with their own product language/);
  for (const fixture of [
    "website/site/showcase.html",
    "website/site/ui-kits/public-data.html",
    "website/site/ui-kits/weaver.html",
    "website/site/ui-kits/des-marketing.html",
  ]) assert.ok(existsSync(resolve(repoRoot, fixture)), fixture);
});

test("Artoo firewall and Pages workflow publish only the built site", () => {
  const manifest = text("website/artifact.toml");
  const workflow = text(".github/workflows/pages.yml");
  assert.match(manifest, /target = "github-pages"/);
  assert.match(manifest, /mode = "workflow"/);
  assert.ok(existsSync(resolve(repoRoot, "website/work/design-brief.md")));
  assert.ok(existsSync(resolve(repoRoot, "website/work/vizier-guidance.md")));
  assert.ok(!existsSync(resolve(siteRoot, "work")));
  assert.match(workflow, /run: npm test/);
  assert.match(workflow, /path: website\/site/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});

test("rendered proof coordinates and nested-path recovery are build-derived", () => {
  const data = JSON.parse(text("website/site/data/des.json"));
  const declaredTests = readFileSync(resolve(siteRoot, "index.html"), "utf8").match(/data-test-count>(\d+)</)?.[1];
  const fallbackTests = text("website/site/app.js").match(/testCount: (\d+)/)?.[1];
  assert.equal(Number(declaredTests), data.testCount);
  assert.equal(Number(fallbackTests), data.testCount);
  assert.equal(data.testCount, 40);
  const notFound = text("website/site/404.html");
  assert.match(notFound, /href="https:\/\/lavallee\.github\.io\/des\/"/);
  assert.doesNotMatch(notFound, /(?:href|src)="\.\//);
});

test("public adoption instructions are executable and licensing is explicit", () => {
  const start = text("website/site/start/index.html");
  assert.match(start, /npx skills add lavallee\/des/);
  assert.match(start, /npm install github:lavallee\/des#main/);
  assert.match(start, /not claiming a public npm release today/);
  assert.match(text("LICENSE"), /^MIT License/);
  assert.match(text("website/site/index.html"), /rel="canonical" href="https:\/\/lavallee\.github\.io\/des\/"/);
  assert.match(text("website/site/robots.txt"), /Sitemap: https:\/\/lavallee\.github\.io\/des\/sitemap\.xml/);
  assert.match(text("website/site/sitemap.xml"), /https:\/\/lavallee\.github\.io\/des\/examples\//);
});
