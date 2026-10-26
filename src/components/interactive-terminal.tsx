"use client";

import { useRef, useState } from "react";
import { formatBytes } from "@/lib/utils";
import type { Language, Profile, Repo } from "@/lib/github";
import { site } from "@/data/site.config";

interface InteractiveTerminalProps {
  profile: Profile;
  repos: Repo[];
  featuredRepos: Repo[];
  languages: Language[];
  totalBytes: number;
}

type HistoryEntry = {
  command: string;
  output: string | string[];
  type?: "system" | "info" | "success" | "warning";
};

export function InteractiveTerminal({
  profile,
  repos,
  featuredRepos,
  languages,
  totalBytes,
}: InteractiveTerminalProps) {
  const [activeTab, setActiveTab] = useState<"whoami" | "stack" | "repos">("whoami");
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "whoami",
      output: [
        `user:      ${profile.login} (${site.owner})`,
        `role:      Full Stack & Systems Developer`,
        `focus:     Web applications, systems tooling, distributed APIs`,
        `location:  ${profile.location || "Remote · Worldwide"}`,
        `status:    Open for new projects`,
      ],
    },
    {
      command: "gh repo list --public",
      output: `${repos.length} public repositories · ${featuredRepos.length} featured on this site`,
    },
    {
      command: "npm run sync:github",
      output: `synced ${repos.length} repos · ${languages.length} languages · ${formatBytes(totalBytes)} code snapshot`,
      type: "success",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const executeCommand = (cmd: string, fromTab = false) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    let output: string | string[];
    let type: HistoryEntry["type"] = "info";

    switch (trimmed) {
      case "whoami":
        output = [
          `user:      ${profile.login} (${site.owner})`,
          `role:      Full Stack & Systems Developer`,
          `bio:       7 years of public work on GitHub`,
          `focus:     Web applications, systems tooling, distributed APIs`,
          `location:  ${profile.location || "Remote · Worldwide"}`,
          `status:    Open for new projects`,
          `url:       ${profile.url}`,
        ];
        break;
      case "stack":
      case "skills": {
        const top5 = languages.slice(0, 5);
        output = top5.map((l) => {
          const pct = Math.round((l.bytes / totalBytes) * 100);
          const barLen = Math.max(1, Math.round(pct / 4));
          const bar = "█".repeat(barLen).padEnd(12, "░");
          return `${l.name.padEnd(12, " ")} ${bar} ${pct.toString().padStart(2, " ")}% (${formatBytes(l.bytes)})`;
        });
        break;
      }
      case "repos":
      case "projects":
        output = [
          `Featured repositories:`,
          ...featuredRepos.map(
            (r) =>
              `  * ${r.name.padEnd(14, " ")} [${r.language || "code"}] - ${
                r.summary || r.description || "production app"
              }`,
          ),
          `Total: ${repos.length} repositories publicly tracked on GitHub.`,
        ];
        break;
      case "contact":
        output = [
          `email:    ${site.contact.email || "ulisesalbertoperez15@gmail.com"}`,
          `github:   ${site.contact.github}`,
          `discord:  ${site.contact.discord || "hdeusking"}`,
        ];
        break;
      case "clear":
        setHistory([]);
        setInputVal("");
        return;
      case "date":
      case "time":
        output = `system time: ${new Date().toISOString()}`;
        break;
      case "help":
        output = [
          "available commands:",
          "  whoami    - print identity and developer profile",
          "  stack     - display language distribution with ASCII bars",
          "  repos     - list featured projects and repository counts",
          "  contact   - display reach-out channels",
          "  clear     - clear terminal log",
          "  date      - print system timestamp",
        ];
        break;
      default:
        output = `command not found: "${trimmed}". Type "help" to see available commands.`;
        type = "warning";
    }

    if (fromTab) {
      // Replace with clean output for this tab and reset scroll position to top
      setHistory([{ command: trimmed, output, type }]);
      if (terminalBodyRef.current) {
        terminalBodyRef.current.scrollTop = 0;
      }
    } else {
      setHistory((prev) => [...prev, { command: trimmed, output, type }]);
      requestAnimationFrame(() => {
        if (terminalBodyRef.current) {
          terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
      });
    }

    setInputVal("");
  };

  const handleQuickTab = (tab: "whoami" | "stack" | "repos") => {
    setActiveTab(tab);
    executeCommand(tab, true);
  };

  return (
    <div className="m-3 border border-rule-strong md:m-4 bg-surface text-ink shadow-sm">
      {/* Terminal Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule-strong px-3 py-2 bg-ink/5">
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-ink" />
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-ink/40" />
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-ink/20" />
          <span className="eyebrow ml-2 text-[0.65rem] font-bold tracking-wider">
            terminal · zsh
          </span>
        </div>

        {/* Command shortcuts */}
        <div className="flex items-center gap-1">
          {(["whoami", "stack", "repos"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleQuickTab(tab)}
              className={`px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider transition-colors border cursor-pointer ${
                activeTab === tab
                  ? "border-ink bg-ink text-surface"
                  : "border-rule-strong hover:bg-ink/10 text-muted"
              }`}
            >
              ${tab}
            </button>
          ))}
          <button
            type="button"
            onClick={() => executeCommand("clear")}
            className="px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider border border-rule-strong hover:bg-ink hover:text-surface text-muted cursor-pointer"
            title="Clear output"
          >
            clear
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalBodyRef}
        className="max-h-[340px] min-h-[220px] overflow-y-auto p-3 font-mono text-xs leading-relaxed md:text-sm select-text"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-3 last:mb-0">
            <div className="flex items-center gap-2 text-muted">
              <span className="text-ink font-bold">$</span>
              <span className="font-semibold text-ink">{entry.command}</span>
            </div>
            <div className="mt-1 pl-4">
              {Array.isArray(entry.output) ? (
                entry.output.map((line, lIdx) => (
                  <span
                    key={lIdx}
                    className={`block whitespace-pre-wrap ${
                      entry.type === "success"
                        ? "text-emerald-700 dark:text-emerald-400 font-medium"
                        : entry.type === "warning"
                          ? "text-amber-800 dark:text-amber-300"
                          : ""
                    }`}
                  >
                    {line}
                  </span>
                ))
              ) : (
                <span
                  className={`block whitespace-pre-wrap ${
                    entry.type === "success"
                      ? "text-emerald-700 dark:text-emerald-400 font-medium"
                      : entry.type === "warning"
                        ? "text-amber-800 dark:text-amber-300"
                        : ""
                  }`}
                >
                  {entry.output}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Live CLI Input Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(inputVal, false);
          }}
          className="mt-3 flex items-center gap-2 border-t border-rule-strong/40 pt-2"
        >
          <label htmlFor="terminal-input" className="text-ink font-bold shrink-0">
            deus@host %
          </label>
          <input
            id="terminal-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="type 'help', 'stack', 'whoami'..."
            className="flex-1 bg-transparent font-mono text-xs md:text-sm text-ink placeholder:text-muted/60 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
          <span className="h-3 w-1.5 bg-ink animate-pulse shrink-0" aria-hidden="true" />
        </form>
      </div>
    </div>
  );
}
