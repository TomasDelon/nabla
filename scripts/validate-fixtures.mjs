import { readdir, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const specFixturesDir = path.join(
  root,
  "specs",
  "nabla_complete_project_documentation_pack_v1",
  "01_markdown_plus_spec_pack",
  "nabla_markdown_plus_spec_pack_v4_2_final",
  "fixtures"
);

async function ensureExists(filePath) {
  await access(filePath);
}

async function validateParserFixture(dir) {
  for (const file of ["input.md", "ast.json", "output.md", "diagnostics.json"]) {
    await ensureExists(path.join(dir, file));
  }
}

async function validateWorkspaceFixture(dir) {
  for (const file of ["expected-index.json", "diagnostics.json"]) {
    await ensureExists(path.join(dir, file));
  }
  await ensureExists(path.join(dir, "files"));
}

try {
  const featureEntries = await readdir(specFixturesDir, { withFileTypes: true });

  for (const featureEntry of featureEntries) {
    if (!featureEntry.isDirectory()) continue;
    const featureDir = path.join(specFixturesDir, featureEntry.name);
    const fixtureEntries = await readdir(featureDir, { withFileTypes: true });

    for (const fixtureEntry of fixtureEntries) {
      if (!fixtureEntry.isDirectory()) continue;
      const fixtureDir = path.join(featureDir, fixtureEntry.name);
      if (featureEntry.name === "workspace") {
        await validateWorkspaceFixture(fixtureDir);
      } else {
        await validateParserFixture(fixtureDir);
      }
    }
  }

  console.log("Fixture validation passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
