# eldecogrp.com — React (Vite SSG) conversion

Same site, same URLs, same design as the static build — converted to
Vite + React 18 with full prerendering (SSG). Every page is a real static
HTML file in `dist/` at the exact same path as before (`/`, `/about.html`,
`/projects/<slug>.html`, …), so no URL changes and no re-indexing.

## Develop / build
```bash
npm install
npm run build   # client build + SSR build + prerender -> dist/
```
`npm run build` runs: vite client build → vite SSR build → `scripts/prerender.mjs`
(writes all 29 HTML files into `dist/` and bumps sitemap `lastmod` for project
pages only). Serve `dist/` with any static host (e.g. `python3 -m http.server`
inside `dist/`, or Vercel with output directory `dist`).

## Layout
- `src/config.js` — site config incl. **EmailJS keys** (serviceId / templateId /
  publicKey), phone & WhatsApp numbers, central image paths.
- `src/data/projects.js`, `src/data/content.js` — generated data. Regenerate with
  `npm run export-data` (`tools/export_data.py` reads the old generator
  `~/workspace/eldeco-site/build.py` + the baseline HTML). Do not edit by hand.
- `src/pages/`, `src/components/` — page templates ported from build.py.
- `public/` — verbatim static files copied into `dist/`: `css/` (unchanged
  baseline CSS), `assets/` (images), `js/config.js` (shipped config copy with the
  same EmailJS keys), `js/images-config.json`, `sitemap.xml`, `robots.txt`,
  `llms.txt`, `site.webmanifest`, `vercel.json`.
- `tools/audit.py` — differential audit of `dist/` vs the baseline static site
  (canonical, robots, JSON-LD types, FAQ/Related, topbar comment, disclaimer,
  sitemap set). Must print ALL PASS.
- `audit-shots/` — verification screenshots of the built site.

## Enquiry forms (EmailJS)
Forms POST to `https://api.emailjs.com/api/v1.0/email/send` with the keys in
`src/config.js` (template params: from_name, phone, email, interest, project,
message, reply_to). On success: thank-you toast + form reset + lead tracking.
On failure: the form falls back to opening WhatsApp with the same details, so
no lead is lost. A live test enquiry after deploy is still recommended.
