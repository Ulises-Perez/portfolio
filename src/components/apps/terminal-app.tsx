"use client";

import { useEffect, useRef, useState } from "react";

import { useWindowManager } from "@/components/orbi/window-manager";
import { runCommand, type AppId, type ShellReply } from "@/lib/orbi";
import { site } from "@/data/site.config";

type Line = { text: string; tone: "cmd" | "out" | "dim" | "err" | "ok" };

const greet: Line[] = [
  { text: `orbi shell · ${site.displayName}`, tone: "dim" },
  { text: 'type "help" for the commands', tone: "dim" },
];

/**
 * Orbital Terminal — the interactive shell of the system.
 *
 * It opens on the prompt, with the two lines that greet the visitor, and
 * nothing else: no introductory animation that has to finish before the shell
 * appears. Every line it prints is plain text in the same column, so the
 * session reads as one shell from the first frame.
 *
 * The shell is real for this system: it opens applications, searches the
 * projects, switches the theme and clears itself. The parsing lives in
 * `runCommand`, which is pure, so what a line does is testable.
 */
export function TerminalApp({
  onTheme,
  onProject,
}: {
  onTheme?: (mode: "light" | "dark") => void;
  onProject?: (name: string) => void;
}) {
  const { open } = useWindowManager();
  const [history, setHistory] = useState<Line[]>(greet);
  const [value, setValue] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [history]);

  const submit = (raw: string) => {
    const input = raw.trim();
    if (!input) return;

    const reply: ShellReply = runCommand(input);
    const next: Line[] = input.startsWith("clear")
      ? []
      : [{ text: input, tone: "cmd" }, ...reply.lines];

    setHistory((lines) => (reply.clear ? [] : [...lines, ...next]));
    setPast((list) => [...list, input]);
    setCursor(-1);
    setValue("");

    if (reply.open) open(reply.open as AppId);
    if (reply.project) {
      onProject?.(reply.project);
      open("projects", reply.project);
    }
    if (reply.theme) onTheme?.(reply.theme);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const index = cursor === -1 ? past.length - 1 : Math.max(0, cursor - 1);
      if (past[index] !== undefined) {
        setCursor(index);
        setValue(past[index]);
      }
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (cursor === -1) return;
      const index = cursor + 1;
      if (index >= past.length) {
        setCursor(-1);
        setValue("");
        return;
      }
      setCursor(index);
      setValue(past[index]);
    }
  };

  return (
    <div className="os-app h-full">
      <div className="os-app__head flex items-center justify-between">
        <p className="os-app__eyebrow">orbital terminal · {site.owner}</p>
        <span className="os-chip">
          {history.length} lines
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        {/* One column of plain text: the greeting, then whatever the visitor
            asked, then the prompt. Nothing replaces it on mount. */}
        <div className="os-shell__history min-h-0 flex-1 overflow-auto">
          {history.map((line, index) => (
            <p key={index} className="os-shell__line" data-tone={line.tone}>
              {line.tone === "cmd" ? (
                <span className="os-shell__prompt">orbi ~ %</span>
              ) : null}
              <span>{line.text}</span>
            </p>
          ))}
          <div ref={endRef} />
        </div>

        <form
          className="os-shell__form"
          onSubmit={(event) => {
            event.preventDefault();
            submit(value);
          }}
        >
          <span className="os-shell__prompt font-mono text-[0.74rem]">
            orbi ~ %
          </span>
          <input
            className="os-shell__input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="shell input"
            placeholder="open projects"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
