"use client";

import { useState } from "react";

import { Icon } from "@/components/orbi/icons";
import { ProjectScreen } from "@/components/project-screen";
import { featured } from "@/lib/orbi";
import { formatBytes, formatMonth } from "@/lib/utils";

type Tab = "overview" | "code" | "links" | "info";

/**
 * One project, as its own application.
 *
 * The drawn screen of the product is the view; the tabs are the appendix —
 * the line and the stack, a real excerpt of the source when the site knows
 * one, the links, and the record from the snapshot. A tab with nothing behind
 * it is not drawn at all, so nothing ever shows an empty section.
 *
 * Every value comes from the snapshot and the site config, and the actions are
 * real: the clone command is copied, the repository and the demo open.
 */
export function ProjectApp({ project }: { project: string }) {
  const work =
    featured.find((entry) => entry.name === project) ?? featured[0];

  const [tab, setTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  if (!work) {
    return (
      <p className="os-app__body text-sm text-muted">
        This project is not in the snapshot.
      </p>
    );
  }

  const clone = `git clone ${work.url}`;

  const sections: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "links", label: "Links" },
    { id: "info", label: "Info" },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(clone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* a browser without the clipboard: the command is on screen anyway */
    }
  };

  return (
    <div className="os-app">
      <div className="os-app__head flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="os-app__eyebrow">
            {work.language || "code"} · {work.stack.length} technologies
          </p>
          <h2 className="os-app__title">{work.name}</h2>
        </div>
        <a className="os-btn" href={work.url} target="_blank" rel="noreferrer">
          repository
          <Icon name="arrow" size={13} />
        </a>
      </div>

      <div className="os-app__body min-w-0">
        <div className="os-project">
          {work.screen ? (
            <div className="os-project__screen">
              <ProjectScreen
                accent={work.accent}
                screen={work.screen}
                name={work.name}
              />
            </div>
          ) : null}

          <div className="os-project__panel">
            <div className="os-project__tabs" role="tablist" aria-label="Project sections">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  role="tab"
                  id={`tab-${section.id}`}
                  aria-selected={tab === section.id}
                  aria-controls={`panel-${section.id}`}
                  className="os-project__tab"
                  data-active={tab === section.id ? "" : undefined}
                  onClick={() => setTab(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div
              className="os-project__body"
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
            >
              {tab === "overview" ? (
                <div className="flex flex-col gap-4">
                  <p className="os-project__line">{work.summary}</p>
                  <div>
                    <p className="os-label">stack</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {work.stack.map((item) => (
                        <li key={item} className="os-chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {tab === "links" ? (
                <div className="flex flex-col gap-3">
                  <a
                    className="os-project__link"
                    href={work.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="os-label">repository</span>
                    <span className="truncate">{work.url.replace("https://", "")}</span>
                    <Icon name="arrow" size={14} />
                  </a>

                  <div className="os-project__clone">
                    <code className="truncate">{clone}</code>
                    <button type="button" className="os-btn" onClick={copy}>
                      {copied ? <Icon name="check" size={12} /> : null}
                      {copied ? "copied" : "copy"}
                    </button>
                  </div>
                </div>
              ) : null}

              {tab === "info" ? (
                <dl className="os-project__info">
                  <div>
                    <dt className="os-label">language</dt>
                    <dd>{work.language || "mixed"}</dd>
                  </div>
                  <div>
                    <dt className="os-label">size</dt>
                    <dd className="tabular-nums">{formatBytes(work.bytes)}</dd>
                  </div>
                  <div>
                    <dt className="os-label">stars</dt>
                    <dd className="tabular-nums">{work.stars}</dd>
                  </div>
                  <div>
                    <dt className="os-label">last push</dt>
                    <dd>{formatMonth(work.pushedAt)}</dd>
                  </div>
                  <div>
                    <dt className="os-label">state</dt>
                    <dd>public · maintained</dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
