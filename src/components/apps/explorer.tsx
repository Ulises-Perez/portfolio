"use client";

import { useState } from "react";

import { Icon } from "@/components/orbi/icons";
import { useWindowManager } from "@/components/orbi/window-manager";
import { site } from "@/data/site.config";
import {
  generatedAt,
  languages,
  profile,
  repoCount,
  totalBytes,
  yearsOnGitHub,
} from "@/lib/github";
import { formatBytes } from "@/lib/utils";

/**
 * Orbital Explorer — the person, filed like a tree of documents.
 *
 * There is no second paragraph of biography invented for the effect: every
 * number and every line here is read from the site config or the committed
 * GitHub snapshot.
 */

type FileId = "profile" | "now" | "philosophy" | "trajectory";

const FILES: { id: FileId; label: string; meta: string }[] = [
  { id: "profile", label: "profile.md", meta: `${site.owner}` },
  { id: "now", label: "now.md", meta: "availability" },
  { id: "philosophy", label: "philosophy.md", meta: "how I work" },
  { id: "trajectory", label: "trajectory.txt", meta: `${yearsOnGitHub} years` },
];

const top = languages.slice(0, 5);

export function ExplorerApp() {
  const [selected, setSelected] = useState<FileId>("profile");
  const { open } = useWindowManager();

  return (
    <div className="os-app">
      <div className="os-app__head">
        <p className="os-app__eyebrow">orbital explorer · {profile.login}</p>
        <h2 className="os-app__title">{site.displayName}</h2>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[13rem_minmax(0,1fr)]">
        <nav
          aria-label="files"
          className="border-b border-line p-2 md:border-b-0 md:border-r"
        >
          {FILES.map((file) => (
            <button
              key={file.id}
              type="button"
              className="os-list__row md:rounded-md"
              data-selected={selected === file.id ? "" : undefined}
              aria-current={selected === file.id ? "true" : undefined}
              onClick={() => setSelected(file.id)}
              style={
                selected === file.id
                  ? { background: "color-mix(in oklab, var(--accent) 14%, transparent)" }
                  : undefined
              }
            >
              <Icon name="explorer" size={14} />
              <span className="flex-1 font-mono text-[0.72rem]">{file.label}</span>
              <span className="os-label">{file.meta}</span>
            </button>
          ))}
        </nav>

        <div className="os-app__body min-w-0">
          {selected === "profile" ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="os-chip">{site.roles.join(" · ")}</span>
                <span className="os-chip">
                  <span
                    className="os-status__dot"
                    style={{ width: 5, height: 5, boxShadow: "none" }}
                  />
                  available
                </span>
              </div>
              <dl className="os-kv">
                <dt>name</dt>
                <dd>{profile.name || site.displayName}</dd>
                <dt>github</dt>
                <dd>
                  <a className="os-link" href={site.contact.github} target="_blank" rel="noreferrer">
                    github.com/{site.owner}
                  </a>
                </dd>
                <dt>email</dt>
                <dd>
                  {site.contact.email ? (
                    <a className="os-link" href={`mailto:${site.contact.email}`}>
                      {site.contact.email}
                    </a>
                  ) : (
                    "on request"
                  )}
                </dd>
                <dt>location</dt>
                <dd>{profile.location || "remote · worldwide"}</dd>
                <dt>repos</dt>
                <dd>{repoCount} public</dd>
                <dt>code</dt>
                <dd>{formatBytes(totalBytes)} committed</dd>
              </dl>
              <div className="flex flex-wrap gap-1.5">
                {top.map((language) => (
                  <span key={language.name} className="os-chip">
                    {language.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="os-btn" data-primary onClick={() => open("projects")}>
                  <Icon name="projects" size={14} />
                  open project hub
                </button>
                <button type="button" className="os-btn" onClick={() => open("connect")}>
                  <Icon name="connect" size={14} />
                  get in touch
                </button>
              </div>
            </div>
          ) : null}

          {selected === "now" ? (
            <div className="flex flex-col gap-4 text-[0.9rem] leading-relaxed">
              <p>
                Open to contracts, freelance projects and full-time work. Remote,
                or wherever the problem is.
              </p>
              <p className="text-muted">
                Three disciplines, one person: the interface, the service behind
                it, and the tooling that keeps both running.
              </p>
              <div className="os-card">
                <p className="os-label">today</p>
                <p className="mt-1.5 text-[0.85rem]">
                  Building this system and the products it presents. The snapshot
                  of the account behind the numbers is dated{" "}
                  {new Date(generatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                  .
                </p>
              </div>
            </div>
          ) : null}

          {selected === "philosophy" ? (
            <div className="flex flex-col gap-4 text-[0.9rem] leading-relaxed">
              <p>
                Ship the smallest thing that answers the question, then keep it.
                The interface is judged by what it lets someone do, not by how it
                announces itself.
              </p>
              <p className="text-muted">
                The numbers on this system are read from a committed snapshot of
                the account: a shell that prints a build it never ran is
                decoration wearing a costume.
              </p>
              <ul className="flex flex-col gap-2 border-t border-line pt-4 text-[0.85rem]">
                {site.services.map((service) => (
                  <li key={service.index} className="flex gap-3">
                    <span className="os-label pt-0.5">{service.index}</span>
                    <span>
                      <span className="font-medium">{service.title}</span>
                      <span className="text-muted"> — {service.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {selected === "trajectory" ? (
            <div className="flex flex-col gap-2 font-mono text-[0.74rem] leading-relaxed">
              <p className="text-muted">
                the public record, from the snapshot
              </p>
              <p>
                {yearsOnGitHub} years on GitHub · {repoCount} public repositories ·{" "}
                {languages.length} languages · {formatBytes(totalBytes)}
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {languages.slice(0, 8).map((language) => (
                  <div key={language.name} className="flex items-baseline gap-3">
                    <span className="w-24 text-muted">{language.name}</span>
                    <span className="flex-1 border-b border-dotted border-line-strong" />
                    <span className="tabular-nums">
                      {String(Math.round((language.bytes / totalBytes) * 100)).padStart(2, "0")}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
