import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { profile, repoCount } from "@/lib/github";
import { site } from "@/data/site.config";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

const title = `${site.displayName} — Web Developer`;

const description = `Portfolio of ${site.displayName} (${site.owner}): ${repoCount} public repositories, built across TypeScript, Vue, PHP, Rust, Lua and Python.`;

/** The page, described for the machines that read it. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.displayName,
  url: `https://${site.domain}/${site.repo}/`,
  sameAs: [site.contact.github],
  jobTitle: site.roles.join(", "),
};

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}/${site.repo}`),
  title,
  description,
  alternates: { canonical: "/" },
  authors: [{ name: site.displayName, url: site.contact.github }],
  creator: site.owner,
  openGraph: {
    type: "website",
    title,
    description,
    url: `https://${site.domain}/${site.repo}`,
    siteName: title,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#b2c7ab",
};

/** Applies the stored theme before first paint so the page never flashes. */
const themeScript = `try{var t=localStorage.getItem('portfolio-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.dataset.theme='dark';var m=document.querySelector('meta[name="theme-color"]');if(m)m.content='#0c0d0d'}}catch(e){}`;

/**
 * The page always opens at the top. The browser brings back the place a page
 * was left at, and on a site that is one long scroll that is never what the
 * visitor wants after a reload.
 */
const scrollScript = `try{if('scrollRestoration' in history)history.scrollRestoration='manual';window.scrollTo(0,0)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:border focus:border-rule-strong focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <SiteHeader />
        <main
          id="main"
          className="pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-[calc(4rem+env(safe-area-inset-top))]"
        >
          {children}
        </main>
      </body>
    </html>
  );
}
