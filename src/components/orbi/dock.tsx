"use client";

import { AppTile } from "@/components/orbi/app-tile";
import { Icon } from "@/components/orbi/icons";
import { useWindowManager } from "@/components/orbi/window-manager";
import { APPS, SYSTEM_APPS } from "@/lib/orbi";

/**
 * The dock.
 *
 * It holds the system applications, and it also shows a project app while
 * that project is open or minimized — the visitor closes the window from here,
 * or brings it back. A project that is not open has no place in the dock: it
 * lives on the desktop grid, and the dock only mirrors what is running.
 *
 * The theme switch and the command palette live in the top bar; the dock is
 * applications only.
 */
export function Dock() {
  const { windows, focused, open, focus } = useWindowManager();

  const projects = APPS.filter(
    (app) =>
      app.surface === "desktop" && windows.some((win) => win.id === app.id),
  );

  return (
    <div className="os-dock">
      <div className="os-dock__inner" role="toolbar" aria-label="Applications">
        {[...SYSTEM_APPS, ...projects].map((app) => {
          const win = windows.find((entry) => entry.id === app.id);
          const project = app.surface === "desktop";

          return (
            <button
              key={app.id}
              type="button"
              className="os-dock__item"
              data-active={focused === app.id && !win?.minimized ? "" : undefined}
              data-open={win ? "" : undefined}
              aria-label={app.title}
              aria-pressed={Boolean(win) && !win?.minimized}
              onClick={() => (win?.minimized ? focus(app.id) : open(app.id))}
            >
              {project ? (
                <AppTile
                  initial={app.initial}
                  glyph={app.glyph}
                  accent={app.accent}
                  size={20}
                  radius={6}
                />
              ) : (
                <Icon name={app.id as never} size={20} />
              )}
              <span className="os-dock__dot" aria-hidden="true" />
              <span className="os-dock__label" aria-hidden="true">
                {app.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
