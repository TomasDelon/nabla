import test from "node:test";
import assert from "node:assert/strict";

async function loadFootnote() {
  return import(new URL("../dist/footnote.js", import.meta.url));
}

async function loadComment() {
  return import(new URL("../dist/comment.js", import.meta.url));
}

test("getFootnoteDisplay for reference", async () => {
  const mod = await loadFootnote();

  const result = mod.getFootnoteDisplay({
    footnoteKind: "reference",
    id: "ref1",
  });

  assert.equal(result.kind, "reference");
  assert.equal(result.id, "ref1");
  assert.equal(result.text, undefined);
  assert.equal(result.displayText, "[ref1]");
});

test("getFootnoteDisplay for definition", async () => {
  const mod = await loadFootnote();

  const result = mod.getFootnoteDisplay({
    footnoteKind: "definition",
    id: "def1",
    text: "Definition text.",
  });

  assert.equal(result.kind, "definition");
  assert.equal(result.id, "def1");
  assert.equal(result.text, "Definition text.");
  assert.equal(result.displayText, "[^def1]: Definition text.");
});

test("FootnoteReference is a function", async () => {
  const mod = await loadFootnote();

  assert.equal(typeof mod.FootnoteReference, "function");
});

test("FootnoteDefinition is a function", async () => {
  const mod = await loadFootnote();

  assert.equal(typeof mod.FootnoteDefinition, "function");
});

test("getCommentDisplay in editing mode shows visible", async () => {
  const mod = await loadComment();

  const result = mod.getCommentDisplay({
    text: "note",
    multiline: false,
    raw: "%%note%%",
    mode: "editing",
  });

  assert.equal(result.text, "note");
  assert.equal(result.multiline, false);
  assert.equal(result.visible, true);
});

test("getCommentDisplay in reading mode hides", async () => {
  const mod = await loadComment();

  const result = mod.getCommentDisplay({
    text: "note",
    multiline: false,
    raw: "%%note%%",
    mode: "reading",
  });

  assert.equal(result.visible, false);
});

test("getCommentDisplay preserves multiline flag", async () => {
  const mod = await loadComment();

  const result = mod.getCommentDisplay({
    text: "line 1\nline 2",
    multiline: true,
    raw: "%%line 1\nline 2%%",
    mode: "editing",
  });

  assert.equal(result.multiline, true);
  assert.equal(result.visible, true);
});

test("Comment is a function", async () => {
  const mod = await loadComment();

  assert.equal(typeof mod.Comment, "function");
});
