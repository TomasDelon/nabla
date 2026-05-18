import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule as loadRuntimeTsModule } from "./helpers/load-ts-module.mjs";

const parserModuleUrl = new URL("../src/parser.ts", import.meta.url);
const serializerModuleUrl = new URL("../src/serializer.ts", import.meta.url);
const fixturesModuleUrl = new URL("../src/fixtures.ts", import.meta.url);

const wikiFixtureIds = [
  "wiki-links/basic",
  "wiki-links/alias",
  "wiki-links/block-canonical",
  "wiki-links/block-compatible",
  "wiki-links/combined-alias-heading",
  "wiki-links/combined-alias-block-compatible",
  "wiki-links/escaped",
  "wiki-links/invalid-combined"
];

const tagFixtureIds = [
  "tags/basic"
];

let parserModulePromise;
let serializerModulePromise;
let fixturesModulePromise;

async function loadTsModule(moduleUrl) {
  return loadRuntimeTsModule(moduleUrl);
}

async function loadParserModule() {
  parserModulePromise ??= loadTsModule(parserModuleUrl);
  return parserModulePromise;
}

async function loadSerializerModule() {
  serializerModulePromise ??= loadTsModule(serializerModuleUrl);
  return serializerModulePromise;
}

async function loadFixturesModule() {
  fixturesModulePromise ??= loadTsModule(fixturesModuleUrl);
  return fixturesModulePromise;
}

test("tag fixtures parse and serialize according to the checked-in contracts", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();
  const {
    compareFixtureAst,
    compareFixtureDiagnostics,
    compareFixtureOutput,
    loadParserFixture
  } = await loadFixturesModule();

  for (const fixtureId of tagFixtureIds) {
    const fixture = await loadParserFixture(fixtureId);
    const parsed = parse(fixture.input);

    compareFixtureAst(parsed, fixture.ast);
    compareFixtureDiagnostics(parsed.diagnostics, fixture.diagnostics);
    compareFixtureOutput(serialize(parsed), fixture.output);
  }
});

test("tag parser handles single and nested tag values", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("#topic"), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "tag",
            value: "topic",
            segments: ["topic"],
            raw: "#topic"
          }
        ]
      }
    ],
    diagnostics: []
  });

  assert.deepEqual(parse("#math/analyse"), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "tag",
            value: "math/analyse",
            segments: ["math", "analyse"],
            raw: "#math/analyse"
          }
        ]
      }
    ],
    diagnostics: []
  });

  assert.deepEqual(parse("#a/b/c/d"), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "tag",
            value: "a/b/c/d",
            segments: ["a", "b", "c", "d"],
            raw: "#a/b/c/d"
          }
        ]
      }
    ],
    diagnostics: []
  });
});

test("tag parser handles tags with underscores and digits", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("#tag_name_123"), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "tag",
            value: "tag_name_123",
            segments: ["tag_name_123"],
            raw: "#tag_name_123"
          }
        ]
      }
    ],
    diagnostics: []
  });

  assert.deepEqual(parse("#99_problems"), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "tag",
            value: "99_problems",
            segments: ["99_problems"],
            raw: "#99_problems"
          }
        ]
      }
    ],
    diagnostics: []
  });
});

test("tag parser leaves hash followed by space as literal text", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("see # notag"), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: "see # notag" }]
      }
    ],
    diagnostics: []
  });
});

test("tag parser leaves syntax inside protected regions literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("See `#tag` and <span>#tag</span>."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "See `#tag` and <span>#tag</span>."
          }
        ]
      }
    ],
    diagnostics: []
  });
});

test("tag and wiki link interop work correctly", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("#tag and [[Wiki]] link"), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "tag",
            value: "tag",
            segments: ["tag"],
            raw: "#tag"
          },
          { type: "text", value: " and " },
          {
            type: "wikiLink",
            target: "Wiki",
            syntax: "canonical",
            raw: "[[Wiki]]"
          },
          { type: "text", value: " link" }
        ]
      }
    ],
    diagnostics: []
  });
});

test("wiki link fixtures parse and serialize according to the checked-in contracts", async () => {
  const { parse } = await loadParserModule();
  const { serialize } = await loadSerializerModule();
  const {
    compareFixtureAst,
    compareFixtureDiagnostics,
    compareFixtureOutput,
    loadParserFixture
  } = await loadFixturesModule();

  for (const fixtureId of wikiFixtureIds) {
    const fixture = await loadParserFixture(fixtureId);
    const parsed = parse(fixture.input);

    compareFixtureAst(parsed, fixture.ast);
    compareFixtureDiagnostics(parsed.diagnostics, fixture.diagnostics);
    compareFixtureOutput(serialize(parsed), fixture.output);
  }
});

test("wiki link parser handles heading-only links and leaves transclusion syntax literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("See [[Analyse#Limits]]."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "See " },
          {
            type: "wikiLink",
            target: "Analyse",
            heading: "Limits",
            syntax: "canonical",
            raw: "[[Analyse#Limits]]"
          },
          { type: "text", value: "." }
        ]
      }
    ],
    diagnostics: []
  });

  assert.deepEqual(parse("See ![[Analyse]]."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: "See ![[Analyse]]." }]
      }
    ],
    diagnostics: []
  });
});

test("wiki link parser leaves syntax inside inline HTML containers literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("See <span>[[Algebra]]</span> inside span."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "See <span>[[Algebra]]</span> inside span."
          }
        ]
      }
    ],
    diagnostics: []
  });
});

test("wiki link parser leaves syntax inside inline HTML with attributes literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(
    parse('See <span class="foo">[[Algebra]]</span> inside span with attributes.'),
    {
      type: "document",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: 'See <span class="foo">[[Algebra]]</span> inside span with attributes.'
            }
          ]
        }
      ],
      diagnostics: []
    }
  );
});

test("wiki link parser leaves syntax inside inline HTML with multiple attributes literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(
    parse('See <span class="foo" id="bar">[[Algebra]]</span> inside span with multiple attributes.'),
    {
      type: "document",
      children: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: 'See <span class="foo" id="bar">[[Algebra]]</span> inside span with multiple attributes.'
            }
          ]
        }
      ],
      diagnostics: []
    }
  );
});

test("wiki link parser leaves syntax inside different inline HTML containers literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("See <div>[[Algebra]]</div> inside div."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "See <div>[[Algebra]]</div> inside div."
          }
        ]
      }
    ],
    diagnostics: []
  });
});

test("wiki link parser parses normal wiki link outside inline HTML", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("See <span>literal</span> and [[Analyse]] outside."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: "See <span>literal</span> and " },
          {
            type: "wikiLink",
            target: "Analyse",
            syntax: "canonical",
            raw: "[[Analyse]]"
          },
          { type: "text", value: " outside." }
        ]
      }
    ],
    diagnostics: []
  });
});

test("wiki link parser handles inline HTML and wiki links mixed in same input", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(
    parse("Text <span>[[hidden]]</span> and [[visible]] and <div>[[also hidden]]</div> end."),
    {
      type: "document",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "Text <span>[[hidden]]</span> and " },
            {
              type: "wikiLink",
              target: "visible",
              syntax: "canonical",
              raw: "[[visible]]"
            },
            { type: "text", value: " and <div>[[also hidden]]</div> end." }
          ]
        }
      ],
      diagnostics: []
    }
  );
});

test("wiki link parser leaves syntax inside protected regions literal", async () => {
  const { parse } = await loadParserModule();

  assert.deepEqual(parse("See `[[Analyse]]` and <span>[[Algebra]]</span>."), {
    type: "document",
    children: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "See `[[Analyse]]` and <span>[[Algebra]]</span>."
          }
        ]
      }
    ],
    diagnostics: []
  });
});
