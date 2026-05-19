import { parse } from "@nabla/markup";
import type { Diagnostic, TransclusionNode, NablaDocument } from "@nabla/markup";
import { DIAGNOSTIC_CODES } from "@nabla/markup";
import { normalizeWorkspacePath } from "./path-utils.js";
import { createSlug } from "./slug.js";
import type { FileIndexEntry, HeadingIndexEntry, BlockIndexEntry } from "./index.js";
import type { FileIndexInput } from "./file-index.js";

export type TransclusionResolution = {
  filePath: string;
  target: string;
  heading?: string;
  blockId?: string;
  resolved: boolean;
  resolvedFilePath?: string;
};

export type TransclusionResolverResult = {
  resolutions: TransclusionResolution[];
  diagnostics: Diagnostic[];
};

function collectTransclusions(doc: NablaDocument): TransclusionNode[] {
  const nodes: TransclusionNode[] = [];
  const walk = (children: unknown[]): void => {
    for (const node of children) {
      const n = node as Record<string, unknown>;
      if (n.type === "transclusion") {
        nodes.push(node as TransclusionNode);
      }
      const childNodes = n.children;
      if (Array.isArray(childNodes)) {
        walk(childNodes);
      }
    }
  };
  walk(doc.children);
  return nodes;
}

export function resolveTransclusions(
  files: FileIndexInput[],
  fileIndex: FileIndexEntry[],
  headingIndex: HeadingIndexEntry[],
  blockIndex: BlockIndexEntry[],
  maxDepth?: number,
): TransclusionResolverResult {
  const resolutions: TransclusionResolution[] = [];
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
    const transclusions = collectTransclusions(doc);

    for (const node of transclusions) {
      if (node.blockId) {
        resolveBlockTransclusion(node, file, sourceNormalized, fileByNormalized, blockByKey, resolutions, diagnostics);
      } else if (node.heading) {
        resolveHeadingTransclusion(node, file, sourceNormalized, fileByNormalized, headingByKey, resolutions, diagnostics);
      } else {
        resolveNoteTransclusion(node, file, fileByNormalized, resolutions, diagnostics);
      }
    }
  }

  detectTransclusionIssues(resolutions, diagnostics, maxDepth);

  return { resolutions, diagnostics };
}

function resolveNoteTransclusion(
  node: TransclusionNode,
  file: FileIndexInput,
  fileByNormalized: Map<string, FileIndexEntry>,
  resolutions: TransclusionResolution[],
  diagnostics: Diagnostic[],
): void {
  const normalizedTarget = normalizeWorkspacePath(node.target);
  const fileEntry = fileByNormalized.get(normalizedTarget);

  if (fileEntry) {
    resolutions.push({
      filePath: file.path,
      target: node.target,
      resolved: true,
      resolvedFilePath: fileEntry.path,
    });
  } else {
    diagnostics.push({
      severity: "warning",
      code: DIAGNOSTIC_CODES.TRANSCLUSION_MISSING_TARGET,
      message: `Transclusion target not found: ${node.target}`,
      position: node.position,
    });
    resolutions.push({
      filePath: file.path,
      target: node.target,
      resolved: false,
    });
  }
}

function resolveHeadingTransclusion(
  node: TransclusionNode,
  file: FileIndexInput,
  sourceNormalized: string,
  fileByNormalized: Map<string, FileIndexEntry>,
  headingByKey: Map<string, HeadingIndexEntry>,
  resolutions: TransclusionResolution[],
  diagnostics: Diagnostic[],
): void {
  const slug = createSlug(node.heading!);
  if (node.target) {
    const normalizedTarget = normalizeWorkspacePath(node.target);
    const headingKey = `${normalizedTarget}#${slug}`;
    const headingEntry = headingByKey.get(headingKey);

    if (headingEntry) {
      resolutions.push({
        filePath: file.path,
        target: node.target,
        heading: node.heading,
        resolved: true,
        resolvedFilePath: headingEntry.filePath,
      });
    } else {
      const fileEntry = fileByNormalized.get(normalizedTarget);
      const message = fileEntry
        ? `Transclusion heading target not found: ${node.target}#${node.heading}`
        : `Transclusion target not found: ${node.target}`;
      diagnostics.push({
        severity: "warning",
        code: DIAGNOSTIC_CODES.TRANSCLUSION_MISSING_TARGET,
        message,
        position: node.position,
      });
      resolutions.push({
        filePath: file.path,
        target: node.target,
        heading: node.heading,
        resolved: false,
      });
    }
  } else {
    const headingKey = `${sourceNormalized}#${slug}`;
    const headingEntry = headingByKey.get(headingKey);
    if (headingEntry) {
      resolutions.push({
        filePath: file.path,
        target: "",
        heading: node.heading,
        resolved: true,
        resolvedFilePath: file.path,
      });
    } else {
      diagnostics.push({
        severity: "warning",
        code: DIAGNOSTIC_CODES.TRANSCLUSION_MISSING_TARGET,
        message: `Transclusion heading target not found: ${sourceNormalized}#${node.heading}`,
        position: node.position,
      });
      resolutions.push({
        filePath: file.path,
        target: "",
        heading: node.heading,
        resolved: false,
      });
    }
  }
}

function resolveBlockTransclusion(
  node: TransclusionNode,
  file: FileIndexInput,
  sourceNormalized: string,
  fileByNormalized: Map<string, FileIndexEntry>,
  blockByKey: Map<string, BlockIndexEntry>,
  resolutions: TransclusionResolution[],
  diagnostics: Diagnostic[],
): void {
  if (node.target) {
    const normalizedTarget = normalizeWorkspacePath(node.target);
    const blockKey = `${normalizedTarget}^${node.blockId!}`;
    const blockEntry = blockByKey.get(blockKey);

    if (blockEntry) {
      resolutions.push({
        filePath: file.path,
        target: node.target,
        blockId: node.blockId,
        resolved: true,
        resolvedFilePath: blockEntry.filePath,
      });
    } else {
      const fileEntry = fileByNormalized.get(normalizedTarget);
      const message = fileEntry
        ? `Transclusion block target not found: ${node.target}^${node.blockId}`
        : `Transclusion target not found: ${node.target}`;
      diagnostics.push({
        severity: "warning",
        code: DIAGNOSTIC_CODES.TRANSCLUSION_MISSING_TARGET,
        message,
        position: node.position,
      });
      resolutions.push({
        filePath: file.path,
        target: node.target,
        blockId: node.blockId,
        resolved: false,
      });
    }
  } else {
    const blockKey = `${sourceNormalized}^${node.blockId!}`;
    const blockEntry = blockByKey.get(blockKey);
    if (blockEntry) {
      resolutions.push({
        filePath: file.path,
        target: "",
        blockId: node.blockId,
        resolved: true,
        resolvedFilePath: file.path,
      });
    } else {
      diagnostics.push({
        severity: "warning",
        code: DIAGNOSTIC_CODES.TRANSCLUSION_MISSING_TARGET,
        message: `Transclusion block target not found: ${sourceNormalized}^${node.blockId}`,
        position: node.position,
      });
      resolutions.push({
        filePath: file.path,
        target: "",
        blockId: node.blockId,
        resolved: false,
      });
    }
  }
}

function detectTransclusionIssues(
  resolutions: TransclusionResolution[],
  diagnostics: Diagnostic[],
  maxDepth?: number,
): void {
  const graph = new Map<string, Map<string, number>>();

  for (let i = 0; i < resolutions.length; i++) {
    const res = resolutions[i];
    if (!res.resolved || !res.resolvedFilePath) continue;

    const sourceId = normalizeWorkspacePath(res.filePath);

    let targetId: string;
    if (res.heading) {
      targetId = `${normalizeWorkspacePath(res.resolvedFilePath)}#${createSlug(res.heading)}`;
    } else if (res.blockId) {
      targetId = `${normalizeWorkspacePath(res.resolvedFilePath)}^${res.blockId}`;
    } else {
      targetId = normalizeWorkspacePath(res.resolvedFilePath);
    }

    if (!graph.has(sourceId)) {
      graph.set(sourceId, new Map());
    }
    graph.get(sourceId)!.set(targetId, i);
  }

  const allTargets = new Set<string>();
  for (const [, edges] of graph) {
    for (const target of edges.keys()) {
      allTargets.add(target);
    }
  }

  const toRemove = new Set<number>();

  if (maxDepth !== undefined) {
    const depthVisited = new Set<string>();

    const dfsDepth = (node: string, depth: number): void => {
      if (depthVisited.has(node)) return;

      depthVisited.add(node);

      const edges = graph.get(node);
      if (edges) {
        for (const [target, resIdx] of edges) {
          if (depth + 1 > maxDepth) {
            toRemove.add(resIdx);
            diagnostics.push({
              severity: "warning",
              code: DIAGNOSTIC_CODES.TRANSCLUSION_DEPTH_LIMIT,
              message: "Transclusion depth limit reached.",
            });
            continue;
          }
          dfsDepth(target, depth + 1);
        }
      }
    };

    for (const node of graph.keys()) {
      if (!allTargets.has(node) && !depthVisited.has(node)) {
        dfsDepth(node, 0);
      }
    }

    const reverseGraph = new Map<string, Set<string>>();
    for (const [source, edges] of graph) {
      for (const target of edges.keys()) {
        if (!reverseGraph.has(target)) reverseGraph.set(target, new Set());
        reverseGraph.get(target)!.add(source);
      }
    }

    const depthLimited = new Set<string>();
    const queue: string[] = [];

    for (const node of graph.keys()) {
      if (!depthVisited.has(node)) {
        const parents = reverseGraph.get(node);
        if (parents && [...parents].some(p => depthVisited.has(p))) {
          depthLimited.add(node);
          queue.push(node);
        }
      }
    }

    while (queue.length > 0) {
      const node = queue.shift()!;
      const edges = graph.get(node);
      if (edges) {
        for (const target of edges.keys()) {
          if (!depthVisited.has(target) && !depthLimited.has(target)) {
            depthLimited.add(target);
            queue.push(target);
          }
        }
      }
    }

    for (const node of depthLimited) {
      const edges = graph.get(node);
      if (edges) {
        for (const resIdx of edges.values()) {
          toRemove.add(resIdx);
        }
      }
    }

    const sorted = [...toRemove].sort((a, b) => b - a);
    for (const idx of sorted) {
      resolutions.splice(idx, 1);
    }
  }

  const cycleGraph = new Map<string, string[]>();
  for (const res of resolutions) {
    if (!res.resolved || !res.resolvedFilePath) continue;

    const sourceId = normalizeWorkspacePath(res.filePath);

    let targetId: string;
    if (res.heading) {
      targetId = `${normalizeWorkspacePath(res.resolvedFilePath)}#${createSlug(res.heading)}`;
    } else if (res.blockId) {
      targetId = `${normalizeWorkspacePath(res.resolvedFilePath)}^${res.blockId}`;
    } else {
      targetId = normalizeWorkspacePath(res.resolvedFilePath);
    }

    if (!cycleGraph.has(sourceId)) {
      cycleGraph.set(sourceId, []);
    }
    cycleGraph.get(sourceId)!.push(targetId);
  }

  const cycleVisited = new Set<string>();
  const recursionStack = new Set<string>();

  const dfsCycle = (node: string): void => {
    if (recursionStack.has(node)) {
      diagnostics.push({
        severity: "error",
        code: DIAGNOSTIC_CODES.TRANSCLUSION_CYCLE,
        message: "Transclusion cycle detected.",
      });
      return;
    }
    if (cycleVisited.has(node)) return;

    cycleVisited.add(node);
    recursionStack.add(node);

    const neighbors = cycleGraph.get(node);
    if (neighbors) {
      for (const neighbor of neighbors) {
        dfsCycle(neighbor);
      }
    }

    recursionStack.delete(node);
  };

  for (const node of cycleGraph.keys()) {
    if (!cycleVisited.has(node)) {
      dfsCycle(node);
    }
  }
}
