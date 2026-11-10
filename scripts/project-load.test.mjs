import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PROJECT_LOAD_EXIT_MS,
  PROJECT_LOAD_MS,
  hasLoaded,
  loadingLine,
  markLoaded,
} from "../src/lib/project-load.ts";

/** A stand-in for sessionStorage, which node does not have. */
function fakeStorage() {
  const map = new Map();

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    clear: () => map.clear(),
  };
}

test("the loading lasts one constant, and its exit is shorter", () => {
  assert.ok(PROJECT_LOAD_MS >= 800 && PROJECT_LOAD_MS <= 1200);
  assert.ok(PROJECT_LOAD_EXIT_MS < PROJECT_LOAD_MS);
});

test("the line names the project it opens", () => {
  assert.equal(loadingLine("nexo"), "Opening nexo…");
  assert.equal(loadingLine("LaraMovies"), "Opening LaraMovies…");
});

test("the screen is shown once per project per session", () => {
  globalThis.sessionStorage = fakeStorage();

  assert.equal(hasLoaded("nexo"), false);

  markLoaded("nexo");
  assert.equal(hasLoaded("nexo"), true);

  // Another project has its own screen.
  assert.equal(hasLoaded("vumies"), false);
});

test("a project is remembered regardless of the case it was opened with", () => {
  globalThis.sessionStorage = fakeStorage();

  markLoaded("LaraMovies");
  assert.equal(hasLoaded("laramovies"), true);
  assert.equal(hasLoaded("LARAMOVIES"), true);
});

test("a browser with no storage shows the screen again, never crashes", () => {
  delete globalThis.sessionStorage;

  assert.equal(hasLoaded("nexo"), false);
  assert.doesNotThrow(() => markLoaded("nexo"));
});
