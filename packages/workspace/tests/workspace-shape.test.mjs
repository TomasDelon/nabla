import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/load-ts-module.mjs";

const workspaceUrl = new URL("../src/workspace.ts", import.meta.url);

async function loadWorkspace() {
  return loadTsModule(workspaceUrl);
}

test("toWorkspaceFixtureShape groups documents and normalizes resolved paths", async () => {
  const { createWorkspace, toWorkspaceFixtureShape } = await loadWorkspace();

  const result = createWorkspace([
    { path: "main.md", source: "[[target#Section]]\n\n![[target^proof]]\n" },
    { path: "target.md", source: "# Section\n\nParagraph ^proof\n" },
  ]);

  const shape = toWorkspaceFixtureShape(result);
  const mainDoc = shape.documents.find(doc => doc.path === "main.md");
  const targetDoc = shape.documents.find(doc => doc.path === "target.md");

  assert.deepEqual(mainDoc, {
    path: "main.md",
    links: [{ target: "target", heading: "Section", resolvedPath: "target.md" }],
    transclusions: [{ target: "target", blockId: "proof", resolvedPath: "target.md" }],
  });
  assert.deepEqual(targetDoc, {
    path: "target.md",
    headings: [{ text: "Section", slug: "section" }],
    blocks: [{ id: "proof", ownerType: "paragraph" }],
  });
  assert.deepEqual(shape.backlinks, [
    { sourcePath: "main.md", targetPath: "target.md", kind: "heading" },
  ]);
});

test("toWorkspaceFixtureShape extracts missing link and transclusion targets from resolver output", async () => {
  const { createWorkspace, toWorkspaceFixtureShape } = await loadWorkspace();

  const result = createWorkspace([
    { path: "main.md", source: "[[missing-link]]\n\n![[missing-embed]]\n" },
  ]);

  const shape = toWorkspaceFixtureShape(result);

  assert.deepEqual(shape.documents, [
    {
      path: "main.md",
      missingLinks: ["missing-link"],
      missingTransclusions: ["missing-embed"],
    },
  ]);
  assert.deepEqual(shape.backlinks, []);
});

test("toWorkspaceFixtureShape omits empty target for same-file heading and block refs", async () => {
  const { createWorkspace, toWorkspaceFixtureShape } = await loadWorkspace();

  const result = createWorkspace([
    { path: "doc.md", source: "# Section\n\nParagraph ^proof\n\n[[#Section]]\n\n![[^proof]]\n" },
  ]);

  const shape = toWorkspaceFixtureShape(result);

  assert.deepEqual(shape.documents, [
    {
      path: "doc.md",
      links: [{ heading: "Section", resolvedPath: "doc.md" }],
      transclusions: [{ blockId: "proof", resolvedPath: "doc.md" }],
      headings: [{ text: "Section", slug: "section" }],
      blocks: [{ id: "proof", ownerType: "paragraph" }],
    },
  ]);
});
