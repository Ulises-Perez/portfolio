"use client";

import { useEffect, useState } from "react";

import { Mark } from "@/components/orbi/mark";
import { Icon } from "@/components/orbi/icons";
import { site } from "@/data/site.config";

/**
 * The top bar of the system.
 *
 * One quiet pill at the top right: the compact mark with the name and the
 * version of the system, the availability of the developer, the palette
 * shortcut, the theme switch, the clock and the door out. It is chrome of the
 * instrument — information, never decoration — and it collapses on a phone
 * to the name, the status and the two controls that have no other home.
 */

const VERSION = "0.1";

export function TopBar({
  theme,
  onTheme,
  onPalette,
}: {
  theme: "light" | "dark";
  onTheme: () => void;
  onPalette: () => void;
}) {
  const [clock, setClock] = useState<Date | null>(null);

  useEffect(() => {
    setClock(new Date());
    const id = setInterval(() => setClock(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // The clock ticks after the mount, so the server and the first client frame
  // agree and the shell never hydrates over its own text.
  const time = clock
    ? clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <div className="os-bar" role="toolbar" aria-label="System">
      <span className="os-bar__brand">
        <Mark size={15} />
        <b>orbiOS</b>
        <span className="os-bar__ver">v{VERSION}</span>
      </span>

      <span className="os-bar__split" aria-hidden="true" />

      <span className="os-bar__status">
        <span className="os-bar__dot" aria-hidden="true" />
        ONLINE
      </span>

      <button
        type="button"
        className="os-bar__key"
        aria-label="Open command palette"
        aria-keyshortcuts="Control+K Meta+K"
        onClick={onPalette}
      >
        ⌘K
      </button>

      <button
        type="button"
        className="os-bar__btn"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        aria-pressed={theme === "dark"}
        onClick={onTheme}
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} size={15} />
      </button>

      <span className="os-bar__clock" aria-label="Local time">
        {time}
      </span>

      <a
        className="os-bar__btn"
        href={site.contact.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub profile"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {/* The GitHub mark, for the profile link. */}
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.05.78 2.12 0 1.53-.02 2.76-.02 3.14 0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      </a>
    </div>
  );
}
