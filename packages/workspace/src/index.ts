export const NABLA_WORKSPACE_PACKAGE = "@nabla/workspace";

export { buildBlockIndex } from "./block-index.js";
export type { BlockIndexResult } from "./block-index.js";

export { buildFileIndex } from "./file-index.js";
export type { FileIndexInput, FileIndexResult } from "./file-index.js";

export { resolveWikiLinks } from "./wiki-link-resolver.js";
export type { WikiLinkResolution, WikiLinkResolverResult } from "./wiki-link-resolver.js";

export { resolveTransclusions } from "./transclusion-resolver.js";
export type { TransclusionResolution, TransclusionResolverResult } from "./transclusion-resolver.js";

export { createWorkspace } from "./workspace.js";
export { toWorkspaceFixtureShape } from "./workspace.js";
export type { WorkspaceResult } from "./workspace.js";

export { buildBacklinkIndex } from "./backlink-index.js";

export type WorkspaceFile = {
  path: string;
};

export type WorkspaceDocument = {
  path: string;
};

export type FileIndexEntry = {
  path: string;
  normalizedPath: string;
};

export type HeadingIndexEntry = {
  filePath: string;
  slug: string;
  text: string;
  depth: number;
  position?: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
};

export type BlockIndexEntry = {
  filePath: string;
  blockId: string;
  ownerType?: string;
  position?: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
};

export type WorkspaceFixtureLinkEntry = {
  target?: string;
  heading?: string;
  blockId?: string;
  resolvedPath?: string;
};

export type WorkspaceFixtureTransclusionEntry = {
  target?: string;
  heading?: string;
  blockId?: string;
  resolvedPath?: string;
};

export type WorkspaceFixtureHeadingEntry = {
  text: string;
  slug: string;
};

export type WorkspaceFixtureBlockEntry = {
  id: string;
  ownerType: string;
};

export type WorkspaceFixtureDocument = {
  path: string;
  links?: WorkspaceFixtureLinkEntry[];
  transclusions?: WorkspaceFixtureTransclusionEntry[];
  headings?: WorkspaceFixtureHeadingEntry[];
  blocks?: WorkspaceFixtureBlockEntry[];
  missingLinks?: string[];
  missingTransclusions?: string[];
};

export type WorkspaceFixtureIndex = {
  documents: WorkspaceFixtureDocument[];
  backlinks: Array<Pick<BacklinkEntry, "sourcePath" | "targetPath" | "kind">>;
};

export type BacklinkEntry = {
  sourcePath: string;
  targetPath: string;
  kind: "note" | "heading" | "block";
  position?: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
};

export type TransclusionNodeIdentity = {
  path: string;
  headingSlug?: string;
  blockId?: string;
};

export type WorkspaceIndex = {
  files: FileIndexEntry[];
  headings: HeadingIndexEntry[];
  blocks: BlockIndexEntry[];
  backlinks: BacklinkEntry[];
};

export type WorkspaceOptions = {
  maxTransclusionDepth?: number;
};

export type Workspace = {
  index: WorkspaceIndex;
  options: WorkspaceOptions;
};

export { normalizeWorkspacePath } from "./path-utils.js";
export { createSlug, deduplicateSlugs } from "./slug.js";
export { buildHeadingIndex } from "./heading-index.js";
