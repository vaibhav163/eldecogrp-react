#!/usr/bin/env python3
"""Differential audit: dist/ (React SSG output) vs the baseline static site.

Per page checks: canonical equal, robots meta equal, every JSON-LD block parses
and the set of @types is a superset of the baseline's, FAQ/Related sections
present wherever the baseline has them, topbar still commented out, footer
disclaimer present. Also: sitemap URL set identical, exactly 29 HTML files.
"""
import json
import os
import re
import sys

BASE = os.path.expanduser("~/workspace/eldeco-site/eldecogrp-site")
DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")

FILES = (
    ["index.html", "about.html", "contact.html", "404.html"]
    + [f"areas/{s}.html" for s in ["noida", "greater-noida", "yamuna-expressway"]]
    + [f"projects/{f}" for f in sorted(os.listdir(os.path.join(BASE, "projects"))) if f.endswith(".html")]
)


def read(root, rel):
    with open(os.path.join(root, rel), encoding="utf-8") as f:
        return f.read()


def canonical(page):
    m = re.search(r'rel="canonical" href="([^"]+)"', page)
    return m.group(1) if m else None


def robots(page):
    m = re.search(r'name="robots" content="([^"]+)"', page)
    return m.group(1) if m else None


def ld_types(page):
    types = set()
    bad = 0
    for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', page, re.S):
        try:
            data = json.loads(raw)
        except Exception:
            bad += 1
            continue
        nodes = data.get("@graph", [data]) if isinstance(data, dict) else []
        for node in nodes:
            t = node.get("@type")
            if isinstance(t, list):
                types.update(t)
            elif t:
                types.add(t)
    return types, bad


fails = 0
print(f"{'PAGE':52} RESULT")
for rel in FILES:
    problems = []
    try:
        dist = read(DIST, rel)
    except FileNotFoundError:
        print(f"{rel:52} FAIL (missing in dist)")
        fails += 1
        continue
    base = read(BASE, rel)
    if canonical(base) != canonical(dist):
        problems.append(f"canonical {canonical(base)} != {canonical(dist)}")
    if robots(base) != robots(dist):
        problems.append(f"robots {robots(base)} != {robots(dist)}")
    bt, bbad = ld_types(base)
    dt, dbad = ld_types(dist)
    if bbad or dbad:
        problems.append(f"unparseable JSON-LD (base {bbad}, dist {dbad})")
    if not bt.issubset(dt):
        problems.append(f"missing LD types {sorted(bt - dt)}")
    if 'id="faq"' in base and 'id="faq"' not in dist:
        problems.append("FAQ section missing")
    if 'id="related"' in base and 'id="related"' not in dist:
        problems.append("Related section missing")
    if '<!-- <div class="topbar">' not in dist:
        problems.append("commented topbar missing")
    if "this is not the official Eldeco Group website" not in dist:
        problems.append("footer disclaimer missing")
    if problems:
        fails += 1
        print(f"{rel:52} FAIL: {'; '.join(problems)}")
    else:
        print(f"{rel:52} PASS")

# sitemap URL set
def sitemap_urls(root):
    sm = read(root, "sitemap.xml")
    return set(re.findall(r"<loc>([^<]+)</loc>", sm))

bu, du = sitemap_urls(BASE), sitemap_urls(DIST)
if bu == du:
    print(f"{'sitemap.xml URL set (28)':52} PASS")
else:
    fails += 1
    print(f"{'sitemap.xml URL set':52} FAIL: only-base={sorted(bu-du)} only-dist={sorted(du-bu)}")

dist_html = []
for root, _dirs, files in os.walk(DIST):
    for f in files:
        if f.endswith(".html"):
            dist_html.append(os.path.relpath(os.path.join(root, f), DIST))
if sorted(dist_html) == sorted(FILES):
    print(f"{'dist HTML file set (29)':52} PASS")
else:
    fails += 1
    print(f"{'dist HTML file set':52} FAIL: {sorted(dist_html)}")

print(f"\n{'ALL PASS' if fails == 0 else f'{fails} FAILURES'}")
sys.exit(1 if fails else 0)
