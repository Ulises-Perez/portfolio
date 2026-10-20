"use client";

import { Cta } from "@/components/cta";
import { RepoCover } from "@/components/repo-cover";
import type { Project } from "@/lib/github";
import { formatBytes, formatMonth } from "@/lib/utils";

/**
 * One featured project, a full screen. It receives only the fields it shows,
 * so the rest of the snapshot never crosses to the browser.
 */
export function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const repo = project;
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <article
      data-panel
      data-index={index}
      className="grid min-h-[calc(100svh-5.5rem)] snap-start scroll-mt-24 grid-cols-4 border-b border-rule-strong md:min-h-[calc(100svh-6rem)] md:grid-cols-10"
    >
      <div className="col-span-4 flex items-start justify-between gap-6 border-b border-rule-strong p-3 md:col-span-2 md:flex-col md:justify-between md:border-b-0 md:border-r md:p-4">
        <p className="display text-5xl tabular-nums md:text-7xl">
          {pad(index + 1)}
        </p>
        <dl className="text-[0.65rem] tracking-[0.12em] uppercase">
          {[
            { label: "language", value: repo.language || "mixed" },
            { label: "size", value: formatBytes(repo.bytes) },
            { label: "stars", value: String(repo.stars) },
            { label: "pushed", value: formatMonth(repo.pushedAt) },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between gap-4 border-b border-rule py-1 last:border-b-0 md:block md:border-b-0"
            >
              <dt className="text-muted">{item.label}</dt>
              <dd className="tabular-nums">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="col-span-4 flex flex-col gap-6 p-3 md:col-span-4 md:p-4">
        <div>
          <h3 className="display text-4xl break-words md:text-6xl">
            {repo.name}
          </h3>
          {repo.summary ? (
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-muted md:text-lg">
              {repo.summary}
            </p>
          ) : null}
          <ul className="mt-6 flex flex-wrap gap-2">
            {Object.entries(repo.languages)
              .slice(0, 6)
              .map(([language]) => (
                <li
                  key={language}
                  className="border border-rule-strong px-2 py-1 text-[0.6rem] font-bold tracking-[0.12em] uppercase"
                >
                  {language}
                </li>
              ))}
          </ul>
        </div>
        <div className="mt-auto flex flex-wrap gap-3">
          <Cta href={repo.url} label="view on github" external />
        </div>
      </div>

      <div className="relative col-span-4 min-h-[220px] border-t border-rule-strong text-ink md:col-span-4 md:min-h-0 md:border-t-0 md:border-l">
        <span className="block h-full w-full">
          <RepoCover name={repo.name} variant="panel" />
        </span>
        <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate bg-ink px-2 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-surface uppercase">
          {repo.name}
        </span>
      </div>
    </article>
  );
}
