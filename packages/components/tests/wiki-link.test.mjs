import test from "node:test";
import assert from "node:assert/strict";

async function load() {
  return import(new URL("../dist/wiki-link.js", import.meta.url));
}

test("getWikiLinkDisplay uses alias when provided", async () => {
  const mod = await load();

  const result = mod.getWikiLinkDisplay({
    target: "TargetPage",
    alias: "Custom Alias",
  });

  assert.equal(result.displayText, "Custom Alias");
  assert.equal(result.hasAlias, true);
});

test("getWikiLinkDisplay falls back to target when no alias", async () => {
  const mod = await load();

  const result = mod.getWikiLinkDisplay({
    target: "TargetPage",
  });

  assert.equal(result.displayText, "TargetPage");
  assert.equal(result.hasAlias, false);
});

test("getWikiLinkDisplay detects heading reference", async () => {
  const mod = await load();

  const result = mod.getWikiLinkDisplay({
    target: "TargetPage",
    heading: "Section",
  });

  assert.equal(result.hasHeading, true);
  assert.equal(result.hasBlockId, false);
});

test("getWikiLinkDisplay detects block reference", async () => {
  const mod = await load();

  const result = mod.getWikiLinkDisplay({
    target: "TargetPage",
    blockId: "abc123",
  });

  assert.equal(result.hasBlockId, true);
  assert.equal(result.hasHeading, false);
});

test("getWikiLinkDisplay combines alias, heading, and block metadata", async () => {
  const mod = await load();

  const result = mod.getWikiLinkDisplay({
    target: "Target",
    alias: "Alias",
    heading: "Head",
    blockId: "block1",
  });

  assert.equal(result.displayText, "Alias");
  assert.equal(result.hasAlias, true);
  assert.equal(result.hasHeading, true);
  assert.equal(result.hasBlockId, true);
});

test("WikiLink is a function", async () => {
  const mod = await load();

  assert.equal(typeof mod.WikiLink, "function");
});
