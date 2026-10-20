"use client";

import { useEffect, useRef, useState } from "react";

import { Cta } from "@/components/cta";
import { RepoCover } from "@/components/repo-cover";
import { featuredRepos } from "@/lib/github";
import { formatBytes, formatMonth } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

/** Wheel distance that buys the next project. */
const SCROLL_THRESHOLD = 120;

/**
 * One line that says what the project is. The README opens with a sentence
 * about the project itself, so that is the line worth showing; a framework
 * boilerplate readme is not, and neither is an empty description.
 */
function summary(repo: { description: string; readme: string }): string {
  const readme = repo.readme.trim();

  if (readme.length >= 24 && !readme.startsWith("About ")) {
    return readme.length > 150 ? `${readme.slice(0, 150).trimEnd()}…` : readme;
  }

  return repo.description.trim();
}

/**
 * The featured projects, one at a time. The projects live in the page flow,
 * each one a full screen, and the wheel moves the page from one project to
 * the next instead of letting it travel. The page keeps the position, so the
 * visitor never lands halfway between two projects and the section can be
 * entered and left downwards.
 */
export function Works() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const accumulated = useRef(0);

  /** Where a panel is anchored: under the fixed header and the index bar. */
  const anchorOffset = () => {
    const bar = barRef.current;

    if (!bar) return 0;

    return (
      Number.parseFloat(getComputedStyle(bar).top) + bar.offsetHeight
    );
  };

  /** The page position where a panel sits right under the index bar. */
  const anchorOf = (index: number) => {
    const panel = panelRefs.current[index];

    if (!panel) return 0;

    return (
      panel.getBoundingClientRect().top + window.scrollY - anchorOffset()
    );
  };

  const goTo = (index: number) => {
    const section = sectionRef.current;

    window.scrollTo({ top: anchorOf(index), behavior: "instant" });

    if (!section) return;

    // The project that arrives fades in, so the change reads as a change and
    // not as a panel crossing the screen.
    section.classList.remove("is-swapping");
    void section.offsetWidth;
    section.classList.add("is-swapping");
    window.setTimeout(() => section.classList.remove("is-swapping"), 320);
  };

  /** Page movements respect the visitor's motion preference. */
  const scrollBehavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";

  // The project in view is the last one that reached its anchor.
  useEffect(() => {
    const onScroll = () => {
      const offset = anchorOffset();
      const y = window.scrollY;
      let current = 0;

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;

        const anchor = panel.getBoundingClientRect().top + window.scrollY - offset;

        if (anchor <= y + 2) current = index;
      });

      setActive(current);

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;

        if (index === current) panel.setAttribute("data-active", "true");
        else panel.removeAttribute("data-active");
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The wheel walks the projects one at a time while the works are on screen.
  // At the ends, and on a hard fling, the page takes over with a clean
  // handover instead of leaving a project half out of the screen.
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      const panels = panelRefs.current.filter(Boolean) as HTMLElement[];

      if (panels.length === 0) return;

      const section = sectionRef.current;
      const first = anchorOf(0);
      const last = anchorOf(panels.length - 1);
      const down = event.deltaY > 0;

      if (!section) return;

      const sectionBottom =
        section.getBoundingClientRect().bottom + window.scrollY;

      // Outside the works the page scrolls as usual.
      if (window.scrollY < first - 1 || window.scrollY > last + 1) return;

      const handover = () => {
        event.preventDefault();
        window.scrollTo({
          top: down ? sectionBottom : first,
          behavior: scrollBehavior(),
        });
      };

      // A hard fling means the visitor wants to leave, not to walk.
      if (Math.abs(event.deltaY) > 240) {
        handover();
        return;
      }

      // A change of direction starts the count again.
      if (
        accumulated.current !== 0 &&
        Math.sign(accumulated.current) !== Math.sign(event.deltaY)
      ) {
        accumulated.current = 0;
      }

      accumulated.current += event.deltaY;

      if (Math.abs(accumulated.current) < SCROLL_THRESHOLD) {
        event.preventDefault();
        return;
      }

      accumulated.current = 0;

      const target = active + (down ? 1 : -1);

      if (target >= panels.length) {
        handover();
        return;
      }

      if (target < 0) {
        // The page takes over and carries on up, back to the title.
        return;
      }

      event.preventDefault();
      goTo(target);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => window.removeEventListener("wheel", onWheel);
  }, [active]);

  // The keyboard walks the projects the same way.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const keys: Record<string, number> = {
        ArrowDown: active + 1,
        ArrowRight: active + 1,
        PageDown: active + 1,
        ArrowUp: active - 1,
        ArrowLeft: active - 1,
        PageUp: active - 1,
      };

      const target = keys[event.key];

      if (target === undefined) return;

      const panels = panelRefs.current.filter(Boolean) as HTMLElement[];

      if (panels.length === 0) return;

      const first = anchorOf(0);
      const last = anchorOf(panels.length - 1);

      if (window.scrollY < first - 1 || window.scrollY > last + 1) return;

      event.preventDefault();
      goTo(Math.min(Math.max(target, 0), panels.length - 1));    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  if (featuredRepos.length === 0) return null;

  return (
    <section
      id="works"
      ref={sectionRef}
      className="works-section border-b border-rule-strong"
    >
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong pb-0 md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">selected</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">works.</h2>
            </div>
          </div>

          {/* Names the project in view and jumps straight to any of them. The
              bar is small and the column below it is tall, so it stays put
              for the whole section. */}
          <div
            ref={barRef}
            className="sticky top-14 z-20 flex h-8 items-center justify-between gap-4 border-b border-rule-strong bg-surface px-3 md:top-16 md:px-4"
          >
            <p className="eyebrow">scroll to browse</p>
            <ul className="hidden items-center gap-4 md:flex">
              {featuredRepos.map((repo, index) => (
                <li key={repo.name}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Go to ${repo.name}`}
                    aria-current={index === active}
                    className={[
                      "cursor-pointer text-[0.65rem] font-bold tracking-[0.12em] tabular-nums transition-opacity",
                      index === active ? "opacity-100" : "opacity-40 hover:opacity-100",
                    ].join(" ")}
                  >
                    {pad(index + 1)}
                  </button>
                </li>
              ))}
            </ul>
            <p className="flex min-w-0 items-center gap-2 text-[0.65rem] font-bold tracking-[0.18em] uppercase md:hidden">
              <span className="tabular-nums text-muted">
                {pad(active + 1)}/{pad(featuredRepos.length)}
              </span>
              <span aria-hidden="true" className="opacity-40">
                /
              </span>
              <span className="truncate">{featuredRepos[active]?.name}</span>
            </p>
          </div>

          {featuredRepos.map((repo, index) => (
            <article
              key={repo.name}
              ref={(node) => {
                panelRefs.current[index] = node;
              }}
              data-panel
              data-index={index}
              className="grid min-h-[calc(100svh-5.5rem)] snap-start scroll-mt-24 grid-cols-4 border-b border-rule-strong md:min-h-[calc(100svh-6rem)] md:grid-cols-10"
            >
              <div className="col-span-4 flex items-start justify-between gap-6 border-b border-rule-strong p-3 md:col-span-2 md:flex-col md:justify-between md:border-b-0 md:border-r md:p-4">
                <p className="display text-5xl tabular-nums md:text-7xl">
                  {pad(index + 1)}
                </p>
                <dl className="text-[0.65rem] tracking-[0.12em] uppercase">
                  {[
                    { label: "language", value: repo.language || "mixed" },
                    { label: "size", value: formatBytes(repo.bytes) },
                    { label: "stars", value: String(repo.stars) },
                    { label: "pushed", value: formatMonth(repo.pushedAt) },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between gap-4 border-b border-rule py-1 last:border-b-0 md:block md:border-b-0"
                    >
                      <dt className="text-muted">{item.label}</dt>
                      <dd className="tabular-nums">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="col-span-4 flex flex-col gap-6 p-3 md:col-span-4 md:p-4">
                <div>
                  <h3 className="display text-4xl break-words md:text-6xl">
                    {repo.name}
                  </h3>
                  {summary(repo) ? (
                    <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-muted md:text-lg">
                      {summary(repo)}
                    </p>
                  ) : null}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {Object.entries(repo.languages)
                      .slice(0, 6)
                      .map(([language]) => (
                        <li
                          key={language}
                          className="border border-rule-strong px-2 py-1 text-[0.6rem] font-bold tracking-[0.12em] uppercase"
                        >
                          {language}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mt-auto flex flex-wrap gap-3">
                  <Cta href={repo.url} label="view on github" external />
                  {repo.homepage ? (
                    <Cta href={repo.homepage} label="live site" external />
                  ) : null}
                </div>
              </div>

              <div className="relative col-span-4 min-h-[220px] border-t border-rule-strong text-ink md:col-span-4 md:min-h-0 md:border-t-0 md:border-l">
                <span aria-hidden="true" className="block h-full w-full">
                  <RepoCover name={repo.name} variant="panel" />
                </span>
                <span className="absolute bottom-3 left-3 bg-ink px-2 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-surface uppercase">
                  {repo.name}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
