import React from "react";
import { PROJECTS } from "./data/projects.js";
import { CONTENT } from "./data/content.js";
import { DOMAIN } from "./config.js";
import HomePage from "./pages/HomePage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import AreaPage from "./pages/AreaPage.jsx";
import { AboutPage, ContactPage, NotFoundPage } from "./pages/SimplePages.jsx";
import {
  areaPageName,
  faqLd,
  ldBreadcrumb,
  projectBreadcrumbItems,
  projectDesc,
  projectListingLd,
  projectTitle,
} from "./lib/site.js";

const bySlug = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]));

function itemListLd(area) {
  const projects = PROJECTS.filter((p) => p.area === area.area);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: area.h1,
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${DOMAIN}/projects/${p.slug}.html`,
    })),
  };
}

export function getRoute(rawPath) {
  let path = rawPath || "/";
  if (path === "/index.html") path = "/";
  if (path === "/") {
    return {
      path, file: "index.html", bodyClass: "",
      head: {
        title: CONTENT.home.title, desc: CONTENT.home.desc, path: "/",
        ogImage: CONTENT.home.ogImage,
        lds: [CONTENT.home.graph, faqLd(CONTENT.home.faqs)],
      },
      element: <HomePage />,
    };
  }
  const projMatch = path.match(/^\/projects\/([a-z0-9-]+)\.html$/);
  if (projMatch && bySlug[projMatch[1]]) {
    const p = bySlug[projMatch[1]];
    const desc = projectDesc(p);
    return {
      path, file: `projects/${p.slug}.html`, bodyClass: "proj",
      head: {
        title: projectTitle(p), desc, path,
        ogImage: DOMAIN + p.images.hero, projectFonts: true,
        lds: [ldBreadcrumb(projectBreadcrumbItems(p)), projectListingLd(p, desc), faqLd(p.faqs)],
      },
      element: <ProjectPage p={p} />,
    };
  }
  const areaMatch = path.match(/^\/areas\/([a-z0-9-]+)\.html$/);
  if (areaMatch) {
    const area = CONTENT.areas.find((a) => a.slug === areaMatch[1]);
    if (area) {
      return {
        path, file: `areas/${area.slug}.html`, bodyClass: "",
        head: {
          title: area.title, desc: area.desc, path, ogImage: area.ogImage,
          lds: [ldBreadcrumb([["Home", "/"], [area.h1, path]]), itemListLd(area)],
        },
        element: <AreaPage area={area} />,
      };
    }
  }
  if (path === "/about.html") {
    return {
      path, file: "about.html", bodyClass: "",
      head: {
        title: CONTENT.about.title, desc: CONTENT.about.desc, path,
        ogImage: CONTENT.about.ogImage,
        lds: [ldBreadcrumb([["Home", "/"], ["About Eldeco Group", path]])],
      },
      element: <AboutPage />,
    };
  }
  if (path === "/contact.html") {
    return {
      path, file: "contact.html", bodyClass: "",
      head: {
        title: CONTENT.contact.title, desc: CONTENT.contact.desc, path,
        ogImage: CONTENT.contact.ogImage,
        lds: [ldBreadcrumb([["Home", "/"], ["Contact Us", path]])],
      },
      element: <ContactPage />,
    };
  }
  // 404.html and any unknown path
  return {
    path: "/404.html", file: "404.html", bodyClass: "",
    head: {
      title: CONTENT.notFound.title, desc: CONTENT.notFound.desc, path: "/404.html",
      ogImage: CONTENT.notFound.ogImage, robots: "noindex, follow",
    },
    element: <NotFoundPage />,
  };
}

export function allRoutes() {
  const paths = [
    "/",
    ...CONTENT.areas.map((a) => `/areas/${a.slug}.html`),
    "/about.html",
    "/contact.html",
    ...PROJECTS.map((p) => `/projects/${p.slug}.html`),
    "/404.html",
  ];
  return paths.map((p) => getRoute(p));
}

export { areaPageName };
