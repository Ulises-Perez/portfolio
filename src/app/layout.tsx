import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";

import { GridOverlay } from "@/components/grid-overlay";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/lib/github";
import { site } from "@/data/site.config";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const title = `${site.displayName} — Web Developer`;

const description = `Portfolio of ${site.displayName} (${site.owner}): ${profile.publicRepos} public repositories, built across TypeScript, Vue, PHP, Rust, Lua and Python.`;

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}/${site.repo}`),
  title,
  description,
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#b2c7ab" },
    { media: "(prefers-color-scheme: dark)", color: "#6a0c06" },
  ],
};

/** Applies the stored theme before first paint so the page never flashes. */
const themeScript = `try{var t=localStorage.getItem('portfolio-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.dataset.theme='dark'}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <GridOverlay />
        <SiteHeader />
        <main className="pt-14 md:pt-16">{children}</main>
      </body>
    </html>
  );
}
