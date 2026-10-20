"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { site } from "@/data/site.config";
import { Marquee } from "@/components/marquee";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/#developer", label: "the developer" },
  { href: "/#works", label: "selected works" },
  { href: "/#services", label: "my services" },
  { href: "/#stack", label: "my stack" },
  { href: "/#contact", label: "contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    // The page behind the overlay leaves the focus order, so Tab cannot walk
    // into content the visitor cannot see.
    const main = document.getElementById("main");

    if (main) main.toggleAttribute("inert", open);

    return () => {
      document.body.style.overflow = "";
      main?.removeAttribute("inert");
    };
  }, [open]);

  // Opening the menu moves the focus inside it, so keyboard users land on the
  // first entry instead of walking the whole page behind the overlay.
  useEffect(() => {
    if (!open) return;

    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !open) return;

      setOpen(false);
      toggleRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header
        inert={open}
        className="fixed inset-x-0 top-0 z-30 grid h-[calc(3.5rem+env(safe-area-inset-top))] grid-cols-4 border-b border-rule-strong bg-surface pt-[env(safe-area-inset-top)] md:h-[calc(4rem+env(safe-area-inset-top))] md:grid-cols-12"
      >
        <noscript>
          <nav
            aria-label="sections"
            className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-20 flex flex-wrap gap-4 border-b border-rule-strong bg-surface px-3 py-2 md:top-[calc(4rem+env(safe-area-inset-top))]"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.65rem] font-bold tracking-[0.18em] uppercase underline underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </noscript>
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
              "open to freelance",
            ]}
          />
        </div>
        <div className="col-span-2 flex items-stretch justify-end md:col-span-3">
          <ThemeToggle />
        </div>
      </header>

      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
        className="group fixed right-0 top-0 z-[52] flex h-[calc(3.5rem+env(safe-area-inset-top))] w-14 cursor-pointer items-center justify-center border-b border-l border-rule-strong bg-surface pt-[env(safe-area-inset-top)] transition-colors hover:bg-ink md:h-[calc(4rem+env(safe-area-inset-top))] md:w-16"
      >
        {/* Three bars that fold into a cross. They are placed with transforms
            and not with top, so the animation never touches layout, and each
            one keeps its own line. */}
        <span className="relative block h-4 w-6" aria-hidden="true">
          <span
            className={[
              "absolute left-0 top-1/2 block h-px w-full transition-transform duration-300",
              open
                ? "translate-y-0 rotate-45 bg-ink group-hover:bg-surface"
                : "-translate-y-2 rotate-0 bg-ink group-hover:bg-surface",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-1/2 block h-px w-full transition-[transform,opacity] duration-300",
              open
                ? "-translate-y-1/2 scale-x-0 bg-ink opacity-0"
                : "-translate-y-1/2 scale-x-100 bg-ink opacity-100 group-hover:bg-surface",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-1/2 block h-px w-full transition-transform duration-300",
              open
                ? "translate-y-0 -rotate-45 bg-ink group-hover:bg-surface"
                : "translate-y-2 rotate-0 bg-ink group-hover:bg-surface",
            ].join(" ")}
          />
        </span>
      </button>

      <div
        id="site-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-0 z-[50] overscroll-contain overflow-y-auto bg-surface pt-[env(safe-area-inset-top)]"
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
                  prefetch={false}
                  onClick={() => {
                    setOpen(false);
                    toggleRef.current?.focus();
                  }}
                  className="group flex items-baseline gap-4 px-3 py-4 transition-colors hover:bg-ink hover:text-surface md:px-4 md:py-6"
                >
                  <span className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-muted group-hover:text-surface">
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
              className="text-sm underline underline-offset-4 hover:text-muted"
            >
              github.com/{site.owner}
            </a>
            {site.contact.email ? (
              <a
                href={`mailto:${site.contact.email}`}
                className="text-sm underline underline-offset-4 hover:text-muted"
              >
                {site.contact.email}
              </a>
            ) : null}
            {site.contact.discord ? (
              <p className="text-sm">
                discord:{" "}
                <span className="underline underline-offset-4">
                  {site.contact.discord}
                </span>
              </p>
            ) : null}
          </div>
        </nav>
      </div>
    </>
  );
}
