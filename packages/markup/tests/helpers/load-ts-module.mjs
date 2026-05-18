import { access, readFile } from "node:fs/promises";
import ts from "typescript";

async function resolveLocalModuleUrl(specifier, parentUrl) {
  const directUrl = new URL(specifier, parentUrl);

  try {
    await access(directUrl);
    return directUrl;
  } catch {
    if (directUrl.pathname.endsWith(".js")) {
      const tsUrl = new URL(directUrl.href.replace(/\.js$/, ".ts"));
      await access(tsUrl);
      return tsUrl;
    }

    throw new Error(`Unable to resolve local module ${specifier} from ${parentUrl.href}`);
  }
}

export async function loadTsModule(moduleUrl, cache = new Map()) {
  const cacheKey = moduleUrl.href;
  if (cache.has(cacheKey)) {
    return import(cache.get(cacheKey));
  }

  const source = await readFile(moduleUrl, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;

  let rewritten = transpiled;
  const localSpecifiers = new Set();

  for (const match of transpiled.matchAll(/(?:from\s+|import\()"(\.{1,2}\/[^"\n]+)"/g)) {
    localSpecifiers.add(match[1]);
  }
  for (const match of transpiled.matchAll(/(?:from\s+|import\()'(\.{1,2}\/[^'\n]+)'/g)) {
    localSpecifiers.add(match[1]);
  }

  for (const specifier of localSpecifiers) {
    const resolvedUrl = await resolveLocalModuleUrl(specifier, moduleUrl);
    const importedModule = await loadTsModule(resolvedUrl, cache);
    const resolvedDataUrl = cache.get(resolvedUrl.href);
    rewritten = rewritten.split(specifier).join(resolvedDataUrl);
    void importedModule;
  }

  const dataUrl = `data:text/javascript;base64,${Buffer.from(rewritten, "utf8").toString("base64")}`;
  cache.set(cacheKey, dataUrl);
  return import(dataUrl);
}
