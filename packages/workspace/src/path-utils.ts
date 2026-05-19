export function normalizeWorkspacePath(input: string): string {
  if (typeof input !== "string" || input.trim().length === 0) {
    throw new Error("normalizeWorkspacePath: path must be a non-empty string");
  }

  let path = input.trim();

  path = path.normalize("NFC");

  path = path.replace(/\\/g, "/");

  path = path.replace(/\/+/g, "/");

  path = path.replace(/^\.\//, "");

  const lower = path.toLowerCase();
  if (path.endsWith(".md") || path.endsWith(".mp")) {
    const stripped = path.slice(0, -3);
    if (stripped.length > 0) {
      return stripped;
    }
  }

  return path;
}
