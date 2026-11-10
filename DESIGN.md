---
name: Orbi OS — Personal Digital Environment
description: A developer portfolio that is a desktop environment, not a page with a theme.
colors:
  obsidian: "#101216"
  graphite: "#191d24"
  graphite-raised: "#1f242c"
  frost: "#e8eaf0"
  silver: "#a5abb5"
  cloud: "#f2f3f5"
  paper: "#ffffff"
  cloud-raised: "#f7f8fa"
  slate: "#5b6270"
  orbital-blue: "#a9bce5"
  orbital-ink: "#4e639f"
  on-orbital: "#101216"
  on-orbital-day: "#ffffff"
  signal: "#75b99a"
  signal-deep: "#2f7d5f"
  field-deep: "#0b0d11"
  field-deep-day: "#e7e9ee"
  emblem-halo: "#a9bce5"
  emblem-body: "#12161e"
  emblem-deep: "#0a0d13"
  emblem-lit: "#2a3448"
  emblem-ring: "#e8eef9"
  emblem-ring-mid: "#a9bce5"
  emblem-ring-dim: "#4e5f80"
  emblem-glint: "#ffffff"
  emblem-star: "#c6d2e8"
  emblem-halo-day: "#4e639f"
  emblem-body-day: "#dfe4ee"
  emblem-deep-day: "#aeb9cc"
  emblem-lit-day: "#ffffff"
  emblem-ring-day: "#4e639f"
  emblem-ring-mid-day: "#6d80b4"
  emblem-ring-dim-day: "#9aa8c8"
  emblem-star-day: "#7e8aa3"
typography:
  wordmark:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4.4vw, 2.9rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "0.32em"
  wordmark-compact:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.22em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  interface:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.56rem"
    fontWeight: 400
    letterSpacing: "0.18em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.74rem"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  control: "6px"
  button: "8px"
  surface: "10px"
  tile: "12px"
  window: "14px"
  dock: "18px"
  pill: "999px"
spacing:
  window-bar: "2.35rem"
  gutter: "1.15rem"
  chrome-inset: "1.15rem"
  dock-clearance: "4.5rem"
  dock-clearance-compact: "3.6rem"
components:
  window:
    backgroundColor: "{colors.graphite}"
    rounded: "{rounded.window}"
    padding: "0"
  window-bar:
    backgroundColor: "{colors.graphite-raised}"
    height: "2.35rem"
  dock:
    backgroundColor: "color-mix(in oklab, #191d24 62%, transparent)"
    rounded: "{rounded.dock}"
    padding: "0.4rem"
  topbar:
    backgroundColor: "color-mix(in oklab, #191d24 62%, transparent)"
    textColor: "{colors.silver}"
    rounded: "{rounded.pill}"
    padding: "0.36rem 0.66rem"
  button:
    backgroundColor: "transparent"
    textColor: "{colors.frost}"
    rounded: "{rounded.button}"
    padding: "0.45rem 0.8rem"
---

# Design System: Orbi OS

## Overview

**Creative North Star: "The Precision Orbital Instrument."**

Orbi OS is a small desktop environment — a drawn orbital field, an application
dock, windows that move — that carries a working developer portfolio inside
it. The visitor is not scrolling a page; they are opening applications.

The thesis the build holds itself to: **the desktop is a precision orbital
instrument — one luminous body at the focus of one drawn trajectory — refusing
the space-UI default of scattered stars and neon gradients.** The proportion:
**70% professional work, 20% exploration, 10% experiment.** The window manager
is the stage, never the subject. If an interaction does not help someone read
the work, it does not ship.

The first viewport is the whole thesis in one frame: a full-bleed orbital
field; the emblem centred at ~62vw with the orbit crossing the sphere; `orbiOS`
thin and wide under it; project apps filed
in the left column; the glass dock at the foot; the status pill top right.

**Key characteristics:**
- Obsidian field, blue-silver volumetric light, hairline trajectories, a
  rim-lit sphere, ultra-thin tracked type, one signal-green status.
- Two themes inverted on one set of variables; the emblem carries its own
  second lighting of the same palette.
- One mark everywhere — "the apogee": a core at the orbit's focus, a tilted
  orbit in two arcs, one accent satellite. Drawn in `currentColor` so both
  themes get it for free.
- Hairline borders instead of shadows; one soft shadow under a window, the
  dock, and the menus.
- Radii 6–18px, pills for chips. Motion 180–320ms on interactions; slow
  ambient clocks from 8s to 131s; nothing at all under
  `prefers-reduced-motion`.
- Geist for the interface, Geist Mono for labels, metadata, terminals and code.
- Every number comes from `src/data/github.json` or `src/data/site.config.ts`.

## Colors

### Shell

- **Obsidian** (`#101216`): the desktop and the system background in dark;
  the ink of the light theme.
- **Graphite** (`#191d24`) and **Graphite Raised** (`#1f242c`): a window and
  its raised parts — title bar, card, tile base.
- **Frost** (`#e8eaf0`) and **Silver** (`#a5abb5`): dark-theme ink and muted
  text.
- **Cloud** (`#f2f3f5`), **Paper** (`#ffffff`), **Cloud Raised** (`#f7f8fa`),
  **Slate** (`#5b6270`): the same roles in the light theme.

### Accent

- **Orbital Blue** (`#a9bce5`) on dark, **Orbital Ink** (`#4e639f`) on light.
  It marks the active application, links, the caret, the focused dock item, the
  focus ring and the selection, and nothing else. Text on an accent fill is
  **On-Orbital** (`#101216` / `#ffffff`).
- **Signal** (`#75b99a` / `#2f7d5f`): availability and successful commands. It
  is a state, never a decoration.

### Rules

- **Hairline** (`rgb(255 255 255 / 0.09)` dark, `rgb(16 18 22 / 0.1)` light):
  a divider inside a surface.
- **Strong hairline** (`.16` / `.18`): a window edge, a control border.

### The emblem's second lighting

The `--emblem-*` variables are the only place the system carries a second
lighting of the same palette, and only for the emblem. Dark: *a dark body lit
by a near star* — body `#12161e` rising to lit `#2a3448` and falling to deep
`#0a0d13`, ring `#e8eef9 → #a9bce5 → #4e5f80`, halo `#a9bce5`, star
`#c6d2e8`. Light: *a pearl body under an ink orbit* — body `#dfe4ee`, deep
`#aeb9cc`, lit `#ffffff`, ring `#4e639f → #6d80b4 → #9aa8c8`, halo `#4e639f`,
star `#7e8aa3`. The glint is `#ffffff` in both. The same SVG reads either
lighting from the theme.

**The One Accent Rule.** The accent says "this is active". It never fills a
large region, and it never competes with the content of an application.

**The Glow Rule.** A glow marks a light source or a live state — the emblem's
halo, the signal dot, the open-app dot, the boot bar — never a surface, never
text, never a border at rest.

## Typography

**Interface Font:** Geist (250–500). **Label/Mono Font:** Geist Mono.
**Wordmark Font:** Jost — the geometric Futura revival, the lettering of the
space age. The wordmark carries its own face; the interface stays on Geist.

**Character:** the system names itself in ultra-thin tracked type; everything
instrument-like — labels, statuses, subtitles, shell lines — is wide-tracked
mono uppercase; titles are medium with negative tracking at size.

### The ramp as built

- **Wordmark** (primary): Jost 300, `clamp(1.9rem, 4.4vw, 2.9rem)`, tracking
  0.32em, line-height 1. Under the emblem on the desktop and the boot screen.
  The trailing letter-space is given back with `text-indent`.
- **Wordmark** (compact): Jost 400, 0.82rem, tracking 0.22em. The top bar only.
- **App title:** Geist 500, `clamp(1.5rem, 2.4vw, 2rem)`, −0.035em, 1.1.
  Secondary titles 1–1.35rem at −0.02 to −0.03em.
- **Interface body:** Geist 400–500 in a 0.82–0.88rem band (0.84rem is the
  middle of it), 1.5–1.55 line-height.
- **Mono labels:** Geist Mono 0.56–0.62rem, uppercase, tracking by duty —
  0.18em is the standard label (0.56rem); 0.2em for eyebrows and statuses;
  0.28–0.34em for the boot lines. Never below 0.56rem.
- **Mono body:** Geist Mono 0.68–0.74rem at 1.75–1.8 — terminal, shell, clone
  commands.
- **Window title bar:** 0.76rem 500, with a 0.6rem mono subtitle beside it.

**The Tracking Rule.** The wordmark is the one sans line allowed wide tracking;
every other wide-tracked line is mono. Titles carry negative tracking instead.
One element never carries both.

## The mark — the apogee

One core resting at the focus of one tilted orbit, never at its centre: the
asymmetry is what separates it from a generic planet icon. The far arc passes
behind the core at half light; the near arc crosses in front of it. The
signature is the seat at the right vertex: the satellite rides the orbit
exactly where the light catches it, and the arc brightens for one short dash as
it passes — one detail, the same detail, at every size.

- Grid: 32 units. The orbit is 12.6 × 6.1 rotated −26° about (16, 14.6); the
  core is a 4.8 disc at the low focus, (11.6, 18.4); strokes are 1.8 with round
  caps; the light catch is a dash of 11/89 at 2.2 in the accent; the satellite
  is a 1.7 bead at (27.32, 9.08), also accent.
- Colour: `currentColor` for core and arcs, `var(--accent)` for the satellite
  and the catch — one file, both themes.
- Sizes in use: 18 default, 15 in the top bar, and the favicon.
- The favicon (`src/app/icon.svg`) is the same geometry at 1.5 scale inside a
  64px obsidian tile with a 14px radius — Frost ink, Orbital Blue satellite —
  so the tab and the shell wear the same symbol.

## The emblem — the cinematic scene

The mark at the scale of a place: a dark sphere hanging in one drawn trajectory,
lit from the lower left the way a body is lit by a near star. Everything is a
gradient or a hairline — no filters — so the whole scene is one composited
layer that never repaints.

- Frame: 560 × 360. Halo r 290, the only volume in the composition. Sphere
  r 88 at the centre, its body gradient falling lit → body → deep from (38%,
  66%); one rim stroke (2.2) with the ring gradient; the night side is a 7px
  deep stroke rotated 24°.
- The orbit is 210 × 82 rotated −16°: the far half at half light behind the
  sphere, the near half in front at full, with a 9/91 catch dash at 2.6 — the
  same light catch as the mark.
- The satellite: a 7.5 bead at (482, 122) with a 16 halo and a 2.4 glint.
- One distant trajectory crosses the body on purpose: a 1px hairline at 0.22
  opacity, rotated 14°, breaking the sphere's silhouette so the diagram reads
  through it.
- Nine placed stars at 0.45–0.7 opacity, never scattered.
- Arrival values `sphere`, `orbit`, `satellite` are 0..1; the boot clock drives
  them, and at 1 the scene simply exists, breathing (see Motion).
- Sizes in use: `min(470px, 62vw)` on the desktop lockup, `min(580px, 80vw)`
  on the boot screen.

## The field

A drawn environment, not a picture: a deep gradient carrying two pools of
volumetric light, four hairline trajectories crossing asymmetrically, two
deterministic travellers, and few placed stars.

- **Ground:** `--field-deep` (`#0b0d11` dark, `#e7e9ee` light) falls to the
  surface over a vertical gradient (deep → surface at 74%); one low radial
  of the accent rises from the bottom edge (130% × 90% at 50% 118%, accent
  at 10%); one faint counterweight of ink (4%, 70% × 46% at 88% −12%) keeps
  the top from reading as bottom-only light.
- **Glow pools:** a near pool of accent (13%, 68vw, top left) and a far pool of
  ink (7%, 52vw, bottom right). Never symmetrical with each other.
- **Trajectories:** four ellipses in one 1600 × 1000 sliced viewBox, each on
  its own centre and tilt — (820, 430, 720 × 300, −18°), (620, 540, 540 × 230,
  −25°), (1020, 380, 380 × 480, +22°), (780, 620, 270 × 160, −12°). Hairlines
  at 1px non-scaling: ink 9%, ink 6%, accent 12%, ink 5%.
- **Travellers:** two light points riding two orbits via SMIL — r 3.2 at 84s
  and a dimmer r 2.4 at 131s reversed. Deterministic, prime-ish, they never
  meet. Only in the Orbital wallpaper.
- **Stars:** ten, placed, each on its own 6–14s twinkle.
- **Edge fade:** the trajectories (and their travellers) fade out before the
  screen's edge — a radial mask (115% × 105% at 50/50, solid to 56%, gone by
  97%; on a phone 48%/94%) — so the field keeps a calm frame around the desk
  instead of cutting to the bezel.
- **Parallax:** the cursor writes `--mx`/`--my` (−1..1, fine pointers only) and
  three depths answer — near glow −8px, far glow −14px, paths −5px, eased over
  600ms. A few pixels; enough to feel alive, never enough to move the eye off a
  window.

### Wallpapers

Four variants of the same field, chosen in the preferences or the desktop menu;
the choice is one `data-wallpaper` attribute on `.os`, kept in `localStorage`
(icon places live in `sessionStorage`).

- **Orbital** (default) — everything above.
- **Minimal** — the gradient and the near pool; no trajectories.
- **Grid** — no trajectories; a 22px dot grid of ink at 12%, masked to a
  softer ellipse than before.
- **Nebula** — two soft lights (accent 20% at 22%/24%, ink 7% at 78%/76%) on
  the deep ground, nothing drawn over them. The signal colour is a state,
  never decoration, so the far light is ink.

On a phone the two largest trajectories step back to 50% opacity so they never
cut through the content.

## Boot sequence

One clock: `BOOT_MS` (3600 ms) in `src/lib/boot.ts`. Everything the boot
screen draws is derived from the elapsed share by `bootFrame(elapsed)`, covered
by `scripts/boot.test.mjs`. The exit takes `BOOT_EXIT_MS` (420 ms): the boot
screen fades and scales to 1.03 while the desktop is already there.

| Share | Beat |
|---|---|
| 0 – 20% | the sphere fades up out of the dark |
| 6 – 46% | the orbit draws itself around it |
| 38 – 52% | the satellite seats where the light catches |
| 46 – 66% | the wordmark settles up as its tracking tightens 0.62em → 0.32em |
| 58 – 76% | the subtitle, "Personal Digital Environment", follows |
| 62 – 100% | the bar fills through three lines: *Loading orbits*, *Mounting the desktop*, *Starting applications* |

Before the bar, the line reads *Initializing Orbi Environment*; the stage
lines ride the bar's thirds. It plays once per visit (`sessionStorage`), any
key or pointer press takes the desktop immediately, and
`prefers-reduced-motion` opens on the finished frame with no clock. It is a
client overlay only: the `<noscript>` document and the server payload are never
behind it.

## The application model

Two families, one shape, all of it in `src/lib/orbi.ts`:

- **System apps** — Orbital Explorer, Code Studio, System Monitor, Terminal,
  Playground, Connect. Written once, `surface: "dock"`.
- **Project apps** — one per featured repository, mapped from the snapshot and
  the site config at module load, `surface: "desktop"`. A repo that becomes
  featured becomes an app: its id (`project:<name>`), its tile, its accent, its
  window (900 × 640, min 520 × 420) and its address are all derived, never
  listed by hand.

**The tiles.** Each tile is the same square — a gradient of Graphite Raised
tinted with the project's own accent over Graphite, a hairline border, a 1px
inset top highlight — with the project's mark in its own accent and a 2px bar
of that accent at its foot (inset 18% inline, 12% from the bottom). The mark is
a **glyph**, chosen per project in `site.config.ts` from six drawn on one
24-unit grid (`glyphs.tsx`): `orbit`, `screen`, `wave`, `layers`, `grid`,
`page`. A project with no glyph falls back to its initial. One geometry at
every size: 20px in the dock (radius 6), 44px on the desktop and on a project
loading screen (radius 12).

**The icons move.** They are not a grid: each one is absolutely placed and can
be dragged anywhere on the desktop, where it stays. The first paint uses the
filed grid (`gridIcon`: one cell of 92 × 78px, 6px gaps, 16px pad, columns fill
down and wrap), the script replaces it with the places the visitor chose
(`sessionStorage`). `clampIcon` keeps an icon wholly on the desktop — unlike a
window, a tile may not hang over an edge. A drag needs 5px of travel to arm, so
a click stays a click. Hover lifts an icon 2px with an accent-tinted border;
selection is an accent ring; a drag grabs, scales 1.02 and rises above its
neighbours.

A click selects, a double click opens, Enter opens the selected, and on touch a
single tap opens — a launcher has no second click to give.

## The desktop menu

A right click on the bare desktop opens a small menu where the pointer is,
kept inside the window. A right click inside a window is left to the browser.

| command | what it does |
|---|---|
| Desktop preferences… | the panel below |
| Tidy up icons | files every icon back into the grid, and remembers that |
| Restore icon positions | forgets the places the visitor chose |
| Command palette… | opens `Ctrl/Cmd + K` |
| Put all windows away | minimizes every window at once |
| Wallpaper: … | one entry per wallpaper, applied at once |

Arrows move, Enter runs, Escape and a click outside close it.

**Desktop preferences** is a panel over the desktop, not a window: the
wallpaper as a radiogroup with a swatch per option, and the icon commands. It
takes focus on open and closes on Escape.

**A project window** is 900 × 640 (min 520 × 420): the drawn `ProjectScreen` of
the product as the view, and beside it a panel with tabs — *Overview*, *Links*
(the repository and the `git clone` command, with a copy button) and *Info*.
A tab with nothing behind it is not drawn, so no section is ever empty.

**Loading.** The content of a project app is a lazy chunk (`next/dynamic`). The
first time a project opens in a session, `ProjectLoading` covers the window
with the project's tile, its name, a closing ring and *"Opening {name}…"*, for
`PROJECT_LOAD_MS` (1000 ms, `src/lib/project-load.ts`), then fades out in 260
ms. The content is mounted underneath from the start. Reopening from the dock
or restoring a minimized window does not repeat it; under
`prefers-reduced-motion` the screen is skipped entirely.

**The dock** holds the system apps, plus any project that is open or minimized;
a project that is closed has no place there.

## Layers

The shell is a stack of fixed layers, declared once as `--z-*` tokens in
`globals.css` and mirrored by `LAYERS` in `src/lib/layout.ts` (a test keeps
the two in step):

| layer | z | what lives there |
|---|---|---|
| wallpaper | 0 | the field |
| copy | 5 | the welcome lockup: emblem and wordmark |
| icons | 7 | the project icons of the desktop |
| window | 10 + order | every window, raised by the manager |
| (palette scrim) | 60 | the dim behind the command palette |
| dock | 70 | the floating dock and the top bar |
| palette | 90 | the command palette and the desktop menu |
| boot | 95 | the boot sequence |

The dock is above every window, whatever its order in the stack. The top bar
rides at the dock layer, so its controls are never hidden. The palette is above
both. There is no system bar: the status pill top right is the only chrome.

## Layout

The shell is one row: the desktop fills the viewport, top and bottom. The dock
floats over it and reserves no space, so a window may touch both edges of the
screen.

The welcome lockup is `position: fixed`, centred on the viewport, on the copy
layer, `pointer-events: none`: the emblem at `min(470px, 62vw)`, the primary
wordmark under it, and nothing else — no subtitle, no copy. It has no
transition and no state of its own: a window, a palette or
a dock can only cover it, never move it. On a phone it sits at 44% height so
the dock never reaches it.

Windows are absolutely positioned inside the desktop and are seated centred,
stepped 28px per open window (cycling every five), and clamped so none opens
off-screen. On phones a window takes the desktop (`inset: 0.35rem 0.35rem 0`),
the dock becomes a full-width compact row, and dragging and resizing are
disabled — the system is the same product on both, not a shrunken desktop.

Responsive rules: **767px** is the phone line (icon labels shrink with the
tiles at 0.94, the bar drops its version/key/clock and grows its controls
to 44px, dock items widen to 2.75rem and lose tooltips, the window body's
`--dock-clearance` drops from 4.5rem to 3.6rem); **1100px** stacks a project
window's two columns into one.

### Window limits

A window's box is measured against the whole viewport, from the **top edge to
the bottom edge**; neither the bar nor the dock is subtracted.
`src/lib/layout.ts` holds the rules as pure functions, covered by
`scripts/layout.test.mjs`:

- `seat` centres a new window, steps it 28px per open window, and caps it at
  the screen minus a 16px edge.
- `dragTo` keeps a 120 × 48px strip of the window on the screen in both axes.
- `resizeTo` never goes below the application's minimum and never past the
  right edge.
- `clampToDesktop` pulls every window back inside the screen when the viewport
  changes, and is also what a maximized window obeys: `inset: 0`, to the bottom
  edge, with the dock floating over its last 72px.

Because the dock floats, a window may run under it. Every window body reserves
`--dock-clearance` (4.5rem desktop, 3.6rem phone) as bottom padding and scroll
padding, so the last row of any application can always be scrolled clear of
the glass.

### Dragging and resizing

A press only becomes a gesture after the pointer has travelled **6px**
(`DRAG_SLOP`); icons arm at **5px**. Below that nothing moves: a click on the
title bar, the wobble of a press, and the press half of a double click all
leave the window exactly where it was. The pointer is captured only by the
title bar and the corner grip — the window body keeps the browser's own touch
panning and text selection. A drag switches the window into `data-dragging`,
which keeps the grab cursor, stops text selection and lets the pointer pass
over the application instead of into it.

## Components

### Window
A title bar (Graphite Raised, 2.35rem) with the application icon, the title,
an optional subtitle in 0.6rem mono, and three controls — minimize, maximize,
close. The body scrolls on its own. The bottom-right corner resizes. Focus
raises z-index and drops the shadow of the unfocused state. Open: a 220ms
scale-and-fade from 0.985.

### Dock
A floating glass pill: `position: fixed`, centred, 0.85rem above the bottom
edge (0.6rem plus the safe area on a phone). Glass is `color-mix(panel 72%,
transparent)` — opaque enough that its text keeps solid contrast over the
field's brightest ground — with `backdrop-filter: blur(22px) saturate(140%)`,
an 18px radius, a strong hairline, a soft wide shadow and a 1px inner
highlight. (One `backdrop-filter` declaration only — with both the prefixed
and the standard property the minifier kept the `-webkit-` one alone and the
blur vanished.)

One item per application: tile, tooltip on hover (0.6rem mono), a 4px dot with
a glow under the ones that are open. Hover lifts the item 3px; the active app
wears accent at 12% behind its tile and accent on its label. An open
application is brought forward, never duplicated. On a phone the pill narrows
to its icons and drops the tooltips.

### Top bar
One quiet pill at the top right (1.15rem inset, 0.85rem on a phone), the same
glass as the dock: the compact mark with `orbiOS` and `v0.1`, a hairline split,
the signal dot and ONLINE, the `⌘K` key, the theme switch, a tabular clock
ticking every 30s, and the GitHub door. Mono 0.62rem uppercase throughout,
except the brand at 0.78rem sans. On a phone the version, key and clock drop.

### Tiles and desktop icons
See *The application model*. One tile geometry; the glyph, the accent and the
fallback initial come from the data.

### Command palette
`Ctrl/Cmd + K`. A scrim (`rgb(0 0 0 / 0.4)`, blur 6px) and one list over
applications, projects and system actions; arrows move, Enter runs, Escape
closes. Search requires every word of query to appear as a substring.

### Applications
- **Orbital Explorer** — profile, availability, philosophy and trajectory,
  filed like a tree.
- **Project apps** — one per featured repository, generated from the data.
- **Code Studio** — three real excerpts of this system's own source.
- **System Monitor** — the byte counts per language, recent pushes, live clock.
- **Orbital Terminal** — opens on the prompt with two lines of greeting, and
  stays there. The same column of plain text is the shell from the first frame
  (`open`, `search`, `ask`, `whoami`, `theme`, `clear`, `help`).
- **Playground** — the glyph tide, in the orbital palette.
- **Connect (the desk)** — a conversation. The visitor asks and the desk
  answers in the browser: services, price, timing, stack, availability,
  contact and how a project starts, in English and Spanish. Every answer comes
  from `src/lib/assistant.ts`, a deterministic matcher over the site config and
  the GitHub snapshot — no request leaves the page, no number is invented, and
  a question it cannot match is admitted and answered with the real channels.
  Each answer offers the next questions as buttons and, where it applies, the
  email and GitHub links. The transcript is a live region.

### The assistant
`reply(question)` is pure and testable (`scripts/assistant.test.mjs`). Each
intent lists the words that point at it; the best score wins. A word of three
letters or fewer is matched as a whole token — `available` must not answer as
`ai` — and a longer word is matched inside a token. With no score at all the
answer is the fallback, which says it could not match and hands over the
channels.

### Terminal
Restyled to the shell: the accent caret and prompt, the signal for status, the
ink for output. The typewriter clock (`src/lib/typewriter.ts`) computes the
whole schedule up front — a command types a character at a time, output prints
whole. A new script replays; any wheel, key or tap lands it at once.

## Motion

Each layer does exactly one thing, on its own clock, at speeds that never meet.

| clock | what |
|---|---|
| 84s / 131s | the two field travellers, SMIL, Orbital wallpaper only |
| 26s | the emblem's light catch travelling the ring (dashoffset 0 → −200) |
| 14s | the emblem's satellite drift (3px, −2px) |
| 9s | the emblem's halo breath (0.85 ↔ 1 opacity) |
| 6–14s | the field stars' twinkle; the emblem stars at 8/11/13s |
| 600ms | the field's parallax ease-out |
| 420ms | the boot exit (fade + scale to 1.03) |
| 400ms | the language meter's bar growth |
| 3600ms | the boot sequence itself, `BOOT_MS` |
| 320ms | theme travel on the two colour properties; `--slow` for state |
| 260ms | the project loading screen's exit |
| 220ms | a window opening (scale 0.985 + fade) |
| 200ms | a terminal line landing |
| 180ms | controls answering; the palette opening; `--fast` |
| 160ms / 140ms | the palette scrim / the desktop menu |
| 1s | the terminal caret's blink |

The ambient clocks (6s and up) run under `prefers-reduced-motion:
no-preference` only. Under `prefers-reduced-motion: reduce` every animation
and transition collapses to 0.001ms; the travellers are not rendered; the
parallax is switched off; the caret is not drawn; the boot opens on its
finished frame and the project loading screen is skipped.

## Accessibility

- Every interactive control is a real `button`/`a` with a name.
- A visible accent focus ring (2px, 2px offset) on everything focusable.
- The desktop carries one `h1` as `sr-only`; the boot screen announces itself
  (`role="status"`, `aria-live="polite"`) with an sr-only summary of the stages
  and the skip hint; the Connect transcript is a live region.
- The window manager keeps windows inside the desktop on resize.
- `forced-colors` draws window, terminal and dock borders in `CanvasText`.
- A `<noscript>` document carries the whole portfolio as one readable column:
  projects, stacks, languages, services and contact — so the work survives a
  browser that never runs the shell.

## SEO

The browser never runs the shell for a crawler, so the content is also in the
initial payload: a `Person` and an `ItemList` of the featured projects in the
head (each project with its `#/projects/<name>` address), the `<noscript>`
document in the body.

## Do's and Don'ts

### Do
- **Do** keep a window's state in the manager and its content in the app.
- **Do** seat a new window inside the desktop; never let it open off-screen.
- **Do** give an address to what a visitor might send: `#/projects/<name>`
  opens the system at that project.
- **Do** keep the accent for active state and the signal for live state.
- **Do** draw the mark from `Mark` and the scene from `Emblem`, never a second
  SVG or a glyph stand-in.
- **Do** tune the boot by `BOOT_MS` and the project load by `PROJECT_LOAD_MS`,
  not by editing the beats.
- **Do** keep the trajectories hairlines (≤12% ink or accent) and the stars
  few and placed.
- **Do** keep every sequence cancellable — the boot skips on input, the
  terminal lands on the first wheel, key or tap.
- **Do** keep the parallax to a few pixels across its three depths.
- **Do** keep the no-script document in step with the applications.

### Don't
- **Don't** scatter stars, run neon gradients, or take the space-UI default:
  one luminous body at the focus of one drawn trajectory is the whole thesis.
- **Don't** put a glow on anything that is not a light source or a live state.
- **Don't** add a third accent, or let the accent fill a large region.
- **Don't** animate the wordmark's tracking outside the boot, or move the
  welcome lockup: windows cover it, never shift it.
- **Don't** copy Windows, macOS or a Linux desktop: the shell has its own
  status pill, its own dock and its own orbital field.
- **Don't** invent metrics, uptime, counters or experience. The numbers are
  the committed snapshot.
- **Don't** let the system be the subject: the windows are where the work is.
- **Don't** ship an interaction that does not help the work be read.
