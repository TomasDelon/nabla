import { parse } from "@nabla/markup";
import type { Diagnostic, WikiLinkNode, NablaDocument } from "@nabla/markup";
import { DIAGNOSTIC_CODES } from "@nabla/markup";
import { normalizeWorkspacePath } from "./path-utils.js";
import { createSlug } from "./slug.js";
import type { FileIndexEntry, HeadingIndexEntry, BlockIndexEntry } from "./index.js";
import type { FileIndexInput } from "./file-index.js";

export type WikiLinkResolution = {
  filePath: string;
  target: string;
  alias?: string;
  heading?: string;
  blockId?: string;
  resolved: boolean;
  resolvedFilePath?: string;
};

export type WikiLinkResolverResult = {
  resolutions: WikiLinkResolution[];
  diagnostics: Diagnostic[];
};

function collectWikiLinks(doc: NablaDocument): WikiLinkNode[] {
  const links: WikiLinkNode[] = [];
  const walk = (nodes: unknown[]): void => {
    for (const node of nodes) {
      const n = node as Record<string, unknown>;
      if (n.type === "wikiLink") {
        links.push(node as WikiLinkNode);
      }
      const children = n.children;
      if (Array.isArray(children)) {
        walk(children);
      }
    }
  };
  walk(doc.children);
  return links;
}

export function resolveWikiLinks(
  files: FileIndexInput[],
  fileIndex: FileIndexEntry[],
  headingIndex: HeadingIndexEntry[],
  blockIndex: BlockIndexEntry[],
): WikiLinkResolverResult {
  const resolutions: WikiLinkResolution[] = [];
  const diagnostics: Diagnostic[] = [];

  const fileByNormalized = new Map<string, FileIndexEntry>();
  for (const entry of fileIndex) {
    fileByNormalized.set(entry.normalizedPath, entry);
  }

  const headingByKey = new Map<string, HeadingIndexEntry>();
  for (const entry of headingIndex) {
    const key = `${entry.filePath}#${entry.slug}`;
    if (!headingByKey.has(key)) {
      headingByKey.set(key, entry);
    }
  }

  const blockByKey = new Map<string, BlockIndexEntry>();
  for (const entry of blockIndex) {
    const key = `${entry.filePath}^${entry.blockId}`;
    if (!blockByKey.has(key)) {
      blockByKey.set(key, entry);
    }
  }

  for (const file of files) {
    const sourceNormalized = normalizeWorkspacePath(file.path);
    const doc = parse(file.source);
    const links = collectWikiLinks(doc);

    for (const link of links) {
      if (link.blockId) {
        resolveBlockLink(link, file, sourceNormalized, fileByNormalized, blockByKey, resolutions, diagnostics);
      } else if (link.heading) {
        resolveHeadingLink(link, file, sourceNormalized, fileByNormalized, headingByKey, resolutions, diagnostics);
      } else {
        resolveNoteLink(link, file, fileByNormalized, resolutions, diagnostics);
      }
    }
  }

  return { resolutions, diagnostics };
}

function resolveNoteLink(
  link: WikiLinkNode,
  file: FileIndexInput,
  fileByNormalized: Map<string, FileIndexEntry>,
  resolutions: WikiLinkResolution[],
  diagnostics: Diagnostic[],
): void {
  const normalizedTarget = normalizeWorkspacePath(link.target);
  const fileEntry = fileByNormalized.get(normalizedTarget);

  if (fileEntry) {
    resolutions.push({
      filePath: file.path,
      target: link.target,
      alias: link.alias,
      resolved: true,
      resolvedFilePath: fileEntry.path,
    });
  } else {
    diagnostics.push({
      severity: "warning",
      code: DIAGNOSTIC_CODES.LINK_MISSING_TARGET,
      message: `Note target not found: ${link.target}`,
      position: link.position,
    });
    resolutions.push({
      filePath: file.path,
      target: link.target,
      alias: link.alias,
      resolved: false,
    });
  }
}

function resolveHeadingLink(
  link: WikiLinkNode,
  file: FileIndexInput,
  sourceNormalized: string,
  fileByNormalized: Map<string, FileIndexEntry>,
  headingByKey: Map<string, HeadingIndexEntry>,
  resolutions: WikiLinkResolution[],
  diagnostics: Diagnostic[],
): void {
  const slug = createSlug(link.heading!);
  if (link.target) {
    const normalizedTarget = normalizeWorkspacePath(link.target);
    const headingKey = `${normalizedTarget}#${slug}`;
    const headingEntry = headingByKey.get(headingKey);

    if (headingEntry) {
      resolutions.push({
        filePath: file.path,
        target: link.target,
        heading: link.heading,
        resolved: true,
        resolvedFilePath: headingEntry.filePath,
      });
    } else {
      const fileEntry = fileByNormalized.get(normalizedTarget);
      const code = fileEntry ? DIAGNOSTIC_CODES.HEADING_MISSING_TARGET : DIAGNOSTIC_CODES.LINK_MISSING_TARGET;
      const message = fileEntry
        ? `Heading target not found: ${link.target}#${link.heading}`
        : `Note target not found: ${link.target}`;
      diagnostics.push({ severity: "warning", code, message, position: link.position });
      resolutions.push({ filePath: file.path, target: link.target, heading: link.heading, resolved: false });
    }
  } else {
    const headingKey = `${sourceNormalized}#${slug}`;
    const headingEntry = headingByKey.get(headingKey);
    if (headingEntry) {
      resolutions.push({
        filePath: file.path,
        target: link.target,
        heading: link.heading,
        resolved: true,
        resolvedFilePath: file.path,
      });
    } else {
      diagnostics.push({
        severity: "warning",
        code: DIAGNOSTIC_CODES.HEADING_MISSING_TARGET,
        message: `Heading target not found: ${sourceNormalized}#${link.heading}`,
        position: link.position,
      });
      resolutions.push({ filePath: file.path, target: link.target, heading: link.heading, resolved: false });
    }
  }
}

function resolveBlockLink(
  link: WikiLinkNode,
  file: FileIndexInput,
  sourceNormalized: string,
  fileByNormalized: Map<string, FileIndexEntry>,
  blockByKey: Map<string, BlockIndexEntry>,
  resolutions: WikiLinkResolution[],
  diagnostics: Diagnostic[],
): void {
  if (link.target) {
    const normalizedTarget = normalizeWorkspacePath(link.target);
    const blockKey = `${normalizedTarget}^${link.blockId!}`;
    const blockEntry = blockByKey.get(blockKey);

    if (blockEntry) {
      resolutions.push({
        filePath: file.path,
        target: link.target,
        blockId: link.blockId,
        resolved: true,
        resolvedFilePath: blockEntry.filePath,
      });
    } else {
      const fileEntry = fileByNormalized.get(normalizedTarget);
      const code = fileEntry ? DIAGNOSTIC_CODES.BLOCK_MISSING_TARGET : DIAGNOSTIC_CODES.LINK_MISSING_TARGET;
      const message = fileEntry
        ? `Block target not found: ${link.target}^${link.blockId}`
        : `Note target not found: ${link.target}`;
      diagnostics.push({ severity: "warning", code, message, position: link.position });
      resolutions.push({ filePath: file.path, target: link.target, blockId: link.blockId, resolved: false });
    }
  } else {
    const blockKey = `${sourceNormalized}^${link.blockId!}`;
    const blockEntry = blockByKey.get(blockKey);
    if (blockEntry) {
      resolutions.push({
        filePath: file.path,
        target: link.target,
        blockId: link.blockId,
        resolved: true,
        resolvedFilePath: file.path,
      });
    } else {
      diagnostics.push({
        severity: "warning",
        code: DIAGNOSTIC_CODES.BLOCK_MISSING_TARGET,
        message: `Block target not found: ${sourceNormalized}^${link.blockId}`,
        position: link.position,
      });
      resolutions.push({ filePath: file.path, target: link.target, blockId: link.blockId, resolved: false });
    }
  }
}
