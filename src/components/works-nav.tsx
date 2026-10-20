"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pad = (value: number) => String(value).padStart(2, "0");

/** Wheel distance that buys the next project. */
const SCROLL_THRESHOLD = 120;

type WorksNavProps = {
  /** The names of the featured projects, for the index. Nothing else. */
  names: string[];
};

/**
 * The navigation of the works: the index bar and the wheel that walks the
 * projects. The panels themselves are rendered on the server and are not part
 * of this component, so the project data never crosses to the browser.
 */
export function WorksNav({ names }: WorksNavProps) {
  const [active, setActive] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const accumulated = useRef(0);
  /** Where each project is anchored, measured once instead of on every tick. */
  const anchors = useRef<number[]>([]);

  const section = useCallback(
    () => document.getElementById("works"),
    [],
  );

  const panels = useCallback(
    () =>
      Array.from(
        section()?.querySelectorAll("[data-panel]") ?? [],
      ) as HTMLElement[],
    [section],
  );

  /** Reads the layout once: the anchor of every project, in page positions. */
  const measure = useCallback(() => {
    const bar = barRef.current;

    if (!bar) return;

    const offset =
      Number.parseFloat(getComputedStyle(bar).top) + bar.offsetHeight;

    anchors.current = panels().map((panel) =>
      panel.getBoundingClientRect().top + window.scrollY - offset,
    );
  }, [panels]);

  /** Page movements respect the visitor's motion preference. */
  const scrollBehavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";

  const goTo = (index: number) => {
    const works = section();

    window.scrollTo({ top: anchors.current[index] ?? 0, behavior: "instant" });

    if (!works) return;

    // The project that arrives fades in, so the change reads as a change and
    // not as a panel crossing the screen.
    works.classList.remove("is-swapping");
    void works.offsetWidth;
    works.classList.add("is-swapping");
    window.setTimeout(() => works.classList.remove("is-swapping"), 320);
  };

  // The project in view is the last one that reached its anchor.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      let current = 0;

      anchors.current.forEach((anchor, index) => {
        if (anchor <= y + 2) current = index;
      });

      setActive((previous) => (previous === current ? previous : current));

      panels().forEach((panel, index) => {
        if (index === current) panel.setAttribute("data-active", "true");
        else panel.removeAttribute("data-active");
      });
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const observer = new ResizeObserver(onResize);
    const works = section();

    if (works) observer.observe(works);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [measure, panels, section]);

  // The wheel walks the projects one at a time while the works are on screen.
  // At the ends, and on a hard fling, the page takes over with a clean
  // handover instead of leaving a project half out of the screen.
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      // A pinch to zoom is not a navigation gesture.
      if (event.ctrlKey) return;

      // The menu overlay owns the wheel while it is open.
      if (document.body.style.overflow === "hidden") return;

      if (names.length === 0) return;

      const works = section();

      if (!works) return;

      const first = anchors.current[0] ?? 0;
      const last = anchors.current[names.length - 1] ?? 0;
      const down = event.deltaY > 0;
      const sectionBottom =
        works.getBoundingClientRect().bottom + window.scrollY;

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

      if (target >= names.length) {
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
  }, [active, names.length, section]);

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

      if (document.body.style.overflow === "hidden") return;

      if (names.length === 0) return;

      const first = anchors.current[0] ?? 0;
      const last = anchors.current[names.length - 1] ?? 0;

      if (window.scrollY < first - 1 || window.scrollY > last + 1) return;

      event.preventDefault();
      goTo(Math.min(Math.max(target, 0), names.length - 1));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, names.length]);

  return (
    <div
      ref={barRef}
      className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 flex h-8 items-center justify-between gap-4 border-b border-rule-strong bg-surface px-3 md:top-[calc(4rem+env(safe-area-inset-top))] md:px-4"
    >
      <p className="eyebrow">scroll to browse</p>
      <ul className="hidden items-center gap-4 md:flex">
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
      <p className="flex min-w-0 items-center gap-2 text-[0.65rem] font-bold tracking-[0.18em] uppercase">
        <span className="tabular-nums text-muted">
          {pad(active + 1)}/{pad(names.length)}
        </span>
        <span aria-hidden="true" className="opacity-40">
          /
        </span>
        <span className="truncate">{names[active]}</span>
      </p>
    </div>
  );
}
