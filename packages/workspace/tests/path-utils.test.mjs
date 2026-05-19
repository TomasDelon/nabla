import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeWorkspacePath } from "../dist/index.js";

describe("normalizeWorkspacePath", () => {
  it("preserves a simple relative path", () => {
    assert.equal(normalizeWorkspacePath("foo"), "foo");
  });

  it("removes trailing .md extension", () => {
    assert.equal(normalizeWorkspacePath("foo.md"), "foo");
  });

  it("removes trailing .mp extension", () => {
    assert.equal(normalizeWorkspacePath("foo.mp"), "foo");
  });

  it("converts Windows backslashes to forward slashes", () => {
    assert.equal(normalizeWorkspacePath("foo\\bar"), "foo/bar");
  });

  it("removes duplicate slashes", () => {
    assert.equal(normalizeWorkspacePath("foo//bar"), "foo/bar");
  });

  it("removes leading ./ prefix", () => {
    assert.equal(normalizeWorkspacePath("./foo"), "foo");
  });

  it("removes leading ./ and strips extension", () => {
    assert.equal(normalizeWorkspacePath("./foo.md"), "foo");
  });

  it("trims surrounding whitespace", () => {
    assert.equal(normalizeWorkspacePath("  foo  "), "foo");
  });

  it("applies Unicode NFC normalization", () => {
    const composed = "\u00E9";
    const decomposed = "\u0065\u0301";
    assert.equal(normalizeWorkspacePath(decomposed), composed);
  });

  it("preserves nested relative paths", () => {
    assert.equal(normalizeWorkspacePath("foo/bar/baz"), "foo/bar/baz");
  });

  it("removes extension from nested path", () => {
    assert.equal(normalizeWorkspacePath("foo/bar/baz.md"), "foo/bar/baz");
  });

  it("normalizes mixed backslashes and forward slashes", () => {
    assert.equal(normalizeWorkspacePath("foo\\bar/baz"), "foo/bar/baz");
  });

  it("preserves case", () => {
    assert.equal(normalizeWorkspacePath("FooBar.md"), "FooBar");
  });

  it("handles path with ./ in the middle", () => {
    assert.equal(normalizeWorkspacePath("foo/./bar"), "foo/./bar");
  });

  it("preserves relative parent path", () => {
    assert.equal(normalizeWorkspacePath("../foo.md"), "../foo");
  });

  it("throws for empty string", () => {
    assert.throws(() => normalizeWorkspacePath(""), {
      message: /non-empty/
    });
  });

  it("throws for whitespace-only string", () => {
    assert.throws(() => normalizeWorkspacePath("   "), {
      message: /non-empty/
    });
  });

  it("does not strip .md from non-trailing position", () => {
    assert.equal(normalizeWorkspacePath(".md/file"), ".md/file");
  });

  it("preserves .md when it is the entire path after ./ removal", () => {
    assert.equal(normalizeWorkspacePath("./.md"), ".md");
  });
});
