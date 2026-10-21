"use client";

import { useCallback, useEffect, useRef } from "react";

/** Wheel distance that buys the next work. */
const SCROLL_THRESHOLD = 120;

/** Milliseconds without a wheel event that start a new gesture. */
const GESTURE_GAP = 120;

/** The share of the stage the opening takes before the works travel. */
const REVEAL = 0.5;

/** Whether the works are pinned, or stacked because the screen is too short. */
function isPinned(stage: HTMLElement): boolean {
  return (
    getComputedStyle(stage).getPropertyValue("--works-pinned").trim() !== "0"
  );
}

type WorksCarouselProps = {
  /** How many works the track holds. */
  count: number;
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
export function WorksCarousel({ count, children }: WorksCarouselProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const accumulated = useRef(0);
  /** When the last wheel event came, and whether it already bought a work. */
  const lastWheel = useRef(0);
  const moved = useRef(false);

  /** Where the section stands in the page and how far it travels. */
  const geometry = useCallback(() => {
    const runway = runwayRef.current;
    const stage = stageRef.current;

    if (!runway || !stage) return null;

    // On a phone too short to hold a work the works stack down the page, and
    // there is no travel to drive.
    if (!isPinned(stage)) return null;

    const top = runway.getBoundingClientRect().top + window.scrollY;
    // The whole runway travels once: the opening takes a piece of it, and the
    // works share the rest.
    const total = runway.offsetHeight - stage.offsetHeight;
    const reveal = stage.offsetHeight * REVEAL;
    const travel = Math.max(total - reveal, 1);
    const perWork = travel / Math.max(count - 1, 1);
    // The stage holds under the header, so the first work is seated when the
    // runway has reached the top of the screen, not the top of the runway.
    const offset = Number.parseFloat(getComputedStyle(stage).top) || 0;

    return {
      top: top - offset,
      reveal,
      travel,
      perWork,
      // The closing: the work shrinks back to the width of the page while the
      // section leaves, and the rules of the page go back to the column.
      closeStart: top - offset + reveal + travel,
      close: stage.offsetHeight * REVEAL,
    };
  }, [count]);

  /** The work in view, counted from the travel. */
  const currentIndex = useCallback(() => {
    const geo = geometry();

    if (!geo) return 0;

    const progress = Math.min(
      Math.max((window.scrollY - geo.top - geo.reveal) / geo.travel, 0),
      1,
    );

    return Math.round(progress * (count - 1));
  }, [count, geometry]);

  /** Writes the travel of the track and the position of every card. */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    const runway = runwayRef.current;
    const geo = geometry();

    if (!stage || !track) return;

    const cards = track.querySelectorAll<HTMLElement>("[data-card]");

    // Stacked works are all of them in view: no travel, no fade, nothing out
    // of the way of the keyboard.
    if (!geo) {
      runway?.style.setProperty("--reveal", "1");

      cards.forEach((card) => {
        card.style.setProperty("--p", "0");
        card.style.setProperty("--d", "0");
        card.inert = false;
      });

      return;
    }

    const scroll = window.scrollY;

    // The opening: the work grows from the width of the page to the whole
    // width of the screen while the visitor scrolls into the section, and it
    // shrinks back when the section leaves.
    const reveal = Math.min(Math.max((scroll - geo.top) / geo.reveal, 0), 1);

    const opened = Math.min(
      Math.max((scroll - geo.closeStart) / geo.close, 0),
      1,
    );

    runway?.style.setProperty("--reveal", (reveal * (1 - opened)).toFixed(4));

    // The travel of the works starts when the opening is done.
    const progress =
      geo.travel > 0
        ? Math.min(
            Math.max((scroll - geo.top - geo.reveal) / geo.travel, 0),
            1,
          )
        : 0;

    track.style.setProperty("--p", progress.toFixed(5));

    const bounds = stage.getBoundingClientRect();
    const half = bounds.width / 2;
    const middle = bounds.left + half;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const position = (rect.left + rect.width / 2 - middle) / half;
      const distance = Math.abs(position);

      card.style.setProperty("--p", position.toFixed(4));
      card.style.setProperty("--d", distance.toFixed(4));

      // A work that is not in view is out of the way: the keyboard does not
      // walk into a link nobody can see.
      card.inert = distance > 0.6;
    });
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

      if (!geo) {
        // The works are stacked: the card is brought into the screen.
        const card = trackRef.current?.querySelectorAll<HTMLElement>(
          "[data-card]",
        )[index];

        card?.scrollIntoView({
          block: "center",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });

        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({
        top: geo.top + geo.reveal + index * geo.perWork,
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

      if (count === 0) return;

      const geo = geometry();

      if (!geo) return;

      const y = window.scrollY;
      const down = event.deltaY > 0;

      // The works answer the wheel once the opening is done, and until the
      // last one is on screen. Outside that the page scrolls as usual.
      if (
        y < geo.top + geo.reveal - 1 ||
        y > geo.top + geo.reveal + geo.travel + 1
      ) {
        return;
      }

      // A hard fling means the visitor wants to leave, not to walk.
      if (Math.abs(event.deltaY) > 240) {
        accumulated.current = 0;
        return;
      }

      // A gesture is a burst of wheel events. A new one starts the count
      // again, and it is the one that buys the next work.
      const now = Date.now();

      if (now - lastWheel.current > GESTURE_GAP) {
        accumulated.current = 0;
        moved.current = false;
      }

      lastWheel.current = now;

      const target = currentIndex() + (down ? 1 : -1);

      // At the ends the page takes the wheel back, and it takes it whole: a
      // gesture under the threshold must not be swallowed there.
      if (target >= count || target < 0) {
        accumulated.current = 0;
        return;
      }

      // One gesture buys one work: a fling does not fly over the section.
      if (moved.current) {
        event.preventDefault();
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
      moved.current = true;

      event.preventDefault();
      goTo(target);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => window.removeEventListener("wheel", onWheel);
  }, [count, currentIndex, geometry, goTo]);

  // The keyboard walks the works the same way.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const current = currentIndex();
      const keys: Record<string, number> = {
        ArrowDown: current + 1,
        ArrowRight: current + 1,
        PageDown: current + 1,
        ArrowUp: current - 1,
        ArrowLeft: current - 1,
        PageUp: current - 1,
      };

      const target = keys[event.key];

      if (target === undefined) return;

      if (document.body.style.overflow === "hidden") return;

      if (count === 0) return;

      const geo = geometry();

      if (!geo) return;

      const y = window.scrollY;

      if (
        y < geo.top + geo.reveal - 1 ||
        y > geo.top + geo.reveal + geo.travel + 1
      ) {
        return;
      }

      event.preventDefault();
      goTo(Math.min(Math.max(target, 0), count - 1));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [count, currentIndex, geometry, goTo]);

  return (
    <div
      ref={runwayRef}
      className="works-runway"
      style={{ "--work-count": count } as React.CSSProperties}
    >
      <div ref={stageRef} className="works-stage">
        {/* The rules of the page: they hold the column the site is built on,
            and when a work breaks out of the column to take the whole screen
            they travel with it to the edges of the screen. */}
        <span className="works-rule works-rule--left" aria-hidden="true" />
        <span className="works-rule works-rule--right" aria-hidden="true" />

        <div ref={trackRef} className="works-track">
          {children}
        </div>
      </div>
    </div>
  );
}
