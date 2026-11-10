/**
 * The application model of Orbi OS.
 *
 * Two families of app, one shape:
 *
 * - the system apps, written once and fixed (Explorer, Code Studio, System
 *   Monitor, Terminal, Playground, Connect);
 * - the project apps, generated from the featured repositories, so a new
 *   featured project becomes a new app with its own icon, window and address
 *   without touching this file.
 *
 * Everything here is pure: the registry, the icon of a project, the addresses,
 * the commands. The React tree only draws what this returns.
 */

import { site, works, type Glyph } from "../data/site.config.ts";
import { featuredRepos, repos } from "./github.ts";

/** The fixed applications of the system. */
export type SystemId =
  | "explorer"
  | "code"
  | "monitor"
  | "terminal"
  | "playground"
  | "connect";

/** Every window the system can open: a system app or a project app. */
export type AppId = SystemId | string;

export type Surface = "dock" | "desktop";

export type AppMeta = {
  id: string;
  title: string;
  /** One line under the title in the palette. */
  hint: string;
  /** The dock or the desktop grid. Projects live on the desktop. */
  surface: Surface;
  /** The accent the app wears, when it has one of its own. */
  accent?: string;
  /** The initial the tile shows. */
  initial: string;
  /** The shape the tile draws, when the app has one of its own. */
  glyph?: Glyph;
  size: { width: number; height: number };
  min: { width: number; height: number };
  /** The project this app shows, when it is a project app. */
  project?: string;
};

export const SYSTEM_APPS: AppMeta[] = [
  {
    id: "explorer",
    title: "Orbital Explorer",
    hint: "profile, trajectory and the philosophy of the work",
    surface: "dock",
    initial: "E",
    size: { width: 820, height: 560 },
    min: { width: 420, height: 340 },
  },
  {
    id: "code",
    title: "Code Studio",
    hint: "the source behind this system",
    surface: "dock",
    initial: "C",
    size: { width: 880, height: 580 },
    min: { width: 480, height: 360 },
  },
  {
    id: "monitor",
    title: "System Monitor",
    hint: "the stack, measured by bytes committed",
    surface: "dock",
    initial: "M",
    size: { width: 720, height: 600 },
    min: { width: 420, height: 380 },
  },
  {
    id: "terminal",
    title: "Orbital Terminal",
    hint: "a shell into the system",
    surface: "dock",
    initial: "T",
    size: { width: 720, height: 480 },
    min: { width: 420, height: 320 },
  },
  {
    id: "playground",
    title: "Playground",
    hint: "experiments: a tide drawn in characters",
    surface: "dock",
    initial: "P",
    size: { width: 860, height: 600 },
    min: { width: 460, height: 360 },
  },
  {
    id: "connect",
    title: "Connect",
    hint: "ask the desk, or write directly",
    surface: "dock",
    initial: "C",
    size: { width: 620, height: 620 },
    min: { width: 380, height: 420 },
  },
];

/** The featured repository, as the system knows it. */
export type Featured = {
  name: string;
  url: string;
  language: string;
  bytes: number;
  stars: number;
  pushedAt: string;
  summary: string;
  stack: string[];
  accent: string;
  /** The shape of its icon. */
  glyph?: Glyph;
  screen?: ReturnType<typeof screenOf>;
  /** The line the site writes for the work, when it has one. */
  blurb?: string;
};

function screenOf(name: string) {
  return works[name]?.screen;
}

/** The featured repositories, with the line and the accent the site gives them. */
export const featured: Featured[] = featuredRepos.map((repo) => {
  const work = works[repo.name];

  return {
    name: repo.name,
    url: repo.url,
    language: repo.language,
    bytes: repo.bytes,
    stars: repo.stars,
    pushedAt: repo.pushedAt,
    summary: work?.blurb ?? repo.summary,
    blurb: work?.blurb,
    stack: work?.stack ?? (repo.language ? [repo.language] : []),
    accent: work?.accent ?? "#8b9390",
    glyph: work?.glyph,
    screen: screenOf(repo.name),
  };
});

/** The id an app is opened at: the project name, lower-cased. */
export function projectAppId(name: string): string {
  return `project:${name.toLowerCase()}`;
}

/** The project behind an app id, or null for a system app. */
export function projectOf(id: string): Featured | undefined {
  if (!id.startsWith("project:")) return undefined;
  const slug = id.slice("project:".length);

  return featured.find((project) => project.name.toLowerCase() === slug);
}

/**
 * A project is its own application, generated from the snapshot and the site
 * config: the icon, the accent and the window all come from the data.
 */
export const PROJECT_APPS: AppMeta[] = featured.map((project) => ({
  id: projectAppId(project.name),
  title: project.name,
  hint: `${project.language || "code"} · ${project.stack.slice(0, 3).join(", ")}`,
  surface: "desktop",
  accent: project.accent,
  initial: project.name.charAt(0).toUpperCase(),
  glyph: project.glyph,
  size: { width: 900, height: 640 },
  min: { width: 520, height: 420 },
  project: project.name,
}));

/** Everything the system can open. */
export const APPS: AppMeta[] = [...SYSTEM_APPS, ...PROJECT_APPS];

export function appMeta(id: string): AppMeta {
  return (
    APPS.find((app) => app.id === id) ??
    SYSTEM_APPS[0]
  );
}

export function isProjectApp(id: string): boolean {
  return id.startsWith("project:");
}

/** The apps that live on the desktop grid. */
export const DESKTOP_APPS = PROJECT_APPS;

/** What a window can be opened at: a system app, or a project app. */
export type Route = { app: string; project?: string };

const projectNames = featured.map((project) => project.name);

/**
 * An address is `#/<system-app>`, `#/<project>` or `#/projects/<name>`. The
 * project form is kept for the links already published.
 */
export function parseHash(hash: string): Route | null {
  const path = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!path) return null;

  const [head, ...rest] = path.split("/");
  const id = head.toLowerCase();

  if (id === "projects" && rest.length > 0) {
    const name = rest.join("/");
    const found = projectNames.find(
      (project) => project.toLowerCase() === name.toLowerCase(),
    );

    return found
      ? { app: projectAppId(found), project: found }
      : { app: "unknown", project: name };
  }

  if (SYSTEM_APPS.some((app) => app.id === id)) {
    return { app: id };
  }

  // A project could also be addressed by its own name.
  const project = projectNames.find((name) => name.toLowerCase() === id);

  return project ? { app: projectAppId(project), project } : null;
}

export function routeHash(route: Route): string {
  if (route.project) return `#/projects/${route.project}`;

  return `#/${route.app}`;
}

/** Search over the palette: every word of the query must appear. */
export function match(query: string, text: string): boolean {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const haystack = text.toLowerCase();

  return words.every((word) => haystack.includes(word));
}

/**
 * The terminal's answer to a line. Pure: the shell component prints what this
 * returns and nothing else, so what a command does can be tested.
 */
export type ShellReply = {
  lines: { text: string; tone: "out" | "dim" | "err" | "ok" }[];
  /** An application the command asks the system to open. */
  open?: string;
  /** The project the command asks to open. */
  project?: string;
  theme?: "light" | "dark";
  clear?: boolean;
};

/** The name of an app as the shell accepts it: id, or its title in kebab. */
function findApp(word: string): AppMeta | undefined {
  const needle = word.toLowerCase();

  return APPS.find(
    (app) =>
      app.id === needle ||
      app.id.replace(/^project:/, "") === needle ||
      app.title.toLowerCase().replace(/\s+/g, "-") === needle,
  );
}

export function runCommand(input: string): ShellReply {
  const [command, ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ");

  switch ((command ?? "").toLowerCase()) {
    case "":
      return { lines: [] };

    case "help":
      return {
        lines: [
          { text: "orbi shell — commands", tone: "dim" },
          { text: "  open <app>      explorer · code · monitor · terminal", tone: "out" },
          { text: "                  playground · connect", tone: "out" },
          { text: "  open <project>  nexo · vumies · ritup2 · LaraMovies …", tone: "out" },
          { text: "  search <term>   projects and their stack", tone: "out" },
          { text: "  whoami          the developer", tone: "out" },
          { text: "  ask <question>  the desk in Connect", tone: "out" },
          { text: "  theme <mode>    light · dark", tone: "out" },
          { text: "  clear           empty this session", tone: "out" },
          { text: "  help            this list", tone: "out" },
        ],
      };

    case "open": {
      const app = findApp(arg);

      if (!app) {
        return {
          lines: [
            { text: `open: no application called "${arg}"`, tone: "err" },
            { text: `try: ${APPS.map((entry) => entry.id.replace(/^project:/, "")).join(" · ")}`, tone: "dim" },
          ],
        };
      }

      return {
        lines: [
          {
            text: `opening ${app.title}${app.project ? "" : ""}`,
            tone: "ok",
          },
        ],
        open: app.id,
      };
    }

    case "search": {
      if (!arg) {
        return { lines: [{ text: "search: what should I look for?", tone: "err" }] };
      }

      const hits = featured.filter((project) =>
        match(arg, `${project.name} ${project.summary} ${project.stack.join(" ")}`),
      );

      if (hits.length === 0) {
        return { lines: [{ text: `search: nothing matches "${arg}"`, tone: "dim" }] };
      }

      return {
        lines: [
          { text: `${hits.length} project${hits.length === 1 ? "" : "s"}`, tone: "dim" },
          ...hits.map((project) => ({
            text: `${project.name.padEnd(14)} ${project.language || "code"}`,
            tone: "out" as const,
          })),
        ],
        project: hits[0].name,
        open: projectAppId(hits[0].name),
      };
    }

    case "whoami":
      return {
        lines: [
          { text: `${site.displayName} — ${site.roles.join(" · ")}`, tone: "out" },
          { text: `${repos.length} public repositories on GitHub`, tone: "dim" },
          { text: "available for contracts and full-time work", tone: "ok" },
        ],
      };

    case "ask": {
      if (!arg) {
        return {
          lines: [
            { text: "ask: what should I tell the desk?", tone: "err" },
            { text: "try: ask can you build a landing page", tone: "dim" },
          ],
        };
      }

      return {
        lines: [{ text: `opening the desk — "${arg}"`, tone: "ok" }],
        open: "connect",
      };
    }

    case "theme": {
      const mode = arg.toLowerCase();

      if (mode !== "light" && mode !== "dark") {
        return {
          lines: [{ text: "theme: light or dark", tone: "err" }],
        };
      }

      return {
        lines: [{ text: `theme set to ${mode}`, tone: "ok" }],
        theme: mode,
      };
    }

    case "clear":
      return { lines: [], clear: true };

    case "ls":
      return {
        lines: [
          { text: SYSTEM_APPS.map((app) => app.id).join("  "), tone: "out" },
          { text: PROJECT_APPS.map((app) => app.project?.toLowerCase()).join("  "), tone: "dim" },
        ],
      };

    case "date":
      return { lines: [{ text: new Date().toString(), tone: "out" }] };

    default:
      return {
        lines: [
          { text: `orbi: command not found: ${command}`, tone: "err" },
          { text: "type help", tone: "dim" },
        ],
      };
  }
}
