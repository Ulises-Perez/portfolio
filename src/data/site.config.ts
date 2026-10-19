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
    },
  ],
  contact: {
    github: "https://github.com/Ulises-Perez",
    // Leave empty to hide the address. Fill it to show a mail link.
    email: "",
  },
} as const;

export type Site = typeof site;
