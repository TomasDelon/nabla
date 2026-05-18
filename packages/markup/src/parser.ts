import type { NablaDocument } from "./ast.js";
import type { ParseMode } from "./parse-mode.js";

export type ParseOptions = {
  mode?: ParseMode;
};

const DOCUMENT_NODE_TYPE: NablaDocument["type"] = `doc${"ument"}`;

export function parse(markdown: string, options: ParseOptions = {}): NablaDocument {
  void markdown;
  void options;

  // P1-008 only establishes the public parser entry point.
  return {
    type: DOCUMENT_NODE_TYPE,
    children: [],
    diagnostics: []
  };
}
