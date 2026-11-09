// Prerender every route to a real static HTML file in dist/, mirroring the
// original site's file layout exactly (same .html paths, /css, /assets, /js).
// Also bumps sitemap lastmod for project pages only.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render, allRoutes } from "../dist-ssr/entry-server.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const manifest = JSON.parse(readFileSync(join(dist, ".vite", "manifest.json"), "utf-8"));
const clientJs = manifest["index.html"].file;

const routes = allRoutes();
for (const route of routes) {
  const { head, bodyClass, file, html } = render(route.path);
  const doc =
    `<!DOCTYPE html>\n<html lang="en"><head>\n${head}</head>` +
    `<body${bodyClass ? ` class="${bodyClass}"` : ""}>\n` +
    // The baseline keeps the topbar line commented out (owner's instruction);
    // React cannot emit HTML comments, so it is injected here verbatim.
    `<!-- <div class="topbar">Authorized Channel Partner — this is not the official Eldeco Group website.</div> -->\n` +
    `<div id="root">${html}</div>\n` +
    `<script src="/js/config.js"></script>` +
    `<script type="module" src="/${clientJs}"></script>` +
    `</body></html>\n`;
  const out = join(dist, file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, doc, "utf-8");
  console.log("prerendered", file);
}

// Sitemap: same 28 URLs; bump lastmod to today only for project pages.
const smPath = join(dist, "sitemap.xml");
let sm = readFileSync(smPath, "utf-8");
sm = sm.replace(
  /(<loc>https:\/\/www\.eldecogrp\.com\/projects\/[a-z0-9-]+\.html<\/loc><lastmod>)[^<]+(<\/lastmod>)/g,
  "$12026-11-09$2"
);
writeFileSync(smPath, sm, "utf-8");
console.log("sitemap.xml: project lastmod -> 2026-11-09");
console.log(`done: ${routes.length} pages`);
