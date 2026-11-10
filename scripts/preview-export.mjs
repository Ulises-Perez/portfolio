/**
 * Serves the static export the way GitHub Pages does: from the repository
 * sub-path. The export is built with `basePath=/portfolio`, so it is mounted
 * there instead of at the root of a dev server.
 *
 *   npm run build && node scripts/preview-export.mjs
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "out");
const prefix = "/portfolio";
const port = Number(process.env.PREVIEW_PORT ?? 3311);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  let path = decodeURIComponent(url.pathname);

  if (!path.startsWith(prefix)) {
    response.writeHead(302, { location: `${prefix}/` }).end();
    return;
  }

  path = path.slice(prefix.length) || "/";

  let file = join(root, path);

  if (existsSync(file) && statSync(file).isDirectory()) {
    file = join(file, "index.html");
  } else if (!existsSync(file) && existsSync(`${file}.html`)) {
    file = `${file}.html`;
  }

  if (!existsSync(file)) {
    file = join(root, "404.html");
    response.writeHead(404, { "content-type": types[".html"] });
    createReadStream(file).pipe(response);
    return;
  }

  response.writeHead(200, {
    "content-type": types[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(response);
}).listen(port, () => {
  console.log(`export served at http://localhost:${port}${prefix}/`);
});
