import { parse } from "@nabla/markup";
import type { Diagnostic } from "@nabla/markup";
import { normalizeWorkspacePath } from "./path-utils.js";
import { buildHeadingIndex } from "./heading-index.js";
import { buildBlockIndex } from "./block-index.js";
import type { FileIndexEntry, HeadingIndexEntry, BlockIndexEntry } from "./index.js";

export type FileIndexInput = {
  path: string;
  source: string;
};

export type FileIndexResult = {
  entries: FileIndexEntry[];
  headings: HeadingIndexEntry[];
  blocks: BlockIndexEntry[];
  diagnostics: Diagnostic[];
};

export function buildFileIndex(files: FileIndexInput[]): FileIndexResult {
  const entries: FileIndexEntry[] = [];
  const headings: HeadingIndexEntry[] = [];
  const blocks: BlockIndexEntry[] = [];
  const allDiagnostics: Diagnostic[] = [];

  for (const file of files) {
    const normalizedPath = normalizeWorkspacePath(file.path);
    entries.push({ path: file.path, normalizedPath });

    const doc = parse(file.source);
    allDiagnostics.push(...doc.diagnostics);

    const headingEntries = buildHeadingIndex(doc, normalizedPath);
    headings.push(...headingEntries);

    const blockResult = buildBlockIndex(doc.children, normalizedPath);
    blocks.push(...blockResult.entries);
    allDiagnostics.push(...blockResult.diagnostics);
  }

  return { entries, headings, blocks, diagnostics: allDiagnostics };
}
