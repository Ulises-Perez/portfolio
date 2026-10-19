# Portfolio — GitHub-powered, mijobello-inspired

Feature: a personal developer portfolio site that pulls every public repository and the
technologies used across them from the GitHub API, with a layout and visual language
inspired by https://mijobello.com.

Stack: Next.js 15 (App Router) + Tailwind v4, static export, deployed to GitHub Pages.

## Specs

### S1 — Location
The portfolio lives in a folder inside the workspace directory.

> "Quiero hacer mi portafolio en una carpeta dentro de esta"

Resolved: `C:/Users/ulise/OneDrive/Documentos/Pogramming/Proyectos/portfolio/`, its own
Git repository (the parent directory belongs to the `C:\Users\ulise` home repository,
which must not receive these commits).

### S2 — GitHub connection, all public repositories
The site connects to GitHub and exposes every public repository of the account.

> "quiero ver si te puedes conectar a github para que tengas todos mis repos publicos"

Resolved: authenticated `gh`/HTTPS access to account `Ulises-Perez`; 15 public
repositories. A sync script downloads repository metadata, per-repository language
byte counts and README text into a committed snapshot consumed at build time.

### S3 — All technologies used
The technologies used across the repositories are shown.

> "ademas de todas las tecnologias uasdas"

Resolved: aggregated from the GitHub `languages` endpoint per repository, so the stack
section reflects real usage. Measured languages: TypeScript, Vue, Rust, Lua, Python,
JavaScript, PHP, Blade, HTML, CSS, SCSS, Shell, Hack.

### S4 — Design inspired by mijobello.com
The visual language follows the reference site.

> "quiero un portafolio con un diseño inspirado en este mijobello.com"

Resolved, measured from the reference CSS:
- Palette, light theme: background `#b2c7ab` (brand-cream), ink `#6a0c06`
  (brand-primary). Dark theme inverts the pair.
- Typeface: Space Grotesk. Global `border-radius: 0`.
- Layout: 4-column grid on mobile, 12 columns on desktop, hairline borders at 50%
  opacity, plus a fixed 12-column background rule overlay.
- Fixed header with a scrolling marquee strip, a light/dark toggle and a menu button.
- Section rhythm: full-bleed hero, then a narrower inset column holding
  "the developer." / "selected works." / "my services." / "want to chat?".
- Typography: display sizes up to `clamp(3.5rem, 22vw, 17rem)`, tracking `-0.13em`.

### S5 — Stack
Next.js 15 + Tailwind v4, static export (`output: "export"`) for GitHub Pages.

### S6 — GitHub data delivery
Snapshot at build time plus a sync script.

> "Stack: Next.js 15 + Tailwind v4 / Datos: Snapshot en build + script sync"

Resolved: `npm run sync:github` refreshes `data/github.json`; the site reads that
committed file. No runtime GitHub call, no rate limit, curated inclusion list.

### S7 — Identity and language
GitHub profile as identity, site copy in English.

> "Identidad: Perfil GitHub, textos en inglés"

Resolved: name and avatar from the GitHub profile, copy in English.

### S8 — Deployment
GitHub Pages.

> "Deploy: GitHub Pages"

Resolved: GitHub Actions workflow building the static export and publishing it to
`Pages`, served from the repository sub-path.

## Tasks

| ID  | Specs   | Task                                                             | Route  | Commit |
| --- | ------- | ---------------------------------------------------------------- | ------ | ------ |
| T1  | S5      | Scaffold Next.js 15 + Tailwind v4, static export config           | inline | —      |
| T2  | S2, S3  | GitHub sync script and committed `data/github.json` snapshot      | inline | —      |
| T3  | S4      | Design tokens, grid overlay, fixed header, theme toggle           | inline | —      |
| T4  | S4      | Hero: display type, role rail, visual block, intro overlay        | inline | —      |
| T5  | S2, S4  | "the developer." bio and "selected works." project rail          | inline | —      |
| T6  | S3, S4  | "my stack." technologies, "want to chat?" CTA, footer             | inline | —      |
| T7  | S8      | GitHub Pages workflow, base path, build verification              | inline | —      |
| T8  | S4      | SEO metadata, responsive and accessibility polish, README         | inline | —      |

Work-unit commits are cut per task group (~400 authored changed lines max per commit)
on the feature branch `feature/portfolio`.

## Log

### L1 — Original request (verbatim)
"Quiero hacer mi portafolio en una carpeta dentro de esta, pero quiero ver si te puedes
conectar a github para que tengas todos mis repos publicos ademas de todas las
tecnologias uasdas, quiero un portafolio con un diseño inspirado en este mijobello.com"

### L2 — Decisions taken from the user
- Stack: Next.js 15 + Tailwind v4
- Datos GitHub: Snapshot en build + script sync
- Identidad: Perfil GitHub, textos en inglés
- Deploy: GitHub Pages

### L3 — Evidence collected
- `gh auth status`: authenticated as `Ulises-Perez` with `repo` scope.
- `gh api users/Ulises-Perez`: 15 public repositories, profile name "Deus".
- Per-repository `languages` endpoints: byte counts per language (see S3).
- Reference CSS `https://mijobello.com/_next/static/chunks/11~woeg0ecduo.css`:
  `--color-brand-cream:#b2c7ab`, `--color-brand-primary:#6a0c06`,
  `--color-brand-dark:#1a1512`, `:root[data-theme=dark]` inverts cream/primary,
  `Space Grotesk` as the only family, global `border-radius:0!important`.
