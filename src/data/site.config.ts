export type Service = {
  index: string;
  /** The plain name of the service, the way a client would ask for it. */
  title: string;
  /** The diagram the row shows next to the offer. */
  visual: "browser" | "pipeline" | "api";
  /** What the visitor can hire, in the plainest words. */
  items: string[];
  /** One line that says what this service is for. */
  note: string;
};

/** The kind of product a screen shows. */
export type WorkScreenKind = "app" | "site" | "player";

export type WorkScreen = {
  kind: WorkScreenKind;
  /** What the address bar of the frame reads. */
  url: string;
  /** The navigation of the product. */
  nav: string[];
  /** The headline of the screen. */
  headline: string;
  /** The line under the headline. */
  sub: string;
  /** The content of the screen: a catalogue, a table, a playlist. */
  items: { label: string; meta: string }[];
};

export type Work = {
  /** One line, written for this site, in the voice of the site. */
  blurb: string;
  /** The technologies and libraries the work is built with. */
  stack: string[];
  /** The color the product wears in its own screen. */
  accent: string;
  screen: WorkScreen;
};

/**
 * One entry per featured project, written for this site. The readmes are
 * written by their authors, in their own voice and sometimes in another
 * language; a portfolio speaks with one voice, so the featured projects get
 * their line here and the readme only fills the gap.
 *
 * The stack of every project was read from its own manifests, the
 * `package.json` and the `composer.json` of the repository, so the list names
 * the libraries the work really runs on and not the ones a readme mentions.
 *
 * The screen is drawn from the identity of the project: there is no live
 * deployment to photograph, so the frame holds a drawn interface instead.
 */
export const works: Record<string, Work> = {
  nexo: {
    blurb:
      "One monorepo with three moving parts: an API, a desktop client and the cloud service behind them.",
    stack: [
      "TypeScript",
      "Vue",
      "Rust",
      "Express",
      "Socket.IO",
      "Prisma",
      "Redis",
      "Tauri",
      "Cloudflare Workers",
    ],
    accent: "#3ec9b6",
    screen: {
      kind: "app",
      url: "nexo.app",
      nav: ["Overview", "Sessions", "Library", "Cloud"],
      headline: "Everything in one place",
      sub: "Your files, your devices, one account",
      items: [
        { label: "Desktop client", meta: "Tauri" },
        { label: "Realtime API", meta: "Socket.IO" },
        { label: "Cloud service", meta: "Workers" },
      ],
    },
  },
  vumies: {
    blurb:
      "A streaming platform where the catalogue, the player and the API live in one app.",
    stack: [
      "Vue 3",
      "TypeScript",
      "Pinia",
      "Vue Router",
      "Tailwind CSS",
      "Vite",
      "Tauri",
      "Rust",
    ],
    accent: "#8b7cf6",
    screen: {
      kind: "site",
      url: "vumies.app",
      nav: ["Home", "Movies", "Series", "Library"],
      headline: "Watch something good",
      sub: "Movies and series, ready to stream",
      items: [
        { label: "The Long Quiet", meta: "Drama" },
        { label: "Night Shift", meta: "Thriller" },
        { label: "Paper Cities", meta: "Sci-fi" },
        { label: "Low Tide", meta: "Documentary" },
        { label: "Second Sun", meta: "Adventure" },
      ],
    },
  },
  ritup2: {
    blurb:
      "A music player that leans on the Deezer catalogue instead of hoarding its own library.",
    stack: [
      "Vue 3",
      "TypeScript",
      "Pinia",
      "Tailwind CSS",
      "Express",
      "reka-ui",
      "VueUse",
      "Vitest",
      "Playwright",
    ],
    accent: "#f0a63c",
    screen: {
      kind: "player",
      url: "ritup2.app",
      nav: ["Search", "Library", "Playlists"],
      headline: "Now playing",
      sub: "The Deezer catalogue, your library",
      items: [
        { label: "Nightdrive", meta: "Marta Vey" },
        { label: "Slow Signal", meta: "The Hours" },
        { label: "Cobalt", meta: "Ana Ruiz" },
        { label: "Undertow", meta: "Kite Machine" },
        { label: "Fieldnotes", meta: "Ada Lune" },
        { label: "Halflight", meta: "Orin Park" },
      ],
    },
  },
  LaraMovies: {
    blurb:
      "A movies site built on Laravel, quick to shape and easy to keep.",
    stack: [
      "Laravel 8",
      "Blade",
      "PHP",
      "Guzzle",
      "Laravel PWA",
      "PHPUnit",
    ],
    accent: "#ef6f5c",
    screen: {
      kind: "site",
      url: "larovies.app",
      nav: ["Movies", "Genres", "About"],
      headline: "Movies, sorted",
      sub: "A Laravel catalogue of films",
      items: [
        { label: "Amber Hours", meta: "2024" },
        { label: "The Quiet Room", meta: "2023" },
        { label: "Northbound", meta: "2024" },
        { label: "Salt and Iron", meta: "2022" },
        { label: "Winter Letter", meta: "2023" },
      ],
    },
  },
  Autonomies: {
    blurb:
      "Movies and series pulled from TMDB, with scraping where the API falls short.",
    stack: ["PHP", "Hack", "TMDB API", "Scraping", "CSS"],
    accent: "#5b9cf8",
    screen: {
      kind: "site",
      url: "autonomies.app",
      nav: ["Movies", "Series", "Episodes"],
      headline: "Movies and series",
      sub: "TMDB first, scraping for the rest",
      items: [
        { label: "Season One", meta: "Series" },
        { label: "The Long Return", meta: "Series" },
        { label: "Cold Open", meta: "Movies" },
        { label: "Blue Hour", meta: "Movies" },
        { label: "Last Broadcast", meta: "Movies" },
      ],
    },
  },
  Portafolio: {
    blurb:
      "The portfolio site of a hostel: the rooms, the photos and a way to write.",
    stack: ["HTML", "CSS", "JavaScript"],
    accent: "#7bc96f",
    screen: {
      kind: "site",
      url: "hostal.app",
      nav: ["Rooms", "Hostel", "Contact"],
      headline: "A place to stay",
      sub: "Rooms, photos and a booking form",
      items: [
        { label: "Shared room", meta: "6 beds" },
        { label: "Private room", meta: "2 beds" },
        { label: "Family room", meta: "4 beds" },
        { label: "Studio", meta: "2 beds" },
      ],
    },
  },
};

export const site = {
  owner: "Ulises-Perez",
  displayName: "Deus",
  domain: "ulises-perez.github.io",
  repo: "portfolio",
  roles: ["Web Developer", "Backend Developer", "Systems & Tools"],
  services: [
    {
      index: "01",
      title: "web development",
      visual: "browser",
      items: [
        "frontend",
        "backend",
        "cms integration",
        "custom sites",
        "web maintenance",
      ],
      note: "From the first commit to the deployment, in one stack.",
    },
    {
      index: "02",
      title: "automation & tooling",
      visual: "pipeline",
      items: [
        "automation",
        "ci pipelines",
        "internal tooling",
        "scripts and bots",
        "system services",
      ],
      note: "The parts that keep running when nobody is watching.",
    },
    {
      index: "03",
      title: "integrations & data",
      visual: "api",
      items: [
        "api integrations",
        "scraping",
        "scheduled jobs",
        "rest endpoints",
        "data cleanup",
      ],
      note: "Your product wired to the services it actually needs.",
    },
  ] satisfies Service[],
  contact: {
    github: "https://github.com/Ulises-Perez",
    // Leave empty to hide the address. Fill it to show a mail link.
    email: "ulisesalbertoperez15@gmail.com",
    // Discord handle. A username has no resolvable link on its own, so it is
    // shown as a handle to copy; fill discordUrl to link an invite instead.
    discord: "hdeusking",
    discordUrl: "",
  },
} satisfies {
  owner: string;
  displayName: string;
  domain: string;
  repo: string;
  roles: string[];
  services: Service[];
  contact: {
    github: string;
    email: string;
    discord: string;
    discordUrl: string;
  };
};

export type Site = typeof site;

/**
 * The sections of the page, for the navigation of the header and of the
 * footer. Both read the same list, so the index of the footer always points
 * at the sections the page really has.
 */
export const sections = [
  { href: "/#developer", label: "the developer" },
  { href: "/#works", label: "selected works" },
  { href: "/#services", label: "services" },
  { href: "/#contact", label: "contact" },
];

/**
 * The work of a repository that has no line written for it yet. It keeps the
 * page whole when a repository is featured before it is described here.
 */
export function defaultWork(
  name: string,
  summary: string,
  stack: string[],
): Work {
  return {
    blurb: summary || `The ${name} repository.`,
    stack,
    accent: "#8b9390",
    screen: {
      kind: "app",
      url: `${name.toLowerCase()}.app`,
      nav: ["Overview", "Library", "Settings"],
      headline: name,
      sub: summary,
      items: stack
        .slice(0, 3)
        .map((item) => ({ label: item, meta: "in use" })),
    },
  };
}
