import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const markupDir = path.join(root, "packages", "markup");
const forbiddenImports = [
  "react",
  "react-dom",
  "@milkdown/",
  "prosemirror-",
  "@nabla/editor",
  "@nabla/components",
  "@nabla/app",
  "@nabla/workspace"
];
const forbiddenDomTokens = ["document", "window", "HTMLElement"];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      return fullPath;
    })
  );

  return files.flat();
}

try {
  const files = (await walk(markupDir)).filter((file) => file.endsWith(".ts"));
  const violations = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const token of forbiddenImports) {
      if (source.includes(token)) violations.push(`${file}: forbidden import token ${token}`);
    }
    for (const token of forbiddenDomTokens) {
      if (source.includes(token)) violations.push(`${file}: forbidden DOM token ${token}`);
    }
  }

  if (violations.length > 0) {
    console.error("Boundary check failed:\n" + violations.join("\n"));
    process.exit(1);
  }

  console.log("Boundary check passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
