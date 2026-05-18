import { parse as parseYaml } from "yaml";

export function parseFrontmatterBlock(
  lines: string[],
  startIndex: number
): {
  raw: string;
  data: Record<string, unknown> | null;
  endIndex: number;
} | null {
  if (lines[startIndex] !== "---") return null;

  let endIndex = -1;
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i] === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) return null;

  const raw = lines.slice(startIndex + 1, endIndex).join("\n");

  let data: Record<string, unknown> | null = null;
  try {
    const parsed = parseYaml(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      data = parsed as Record<string, unknown>;
    }
  } catch {
    /* data remains null — invalid YAML */
  }

  return { raw, data, endIndex };
}

export function serializeFrontmatter(raw: string): string {
  return `---\n${raw}\n---`;
}
