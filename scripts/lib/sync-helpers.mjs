/**
 * Pure helpers for the GitHub sync. Kept free of I/O so they can be unit tested
 * without touching the network.
 */

/** Strips markdown noise so a README reads as a plain-text excerpt. */
export function toPlainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/[*_~`]/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\|.*$/gm, " ")
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Decides whether a repository belongs in the snapshot. */
export function isVisibleRepo(repo, config) {
  if (!config.includeForks && repo.fork) return false;

  return !config.exclude.includes(repo.name);
}

/** Drops the languages the curation config marks as non-technologies. */
export function keepLanguages(languages, ignored = []) {
  return Object.fromEntries(
    Object.entries(languages).filter(([language]) => !ignored.includes(language)),
  );
}

/** Sums the bytes of every language across the repositories. */
export function aggregateLanguages(repos) {
  const totals = new Map();

  for (const repo of repos) {
    for (const [language, value] of Object.entries(repo.languages)) {
      const entry = totals.get(language) ?? { name: language, bytes: 0, repos: 0 };
      entry.bytes += value;
      entry.repos += 1;
      totals.set(language, entry);
    }
  }

  return [...totals.values()].sort((a, b) => b.bytes - a.bytes);
}

/** Featured repositories first, then the most recently pushed. */
export function sortRepos(repos) {
  return [...repos].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;

    return new Date(b.pushedAt) - new Date(a.pushedAt);
  });
}

/** Cuts a README excerpt to a bounded length. */
export function excerpt(text, limit = 700) {
  return text.slice(0, limit);
}
