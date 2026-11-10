# Hero — diagnosis and design plan

> Status: **plan only, no code changed yet.** The current hero is measured, the
> problems are named, and three directions are on the table. Pick one and the
> build starts.

## Method

Two isolated assessments. Assessment A (design review) and Assessment B
(detector + browser evidence) were run as separate sub-agents and did not see
each other's output until synthesis.

- Detector: `detect.mjs src` — **0 findings**, exit 0. Verified functional
  against a control file. No `impeccable-disable` comments in `src`.
- Gates: `tsc` clean · `npm test` 10/10 · `next build` 8/8 pages, 110 kB First
  Load JS · `npm run verify` 56/56.
- Measured in Edge against the live dev server at 1440×900 and 390×844, both
  themes. Console: 0 errors, 0 warnings.

---

## What is actually wrong

### 1. The opening colour is the bug, not the animation

The glyph animation starts every cell at **ink at 14% alpha**. Composited over
the surface:

| Theme | Start colour | Contrast at t=0 | End contrast |
|---|---|---|---|
| Light | `#a7ad93` | **1.29:1** | 6.98:1 |
| Dark | `#232723` | **1.28:1** | 10.80:1 |

For the first ~760ms the name exists in the DOM at 1.29:1. That is not text,
it is a smudge. The comment in `hero.tsx` claims the name is "readable on the
first frame" — it is not, and never was.

The fix is not to delete the animation. It is to **start from full ink** and
animate something else: position, or a clip mask, or weight. Any reveal whose
starting state is below ~4.5:1 makes the first paint unreadable.

### 2. The vertical budget is spent on chrome

| | 1440×900 | 390×844 |
|---|---|---|
| Hero height | 836 | 788 |
| Source band | 158 | 132 |
| **Wordmark** | **375** | **102** |
| Bottom strip | 120 | 105 |
| Void, per side | 91 | **224** |
| Mark share of hero area | 43% | **12%** |

On desktop the name holds 43% of the area — respectable. **On a phone it drops
to 12%**, with 224px of empty space above and below. The wordmark is 3.7× wider
than tall, so a 26-cell word shrunk to 377px wide becomes a 101px-tall strip.
The mobile hero is mostly air.

### 3. The build log is invented evidence

```
$ deus --build
> glyphs + 26 × 7 ..... ok
> languages + 13 ....... ok
> repos + 13 ........... ok
> ink + 1 ............. ok
$ the name is the page
```

`glyphs + 26 × 7` is a fact about the hero's own CSS. It is theatre about the
process of making the page, presented in the visual grammar the site reserves
for real data (the terminal, the drawn product screens). PRODUCT.md says the
site must not invent its evidence. This invents some. It also runs at 11.2px,
under the 12px floor the site uses everywhere else.

### 4. Reduced motion is not the only fallback that matters

`prefers-reduced-motion` is handled. But there is no fallback for a hero whose
entire identity is an animation: on a slow connection, or with a stalled
font, the visitor gets 1.29:1 ink on a sage field and no way to read the name.

---

## What works, and must survive

- **The ink/sage pair.** 6.98:1 and 10.80:1. It survives the theme switch. It
  is the identity, not a palette choice. Do not touch it.
- **The square-cell grid.** The wordmark as a 26×7 grid of squares is a real
  idea: it makes the name a drawing rather than a type setting, and it costs
  nothing to paint. Keep the grid, change what fills it.
- **The hairline band structure.** Three rules holding a page is the site's
  grammar everywhere else. The hero should keep obeying it.
- **The type.** Space Grotesk at tight tracking is the site's voice. The hero
  does not need a second face.

---

## Three directions

Each is a complete composition in the existing world. Pick one.

### A — `deus.` as a printed plate

**Thesis.** The name is set in the display face at the scale the type system
always reserved for it (`clamp(3.5rem, 22vw, 17rem)`), cropped by the viewport
edges like a proof sheet, with the role, the count and the availability in a
single hairline row beneath it. No grid, no log.

**First viewport.** Name centred, filling the width edge to edge, its tracking
pulling the letters into a single mass. One 1px rule beneath. A three-cell row:
`web developer` · `7 years · 13 repos` · `available`. The portrait sits in the
top-right corner at 96px, with a hairline under it.

**Motion.** The name arrives by *clipping up from the baseline* — `clip-path`
on a wrapper, full ink from frame one. 900ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
One move. The rules draw in with `scaleX` over the same clock.

**Why this portfolio.** It says: the work is the type. It is the direction
that most resembles a printed portfolio, which is the site's stated north star
("the ink & sage ledger").

**Risk.** It is the safest of the three. It is also the direction most other
editorial portfolios ship.

---

### B — The account, drawn

**Thesis.** The hero is not the name, it is the evidence: a full-bleed
character-cell chart of the real GitHub account — one cell per repository, one
row per language, sized by the actual byte counts in `github.json`. The name
sits in the corner of the chart as its label, not as its subject.

**First viewport.** A grid of ~60 cells filling the viewport (13 languages ×
whatever the real data needs). Each cell is a square whose ink density maps to
that language's share. Column labels in 0.6rem mono at the top, row labels at
the left. The name `deus.` occupies the bottom-left three cells at display
size. Availability and the GitHub link sit on the bottom rule.

**Motion.** Cells resolve in reading order — opacity from 0 to 100% over 40ms
each, staggered 8ms — like a terminal drawing a chart. The labels arrive last.
The whole thing settles in 700ms. Under reduced motion it is simply there.

**Why this portfolio.** PRODUCT.md's whole thesis is *"the evidence is the
public GitHub account."* This is the only direction where the hero is literally
that evidence rather than a flourish about it. Nothing is invented; every
number comes from `src/data/github.json`.

**Risk.** The densest of the three. A visitor who does not know what they are
looking at sees texture, not a portfolio. Mitigated by labelling the axes.

---

### C — The file that builds the page

**Thesis.** Keep the "page compiling itself" idea but make it **true**: the
hero shows the real source of this site — the actual `site.config.ts` content
and the actual snapshot numbers — typed into a real editor pane with line
numbers, and a rendered preview beside it that fills in as each block lands.
Split screen, not stacked bands.

**First viewport.** Left 5/12: an editor pane, 40 lines of real config, mono at
0.7rem, line numbers in the gutter, one line highlighted at a time. Right 7/12:
the page being built — the name, the rule, the stats row — appearing block by
block as its source line passes. The split is held by one vertical hairline.

**Motion.** A single cursor advances line by line at ~90ms/line, and each
corresponding block on the right fades from 8% to full over 240ms as its line
lands. Total 2.4s, cancellable: any scroll or key takes the visitor to the
finished state immediately.

**Why this portfolio.** The site genuinely is generated from a committed
snapshot. This direction shows that mechanism instead of describing it, and the
code on screen is real file content, not a fake log.

**Risk.** The most moving parts, and the highest chance of feeling like a
trick if the timing is wrong. Also the only direction that needs a real
"skip" affordance.

---

## Recommendation

**B**, with A's typographic discipline.

B is the only one that fixes the actual complaint — that the hero is a
decoration rather than something grand — by making the subject something only
this portfolio can show: the account itself, drawn. A alone is beautiful but
interchangeable; C is clever but about the site rather than about the person.

Concretely: B's cell chart as the field, A's name set large in the corner, one
motion (the chart resolving), and no invented log anywhere.

## If you pick any of them

Non-negotiable, whichever direction lands:

1. **No animation may start below 4.5:1.** Full ink from frame one; animate
   position, clip or scale, never colour.
2. **The name holds at least 30% of the hero area on a phone.** The mobile
   hero currently gives it 12%.
3. **Nothing in the hero may state a fact the site cannot prove.** No build
   logs, no invented counters — only values read from `github.json` and
   `site.config.ts`.
4. **Every number is labelled.** A chart without axes is texture.
5. **`prefers-reduced-motion` leaves a complete composition**, not a blank
   field.
6. **No new dependency and no new font.** The grid, the pair and Space Grotesk
   are enough.
