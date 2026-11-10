"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Boot } from "@/components/orbi/boot";
import { CommandPalette } from "@/components/orbi/command-palette";
import { ContextMenu, type MenuItem } from "@/components/orbi/context-menu";
import { DesktopIcons, dropAt, type Places } from "@/components/orbi/desktop-icons";
import { DesktopPreferences } from "@/components/orbi/desktop-preferences";
import { DESKTOP_APPS } from "@/lib/orbi";
import {
  clampPlaces,
  defaultPlaces,
  forgetPlaces,
  readPlaces,
  writePlaces,
  type Store,
} from "@/lib/icon-places";
import type { Point } from "@/lib/layout";
import {
  loadWallpaper,
  saveWallpaper,
  WALLPAPERS,
  type WallpaperId,
} from "@/lib/wallpaper";
import { Dock } from "@/components/orbi/dock";
import { Emblem } from "@/components/orbi/emblem";
import { OrbitalField } from "@/components/orbi/field";
import { TopBar } from "@/components/orbi/topbar";
import { Wordmark } from "@/components/orbi/wordmark";
import { WindowFrame, useWindowManager } from "@/components/orbi/window-manager";
import { ExplorerApp } from "@/components/apps/explorer";
import { MonitorApp } from "@/components/apps/monitor";
import { ConnectApp } from "@/components/apps/connect";
import { CodeStudioApp } from "@/components/apps/code-studio";
import { TerminalApp } from "@/components/apps/terminal-app";
import { PlaygroundApp } from "@/components/apps/playground";
import { lazy, Suspense } from "react";
import { site } from "@/data/site.config";
import { appMeta, projectOf, parseHash, routeHash } from "@/lib/orbi";
import { ProjectLoading } from "@/components/orbi/project-loading";
import type { Glyph } from "@/data/site.config";
import { hasLoaded, markLoaded } from "@/lib/project-load";

type Theme = "light" | "dark";

const THEME_KEY = "portfolio-theme";

/**
 * The commands of a right click on the desktop.
 *
 * They are built here, not in the menu, so the menu stays a dumb list and the
 * commands can be read in one place: file the icons, choose a wallpaper, open
 * the preferences, put every window away.
 */
function desktopMenu(actions: {
  onPreferences: () => void;
  onTidy: () => void;
  onReset: () => void;
  onPalette: () => void;
  onMinimizeAll: () => void;
  onWallpaper: (id: WallpaperId) => void;
}): MenuItem[] {
  return [
    { id: "prefs", label: "Desktop preferences…", run: actions.onPreferences },
    { id: "tidy", label: "Tidy up icons", run: actions.onTidy },
    { id: "reset", label: "Restore icon positions", run: actions.onReset },
    { id: "palette", label: "Command palette…", hint: "⌘K", apart: true, run: actions.onPalette },
    { id: "hide", label: "Put all windows away", apart: true, run: actions.onMinimizeAll },
    ...WALLPAPERS.map((option, index) => ({
      id: `wallpaper-${option.id}`,
      label: `Wallpaper: ${option.label}`,
      apart: index === 0,
      run: () => actions.onWallpaper(option.id),
    })),
  ];
}

/** `sessionStorage`, or nothing when the browser refuses to expose it. */
function safeSession(): Store | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * A project's application is its own chunk, fetched the first time it is
 * opened. The loading screen inside the window covers that fetch, so the
 * screen reports a real wait instead of pretending to work.
 */
const ProjectApp = lazy(() =>
  import("@/components/apps/project-app").then((module) => ({
    default: module.ProjectApp,
  })),
);

/**
 * The desktop environment.
 *
 * It owns the two things every window shares: the theme and the address. Everything else belongs to the window manager below it.
 *
 * The address is the navigation. `#/projects/nexo` opens the hub at nexo, so a
 * project is a link a visitor can send, and the system boots straight into it.
 */
/** The content of one window, system app or project app. */
function AppContent({
  id,
  theme,
  onTheme,
  onProject,
}: {
  id: string;
  theme: Theme;
  onTheme: (mode: Theme) => void;
  onProject: (name: string) => void;
}) {
  switch (id) {
    case "explorer":
      return <ExplorerApp />;
    case "monitor":
      return <MonitorApp />;
    case "connect":
      return <ConnectApp />;
    case "code":
      return <CodeStudioApp />;
    case "terminal":
      return <TerminalApp onTheme={onTheme} onProject={onProject} />;
    case "playground":
      return <PlaygroundApp />;
  }

  return null;
}

/** A project window: its own loading screen, then its own application. */
function ProjectWindow({
  project,
  accent,
  initial,
  glyph,
  children,
}: {
  project: string;
  accent?: string;
  initial: string;
  glyph?: Glyph;
  children: React.ReactNode;
}) {
  // The first open of the session shows the screen; a reopen does not.
  const [loading, setLoading] = useState(() => !hasLoaded(project));

  const done = useCallback(() => {
    markLoaded(project);
    setLoading(false);
  }, [project]);

  if (!loading) return <>{children}</>;

  return (
    <>
      <ProjectLoading
        project={project}
        accent={accent}
        initial={initial}
        glyph={glyph}
        onDone={done}
      />
      {/* The chunk is fetched while the screen shows; the content is already
          mounted under it, so the exit reveals it instead of waiting again. */}
      <div aria-hidden="true" className="os-app-hold">
        {children}
      </div>
    </>
  );
}

export function Desktop() {
  const { windows, open, close, minimizeAll } = useWindowManager();
  const [theme, setTheme] = useState<Theme>("dark");
  const [booting, setBooting] = useState(true);
  const [palette, setPalette] = useState(false);
  const [route, setRoute] = useState<{ app: string; project?: string } | null>(null);
  const [wallpaper, setWallpaper] = useState<WallpaperId>("orbital");
  const [places, setPlaces] = useState<Places>({});
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [prefs, setPrefs] = useState(false);

  // The desktop has been measured: the icons take their places.
  const deskSize = () => {
    const el = document.querySelector<HTMLElement>(".os-desktop");

    return {
      // A zero measurement is a desktop not laid out yet, not an empty one:
      // the window is the floor, so the grid never files into one cell.
      width: el?.clientWidth || window.innerWidth,
      height: el?.clientHeight || window.innerHeight,
    };
  };

  // The theme the layout applied before the first paint is the one we start on.
  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.dataset.theme === "light" ? "light" : "dark");
  }, []);

  /**
   * The wallpaper and the places of the icons are the visitor's, not the
   * session's: the wallpaper is kept in `localStorage` and survives a visit,
   * the places in `sessionStorage` and survive a reload.
   */
  useEffect(() => {
    setWallpaper(loadWallpaper());
    setPlaces(
      readPlaces(safeSession(), DESKTOP_APPS.map((app) => app.id), deskSize()),
    );

    const onResize = () => {
      setPlaces((current) => clampPlaces(current, deskSize()));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const applyWallpaper = useCallback((id: WallpaperId) => {
    setWallpaper(id);
    saveWallpaper(id);
  }, []);

  const dropIcon = useCallback((id: string, point: Point) => {
    setPlaces((current) => {
      const next = dropAt(current, id, point, deskSize());
      writePlaces(safeSession(), next);
      return next;
    });
  }, []);

  const tidyIcons = useCallback(() => {
    const next = defaultPlaces(
      DESKTOP_APPS.map((app) => app.id),
      deskSize(),
    );
    writePlaces(safeSession(), next);
    setPlaces(next);
  }, []);

  const resetIcons = useCallback(() => {
    forgetPlaces(safeSession());
    setPlaces(
      defaultPlaces(
        DESKTOP_APPS.map((app) => app.id),
        deskSize(),
      ),
    );
  }, []);

  const applyTheme = useCallback((mode: Theme) => {
    document.documentElement.dataset.theme = mode;
    setTheme(mode);

    try {
      window.localStorage.setItem(THEME_KEY, mode);
    } catch {
      /* storage is optional */
    }

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = mode === "dark" ? "#101216" : "#f2f3f5";
  }, []);

  const go = useCallback(
    (app: string, project?: string) => {
      open(app, project);
      setRoute({ app, project });
      const hash = routeHash({ app, project });

      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    },
    [open],
  );

  // The address is read on load and every time it changes: a project link
  // opens the hub, and a closed window clears the address.
  const booted = useRef(false);
  useEffect(() => {
    const sync = () => {
      const next = parseHash(window.location.hash);

      if (next) {
        open(next.app, next.project);
        setRoute(next);
        return;
      }

      setRoute(null);
    };

    if (!booted.current) {
      booted.current = true;
      sync();
    }
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);

    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [open]);

  // Ctrl/Cmd + K is the palette; Escape closes the topmost open thing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette((value) => !value);
        return;
      }

      if (event.key === "Escape") {
        if (palette) {
          setPalette(false);
          return;
        }

        const window = document.activeElement?.closest(".os-window");
        const id = window?.getAttribute("aria-label");
        const match = windows.find((entry) => appMeta(entry.id).title === id);

        if (match) close(match.id);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [palette, windows, close]);

  return (
    <div className="os" data-wallpaper={wallpaper}>
      <OrbitalField />

      {booting ? <Boot onDone={() => setBooting(false)} /> : null}

      <main
        className="os-desktop"
        id="main"
        onContextMenu={(event) => {
          // A right click on the desktop opens the desktop's own menu. A
          // window keeps its own: this only answers the bare desktop.
          if ((event.target as HTMLElement).closest(".os-window")) return;
          event.preventDefault();
          setMenu({ x: event.clientX, y: event.clientY });
        }}
      >
        {/* The welcome is the desktop's own centre: the emblem, the wordmark
            and the line under it. It is anchored to the viewport — never to
            the desktop box — so no window, palette or dock moves it: windows
            only cover it. */}
        <section
          className="os-welcome"
          aria-label="Desktop"
          aria-hidden={windows.length > 0 ? "true" : undefined}
        >
          <span className="os-welcome__emblem" aria-hidden="true">
            <Emblem />
          </span>
          {/* The wordmark is the page's one heading: the eye reads the mark,
              the screen reader hears whose desktop it is. */}
          <Wordmark as="h1" tail={site.displayName} />
        </section>

        <DesktopIcons places={places} onDrop={dropIcon} />

        {windows.map((win) => {
          const project = projectOf(win.id);
          const meta = appMeta(win.id);

          return (
            <WindowFrame
              key={win.id}
              win={win}
              title={meta.title}
              subtitle={project?.language}
            >
              {project ? (
                <ProjectWindow
                  project={project.name}
                  accent={project.accent}
                  initial={meta.initial}
                  glyph={project.glyph}
                >
                  <Suspense fallback={null}>
                    <ProjectApp project={project.name} />
                  </Suspense>
                </ProjectWindow>
              ) : (
                <AppContent
                  id={win.id}
                  theme={theme}
                  onTheme={applyTheme}
                  onProject={(name) => go("project:" + name.toLowerCase(), name)}
                />
              )}
            </WindowFrame>
          );
        })}
      </main>

      <TopBar
        theme={theme}
        onTheme={() => applyTheme(theme === "dark" ? "light" : "dark")}
        onPalette={() => setPalette(true)}
      />

      <Dock />

      {menu ? (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
          label="Desktop menu"
          items={desktopMenu({
            onPreferences: () => setPrefs(true),
            onTidy: tidyIcons,
            onReset: resetIcons,
            onPalette: () => setPalette(true),
            onMinimizeAll: minimizeAll,
            onWallpaper: (id) => applyWallpaper(id),
          })}
        />
      ) : null}

      {prefs ? (
        <DesktopPreferences
          wallpaper={wallpaper}
          onWallpaper={applyWallpaper}
          onClose={() => setPrefs(false)}
          onTidy={tidyIcons}
          onReset={resetIcons}
        />
      ) : null}

      <CommandPalette
        open={palette}
        onClose={() => setPalette(false)}
        onTheme={applyTheme}
      />

      {/* The address of the system, for the machines that read it. */}
      <span className="sr-only" aria-live="polite">
        {route ? `${appMeta(route.app).title} open` : "Desktop"}
      </span>
    </div>
  );
}
