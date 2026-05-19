import type { Diagnostic } from "@nabla/markup";
import { buildFileIndex } from "./file-index.js";
import type { FileIndexInput, FileIndexResult } from "./file-index.js";
import { resolveWikiLinks } from "./wiki-link-resolver.js";
import type { WikiLinkResolverResult } from "./wiki-link-resolver.js";
import { buildBacklinkIndex } from "./backlink-index.js";
import { resolveTransclusions } from "./transclusion-resolver.js";
import type { TransclusionResolverResult } from "./transclusion-resolver.js";
import { normalizeWorkspacePath } from "./path-utils.js";
import type {
  Workspace,
  WorkspaceFixtureDocument,
  WorkspaceFixtureIndex,
  WorkspaceOptions,
  WorkspaceIndex,
} from "./index.js";

export type WorkspaceResult = {
  workspace: Workspace;
  fileIndex: FileIndexResult;
  wikiLinks: WikiLinkResolverResult;
  transclusions: TransclusionResolverResult;
  diagnostics: Diagnostic[];
};

export function createWorkspace(files: FileIndexInput[], options: WorkspaceOptions = {}): WorkspaceResult {
  const fileIndexResult = buildFileIndex(files);
  const wikiLinkResult = resolveWikiLinks(
    files,
    fileIndexResult.entries,
    fileIndexResult.headings,
    fileIndexResult.blocks,
  );
  const maxDepth = options.maxTransclusionDepth ?? 5;
  const transclusionResult = resolveTransclusions(
    files,
    fileIndexResult.entries,
    fileIndexResult.headings,
    fileIndexResult.blocks,
    maxDepth,
  );

  const index: WorkspaceIndex = {
    files: fileIndexResult.entries,
    headings: fileIndexResult.headings,
    blocks: fileIndexResult.blocks,
    backlinks: buildBacklinkIndex(wikiLinkResult.resolutions),
  };

  return {
    workspace: { index, options },
    fileIndex: fileIndexResult,
    wikiLinks: wikiLinkResult,
    transclusions: transclusionResult,
    diagnostics: [...fileIndexResult.diagnostics, ...wikiLinkResult.diagnostics, ...transclusionResult.diagnostics],
  };
}

export function toWorkspaceFixtureShape(result: WorkspaceResult): WorkspaceFixtureIndex {
  const documents = new Map<string, WorkspaceFixtureDocument>();
  const originalPathByNormalized = new Map<string, string>();

  for (const entry of result.fileIndex.entries) {
    originalPathByNormalized.set(entry.normalizedPath, entry.path);
    documents.set(entry.path, { path: entry.path });
  }

  const getDocument = (path: string): WorkspaceFixtureDocument => {
    const existing = documents.get(path);
    if (existing) return existing;

    const created = { path };
    documents.set(path, created);
    return created;
  };

  const toFixturePath = (path: string | undefined): string | undefined => {
    if (!path) return undefined;
    const normalizedPath = normalizeWorkspacePath(path);
    return originalPathByNormalized.get(normalizedPath) ?? path;
  };

  const withOptionalFields = <T extends Record<string, unknown>>(value: T): T => {
    for (const key of Object.keys(value)) {
      if (value[key] === undefined) {
        delete value[key];
      }
    }

    return value;
  };

  for (const resolution of result.wikiLinks.resolutions) {
    const document = getDocument(resolution.filePath);

    if (resolution.resolved) {
      document.links ??= [];
      document.links.push(withOptionalFields({
        target: resolution.target || undefined,
        heading: resolution.heading,
        blockId: resolution.blockId,
        resolvedPath: toFixturePath(resolution.resolvedFilePath),
      }));
      continue;
    }

    if (resolution.target) {
      document.missingLinks ??= [];
      document.missingLinks.push(resolution.target);
    }
  }

  for (const resolution of result.transclusions.resolutions) {
    const document = getDocument(resolution.filePath);

    if (resolution.resolved) {
      document.transclusions ??= [];
      document.transclusions.push(withOptionalFields({
        target: resolution.target || undefined,
        heading: resolution.heading,
        blockId: resolution.blockId,
        resolvedPath: toFixturePath(resolution.resolvedFilePath),
      }));
      continue;
    }

    if (resolution.target) {
      document.missingTransclusions ??= [];
      document.missingTransclusions.push(resolution.target);
    }
  }

  for (const heading of result.workspace.index.headings) {
    const path = toFixturePath(heading.filePath);
    if (!path) continue;

    const document = getDocument(path);
    document.headings ??= [];
    document.headings.push({ text: heading.text, slug: heading.slug });
  }

  for (const block of result.workspace.index.blocks) {
    const path = toFixturePath(block.filePath);
    if (!path) continue;

    const document = getDocument(path);
    document.blocks ??= [];
    document.blocks.push({ id: block.blockId, ownerType: block.ownerType! });
  }

  return {
    documents: result.fileIndex.entries.map(entry => getDocument(entry.path)),
    backlinks: result.workspace.index.backlinks.map(backlink => ({
      sourcePath: backlink.sourcePath,
      targetPath: toFixturePath(backlink.targetPath) ?? backlink.targetPath,
      kind: backlink.kind,
    })),
  };
}
