import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const protectedRegionsModuleUrl = new URL("../src/protected-regions.ts", import.meta.url);

let protectedRegionsModulePromise;

async function loadProtectedRegionsModule() {
  protectedRegionsModulePromise ??= (async () => {
    const source = await readFile(protectedRegionsModuleUrl, "utf8");
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022
      }
    });

    return import(
      `data:text/javascript;base64,${Buffer.from(transpiled.outputText, "utf8").toString("base64")}`
    );
  })();

  return protectedRegionsModulePromise;
}

test("protected region utilities export public scanning helpers", async () => {
  const source = await readFile(protectedRegionsModuleUrl, "utf8");
  const indexSource = await readFile(new URL("../src/index.ts", import.meta.url), "utf8");

  assert.match(source, /export function findProtectedRegions\(source: string\)/);
  assert.match(source, /export function isOffsetProtected\(regions: ProtectedRegion\[], offset: number\)/);
  assert.match(indexSource, /export \{ findProtectedRegions, isOffsetProtected \} from "\.\/protected-regions\.js";/);
});

test("protected region utilities identify inline code and fenced code blocks", async () => {
  const { findProtectedRegions, isOffsetProtected } = await loadProtectedRegionsModule();
  const source = "alpha `[[tag]]` beta\n```js\n![[note]]\n```\n";
  const regions = findProtectedRegions(source);

  assert.deepEqual(
    regions.map((region) => region.kind),
    ["inlineCode", "fencedCodeBlock"]
  );
  assert.equal(regions[0].text, "`[[tag]]`");
  assert.match(regions[1].text, /```js\n!\[\[note\]\]\n```/);
  assert.equal(isOffsetProtected(regions, source.indexOf("[[tag]]")), true);
  assert.equal(isOffsetProtected(regions, source.indexOf("alpha")), false);
});

test("protected region utilities identify indented code blocks and raw html blocks", async () => {
  const { findProtectedRegions } = await loadProtectedRegionsModule();
  const source = [
    "    [[task]]",
    "    ![[note]]",
    "",
    "<div>",
    "[[inside-html]]",
    "</div>",
    "",
  ].join("\n");
  const regions = findProtectedRegions(source);

  assert.deepEqual(
    regions.map((region) => region.kind),
    ["indentedCodeBlock", "rawHtmlBlock"]
  );
  assert.match(regions[0].text, /    \[\[task\]\]\n    !\[\[note\]\]\n/);
  assert.match(regions[1].text, /<div>\n\[\[inside-html\]\]\n<\/div>\n/);
});

test("protected region utilities identify inline html without treating surrounding text as protected", async () => {
  const { findProtectedRegions, isOffsetProtected } = await loadProtectedRegionsModule();
  const source = "before <span data-x=\"1\">[[tag]]</span> after";
  const regions = findProtectedRegions(source);

  assert.deepEqual(
    regions.map((region) => region.text),
    ["<span data-x=\"1\">", "</span>"]
  );
  assert.deepEqual(
    regions.map((region) => region.kind),
    ["inlineHtml", "inlineHtml"]
  );
  assert.equal(isOffsetProtected(regions, source.indexOf("before")), false);
  assert.equal(isOffsetProtected(regions, source.indexOf("<span")), true);
});
