/**
 * Smoke test for the static export. Catches the failure modes that break a
 * GitHub Pages deployment: a missing base path, a shell that never reaches the
 * browser, a snapshot that no longer matches the repositories it claims to
 * describe, and a project a crawler cannot see.
 *
 *   npm run build && npm run verify
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { works } from "../src/data/site.config.ts";
import { PROJECT_APPS } from "../src/lib/orbi.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exportDir = resolve(root, "out");
const repoName = process.env.PORTFOLIO_REPO_NAME ?? "portfolio";
const prefix = `/${repoName}`;

const failures = [];
const checks = [];

function check(name, condition, detail = "") {
  if (condition) {
    checks.push(name);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Every stylesheet of the export, as one string. */
function stylesheets(dir) {
  const found = [];

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) {
      found.push(...stylesheets(path));
    } else if (entry.endsWith(".css")) {
      found.push(readFileSync(path, "utf8"));
    }
  }

  return found.join("\n");
}

let html = "";
try {
  html = readFileSync(resolve(exportDir, "index.html"), "utf8");
} catch {
  console.error("out/index.html not found. Run `npm run build` first.");
  process.exit(1);
}

const snapshot = JSON.parse(
  readFileSync(resolve(root, "src/data/github.json"), "utf8"),
);

/**
 * The page without the script blocks. The flight payload carries the props of
 * the client components inside them, so a check that reads the raw export
 * proves that the props reached the browser and not that the page shows
 * them. Every check about what the page shows reads this one.
 */
const rendered = html.replace(/<script[\s\S]*?<\/script>/g, "");

const syncConfig = JSON.parse(
  readFileSync(resolve(root, "scripts/github-sync.config.json"), "utf8"),
);

check("export contains the home page", html.length > 0);
check(
  "assets are prefixed with the base path",
  html.includes(`${prefix}/_next/static/`),
  `expected ${prefix}/_next/static/ in the document`,
);
check(
  "no unprefixed asset references",
  !/["'(]\/_next\/static\//.test(html),
  "found an asset path without the base path",
);

// The desktop environment is the page: the bar, the wallpaper, the dock and
// the main region are all rendered by the server, so the shell paints before
// the script arrives.
for (const [label, needle] of [
  ["the wallpaper", 'class="os-field"'],
  ["the dock", 'class="os-dock"'],
  ["the desktop", 'class="os-desktop"'],
  ["the logo of the desktop", 'class="os-wordmark'],
  ["the skip target", 'id="main"'],
]) {
  check(`${label} is rendered`, rendered.includes(needle));
}

// The boot overlay is a client screen; the portfolio behind it is rendered by
// the server before the clock starts.
check(
  "the boot screen is not a wall in front of the content",
  !rendered.includes("os-boot__stage-line") ||
    rendered.indexOf("noscript") < rendered.indexOf("os-boot"),
  "the server put the boot screen before the no-script document",
);

const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1] ?? "";
check(
  "the page declares a canonical URL",
  canonical.length > 0,
  "no canonical link in the document head",
);

const siteRoot = canonical.replace(/\/$/, "");

for (const file of ["robots.txt", "sitemap.xml"]) {
  let content = "";

  try {
    content = readFileSync(resolve(exportDir, file), "utf8");
  } catch {
    content = "";
  }

  check(`${file} is exported`, content.length > 0, `${file} is missing from the export`);
  check(
    `${file} points at the published site`,
    siteRoot.length > 0 && content.includes(siteRoot),
    `${file} does not reference ${siteRoot}`,
  );
}

// The projects are inside an application, so the server payload must carry
// them: the ItemList in the head is what a crawler reads without running the
// shell, and the dock is what a visitor reads with it.
const featured = snapshot.repos.filter((repo) => repo.featured);

check(
  "the projects are declared in the structured data",
  html.includes('"@type":"ItemList"') &&
    featured.every((repo) => html.includes(`#/projects/${repo.name}`)),
  "a project has no address in the ItemList",
);

for (const app of [
  "Orbital Explorer",
  "Code Studio",
  "System Monitor",
  "Orbital Terminal",
  "Playground",
  "Connect",
]) {
  check(`the dock offers ${app}`, rendered.includes(app));
}

check(
  "the Project Hub is no longer an application",
  !rendered.includes("Project Hub"),
  "the old single-project app is still in the shell",
);

// Every featured project is a tile on the desktop, generated from the data.
const icons = (rendered.match(/os-icons__item/g) ?? []).length;

check(
  "every featured project has an icon on the desktop",
  icons === PROJECT_APPS.length,
  `the page has ${icons} icons for ${PROJECT_APPS.length} featured projects`,
);

check(
  "every work shows the drawn frame of its product",
  rendered.includes("work-frame__url"),
);

for (const repo of featured) {
  const work = works[repo.name];

  check(
    `the work ${repo.name} has a line written for the site`,
    Boolean(work?.blurb),
    "the work has no description in the site configuration",
  );

  const missing = (work?.stack ?? []).filter((item) => !html.includes(item));

  check(
    `the technologies of ${repo.name} are in the payload`,
    missing.length === 0 && (work?.stack?.length ?? 0) > 0,
    `missing: ${missing.join(", ")}`,
  );
}

for (const language of snapshot.languages.slice(0, 6)) {
  check(`language ${language.name} is in the payload`, html.includes(language.name));
}

check(
  "featured repositories are not empty",
  snapshot.repos.some((repo) => repo.featured),
  "no repository is marked as featured",
);

// The contact channels live in the site configuration, so the smoke test reads
// them from there instead of keeping a second copy of the values.
const configSource = readFileSync(resolve(root, "src/data/site.config.ts"), "utf8");
const email = configSource.match(/email:\s*"([^"]+)"/)?.[1] ?? "";

check("the contact email is in the payload", email.length > 0 && html.includes(email));
check(
  "the snapshot holds every public repository that is not excluded",
  snapshot.repos.length ===
    snapshot.profile.publicRepos - syncConfig.exclude.length,
  `snapshot has ${snapshot.repos.length} of ${snapshot.profile.publicRepos} public repos, ${syncConfig.exclude.length} excluded`,
);

// The palette: the shell is graphite on obsidian, and the light theme keeps
// its cloud.
const css = stylesheets(resolve(exportDir, "_next", "static")).toLowerCase().replace(/\s+/g, "");

check(
  "the shell fills with the obsidian",
  css.includes("--surface:#101216"),
  "the system background moved",
);
check(
  "the graphite surface is declared",
  css.includes("--panel:#191d24"),
  "the window surface moved",
);
check(
  "the light theme keeps its cloud",
  css.includes("--surface:#f2f3f5"),
  "the light surface moved",
);
check(
  "the orbital accent is declared",
  css.includes("--accent:#a9bce5"),
  "the accent moved",
);

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed:\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log(`\n${checks.length} export checks passed.`);
