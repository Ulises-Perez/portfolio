import snapshotJson from "../data/github.json" with { type: "json" };

/**
 * The fields of a repository the page reads. Everything else the GitHub API
 * returns — topics, licence, forks, the per-repository language map — is
 * dropped by the sync: it was committed, typed and shipped to the browser
 * with no reader.
 */
export type Repo = {
  name: string;
  url: string;
  language: string;
  bytes: number;
  stars: number;
  pushedAt: string;
  featured: boolean;
  summary: string;
};

/** The three fields of a repository the terminal prints. */
export type NamedRepo = Pick<Repo, "name" | "language" | "summary">;

export type Profile = {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  url: string;
  location: string;
  blog: string;
  company: string;
  followers: number;
  publicRepos: number;
  createdAt: string;
};

export type Language = {
  name: string;
  bytes: number;
  repos: number;
};

type Snapshot = {
  generatedAt: string;
  profile: Profile;
  languages: Language[];
  repos: Repo[];
};

/**
 * The JSON import narrows each repository to its own literal language keys, so the
 * snapshot is typed once at this boundary instead of on every consumer.
 */
const snapshot = snapshotJson as unknown as Snapshot;

export const profile = snapshot.profile;
export const languages = snapshot.languages;
export const repos = snapshot.repos;
export const generatedAt = snapshot.generatedAt;

export const featuredRepos = repos.filter((repo) => repo.featured);

/** Public repositories on the site: the whole list, minus the ones excluded. */
export const repoCount = repos.length;

/** Bytes of every language across the account, used to scale the stack bars. */
export const totalBytes = languages.reduce((total, language) => total + language.bytes, 0);

/** Years of public work on GitHub, derived from the account creation date. */
export const yearsOnGitHub = Math.max(
  1,
  Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / 31_557_600_000),
);
