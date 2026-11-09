#!/usr/bin/env python3
"""Export site data for the React build.

Sources (both read-only):
  - ~/workspace/eldeco-site/build.py          -> PROJECTS (canonical project data)
  - ~/workspace/eldeco-site/eldecogrp-site/   -> baseline HTML (post-build extras the
    generator does not know about: homepage @graph + FAQs, area pages, project
    FAQ/Related sections, completed-page enriched sections, image paths/dimensions,
    exact titles/descriptions/og:images of non-project pages)

Outputs:
  - src/data/projects.js
  - src/data/content.js
"""
import html as htmllib
import importlib.util
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BASE = os.path.expanduser("~/workspace/eldeco-site/eldecogrp-site")
BUILD_PY = os.path.expanduser("~/workspace/eldeco-site/build.py")

spec = importlib.util.spec_from_file_location("eldeco_build", BUILD_PY)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
PROJECTS = mod.PROJECTS


def read(rel):
    with open(os.path.join(BASE, rel), encoding="utf-8") as f:
        return f.read()


def text_of(fragment):
    txt = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", htmllib.unescape(txt)).strip()


def meta(page, name, attr="name"):
    m = re.search(rf'<meta {attr}="{re.escape(name)}" content="(.*?)"', page, re.S)
    return htmllib.unescape(m.group(1)) if m else ""


def title_of(page):
    m = re.search(r"<title>(.*?)</title>", page, re.S)
    return htmllib.unescape(m.group(1)) if m else ""


def parse_faqs(page):
    sec = re.search(r'<section id="faq">.*?</section>', page, re.S)
    if not sec:
        return []
    out = []
    for q, a in re.findall(r"<summary>(.*?)</summary><p>(.*?)</p>", sec.group(0), re.S):
        out.append({"q": text_of(q), "a": text_of(a)})
    return out


# ---------------------------------------------------------------- projects
projects = []
for p in PROJECTS:
    page = read(f"projects/{p['slug']}.html")
    hero_m = re.search(r'class="p-banner" style="background-image:url\(\'([^\']+)\'\)"', page)
    gallery = re.findall(r'<figure class="p-gal-item"><img loading="lazy" src="([^"]+)"', page)
    extra_m = re.search(r'<img loading="lazy" class="p-fp-img" src="([^"]+)"', page)
    rel_sec = re.search(r'<section id="related">.*?</section>', page, re.S)
    related = re.findall(r'href="/projects/([a-z0-9-]+)\.html"', rel_sec.group(0)) if rel_sec else []
    completed_html = None
    if p["status"] == "Completed":
        ov = re.search(r'<section id="overview".*?</section>', page, re.S).group(0)
        leads = re.findall(r'<p class="p-lead">.*?</p>', ov, re.S)
        def section_parts(sec_re):
            m = re.search(sec_re, page, re.S)
            if not m:
                return None
            tag = re.match(r'<section([^>]*)>(.*)</section>', m.group(0), re.S)
            return {"attrs": tag.group(1).strip(), "html": tag.group(2)}
        completed_html = {
            "overviewExtra": "\n".join(leads[1:]),
            "locality": section_parts(r'<section id="locality".*?</section>'),
            "resale": section_parts(r'<section id="resale".*?</section>'),
        }
    projects.append({
        "slug": p["slug"], "name": p["name"], "area": p["area"],
        "location": p["location"], "config": p["config"], "status": p["status"],
        "rera": p["rera"], "launch": p["launch"], "official": p["official"],
        "overview": p["overview"], "amenities": p["amenities"],
        "locationAdv": p["location_adv"], "extraLabel": p["extra_label"],
        "images": {
            "hero": hero_m.group(1) if hero_m else "/assets/images/projects/completed-banner.webp",
            "gallery": gallery,
            "extra": extra_m.group(1) if extra_m else "",
        },
        "faqs": parse_faqs(page),
        "related": related,
        "completedHtml": completed_html,
    })

# ---------------------------------------------------------------- homepage / static content
index = read("index.html")
graph = json.loads(re.findall(r'<script type="application/ld\+json">(.*?)</script>', index, re.S)[0])

areas_sec = re.search(r'<section id="areas">.*?</section>', index, re.S).group(0)
area_cards = []
for card in re.findall(r'<div class="card"><div class="card-body">(.*?)</div></div>', areas_sec, re.S):
    h3 = text_of(re.search(r"<h3>(.*?)</h3>", card, re.S).group(1))
    para = text_of(re.search(r"<p>(.*?)</p>", card, re.S).group(1))
    a = re.search(r'<a class="btn btn-primary" href="([^"]+)">(.*?)</a>', card, re.S)
    area_cards.append({"title": h3, "text": para, "href": a.group(1), "label": text_of(a.group(2))})

AREA_SLUGS = {"Noida": "noida", "Greater Noida": "greater-noida", "Yamuna Expressway": "yamuna-expressway"}
areas = []
for slug in ["noida", "greater-noida", "yamuna-expressway"]:
    page = read(f"areas/{slug}.html")
    h1 = text_of(re.search(r"<h1>(.*?)</h1>", page, re.S).group(1))
    lead = text_of(re.search(r'<p class="lead">(.*?)</p>', page, re.S).group(1))
    intro = re.search(r'</nav></div>\s*<section><div class="wrap">(.*?)</div></section>', page, re.S)
    area_name = {"noida": "Noida", "greater-noida": "Greater Noida", "yamuna-expressway": "Yamuna Expressway"}[slug]
    areas.append({
        "slug": slug, "area": area_name, "title": title_of(page),
        "desc": meta(page, "description"), "ogImage": meta(page, "og:image", "property"),
        "h1": h1, "lead": lead, "introHtml": intro.group(1) if intro else "",
    })

about = read("about.html")
about_body = re.search(r'<section><div class="wrap"><h1>About Eldeco Group</h1>(.*?)</div></section>', about, re.S).group(1)

contact = read("contact.html")
contact_inner = re.search(r'<section><div class="wrap"><h1>Contact Us</h1>(.*?)</div></section>', contact, re.S).group(1)
form_wrap = re.search(r'<div style="max-width:520px">.*?</form></div>', contact_inner, re.S)
contact_pre = contact_inner[:form_wrap.start()]
contact_post = contact_inner[form_wrap.end():]

nf = read("404.html")

dims = {}
for src, w, h in re.findall(r'src="(/assets/images/[^"]+)" alt="[^"]*" width="(\d+)" height="(\d+)"', index):
    dims[src] = [int(w), int(h)]

content = {
    "home": {"title": title_of(index), "desc": meta(index, "description"),
             "ogImage": meta(index, "og:image", "property"), "graph": graph,
             "faqs": parse_faqs(index)},
    "areaCards": area_cards,
    "areas": areas,
    "about": {"title": title_of(about), "desc": meta(about, "description"),
              "ogImage": meta(about, "og:image", "property"), "bodyHtml": about_body},
    "contact": {"title": title_of(contact), "desc": meta(contact, "description"),
                "ogImage": meta(contact, "og:image", "property"),
                "preHtml": contact_pre, "postHtml": contact_post},
    "notFound": {"title": title_of(nf), "desc": meta(nf, "description"),
                 "ogImage": meta(nf, "og:image", "property")},
    "imageDims": dims,
    "areaSlugs": AREA_SLUGS,
}

os.makedirs(os.path.join(ROOT, "src", "data"), exist_ok=True)
with open(os.path.join(ROOT, "src", "data", "projects.js"), "w", encoding="utf-8") as f:
    f.write("// Generated by tools/export_data.py from build.py + baseline HTML. Do not edit by hand.\n")
    f.write("export const PROJECTS = " + json.dumps(projects, ensure_ascii=False, indent=1) + ";\n")
with open(os.path.join(ROOT, "src", "data", "content.js"), "w", encoding="utf-8") as f:
    f.write("// Generated by tools/export_data.py from the baseline HTML. Do not edit by hand.\n")
    f.write("export const CONTENT = " + json.dumps(content, ensure_ascii=False, indent=1) + ";\n")

print(f"projects: {len(projects)} | faqs home: {len(content['home']['faqs'])} | areas: {len(areas)} | dims: {len(dims)}")
for p in projects:
    print(p["slug"], "| faqs:", len(p["faqs"]), "| related:", len(p["related"]),
          "| gallery:", len(p["images"]["gallery"]), "| extra:", bool(p["images"]["extra"]))
