import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("DES routes four modes before visual style", () => {
  const skill = read("SKILL.md");
  const router = read("modes/README.md");
  for (const mode of ["operator", "public-data", "editorial", "marketing"]) {
    assert.match(skill, new RegExp(`modes/${mode}\\.md`));
    assert.match(router, new RegExp("`" + mode + "`"));
  }
  assert.match(router, /Style dials are independent of mode/);
  assert.match(router, /does \*\*not\*\* ban gradients, shadows, expressive typography/);
});

test("public-data reference demonstrates scope, exact values, share state, and recovery", () => {
  const page = read("ui-kits/public-data.html");
  assert.match(page, /data-scope="wire"/);
  assert.match(page, /id="exact-values"/);
  assert.match(page, /searchParams\.set\("scope"/);
  assert.match(page, /No records match this view/);
  assert.match(page, /Reset to all March records/);
  assert.match(page, /synthetic dataset/i);
});

test("marketing reference does not explicitly drop navigation at narrow widths", () => {
  const page = read("ui-kits/des-marketing.html");
  assert.doesNotMatch(page, /\.nav\s*\{\s*display:\s*none/);
  assert.match(page, /Mode docs \(Markdown\)/);
  assert.match(page, /status · candidate/);
});

test("reference navigation uses real anchors", () => {
  for (const path of ["ui-kits/keel.html", "ui-kits/weaver.html", "ui-kits/public-data.html", "ui-kits/des-marketing.html"]) {
    assert.doesNotMatch(read(path), /<a(?:\s+class="[^"]*")?>[^<]+<\/a>/, `${path} contains an href-less text anchor`);
  }
});
