import { createWorkspace } from "@nabla/workspace";
import type { WorkspaceResult } from "@nabla/workspace";

export interface WorkspaceIntegrationSummary {
  readonly hasWorkspaceIndex: boolean;
  readonly documentCount: number;
  readonly linkCount: number;
  readonly backlinkCount: number;
  readonly diagnosticCount: number;
}

export function createSampleWorkspaceIndex(
  source: string,
): WorkspaceResult {
  return createWorkspace([{ path: "sample.md", source }]);
}

export function getWorkspaceIntegrationSummary(
  source: string,
): WorkspaceIntegrationSummary {
  const result = createSampleWorkspaceIndex(source);
  return {
    hasWorkspaceIndex: result.workspace.index.files.length > 0,
    documentCount: result.workspace.index.files.length,
    linkCount: result.wikiLinks.resolutions.length,
    backlinkCount: result.workspace.index.backlinks.length,
    diagnosticCount: result.diagnostics.length,
  };
}
