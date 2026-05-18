import type { NablaDocument } from "./ast.js";

export type SerializeOptions = {
  lineEnding?: "lf" | "crlf";
};

function normalizeLineEnding(value: string, lineEnding: SerializeOptions["lineEnding"]) {
  if (lineEnding === "crlf") {
    return value.replace(/\n/g, "\r\n");
  }
  return value;
}

export function serialize(source: NablaDocument, options: SerializeOptions = {}) {
  void source;

  // P1-007 only establishes the public serializer entry point.
  return normalizeLineEnding("", options.lineEnding);
}
