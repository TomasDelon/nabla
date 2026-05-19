export const NABLA_APP_PACKAGE = "@nabla/app";

export { SAMPLE_DOCUMENT_SOURCE } from "./sample-document.js";
export { canonicalizeSampleSource, getRenderPipelineSummary } from "./render-pipeline.js";
export { createSampleComponentDescriptors, getComponentRenderingSummary } from "./component-rendering.js";
export { createSourceEditor, getEditableSource, exportCanonicalSource, getEditorIntegrationSummary } from "./editor-integration.js";
export { createSampleWorkspaceIndex, getWorkspaceIntegrationSummary } from "./workspace-integration.js";

export type { RenderPipelineSummary } from "./render-pipeline.js";
export type { ComponentRenderingSummary } from "./component-rendering.js";
export type { EditorIntegrationSummary } from "./editor-integration.js";
export type { WorkspaceIntegrationSummary } from "./workspace-integration.js";
