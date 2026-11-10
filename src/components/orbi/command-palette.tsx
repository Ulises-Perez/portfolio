"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@/components/orbi/icons";
import { useWindowManager } from "@/components/orbi/window-manager";
import { site } from "@/data/site.config";
import { APPS, SYSTEM_APPS, featured, match } from "@/lib/orbi";

type Entry =
  | { kind: "app"; id: string; label: string; meta: string; app: string }
  | { kind: "project"; id: string; label: string; meta: string; project: string }
  | { kind: "action"; id: string; label: string; meta: string; run: () => void };

/**
 * Command palette (Ctrl/Cmd + K).
 *
 * One list over the three things the system can do: open an application, jump
 * to a project, or run a system action. The keyboard owns it — arrows move,
 * Enter runs, Escape closes — and the pointer is a second way in.
 */
export function CommandPalette({
  open,
  onClose,
  onTheme,
}: {
  open: boolean;
  onClose: () => void;
  onTheme: (mode: "light" | "dark") => void;
}) {
  const manager = useWindowManager();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo<Entry[]>(() => {
    const apps: Entry[] = SYSTEM_APPS.map((app) => ({
      kind: "app",
      id: `app-${app.id}`,
      label: app.title,
      meta: "open app",
      app: app.id,
    }));

    const projects: Entry[] = featured.map((project) => ({
      kind: "project",
      id: `project-${project.name}`,
      label: project.name,
      meta: project.language || "code",
      project: project.name,
    }));

    const actions: Entry[] = [
      {
        kind: "action",
        id: "theme-toggle",
        label: "Toggle theme",
        meta: "appearance",
        run: () => onTheme(
          document.documentElement.dataset.theme === "dark" ? "light" : "dark",
        ),
      },
      {
        kind: "action",
        id: "theme-light",
        label: "Light theme",
        meta: "appearance",
        run: () => onTheme("light"),
      },
      {
        kind: "action",
        id: "theme-dark",
        label: "Dark theme",
        meta: "appearance",
        run: () => onTheme("dark"),
      },
      {
        kind: "action",
        id: "availability",
        label: "Availability: open for work",
        meta: "about",
        run: () => manager.open("connect"),
      },
      {
        kind: "action",
        id: "email",
        label: "Send an email",
        meta: "contact",
        run: () => {
          window.location.href = `mailto:${site.contact.email}`;
        },
      },
      {
        kind: "action",
        id: "github",
        label: "Open GitHub profile",
        meta: "external",
        run: () => window.open("https://github.com/Ulises-Perez", "_blank", "noreferrer"),
      },
    ];

    const all = [...apps, ...projects, ...actions];

    return query.trim()
      ? all.filter((entry) => match(query, `${entry.label} ${entry.meta}`))
      : all;
  }, [query, onTheme]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const run = (entry: Entry) => {
    if (entry.kind === "app") manager.open(entry.app);
    if (entry.kind === "project") {
      manager.open(`project:${entry.project.toLowerCase()}`, entry.project);
    }
    if (entry.kind === "action") entry.run();
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(entries.length, 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) =>
        (index - 1 + Math.max(entries.length, 1)) % Math.max(entries.length, 1),
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const entry = entries[active];
      if (entry) run(entry);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  const groups = [
    { key: "app", label: "System applications" },
    { key: "project", label: "Project applications" },
    { key: "action", label: "System" },
  ] as const;

  let row = -1;

  return (
    <div
      className="os-scrim"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="os-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          className="os-palette__input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Open an app, find a project, or run a command…"
          aria-label="Search applications and projects"
          aria-activedescendant={entries[active] ? `palette-${entries[active].id}` : undefined}
          autoComplete="off"
          spellCheck={false}
        />

        <div className="os-palette__list" role="listbox" aria-label="Results">
          {entries.length === 0 ? (
            <p className="os-palette__empty">Nothing matches “{query}”.</p>
          ) : null}

          {groups.map((group) => {
            const items = entries.filter((entry) => entry.kind === group.key);
            if (items.length === 0) return null;

            return (
              <div key={group.key}>
                <p className="os-palette__group">{group.label}</p>
                {items.map((entry) => {
                  row += 1;
                  const index = row;

                  return (
                    <button
                      key={entry.id}
                      id={`palette-${entry.id}`}
                      type="button"
                      role="option"
                      aria-selected={index === active}
                      className="os-palette__item"
                      data-active={index === active ? "" : undefined}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => run(entry)}
                    >
                      {entry.kind === "app" ? (
                        <Icon name={entry.app} size={15} />
                      ) : entry.kind === "project" ? (
                        <Icon name="projects" size={15} />
                      ) : (
                        <Icon name="check" size={15} />
                      )}
                      <span>{entry.label}</span>
                      <span className="os-palette__meta">{entry.meta}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
