export type Service = {
  index: string;
  title: string;
  items: string[];
  /** One line that says what this service is for. */
  note: string;
  /** Languages that count as proof for this service. */
  stack: string[];
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
