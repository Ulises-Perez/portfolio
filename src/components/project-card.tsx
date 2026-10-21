"use client";

import type { CSSProperties } from "react";

import { Cta } from "@/components/cta";
import { ProjectScreen } from "@/components/project-screen";
import type { WorkScreen } from "@/data/site.config";
import { formatBytes, formatMonth } from "@/lib/utils";

/**
 * The stagger of a piece of the card, written as the `--i` custom property the
 * stylesheet reads. The cast is the one place the site declares a property
 * that is not part of `CSSProperties`.
 */
const stagger = (index: number): CSSProperties =>
  ({ "--i": index }) as CSSProperties;

export type ProjectCardProps = {
  name: string;
  url: string;
  /** The line written for this site. */
  blurb: string;
  /** The technologies and libraries the work is built with. */
  stack: string[];
  /** The color the product wears in its own screen. */
  accent: string;
  screen: WorkScreen;
  language: string;
  bytes: number;
  stars: number;
  pushedAt: string;
  index: number;
  total: number;
};

/**
 * One work, as a card of the horizontal carousel.
 *
 * The name sits on the top left, the framed screen of the product arrives
 * from the opposite corner, and under the name there is one line about the
 * work and the technologies it is built with. Every piece reads the position
 * of its own card in the scroller and travels on its own, so the composition
 * assembles itself as the card reaches the middle.
 */
export function ProjectCard({
  name,
  url,
  blurb,
  stack,
  accent,
  screen,
  language,
  bytes,
  stars,
  pushedAt,
  index,
  total,
}: ProjectCardProps) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <article data-card className="work-card">
      {/* The visible work. The card itself is the box the layout measures:
          the work opens inside it, from the width of the page to the whole
          width of the screen. */}
        <div className="work-card__inner">
          <div className="work-card__head" style={stagger(0)}>
            <p className="work-card__index">
              <span className="work-card__number">{pad(index + 1)}</span>
              <span className="work-card__total">/ {pad(total)}</span>
            </p>
            <h3 className="work-card__name">{name}</h3>
          </div>

          <div className="work-card__text">
            <p className="work-card__blurb" style={stagger(1)}>
              {blurb}
            </p>

            <ul className="work-card__stack">
              {stack.map((item, chip) => (
                <li
                  key={item}
                  className="work-card__chip"
                  style={stagger(2 + chip * 0.08)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="work-card__footer" style={stagger(3.2)}>
            <dl className="work-card__meta">
              {[
                { label: "language", value: language || "mixed" },
                { label: "size", value: formatBytes(bytes) },
                { label: "stars", value: String(stars) },
                { label: "pushed", value: formatMonth(pushedAt) },
              ].map((item) => (
                <div key={item.label} className="work-card__meta-item">
                  <dt className="text-muted">{item.label}</dt>
                  <dd className="tabular-nums">{item.value}</dd>
                </div>
              ))}
            </dl>
            <Cta href={url} label="view on github" external />
          </div>

          <div className="work-card__visual">
            <ProjectScreen accent={accent} screen={screen} name={name} />
          </div>
        </div>
    </article>
  );
}
