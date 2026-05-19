import { parse, serialize } from "@nabla/markup";

export interface RenderPipelineSummary {
  readonly originalLength: number;
  readonly canonicalLength: number;
  readonly diagnosticsCount: number;
  readonly hasCanonicalOutput: boolean;
  readonly canonicalSource: string;
}

export function parseSampleSource(source: string) {
  return parse(source);
}

export function canonicalizeSampleSource(source: string): string {
  const doc = parse(source);
  return serialize(doc);
}

export function getRenderPipelineSummary(source: string): RenderPipelineSummary {
  const doc = parse(source);
  const canonicalSource = serialize(doc);
  return {
    originalLength: source.length,
    canonicalLength: canonicalSource.length,
    diagnosticsCount: doc.diagnostics.length,
    hasCanonicalOutput: canonicalSource.length > 0,
    canonicalSource,
  };
}
