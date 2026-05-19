import { createEditor, loadSource, getSource } from "@nabla/editor";
import {
  canonicalizeSampleSource,
  getRenderPipelineSummary,
} from "./render-pipeline.js";
import type { RenderPipelineSummary } from "./render-pipeline.js";

export function createSourceEditor(source: string) {
  const editor = createEditor();
  loadSource(editor, source);
  return editor;
}

export function getEditableSource(source: string): string {
  const editor = createSourceEditor(source);
  return getSource(editor);
}

/**
 * Export canonical Markdown from the edited source.
 *
 * Delegates to the existing app save/export pipeline
 * (canonicalizeSampleSource) which centralizes @nabla/markup
 * parse/serialize. No editor-specific canonicalization is applied.
 */
export function exportCanonicalSource(source: string): string {
  return canonicalizeSampleSource(source);
}

export interface EditorIntegrationSummary {
  readonly sourceLength: number;
  readonly exportedLength: number;
  readonly diagnosticsCount: number;
  readonly hasExportedSource: boolean;
}

export function getEditorIntegrationSummary(
  source: string,
): EditorIntegrationSummary {
  const summary = getRenderPipelineSummary(source);
  return {
    sourceLength: summary.originalLength,
    exportedLength: summary.canonicalLength,
    diagnosticsCount: summary.diagnosticsCount,
    hasExportedSource: summary.hasCanonicalOutput,
  };
}
