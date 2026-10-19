import type { NextConfig } from "next";

/**
 * The site is published as a GitHub Pages project site, so it is served from
 * `https://<user>.github.io/<repo>/`. Both `basePath` and `assetPrefix` must carry
 * that prefix, otherwise `/_next/*` assets 404.
 */
const repoName = process.env.PORTFOLIO_REPO_NAME ?? "portfolio";
const prefix = `/${repoName}`;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: prefix,
  assetPrefix: prefix,
  // The home directory holds other lockfiles; anchor tracing to this project.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
