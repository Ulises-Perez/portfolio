"use client";

import { useState } from "react";

import { Icon } from "@/components/orbi/icons";

/**
 * Code Studio — the engineering behind the system.
 *
 * Three excerpts, all real: the typewriter clock that drives every terminal,
 * the reducer shape of the window manager, and the sync boundary between the
 * GitHub API and the committed snapshot. They are read-only on purpose; this
 * is a portfolio, not an editor.
 */

type FileId = "typewriter" | "windows" | "sync";

const FILES: { id: FileId; label: string; path: string }[] = [
  { id: "typewriter", label: "typewriter.ts", path: "src/lib" },
  { id: "windows", label: "window-manager.tsx", path: "src/components/orbi" },
  { id: "sync", label: "sync-github.mjs", path: "scripts" },
];

const SOURCE: Record<FileId, string> = {
  typewriter: `/** Lays every line on one timeline. Pure, so it can be tested. */
export function schedule(
  lines: ScriptLine[],
  rhythm: Partial<typeof RHYTHM> = {},
): LineFrame[] {
  const { lead, speed, print, gap } = { ...RHYTHM, ...rhythm };
  let cursor = lead;

  return lines.map((line, index) => {
    const typedMs = isCommand(line)
      ? line.text.length * (line.speed ?? speed)
      : 0;
    const start = cursor + (line.delay ?? (isCommand(line) ? 0 : print));

    cursor = start + typedMs + gap;

    return { index, start, typedMs, length: line.text.length, end: start + typedMs };
  });
}`,
  windows: `// The manager owns geometry, focus, order and state; each application
// owns its content. A new window is seated inside the desktop.
const open = useCallback((id: AppId, project?: string) => {
  setWindows((list) => {
    const existing = list.find((win) => win.id === id);

    if (existing) {
      top.current += 1;
      return list.map((win) =>
        win.id === id
          ? { ...win, project: project ?? win.project, z: top.current, minimized: false }
          : win,
      );
    }

    top.current += 1;
    return [...list, { id, project, ...seat(appMeta(id).size, list.length),
      z: top.current, minimized: false, maximized: false }];
  });
}, []);`,
  sync: `// The snapshot is committed, so the site builds without the API and the
// numbers it prints are the ones it shipped with.
const snapshot = {
  generatedAt: new Date().toISOString(),
  profile: pick(profile, ["login", "name", "avatarUrl", "publicRepos"]),
  languages: totals.map(([name, bytes, repos]) => ({ name, bytes, repos })),
  repos: repos
    .filter((repo) => !repo.fork && !repo.archived)
    .map((repo) => ({ name: repo.name, url: repo.html_url, language: repo.language,
      bytes: bytesOf(repo), stars: repo.stargazers_count, pushedAt: repo.pushed_at })),
};`,
};

export function CodeStudioApp() {
  const [file, setFile] = useState<FileId>("typewriter");
  const current = FILES.find((entry) => entry.id === file) ?? FILES[0];
  const lines = SOURCE[file].split("\n");

  return (
    <div className="os-app">
      <div className="os-app__head flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="os-app__eyebrow">code studio · read only</p>
          <h2 className="os-app__title">How it is built</h2>
        </div>
        <span className="os-chip font-mono">
          {current.path}/{current.label}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <nav aria-label="source files" className="border-b border-line p-2 md:w-48 md:border-b-0 md:border-r">
          {FILES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="os-list__row md:rounded-md"
              aria-current={file === entry.id ? "true" : undefined}
              onClick={() => setFile(entry.id)}
              style={
                file === entry.id
                  ? { background: "color-mix(in oklab, var(--accent) 14%, transparent)" }
                  : undefined
              }
            >
              <Icon name="code" size={13} />
              <span className="flex-1 truncate font-mono text-[0.7rem]">
                {entry.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-auto bg-[color-mix(in_oklab,var(--surface)_60%,var(--panel))]">
          <pre className="p-4 font-mono text-[0.72rem] leading-[1.7]">
            {lines.map((line, index) => (
              <div key={index} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 select-none text-right text-muted opacity-50"
                >
                  {index + 1}
                </span>
                <code className="whitespace-pre">{line || " "}</code>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
