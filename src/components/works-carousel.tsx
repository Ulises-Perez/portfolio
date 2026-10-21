"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pad = (value: number) => String(value).padStart(2, "0");

/** Wheel distance that buys the next work. */
const SCROLL_THRESHOLD = 120;

/** Whether the works are pinned, or stacked because the screen is too short. */
function isPinned(stage: HTMLElement): boolean {
  return (
    getComputedStyle(stage).getPropertyValue("--works-pinned").trim() !== "0"
  );
}

type WorksCarouselProps = {
  /** The names of the featured works, for the index. Nothing else. */
  names: string[];
  children?: React.ReactNode;
};

/**
 * The works, read sideways with the scroll held in place.
 *
 * The runway is as tall as the section needs: one stage per work. The stage
 * is a sticky element the height of the screen under the header, so it holds
 * for the whole section while the page travels the works sideways. The script
 * writes the travel of the track in `--p`, and the position of every card in
 * `--p` and `--d`, so the name, the description, the technologies and the
 * frame can travel on their own.
 *
 * The wheel is turned into a move of exactly one work, the way it was before:
 * a gesture buys one work, a gesture under the threshold buys nothing, and a
 * change of direction starts the count again. Past the last work the page
 * takes the wheel back and carries on into the next section.
 */
export function WorksCarousel({ names, children }: WorksCarouselProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const pending = useRef(false);
  const accumulated = useRef(0);

  /** Where the section stands in the page and how far it travels. */
  const geometry = useCallback(() => {
    const runway = runwayRef.current;
    const stage = stageRef.current;

    if (!runway || !stage) return null;

    // On a phone too short to hold a work the works stack down the page, and
    // there is no travel to drive.
    if (!isPinned(stage)) return null;

    const top = runway.getBoundingClientRect().top + window.scrollY;
    // The whole runway travels once, and the travel is divided between the
    // works, so each one of them takes its share of it.
    const travel = runway.offsetHeight - stage.offsetHeight;
    const perWork = travel / Math.max(names.length - 1, 1);
    // The stage holds under the header, so the first work is seated when the
    // runway has reached the top of the screen, not the top of the runway.
    const offset = Number.parseFloat(getComputedStyle(stage).top) || 0;

    return { top: top - offset, travel, perWork };
  }, [names.length]);

  /** Writes the travel of the track and the position of every card. */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    const geo = geometry();

    if (!stage || !track) return;

    const cards = track.querySelectorAll<HTMLElement>("[data-card]");

    // Stacked works are all of them in view: no travel, no fade, nothing out
    // of the way of the keyboard.
    if (!geo) {
      cards.forEach((card) => {
        card.style.setProperty("--p", "0");
        card.style.setProperty("--d", "0");
        card.inert = false;
      });

      return;
    }

    const progress =
      geo.travel > 0
        ? Math.min(Math.max((window.scrollY - geo.top) / geo.travel, 0), 1)
        : 0;

    track.style.setProperty("--p", progress.toFixed(5));

    const bounds = stage.getBoundingClientRect();
    const half = bounds.width / 2;
    const middle = bounds.left + half;

    let closest = 0;
    let nearest = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const position = (rect.left + rect.width / 2 - middle) / half;
      const distance = Math.abs(position);

      card.style.setProperty("--p", position.toFixed(4));
      card.style.setProperty("--d", distance.toFixed(4));

      // A work that is not in view is out of the way: the keyboard does not
      // walk into a link nobody can see.
      card.inert = distance > 0.6;

      if (distance < nearest) {
        nearest = distance;
        closest = index;
      }
    });

    setActive((previous) => (previous === closest ? previous : closest));
  }, [geometry]);

  /** One measurement per frame, however fast the visitor scrolls. */
  const schedule = useCallback(() => {
    if (pending.current) return;

    pending.current = true;
    window.requestAnimationFrame(() => {
      pending.current = false;
      measure();
    });
  }, [measure]);

  /** Takes the page to the place where a work sits. */
  const goTo = useCallback(
    (index: number) => {
      const geo = geometry();

      if (!geo) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({
        top: geo.top + index * geo.perWork,
        behavior: reduced ? "instant" : "smooth",
      });
    },
    [geometry],
  );

  useEffect(() => {
    measure();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const observer = new ResizeObserver(schedule);
    const stage = stageRef.current;

    if (stage) observer.observe(stage);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [measure, schedule]);

  // The wheel walks the works one at a time while they are on screen.
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      // A pinch to zoom is not a navigation gesture.
      if (event.ctrlKey) return;

      // The menu overlay owns the wheel while it is open.
      if (document.body.style.overflow === "hidden") return;

      if (names.length === 0) return;

      const geo = geometry();

      if (!geo) return;

      const y = window.scrollY;
      const down = event.deltaY > 0;

      // Outside the works the page scrolls as usual.
      if (y < geo.top - 1 || y > geo.top + geo.travel + 1) return;

      // A hard fling means the visitor wants to leave, not to walk.
      if (Math.abs(event.deltaY) > 240) {
        accumulated.current = 0;
        return;
      }

      const target = active + (down ? 1 : -1);

      // At the ends the page takes the wheel back, and it takes it whole: a
      // gesture under the threshold must not be swallowed there.
      if (target >= names.length || target < 0) {
        accumulated.current = 0;
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

      event.preventDefault();
      goTo(target);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => window.removeEventListener("wheel", onWheel);
  }, [active, geometry, goTo, names.length]);

  // The keyboard walks the works the same way.
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

      if (document.body.style.overflow === "hidden") return;

      if (names.length === 0) return;

      const geo = geometry();

      if (!geo) return;

      const y = window.scrollY;

      if (y < geo.top - 1 || y > geo.top + geo.travel + 1) return;

      event.preventDefault();
      goTo(Math.min(Math.max(target, 0), names.length - 1));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, geometry, goTo, names.length]);

  return (
    <div
      ref={runwayRef}
      className="works-runway"
      style={{ "--work-count": names.length } as React.CSSProperties}
    >
      <div ref={stageRef} className="works-stage">
        <div className="works-bar">
          <p className="eyebrow">scroll to browse</p>

          <ul className="works-bar__index">
            {names.map((name, index) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to ${name}`}
                  aria-current={index === active ? "true" : undefined}
                  className={[
                    "cursor-pointer text-[0.65rem] font-bold tracking-[0.12em] tabular-nums transition-opacity",
                    index === active ? "opacity-100" : "text-muted hover:opacity-100",
                  ].join(" ")}
                >
                  {pad(index + 1)}
                </button>
              </li>
            ))}
          </ul>

          <p className="works-bar__now">
            <span className="tabular-nums text-muted">
              {pad(active + 1)}/{pad(names.length)}
            </span>
            <span aria-hidden="true" className="opacity-40">
              /
            </span>
            <span className="truncate">{names[active]}</span>
          </p>

          <div className="works-bar__arrows">
            <button
              type="button"
              onClick={() => goTo(Math.max(active - 1, 0))}
              disabled={active === 0}
              aria-label="Previous work"
              className="works-bar__arrow"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goTo(Math.min(active + 1, names.length - 1))}
              disabled={active === names.length - 1}
              aria-label="Next work"
              className="works-bar__arrow"
            >
              →
            </button>
          </div>
        </div>

        <div ref={trackRef} className="works-track">
          {children}
        </div>
      </div>
    </div>
  );
}
