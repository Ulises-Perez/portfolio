import type { NextConfig } from "next";

/**
 * The site is published as a GitHub Pages project site, so the built export is
 * served from `https://<user>.github.io/<repo>/`. Both `basePath` and
 * `assetPrefix` must carry that prefix, otherwise `/_next/*` assets 404.
 *
 * Development is the exception: `next dev` serves the portfolio at the root,
 * because there is nothing else on that origin and a developer should not
 * have to remember the deploy path to open their own site.
 */
const repoName = process.env.PORTFOLIO_REPO_NAME ?? "portfolio";
const isDev = process.env.NODE_ENV === "development";
const prefix = isDev ? "" : `/${repoName}`;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: prefix,
  assetPrefix: prefix || undefined,
  // The home directory holds other lockfiles; anchor tracing to this project.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
