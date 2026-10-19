import assert from "node:assert/strict";
import { test } from "node:test";

import {
  aggregateLanguages,
  excerpt,
  isVisibleRepo,
  keepLanguages,
  sortRepos,
  toPlainText,
} from "./lib/sync-helpers.mjs";

test("toPlainText removes code fences, markdown links and emphasis", () => {
  const markdown = [
    "# Title",
    "Some **bold** text with a [link](https://example.com).",
    "```js",
    "const secret = 1;",
    "```",
    "> quoted line",
  ].join("\n");

  const result = toPlainText(markdown);

  assert.equal(result.includes("const secret"), false);
  assert.equal(result.includes("**"), false);
  assert.equal(result.includes("https://example.com"), false);
  assert.match(result, /Title/);
  assert.match(result, /link/);
});

test("toPlainText collapses whitespace and trims", () => {
  assert.equal(toPlainText("  a   \n\n  b  "), "a b");
});

test("isVisibleRepo honours the fork and exclude rules", () => {
  const config = { includeForks: true, exclude: ["testgit"] };

  assert.equal(isVisibleRepo({ name: "nexo", fork: false }, config), true);
  assert.equal(isVisibleRepo({ name: "tm1_pausemenu", fork: true }, config), true);
  assert.equal(isVisibleRepo({ name: "testgit", fork: false }, config), false);
  assert.equal(
    isVisibleRepo({ name: "tm1_pausemenu", fork: true }, {
      includeForks: false,
      exclude: [],
    }),
    false,
  );
});

test("keepLanguages drops the configured non-technologies", () => {
  const languages = { PHP: 10, Procfile: 42 };

  assert.deepEqual(keepLanguages(languages, ["Procfile"]), { PHP: 10 });
  assert.deepEqual(keepLanguages(languages), languages);
});

test("aggregateLanguages sums bytes and counts repositories", () => {
  const repos = [
    { languages: { TypeScript: 100, PHP: 50 } },
    { languages: { TypeScript: 20 } },
  ];

  assert.deepEqual(aggregateLanguages(repos), [
    { name: "TypeScript", bytes: 120, repos: 2 },
    { name: "PHP", bytes: 50, repos: 1 },
  ]);
});

test("sortRepos puts featured first and then the most recently pushed", () => {
  const repos = [
    { name: "old", featured: false, pushedAt: "2020-01-01T00:00:00Z" },
    { name: "new", featured: false, pushedAt: "2024-01-01T00:00:00Z" },
    { name: "star", featured: true, pushedAt: "2019-01-01T00:00:00Z" },
  ];

  assert.deepEqual(
    sortRepos(repos).map((repo) => repo.name),
    ["star", "new", "old"],
  );
});

test("excerpt bounds the README length", () => {
  assert.equal(excerpt("abcdef", 3), "abc");
  assert.equal(excerpt("abc", 10), "abc");
});
