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

/**
 * The one line that says what a project is. The README opens with a sentence
 * about the project itself, so that is the line worth keeping; a framework
 * boilerplate readme is not, and neither is an empty description. A readme
 * that starts with the name of the repository is trimmed, because the panel
 * already shows the name next to the line.
 */
export function summary(readme, description, limit = 150, name = "") {
  let text = (readme ?? "").trim();

  // A readme that opens with the name of the repository repeats it in the
  // heading and in the first word of the sentence: the heading is dropped.
  if (name && text.toLowerCase().startsWith(name.toLowerCase())) {
    const rest = text.slice(name.length).trim().replace(/^[-—:.\s]+/, "");

    if (rest.toLowerCase().startsWith(name.toLowerCase())) {
      text = rest;
    }
  }

  if (text.length >= 24 && !text.startsWith("About ")) {
    return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
  }

  return (description ?? "").trim();
}
