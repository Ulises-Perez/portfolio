import snapshotJson from "@/data/github.json";

export type Repo = {
  name: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  languages: Record<string, number>;
  bytes: number;
  stars: number;
  forks: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  license: string;
  createdAt: string;
  pushedAt: string;
  featured: boolean;
  summary: string;
};

/**
 * What a project panel needs. The client only receives these fields, so the
 * rest of the snapshot never crosses to the browser.
 */
export type Project = Pick<
  Repo,
  | "name"
  | "url"
  | "language"
  | "languages"
  | "bytes"
  | "stars"
  | "pushedAt"
  | "summary"
>;

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
