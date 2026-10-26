"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { sections, site } from "@/data/site.config";
import { Marquee } from "@/components/marquee";
import { ThemeToggle } from "@/components/theme-toggle";
import { easeOutQuart, getLenis } from "@/lib/smooth-scroll";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [localTime, setLocalTime] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Live clock for menu panel
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll progress and active section
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setScrollProgress(progress);

      // Identify active section
      const sectionElements = sections
        .map((s) => ({ id: s.href.slice(1), el: document.getElementById(s.href.slice(1)) }))
        .filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const rect = sectionElements[i].el.getBoundingClientRect();
        if (rect.top <= 200) {
          setActiveSection(sectionElements[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    const main = document.getElementById("main");
    if (main) main.toggleAttribute("inert", open);

    return () => {
      document.body.style.overflow = "";
      main?.removeAttribute("inert");
    };
  }, [open]);

  // Keyboard navigation inside open menu
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
        {/* Logo with tactile hover inversion */}
        <Link
          href="/"
          className="col-span-2 flex items-center border-r border-rule-strong px-3 text-2xl font-bold tracking-[-0.06em] transition-colors duration-300 hover:bg-ink hover:text-surface md:col-span-3 md:px-4 md:text-3xl"
        >
          {site.displayName.toLowerCase()}.
        </Link>

        {/* Marquee strip */}
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

        {/* Theme toggle container */}
        <div className="col-span-2 flex items-stretch justify-end md:col-span-3">
          <ThemeToggle />
        </div>

        {/* Reading progress hairline bar */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-ink origin-left transition-transform duration-75 ease-out"
          style={{ transform: `scaleX(${scrollProgress})` }}
          aria-hidden="true"
        />
      </header>

      {/* Fallback navigation for noscript */}
      <noscript>
        <nav
          aria-label="sections"
          className="noscript-nav flex flex-wrap gap-4 border-b border-rule-strong bg-surface px-3 py-2 md:px-4"
        >
          {sections.map((link) => (
            <a
              key={link.href}
              href={link.href.slice(1)}
              className="text-[0.65rem] font-bold tracking-[0.18em] uppercase underline underline-offset-4"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </noscript>

      {/* Fixed Hamburger / Close toggle button */}
      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
        className="group fixed right-0 top-0 z-[52] flex h-[calc(3.5rem+env(safe-area-inset-top))] w-14 cursor-pointer items-center justify-center border-b border-l border-rule-strong bg-surface pt-[env(safe-area-inset-top)] transition-colors duration-300 hover:bg-ink md:h-[calc(4rem+env(safe-area-inset-top))] md:w-16"
      >
        <span className="relative block h-4 w-6" aria-hidden="true">
          <span
            className={[
              "absolute left-0 top-1/2 block h-px w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open
                ? "translate-y-0 rotate-45 bg-ink group-hover:bg-surface"
                : "-translate-y-2 rotate-0 bg-ink group-hover:bg-surface",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-1/2 block h-px w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open
                ? "-translate-y-1/2 scale-x-0 bg-ink opacity-0"
                : "-translate-y-1/2 scale-x-100 bg-ink opacity-100 group-hover:bg-surface",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0 top-1/2 block h-px w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open
                ? "translate-y-0 -rotate-45 bg-ink group-hover:bg-surface"
                : "translate-y-2 rotate-0 bg-ink group-hover:bg-surface",
            ].join(" ")}
          />
        </span>
      </button>

      {/* Smoothly animated Menu Overlay */}
      <div
        id="site-menu"
        ref={menuRef}
        data-lenis-prevent
        aria-hidden={!open}
        className={`fixed inset-0 z-[50] overscroll-contain overflow-y-auto bg-surface pt-[env(safe-area-inset-top)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-3 pointer-events-none invisible"
        }`}
      >
        <nav className="grid min-h-full grid-cols-4 content-start md:grid-cols-12">
          {/* Header row in menu */}
          <div className="col-span-4 flex items-center justify-between border-b border-rule-strong px-3 pt-20 pb-3 md:col-span-12 md:px-4 md:pt-28 md:pb-4">
            <p className="eyebrow">navigation</p>
            {localTime && (
              <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-muted">
                local time · {localTime}
              </p>
            )}
          </div>

          {/* Section links with entrance stagger and hover arrow */}
          <ul className="col-span-4 border-b border-rule-strong md:col-span-8 md:border-b-0 md:border-r">
            {sections.map((link, index) => {
              const sectionId = link.href.slice(1);
              const isActive = activeSection === sectionId;

              return (
                <li
                  key={link.href}
                  className="border-b border-rule-strong last:border-b-0"
                  style={{
                    transitionDelay: open ? `${120 + index * 50}ms` : "0ms",
                  }}
                >
                  <Link
                    href={link.href}
                    prefetch={false}
                    onClick={(event) => {
                      const lenis = getLenis();
                      const url = new URL(event.currentTarget.href);
                      const target = url.hash ? document.querySelector(url.hash) : null;

                      if (lenis && target) {
                        event.preventDefault();
                        lenis.scrollTo(target, {
                          duration: 0.9,
                          easing: easeOutQuart,
                        });
                        window.history.pushState(null, "", url.hash);
                      }

                      setOpen(false);
                      toggleRef.current?.focus();
                    }}
                    className={`group flex items-center gap-4 px-3 py-4 transition-colors duration-200 hover:bg-ink hover:text-surface md:px-4 md:py-6 ${
                      isActive ? "bg-ink/5" : ""
                    }`}
                  >
                    <span className="font-mono text-[0.7rem] font-bold tracking-[0.18em] uppercase text-muted group-hover:text-surface">
                      0{index + 1}
                    </span>
                    <span className="display text-4xl md:text-6xl flex items-center gap-3">
                      {link.label}
                      {isActive && (
                        <span
                          className="h-2 w-2 bg-ink group-hover:bg-surface"
                          title="Current section"
                          aria-label="(current section)"
                        />
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className="ml-auto text-2xl font-light opacity-0 -translate-x-3 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 md:text-4xl"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right column: Availability status & Contact info */}
          <div className="col-span-4 flex flex-col justify-between gap-8 p-4 md:col-span-4 md:p-6 md:min-h-[420px]">
            <div>
              <p className="eyebrow mb-3">status</p>
              <div className="flex items-center gap-2 border border-rule-strong bg-surface px-3 py-2 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[0.65rem] font-bold tracking-[0.12em] uppercase text-muted">
                  available for new projects
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-rule-strong pt-6">
              <p className="eyebrow">channels</p>
              <a
                href={site.contact.github}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between text-sm transition-colors hover:text-muted"
              >
                <span>github.com/{site.owner}</span>
                <span className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                  ↗
                </span>
              </a>
              {site.contact.email ? (
                <a
                  href={`mailto:${site.contact.email}`}
                  className="group flex items-center justify-between text-sm transition-colors hover:text-muted"
                >
                  <span>{site.contact.email}</span>
                  <span className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                    ↗
                  </span>
                </a>
              ) : null}
              {site.contact.discord ? (
                <p className="text-sm flex items-center justify-between text-muted">
                  <span>discord: {site.contact.discord}</span>
                </p>
              ) : null}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
