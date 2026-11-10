import assert from "node:assert/strict";
import { test } from "node:test";

import {
  APPS,
  DESKTOP_APPS,
  PROJECT_APPS,
  SYSTEM_APPS,
  appMeta,
  featured,
  isProjectApp,
  match,
  parseHash,
  projectAppId,
  projectOf,
  routeHash,
  runCommand,
} from "../src/lib/orbi.ts";

/* ── The applications ─────────────────────────────────────────────────────── */

test("every featured project becomes an application", () => {
  assert.equal(PROJECT_APPS.length, featured.length);
  assert.ok(PROJECT_APPS.length >= 6);

  for (const project of featured) {
    const app = PROJECT_APPS.find((entry) => entry.project === project.name);

    assert.ok(app, `${project.name} has no application`);
    assert.equal(app.id, `project:${project.name.toLowerCase()}`);
    assert.equal(app.initial, project.name.charAt(0).toUpperCase());
    assert.equal(app.accent, project.accent);
    assert.equal(app.surface, "desktop");
  }
});

test("adding a project would add an application, with no registry edit", () => {
  // The registry is a map over the data: nothing here is hand-written.
  assert.deepEqual(
    PROJECT_APPS.map((app) => app.project),
    featured.map((project) => project.name),
  );
});

test("the system apps live in the dock and the projects on the desktop", () => {
  assert.ok(SYSTEM_APPS.every((app) => app.surface === "dock"));
  assert.ok(DESKTOP_APPS.every((app) => app.surface === "desktop"));
  assert.equal(APPS.length, SYSTEM_APPS.length + PROJECT_APPS.length);
});

test("every project app has a glyph of its own, not an initial alone", () => {
  for (const app of PROJECT_APPS) {
    assert.ok(app.glyph, `${app.title} has no glyph`);
  }

  // The set reads as one family only if the shapes differ.
  const shapes = new Set(PROJECT_APPS.map((app) => app.glyph));
  assert.ok(shapes.size >= 5, `only ${shapes.size} distinct glyphs`);
});

test("the glyph is a fact of the data, not of the component", () => {
  const withGlyph = featured.filter((project) => project.glyph);

  assert.equal(withGlyph.length, featured.length);
});

test("the old Project Hub is gone from the registry", () => {
  assert.ok(!APPS.some((app) => app.id === "projects"));
  assert.ok(!SYSTEM_APPS.some((app) => app.id === "projects"));
});

test("a system app and a project app are told apart by their id", () => {
  assert.equal(isProjectApp("project:nexo"), true);
  assert.equal(isProjectApp("explorer"), false);
  assert.equal(projectOf("project:nexo")?.name, "nexo");
  assert.equal(projectOf("explorer"), undefined);
  assert.equal(appMeta("project:nexo").title, "nexo");
});

/* ── The addresses ────────────────────────────────────────────────────────── */

test("an address opens the app it names", () => {
  assert.equal(parseHash("#/terminal").app, "terminal");
  assert.equal(parseHash("#/explorer").app, "explorer");
  assert.equal(parseHash(""), null);
  assert.equal(parseHash("#/nope"), null);
});

test("a project address opens that project's own application", () => {
  const route = parseHash("#/projects/nexo");

  assert.equal(route.app, "project:nexo");
  assert.equal(route.project, "nexo");
});

test("a project address keeps the repository's own case", () => {
  assert.equal(parseHash("#/projects/LARAMOVIES").project, "LaraMovies");
  // The id is always lower-cased; the name keeps its case.
  assert.equal(parseHash("#/LaraMovies").app, "project:laramovies");
  assert.equal(parseHash("#/LaraMovies").project, "LaraMovies");
});

test("a route and its hash round-trip", () => {
  const route = { app: "project:vumies", project: "vumies" };

  assert.deepEqual(parseHash(routeHash(route)), route);
  assert.equal(routeHash({ app: "monitor" }), "#/monitor");
});

/* ── The shell ────────────────────────────────────────────────────────────── */

test("open names a system app", () => {
  assert.equal(runCommand("open explorer").open, "explorer");
  assert.equal(runCommand("open playground").open, "playground");
  assert.ok(runCommand("open windows").lines[0].text.includes("no application"));
});

test("open names a project by its name or by its app id", () => {
  assert.equal(runCommand("open nexo").open, "project:nexo");
  assert.equal(runCommand("open project:nexo").open, "project:nexo");
  assert.equal(runCommand("open laramovies").open, "project:laramovies");
  assert.equal(runCommand("open LaraMovies").open, "project:laramovies");
});

test("search finds a project and asks the shell to open it", () => {
  assert.equal(runCommand("search nexo").open, "project:nexo");
  assert.equal(runCommand("search rust").open, "project:nexo");
  assert.ok(runCommand("search nothinghere").lines[0].text.includes("nothing"));
});

test("theme only answers light or dark", () => {
  assert.equal(runCommand("theme dark").theme, "dark");
  assert.equal(runCommand("theme sepia").theme, undefined);
});

test("clear asks the shell to wipe, empty input does nothing", () => {
  assert.equal(runCommand("clear").clear, true);
  assert.deepEqual(runCommand("   ").lines, []);
});

test("an unknown command is reported, not swallowed", () => {
  const reply = runCommand("rm -rf /");

  assert.equal(reply.lines[0].tone, "err");
  assert.ok(reply.lines[0].text.includes("command not found"));
});

test("match requires every word", () => {
  assert.ok(match("hub", "Project Hub"));
  assert.ok(!match("monitor", "Project Hub"));
});

test("the palette label of a project app reads as the app it opens", () => {
  const nexo = projectAppId("nexo");

  assert.equal(nexo, "project:nexo");
  assert.equal(appMeta(nexo).title, "nexo");
  assert.equal(appMeta(nexo).project, "nexo");
});
