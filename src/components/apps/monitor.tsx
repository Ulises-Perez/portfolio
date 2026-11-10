"use client";

import { useEffect, useState } from "react";

import { LanguageMeter } from "@/components/language-meter";
import {
  languages,
  repoCount,
  repos,
  totalBytes,
  yearsOnGitHub,
} from "@/lib/github";
import { formatBytes } from "@/lib/utils";

/**
 * System Monitor — the stack, measured.
 *
 * No invented uptime, no fake percentages: the bars are the bytes actually
 * committed per language, the counters are the public repositories. The only
 * live number is the clock, and it is labelled as one.
 */
const bytesOf = (language: string) =>
  languages.find((entry) => entry.name === language)?.bytes ?? 0;

const topLanguages = languages.slice(0, 6);

const stats = [
  { label: "repositories", value: String(repoCount) },
  { label: "languages", value: String(languages.length) },
  { label: "bytes committed", value: formatBytes(totalBytes) },
  { label: "years on github", value: String(yearsOnGitHub) },
];

export function MonitorApp() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const recent = [...repos]
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, 5);

  return (
    <div className="os-app">
      <div className="os-app__head flex items-end justify-between gap-3">
        <div>
          <p className="os-app__eyebrow">system monitor · capabilities</p>
          <h2 className="os-app__title">What the account runs on</h2>
        </div>
        <span className="os-chip font-mono tabular-nums">{clock || "--:--:--"}</span>
      </div>

      <div className="os-app__body flex flex-col gap-5">
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="os-card">
              <dt className="os-label">{stat.label}</dt>
              <dd className="mt-1 text-lg font-medium tracking-[-0.03em] tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <section aria-label="languages">
          <LanguageMeter languages={languages} totalBytes={totalBytes} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="os-card">
            <p className="os-label">recently pushed</p>
            <ul className="mt-2 flex flex-col">
              {recent.map((repo) => (
                <li
                  key={repo.name}
                  className="flex items-baseline justify-between gap-3 border-b border-line py-1.5 font-mono text-[0.7rem] last:border-b-0"
                >
                  <span className="truncate">{repo.name}</span>
                  <span className="shrink-0 text-muted tabular-nums">
                    {repo.pushedAt.slice(0, 10)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="os-card">
            <p className="os-label">by language · bytes</p>
            <ul className="mt-2 flex flex-col gap-2">
              {topLanguages.map((language) => {
                const share = language.bytes / totalBytes;

                return (
                  <li key={language.name} className="flex items-center gap-2">
                    <span className="w-20 shrink-0 font-mono text-[0.66rem] text-muted">
                      {language.name}
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                      <span
                        className="block h-full rounded-full bg-accent"
                        style={{ width: `${Math.max(share * 100, 1)}%` }}
                      />
                    </span>
                    <span className="w-16 shrink-0 text-right font-mono text-[0.62rem] tabular-nums text-muted">
                      {formatBytes(language.bytes)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <p className="os-label">
          measured from the committed snapshot · {bytesOf("TypeScript").toLocaleString()} bytes
          of TypeScript alone
        </p>
      </div>
    </div>
  );
}
