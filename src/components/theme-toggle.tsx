"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";
const LIGHT = "#b2c7ab";
const DARK = "#0c0d0d";

/**
 * Light/dark switch.
 *
 * The theme of the page lives in the document: the script in the layout
 * applies the stored theme before the first paint. The label of the button
 * and the position of its switch are drawn by the stylesheet from that
 * theme, so the server does not have to know it and the page never has to be
 * regenerated on the client.
 *
 * The state here only carries what the button has to announce, and it starts
 * on the value the server rendered, so the first paint of the browser and the
 * markup the server sent are the same thing.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial =
      stored === "dark" || (!stored && prefersDark) ? "dark" : "light";

    setTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // The class goes on before the values change, so the page travels to the
    // new theme instead of jumping, and it comes off once the travel is over.
    root.classList.add("theme-flip");
    root.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);

    // The browser chrome follows the page.
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );

    if (meta) meta.content = theme === "dark" ? DARK : LIGHT;

    const timer = window.setTimeout(() => {
      root.classList.remove("theme-flip");
    }, 460);

    return () => window.clearTimeout(timer);
  }, [theme, mounted]);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-pressed={theme === "dark"}
      onClick={() => setTheme(next)}
      className="group/roll flex h-full cursor-pointer items-center gap-2.5 px-4 transition-colors hover:bg-ink hover:text-surface disabled:cursor-default mr-14 md:mr-16"
    >
      {/* Two copies of the label that roll into each other. Which one reads
          "light" and which one reads "dark" is decided by the stylesheet,
          from the theme the document already carries. */}
      <span className="theme-label relative block shrink-0 overflow-hidden leading-[1.4] text-[0.65rem] tracking-[0.18em] uppercase">
        <span className="theme-label__out block transition-transform duration-450 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/roll:translate-y-full" />
        <span
          aria-hidden="true"
          className="theme-label__in absolute inset-0 block -translate-y-full transition-transform duration-450 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/roll:translate-y-0"
        />
      </span>

      <span
        aria-hidden="true"
        className="relative block h-3 w-3 overflow-hidden border border-ink transition-colors group-hover/roll:border-surface"
      >
        <span className="theme-switch absolute inset-0 bg-ink transition-colors group-hover/roll:bg-surface" />
      </span>

      <span className="sr-only">theme</span>
    </button>
  );
}
