import { DIAGNOSTIC_CODES, parse, serialize } from "@nabla/markup";

import type { Diagnostic } from "@nabla/markup";
import type { EditorDiagnostic } from "./model.js";

export const NABLA_EDITOR_EXPORT_LOSS = DIAGNOSTIC_CODES.EDITOR_EXPORT_LOSS;

export interface CanonicalizeOptions {
  readonly preservation?: {
    readonly message?: string;
    verify(canonicalMd: string): boolean;
  };
}

export interface CanonicalizeResult {
  readonly canonicalMd: string;
  readonly diagnostics: readonly EditorDiagnostic[];
}

function toEditorDiagnostic(diagnostic: Diagnostic): EditorDiagnostic {
  return {
    code: diagnostic.code,
    message: diagnostic.message,
    severity: diagnostic.severity === "info" ? "warning" : diagnostic.severity,
    phase: "save",
  };
}

function createExportLossDiagnostic(message?: string): EditorDiagnostic {
  return {
    code: NABLA_EDITOR_EXPORT_LOSS,
    message:
      message ??
      "Editor export preservation contract failed during canonical save.",
    severity: "error",
    phase: "save",
  };
}

export function canonicalize(
  exportedMd: string,
  options: CanonicalizeOptions = {},
): CanonicalizeResult {
  const parsed = parse(exportedMd);
  const canonicalMd = serialize(parsed);
  const diagnostics = parsed.diagnostics.map(toEditorDiagnostic);

  if (options.preservation && !options.preservation.verify(canonicalMd)) {
    return {
      canonicalMd,
      diagnostics: [
        ...diagnostics,
        createExportLossDiagnostic(options.preservation.message),
      ],
    };
  }

  return {
    canonicalMd,
    diagnostics,
  };
}
