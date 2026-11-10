import {
  languages,
  repoCount,
  repos,
  totalBytes,
  yearsOnGitHub,
} from "@/lib/github";
import { formatBytes } from "@/lib/utils";
import { site } from "@/data/site.config";
import type { ScriptLine } from "@/lib/typewriter";

/**
 * What each section's terminal says.
 *
 * Every value here is read from the committed snapshot or the site config.
 * Nothing is invented for the effect: a terminal that prints a build log it
 * never ran is decoration wearing a costume.
 */

const topLanguages = languages.slice(0, 4);

export const heroScript: ScriptLine[] = [
  { text: "deus --version", tone: "cmd", speed: 55 },
  { text: "", tone: "dim", delay: 180 },
  { text: `${site.displayName.toLowerCase()}. — ${site.roles[0]}`, tone: "out" },
  {
    text: `${yearsOnGitHub} years of public work · ${repoCount} repositories · ${languages.length} languages`,
    tone: "dim",
  },
  { text: "", tone: "dim", delay: 120 },
  { text: `stack    ${topLanguages.map((l) => l.name).join(" · ")}`, tone: "key" },
  { text: `contact  ${site.contact.github}`, tone: "key" },
  {
    text: `status   available for new work`,
    tone: "ok",
  },
];

/** The developer section: the account, measured. */
export const developerScript: ScriptLine[] = [
  { text: "whoami --verbose", tone: "cmd", speed: 45 },
  { text: "", tone: "dim", delay: 140 },
  { text: `user      ${site.owner}`, tone: "key" },
  { text: `repos     ${repoCount}`, tone: "key" },
  { text: `languages ${languages.length}`, tone: "key" },
  { text: `bytes     ${formatBytes(totalBytes)}`, tone: "key" },
  { text: "", tone: "dim", delay: 100 },
  ...topLanguages.map((language) => {
    const share = Math.round((language.bytes / totalBytes) * 100);
    const bar = "█".repeat(Math.max(1, Math.round(share / 4))).padEnd(12, "░");

    return {
      text: `${language.name.padEnd(11)} ${bar} ${String(share).padStart(2)}%`,
      tone: "out" as const,
    };
  }),
];

/** The works section: the featured repositories, by name. */
const featured = repos.filter((repo) => repo.featured);

export const worksScript: ScriptLine[] = [
  { text: "git log --oneline --featured", tone: "cmd", speed: 40 },
  { text: "", tone: "dim", delay: 140 },
  ...featured.map((repo) => ({
    text: `${repo.name.padEnd(14)} ${repo.language || "code"}`,
    tone: "key" as const,
  })),
  { text: "", tone: "dim", delay: 100 },
  { text: `${featured.length} featured of ${repoCount} public repositories`, tone: "dim" },
];

/** The services section: what can be hired. */
export const servicesScript: ScriptLine[] = [
  { text: "deus --services", tone: "cmd", speed: 50 },
  { text: "", tone: "dim", delay: 140 },
  ...site.services.flatMap((service, index) => [
    {
      text: `${service.index}  ${service.title}`,
      tone: "key" as const,
    },
    {
      text: `    ${service.items.slice(0, 3).join(" · ")}`,
      tone: "dim" as const,
    },
    ...(index < site.services.length - 1
      ? [{ text: "", tone: "dim" as const, delay: 60 }]
      : []),
  ]),
];

/** The contact section: the ways out. */
export const contactScript: ScriptLine[] = [
  { text: "contact --all", tone: "cmd", speed: 55 },
  { text: "", tone: "dim", delay: 140 },
  { text: `github  ${site.contact.github}`, tone: "key" },
  ...(site.contact.email
    ? [{ text: `email   ${site.contact.email}`, tone: "key" as const }]
    : []),
  ...(site.contact.discord
    ? [{ text: `discord ${site.contact.discord}`, tone: "key" as const }]
    : []),
  { text: "", tone: "dim", delay: 100 },
  { text: "open to remote work and freelance projects", tone: "ok" },
];
