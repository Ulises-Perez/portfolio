# Works — horizontal carousel with product mockups

Feature: the works section stops being a vertical stack of full screen panels and becomes a
horizontal carousel the visitor swipes through, where every work shows its name, a framed
product mockup, a natural description and the technologies it is built with. The dark theme
surface moves from the red to `#0C0D0D` and the light theme stays as it is.

Stack: Next.js 15 (App Router) + Tailwind v4, static export, no new runtime dependency.

## Specs

### S1 — The dark surface is near black, the light surface does not move

> "vamos a configurar el color de bg a #0C0D0D como dark mode y el de light mode tal cual,
> se va el bg rojo, lo otro es mantener lo demas."

Resolved: `--surface` is `#0C0D0D` in `:root[data-theme="dark"]` and stays `#b2c7ab` in
`:root`. The red `#6a0c06` survives only as the light theme ink. The two places that carry
the theme color outside the stylesheet follow it: the `themeColor` viewport meta and the
inline script that applies the stored theme before the first paint, plus the constants the
theme toggle writes into the meta tag.

### S2 — The works are read sideways, one at a time, with the scroll held in place

> "en la seccion de works, quiero que la visualizacion sea diferente, sea mas intuitiva de
> forma que al realizar scroll puedas ir navegando por cada work de forma horizontal no
> vertical, esto añade un poco mas de exploracion dentro del portfolio"

> "Que al momento de scrollear al works, se quede fijado el scroll y mediante el mismo scroll
> naveges de forma individual por cada work, ya que este lo ideal es que use todo el ancho y
> alto de su seccion y solo se muestre 1 work por uno asi ir navegando"

Resolved: the works section is pinned. The page scrolls into it and the section stays in
place while the scroll travels the works sideways: the works are a horizontal track and
the vertical scroll moves it. Each work fills the whole width and the whole height of the
section, so one work is on screen at a time. The wheel moves one work per gesture, the
keyboard moves the same way, the index numbers jump to any of them, and past the last
work the page takes the wheel back and carries on into the next section. Without the
script the works stack down the page, one under the other.

### S3 — Every work opens with its name on the top left

> "cada que aparece un work este debe aparecer su nombre arriba a la izquierda con alguna
> animacion"

Resolved: the name sits on the top left of the card, in the display type, and it travels in
as the card reaches the middle of the scroller. The index of the work sits above it.

### S4 — The product arrives from the opposite corner, framed like a computer

> "del otro lado que aparezca desde la esquina una imagen, referencial del producto o work,
> que sea tipo con un border de pc tipo mac o demas el cual muestra la imagen del work"

Resolved: on the right half of the card there is a window frame with a title bar, three
traffic lights and an address bar, holding a synthetic screen of the product. The frame
arrives from the top right corner and settles into a slight three dimensional tilt, so the
row of works never reads as a flat line of rectangles.

### S5 — The description is natural, and the technologies follow it

> "con esto agregar bajo el nombre del repo o work, la descripcion de forma mas natural no
> tan detallada y abajo de esta descripcion las tecnologias, librerias y otros usados de cada
> work"

Resolved: under the name there is one short sentence in the voice of the site, written for
this site and not taken from the readme. Under the description there is the list of the
technologies and libraries the work is actually built with, read from the manifests of each
repository: `package.json`, `composer.json` and the languages endpoint. The old four line
stats block stays as a small meta row at the bottom of the card.

### S6 — Every piece arrives on its own

> "cada cosa con una animacion que sea por scroll hasta mantener una visual completa del
> work"

Resolved: the name, the description, the technology list, the meta row and the frame each
read the position of their card in the scroller and travel on their own, in order, as the
card comes to the middle. The animation is reversible: scrolling back returns the card to
the state it had. Under `prefers-reduced-motion` every piece is simply there.

### S7 — The work is not perfectly aligned

> "el work o imagen que este un poco ladeado tipo 3d en aspectos que no sea tan lineal para
> mantener una estructura un poco mas divertida."

Resolved: the frame tilts on the Y axis as its card moves away from the middle, and the
cards lift a little on a curve. The tilt lives on the frame and not on the text, so the
name and the description stay readable.

### S8 — The screen inside the frame is a mockup, not a photograph

> "una imagen, referencial del producto o work"

Resolved: the six repositories have no live deployment (`ulises-perez.github.io/<repo>`
answers 404 for every one of them) and no screenshot in their own tree, so there is nothing
to photograph. The frame holds a drawn screen instead, built from the identity of the
project: its own accent color, its own navigation, its own content blocks. It is drawn, so
it weighs nothing and it is honest about what it is.

### S9 — The whole thing is reviewed, not shipped on faith

> "Todo esto hazlo con impeccable y ego lite para revisar absolutamente todo, puedes buscar
> referencias, ejemplos y demas para aplicarlos aca, ademas de uso de librerias etc."

Resolved: the browser checks are done with ego lite, on a desktop and on a phone, in both
themes, with the carousel scrolled by hand. The impeccable detector runs over the changed
files. The references behind the model were read before writing: the sticky pin and the
`translateX` track are the standard horizontal gallery, but the pinned model was rejected in
favour of the native carousel the visitor chose, and the CSS scroll driven animations are
not usable because Firefox does not support them.

### S10 — The section opens, and the works carry no navigation of their own

> "Quiero que quites nav de los works porque repite muchas cosas, al momento de entrar a
> los works que sea mediante una animacion de apertura, osea que primero este todo en el
> mismo ancho de la pagina, y cuando bajes este se desplace y use todo el ancho nuevamente
> para que se super intuitivo."

Resolved: the index bar of the works is gone: the numbers, the counter, the arrows and
the label. The scroll itself is the navigation, and it still buys one work per gesture.
The section opens instead: the work arrives at the width of the page, the same column the
rest of the site is built on, and it takes the whole width of the screen as the visitor
scrolls into it. The opening takes half the height of the stage, and the works travel
after it.

### S11 — The works carry the rules of the page, and the rules travel

> "pero que tambien este con lineas divisoras el work, despues que estan pasen a las
> esquinas y despues vuelvan cuando se achica al bajar de works o terminar esa seccion, que
> sea mediante una animacion suave."

Resolved: the works carry the rules of the page. Two vertical rules hold the column the
site is built on, and they travel with the work: when a work breaks out of the column to
take the whole width of the screen, the rules go with it to the edges of the screen, and
they come back to the column when the section ends and the work shrinks to the width of
the page. The movement is the scroll itself, so it is smooth by construction: nothing is
timed.

The frame of the product floats: it does not sit in the corner of the work, so it does not
fight the opening when the work takes the whole screen.

## Tasks

| ID  | Specs                | Task                                                                     | Route  | Commit |
| --- | -------------------- | ------------------------------------------------------------------------ | ------ | ------ |
| T1  | S1                   | The dark surface moves to `#0C0D0D`, light surface untouched             | inline | 1f5506b |
| T2  | S5, S8               | The works carry their own voice, their stack and their screen            | inline | dc4dc80 |
| T3  | S3, S4, S6, S7       | The framed product screen, drawn from the identity of the project         | inline | 675e94c |
| T4  | S2, S3, S5, S6, S7   | The pinned carousel: the card, the runway, the stage and the index       | inline | fc368cd |
| T5  | S2                   | The section shell and the page wiring; the panels and the old nav are gone | inline | fc368cd |
| T9  | S2                   | The scroll model corrected: the section is pinned and the travel is driven by the scroll | inline | fc368cd |
| T10 | S10                  | The navigation of the works is out and the section opens from the width of the page | inline | 48abb5f |
| T11 | S11                  | The rules of the page travel with the work: they hold the column and go to the edges of the screen | inline | 469bf18 |
| T12 | S1                   | The toggle of the theme stops breaking the hydration of the page            | inline | 5678b61 |
| T13 | S1                   | The stack section is out, the discord button is fixed, the footer is indexed and the page opens at the top | inline | 9a50660 |
| T14 | S1                   | The services carry only their number and what they offer, and the contact section closes | inline | 081499a |
| T15 | S1                   | The footer says the name, big and in the middle, and nothing else           | inline | —      |
| T6  | S2, S3, S6           | The export smoke test follows the new section                             | inline | f449cb5 |
| T7  | S9                   | The review with ego lite and the impeccable detector                      | inline | fc368cd |
| T8  | S2, S8               | The README describes what the section is now                               | inline | 5ab0f4d |

Work-unit commits are cut per task group (~400 authored changed lines max per commit)
on the feature branch `feature/portfolio`.

## Log

### L1 — Original request (verbatim)
"Vamos a realizar ciertos cambios en el diseño, primero es que vamos a configurar el color
de bg a #0C0D0D como dark mode y el de light mode tal cual, se va el bg rojo, lo otro es
mantener lo demas.

En la seccion de works, quiero que la visualizacion sea diferente, sea mas intuitiva de
forma que al realizar scroll puedas ir navegando por cada work de forma horizontal no
vertical, esto añade un poco mas de exploracion dentro del portfolio, cada que aparece un
work este debe aparecer su nombre arriba a la izquierda con alguna animacion, del otro lado
que aparezca desde la esquina una imagen, referencial del producto o work, que sea tipo con
un border de pc tipo mac o demas el cual muestra la imagen del work, con esto agregar bajo
el nombre del repo o work, la descripcion de forma mas natural no tan detallada y abajo de
esta descripcion las tecnologias, librerias y otros usados de cada work, cada cosa con una
animacion que sea por scroll hasta mantener una visual completa del work, el work o imagen
que este un poco ladeado tipo 3d en aspectos que no sea tan lineal para mantener una
estructura un poco mas divertida."

### L2 — The review request (verbatim)
"Todo esto hazlo con impeccable y ego lite para revisar absolutamente todo, puedes buscar
referencias, ejemplos y demas para aplicarlos aca, ademas de uso de librerias etc."

### L3 — Decisions taken from the user
- The image inside the frame is a generated product mockup, not a photograph: there is
  nothing to photograph, and a mockup weighs nothing.
- The section is a native horizontal carousel with swipe, not a pinned section where the
  vertical scroll moves the rail sideways.

### L4 — Evidence collected
- `ulises-perez.github.io/<repo>` answers 404 for nexo, vumies, ritup2, LaraMovies,
  Autonomies and Portafolio: there is no live deployment to capture.
- No repository carries a screenshot: `Portafolio/img` is empty, `vumies/public` holds a
  vite logo, `ritup2/public` a favicon, and the readmes only link to the Laravel logo.
- The stack of each work is read from its own manifests, not guessed:
  nexo (Express, Socket.IO, Prisma, Redis, Zod, JWT, Tauri, Vue, TypeScript, Rust,
  Cloudflare Workers), vumies (Vue 3, Vue Router, Pinia, Tauri, Tailwind CSS, Vite,
  TypeScript), ritup2 (Vue 3, Pinia, Tailwind CSS v4, reka-ui, VueUse, Express, Vitest,
  Playwright, axios), LaraMovies (Laravel 8, Blade, Guzzle, PHPUnit, Laravel PWA),
  Autonomies (PHP, Hack, TMDB, scraping), Portafolio (HTML, CSS, JavaScript).

### L5 — What the references said
- The horizontal gallery is built in two ways: a sticky section that travels sideways with
  the vertical scroll, or a native horizontal scroller with snap. The visitor chose the
  second one.
- CSS scroll driven animations (`animation-timeline: view()`) are not an option: Chrome and
  Safari support them, Firefox does not.
- The browser frame with three traffic lights and an address bar is the standard way to
  show a web product in a portfolio.
- The page already inverts a single pair of colors when the theme flips, so the near black
  surface is one value in one place and everything else follows.

### L6 — Risk
- T6: `Risk: item 3 (contracts others consume)` — the export smoke test says what the page
  owes, and the deploy workflow runs it, so the new section is part of the deployment
  contract. Covered by the checks in the log of this feature.

### L7 — The scroll model, corrected (verbatim)
"Que al momento de scrollear al works, se quede fijado el scroll y mediante el mismo scroll
naveges de forma individual por cada work, ya que este lo ideal es que use todo el ancho y
alto de su seccion y solo se muestre 1 work por uno asi ir navegando."

### L8 — What the correction changed
- The native horizontal carousel is gone. The works section is pinned: the stage sticks
  under the header and the vertical scroll travels the works sideways.
- The runway is as tall as the section needs: one stage per work. The stage is a sticky
  element of the height of the screen under the header, so it holds for the whole
  section, which is the mistake the old vertical version made.
- A work fills the whole width and the whole height of the section, so one is on screen
  at a time. The frame grows with it and the name keeps the top left.
- The wheel is turned into a move of exactly one work, the way it was before: the
  gesture buys one work, a gesture under the threshold buys nothing, and a change of
  direction starts the count again. Past the last work the page takes the wheel back.
- The travel itself is driven by the scroll position, so the track follows the page
  exactly and the works slide into place instead of jumping.
- The index bar lives inside the pinned stage, so it stays with the works while the page
  travels.
- Without the script the works stack down the page, one under the other.

### L9 — What the browser said
Measured in ego lite, at 1440x900 and at 390x844, in both themes.

- The runway is 4800px tall for six works, the stage is 800px, and the stage pins at
  64px from the top: the header height. One wheel gesture of 140px moved the page from
  2088 to 2888, the travel from 0 to 0.2, and the work from `nexo` to `vumies`: one
  gesture, one work.
- A work is 1425px wide, the whole width of the screen, and the cards sit two half
  widths apart, so exactly one of them is in view.
- At the middle of a travel the frame of the work that leaves is still on the screen
  while the name, the description and the technologies of the work that arrives come in
  one after the other, the chips last: the stagger reads.
- The first pass measured the opacity of the name and found 1 on every card. The
  opacity is on the block that holds the name, not on the name, so the fade was working
  all along: the cards that are far from the middle measure 0.
- The dev overlay reports one issue and it is a 404 for `/favicon.ico`, the request the
  browser makes on its own. It predates this work and does not reach the export.

### L10 — Two mistakes the measurements caught
- The wheel did nothing for the first pass. The range the wheel answers to started at
  the top of the runway, but the stage holds under the header, so the section was
  already pinned 64px before the range opened. The geometry now reads the offset the
  stage sticks at and the range opens there.
- The first gesture jumped from the first work to the last. The travel was divided by
  the distance of one work instead of by the whole travel of the runway, so the track
  reached the end of the rail after one work. The geometry now keeps the whole travel
  and the share of each work apart.

### L11 — Risk
- T4, T5: `Risk: item 3 (contracts others consume)` — the works section changes what the
  page owes: the export smoke test now names the classes of the new section and the
  content of every work, and the deploy workflow runs that test. Covered by the checks
  in L12.

### L12 — The final verification
- `npm run typecheck`: clean, no diagnostics.
- `npm test`: 10 of 10.
- `npm run build`: 8 of 8 static pages, the page is 4.25 kB and the export is 128 kB.
- `npm run verify`: 56 export checks pass, including the sixteen new ones.
- The impeccable detector over the changed files: no findings.
- In ego lite, at 1440x900 and at 390x844, in both themes: the stage pins at 64px, one
  work fills the screen, one gesture of the wheel buys one work, the pieces of the work
  arrive in order and the frame keeps its tilt.
- On a short phone the whole work has to fit: the card was measured at 375x667, at
  390x844 and at 360x640. The call to action was cut off by the bottom of the screen on
  the two shorter ones, and the card is compact now: a smaller frame, a smaller call to
  action. The call to action ends 52, 52 and 16 pixels above the bottom of the screen on
  the three.
- The wheel was swallowing the gesture under the threshold at the first and the last
  work, where the page has to take it back. The target is checked before the threshold
  now.
- The cards that are not in view are `inert`, so the keyboard does not walk into a link
  nobody can see.

### L13 — The commits
Six work units on `feature/portfolio`: `1f5506b` the palette, `dc4dc80` the content of
the works, `675e94c` the drawn screens, `fc368cd` the pinned section with the card and
the wiring, `f449cb5` the smoke test, `5ab0f4d` the README and this document.

The pinned section is one work unit and not three: the card, the runway, the styles and
the wiring have to land together or the page does not build.

### L14 — The independent verification
An independent verifier read the committed range and ran the gates. Its verdict: safe to
deliver, nothing blocking. It found two things worth fixing and three worth noting.

- The checks about the description and the technologies of every work read the raw
  export, and the flight payload carries the props of the client components inside it. A
  page with the chips taken out of the markup still passed them. The export is now read
  without its script blocks for every check about what the page shows, and a new check
  counts the chips: one for every technology of every work. Breaking the markup now
  fails the test: the count goes from 40 to 0.
- The script reads the site configuration directly, and Node strips the types of a
  `.ts` file from 22.18 on. The floor is written down in the engines field and in the
  README.
- A fling was buying several works, because the count restarted after every purchase. A
  gesture is a burst of wheel events now, and it is the one that buys the work: a fling
  of six events moved the page one work.
- A phone in landscape was cutting the frame off the bottom of the screen. A screen too
  short to hold a work stacks the works, whatever its width.
- The spec said the works lift a little on a curve and the stylesheet did not. It does
  now: the card away from the middle drops, and the row reads as a curve.
- The `inert` attribute only exists once the script runs, so between the first paint and
  the first measurement the keyboard can reach a card that is not in view. The script
  cannot know the geometry before the page is painted.

### L15 — The navigation of the works is out, and the section opens (verbatim)
"Quiero que quites nav de los works porque repite muchas cosas, al momento de entrar a
los works que sea mediante una animacion de apertura, osea que primero este todo en el
mismo ancho de la pagina, y cuando bajes este se desplace y use todo el ancho nuevamente
para que se super intuitivo."

### L16 — What changed
- The index bar of the works is gone: the numbers, the counter, the arrows and the
  "scroll to browse". The scroll is the navigation, and the wheel still buys one work per
  gesture. The keyboard still walks the works, and the work in view is counted from the
  travel instead of from a bar.
- The card is now the box the layout measures, and the work opens inside it: the inner
  goes from the width of the page to the whole width of the screen. The travel of the
  works does not depend on the opening, because the card keeps its place in the track.
- The width of the page is the column the rest of the site is built on: ten of the twelve
  columns, 83.33% of the screen on the desktop and 92% on a phone.
- The opening takes half the height of the stage, and the works travel after it, so the
  wheel answers only once the work is open.
- Measured at 1440x900: at the anchor the work is 1187px wide, 83.33% of the 1425 of the
  screen; 200px into the opening it is 1301; at 400px it is 1415; at the end the whole
  1425. A gesture after the opening moves the travel from 0 to 0.2, one work.

### L17 — The rules of the page (verbatim)
"pero que tambien este con lineas divisoras el work, despues que estan pasen a las
esquinas y despues vuelvan cuando se achica al bajar de works o terminar esa seccion, que
sea mediante una animacion suave."

### L18 — What changed
- Two vertical rules hold the column the site is built on, and they travel with the work:
  they sit on the edges of the column while the work is narrow and they go to the edges
  of the screen when the work takes the whole width.
- The closing: when the section ends the work shrinks back to the width of the page and
  the rules come back to the column. The runway grew half a stage for it.
- The frame floats: 24px away from the top and the right of the work, so it does not sit
  in the corner and does not fight the opening. The arrival from the corner travels less
  far for the same reason and stays inside the screen.
- Nothing is timed. The rules follow the same number the work does, so the movement is
  the scroll itself and it is smooth by construction.
- Measured at 1440x900: the left rule sits at 119px with the work narrow, at 0px when
  the work is open, halfway back at 59px while the section leaves, and at 119px again.
  On a phone, at 16px, then 0px, and back. The frame keeps 47px of air to the right edge
  when the work is open, and 16px while it arrives.

### L19 — The hydration error of the theme toggle, fixed (verbatim)
"Corrije este error: ## Error Type Recoverable Error ## Error Message Hydration failed
because the server rendered text didn't match the client. As a result this tree will be
regenerated on the client. [...] + aria-pressed={true} - aria-pressed="false" [...] + dark
- light"

### L20 — What the error was, and why it happened
- The toggle read the theme from the document in the initializer of its state, so the
  server rendered "light" and the browser rendered "dark" whenever the visitor had chosen
  the dark theme. The tree was regenerated on the client every time.
- The theme of the page lives in the document: the script in the layout applies the stored
  theme before the first paint. The label of the button and the position of its switch are
  drawn by the stylesheet from that theme now, so the server does not have to know it and
  the visitor never reads a label that is about to change.
- The state carries only what the button announces, and it starts on the value the server
  rendered, so the markup the server sent and the first paint of the browser are the same
  thing.
- The roll of the label still works: the two copies keep their place and the stylesheet
  decides which one reads "light" and which one reads "dark". Verified: without hover the
  outgoing copy sits in place and the incoming one is above it; on hover the outgoing one
  rolls down and the incoming one arrives; leaving puts them back.
- Verified in the browser in both themes: the dev overlay has nothing to say, there is no
  error in the console, the label reads the theme from the first paint, and the click
  still flips the theme, the stored value and the color of the browser chrome.

### L21 — Risk
- T12: `Risk: item 3 (contracts others consume)` — the button announces its state with
  `aria-pressed`, and the state it announces has to be the real one. Covered by the
  measurements in L20.

### L22 — The sections of the page (verbatim)
"My stack se va quitalo por completo y corrije el buttonm de discord, cambia de my services
a services y obviamente indexa correctamente el footer con la pagina, ademas de cuando se
recargue la pagina siempre esta inicie desde arriba, no donde quedo."

### L23 — What changed
- The "my stack." section is gone: the component, the place it had in the page and its
  place in the navigation. The technologies it measured are still in the services, where
  they are a promise, and the count of languages and the size of the account are still in
  the developer section.
- The button of Discord was broken: the copy button did not have the clip that keeps
  the second copy of the label inside it, so the label that rolls in floated above the
  button. It has the same clip the other buttons of the site have.
- "my services." is now "services.", in the section and in the navigation.
- The header and the footer read the same list of sections, so the index of the footer
  always points at the sections the page really has. The list lives in the site
  configuration and has four entries: the developer, the selected works, the services and
  the contact.
- The page always opens at the top: the browser no longer brings back the place the page
  was left at, and the page is at the top before the first paint.

### L24 — What was measured
- The footer carries four links and the page has four sections, and they are the same
  four: the developer, the selected works, the services and the contact.
- The title of the services section reads "services." and there is no section with the
  stack any more.
- A reload from the middle of the page: the scroll was at 3200 and it is at 0 after.
- The button of Discord shows one label inside its own box, and the copy that rolls in
  is clipped.

### L25 — Risk
- T13: `Risk: item 3 (contracts others consume)` — the navigation of the page points at
  its sections, and the smoke test names the sections the page has to carry. Covered by
  the measurements in L24.

### L26 — The services and the end of the contact section (verbatim)
"En services, quiero que salga el titulo de el service solamente con el 01 o 02 etc... y en
el otro lado salga tipo lo que ofrezco pero mas resumido tipo fronted, y demas no con que
tecnologias trabajo sino lo que puedo ofrecer. pero que se mantenga el worker with pero que
diga otra cosa que sirva para nombrar los servicios que presto. Ademas quiero que
termines la seccion donde se muestran los contactos ya que las lineas no llegan abajo,
estan cortadas."

### L27 — What changed
- The service carries only its number now: the name of the service is gone and the number
  takes its place, at the size of the headings.
- The other side of the row names what the visitor can hire, in the plainest words:
  frontend, backend, cms integration, custom sites, web maintenance; automation, ci
  pipelines, internal tooling, scripts and bots, system services; api integrations,
  scraping, scheduled jobs, rest endpoints, data cleanup.
- The "worked with" slot is still there and says something else now: "what i offer". The
  technologies are out of the section: the stack of the account is in the developer
  section and the technologies of every work are in the works.
- The contact section closes: the vertical lines of the three channels reach the bottom
  of the section. The empty band at the end of the section is gone and the content has
  the air inside the channels instead.

### L28 — What was measured
- The three services carry the number 01, 02 and 03 at 96px, the label "what i offer"
  and the offer of the service. There is no technology list left in the section.
- The bottom of the contact section: the section ends at 9319, the column at 9318 and
  the three channels at 9318. The lines reach the bottom.

### L29 — Risk
- T14: `Risk: item 3 (contracts others consume)` — the services are read from the site
  configuration and the page shows what it says. Covered by the measurements in L28.

### L30 — The footer (verbatim)
"En el footer quiero que apareza abajo deus. en grande en medio y quitar lo de section del
footer esta sobrante, al igual que sata spnapshot"

### L31 — What changed
- The footer says the name and nothing else: "deus." big and in the middle, the way the
  page ends with a word.
- The index of the sections is out of the footer: the header and the menu already carry
  it.
- The date of the snapshot is out of the footer too: it belongs to the data.
- The colophon stays, under the name and centered.

### L32 — What was measured
- The footer carries the name at 224px on the desktop and at 78px on a phone, with no
  link, no index and no date. The name is centered: the only offset is the seven pixels
  the scrollbar takes, and on a phone, where there is no scrollbar, it measures centered.
