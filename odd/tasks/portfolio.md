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
The page shows the featured repositories; the rest of the public inventory stays
in the snapshot and on GitHub, and is not listed on the page (L29).

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
the repositories that prove each one. The full public inventory is not listed
on the page (L29).

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

### S18 — One scroll swaps one project, full screen, anchored
The visitor moves between the featured projects with a single scroll, each one
filling the screen and landing on its anchor.

> "Que al navegar en cada work sea mediante un solo scroll hacia abajo para
> intercambiar entre works, pero este use toda la pantalla y que se ancle
> correctamente."

Resolved: the projects live in their own track, a scroll container that sticks
under the header and fills the rest of the screen, with mandatory snapping. A
wheel gesture is turned into a move of exactly one project, so the visitor
never lands halfway between two of them. The keyboard moves the same way, and
the index numbers jump to any project. At the last project the wheel is left
to the page, which carries on into the next section.

### S19 — The audits
The site is audited before it is published: the design critique of impeccable,
an independent technical audit, and a compliance pass against the Vercel Web
Interface Guidelines.

> "ok, haz revisiones o audita la web en busqueda de issuea que resolver,
> mejoras de optimizacion y rendimiento general para una mejor experiencia
> dentro de la web, ademas de hacer una auditoria de diseño con impeccable"

Resolved: three independent assessments, run as isolated sub agents so none of
them anchors the others: the design review, the technical audit of performance,
accessibility, semantics and SEO, and the mechanical compliance pass. The
impeccable detector ran on the changed files and found nothing.

### S20 — The performance budget
The page is measured, not guessed: the bytes of the export, the paint timings,
the layout shift and the size of the client bundle.

> "mejoras de optimizacion y rendimiento general para una mejor experiencia"

Resolved: the cover art is two paths instead of one rectangle per cell, the
snapshot carries one line per project instead of the whole readme, the project
data no longer crosses to the browser except the eight fields a panel shows,
and the works section is split so only its index and its wheel are client side.

### S21 — One voice, and no repetition
The site says the same thing once, and the sections that repeat each other go.

> "en la cual puedas rediseñar algunas secciones, quitar o agregar secciones las
> cuales no son necesarias o son repetitivas"

Resolved: the featured projects carry a line written for this site, the
repositories with nothing to say leave the page, the archive strip is gone
(L29), the toolbox that restated the services is gone, the footer carries the
section links, the hero says what can be hired, and the count of repositories
is said once.

### S22 — The page can be read without JavaScript
The navigation exists without the script that builds the menu.

> "todo lo demas"

Resolved: a `noscript` block in the header carries the five section links, the
page is described with structured data for the machines that read it, and a
link shared anywhere shows the site itself as the preview image.

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
| T17 | S18     | One scroll swaps one project, full screen, anchored              | inline | 4361e9c |
| T18 | S19     | Three isolated audits: design, technical and interface guidelines | agents | 100d31d |
| T19 | S20     | The performance budget: the cover art, the snapshot, the client boundary | inline | 442944f |
| T20 | S19     | The interface guidelines the audit found                        | inline | 2de3634 |
| T21 | S21     | One voice, the sections that repeat themselves cut             | inline | c70fb61 |
| T22 | S22     | Navigation without JavaScript, structured data, social preview | inline | 100d31d |
| T23 | S2, S12, S21 | The archive section leaves the page and the smoke test follows it | inline | eaac6b4 |

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

### L20 — Fifth request (verbatim)
"Que al navegar en cada work sea mediante un solo scroll hacia abajo para
intercambiar entre works, pero este use toda la pantalla y que se ancle
correctamente."

### L21 — Decisions taken for the fifth request
- The track is a scroll container of its own, `h-[calc(100svh-3.5rem)]` on
  mobile and `h-[calc(100svh-4rem)]` on desktop, so it fills exactly the
  screen under the fixed header. It sticks there, so the title scrolls away
  above it and every project lands on a full viewport.
- The panels are `h-[calc(100%-2rem)]`: the sticky index bar takes the other
  two rem, and the panel clears it, so a project is never cut by the bar and
  never spills past the bottom of the screen.
- A wheel gesture is intercepted and turned into a move of exactly one panel.
  Native snapping alone is not enough: a wheel tick is about a hundred pixels,
  so the browser would pull it back to the same project and the visitor would
  read the track as stuck.
- Until the track reaches its anchored position the wheel moves the page
  instead, because a wheel over a scroll container always moves that
  container, never the page.
- The project in view is the one that holds the middle of the track, not the
  last one that passed the top edge, which was one project behind.

### L22 — What was still wrong with the scroll
The visitor reported that the work was not shown correctly while scrolling, and
the capture showed a project cut in half with the index bar missing.

- The page could still scroll while the works were on screen, and the sticky
  track was released after a short distance, so the track left its anchored
  position with a project half out of the screen. The wheel handler moved to
  the window: while the track is on screen it owns the wheel, and the page
  keeps still, so the track cannot come unstuck.
- The swap itself was a smooth scroll, so there was a whole second where a
  project was travelling across the screen and was cut by the top edge. The
  swap is now instant and the project that arrives fades in over 240ms, so
  there is no intermediate state to catch.
- The page takes the wheel back at the first and the last project, so the
  section can be entered and left downwards.

### L23 — Verification of the fifth request
- `npm run typecheck` clean, `npm run build` and `npm run verify`: 40 export
  checks pass.
- Through the DevTools protocol: one wheel tick of a hundred and twenty
  pixels moved the track from project 01 to project 02, and the index bar
  followed.
- A wheel over the page margin, with project 02 on screen, left the page
  exactly where it was. The same wheel with the last project on screen moved
  the page by one tick.
- Captured at 1440x900 and 390x844 with the track anchored: the project
  fills the screen under the header, the index bar sits on its top edge with
  the right number and the right name, and nothing is cut.

### L24 — What the measurement really showed
The visitor said it was still not right, so the whole walk was measured in the
browser instead of assumed. The log said the track never anchored: its top sat
at -172px, the index bar was off screen and every project was cut.

The reason: the track was a sticky element as tall as the viewport, inside a
column barely taller than it. A sticky element that tall can only stay pinned
for a couple of hundred pixels, and after that it travels with the page. The
nested scroll container was the wrong model for this.

### L25 — The model that holds
- The projects live in the page flow again, each one a full screen, and the
  wheel moves the page from one project to the next. The page keeps the
  position, so there is no nested scroller to come unstuck and no trap to
  leave.
- The index bar is a small sticky element inside a column that is now very
  tall, so it stays pinned for the whole section.
- The wheel owns the works while they are on screen: a hundred and twenty
  pixels of travel buy the next project, a gesture under that threshold buys
  nothing, and a change of direction starts the count again.
- At the last project, and on a hard fling, the page takes over with a
  handover: the page scrolls to the end of the section, so the next one
  arrives whole instead of leaving a project half out of the screen.
- Scrolling up at the first project gives the page back, so the title above
  comes back into view.
- The page movements respect the motion preference, and the panels are snap
  targets, so a touch swipe lands on a project the same way the wheel does.

### L26 — Verification of the rework
- `npm run typecheck` clean, `npm run build` and `npm run verify`: 40 export
  checks pass, and the impeccable detector reports no findings on the changed
  files.
- A scripted walk in a real browser, at 1440x900 and at 390x844: every wheel
  tick moves exactly one project, every project lands seated at the anchor
  (the panel top is exactly the header plus the bar, 96px on desktop and 88px
  on mobile), the index bar keeps the right number and the right name, a
  gesture under the threshold moves nothing, a fling hands the page over, and
  the last project hands the page to the next section.

### L27 — The audits, and what they changed
Three assessments ran as isolated sub agents, so none of them anchored the
others: the design review, the technical audit of performance, accessibility,
semantics and SEO, and the compliance pass against the Vercel Web Interface
Guidelines. The impeccable detector ran afterwards and found nothing.

What the measurements said, before any change:
- The exported page weighed 179 kB because the cover art was one rectangle per
  cell. It now weighs 130 kB, and the client bundle of the page went from 25.6
  kB to 8.6 kB, with none of the thirteen repositories in it.
- The headline was invisible for almost a second because the entrance
  animation animates the opacity from zero. The letters now move without
  hiding the text, so the largest contentful paint is not held back.
- A link shared anywhere showed a blank card: there was no preview image.
  There is one now, drawn with the site own palette and type.
- The wheel swallowed a pinch to zoom inside the works, the menu overlay let
  the focus walk behind it, the ticker could not be stopped with the keyboard,
  the theme toggle read light on a dark first paint, and the borders of the
  buttons were at 2.7 to one where a control needs three.

What the design review said:
- The featured projects spoke with their authors voice, sometimes in another
  language, on a site that speaks in one. They have a line written for the
  site now, and the readme only fills the gap.
- Two of the eight featured repositories had nothing to say, and two of the
  thirteen were noise. The first two left the full screens for the archive
  and the second two left the list.
- The repository count was said six times and the languages five ways. The
  count is said once now, the stack section is only the measured usage, and
  the footer carries the section links so the site can be navigated without
  opening the menu.

### L28 — The rules the audits wrote down
- A static export is read by two engines: the browser parses the markup and
  the flight payload carries the same tree again. Rendering the panels on the
  server doubles their markup in the payload, so the panels are client
  components that receive only the fields they show.
- A sticky element as tall as the viewport cannot stay pinned inside a
  column barely taller than it. The index bar is small and the column below
  it is tall, so it holds for the whole section.
- The Tailwind v4 translate utilities use the `translate` property, so a
  hover rule written with `transform` does not reset them. That was the reason
  the button read as empty.

### L29 — Sixth request (verbatim)
"Quitar la seccion de thearchive abajo de los works [captura de la sección
"the archive" al final de los works, en tema oscuro, con los 13 repositorios
públicos en la grilla]."

### L30 — Decisions taken for the sixth request
- The archive is not rendered any more: the component and its import are gone.
- The archive was never a project panel, so it never had an anchor. The wheel
  still walks the six featured projects, and the handover to the services
  section happens at the end of the last panel.
- The fallback copy of the works section no longer points at an archive that
  does not exist.
- The snapshot and the sync script do not change. The smoke test still checks
  that the snapshot matches the profile, and the repositories that are not
  featured stay in the snapshot and on GitHub.

### L31 — Verification of the sixth request
- RED first: the new check failed on the previous export with "the archive
  section is not rendered".
- `npm run typecheck` clean, `npm run build` and `npm run verify`: 32 export
  checks pass.
- In the browser, through the DevTools protocol at 1440x900: the text and the
  HTML carry no "the archive", the six panels are still there, the works
  section ends exactly where the last panel ends (6402px) and the services
  section starts at the same point, so no empty band is left behind.
- One wheel tick on the last project hands the page to the services section
  (scrollY 5596 to 6402, the services heading at the top of the viewport).
- Seen while checking and not caused by this change: the dev overlay reports
  a hydration mismatch in the theme toggle, the server renders "light" and the
  client "dark". It predates this work and was left alone.
- `next build` and `next dev` share `.next/`: a build while the dev server
  runs breaks it with a MODULE_NOT_FOUND, so the dev server was restarted
  after the build.

### L32 — Risk
- T23: `Risk: item 3 (contracts others consume)` — the export smoke test
  changes what the page owes, and the deploy workflow runs it, so the new rule
  (the featured repositories are listed, the archive is not) is part of the
  deployment contract. Covered by the checks in L31.

### L33 — What came later
- The "my stack." section was removed from the page: the technologies it measured are
  in the services, where they are a promise, and the count of languages and the size of
  the account are in the developer section. The header and the footer read one list of
  sections, so the index of the footer always points at the sections the page has.
- The hydration error of the theme toggle, seen in L31, is fixed: the label of the button
  and the position of its switch are drawn by the stylesheet from the theme the document
  already carries, so the server does not have to know it.
- The page always opens at the top: the browser no longer brings back the place it was
  left at.
