import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const implementationPackPath = path.join(
  root,
  "specs",
  "nabla_complete_project_documentation_pack_v1",
  "02_implementation_control_pack_opencode",
  "nabla_implementation_control_pack_v4_1_2_opencode",
  "implementation_pack.json"
);
const expectedSpecDir = path.join(
  root,
  "specs",
  "nabla_complete_project_documentation_pack_v1",
  "01_markdown_plus_spec_pack",
  "nabla_markdown_plus_spec_pack_v4_2_final"
);

try {
  const implementationPack = JSON.parse(await readFile(implementationPackPath, "utf8"));
  if (implementationPack.required_spec_version !== "v4.2 final") {
    throw new Error(`Unexpected spec version: ${implementationPack.required_spec_version}`);
  }

  await readFile(path.join(expectedSpecDir, "MANIFEST.md"), "utf8");
  console.log("Spec version validation passed.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
