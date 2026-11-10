import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Jost } from "next/font/google";

import { repoCount } from "@/lib/github";
import { languages } from "@/lib/github";
import { featuredRepos } from "@/lib/github";
import { site, works } from "@/data/site.config";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

/**
 * The wordmark's own face: Jost, the geometric Futura revival — the lettering
 * of the space age. The interface stays on Geist; a logo carries its own type.
 */
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const title = `orbi — ${site.displayName}, Personal Digital Environment`;

const description = `The portfolio of ${site.displayName} (${site.owner}) as an operating system: ${repoCount} public repositories, ${languages.length} languages, built across TypeScript, Vue, PHP, Rust, Lua and Python.`;

/** The page, described for the machines that read it. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.displayName,
  alternateName: site.owner,
  url: `https://${site.domain}/${site.repo}/`,
  sameAs: [site.contact.github],
  jobTitle: site.roles.join(", "),
};

const siteUrl = `https://${site.domain}/${site.repo}/`;

/**
 * The projects live inside an application, so they are declared as a list in
 * the initial payload: a crawler that never runs the shell still learns every
 * work, its line and its address.
 */
const worksSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Selected work",
  itemListElement: featuredRepos.map((repo, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: repo.name,
    url: `${siteUrl}#/projects/${repo.name}`,
    description: works[repo.name]?.blurb ?? repo.summary,
  })),
};

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title,
  description,
  alternates: { canonical: `/${site.repo}/` },
  authors: [{ name: site.displayName, url: site.contact.github }],
  creator: site.owner,
  keywords: [
    "portfolio",
    "developer",
    "desktop environment",
    "TypeScript",
    "Vue",
    "PHP",
    "Rust",
  ],
  openGraph: {
    type: "website",
    title,
    description,
    url: siteUrl,
    siteName: "orbi",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
  // The shell names its kind for the readers that ask it: the page is a
  // piece of software, not a store or a place.
  other: { "page-type": "software", "site-kind": "software" },
};

export const viewport: Viewport = {
  themeColor: "#101216",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Applies the stored theme before first paint so the shell never flashes. */
const themeScript = `try{var t=localStorage.getItem('portfolio-theme');var d=(t==='dark')||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=d?'#101216':'#f2f3f5'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-type="software"
      className={`${geist.variable} ${geistMono.variable} ${jost.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(worksSchema) }}
        />
      </head>
      <body>
        {/* THESIS: the desktop is a precision orbital instrument — one
            luminous body at the focus of one drawn trajectory — refusing the
            space-UI default of scattered stars and neon gradients.
            OWN-WORLD: obsidian field, blue-silver volumetric light, hairline
            trajectories, a rim-lit sphere, ultra-thin tracked type, one
            signal-green status.
            STORY: a visitor lands inside a designed system, opens real work
            from the dock or the field, and leaves with the contact.
            FIRST VIEWPORT: full-bleed orbital field; the emblem centred at
            ~62vw with the orbit crossing the sphere; `orbiOS` thin and wide
            under it; app icons in the left
            column; glass dock at the foot; status pill top right.
            FORM: Kepler-diagram precision fused with cinematic product
            splash; brief-pinned over seed 39a7414c; raises: cursor parallax
            (shader portal), deterministic travellers (gravity garden),
            context-tied glow (chromatophore skin).
            FINISH: unreviewed and undocumented is unfinished; this build ends
            with the finish review, the verdict, and DESIGN.md */}
        {children}
      </body>
    </html>
  );
}
