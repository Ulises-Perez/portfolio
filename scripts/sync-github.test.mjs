import assert from "node:assert/strict";
import { test } from "node:test";

import {
  aggregateLanguages,
  excerpt,
  isVisibleRepo,
  keepLanguages,
  sortRepos,
  summary,
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

test("summary keeps the line that talks about the project", () => {
  assert.equal(
    summary("Nexo is a personal project built as a monorepo", ""),
    "Nexo is a personal project built as a monorepo",
  );
  assert.equal(summary("", "a short description"), "a short description");
});

test("summary ignores framework boilerplate and cuts long lines", () => {
  assert.equal(
    summary("About Laravel Laravel is a web application framework", "Page LaraMovies"),
    "Page LaraMovies",
  );
  assert.equal(summary("too short", "a real description"), "a real description");
  assert.equal(summary("", "no readme and no description"), "no readme and no description");

  const long = summary(`${"a".repeat(400)}`, "");

  assert.equal(long.length, 151);
  assert.match(long, /…$/);
});

test("summary trims the name the readme repeats", () => {
  assert.equal(
    summary("Nexo Nexo is a personal project built as a monorepo", "", 150, "Nexo"),
    "Nexo is a personal project built as a monorepo",
  );
  assert.equal(
    summary("nexo is a personal project built as a monorepo", "", 150, "Nexo"),
    "nexo is a personal project built as a monorepo",
  );
});
