/**
 * Smoke test for the static export. Catches the failure modes that break a
 * GitHub Pages deployment: a missing base path, a missing section or a snapshot
 * that no longer matches the repositories it claims to describe.
 *
 *   npm run build && npm run verify
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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

for (const repo of snapshot.repos) {
  check(
    `repository ${repo.name} is listed`,
    html.includes(repo.name),
    "the repository is in the snapshot but missing from the page",
  );
}

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

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed:\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log(`\n${checks.length} export checks passed.`);
