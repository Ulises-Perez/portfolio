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

    // The two variables of the stylesheet travel on their own, so the whole
    // page changes together without every element carrying a transition.
    root.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);

    // The browser chrome follows the page.
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );

    if (meta) meta.content = theme === "dark" ? DARK : LIGHT;
  }, [theme, mounted]);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-pressed={theme === "dark"}
      onClick={() => setTheme(next)}
      className="roll group/roll flex h-full cursor-pointer items-center gap-2.5 px-4 hover:bg-ink hover:text-surface disabled:cursor-default mr-14 md:mr-16"
    >
      {/* Two copies of the label that roll into each other. Which one reads
          "light" and which one reads "dark" is decided by the stylesheet,
          from the theme the document already carries. */}
      <span className="theme-label relative block shrink-0 overflow-hidden leading-[1.4] text-[0.65rem] tracking-[0.18em] uppercase">
        <span className="theme-label__out block transition-transform duration-[var(--roll-duration)] ease-[var(--roll-ease)] group-hover/roll:translate-y-full" />
        <span
          aria-hidden="true"
          className="theme-label__in absolute inset-0 block -translate-y-full transition-transform duration-[var(--roll-duration)] ease-[var(--roll-ease)] group-hover/roll:translate-y-0"
        />
      </span>

      <span
        aria-hidden="true"
        className="relative block h-3 w-3 overflow-hidden border border-ink transition-[border-color] duration-[var(--roll-duration)] ease-[var(--roll-ease)] group-hover/roll:border-surface"
      >
        <span className="theme-switch absolute inset-0 bg-ink group-hover/roll:bg-surface" />
      </span>

      <span className="sr-only">theme</span>
    </button>
  );
}
