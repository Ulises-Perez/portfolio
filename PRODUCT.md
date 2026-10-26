# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Potential clients looking for a developer for a website, a backend, automation or an integration, usually evaluating whether the work is real and whether the person can own a project end to end.
- Recruiters and peers who want a fast, honest read of the developer's stack, public work and activity.

## Product Purpose

A personal portfolio for Ulises-Perez ("Deus") that presents the developer, the selected work and the services in one place, and makes it easy to start a conversation. Every project, language and byte comes from the public GitHub account, so the page stays current without anyone rewriting it claim by claim.

Success means a visitor understands what the developer does, sees real public work behind it, and knows how to make contact in under a minute.

## Positioning

The portfolio is generated from the developer's actual GitHub account: a committed snapshot of every public repository, its language breakdown and its README feeds the page at build time. There is no runtime API call, no rate limit and no invented project or testimonial. The works are drawn from the identity of each repository because there is no live deployment to photograph.

## Operating Context

- Static export published to GitHub Pages from the repository sub-path.
- A scheduled GitHub Action refreshes the snapshot every Monday; a deployment publishes the new build.
- The visitor browses one page: developer, selected works, services, contact.
- The site is read in English, on desktop and mobile, in light and dark themes, with or without JavaScript.

## Capabilities and Constraints

- Next.js 15 App Router, Tailwind v4, TypeScript and a static export (`output: "export"`).
- The base path is derived from `PORTFOLIO_REPO_NAME` (default `portfolio`), so the export works under the GitHub Pages project path.
- Data lives in `src/data/github.json`; the visible and featured repositories are decided by `scripts/github-sync.config.json`.
- Copy, roles, services, contact links and the written line of every featured work live in `src/data/site.config.ts`.
- The works are pinned and navigated one at a time; the menu, theme and works must stay usable from the keyboard.
- The site never fetches GitHub while serving a page.
- No testimonials, client logos, metrics, pricing or case studies exist yet; future work must not invent them.

## Brand Commitments

- The name is Deus; the GitHub handle is Ulises-Perez.
- The voice is English, lowercase in labels and headings, direct and unhyped. It says what can be hired and what was built without marketing inflation.
- The visual world is inspired by mijobello.com: one ink/surface color pair that inverts with the theme, hairline rules, Space Grotesk, square corners, oversized display type.
- The GitHub account is the source of truth for work and technologies. The site's own copy is the single voice that describes the work; READMEs only fill gaps.
- The footer carries the ways out (GitHub, email, top); the contact section is an invitation, not a second list of the same details.

## Evidence on Hand

- `src/data/github.json`: profile, public repositories, per-repository language bytes and README excerpts.
- `src/data/site.config.ts`: the written line, stack and drawn screen of every featured work; the service groups; the contact links.
- The GitHub profile avatar; the featured projects are real public repositories.
- No live deployments of the featured projects are available to photograph; the works frame a drawn product screen instead.
- No client quotes, commercial case studies or analytics are available.

## Product Principles

1. **Show the real work.** Every project and technology comes from the public GitHub account; the page never pretends to a client list it does not have.
2. **One voice, no repetition.** The site says each thing once. The section links live in the header and menu; the contact details live in the footer and menu; the works are not repeated in services.
3. **Let the artefact lead.** The portfolio is an Experience surface: the work, the type and the grid carry the page; the interface recedes.
4. **Every section answers a visitor question.** Who is this, what has been built, what can be hired, how do I start.
5. **Static, fast, resilient.** The page is a build-time export with no runtime dependency on GitHub, readable without JavaScript at its core.

## Accessibility & Inclusion

- Skip link, one `h1`, labelled sections and a visible focus ring on every interactive element.
- Muted text uses a dedicated color mix instead of opacity, keeping the smallest labels above WCAG AA in both themes.
- `prefers-reduced-motion` disables the marquee, the entrance animations, the smooth scroll, the theme travel and the label rolls; the works stay in place and the frame drops its tilt.
- The works are reachable and navigable with the keyboard; the menu takes focus when it opens and returns it on `Escape`.
