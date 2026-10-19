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

for (const section of ["developer", "works", "repositories", "stack", "contact"]) {
  check(
    `section #${section} is rendered`,
    html.includes(`id="${section}"`),
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
check(
  "the snapshot holds every public repository",
  snapshot.repos.length === snapshot.profile.publicRepos,
  `snapshot has ${snapshot.repos.length} of ${snapshot.profile.publicRepos} public repos`,
);

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed:\n`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log(`\n${checks.length} export checks passed.`);
