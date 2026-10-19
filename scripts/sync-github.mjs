/**
 * Syncs the public GitHub profile, repositories, per-repository languages and
 * README excerpts into a committed snapshot consumed at build time.
 *
 *   npm run sync:github
 *
 * The site never calls the GitHub API at runtime: the snapshot keeps the build
 * hermetic, avoids the unauthenticated 60 requests/hour ceiling and lets the
 * curation list below decide what is shown.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import config from "./github-sync.config.json" with { type: "json" };
import {
  aggregateLanguages,
  excerpt,
  isVisibleRepo,
  keepLanguages,
  sortRepos,
  toPlainText,
} from "./lib/sync-helpers.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "src/data/github.json");
const API = "https://api.github.com";

/** Reads a GitHub API path, using the token when present and the gh CLI otherwise. */
async function request(path) {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

  if (token) {
    const response = await fetch(`${API}${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "portfolio-sync",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status} for ${path}`);
    }

    return response.json();
  }

  const result = spawnSync("gh", ["api", path], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error(
      `gh api failed for ${path}: ${result.stderr.trim() || result.stdout.trim()}`,
    );
  }

  return JSON.parse(result.stdout);
}

/** Walks a paginated collection endpoint until the last short page. */
async function requestAll(path) {
  const items = [];
  const perPage = 100;

  for (let page = 1; ; page += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const batch = await request(`${path}${separator}per_page=${perPage}&page=${page}`);

    if (!Array.isArray(batch) || batch.length === 0) break;

    items.push(...batch);
    if (batch.length < perPage) break;
  }

  return items;
}

/** Strips markdown noise so a README reads as a plain-text excerpt. */
async function readExcerpt(owner, repo) {
  try {
    const readme = await request(`/repos/${owner}/${repo}/readme`);
    if (!readme?.content) return "";

    const text = Buffer.from(readme.content, "base64").toString("utf8");
    return excerpt(toPlainText(text));
  } catch {
    return "";
  }
}

async function main() {
  const owner = config.owner;
  const profile = await request(`/users/${owner}`);

  const rawRepos = await requestAll(`/users/${owner}/repos`);
  const visible = rawRepos.filter((repo) => isVisibleRepo(repo, config));

  const repos = [];

  for (const repo of visible) {
    const languages = await request(`/repos/${owner}/${repo.name}/languages`);
    const bytes = Object.values(languages).reduce((total, value) => total + value, 0);
    const keptLanguages = keepLanguages(languages, config.ignoredLanguages);

    repos.push({
      name: repo.name,
      description: repo.description ?? "",
      url: repo.html_url,
      homepage: repo.homepage ?? "",
      language: repo.language ?? "",
      languages: Object.fromEntries(
        Object.entries(keptLanguages).sort((a, b) => b[1] - a[1]),
      ),
      bytes,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics ?? [],
      fork: repo.fork,
      archived: repo.archived,
      license: repo.license?.spdx_id ?? "",
      createdAt: repo.created_at,
      pushedAt: repo.pushed_at,
      featured: config.featured.includes(repo.name),
      readme: await readExcerpt(owner, repo.name),
    });
  }

  const sorted = sortRepos(repos);
  const languages = aggregateLanguages(sorted);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    profile: {
      login: profile.login,
      name: profile.name ?? profile.login,
      avatarUrl: profile.avatar_url,
      bio: profile.bio ?? "",
      url: profile.html_url,
      location: profile.location ?? "",
      blog: profile.blog ?? "",
      company: profile.company ?? "",
      followers: profile.followers,
      publicRepos: profile.public_repos,
      createdAt: profile.created_at,
    },
    languages,
    repos: sorted,
  };

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  console.log(
    `Synced ${repos.length} repos and ${languages.length} languages -> ${outputPath}`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
