"use client";

import { useMemo, useState } from "react";

import { repos } from "@/lib/github";
import { formatMonth } from "@/lib/utils";

export function Repositories() {
  const [filter, setFilter] = useState("all");

  const filters = useMemo(() => {
    const counts = new Map<string, number>();

    for (const repo of repos) {
      for (const language of Object.keys(repo.languages)) {
        counts.set(language, (counts.get(language) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([language]) => language);
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? repos
        : repos.filter((repo) => Object.hasOwn(repo.languages, filter)),
    [filter],
  );

  return (
    <section id="repositories" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">every single one</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">repositories.</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-rule-strong p-3 md:p-4">
            {["all", ...filters].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={[
                  "border px-2 py-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase transition-colors",
                  filter === option
                    ? "border-ink bg-ink text-surface"
                    : "border-rule-strong hover:bg-ink hover:text-surface",
                ].join(" ")}
              >
                {option}
              </button>
            ))}
            <span className="ml-auto self-center text-[0.65rem] tracking-[0.18em] uppercase text-muted">
              {visible.length} of {repos.length}
            </span>
          </div>

          <ul>
            {visible.map((repo, index) => (
              <li key={repo.name} className="border-b border-rule-strong last:border-b-0">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid grid-cols-4 items-baseline gap-x-3 gap-y-1 p-3 transition-colors hover:bg-ink hover:text-surface md:grid-cols-10 md:p-4"
                >
                  <span className="col-span-1 text-[0.65rem] tracking-[0.18em] uppercase text-muted tabular-nums group-hover:text-surface md:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-3 font-bold tracking-[-0.02em] md:col-span-3">
                    {repo.name}
                    {repo.fork ? (
                      <span className="ml-2 text-[0.6rem] tracking-[0.12em] uppercase text-muted group-hover:text-surface">
                        fork
                      </span>
                    ) : null}
                  </span>
                  <span className="col-span-4 text-sm leading-relaxed text-muted group-hover:text-surface md:col-span-4">
                    {repo.description || "—"}
                  </span>
                  <span className="col-span-1 text-[0.65rem] tracking-[0.12em] uppercase text-muted group-hover:text-surface md:col-span-1">
                    {repo.language || "mixed"}
                  </span>
                  <span className="col-span-1 text-[0.65rem] tracking-[0.12em] uppercase text-muted group-hover:text-surface md:col-span-1">
                    ★ {repo.stars}
                  </span>
                  <span className="col-span-2 text-[0.65rem] tracking-[0.12em] uppercase text-muted group-hover:text-surface md:col-span-1">
                    {formatMonth(repo.pushedAt)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
