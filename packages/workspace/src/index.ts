export const NABLA_WORKSPACE_PACKAGE = "@nabla/workspace";

export { buildBlockIndex } from "./block-index.js";
export type { BlockIndexResult } from "./block-index.js";

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
  position?: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
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
