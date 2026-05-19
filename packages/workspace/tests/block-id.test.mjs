import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const blockIndexModuleUrl = new URL("../src/block-index.ts", import.meta.url);

async function loadModule() {
  return loadTsModule(blockIndexModuleUrl);
}

test("extracts block IDs from paragraphs", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "paragraph",
      children: [{ type: "text", value: "Hello." }],
      data: { nablaBlockId: "greeting" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
    },
  ];
  const result = buildBlockIndex(children, "test.md");
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].blockId, "greeting");
  assert.equal(result.entries[0].filePath, "test.md");
  assert.deepEqual(result.entries[0].position, {
    start: { line: 1, column: 1, offset: 0 },
    end: { line: 1, column: 7, offset: 6 },
  });
  assert.equal(result.diagnostics.length, 0);
});

test("extracts block IDs from headings", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "heading",
      depth: 2,
      children: [{ type: "text", value: "Section" }],
      data: { nablaBlockId: "sec-1" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 10, offset: 9 } },
    },
  ];
  const result = buildBlockIndex(children, "doc.md");
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].blockId, "sec-1");
  assert.equal(result.diagnostics.length, 0);
});

test("extracts block IDs from foldable headings", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "foldableHeading",
      depth: 3,
      foldState: "open",
      title: [{ type: "text", value: "Foldable" }],
      rawMarker: "#> ",
      children: [{ type: "paragraph", children: [{ type: "text", value: "Nested." }] }],
      data: { nablaBlockId: "fold-id" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 2, column: 8, offset: 20 } },
    },
  ];
  const result = buildBlockIndex(children, "doc.md");
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].blockId, "fold-id");
  assert.equal(result.diagnostics.length, 0);
});

test("extracts block IDs from list items", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "list",
      children: [
        {
          type: "listItem",
          children: [{ type: "paragraph", children: [{ type: "text", value: "Item." }] }],
          data: { nablaBlockId: "item-1" },
          position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
        },
      ],
    },
  ];
  const result = buildBlockIndex(children, "doc.md");
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].blockId, "item-1");
  assert.equal(result.diagnostics.length, 0);
});

test("extracts block IDs from callouts", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "callout",
      calloutType: "info",
      title: [{ type: "text", value: "Note" }],
      syntax: "canonical",
      rawMarker: "> ",
      children: [{ type: "paragraph", children: [{ type: "text", value: "Content." }] }],
      data: { nablaBlockId: "callout-id" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 2, column: 9, offset: 22 } },
    },
  ];
  const result = buildBlockIndex(children, "doc.md");
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].blockId, "callout-id");
  assert.equal(result.diagnostics.length, 0);
});

test("extracts block IDs from toggles", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "toggle",
      title: [{ type: "text", value: "Details" }],
      foldState: "closed",
      rawMarker: "]>",
      children: [{ type: "paragraph", children: [{ type: "text", value: "Hidden." }] }],
      data: { nablaBlockId: "toggle-id" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 2, column: 8, offset: 20 } },
    },
  ];
  const result = buildBlockIndex(children, "doc.md");
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].blockId, "toggle-id");
  assert.equal(result.diagnostics.length, 0);
});

test("extracts block IDs from transclusions", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "transclusion",
      target: "other.md",
      syntax: "canonical",
      raw: "{{other.md}}",
      data: { nablaBlockId: "embed-id" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 12, offset: 11 } },
    },
  ];
  const result = buildBlockIndex(children, "doc.md");
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].blockId, "embed-id");
  assert.equal(result.diagnostics.length, 0);
});

test("extracts block IDs from tables", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "table",
      align: [],
      children: [
        {
          type: "tableRow",
          children: [
            { type: "tableCell", children: [{ type: "text", value: "A" }] },
          ],
        },
      ],
      data: { nablaBlockId: "table-id" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 2, column: 3, offset: 10 } },
    },
  ];
  const result = buildBlockIndex(children, "doc.md");
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].blockId, "table-id");
  assert.equal(result.diagnostics.length, 0);
});

test("traverses nested structures", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "callout",
      calloutType: "tip",
      title: [{ type: "text", value: "Tip" }],
      syntax: "canonical",
      rawMarker: "> ",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: "Outer." }],
          data: { nablaBlockId: "outer-p" },
          position: { start: { line: 2, column: 1, offset: 10 }, end: { line: 2, column: 8, offset: 17 } },
        },
        {
          type: "toggle",
          title: [{ type: "text", value: "More" }],
          foldState: "closed",
          rawMarker: "]>",
          children: [
            {
              type: "paragraph",
              children: [{ type: "text", value: "Inner." }],
              data: { nablaBlockId: "inner-p" },
              position: { start: { line: 3, column: 3, offset: 25 }, end: { line: 3, column: 10, offset: 32 } },
            },
          ],
          data: { nablaBlockId: "toggle-nest" },
          position: { start: { line: 3, column: 1, offset: 23 }, end: { line: 4, column: 5, offset: 40 } },
        },
      ],
      data: { nablaBlockId: "callout-outer" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 5, column: 1, offset: 45 } },
    },
  ];
  const result = buildBlockIndex(children, "nested.md");
  assert.equal(result.entries.length, 4);
  const ids = result.entries.map((e) => e.blockId).sort();
  assert.deepEqual(ids, ["callout-outer", "inner-p", "outer-p", "toggle-nest"]);
  assert.equal(result.diagnostics.length, 0);
});

test("detects duplicate block IDs within a document", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "paragraph",
      children: [{ type: "text", value: "First." }],
      data: { nablaBlockId: "dup" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 7, offset: 6 } },
    },
    {
      type: "paragraph",
      children: [{ type: "text", value: "Second." }],
      data: { nablaBlockId: "dup" },
      position: { start: { line: 2, column: 1, offset: 7 }, end: { line: 2, column: 9, offset: 15 } },
    },
  ];
  const result = buildBlockIndex(children, "dup.md");
  assert.equal(result.entries.length, 2);
  assert.equal(result.entries[0].blockId, "dup");
  assert.equal(result.entries[1].blockId, "dup");
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].severity, "warning");
  assert.equal(result.diagnostics[0].code, "NABLA_BLOCK_ID_DUPLICATE");
  assert.equal(result.diagnostics[0].message, "Duplicate block id in document.");
  assert.deepEqual(result.diagnostics[0].position, {
    start: { line: 2, column: 1, offset: 7 },
    end: { line: 2, column: 9, offset: 15 },
  });
});

test("ignores nodes without block IDs", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "paragraph",
      children: [{ type: "text", value: "No ID." }],
    },
    {
      type: "heading",
      depth: 1,
      children: [{ type: "text", value: "Title" }],
    },
  ];
  const result = buildBlockIndex(children, "plain.md");
  assert.equal(result.entries.length, 0);
  assert.equal(result.diagnostics.length, 0);
});

test("ignores non-attachable node types with block IDs", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "code",
      value: "console.log('hi')",
      data: { nablaBlockId: "code-block" },
    },
    {
      type: "frontmatter",
      raw: "---\ntitle: Test\n---",
      data: { nablaBlockId: "fm-block" },
    },
    {
      type: "thematicBreak",
      data: { nablaBlockId: "hr-block" },
    },
    {
      type: "privateComment",
      value: "secret",
      raw: "%secret%",
      data: { nablaBlockId: "comment-block" },
    },
    {
      type: "footnoteDefinition",
      id: "fn1",
      raw: "[^fn1]: text",
      data: { nablaBlockId: "fn-block" },
    },
    {
      type: "html",
      value: "<div>",
      data: { nablaBlockId: "html-block" },
    },
  ];
  const result = buildBlockIndex(children, "ignored.md");
  assert.equal(result.entries.length, 0);
  assert.equal(result.diagnostics.length, 0);
});

test("handles empty children array", async () => {
  const { buildBlockIndex } = await loadModule();
  const result = buildBlockIndex([], "empty.md");
  assert.equal(result.entries.length, 0);
  assert.equal(result.diagnostics.length, 0);
});

test("detects multiple duplicate block IDs", async () => {
  const { buildBlockIndex } = await loadModule();
  const children = [
    {
      type: "paragraph",
      children: [{ type: "text", value: "A." }],
      data: { nablaBlockId: "id-a" },
      position: { start: { line: 1, column: 1, offset: 0 }, end: { line: 1, column: 3, offset: 2 } },
    },
    {
      type: "paragraph",
      children: [{ type: "text", value: "B." }],
      data: { nablaBlockId: "id-b" },
      position: { start: { line: 2, column: 1, offset: 3 }, end: { line: 2, column: 3, offset: 5 } },
    },
    {
      type: "paragraph",
      children: [{ type: "text", value: "A again." }],
      data: { nablaBlockId: "id-a" },
      position: { start: { line: 3, column: 1, offset: 6 }, end: { line: 3, column: 9, offset: 14 } },
    },
    {
      type: "paragraph",
      children: [{ type: "text", value: "B again." }],
      data: { nablaBlockId: "id-b" },
      position: { start: { line: 4, column: 1, offset: 15 }, end: { line: 4, column: 9, offset: 23 } },
    },
  ];
  const result = buildBlockIndex(children, "multi-dup.md");
  assert.equal(result.entries.length, 4);
  assert.equal(result.diagnostics.length, 2);
  assert.equal(result.diagnostics[0].code, "NABLA_BLOCK_ID_DUPLICATE");
  assert.equal(result.diagnostics[1].code, "NABLA_BLOCK_ID_DUPLICATE");
});
