/**
 * Smoke test for the static export. Catches the failure modes that break a
 * GitHub Pages deployment: a missing base path, a missing section or a snapshot
 * that no longer matches the repositories it claims to describe.
 *
 *   npm run build && npm run verify
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { works } from "../src/data/site.config.ts";

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

for (const section of ["developer", "works", "services", "stack", "contact"]) {
  check(
    `section #${section} is rendered`,
    html.includes(`id="${section}"`),
  );
}

check(
  "the page offers a skip link to the main content",
  html.includes('href="#main"') && html.includes('id="main"'),
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

// Only the featured repositories have a card in the works section. The rest
// of the shelf is not listed on the page.
const featured = snapshot.repos.filter((repo) => repo.featured);

for (const repo of featured) {
  check(
    `featured repository ${repo.name} is listed`,
    html.includes(repo.name),
    "the repository is featured in the snapshot but missing from the page",
  );
}

// The works are read sideways: one card per work inside a horizontal track,
// and the panels that used to stack down the page are gone.
const cards = html.match(/data-card/g) ?? [];

check(
  "every featured work has a card in the carousel",
  cards.length === featured.length,
  `the page has ${cards.length} cards for ${featured.length} featured works`,
);
check(
  "the works are a horizontal track",
  html.includes("works-runway") &&
    html.includes("works-stage") &&
    html.includes("works-track"),
);
check(
  "the vertical project panels are gone",
  !html.includes("data-panel"),
  "the page still carries the old project panels",
);
check(
  "every work shows the frame of its product",
  html.includes("work-frame__url"),
);

// Every featured work carries a line written for this site and the
// technologies it is built with, and both reach the page.
for (const repo of featured) {
  const work = works[repo.name];

  check(
    `the work ${repo.name} has a line written for the site`,
    Boolean(work?.blurb),
    "the work has no description in the site configuration",
  );
  check(
    `the description of ${repo.name} is on the page`,
    Boolean(work?.blurb) && html.includes(work.blurb),
  );

  const missing = (work?.stack ?? []).filter((item) => !html.includes(item));

  check(
    `the technologies of ${repo.name} are on the page`,
    missing.length > 0 ? false : (work?.stack?.length ?? 0) > 0,
    `missing from the page: ${missing.join(", ")}`,
  );
}

check(
  "the archive section is not rendered",
  !html.includes("the archive"),
  "the archive section is still part of the page",
);

for (const language of snapshot.languages.slice(0, 6)) {
  check(
    `language ${language.name} is shown`,
    html.includes(language.name),
  );
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
const discord = configSource.match(/discord:\s*"([^"]+)"/)?.[1] ?? "";

check("the contact email is published", email.length > 0 && html.includes(email));
check(
  "the discord handle is published",
  discord.length > 0 && html.includes(discord),
);
check(
  "the mail link is published",
  html.includes(`mailto:${email}`),
);
check(
  "the snapshot holds every public repository that is not excluded",
  snapshot.repos.length ===
    snapshot.profile.publicRepos - syncConfig.exclude.length,
  `snapshot has ${snapshot.repos.length} of ${snapshot.profile.publicRepos} public repos, ${syncConfig.exclude.length} excluded`,
);

// The palette is part of what the site promises: the dark theme fills with the
// near black and the light theme keeps the surface it had.
const css = stylesheets(resolve(exportDir, "_next", "static")).toLowerCase().replace(/\s+/g, "");

check(
  "the dark theme fills with the near black",
  css.includes("--surface:#0c0d0d"),
  "the dark theme still fills with the red",
);
check(
  "the light theme keeps its surface",
  css.includes("--surface:#b2c7ab"),
  "the light surface moved",
);

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed:\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log(`\n${checks.length} export checks passed.`);
