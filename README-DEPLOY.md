# Eldeco Channel Partner Site — React Version (eldeco-react)

Vite 5 + React 18 conversion of eldecogrp.com. The build is **prerendered (SSG)**:
every page is real static HTML, so **all URLs, the sitemap and SEO are unchanged** —
no re-indexing needed in Google Search Console.

## What's inside

- `src/` — React source (components, pages, `src/data/` generated from the site data, `src/config.js` with EmailJS keys)
- `dist/` — **ready-to-deploy build output** (29 HTML pages + assets + sitemap.xml). This is what goes live.
- `tools/` — data export + audit scripts (`tools/audit.py` compares dist against the old static site)
- `public/` — static files copied verbatim into dist (css, assets, js/config.js)

## Deploy — Option A (recommended, zero build)

Upload the **contents of `dist/`** to the eldego7peak repo root (replacing the current
static files) and push. Vercel already serves that repo as a static site
(`dist/vercel.json` keeps framework/build/output settings identical to today).
Nothing else changes — same domain, same URLs, same sitemap.

## Deploy — Option B (build from source)

Connect this project to Vercel as a NEW project/repo with:
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Locally: `npm install && npm run build` regenerates `dist/` from source.

## EmailJS (already wired — same keys as the live site)

- Service ID: `service_fkmfynb` · Template ID: `template_bdjcyq6` · Public key in `src/config.js`
- Enquiry forms send email first; if the send fails, WhatsApp opens automatically with the
  same details — no lead is lost either way.
- After deploying, send ONE real test enquiry from the live site and confirm it lands in
  the inbox (a live test on the current static site with these keys already passed on 2026-11-09).

## SEO changes vs the old static site (project pages only)

- Titles: `{Project} {Location} | {Configuration} — Price on Request` (config dropped only where name+location alone exceed ~78 chars)
- Meta descriptions rewritten around project name + location + configuration + status + RERA
- RealEstateListing schema now carries a full PostalAddress (sector, city, Uttar Pradesh, IN)
- Breadcrumb (visible + schema): Home → area page (Noida / Greater Noida / Yamuna Expressway) → project
- Image alt texts carry project name + location
- Sitemap: same 28 URLs; `lastmod` bumped to 2026-11-09 for project pages so Google re-crawls them sooner
- Homepage, About, Contact, area pages and 404: titles/descriptions **unchanged**

Note: opening the HTML files straight from the folder will look unstyled — CSS/JS load
by server paths (`/css/...`, `/assets/...`). Serve the folder (or deploy) to see it correctly.
