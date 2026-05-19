import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const APP_CSS_URL = new URL("../src/app.css", import.meta.url);
const COMPONENTS_PACKAGE_JSON_URL = new URL("../../components/package.json", import.meta.url);

function getComponentCssImports(source) {
  const matches = source.matchAll(/@import\s+"(@nabla\/components\/src\/[^"]+\.css)";/g);
  return [...matches].map((match) => match[1]);
}

test("app component CSS imports are exported by @nabla/components", async () => {
  const [appCss, componentsPackageJson] = await Promise.all([
    readFile(APP_CSS_URL, "utf8"),
    readFile(COMPONENTS_PACKAGE_JSON_URL, "utf8"),
  ]);

  const imports = getComponentCssImports(appCss);
  const pkg = JSON.parse(componentsPackageJson);
  const exportedSpecifiers = new Set(Object.keys(pkg.exports ?? {}));

  assert.ok(imports.length > 0, "expected app.css to import component CSS files");

  for (const specifier of imports) {
    const exportKey = specifier.replace("@nabla/components", ".");
    assert.ok(
      exportedSpecifiers.has(exportKey),
      `expected @nabla/components to export CSS specifier ${exportKey}`,
    );
  }
});
