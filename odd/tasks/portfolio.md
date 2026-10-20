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

### S9 — Smooth theme transition
The whole page transitions smoothly when the theme changes.

> "Quiero que tenga una animacion suave para que se cambie el theme la pagina completa"

Resolved: the theme still flips a single pair of CSS variables, but the flip runs
under a temporary class that transitions `background-color`, `color`,
`border-color`, `fill` and `stroke` for every element for ~420ms. The class is
removed afterwards so the rest of the motion system keeps its own timings.

### S10 — Hero without the rule noise
The hero bottom band carries fewer lines so the display type reads clean.

> "en el hero no tenga tantas lineas en esta parte [captura del hero en tema
> oscuro], para que visualmente sea mejor"

Resolved: the display word sits on a solid field, so the twelve column rules
stop crossing the letters; the role rail and the monogram lose one of their
internal borders. The grid overlay keeps working everywhere else.

### S11 — Works: one project at a time, navigated by scroll
Each featured project is shown on its own, without the dead text, and the
visitor moves between them by scrolling.

> "me gustaria mejorar la visualizacion del diseño respecto a como se muestran
> los proyectos dentro de works, me gusta pero hay mucho texto inexistente y que
> no sirve para nada, arreglalo y muestralos de mejor manera, de forma mas
> intuitiva, que se pueda apreciar de a una que se pueda navegar entre ellos,
> ejemplo mediante el scroll ir navegando entre ellos para bajar o salir de esa
> seccion"

Resolved: the README excerpt is dropped from the section. The featured
repositories become full panels in a vertical scroll-snap track, one at a time,
with a sticky index that names the project in view. Scrolling walks the
projects and, past the last one, leaves the section into the next one.

### S12 — The repositories section becomes services
The section stops repeating the projects and states what the visitor can hire.

> "tambien quiero que rediseñes el tema de como se muestran los repos, ya que
> realmente no muestra nada y estas mostrandolos nuevamente al igual que en
> works, es preferible algo como services que tipos de servicio puedo ofrecer"

Resolved: the section becomes "my services." with the three service groups and
the repositories that prove each one. The full public inventory stays visible
as a compact archive strip, so S2 still holds.

### S13 — Contact beyond GitHub
Email and Discord join GitHub as ways to start a conversation.

> "agregar para hablar conmigo no solo por github, sino tambien correo que es
> ulisesalbertoperez15@gmail.com, tambien por discord que es mi hdeusking"

Resolved: `site.contact.email` is filled in and `site.contact.discord` is added.
Both appear in the contact section and in the menu overlay. Discord is shown as
the handle with a copy action, because a username alone has no resolvable
Discord URL; `site.contact.discordUrl` can carry an invite link later.

### S14 — Buttons keep their label
A hovered button shows its label again instead of an empty box.

> "ademas de que el texto sube en cada button, pero este no se vuelve a mostrar
> mediante el hover o el click que sea igual que en button de change theme mode"

Resolved: the CTA rolls between two stacked labels exactly like the theme
toggle, so the text that leaves the top edge is replaced by the same text
coming from the bottom edge, and it rolls back on mouse out.

### S15 — Hero like the reference, with only the dividing lines
The hero follows the reference layout and carries no background rules.

> "Ademas que sea el hero casi identico que https://mijobello.com/, con menos
> lineas por detras en the hero, solo las que dividen"

Resolved: the hero section carries its own surface, so the fixed twelve column
overlay stops at its edges and only the borders that divide the blocks remain:
the rule under the media band, the rule before the role rail and the rule
before the monogram. The structure now matches the reference: the media band
on eight columns, the portrait on four, the display word on seven, the role
rail on three and the monogram on two.

### S16 — The button label keeps its contrast while it rolls
The call to action never shows an empty or unreadable label.

> "los botones tampoco estan correctamente corregidos, ya que el texto al subir
> no hace contraste y eso hace que el texto sea invisible a la vista de los
> usuarios"

Resolved: the label rolls down and out while its copy comes down from above,
the same move the theme toggle makes, and both travel the same distance so the
text stays whole during the roll. The clip sits on the content box, so the
resting button shows one label and nothing else.

### S17 — No background rules anywhere
The column rules disappear from the whole site, not only from the hero.

> "Las demas lineas de todo el bg en la demas web tambien quitarlas"

Resolved: the fixed twelve column overlay is removed from the layout. The page
keeps only the borders that divide blocks, which is the structure the sections
are built on. The hero no longer needs its own surface to hide the overlay,
but it keeps it so the media band and the display band read as one panel.

## Tasks

| ID  | Specs   | Task                                                             | Route  | Commit |
| --- | ------- | ---------------------------------------------------------------- | ------ | ------ |
| T1  | S5      | Scaffold Next.js 15 + Tailwind v4, static export config           | inline | —      |
| T2  | S2, S3  | GitHub sync script and committed `data/github.json` snapshot      | inline | —      |
| T3  | S4      | Design tokens, grid overlay, fixed header, theme toggle           | inline | —      |
| T4  | S4      | Hero: display type, role rail, visual block, intro overlay        | inline | —      |
| T5  | S2, S4  | "the developer." bio and "selected works." project rail          | inline | —      |
| T6  | S3, S4  | "my stack." technologies, "want to chat?" CTA, footer             | inline | —      |
| T7  | S8      | GitHub Pages workflow, base path, build verification              | inline | 2c98e91 |
| T8  | S4      | SEO metadata, responsive and accessibility polish, README         | inline | 6787b47 |
| T9  | S9, S14 | Theme transition and rolling CTA label                            | inline | e6a1739 |
| T10 | S10     | Hero: clean field for the display type, fewer rules              | inline | e6a1739 |
| T11 | S11     | Works: scroll-snap panels, one project at a time, no dead text   | inline | ddacd89 |
| T12 | S12     | "my services." section plus the compact repository archive       | inline | b50f50a |
| T13 | S13     | Contact: email and Discord, in the section and in the menu       | inline | 50b31fd |
| T14 | S2, S4  | Export smoke test follows the new section ids, full re-verification | inline | a0f5034 |
| T15 | S15, S16 | Hero like the reference with only the dividing lines, and a button label that keeps its contrast | inline | c9da266 |
| T16 | S17     | Remove the background column rules from the whole site            | inline | efeb3e1 |

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

### L4 — T7 evidence
- `npm test`: 7 unit tests pass (`scripts/sync-github.test.mjs`).
- `npm run typecheck`: clean.
- `npm run build` (Next.js 15.5.28, static export): 5 static pages, `out/`.
- `npm run verify`: 31 export checks pass (base path, sections, every repo and
  language from the snapshot present in the HTML).
- Commit `2c98e91` adds `.github/workflows/deploy.yml` and
  `.github/workflows/sync-github.yml`. The repository has no remote yet, so the
  first deploy needs one.

### L5 — T8 decisions
- Muted text stopped using `opacity-*` utilities. A 0.6rem label at 50% opacity
  measured 2.2:1 against the surface; the new `--muted` color mix
  (`color-mix(in srgb, var(--ink) 80%, var(--surface))`) measures 5.1:1 on the
  light theme and 4.8:1 on the dark one. Opacity is kept only for decorative
  art.
- The theme toggle exposes a single `aria-pressed` state; the visible word is
  the accessible name, so the label no longer contradicts the pressed state.
- The works rail uses `aria-pressed` instead of `aria-current`, which described
  a navigation state that never applies to a toggle.
- The menu overlay takes the focus when it opens, the header turns `inert` while
  it is open, and `Escape` returns the focus to the toggle.

### L6 — T8 evidence
- `npm test`: 7 pass. `npm run typecheck`: clean.
- `npm run build`: `out/` now carries `robots.txt` and `sitemap.xml`.
- `npm run verify`: 37 export checks pass, including the skip link, the
  canonical URL and the two new SEO files.

### L7 — Review status (not closed by a native review)
- `gentle_review assess` (range `d6c1421..HEAD`, escalated with item 5) returned
  `risk: high`, `reviewDue: true` and a plan that asks for an independent
  verifier.
- The independent verifier was refused by the runtime gate, which requires the
  delegated task to declare a named `Risk: item N`. It was not retried.
- Native START could not be started. Every attempt returned
  `lineage_created: false` and `mutation_performed: false`, so no review
  authority exists for this target and nothing is burned.
  - The facade input validation rejected the documented lens selection
    (`lenses-invalid`) and the committed-range acknowledgement
    (`committed-only-required`) while the very same JSON string was accepted by
    `assess`. The difference is how the harness delivers the tool argument:
    a compact JSON string loses its booleans and arrays on the way in, and a
    spaced JSON string keeps them. Worked around with a spaced string.
  - With the input accepted, the native START fails with `schema-incompatible`:
    the installed native binary (4.2.0) advertises the
    `gentle-ai.review-integration/v1` contract and the
    `gentle-ai.review-integration.start/v2` schema, while the facade drives the
    `v2` contract. Updating the managed native binary is a maintenance action
    on the maintainer's machine, outside this task.

### L8 — Verification that was performed instead
- `npm test` (7 unit tests for the sync helpers), `npm run typecheck`,
  `npm run build` (static export) and `npm run verify` (37 export checks).
- The two workflows were read line by line: artifact path `out/`, npm script
  names, `PORTFOLIO_REPO_NAME` reaching `next.config.ts`, token permissions
  (`pages: write`, `id-token: write`, `contents: write`), the snapshot commit
  touching only `src/data/github.json`.
- The first deploy itself is still unproven until the repository has a remote
  and the workflow runs on GitHub.

### L9 — Risk
- T7: `Risk: item 5 (delivery and environment)` — new GitHub Actions workflows
  that publish the site and push a refreshed snapshot to the default branch.
- T8: `Risk: item 3 (contracts others consume)` — the theme toggle and the
  works rail change their accessible name and state, and the shared
  `.eyebrow`/muted color tokens change every section. Both are covered by the
  checks listed in L8.

### L10 — Second request (verbatim)
"Quiero que tenga una animacion suave para que se cambie el theme la pagina
completa, ademas de que en el hero no tenga tantas lineas en esta parte
[imagen del hero en tema oscuro], para que visualmente sea mejor, ademas me
gustaria mejorar la visualizacion del diseño respecto a como se muestran los
proyectos dentro de works, me gusta pero hay mucho texto inexistente y que no
sirve para nada, arreglalo y muestralos de mejor manera, de forma mas
intuitiva, que se pueda apreciar de a una que se pueda navegar entre ellos,
ejemplo mediante el scroll ir navegando entre ellos para bajar o salir de esa
seccion. ademas de que el texto sube en cada button, pero este no se vuelve a
mostrar mediante el hover o el click que sea igual que en button de change
theme mode.

tambien quiero que rediseñes el tema de como se muestran los repos, ya que
realmente no muestra nada y estas mostrandolos nuevamente al igual que en
works, es preferible algo como services que tipos de servicio puedo ofrecer,
agregar para hablar conmigo no solo por github, sino tambien correo que es
ulisesalbertoperez15@gmail.com, tambien por discord que es mi hdeusking."

### L11 — Decisions taken for the second request
- The theme flip keeps a single pair of CSS variables. A `theme-flip` class
  goes on the root before the values change and comes off 460ms later, so the
  whole page travels and the rest of the motion keeps its own timings. The
  class is off under `prefers-reduced-motion`.
- The display word in the hero carries its own surface field, so the column
  rules stop at the letters. The monogram lost its left border.
- The featured projects are panels in the page scroll, not in a nested
  scroller, so there is no scroll trap: scrolling walks the panels and the
  page carries on into the next section. `scroll-snap-type: y proximity` on
  the root only affects those panels.
- A panel states one thing about the project: the first line of its README,
  when that line is about the project and not framework boilerplate, or the
  repository description. The 700 character README dump is gone.
- The services section no longer lists repositories. Each service shows its
  stack and how many public repositories run on it, and the whole inventory
  stays in the archive strip at the bottom of the same section, so S2 holds.
- Discord has no resolvable link from a username, so the handle is shown with
  a copy action. `site.contact.discordUrl` takes an invite link when there is
  one.

### L12 — Verification of the second request
- `npm test` (7 pass), `npm run typecheck` (clean), `npm run build` and
  `npm run verify`: 40 export checks pass, including the new `#services`
  section, the published email, the published Discord handle and the mail
  link.
- Checked in a real browser through the DevTools protocol, at 1440x900 and
  390x844, in both themes. Three defects were found that way and fixed: the
  panel title was hidden behind the sticky index bar, the rolling label left
  a second copy visible inside the button padding, and the services lists
  repeated the same repositories three times.
- The theme travel, the scroll snap and the button roll are motion: they
  were checked in the browser, not by the export smoke test.

### L13 — Third request (verbatim)
"Corrije el button de menu para que tenga las 3 barras y se visualice
correctamente

Ademas que sea el hero casi identico que https://mijobello.com/, con menos
lineas por detras en el hero, solo las que dividen, los botones tampoco estan
correctamente corregidos, ya que el texto al subir no hace contraste y eso
hace que el texto sea invisible a la vista de los usuarios."

### L14 — What the reference actually does
- The reference menu button ships three bars with no distinct positions: the
  first and the third land on the same line and only the middle one is
  offset. The three bars here are placed one at the top, one at the middle
  and one at the bottom, and fold into a cross when the menu opens.
- The reference hero is `flex flex-col`, the media band on eight columns with
  `md:min-h-[40svh]`, the portrait on four, and a second band with the
  display word on seven columns, the role rail on three and the branding mark
  on two, both with a left rule.
- The reference call to action rolls its label up and out, and brings a copy
  in from below with `absolute inset-0`. That copy is a flex box, so the
  padding stays on the button and the copy can be off by the padding, which
  is why the roll does not read cleanly there.

### L15 — Decisions taken for the third request
- The hero keeps its own surface background. The fixed column overlay sits
  behind everything, so an opaque hero is what removes the rules from behind
  the display word while leaving the borders that divide the blocks.
- The button label rolls down and out while its copy comes down from above.
  Both copies travel the same distance, so at any point of the roll the
  visible halves complete each other and the text is never cut in half.
- The clip moved from the button to the content box. With the padding on the
  button, the resting copy showed a sliver of the label inside the padding.
- Tailwind v4 moves elements with the `translate` property, not with
  `transform`. A hover rule written as `transform: translateY(0)` does not
  reset a `translate: 0 -100%` offset, which is why the incoming copy never
  arrived and the button read as empty. The rules now use `translate`.

### L16 — Verification of the third request
- `npm run typecheck` clean, `npm run build` and `npm run verify`: 40 export
  checks pass.
- The menu button was captured closed (three bars, evenly spaced) and open
  (a clean cross) through the DevTools protocol.
- The button was captured at rest, at the end of the roll and 210ms into it.
  The mid roll shows the whole word, the upper half from the outgoing copy
  and the lower half from the incoming one, with no gap and no loss of
  contrast.

### L17 — Fourth request (verbatim)
"Las demas lineas de todo el bg en la demas web tambien quitarlas"

### L18 — Decisions taken for the fourth request
- The `GridOverlay` component is deleted and the layout no longer renders it.
  The overlay was a fixed layer of twelve column rules behind the whole page;
  removing it leaves only the borders the sections draw themselves, which are
  the lines that divide the blocks.
- The hero keeps its own surface. It no longer hides the overlay, but with the
  media band and the display band on one surface the hero reads as a single
  panel instead of two floating blocks.

### L19 — Verification of the fourth request
- `npm run typecheck` clean, `npm run build` and `npm run verify`: 40 export
  checks pass.
- The exported HTML has no overlay markup left and the compiled CSS has no
  `z-index: -1` rule.
- The developer section and a works panel were captured in the browser: the
  only lines left are the ones that divide the blocks.
