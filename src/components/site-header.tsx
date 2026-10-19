"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { site } from "@/data/site.config";
import { Marquee } from "@/components/marquee";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/#developer", label: "the developer" },
  { href: "/#works", label: "selected works" },
  { href: "/#repositories", label: "all repositories" },
  { href: "/#stack", label: "my stack" },
  { href: "/#contact", label: "contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 grid h-14 grid-cols-4 border-b border-rule-strong bg-surface md:h-16 md:grid-cols-12">
        <Link
          href="/"
          className="col-span-2 flex items-center border-r border-rule-strong px-3 text-2xl font-bold tracking-[-0.06em] md:col-span-3 md:px-4 md:text-3xl"
        >
          {site.displayName.toLowerCase()}.
        </Link>
        <div className="hidden border-r border-rule-strong md:col-span-6 md:block">
          <Marquee
            items={[
              "available for new projects",
              "remote · worldwide",
              "github.com/Ulises-Perez",
              "{clock}",
            ]}
          />
        </div>
        <div className="col-span-2 flex items-stretch justify-end md:col-span-3">
          <ThemeToggle />
        </div>
      </header>

      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
        className="group fixed right-0 top-0 z-[52] flex h-14 w-14 cursor-pointer items-center justify-center border-b border-l border-rule-strong bg-surface transition-colors hover:bg-ink hover:text-surface md:h-16 md:w-16"
      >
        <span className="relative block h-4 w-6">
          <span
            className={[
              "absolute left-0 block h-px w-full transition-all duration-300",
              open ? "top-1/2 rotate-45 bg-ink group-hover:bg-surface" : "top-0 bg-ink group-hover:bg-surface",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-1/2 block h-px w-full transition-all duration-300",
              open ? "bg-ink group-hover:bg-surface" : "bg-ink group-hover:bg-surface",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 block h-px w-full transition-all duration-300",
              open ? "top-1/2 -rotate-45 bg-ink group-hover:bg-surface" : "top-2 bg-ink group-hover:bg-surface",
            ].join(" ")}
          />
        </span>
      </button>

      <div
        id="site-menu"
        hidden={!open}
        className="fixed inset-0 z-[50] overflow-y-auto bg-surface"
      >
        <nav className="grid min-h-full grid-cols-4 content-start md:grid-cols-12">
          <div className="col-span-4 border-b border-rule-strong md:col-span-12">
            <p className="eyebrow px-3 pt-24 md:px-4 md:pt-32">menu</p>
          </div>
          <ul className="col-span-4 md:col-span-8">
            {links.map((link, index) => (
              <li key={link.href} className="border-b border-rule-strong">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 px-3 py-4 transition-colors hover:bg-ink hover:text-surface md:px-4 md:py-6"
                >
                  <span className="text-[0.7rem] font-bold tracking-[0.18em] uppercase opacity-60">
                    0{index + 1}
                  </span>
                  <span className="display text-4xl md:text-6xl">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="col-span-4 flex flex-col justify-end gap-2 p-3 md:col-span-4 md:p-4">
            <p className="eyebrow">get in touch</p>
            <a
              href={site.contact.github}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline underline-offset-4 hover:opacity-60"
            >
              github.com/{site.owner}
            </a>
            {site.contact.email ? (
              <a
                href={`mailto:${site.contact.email}`}
                className="text-sm underline underline-offset-4 hover:opacity-60"
              >
                {site.contact.email}
              </a>
            ) : null}
          </div>
        </nav>
      </div>
    </>
  );
}
