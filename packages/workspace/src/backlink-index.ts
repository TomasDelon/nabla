import type { BacklinkEntry } from "./index.js";
import type { WikiLinkResolution } from "./wiki-link-resolver.js";

export function buildBacklinkIndex(resolutions: WikiLinkResolution[]): BacklinkEntry[] {
  const backlinks: BacklinkEntry[] = [];

  for (const resolution of resolutions) {
    if (!resolution.resolved) continue;

    const kind = resolution.blockId ? "block" : resolution.heading ? "heading" : "note";

    backlinks.push({
      sourcePath: resolution.filePath,
      targetPath: resolution.resolvedFilePath!,
      kind,
    });
  }

  return backlinks;
}
