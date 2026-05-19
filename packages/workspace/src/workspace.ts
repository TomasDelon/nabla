import type { Diagnostic } from "@nabla/markup";
import { buildFileIndex } from "./file-index.js";
import type { FileIndexInput, FileIndexResult } from "./file-index.js";
import { resolveWikiLinks } from "./wiki-link-resolver.js";
import type { WikiLinkResolverResult } from "./wiki-link-resolver.js";
import { buildBacklinkIndex } from "./backlink-index.js";
import { resolveTransclusions } from "./transclusion-resolver.js";
import type { TransclusionResolverResult } from "./transclusion-resolver.js";
import type { Workspace, WorkspaceOptions, WorkspaceIndex } from "./index.js";

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
