---
name: Portfolio — Deus
description: A GitHub-generated developer portfolio with an ink-on-sage editorial grid.
colors:
  surface: "#b2c7ab"
  ink: "#6a0c06"
  muted: "color-mix(in srgb, #6a0c06 80%, #b2c7ab)"
  rule: "color-mix(in oklab, #6a0c06 25%, transparent)"
  rule-strong: "color-mix(in oklab, #6a0c06 60%, transparent)"
  surface-dark: "#0c0d0d"
  ink-dark: "#b2c7ab"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 22vw, 17rem)"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.13em"
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: "-0.06em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.06em"
  body:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.18em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.6rem"
    lineHeight: 1.6
rounded:
  none: "0"
spacing:
  cell-mobile: "0.75rem"
  cell: "1rem"
  section-top: "10rem"
  grid-columns-mobile: "4"
  grid-columns: "12"
components:
  cta:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1rem"
  cta-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1rem"
  roll-cell:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  roll-cell-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  service-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: "1.25rem"
---

# Design System: Portfolio — Deus

## Overview

**Creative North Star: "The Ink & Sage Ledger"**

This is an editorial portfolio built like a ledger: one ink on one paper, a 12-column page, and hairline rules that record where every block begins and ends. The type does the loud work — a display word for the name, a display word for each section — while the interface itself stays quiet. The page is meant to be read top to bottom and then entered sideways through the works.

The palette never gains a third color. Light and dark are the same pair inverted, so the site's identity survives the theme switch; the only exceptions are the drawn product screens inside the works, which carry their own accent colors because they are products, not chrome. Square corners, 1px rules and flat surfaces keep the page close to a printed sheet. Depth comes from inverting a block, not from a shadow.

The work leads. The hero is the name and the portrait; the works take the full screen; the services take the full width in rows; the contact section and footer close the page without repeating what has already been said.

**Key Characteristics:**
- One ink/surface pair, inverted for dark mode.
- 4/12 columns on mobile, 12 on desktop, with a 10-column inset frame for reading sections.
- Oversized Space Grotesk display type with tight tracking.
- Uppercase micro-labels at 0.65–0.7rem and 0.18em tracking.
- Full-bleed works and service rows; hairline rules everywhere else.
- Square corners; the only circles are the three traffic lights of the works frame.
- Drawn product screens instead of stock imagery.

## Colors

The palette is a single pair with a few transparent mixes; there is no secondary accent in the chrome.

### Primary
- **Oxblood Ink** (`#6a0c06`): light-theme text, rules, the hero media band, the works frame border, the service panels, CTA hover. It is the page's only dark voice.
- **Sage Paper** (`#b2c7ab`): light-theme surface. It appears as the page background and as the text on the ink.

### Neutral
- **Near Black** (`#0c0d0d`): dark-theme surface.
- **Sage Ink** (`#b2c7ab`): dark-theme text, rules, panels.
- **Muted Ink** (`color-mix(in srgb, ink 80%, surface)`): body copy that needs to step back; 5.1:1 on light and 4.8:1 on dark.
- **Hairline** (`color-mix(in oklab, ink 25%, transparent)`): dividers that only separate.
- **Strong Hairline** (`color-mix(in oklab, ink 60%, transparent)`): section rules, control borders; at least 3:1 against the surface.

### Named Rules
**The Two-Ink Rule.** Every color in the interface is the ink, the surface, or a mix of the two. The only other colors allowed are inside a drawn product screen, where they belong to that product.

## Typography

**Display Font:** Space Grotesk (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Space Grotesk
**Label/Mono Font:** the system monospace stack for terminal lines, frame URLs and service diagrams.

**Character:** A geometric grotesk with strong verticals and a slightly technical feel. It carries the oversized words comfortably and stays legible at 0.65rem in uppercase labels.

### Hierarchy
- **Display** (700, `clamp(3.5rem, 22vw, 17rem)`, 0.8, −0.13em): the hero name only.
- **Headline** (700, `clamp(3rem, 7vw, 6rem)`, 0.85, −0.06em): each section heading.
- **Title** (700, `clamp(1.875rem, 4vw, 3.75rem)`, 0.95, −0.06em): service titles and work names.
- **Body** (400, 1rem–1.25rem, 1.6): descriptions and notes, kept near 34–46ch.
- **Label** (700, 0.65–0.7rem, 0.18em, uppercase): eyebrows, indexes, list items, meta.
- **Mono** (400, 0.55–0.6rem, 1.6): terminal, URL bars, pipeline rows and API rows.

### Named Rules
**The One Display Rule.** One oversized display word per section. It names the section; the body copy and labels never compete with it.

## Layout

The page is a 4-column grid on mobile and a 12-column grid from 768px. Reading sections sit in a 10-column frame (`col-span-10 col-start-2`) with `border-x`; the works and the service rows break out to the full width, which is how the page changes pace. Sections open with `md:pt-40` (10rem) above the heading, except the hero and the pinned works stage.

Cells carry `0.75rem` padding on mobile and `1rem` on desktop. The page is built from 1px rules rather than cards. Service rows are at least 300px tall on desktop and 340px at the large breakpoint, divided as 1 column for the index, 5 for the title and promise, 3 for the deliverable list, and 3 for the drawn panel. On mobile the row stacks: index + title, then the list indented one column, then the panel full width.

The works are their own spatial model: a sticky stage under the header, a runway as tall as the works, and a horizontal track driven by the page scroll. The section opens from the inset width to the full screen and closes back to the column.

## Elevation & Depth

The system is flat. There are no ambient shadows on cards, buttons or sections; depth comes from inverted ink blocks, hairline rules and the scale of the type. The one shadow is the floating frame of a work (`0 24px 60px -28px rgb(0 0 0 / 0.6)`), which makes the product screen sit above the stage. The service panels are flat ink fields with no shadow.

### Shadow Vocabulary
- **Work frame** (`box-shadow: 0 24px 60px -28px rgb(0 0 0 / 0.6)`): only the framed product screen inside a work.

### Named Rules
**The Flat-By-Default Rule.** A surface is flat until it is a product screen. If a block needs to stand out, invert it; do not add a shadow.

## Shapes

Everything is square. The global `border-radius: 0 !important` is a design rule, not a default. Borders are 1px and use the hairline mixes. The only rounded elements are the three traffic lights of the works frame, which keep `999px` because a window's lights would not read as a window otherwise. There are no pills, no rounded cards and no decorative blobs.

## Components

### Buttons
- **Shape:** square, 1px strong hairline border, 0 radius.
- **Primary (CTA):** uppercase label, 1rem–1.5rem padding, ink text on the surface; hover fills the block with the ink and turns the text into the surface.
- **Motion:** the label rolls out through the top edge while an identical copy arrives from above. Both copies share `--roll-duration: 450ms` and `--roll-ease: cubic-bezier(0.22, 1, 0.36, 1)`; the color changes on the same curve.
- **Reduced motion:** no travel; the copies are identical, so the swap is invisible.

### Chips
- **Style:** square, 1px strong hairline, 0.25rem 0.5rem padding, 0.6rem uppercase label.
- **Use:** technology tags inside a work card and the label chips on the portrait.

### Cards / Containers
- **Corner Style:** square.
- **Background:** surface by default; ink for the hero media band, the service panels and the product screens.
- **Shadow Strategy:** flat; only the works frame uses the frame shadow.
- **Border:** 1px hairline; `border-x` on the inset frame, `border-b` between rows.
- **Internal Padding:** 0.75rem mobile, 1rem desktop.

### Inputs / Fields
There are no form inputs. The only interactive controls are links, the theme toggle and the menu.

### Navigation
- **Header:** fixed, 4/12 columns on mobile, 12 on desktop, surface background, hairline bottom border. The name sits in the first columns; the marquee in the middle; the theme toggle and menu button at the right.
- **Menu:** a full-screen surface overlay with a numbered list of sections in display type. It takes focus when it opens, returns it on `Escape`, and its wheel belongs to the overlay.
- **Footer:** a three-cell strip (GitHub, email, top) with the same rolling label as the CTA, then the colophon and the oversized name.

### Works
One work fills the stage at a time. The name, the line, the stack and the frame arrive together as the card reaches the middle; the frame keeps a slight tilt and its own dark product palette. The arrow keys and one wheel gesture move exactly one work. Past the last work the page takes over.

### Services
Three full-width rows. Each row: a small index, a plain-language title, a short promise, an uppercase list of deliverables, and a drawn panel (browser wireframe, pipeline or API response) on the ink. The panel rests at `scale(1.04)` and settles to `1` on hover; the index goes from 60% to 100%. `motion-reduce` turns both off.

### Developer
A terminal card on the ink, a two-column bio, and a five-column stat strip. It is the one section that shows the GitHub numbers directly.

## Do's and Don'ts

### Do:
- **Do** keep the palette to the ink/surface pair and their mixes. The works' product screens are the only exception.
- **Do** use 1px hairline rules to hold the grid; use `border-strong` for controls and section edges.
- **Do** keep corners square and surfaces flat.
- **Do** set labels in uppercase at 0.65–0.7rem with 0.18em tracking.
- **Do** let the works and the service rows break the inset frame to the full width.
- **Do** respect `prefers-reduced-motion`: no marquee, no entrance travel, no theme travel, no label roll.
- **Do** say each thing once; the section list is in the header/menu, the contact links in the footer/menu.

### Don't:
- **Don't** add a second accent color, gradients or decorative glows to the chrome.
- **Don't** round cards, buttons or inputs; the traffic lights of the works frame are the only circles.
- **Don't** put a shadow on a card, a button or a section; invert the block instead.
- **Don't** repeat contact details in the contact section, the footer and the menu.
- **Don't** invent clients, testimonials, metrics or case studies; the evidence is the public GitHub account and the site's own copy.
- **Don't** make the interface the subject; the work, the type and the grid are.
