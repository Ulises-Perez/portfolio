"use client";

import { useState } from "react";

import { RepoCover } from "@/components/repo-cover";
import { featuredRepos } from "@/lib/github";
import { formatMonth } from "@/lib/utils";

export function Works() {
  const [active, setActive] = useState(0);
  const repo = featuredRepos[active];

  if (!repo) return null;

  return (
    <section id="works" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong pb-0 md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">selected</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">works.</h2>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-10">
            <div className="relative z-10 col-span-4 md:col-span-5 md:border-r md:border-rule-strong">
              <div className="flex h-full border-b border-rule-strong md:border-b-0">
                <div className="flex w-24 shrink-0 flex-col border-r border-rule-strong md:w-40">
                  {featuredRepos.map((item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      aria-label={`Show ${item.name}`}
                      aria-current={index === active}
                      onClick={() => setActive(index)}
                      className={[
                        "relative min-h-[72px] w-full flex-1 cursor-pointer overflow-hidden border-b border-rule-strong transition-opacity last:border-b-0",
                        index === active ? "opacity-100" : "opacity-40 hover:opacity-80",
                      ].join(" ")}
                    >
                      <span className="absolute inset-0 text-ink">
                        <RepoCover name={item.name} />
                      </span>
                      <span className="absolute inset-x-0 bottom-0 bg-ink px-1.5 py-0.5 text-left text-[0.6rem] font-bold tracking-[0.08em] text-surface uppercase">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-3 md:p-4">
                  <div>
                    <p className="eyebrow">repository {String(active + 1).padStart(2, "0")}</p>
                    <p className="display mt-2 text-3xl break-words md:text-5xl">
                      {repo.name}
                    </p>
                    <p className="mt-3 max-w-[48ch] text-base leading-relaxed opacity-80 md:text-lg">
                      {repo.description || "No description on this repository yet."}
                    </p>
                  </div>
                  <p className="mt-6 text-[0.65rem] tracking-[0.18em] uppercase opacity-60">
                    {repo.language || "mixed"} · {formatMonth(repo.pushedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="col-span-4 flex flex-col border-t border-rule-strong md:col-span-5 md:border-t-0"
              aria-live="polite"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-rule-strong text-ink md:aspect-[16/9]">
                <RepoCover name={repo.name} variant="panel" />
                <span className="absolute bottom-3 left-3 bg-ink px-2 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-surface uppercase">
                  {repo.name}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-6 p-3 md:p-4">
                <ul className="flex flex-wrap gap-2">
                  {Object.entries(repo.languages)
                    .slice(0, 6)
                    .map(([language, bytes]) => (
                      <li
                        key={language}
                        className="border border-rule-strong px-2 py-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase"
                      >
                        {language}
                      </li>
                    ))}
                </ul>

                {repo.readme ? (
                  <p className="max-w-[60ch] text-sm leading-relaxed opacity-70 md:text-base">
                    {repo.readme}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="cta text-base"
                  >
                    <span className="cta-label">view on github</span>
                  </a>
                  {repo.homepage ? (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="cta text-base"
                    >
                      <span className="cta-label">live site</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
