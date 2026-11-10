"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Icon } from "@/components/orbi/icons";
import {
  clampToDesktop,
  dragTo,
  resizeTo,
  seat,
  windowZ,
} from "@/lib/layout";
import { appMeta, type AppId } from "@/lib/orbi";

/**
 * The window manager.
 *
 * One window per application. The manager owns geometry, focus, order and
 * state; the application owns its own content. Dragging and resizing write to
 * the window's box directly and commit to state once, at the end of the
 * gesture, so a drag does not re-render the tree on every frame.
 */

export type Win = {
  id: AppId;
  /** The project the hub is showing, when the window is the hub. */
  project?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

type Manager = {
  windows: Win[];
  focused: AppId | null;
  open: (id: AppId, project?: string) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  /** Sends every window to the dock at once, as the desktop menu does. */
  minimizeAll: () => void;
  /** The screen the windows are drawn in, kept current by the manager. */
  viewport: { width: number; height: number };
  toggleMaximize: (id: AppId) => void;
  move: (id: AppId, box: Partial<Pick<Win, "x" | "y" | "width" | "height">>) => void;
};

const WindowManagerContext = createContext<Manager | null>(null);

/** How much of a window must stay reachable when the screen changes. */
const KEEP_ON_SCREEN = { width: 120, height: 48 };

/**
 * How far a press must travel before it counts as a drag, in CSS pixels.
 *
 * Below it nothing moves: a click on the title bar, a double click to
 * maximize, and the tiny wobble of a pointer that is only being pressed all
 * stay put. 6px is the threshold a desktop uses to tell the two apart.
 */
const DRAG_SLOP = 6;

export function useWindowManager(): Manager {
  const manager = useContext(WindowManagerContext);
  if (!manager) throw new Error("useWindowManager outside the manager");
  return manager;
}

/**
 * The screen a window lives in.
 *
 * The whole viewport, with no bar above it and no dock below: the desktop has
 * no chrome of its own any more, so a window may touch both edges. The dock
 * floats over the desktop and simply covers what is under it.
 */
function desktopBounds(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1280, height: 720 };

  return { width: window.innerWidth, height: window.innerHeight };
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Win[]>([]);
  const [focused, setFocused] = useState<AppId | null>(null);
  const [viewport, setViewport] = useState(() => desktopBounds());
  const top = useRef(10);

  /**
   * The window in front.
   *
   * Its order is the count of the list, so a window can never climb above the
   * dock: `windowZ` puts every window under `LAYERS.dock`, whatever its place
   * in the stack.
   */
  const raise = (list: Win[], id: AppId, extra: Partial<Win> = {}): Win[] => {
    const order = list.length;
    top.current = order;

    return list.map((win) =>
      win.id === id ? { ...win, ...extra, z: windowZ(order) } : win,
    );
  };

  const focus = useCallback((id: AppId) => {
    setWindows((list) => raise(list, id, { minimized: false }));
    setFocused(id);
  }, []);

  const open = useCallback(
    (id: AppId, project?: string) => {
      setWindows((list) => {
        const existing = list.find((win) => win.id === id);

        if (existing) {
          return raise(list, id, {
            project: project ?? existing.project,
            minimized: false,
          });
        }

        const meta = appMeta(id);
        const order = list.length;
        top.current = order;

        return [
          ...list,
          {
            id,
            project,
            ...seat(meta.size, list.length, desktopBounds()),
            z: windowZ(order),
            minimized: false,
            maximized: false,
          },
        ];
      });
      setFocused(id);
    },
    [],
  );

  const close = useCallback((id: AppId) => {
    setWindows((list) => list.filter((win) => win.id !== id));
    setFocused((current) => (current === id ? null : current));
  }, []);

  const minimize = useCallback((id: AppId) => {
    setWindows((list) =>
      list.map((win) => (win.id === id ? { ...win, minimized: true } : win)),
    );
    setFocused((current) => (current === id ? null : current));
  }, []);

  const minimizeAll = useCallback(() => {
    setWindows((list) => list.map((win) => ({ ...win, minimized: true })));
    setFocused(null);
  }, []);

  const toggleMaximize = useCallback((id: AppId) => {
    setWindows((list) =>
      list.map((win) =>
        win.id === id ? { ...win, maximized: !win.maximized } : win,
      ),
    );
  }, []);

  const move = useCallback(
    (id: AppId, box: Partial<Pick<Win, "x" | "y" | "width" | "height">>) => {
      setWindows((list) =>
        list.map((win) => (win.id === id ? { ...win, ...box } : win)),
      );
    },
    [],
  );

  // The desktop keeps its windows on screen when it is resized.
  useEffect(() => {
    /**
     * A viewport change does NOT rewrite the size the visitor chose.
     *
     * The size a window keeps is its intent; what is drawn is that intent
     * clamped to the screen. Clamping it into the state instead made the
     * shrink permanent: once a window had been drawn on a phone, it stayed
     * phone-wide on a desktop, and every application collapsed into a narrow
     * column. Only the position is committed, so a window pulled back on
     * screen stays there.
     */
    const onResize = () => {
      const desk = desktopBounds();
      setViewport(desk);

      setWindows((list) =>
        list.map((win) => ({
          ...win,
          x: Math.max(
            -win.width + KEEP_ON_SCREEN.width,
            Math.min(win.x, desk.width - KEEP_ON_SCREEN.width),
          ),
          y: Math.max(0, Math.min(win.y, desk.height - KEEP_ON_SCREEN.height)),
        })),
      );
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        focused,
        viewport,
        open,
        close,
        focus,
        minimize,
        minimizeAll,
        toggleMaximize,
        move,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

type WindowFrameProps = {
  win: Win;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** One window: a title bar, three controls, its application, a resize grip. */
export function WindowFrame({ win, title, subtitle, children }: WindowFrameProps) {
  const { focused, close, focus, minimize, toggleMaximize, move, viewport } =
    useWindowManager();
  // What is drawn is the size the visitor chose, clamped to the screen it is
  // on. The stored box is never shrunk by a viewport change.
  const box = clampToDesktop(
    { x: win.x, y: win.y, width: win.width, height: win.height },
    viewport,
  );
  const ref = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    kind: "move" | "resize";
    startX: number;
    startY: number;
    /** The box the gesture started from, never written to. */
    origin: { x: number; y: number; width: number; height: number };
    /** The last box the pointer produced, for the commit on release. */
    current: { x: number; y: number; width: number; height: number };
    /** Set once the pointer has travelled far enough to mean a drag. */
    armed: boolean;
  } | null>(null);

  const isFocused = focused === win.id;
  const box0 = box;

  const begin = useCallback(
    (kind: "move" | "resize") => (event: React.PointerEvent) => {
      if (event.button !== 0) return;
      if (kind === "move" && (event.target as HTMLElement).closest("button")) {
        return;
      }
      if (win.maximized && kind === "move") return;
      if (window.matchMedia("(max-width: 767px)").matches) return;

      focus(win.id);
      // The gesture starts from what is drawn, not from the stored box: the
      // two differ when the screen cannot hold the size the visitor chose.
      const box = { ...box0 };
      gesture.current = {
        kind,
        startX: event.clientX,
        startY: event.clientY,
        origin: box,
        current: box,
        armed: false,
      };

      // The pointer is captured at once so the gesture survives leaving the
      // window, but nothing moves until it has travelled `DRAG_SLOP`: a press
      // that wobbles by a pixel is a click, not a drag.
      try {
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      } catch {
        /* no active pointer: the gesture works while it stays on the bar */
      }
    },
    // `box0` follows the drawn box.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focus, win.id, box.x, box.y, box.width, box.height, win.maximized],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const from = gesture.current;
      const el = ref.current;
      if (!from || !el) return;

      const dx = event.clientX - from.startX;
      const dy = event.clientY - from.startY;

      // A press only becomes a drag past the slop; below it the window stays
      // exactly where it is, so a double click to maximize never nudges it.
      if (!from.armed) {
        if (Math.hypot(dx, dy) < DRAG_SLOP) return;
        from.armed = true;
        el.dataset.dragging = from.kind;
      }

      // Every frame is computed from the box the gesture started at. Writing
      // the result into the origin would feed the next frame its own output,
      // and the window would travel faster than the pointer.
      if (from.kind === "move") {
        const box = dragTo(from.origin, dx, dy, desktopBounds());

        el.style.left = `${box.x}px`;
        el.style.top = `${box.y}px`;
        from.current = box;
        return;
      }

      const box = resizeTo(
        from.origin,
        dx,
        dy,
        appMeta(win.id).min,
        desktopBounds(),
      );

      el.style.width = `${box.width}px`;
      el.style.height = `${box.height}px`;
      from.current = box;
    },
    [win.id],
  );

  const end = useCallback(
    (event: React.PointerEvent) => {
      const from = gesture.current;
      if (!from) return;

      gesture.current = null;
      delete ref.current?.dataset.dragging;

      // The capture is only released if this element still holds it: a
      // pointer the browser has already let go throws, and the throw would
      // leave the gesture half ended.
      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(
          event.pointerId,
        );
      } catch {
        /* the pointer was already released */
      }

      // A press that never armed is a click: nothing to commit.
      if (from.armed) move(win.id, from.current);
    },
    [move, win.id],
  );

  return (
    <div
      ref={ref}
      className="os-window"
      role="dialog"
      aria-label={title}
      aria-modal="false"
      data-focused={isFocused ? "true" : undefined}
      data-maximized={win.maximized ? "" : undefined}
      style={{
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        zIndex: win.z,
        display: win.minimized ? "none" : undefined,
      }}
      onPointerDown={() => focus(win.id)}
    >
      <div
        className="os-window__bar"
        onPointerDown={begin("move")}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        onDoubleClick={() => toggleMaximize(win.id)}
      >
        <span className="os-window__icon">
          <Icon name={win.id} size={15} />
        </span>
        <span className="os-window__title">{title}</span>
        {subtitle ? <span className="os-window__sub">{subtitle}</span> : null}

        <div className="os-controls">
          <button
            type="button"
            className="os-control"
            aria-label={`Minimize ${title}`}
            onClick={() => minimize(win.id)}
          >
            <Icon name="minimize" size={14} />
          </button>
          <button
            type="button"
            className="os-control"
            aria-label={`${win.maximized ? "Restore" : "Maximize"} ${title}`}
            onClick={() => toggleMaximize(win.id)}
          >
            <Icon name="maximize" size={13} />
          </button>
          <button
            type="button"
            className="os-control"
            data-close
            aria-label={`Close ${title}`}
            onClick={() => close(win.id)}
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>

      <div className="os-window__body">{children}</div>

      <span
        className="os-window__handle"
        onPointerDown={begin("resize")}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        aria-hidden="true"
      />
    </div>
  );
}
