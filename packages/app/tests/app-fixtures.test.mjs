import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, "..", "fixtures");

const FORBIDDEN_KEYS = ["html", "innerHTML", "editorState", "jsonState", "serializedState"];

function isObject(v) {
  return typeof v === "object" && v !== null;
}

function checkObjectFields(actual, expected, label) {
  for (const [key, value] of Object.entries(expected)) {
    assert.ok(key in actual, `${label}: expected field "${key}" in result`);
    const actualValue = actual[key];
    if (value === true) {
      assert.ok(typeof actualValue !== "undefined", `${label}: field "${key}" must exist`);
    } else if (typeof value === "number") {
      assert.equal(actualValue, value, `${label}: field "${key}" mismatch`);
    } else if (isObject(value)) {
      checkObjectFields(actualValue, value, `${label}.${key}`);
    } else {
      assert.deepEqual(actualValue, value, `${label}: field "${key}" mismatch`);
    }
  }
}

function checkNoForbiddenKeys(obj, label) {
  for (const key of FORBIDDEN_KEYS) {
    assert.equal(key in obj, false, `${label}: must not contain "${key}"`);
  }
}

async function loadFixtures() {
  const entries = await readdir(FIXTURES_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());
  const results = [];

  for (const dir of dirs) {
    const inputPath = join(FIXTURES_DIR, dir.name, "input.json");
    const expectedPath = join(FIXTURES_DIR, dir.name, "expected.json");

    const inputRaw = await readFile(inputPath, "utf8");
    const expectedRaw = await readFile(expectedPath, "utf8");

    results.push({
      name: dir.name,
      operation: JSON.parse(inputRaw).operation,
      args: JSON.parse(inputRaw).args ?? [],
      expected: JSON.parse(expectedRaw),
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

function checkKindExclusion(descriptors, excludedKinds) {
  const kinds = descriptors.map((d) => d.kind);
  for (const excluded of excludedKinds) {
    assert.equal(kinds.includes(excluded), false, `descriptors must not include "${excluded}"`);
  }
}

test("all app fixtures pass", async () => {
  const fixtures = await loadFixtures();

  assert.ok(fixtures.length > 0, "At least one fixture must exist");

  const sampleDoc = await import(
    new URL("../dist/sample-document.js", import.meta.url)
  );
  const renderPipeline = await import(
    new URL("../dist/render-pipeline.js", import.meta.url)
  );
  const componentRendering = await import(
    new URL("../dist/component-rendering.js", import.meta.url)
  );
  const editorIntegration = await import(
    new URL("../dist/editor-integration.js", import.meta.url)
  );
  const workspaceIntegration = await import(
    new URL("../dist/workspace-integration.js", import.meta.url)
  );

  const SAMPLE_SOURCE = sampleDoc.SAMPLE_DOCUMENT_SOURCE;

  for (const fixture of fixtures) {
    const { operation, args } = fixture;

    switch (operation) {
      case "sampleSourceBasic": {
        const source = SAMPLE_SOURCE;
        const nonEmpty = typeof source === "string" && source.length > 0;
        assert.equal(nonEmpty, true, "sample source must be non-empty");
        assert.ok(source.includes("Nabla Sample Document"));
        break;
      }

      case "renderPipelineSummary": {
        const summary = renderPipeline.getRenderPipelineSummary(SAMPLE_SOURCE);
        checkObjectFields(summary, fixture.expected, fixture.name);
        checkNoForbiddenKeys(summary, fixture.name);
        break;
      }

      case "canonicalExport": {
        const source = args[0];
        const exported = renderPipeline.canonicalizeSampleSource(source);
        assert.equal(typeof exported, "string");
        assert.ok(exported.length > 0, "canonical export must be non-empty");
        assert.equal(exported, fixture.expected.value);
        break;
      }

      case "editorRoundtrip": {
        const first = editorIntegration.exportCanonicalSource(args[0]);
        const second = editorIntegration.exportCanonicalSource(args[1]);
        assert.equal(typeof first, "string");
        assert.ok(first.length > 0);
        assert.equal(typeof second, "string");
        assert.ok(second.length > 0);
        assert.notEqual(first, second);
        assert.ok(first.includes(fixture.expected.firstIncludes));
        assert.ok(second.includes(fixture.expected.secondIncludes));
        break;
      }

      case "componentDescriptorSummary": {
        const summary = componentRendering.getComponentRenderingSummary();
        assert.equal(summary.totalCount, fixture.expected.totalCount);
        assert.equal(summary.uniqueKinds.length, fixture.expected.uniqueKinds);
        assert.equal(summary.supportedKinds.length, fixture.expected.supportedKinds);
        for (const desc of componentRendering.createSampleComponentDescriptors()) {
          checkNoForbiddenKeys(desc.props, `${fixture.name}:${desc.kind}`);
        }
        break;
      }

      case "componentDescriptorKinds": {
        const descriptors = componentRendering.createSampleComponentDescriptors();
        const kinds = descriptors.map((d) => d.kind);
        for (const expectedKind of fixture.expected.kinds) {
          assert.ok(kinds.includes(expectedKind), `descriptors must include "${expectedKind}"`);
        }
        checkKindExclusion(descriptors, fixture.expected.excluded);
        break;
      }

      case "workspaceSummary": {
        const summary = workspaceIntegration.getWorkspaceIntegrationSummary(SAMPLE_SOURCE);
        assert.equal(summary.hasWorkspaceIndex, true);
        assert.equal(summary.documentCount, fixture.expected.documentCount);
        assert.equal(typeof summary.linkCount, "number");
        assert.equal(typeof summary.backlinkCount, "number");
        assert.equal(typeof summary.diagnosticCount, "number");
        checkNoForbiddenKeys(summary, fixture.name);
        break;
      }

      case "sourceOfTruthInvariant": {
        const pipelineSummary = renderPipeline.getRenderPipelineSummary(
          "# Test\n\n[!note]> callout\n",
        );
        checkNoForbiddenKeys(pipelineSummary, `${fixture.name}:renderPipelineSummary`);

        const editorSummary = editorIntegration.getEditorIntegrationSummary(
          "# Editor test\n",
        );
        checkNoForbiddenKeys(editorSummary, `${fixture.name}:editorIntegrationSummary`);

        const workspaceSummary = workspaceIntegration.getWorkspaceIntegrationSummary(
          "# Workspace test\n\n[[Page]]\n",
        );
        checkNoForbiddenKeys(workspaceSummary, `${fixture.name}:workspaceIntegrationSummary`);

        for (const desc of componentRendering.createSampleComponentDescriptors()) {
          checkNoForbiddenKeys(desc.props, `${fixture.name}:componentProps:${desc.kind}`);
        }
        break;
      }

      default:
        assert.fail(`Unknown operation: ${operation}`);
    }
  }
});
