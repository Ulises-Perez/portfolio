export type Service = {
  index: string;
  title: string;
  items: string[];
  /** One line that says what this service is for. */
  note: string;
  /** Languages that count as proof for this service. */
  stack: string[];
};

/**
 * One line per featured project, written for this site. The readmes are
 * written by their authors, in their own voice and sometimes in another
 * language; a portfolio speaks with one voice, so the featured projects get
 * their line here and the readme only fills the gap.
 */
export const summaries: Record<string, string> = {
  nexo: "A monorepo with three parts: a REST and WebSocket API, a cross platform desktop client and a cloud service.",
  vumies: "A streaming platform built with Vue 3, TypeScript, Vite and Tailwind CSS.",
  ritup2: "A music player built with Vue 3, TypeScript and Tailwind, on top of the public Deezer catalogue API.",
  LaraMovies: "A movies site built with Laravel and Blade.",
  Autonomies: "A movies and series page that runs on its own, with the TMDB API and scraping.",
  Portafolio: "The portfolio site of a hostel.",
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
      items: [
        "front end",
        "back end",
        "cms integration",
        "custom sites",
        "web maintenance",
      ],
      note: "From the first commit to the deployment, in one stack.",
      stack: ["Vue", "TypeScript", "HTML", "CSS", "SCSS", "PHP", "Blade"],
    },
    {
      index: "02",
      title: "systems & tooling",
      items: [
        "rust services",
        "lua game scripts",
        "python automation",
        "shell tooling",
        "ci pipelines",
      ],
      note: "The parts that keep running when nobody is watching.",
      stack: ["Rust", "Lua", "Shell", "Hack", "Python"],
    },
    {
      index: "03",
      title: "data & integrations",
      items: [
        "third party apis",
        "scraping",
        "scheduled jobs",
        "rest endpoints",
        "data cleanup",
      ],
      note: "Your product wired to the services it actually needs.",
      stack: ["Python", "PHP", "Shell", "TypeScript"],
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
