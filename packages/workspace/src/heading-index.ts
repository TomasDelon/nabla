import type { NablaDocument } from "@nabla/markup";
import type { HeadingIndexEntry } from "./index.js";
import { createSlug, deduplicateSlugs } from "./slug.js";

function extractHeadingInfo(
  node: unknown,
): { text: string; depth: number } | null {
  if (typeof node !== "object" || node === null) return null;
  const n = node as Record<string, unknown>;

  if (n.type === "heading") {
    const children = n.children as
      | Array<Record<string, unknown>>
      | undefined;
    const text =
      children
        ?.filter((c) => c.type === "text")
        .map((c) => String(c.value ?? ""))
        .join("") ?? "";
    const depth = typeof n.depth === "number" ? n.depth : 1;
    return { text, depth };
  }

  if (n.type === "foldableHeading") {
    const title = n.title as
      | Array<Record<string, unknown>>
      | undefined;
    const text =
      title
        ?.filter((c) => c.type === "text")
        .map((c) => String(c.value ?? ""))
        .join("") ?? "";
    const depth = typeof n.depth === "number" ? n.depth : 1;
    return { text, depth };
  }

  return null;
}

export function buildHeadingIndex(
  document: NablaDocument,
  filePath: string,
): HeadingIndexEntry[] {
  const raw: { text: string; depth: number }[] = [];

  for (const child of document.children) {
    const info = extractHeadingInfo(child);
    if (info) {
      raw.push(info);
    }
  }

  const slugs = deduplicateSlugs(raw.map((h) => createSlug(h.text)));

  return raw.map((h, i) => ({
    filePath,
    slug: slugs[i],
    text: h.text,
    depth: h.depth,
  }));
}
