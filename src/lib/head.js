import { DOMAIN } from "../config.js";
import { esc } from "./site.js";

// Builds the <head> exactly in the baseline site's order/format:
// charset, viewport, robots, title, description, canonical, OG, Twitter,
// icons, manifest, /css/style.css, JSON-LD blocks, (project pages: fonts + project.css).
export function buildHead({ title, desc, path, ogImage, robots, lds = [], projectFonts = false }) {
  const robotsMeta = robots || "index, follow, max-image-preview:large, max-snippet:-1";
  const ldHtml = lds
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join("");
  const fonts = projectFonts
    ? '<link rel="preconnect" href="https://fonts.googleapis.com">' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">' +
      '<link rel="stylesheet" href="/css/project.css">'
    : "";
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="${esc(robotsMeta)}">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${DOMAIN}${path}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Eldeco Group Projects — Authorized Channel Partner">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${DOMAIN}${path}"><meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(ogImage)}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/css/style.css">
${ldHtml}${fonts}`;
}
