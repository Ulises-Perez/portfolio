# Portfolio

A personal developer portfolio generated from a GitHub account. Every public
repository, its language breakdown and its README excerpt are read from the
GitHub API, stored in a committed snapshot and rendered as a static site.

- **Stack**: Next.js 15 (App Router), Tailwind v4, TypeScript, static export
- **Hosting**: GitHub Pages, published by GitHub Actions
- **Data**: build-time snapshot (`src/data/github.json`), no runtime API calls
- **Design**: inspired by [mijobello.com](https://mijobello.com) — one
  ink/surface color pair that inverts with the theme, a 12-column hairline
  grid, Space Grotesk, square corners

## Requirements

- Node.js 22.18 or newer. The export smoke test reads the site configuration
  directly, and Node strips the types of a `.ts` file from 22.18 on.
- A GitHub token for the sync script — `GITHUB_TOKEN` (or `GH_TOKEN`). Without
  a token the script falls back to the authenticated `gh` CLI.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script               | What it does                                                |
| -------------------- | ----------------------------------------------------------- |
| `npm run dev`        | Development server with hot reload                          |
| `npm run build`      | Static export into `out/`                                   |
| `npm run verify`     | Smoke test the export — run it after a build                |
| `npm test`           | Unit tests for the sync helpers                             |
| `npm run typecheck`  | `tsc --noEmit`                                             |
| `npm run sync:github`| Refresh `src/data/github.json` from the GitHub API          |

## How the data flows

1. `scripts/sync-github.mjs` reads the profile, the public repositories, the
   per-repository language byte counts and the README of every visible
   repository. `scripts/github-sync.config.json` decides what is visible and
   which repositories are featured.
2. The result is written to `src/data/github.json`.
3. The site reads that file at build time through `src/lib/github.ts`. The
   page shows the featured repositories; the rest of the public inventory
   stays in the snapshot and on GitHub. There is no request to GitHub while
   the site is being served, so there is no rate limit and no broken page
   when the API is down.
4. Every featured work also carries what the site says about it in
   `src/data/site.config.ts`: one line written in the voice of the site, the
   technologies and libraries it is built with, read from the manifests of
   the repository, and the drawn screen the frame shows.

The `Refresh the GitHub snapshot` workflow runs the sync every Monday and
commits the result, which triggers a new deployment.

## Customizing

| File                            | What to change                                              |
| ------------------------------- | ----------------------------------------------------------- |
| `src/data/site.config.ts`       | Name, roles, services, contact links, and the line, the stack and the screen of every featured work |
| `scripts/github-sync.config.json` | Owner, forks, ignored languages, featured repositories    |
| `src/app/globals.css`           | The palette: `--surface`, `--ink`, `--muted` and the theme flip |

## Deploying to GitHub Pages

1. Push the project to GitHub with `main` as the branch you deploy from.
2. `Deploy to GitHub Pages` (`.github/workflows/deploy.yml`) installs,
   tests, builds, runs the export smoke test and publishes the artifact. It
   enables Pages on the first run, so no manual setting is required.
3. The site is served from `https://<user>.github.io/<repo>/`. `next.config.ts`
   derives that prefix from `PORTFOLIO_REPO_NAME`, so renaming the repository
   does not break the asset paths.
4. Verify the export locally before publishing: `npm run build && npm run verify`.

## Accessibility notes

- A skip link, one `h1` per page and labelled sections.
- A visible focus ring on every interactive element, drawn in the current
  color so it stays legible on the inverted hover backgrounds.
- Muted text uses a dedicated color mix instead of opacity, which keeps the
  smallest labels above the WCAG AA contrast ratio on both themes.
- `prefers-reduced-motion` disables the marquee, the entrance animations and
  smooth scrolling. The works carousel keeps every piece of a work in place
  and drops the tilt of the frame.
- The works are pinned and moved by the scroll, so the section is reached with
  the keyboard like any other: the arrow keys walk the works one at a time.
- The menu overlay takes the focus when it opens and returns it on `Escape`.

## Project layout

```
src/app/          routes, layout, metadata, robots and sitemap
src/components/   the sections of the page
src/data/         site configuration and the GitHub snapshot
src/lib/          snapshot accessors and formatting helpers
scripts/          sync script, its unit tests and the export smoke test
```

## The works

The works are read sideways, one at a time. The section is pinned: the page
scrolls into it, the stage holds under the header, and the vertical scroll
travels the works sideways. A work fills the whole width and the whole height
of the section, so exactly one of them is on screen at a time.

The section opens. The work arrives at the width of the page — the same
column the rest of the site is built on — and it takes the whole width of the
screen as the visitor scrolls into it. The opening takes half the height of
the stage, and the works travel after it.

The rules of the page travel with it. The two vertical rules that hold the
column move out to the edges of the screen when a work breaks out of the
column, and they come back to the column when the section ends and the work
shrinks to the width of the page again. The movement is the scroll itself, so
it is smooth by construction: nothing is timed, everything follows the
visitor.

The frame of the product floats inside the work: it keeps its distance from
the top and the right, so it never sits in the corner of the screen and never
fights the opening.

One wheel gesture buys one work, the arrow keys move the same way, and past
the last work the page takes the wheel back and carries on into the next
section, so there is no scroll trap and no way to get stuck in the section.
Without JavaScript the works stack down the page, one under the other.

Every card shows the name of the work on the top left, the framed screen of
the product on the other side, and under the name the line written for this
site and the technologies it is built with. The script writes the position of
each card in the stage, and every piece of the card travels on its own as the
card reaches the middle. The animation is reversible.

None of the featured projects has a live deployment to photograph, so the
frame holds a drawn screen instead of a picture. It is built from the
identity of the project, weighs nothing, and never goes out of date.
