"use client";

import { useEffect, useRef, useState } from "react";

import { Cta } from "@/components/cta";
import { RepoCover } from "@/components/repo-cover";
import { featuredRepos } from "@/lib/github";
import { formatBytes, formatMonth } from "@/lib/utils";

const pad = (value: number) => String(value).padStart(2, "0");

/** Height of the sticky index bar, in pixels. The panels clear it. */
const BAR_HEIGHT = 32;

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
 * The featured projects, one at a time, on a track that fills the screen.
 * One scroll swaps one project and the track anchors on it: the track is its
 * own scroll container with mandatory snapping, and a wheel gesture is turned
 * into a move of exactly one panel, so the visitor never ends up halfway
 * between two projects. At the last project the wheel is left alone and the
 * page carries on into the next section.
 */
export function Works() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const panelAt = (index: number) =>
    trackRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`) ?? null;

  const goTo = (index: number, smooth = true) => {
    const track = trackRef.current;
    const panel = panelAt(index);

    if (!track || !panel) return;

    track.scrollTo({
      top: panel.offsetTop - BAR_HEIGHT,
      behavior: smooth ? "smooth" : "instant",
    });
  };

  // The project in view is the last one whose top has passed the index bar.
  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const onScroll = () => {
      const trackRect = track.getBoundingClientRect();
      // The project in view is the one that holds the middle of the track.
      const line = trackRect.top + BAR_HEIGHT + (trackRect.height - BAR_HEIGHT) / 2;
      let current = 0;

      track.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel, index) => {
        if (panel.getBoundingClientRect().top <= line) current = index;
      });

      setActive(current);
    };

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });

    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
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

    event.preventDefault();
    goTo(Math.min(Math.max(target, 0), featuredRepos.length - 1));
  };

  // One wheel gesture moves exactly one project, and the ends of the track
  // are left to the page so the section can be left downwards.
  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      const track = trackRef.current;
      const anchor = anchorRef.current;

      // Until the track reaches its anchored position the page still has to
      // move, so the wheel moves the page and the works take over only once
      // the first project fills the screen.
      if (track && anchor) {
        const stickyTop = Number.parseFloat(getComputedStyle(anchor).top) || 0;

        if (track.getBoundingClientRect().top > stickyTop + 1) {
          event.preventDefault();
          window.scrollBy({ top: event.deltaY });
          return;
        }
      }

      const next = active + (event.deltaY > 0 ? 1 : -1);

      if (next < 0 || next >= featuredRepos.length) return;

      event.preventDefault();
      goTo(next);
    };

    track.addEventListener("wheel", onWheel, { passive: false });

    return () => track.removeEventListener("wheel", onWheel);
  }, [active]);

  if (featuredRepos.length === 0) return null;

  return (
    <section id="works" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong pb-0 md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">selected</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">works.</h2>
            </div>
          </div>

          {/* The track sticks under the header and fills the rest of the
              screen, so every project lands on a full viewport. */}
          <div ref={anchorRef} className="sticky top-14 z-10 md:top-16">
            <div
              ref={trackRef}
              tabIndex={0}
              role="group"
              aria-label="Featured projects"
              onKeyDown={onKeyDown}
              className="works-track relative h-[calc(100svh-3.5rem)] overflow-y-auto snap-y snap-mandatory md:h-[calc(100svh-4rem)]"
            >
              {/* Names the project in view and jumps straight to any of them. */}
              <div className="sticky top-0 z-20 flex h-8 items-center justify-between gap-4 border-b border-rule-strong bg-surface px-3 md:px-4">
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
                  data-panel
                  data-index={index}
                  className="grid h-[calc(100%-2rem)] snap-start scroll-mt-8 grid-cols-4 border-b border-rule-strong md:grid-cols-10"
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
        </div>
      </div>
    </section>
  );
}
